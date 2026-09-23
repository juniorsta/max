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

module.exports = router;
