const express = require('express');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth.js');
const { requireTenant } = require('../middleware/tenant.js');
const { validate } = require('../middleware/validate.js');

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  sendReminders,
} from '../services/appointments.js';

const router = express.Router();
const prisma = new PrismaClient();

const createAppointmentSchema = z.object({
  body: z.object({
    leadId: z.string().uuid(),
    data: z.string().datetime(),
    status: z.enum(['pendente', 'confirmado', 'cancelado', 'concluido']).optional(),
    observacoes: z.string().optional(),
  }),
});

const updateAppointmentSchema = z.object({
  body: z.object({
    data: z.string().datetime().optional(),
    status: z.enum(['pendente', 'confirmado', 'cancelado', 'concluido']).optional(),
    observacoes: z.string().optional(),
  }),
});

const querySchema = z.object({
  query: z.object({
    status: z.enum(['pendente', 'confirmado', 'cancelado', 'concluido']).optional(),
    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),
  }),
});

router.post('/', authMiddleware, requireTenant, validate(createAppointmentSchema), async (req, res) => {
  try {
    const appointment = await createAppointment({
      leadId: req.body.leadId,
      empresaId: req.tenant.id,
      data: new Date(req.body.data),
      status: req.body.status || 'pendente',
      observacoes: req.body.observacoes,
    });
    res.status(201).json(appointment);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

router.get('/', authMiddleware, requireTenant, validate(querySchema), async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      dataInicio: req.query.dataInicio ? new Date(req.query.dataInicio) : undefined,
      dataFim: req.query.dataFim ? new Date(req.query.dataFim) : undefined,
    };
    const appointments = await getAppointments(req.tenant.id, filters);
    res.json(appointments);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao listar agendamentos' });
  }
});

router.get('/:id', authMiddleware, requireTenant, async (req, res) => {
  try {
    const appointment = await getAppointmentById(req.params.id);
    if (!appointment || appointment.empresaId !== req.tenant.id) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.json(appointment);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar agendamento' });
  }
});

router.patch('/:id', authMiddleware, requireTenant, validate(updateAppointmentSchema), async (req, res) => {
  try {
    const appointment = await getAppointmentById(req.params.id);
    if (!appointment || appointment.empresaId !== req.tenant.id) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    const updateData = {};
    if (req.body.data) updateData.data = new Date(req.body.data);
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.observacoes !== undefined) updateData.observacoes = req.body.observacoes;

    const updated = await updateAppointment(req.params.id, updateData);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
});

router.delete('/:id', authMiddleware, requireTenant, async (req, res) => {
  try {
    const appointment = await getAppointmentById(req.params.id);
    if (!appointment || appointment.empresaId !== req.tenant.id) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    await deleteAppointment(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao excluir agendamento' });
  }
});

router.post('/send-reminders', authMiddleware, requireTenant, async (req, res) => {
  try {
    const count = await sendReminders();
    res.json({ sent: count });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao enviar lembretes' });
  }
});

module.exports = router;
