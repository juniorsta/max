const express = require('express');
const { PrismaClient } = require('@prisma/client');
import { z } from 'zod';

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const companySchema = z.object({
  nome: z.string().min(1),
  plano: z.string().optional(),
});

router.post('/', async (req, res) => {
  try {
    const data = companySchema.parse(req.body);
    const empresa = await prisma.empresa.create({ data });
    res.status(201).json(empresa);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const empresas = await prisma.empresa.findMany();
  res.json(empresas);
});

router.get('/:id', async (req, res) => {
  const empresa = await prisma.empresa.findUnique({ where: { id: req.params.id } });
  if (!empresa) return res.status(404).json({ error: 'Not found' });
  res.json(empresa);
});

router.patch('/:id', async (req, res) => {
  const empresa = await prisma.empresa.update({ where: { id: req.params.id }, data: req.body });
  res.json(empresa);
});

router.delete('/:id', async (req, res) => {
  await prisma.empresa.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

module.exports = router;
