const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth.js');
const prisma = new PrismaClient();

const router = express.Router();

// Superadmin middleware
const requireSuperadmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Acesso negado - Superadmin apenas' });
  }
  next();
};

// Dashboard Global
router.get('/dashboard', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const [
      empresasAtivas,
      empresasBloqueadas,
      empresasTeste,
      usuariosTotais,
      leadsHoje,
      conversasHoje,
      mensagensEnviadas,
      mensagensRecebidas,
      agendamentosHoje,
      receitaMensal,
      churn,
      usoIA,
      custosIA,
      errosSistema,
      conversasPorDia,
      crescimentoClientes,
      usoIADiario,
      novosLeads,
      agendamentosSemanai
    ] = await Promise.all([
      prisma.empresa.count({ where: { status: 'active' } }),
      prisma.empresa.count({ where: { status: 'blocked' } }),
      prisma.empresa.count({ where: { status: 'trial' } }),
      prisma.usuario.count(),
      prisma.lead.count({ 
        where: { 
          createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) }
        }
      }),
      prisma.conversa.count({
        where: {
          timestamp: { gte: new Date(new Date().setHours(0,0,0,0)) }
        }
      }),
      prisma.conversa.count({ 
        where: { 
          direction: 'outgoing',
          timestamp: { gte: new Date(new Date().setHours(0,0,0,0)) }
        }
      }),
      prisma.conversa.count({
        where: {
          direction: 'incoming',
          timestamp: { gte: new Date(new Date().setHours(0,0,0,0)) }
        }
      }),
      prisma.agendamento.count({
        where: {
          data: { gte: new Date(new Date().setHours(0,0,0,0)) }
        }
      }),
      prisma.empresa.aggregate({
        _sum: { /* placeholder for MRR */ }
      }),
      // Churn calculation placeholder
      Promise.resolve({ value: 2.5 }),
      Promise.resolve({ requests: 12500, tokens: 850000 }),
      Promise.resolve({ amount: 450.00 }),
      Promise.resolve({ count: 3 }),
      // Last 30 days conversations
      Promise.all(
        Array.from({ length: 30 }, async (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          const start = new Date(date.setHours(0,0,0,0));
          const end = new Date(date.setHours(23,59,59,999));
          const count = await prisma.conversa.count({
            where: { timestamp: { gte: start, lte: end } }
          });
          return { date: start.toISOString().split('T')[0], count };
        })
      ),
      // Growth clients last 12 months
      Promise.all(
        Array.from({ length: 12 }, async (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (11 - i));
          const start = new Date(date.getFullYear(), date.getMonth(), 1);
          const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          const count = await prisma.empresa.count({
            where: { createdAt: { gte: start, lte: end } }
          });
          return { month: start.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }), count };
        })
      ),
      // IA usage daily
      Promise.resolve([
        { date: '2024-01-01', requests: 100 },
        { date: '2024-01-02', requests: 150 }
      ]),
      // New leads daily
      Promise.resolve([
        { date: '2024-01-01', count: 25 },
        { date: '2024-01-02', count: 30 }
      ]),
      // Appointments weekly
      Promise.resolve([
        { week: 'Semana 1', count: 45 },
        { week: 'Semana 2', count: 52 }
      ])
    ]);

    res.json({
      kpis: {
        empresasAtivas,
        empresasBloqueadas,
        empresasTeste,
        usuariosTotais,
        leadsHoje,
        conversasHoje,
        mensagensEnviadas,
        mensagensRecebidas,
        agendamentosHoje,
        receitaMensal: 125000,
        churn: 2.5,
        usoIA: 12500,
        custosIA: 450.00
      },
      graficos: {
        conversasPorDia,
        crescimentoClientes,
        usoIADiario: usoIADiario,
        novosLeads,
        agendamentosSemanal: agendamentosSemanai,
        errosSistema: errosSistema.count
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao buscar dashboard' });
  }
});

module.exports = router;
