const FREELLM_URL = process.env.FREELLM_URL || 'https://api.freellmapi.com';
const FREELLM_API_KEY = process.env.FREELLM_API_KEY || '';

interface AIResponseParams {
  prompt: string;
  context?: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
}

interface ClassifyLeadParams {
  message: string;
  leadData?: {
    nome?: string;
    telefone?: string;
    veiculo?: string;
  };
}

interface AIResponse {
  response: string;
  intent?: string;
  confidence?: number;
  suggestedAction?: string;
}

async function freelLMRequest(endpoint: string, data: any) {
  const response = await fetch(`${FREELLM_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(FREELLM_API_KEY && { 'Authorization': `Bearer ${FREELLM_API_KEY}` }),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`FreeLLM API error: ${response.statusText}`);
  }

  return response.json();
}

export async function generateAIResponse(params: AIResponseParams): Promise<AIResponse> {
  const { prompt, context, systemPrompt, model = 'gpt-4o-mini', temperature = 0.7 } = params;

  const messages = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  
  if (context) {
    messages.push({ role: 'system', content: `Contexto do lead: ${context}` });
  }
  
  messages.push({ role: 'user', content: prompt });

  const result = await freelLMRequest('/v1/chat/completions', {
    model,
    messages,
    temperature,
    max_tokens: 500,
  });

  const content = result.choices?.[0]?.message?.content || '';
  
  // Try to parse structured response if exists
  let intent, confidence, suggestedAction;
  try {
    const parsed = JSON.parse(content);
    if (parsed.intent) intent = parsed.intent;
    if (parsed.confidence) confidence = parsed.confidence;
    if (parsed.suggestedAction) suggestedAction = parsed.suggestedAction;
    if (parsed.response) return { response: parsed.response, intent, confidence, suggestedAction };
  } catch {}

  return { response: content, intent, confidence, suggestedAction };
}

export async function classifyLeadIntent(params: ClassifyLeadParams): Promise<AIResponse> {
  const systemPrompt = `Você é um classificador de intenções para leads de estética automotiva.
Analise a mensagem do lead e retorne APENAS um JSON válido com:
{
  "intent": "agendar|orcamento|duvida|reclamacao|outro",
  "confidence": 0.0-1.0,
  "suggestedAction": "acao_sugerida",
  "response": "resposta_curta_para_o_lead"
}`;

  const context = params.leadData 
    ? `Lead: ${params.leadData.nome || 'Não informado'}, Telefone: ${params.leadData.telefone}, Veículo: ${params.leadData.veiculo || 'Não informado'}`
    : '';

  return generateAIResponse({
    prompt: `Mensagem do lead: "${params.message}"`,
    context,
    systemPrompt,
    temperature: 0.3,
  });
}

export async function generateAutoResponse(message: string, leadContext?: string): Promise<string> {
  const systemPrompt = `Você é um assistente virtual da Kera - estética automotiva premium.
Responda de forma profissional, amigável e breve (máx 160 caracteres para WhatsApp).
Se não souber responder, diga que encaminhará para um especialista.`;

  const result = await generateAIResponse({
    prompt: message,
    context: leadContext,
    systemPrompt,
    temperature: 0.5,
  });

  return result.response;
}

export async function suggestNextStage(currentStage: string, message: string): Promise<string> {
  const stages = ['novo', 'contato', 'proposta', 'agendado', 'fechado', 'perdido'];
  const currentIndex = stages.indexOf(currentStage);
  
  if (currentIndex === -1) return currentStage;
  if (currentIndex >= stages.length - 1) return currentStage;

  const systemPrompt = `Baseado na mensagem do lead e etapa atual (${currentStage}), sugira a próxima etapa.
Etapas: ${stages.join(' -> ')}
Retorne APENAS o nome da próxima etapa sugerida.`;

  const result = await generateAIResponse({
    prompt: `Mensagem: "${message}"`,
    systemPrompt,
    temperature: 0.2,
  });

  const suggested = result.response.trim().toLowerCase();
  return stages.includes(suggested) ? suggested : currentStage;
}