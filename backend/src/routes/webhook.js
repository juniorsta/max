import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateWebhookSecret } from '../middleware/webhook.js';
import { processIncomingWhatsApp } from '../services/appointments.js';
import { sendTextMessage } from '../services/evolution.js';

const router = express.Router();
const prisma = new PrismaClient();

// Webhook WhatsApp (Evolution API)
router.post('/whatsapp', validateWebhookSecret, async (req, res) => {
  try {
    const { instance, data } = req.body;
    const remoteJid = data?.key?.remoteJid;
    const fromMe = data?.key?.fromMe;
    const messageText = data?.message?.conversation || '';

    if (!remoteJid) return res.status(400).json({ error: 'Payload inválido' });

    const telefone = remoteJid.replace('@s.whatsapp.net', '').replace(/\D/g, '');
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) return res.status(400).json({ error: 'Tenant não identificado' });

    // Upsert lead
    let lead = await prisma.lead.findFirst({ where: { telefone, empresaId: tenantId } });
    if (!lead) {
      lead = await prisma.lead.create({
        data: { telefone, empresaId: tenantId, etapa: 'novo' },
      });
    }

    // Save message
    await prisma.conversa.create({
      data: {
        leadId: lead.id,
        direction: fromMe ? 'outgoing' : 'incoming',
        mensagem: messageText,
      },
    });

    // Process incoming message with IA
    if (!fromMe && messageText) {
      try {
        const { classification, response, nextStage } = await processIncomingWhatsApp(
          tenantId,
          lead.id,
          messageText
        );

        // Send auto-response if classification confidence is high enough
        if (classification.confidence && classification.confidence > 0.7) {
          await sendTextMessage({
            instance,
            number: telefone,
            text: response,
          });

          // Save outgoing response
          await prisma.conversa.create({
            data: {
              leadId: lead.id,
              direction: 'outgoing',
              mensagem: response,
            },
          });
        }
      } catch (e) {
        console.error('Erro ao processar IA no webhook:', e);
        // Don't fail webhook if IA fails
      }
    }

    res.json({ received: true, leadId: lead.id });
  } catch (e) {
    console.error('Webhook error:', e);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

export default router;
