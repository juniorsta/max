const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth.js');
const prisma = new PrismaClient();

const router = express.Router();

const requireSuperadmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

async function getConversasPorDia() {
  const result = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    const count = await prisma.conversa.count({
      where: { timestamp: { gte: start, lte: end } }
    });
    result.push({ date: start.toISOString().split('T')[0], count });
  }
  return result;
}

async function getCrescimentoClientes() {
  const result = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const count = await prisma.empresa.count({
      where: { createdAt: { gte: start, lte: end } }
    });
    result.push({ month: start.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }), count });
  }
  return result;
}

async function getNovosLeadsPorDia() {
  const result = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    const count = await prisma.lead.count({
      where: { createdAt: { gte: start, lte: end } }
    });
    result.push({ date: start.toISOString().split('T')[0], count });
  }
  return result;
}

async function getAgendamentosPorSemana() {
  const result = [];
  for (let i = 11; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - (i * 7 + 6));
    const end = new Date();
    end.setDate(end.getDate() - (i * 7));
    const count = await prisma.agendamento.count({
      where: { data: { gte: start, lte: end } }
    });
    result.push({ week: `Semana ${12 - i}`, count });
  }
  return result;
}

async function getErrosSistema() {
  try {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const hoje = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM "Conversa" 
      WHERE "timestamp" >= ${todayStart} 
      AND "direction" = 'incoming'
      AND "mensagem" ILIKE '%erro%'
    `;
    return Number(hoje[0]?.count || 0);
  } catch {
    return 0;
  }
}

router.get('/dashboard', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const [
      empresasAtivas,
      empresasBloqueadas,
      empresasTeste,
      empresasCanceladas,
      usuariosTotais,
      leadsHoje,
      conversasHoje,
      mensagensEnviadasHoje,
      mensagensRecebidasHoje,
      agendamentosHoje,
      totalLeads,
      totalConversas,
      totalMensagensEnviadas,
      totalMensagensRecebidas,
      totalAgendamentos,
      conversasPorDia,
      crescimentoClientes,
      novosLeadsPorDia,
      agendamentosPorSemana,
      errosHoje
    ] = await Promise.all([
      prisma.empresa.count({ where: { status: 'active' } }),
      prisma.empresa.count({ where: { status: 'blocked' } }),
      prisma.empresa.count({ where: { status: 'trial' } }),
      prisma.empresa.count({ where: { status: 'cancelled' } }),
      prisma.usuario.count(),
      prisma.lead.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
      prisma.conversa.count({ where: { timestamp: { gte: todayStart, lte: todayEnd } } }),
      prisma.conversa.count({ where: { direction: 'outgoing', timestamp: { gte: todayStart, lte: todayEnd } } }),
      prisma.conversa.count({ where: { direction: 'incoming', timestamp: { gte: todayStart, lte: todayEnd } } }),
      prisma.agendamento.count({ where: { data: { gte: todayStart, lte: todayEnd } } }),
      prisma.lead.count(),
      prisma.conversa.count(),
      prisma.conversa.count({ where: { direction: 'outgoing' } }),
      prisma.conversa.count({ where: { direction: 'incoming' } }),
      prisma.agendamento.count(),
      getConversasPorDia(),
      getCrescimentoClientes(),
      getNovosLeadsPorDia(),
      getAgendamentosPorSemana(),
      getErrosSistema()
    ]);

    const totalEmpresas = empresasAtivas + empresasBloqueadas + empresasTeste + empresasCanceladas;
    const receitaMensal = empresasAtivas * 497;
    const churn = totalEmpresas > 0 ? parseFloat(((empresasCanceladas / totalEmpresas) * 100).toFixed(1)) : 0;
    const usoIA = totalMensagensEnviadas;
    const custosIA = parseFloat((usoIA * 0.0001).toFixed(2));

    res.json({
      kpis: {
        empresasAtivas,
        empresasBloqueadas,
        empresasTeste,
        empresasCanceladas,
        usuariosTotais,
        leadsHoje,
        conversasHoje,
        mensagensEnviadas: mensagensEnviadasHoje,
        mensagensRecebidas: mensagensRecebidasHoje,
        agendamentosHoje,
        totalLeads,
        totalConversas,
        totalMensagensEnviadas,
        totalMensagensRecebidas,
        totalAgendamentos,
        receitaMensal,
        churn,
        usoIA,
        custosIA
      },
      graficos: {
        conversasPorDia,
        crescimentoClientes,
        novosLeadsPorDia,
        agendamentosPorSemana,
        errosSistema: errosHoje
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao buscar dashboard' });
  }
});

module.exports = router;