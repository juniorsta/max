import { PrismaClient } from '@prisma/client';
import { sendTextMessage } from '../services/evolution.js';
import { classifyLeadIntent, suggestNextStage } from '../services/freellm.js';

const prisma = new PrismaClient();

interface AppointmentData {
  leadId: string;
  empresaId: string;
  data: Date;
  status: string;
  observacoes?: string;
}

export async function createAppointment(data: AppointmentData) {
  const appointment = await prisma.agendamento.create({
    data: {
      leadId: data.leadId,
      empresaId: data.empresaId,
      data: data.data,
      status: data.status || 'pendente',
      observacoes: data.observacoes,
    },
    include: { lead: true },
  });

  // Send WhatsApp confirmation
  try {
    await sendTextMessage({
      instance: `empresa_${data.empresaId}`,
      number: appointment.lead.telefone,
      text: `✅ Agendamento confirmado!\n📅 Data: ${appointment.data.toLocaleString('pt-BR')}\n📍 Local: Estética Automotiva Kera\n\nResponda CONFIRMAR para confirmar ou CANCELAR para cancelar.`,
    });
  } catch (e) {
    console.error('Erro ao enviar WhatsApp de agendamento:', e);
  }

  return appointment;
}

export async function getAppointments(empresaId: string, filters?: { status?: string; dataInicio?: Date; dataFim?: Date }) {
  const where: any = { empresaId };
  if (filters?.status) where.status = filters.status;
  if (filters?.dataInicio || filters?.dataFim) {
    where.data = {};
    if (filters.dataInicio) where.data.gte = filters.dataInicio;
    if (filters.dataFim) where.data.lte = filters.dataFim;
  }

  return prisma.agendamento.findMany({
    where,
    include: { lead: true },
    orderBy: { data: 'asc' },
  });
}

export async function getAppointmentById(id: string) {
  return prisma.agendamento.findUnique({
    where: { id },
    include: { lead: true, empresa: true },
  });
}

export async function updateAppointment(id: string, data: Partial<AppointmentData>) {
  const appointment = await prisma.agendamento.update({
    where: { id },
    data,
    include: { lead: true },
  });

  if (data.status && data.status !== 'pendente') {
    try {
      await sendTextMessage({
        instance: `empresa_${appointment.empresaId}`,
        number: appointment.lead.telefone,
        text: `📅 Seu agendamento foi ${data.status === 'confirmado' ? 'confirmado' : 'cancelado'}!\n📅 ${appointment.data.toLocaleString('pt-BR')}`,
      });
    } catch (e) {
      console.error('Erro ao enviar WhatsApp de atualização:', e);
    }
  }

  return appointment;
}

export async function deleteAppointment(id: string) {
  return prisma.agendamento.delete({ where: { id } });
}

export async function sendReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const appointments = await prisma.agendamento.findMany({
    where: {
      status: 'confirmado',
      data: { gte: tomorrow, lt: dayAfter },
    },
    include: { lead: true },
  });

  for (const apt of appointments) {
    try {
      await sendTextMessage({
        instance: `empresa_${apt.empresaId}`,
        number: apt.lead.telefone,
        text: `⏰ Lembrete: seu agendamento é amanhã às ${apt.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}\n📍 Estética Automotiva Kera`,
      });
    } catch (e) {
      console.error('Erro ao enviar lembrete:', e);
    }
  }

  return appointments.length;
}

export async function processIncomingWhatsApp(empresaId: string, leadId: string, message: string) {
  // Classify intent
  const classification = await classifyLeadIntent({
    message,
    leadData: { empresaId },
  });

  // Suggest next stage
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (lead) {
    const nextStage = await suggestNextStage(lead.etapa, message);
    if (nextStage !== lead.etapa) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { etapa: nextStage },
      });
    }
  }

  // Generate auto response
  const response = await generateAutoResponse(message, `Lead: ${lead?.nome || 'Não informado'}, Etapa: ${lead?.etapa || 'novo'}`);

  return { classification, response, nextStage: lead?.etapa };
}