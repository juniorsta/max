'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/AppLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../lib/api';

interface AIConfig {
  enabled: boolean;
  autoResponse: boolean;
  confidenceThreshold: number;
  systemPrompt: string;
  model: string;
  temperature: number;
}

interface TestResult {
  classification?: { intent: string; confidence: number; suggestedAction: string; response: string };
  response?: string;
  suggestedStage?: string;
}

export default function IAPage() {
  const [config, setConfig] = useState<AIConfig>({
    enabled: true,
    autoResponse: true,
    confidenceThreshold: 0.7,
    systemPrompt: 'Você é um assistente virtual da Kera - estética automotiva premium. Responda de forma profissional, amigável e breve (máx 160 caracteres para WhatsApp). Se não souber responder, diga que encaminhará para um especialista.',
    model: 'gpt-4o-mini',
    temperature: 0.5,
  });
  const [loading, setLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testLeadId, setTestLeadId] = useState('');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [leads, setLeads] = useState<{ id: string; nome: string | null; telefone: string }[]>([]);

  const fetchConfig = async () => {
    // In a real app, this would come from an API endpoint
    // For now, using localStorage as fallback
    const saved = localStorage.getItem('ia-config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {}
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await api.get<{ id: string; nome: string | null; telefone: string }[]>(`/api/v1/leads?perPage=100`);
      setLeads(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchConfig(); fetchLeads(); }, []);

  const handleSave = () => {
    localStorage.setItem('ia-config', JSON.stringify(config));
    alert('Configurações salvas!');
  };

  const handleTestClassify = async () => {
    if (!testMessage.trim()) return alert('Digite uma mensagem para testar');
    setLoading(true);
    try {
      const res = await api.post('/api/v1/ia/test-classify', {
        message: testMessage,
        leadId: testLeadId || undefined,
      });
      setTestResult({ classification: res as any });
    } catch (e) {
      alert('Erro ao testar classificação');
    } finally {
      setLoading(false);
    }
  };

  const handleTestResponse = async () => {
    if (!testMessage.trim()) return alert('Digite uma mensagem para testar');
    setLoading(true);
    try {
      const res = await api.post('/api/v1/ia/test-response', {
        message: testMessage,
        leadId: testLeadId || undefined,
      });
      setTestResult({ response: (res as any).response });
    } catch (e) {
      alert('Erro ao testar resposta');
    } finally {
      setLoading(false);
    }
  };

  const handleTestStage = async () => {
    if (!testMessage.trim() || !testLeadId) return alert('Digite uma mensagem e selecione um lead');
    setLoading(true);
    try {
      const res = await api.post('/api/v1/ia/test-suggest-stage', {
        message: testMessage,
        leadId: testLeadId,
      });
      setTestResult({ suggestedStage: (res as any).suggestedStage });
    } catch (e) {
      alert('Erro ao testar sugestão de etapa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Configuração IA</h1>
            <p className="text-gray-400">Configure o assistente inteligente para WhatsApp</p>
          </div>
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Configurações Gerais</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => setConfig(c => ({ ...c, enabled: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-white">IA Habilitada</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.autoResponse}
                  onChange={(e) => setConfig(c => ({ ...c, autoResponse: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-white">Resposta Automática</span>
              </label>
              <Input
                label="Limite de Confiança (0-1)"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={config.confidenceThreshold}
                onChange={(e) => setConfig(c => ({ ...c, confidenceThreshold: parseFloat(e.target.value) }))}
              />
              <Input
                label="Modelo"
                type="select"
                value={config.model}
                onChange={(e) => setConfig(c => ({ ...c, model: e.target.value }))}
              >
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              </Input>
              <Input
                label="Temperatura (0-1)"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={config.temperature}
                onChange={(e) => setConfig(c => ({ ...c, temperature: parseFloat(e.target.value) }))}
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Prompt do Sistema</h3>
            <Input
              label="System Prompt"
              type="textarea"
              value={config.systemPrompt}
              onChange={(e) => setConfig(c => ({ ...c, systemPrompt: e.target.value }))}
              className="min-h-[150px] font-mono text-sm"
              placeholder="Instruções para a IA..."
            />
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Testar IA</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                label="Lead para teste (opcional)"
                type="select"
                value={testLeadId}
                onChange={(e) => setTestLeadId(e.target.value)}
              >
                <option value="">Sem lead (teste genérico)</option>
                {leads.map(l => (
                  <option key={l.id} value={l.id}>{l.nome || 'Sem nome'} - {l.telefone}</option>
                ))}
              </Input>
            </div>
            <Input
              label="Mensagem de teste"
              type="textarea"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Ex: Quero agendar um polimento para meu Civic 2022"
              className="min-h-[80px]"
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleTestClassify} disabled={loading || !testMessage.trim()}>
                {loading ? 'Testando...' : 'Testar Classificação'}
              </Button>
              <Button variant="outline" onClick={handleTestResponse} disabled={loading || !testMessage.trim()}>
                Testar Resposta
              </Button>
              <Button variant="outline" onClick={handleTestStage} disabled={loading || !testMessage.trim() || !testLeadId}>
                Testar Próxima Etapa
              </Button>
            </div>

            {testResult && (
              <Card className="bg-gray-800/50">
                <h4 className="font-semibold mb-2">Resultado</h4>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </Card>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}