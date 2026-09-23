const EVOLUTION_URL = process.env.EVOLUTION_URL || 'http://kera_evolution:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '3900Mcf!32510';

async function evolutionRequest(endpoint, data) {
  const response = await fetch(EVOLUTION_URL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error('Evolution API error: ' + (error.message || response.statusText));
  }
  return response.json();
}

async function sendTextMessage(instance, number, text) {
  return evolutionRequest('/message/sendText/' + instance, {
    number,
    text,
    delay: 1000,
  });
}

async function sendMediaMessage(instance, number, mediaUrl, mediaCaption) {
  if (!mediaUrl) throw new Error('mediaUrl é obrigatório para mensagens de mídia');
  return evolutionRequest('/message/sendMedia/' + instance, {
    number,
    mediaMessage: {
      mediaUrl,
      caption: mediaCaption || '',
      mimetype: 'image/jpeg',
    },
  });
}

async function sendTemplateMessage(instance, number, templateName, variables) {
  return evolutionRequest('/message/sendTemplate/' + instance, {
    number,
    templateName,
    variables,
  });
}

async function getInstanceStatus(instance) {
  const response = await fetch(EVOLUTION_URL + '/instance/connectionState/' + instance, {
    headers: { 'apikey': EVOLUTION_API_KEY },
  });
  return response.json();
}

async function createInstance(instanceName, webhookUrl) {
  return evolutionRequest('/instance/create', {
    instanceName,
    webhookUrl,
    events: ['messages.upsert', 'messages.update', 'connection.update'],
  });
}

async function getQRCode(instance) {
  const response = await fetch(EVOLUTION_URL + '/instance/connect/' + instance, {
    headers: { 'apikey': EVOLUTION_API_KEY },
  });
  return response.json();
}

module.exports = {
  sendTextMessage,
  sendMediaMessage,
  sendTemplateMessage,
  getInstanceStatus,
  createInstance,
  getQRCode,
};
