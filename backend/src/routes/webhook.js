import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateWebhookSecret } from '../middleware/webhook.js';

const router = express.Router();
const prisma = new PrismaClient();

// Webhook WhatsApp (Evolution API)
router.post('/whatsapp', validateWebhookSecret, async (req, res) => {
  try {
    const { instance, data } = req.body;
    // data expected: { key: { remoteJid, fromMe }, message: { conversation } }
    const remoteJid = data?.key?.remoteJid; // ex: 5511999999999@s.whatsapp.net
    const fromMe = data?.key?.fromMe;
    const messageText = data?.message?.conversation || '';

    if (!remoteJid) return res.status(400).json({ error: 'Payload inválido' });

    const telefone = remoteJid.replace('@s.whatsapp.net', '').replace(/\D/g, '');

    // Find tenant by Evolution instance (simplified: assume instance maps to empresa)
    // For now, we'll require x-tenant-id header or derive from instance
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

    // TODO: trigger IA response if incoming

    res.json({ received: true, leadId: lead.id });
  } catch (e) {
    console.error('Webhook error:', e);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

export default router;