import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Dashboard metrics
router.get('/metrics', async (req, res) => {
  try {
    const empresaId = req.tenant.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const [
      totalLeads,
      leadsThisMonth,
      leadsThisWeek,
      leadsByEtapa,
      agendamentosPendentes,
      agendamentosHoje,
      conversasHoje,
    ] = await Promise.all([
      prisma.lead.count({ where: { empresaId } }),
      prisma.lead.count({ where: { empresaId, createdAt: { gte: startOfMonth } } }),
      prisma.lead.count({ where: { empresaId, createdAt: { gte: startOfWeek } } }),
      prisma.lead.groupBy({ by: ['etapa'], where: { empresaId }, _count: { id: true } }),
      prisma.agendamento.count({ where: { empresaId, status: 'pendente' } }),
      prisma.agendamento.count({
        where: {
          empresaId,
          status: 'pendente',
          data: { gte: new Date(now.setHours(0,0,0,0)), lt: new Date(now.setHours(23,59,59,999)) },
        },
      }),
      prisma.conversa.count({
        where: {
          lead: { empresaId },
          timestamp: { gte: new Date(now.setHours(0,0,0,0)) },
        },
      }),
    ]);

    res.json({
      leads: { total: totalLeads, mes: leadsThisMonth, semana: leadsThisWeek, porEtapa: leadsByEtapa.map(s => ({ etapa: s.etapa, count: s._count.id })) },
      agendamentos: { pendentes: agendamentosPendentes, hoje: agendamentosHoje },
      conversas: { hoje: conversasHoje },
    });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar métricas' });
  }
});

// Recent activity
router.get('/activity', async (req, res) => {
  try {
    const empresaId = req.tenant.id;
    const [leads, agendamentos, conversas] = await Promise.all([
      prisma.lead.findMany({ where: { empresaId }, orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, nome: true, telefone: true, etapa: true, createdAt: true } }),
      prisma.agendamento.findMany({ where: { empresaId }, orderBy: { createdAt: 'desc' }, take: 5, include: { lead: { select: { nome: true } } } }),
      prisma.conversa.findMany({ where: { lead: { empresaId } }, orderBy: { timestamp: 'desc' }, take: 5, include: { lead: { select: { nome: true } } } }),
    ]);
    res.json({ leads, agendamentos, conversas });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar atividade' });
  }
});

export default router;