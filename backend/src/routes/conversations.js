const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { validate } = require('../middleware/validate.js');

const router = express.Router();
const prisma = new PrismaClient();

const conversationQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(50),
  }),
  params: z.object({ leadId: z.string() }),
});

// List conversations for a lead
router.get('/:leadId', validate(conversationQuerySchema), async (req, res) => {
  try {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const { leadId } = req.params;

    const lead = await prisma.lead.findFirst({ where: { id: leadId, empresaId: req.tenant.id } });
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

    const [conversas, total] = await Promise.all([
      prisma.conversa.findMany({
        where: { leadId },
        skip,
        take: limit,
        orderBy: { timestamp: 'asc' },
      }),
      prisma.conversa.count({ where: { leadId } }),
    ]);

    res.json({
      data: conversas,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar conversas' });
  }
});

// Send message (outgoing)
router.post('/:leadId', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { mensagem } = req.body;

    const lead = await prisma.lead.findFirst({ where: { id: leadId, empresaId: req.tenant.id } });
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });

    const conversa = await prisma.conversa.create({
      data: { leadId, direction: 'outgoing', mensagem },
    });

    // TODO: enviar via Evolution API
    res.status(201).json(conversa);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

module.exports = router;