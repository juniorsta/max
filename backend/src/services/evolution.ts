import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EVOLUTION_URL = process.env.EVOLUTION_URL || 'http://kera_evolution:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '3900Mcf!32510';

interface SendMessageParams {
  instance: string;
  number: string;
  text: string;
  mediaUrl?: string;
  mediaCaption?: string;
}

interface SendTemplateParams {
  instance: string;
  number: string;
  templateName: string;
  variables: Record<string, string>;
}

async function evolutionRequest(endpoint: string, data: any) {
  const response = await fetch(`${EVOLUTION_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(`Evolution API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

export async function sendTextMessage({ instance, number, text }: SendMessageParams) {
  return evolutionRequest(`/message/sendText/${instance}`, {
    number,
    text,
    delay: 1000,
  });
}

export async function sendMediaMessage({ instance, number, mediaUrl, mediaCaption }: SendMessageParams) {
  if (!mediaUrl) throw new Error('mediaUrl é obrigatório para mensagens de mídia');
  
  return evolutionRequest(`/message/sendMedia/${instance}`, {
    number,
    mediaMessage: {
      mediaUrl,
      caption: mediaCaption || '',
      mimetype: 'image/jpeg',
    },
  });
}

export async function sendTemplateMessage({ instance, number, templateName, variables }: SendTemplateParams) {
  return evolutionRequest(`/message/sendTemplate/${instance}`, {
    number,
    templateName,
    variables,
  });
}

export async function getInstanceStatus(instance: string) {
  const response = await fetch(`${EVOLUTION_URL}/instance/connectionState/${instance}`, {
    headers: { 'apikey': EVOLUTION_API_KEY },
  });
  return response.json();
}

export async function createInstance(instanceName: string, webhookUrl: string) {
  return evolutionRequest('/instance/create', {
    instanceName,
    webhookUrl,
    events: ['messages.upsert', 'messages.update', 'connection.update'],
  });
}

export async function getQRCode(instance: string) {
  const response = await fetch(`${EVOLUTION_URL}/instance/connect/${instance}`, {
    headers: { 'apikey': EVOLUTION_API_KEY },
  });
  return response.json();
}