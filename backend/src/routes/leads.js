const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { validate } = require('../middleware/validate.js');

const router = express.Router();
const prisma = new PrismaClient();

const leadCreateSchema = z.object({
  body: z.object({
    telefone: z.string().min(10),
    nome: z.string().optional(),
    veiculo: z.string().optional(),
    etapa: z.string().optional(),
  }),
});

const leadUpdateSchema = z.object({
  body: z.object({
    nome: z.string().optional(),
    veiculo: z.string().optional(),
    etapa: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

const leadQuerySchema = z.object({
  query: z.object({
    etapa: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
});

// List leads with filters and pagination
router.get('/', validate(leadQuerySchema), async (req, res) => {
  try {
    const { etapa, search, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const empresaId = req.tenant.id;

    const where = { empresaId };
    if (etapa) where.etapa = etapa;
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { telefone: { contains: search } },
        { veiculo: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          agendamentos: { where: { status: 'pendente' }, take: 1 },
          conversas: { take: 1, orderBy: { timestamp: 'desc' } },
        },
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      data: leads,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar leads' });
  }
});

// Get single lead with full details
router.get('/:id', async (req, res) => {
  try {
    const lead = await prisma.lead.findFirst({
      where: { id: req.params.id, empresaId: req.tenant.id },
      include: {
        agendamentos: { orderBy: { data: 'asc' } },
        conversas: { orderBy: { timestamp: 'desc' }, take: 50 },
      },
    });
    if (!lead) return res.status(404).json({ error: 'Lead não encontrado' });
    res.json(lead);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar lead' });
  }
});

// Create lead
router.post('/', validate(leadCreateSchema), async (req, res) => {
  try {
    const lead = await prisma.lead.create({
      data: { ...req.body, empresaId: req.tenant.id },
    });
    res.status(201).json(lead);
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(400).json({ error: 'Telefone já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao criar lead' });
  }
});

// Update lead
router.patch('/:id', validate(leadUpdateSchema), async (req, res) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id, empresaId: req.tenant.id },
      data: req.body,
    });
    res.json(lead);
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Lead não encontrado' });
    res.status(500).json({ error: 'Erro ao atualizar lead' });
  }
});

// Delete lead
router.delete('/:id', async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id, empresaId: req.tenant.id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ error: 'Lead não encontrado' });
    res.status(500).json({ error: 'Erro ao excluir lead' });
  }
});

// Kanban: count by etapa
router.get('/kanban/stats', async (req, res) => {
  try {
    const stats = await prisma.lead.groupBy({
      by: ['etapa'],
      where: { empresaId: req.tenant.id },
      _count: { id: true },
    });
    res.json(stats.map(s => ({ etapa: s.etapa, count: s._count.id })));
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar stats do kanban' });
  }
});

module.exports = router;