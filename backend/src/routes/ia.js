const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth.js');
const { requireTenant } = require('../middleware/tenant.js');
const { validate } = require('../middleware/validate.js');
const { classifyLeadIntent, generateAutoResponse, suggestNextStage } = require('../services/freellm.js');
const { sendTextMessage } = require('../services/evolution.js');

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const testAIResponseSchema = z.object({
  body: z.object({
    message: z.string(),
    leadId: z.string().uuid().optional(),
  }),
});

const sendMessageSchema = z.object({
  body: z.object({
    leadId: z.string().uuid(),
    message: z.string(),
  }),
});

// Test AI classification
router.post('/test-classify', authMiddleware, requireTenant, validate(testAIResponseSchema), async (req, res) => {
  try {
    let leadData;
    if (req.body.leadId) {
      const lead = await prisma.lead.findUnique({
        where: { id: req.body.leadId },
        select: { nome: true, telefone: true, veiculo: true, etapa: true },
      });
      leadData = lead || undefined;
    }

    const result = await classifyLeadIntent({
      message: req.body.message,
      leadData,
    });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Erro na classificação IA' });
  }
});

// Test auto response
router.post('/test-response', authMiddleware, requireTenant, validate(testAIResponseSchema), async (req, res) => {
  try {
    let context = '';
    if (req.body.leadId) {
      const lead = await prisma.lead.findUnique({
        where: { id: req.body.leadId },
        select: { nome: true, etapa: true },
      });
      if (lead) context = `Lead: ${lead.nome || 'Não informado'}, Etapa: ${lead.etapa || 'novo'}`;
    }

    const response = await generateAutoResponse(req.body.message, context);
    res.json({ response });
  } catch (e) {
    res.status(500).json({ error: 'Erro na geração de resposta' });
  }
});

// Test stage suggestion
router.post('/test-suggest-stage', authMiddleware, requireTenant, validate(testAIResponseSchema), async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.body.leadId },
      select: { etapa: true },
    });
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

    const nextStage = await suggestNextStage(lead.etapa, req.body.message);
    res.json({ currentStage: lead.etapa, suggestedStage: nextStage });
  } catch (e) {
    res.status(500).json({ error: 'Erro na sugestão de etapa' });
  }
});

// Send WhatsApp message manually
router.post('/send-message', authMiddleware, requireTenant, validate(sendMessageSchema), async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: req.body.leadId },
      select: { telefone: true },
    });
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

    await sendTextMessage({
      instance: `empresa_${req.tenant.id}`,
      number: lead.telefone,
      text: req.body.message,
    });

    // Save outgoing message
    await prisma.conversa.create({
      data: {
        leadId: req.body.leadId,
        direction: 'outgoing',
        mensagem: req.body.message,
      },
    });

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

module.exports = router;