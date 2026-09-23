const express = require('express');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, generateToken, generateRefreshToken } = require('../middleware/auth.js');
const { validate } = require('../middleware/validate.js');

const router = express.Router();
const prisma = new PrismaClient();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    senha: z.string().min(6),
  }),
});

const registerSchema = z.object({
  body: z.object({
    empresaNome: z.string().min(1),
    nome: z.string().min(1),
    email: z.string().email(),
    senha: z.string().min(6),
  }),
});

const createUserSchema = z.object({
  body: z.object({
    nome: z.string().min(1),
    email: z.string().email(),
    senha: z.string().min(6),
    role: z.enum(['admin', 'user', 'superadmin']).optional(),
  }),
});

// Login
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await prisma.usuario.findFirst({
      where: { email },
      include: { empresa: true },
    });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (usuario.empresa && usuario.empresa.status !== 'active') {
      return res.status(403).json({ error: 'Empresa inativa' });
    }

    const token = generateToken(usuario);
    const refreshToken = generateRefreshToken(usuario);

    res.json({
      token,
      refreshToken,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        empresa: usuario.empresa ? { id: usuario.empresa.id, nome: usuario.empresa.nome } : null,
      },
    });
  } catch (e) {
    res.status(500).json({ error: 'Erro no login' });
  }
});

// Registro inicial (superadmin cria primeira empresa)
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { empresaNome, nome, email, senha } = req.body;

    const existingUser = await prisma.usuario.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const empresa = await prisma.empresa.create({
      data: {
        nome: empresaNome,
        usuarios: {
          create: {
            nome,
            email,
            senhaHash,
            role: 'admin',
          },
        },
      },
      include: { usuarios: true },
    });

    const admin = empresa.usuarios[0];
    const token = generateToken(admin);
    const refreshToken = generateRefreshToken(admin);

    res.status(201).json({
      token,
      refreshToken,
      user: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email,
        role: admin.role,
        empresa: { id: empresa.id, nome: empresa.nome },
      },
    });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Erro desconhecido';
    res.status(500).json({ error: `Erro no registro: ${errorMessage}` });
  }
});

// Superadmin: criar empresa
router.post('/companies', authMiddleware, validate(registerSchema), async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { empresaNome, nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    const empresa = await prisma.empresa.create({
      data: {
        nome: empresaNome,
        usuarios: {
          create: { nome, email, senhaHash, role: 'admin' },
        },
      },
      include: { usuarios: true },
    });

    res.status(201).json(empresa);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao criar empresa' });
  }
});

// Superadmin: listar empresas
router.get('/companies', authMiddleware, async (req, res) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  const empresas = await prisma.empresa.findMany({ include: { usuarios: true } });
  res.json(empresas);
});

// Admin da empresa: criar usuário
router.post('/users', authMiddleware, validate(createUserSchema), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { nome, email, senha, role } = req.body;
    const existing = await prisma.usuario.findFirst({
      where: { email, empresaId: req.user.empresaId },
    });
    if (existing) {
      return res.status(400).json({ error: 'Email já existe na empresa' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, role: role || 'user', empresaId: req.user.empresaId },
    });

    res.status(201).json({ id: usuario.id, nome, email, role: usuario.role });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// Listar usuários da empresa
router.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  const usuarios = await prisma.usuario.findMany({
    where: { empresaId: req.user.empresaId },
    select: { id: true, nome: true, email: true, role: true, createdAt: true },
  });
  res.json(usuarios);
});

// GET /me - retorna usuário atual (usado pelo frontend após login)
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    id: req.user.id,
    nome: req.user.nome,
    email: req.user.email,
    role: req.user.role,
    empresa: req.user.empresa ? { id: req.user.empresa.id, nome: req.user.empresa.nome } : null,
  });
});

// Seed superadmin (admin only - remove after use)
router.post('/seed-superadmin', validate({
  body: z.object({
    nome: z.string().min(1),
    email: z.string().email(),
    senha: z.string().min(6),
  })
}), async (req, res) => {
  const { nome, email, senha } = req.body;
  const existing = await prisma.usuario.findFirst({ where: { email } });
  if (existing) return res.status(400).json({ error: 'Email já existe' });

  const senhaHash = await bcrypt.hash(senha, 10);
  const superadmin = await prisma.usuario.create({
    data: { nome, email, senhaHash, role: 'superadmin' }
  });

  res.status(201).json({ id: superadmin.id, nome, email, role: 'superadmin' });
});

module.exports = router;