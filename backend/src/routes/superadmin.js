const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth.js');
const { validate } = require('../middleware/validate.js');
const prisma = new PrismaClient();

const router = express.Router();

const requireSuperadmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

// ============================================
// EMPRESAS
// ============================================

router.get('/companies', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const [empresas, total] = await Promise.all([
      prisma.empresa.findMany({
        where,
        skip: (page - 1) * limit,
        take: Number(limit),
        include: { usuarios: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.empresa.count({ where })
    ]);
    
    res.json({
      data: empresas,
      meta: { page: Number(page), limit: Number(limit), total }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao buscar empresas' });
  }
});

router.post('/companies', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const { nome, plano = 'basic', cidade = null, cnpj = null } = req.body;
    
    const empresa = await prisma.empresa.create({
      data: {
        nome,
        plano,
        cidade,
        cnpj,
        status: 'trial',
        usuarios: {
          create: {
            nome: req.body.adminNome || 'Admin',
            email: req.body.adminEmail,
            senhaHash: await bcrypt.hash(req.body.adminSenha || '123456', 10),
            role: 'admin'
          }
        }
      },
      include: { usuarios: true }
    });
    
    res.status(201).json(empresa);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Erro ao criar empresa' });
  }
});

router.patch('/companies/:id/status', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const empresa = await prisma.empresa.update({
      where: { id },
      data: { status }
    });
    
    res.json(empresa);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

router.patch('/companies/:id', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, plano, cidade, cnpj } = req.body;
    
    const empresa = await prisma.empresa.update({
      where: { id },
      data: { nome, plano, cidade, cnpj }
    });
    
    res.json(empresa);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao atualizar empresa' });
  }
});

router.delete('/companies/:id', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.empresa.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao excluir empresa' });
  }
});

// ============================================
// USUÁRIOS
// ============================================

router.get('/users', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const { empresaId, search, role, page = 1, limit = 20 } = req.query;
    const where = {};
    
    if (empresaId) where.empresaId = empresaId;
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        skip: (page - 1) * limit,
        take: Number(limit),
        include: { empresa: { select: { id: true, nome: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.usuario.count({ where })
    ]);
    
    res.json({
      data: usuarios,
      meta: { page: Number(page), limit: Number(limit), total }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

router.patch('/users/:id', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, role } = req.body;
    
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { nome, email, role }
    });
    
    res.json(usuario);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

router.patch('/users/:id/reset-password', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const { id } = req.params;
    const novaSenha = req.body.senha || '123456';
    
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { senhaHash }
    });
    
    res.json({ ...usuario, senhaHash: undefined });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao resetar senha' });
  }
});

// ============================================
// EVOAPI (Evolution API)
// ============================================

router.get('/evolution/instances', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    // This would connect to Evolution API
    // For now return mock data
    res.json([]);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar instâncias' });
  }
});

// ============================================
// AUDIT LOGS
// ============================================

router.get('/audit-logs', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const logs = await prisma.auditLog.findMany({
      skip: (page - 1) * limit,
      take: Number(limit),
      orderBy: { timestamp: 'desc' },
      include: { usuario: { select: { id: true, nome: true, email: true } } }
    });
    
    const total = await prisma.auditLog.count();
    
    res.json({
      data: logs,
      meta: { page: Number(page), limit: Number(limit), total }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
});

// ============================================
// MONITORAMENTO
// ============================================

router.get('/monitoring', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    // Mock data for now - in production would query system metrics
    res.json({
      cpu: { usage: 45, cores: 4 },
      memory: { used: 8.5, total: 16, percent: 53 },
      disk: { used: 120, total: 500, percent: 24 },
      containers: {
        postgres: 'healthy',
        redis: 'healthy',
        evolution: 'healthy',
        backend: 'running',
        frontend: 'running'
      }
    });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar monitoramento' });
  }
});

// ============================================
// CONFIGURAÇÕES
// ============================================

router.get('/settings', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findMany();
    res.json(settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {}));
  } catch (e) {
    res.json({});
  }
});

router.patch('/settings', authMiddleware, requireSuperadmin, async (req, res) => {
  try {
    const { nomePlataforma, emailSuporte, limiteLeads, planoBasico, planoPro } = req.body;
    
    await prisma.systemSettings.deleteMany();
    await prisma.systemSettings.createMany({
      data: [
        { key: 'nome_plataforma', valor: nomePlataforma },
        { key: 'email_suporte', valor: emailSuporte },
        { key: 'limite_leads_basico', valor: String(limiteLeads || 1000) },
        { key: 'limite_leads_pro', valor: String(planoPro?.limite || 10000) }
      ]
    });
    
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao salvar configurações' });
  }
});

// ============================================
// DASHBOARD
// ============================================

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
