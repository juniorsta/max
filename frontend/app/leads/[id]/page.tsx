'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '../../../components/AppLayout';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { api } from '../../../lib/api';

interface Lead {
  id: string;
  telefone: string;
  nome: string | null;
  veiculo: string | null;
  etapa: string;
  createdAt: string;
  conversas?: any[];
  agendamentos?: any[];
}

interface Conversa {
  id: string;
  direction: string;
  mensagem: string;
  timestamp: string;
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  const [lead, setLead] = useState<Lead | null>(null);
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ nome: '', veiculo: '', etapa: '', telefone: '' });

  const ETAPAS = ['novo', 'contato', 'proposta', 'agendado', 'fechado', 'perdido'];
  const ETAPA_LABELS: Record<string, string> = {
    novo: 'Novo', contato: 'Contato', proposta: 'Proposta',
    agendado: 'Agendado', fechado: 'Fechado', perdido: 'Perdido',
  };
  const ETAPA_COLORS: Record<string, string> = {
    novo: 'bg-blue-500', contato: 'bg-yellow-500', proposta: 'bg-purple-500',
    agendado: 'bg-green-500', fechado: 'bg-gray-500', perdido: 'bg-red-500',
  };

  const fetchLead = async () => {
    try {
      const [leadRes, convRes] = await Promise.all([
        api.get<Lead>(`/api/v1/leads/${leadId}`),
        api.get<{ data: Conversa[] }>(`/api/v1/conversations/${leadId}?perPage=100`),
      ]);
      setLead(leadRes);
      setConversas(convRes.data.reverse());
      setFormData({
        nome: leadRes.nome || '',
        veiculo: leadRes.veiculo || '',
        etapa: leadRes.etapa,
        telefone: leadRes.telefone,
      });
    } catch (e) {
      console.error(e);
      router.push('/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [leadId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/api/v1/leads/${leadId}`, formData);
      setLead(prev => prev ? { ...prev, ...formData } : null);
      setShowEditModal(false);
    } catch (e) { alert('Erro ao atualizar'); }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      await api.post(`/api/v1/conversations/${leadId}`, { mensagem: newMessage });
      setNewMessage('');
      fetchLead();
    } catch (e) { alert('Erro ao enviar'); }
    finally { setSending(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Excluir este lead permanentemente?')) return;
    try {
      await api.delete(`/api/v1/leads/${leadId}`);
      router.push('/leads');
    } catch (e) { alert('Erro ao excluir'); }
  };

  if (loading) return <AppLayout><div className="flex items-center justify-center h-64">Carregando...</div></AppLayout>;
  if (!lead) return <AppLayout><div className="text-center py-12">Lead não encontrado</div></AppLayout>;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{lead.nome || 'Sem nome'}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${ETAPA_COLORS[lead.etapa]}`}>
                {ETAPA_LABELS[lead.etapa]}
              </span>
            </div>
            <p className="text-gray-400">{lead.telefone} {lead.veiculo ? `· ${lead.veiculo}` : ''}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEditModal(true)}>Editar</Button>
            <Button variant="danger" onClick={handleDelete}>Excluir</Button>
            <Button onClick={() => router.back()}>Voltar</Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <p className="text-gray-400 text-sm">Telefone</p>
            <p className="text-lg font-medium">{lead.telefone}</p>
          </Card>
          <Card>
            <p className="text-gray-400 text-sm">Veículo</p>
            <p className="text-lg font-medium">{lead.veiculo || 'Não informado'}</p>
          </Card>
          <Card>
            <p className="text-gray-400 text-sm">Criado em</p>
            <p className="text-lg font-medium">{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</p>
          </Card>
        </div>

        {/* Conversas */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Conversas</h3>
            <span className="text-sm text-gray-400">{conversas.length} mensagens</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {conversas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhuma mensagem ainda</div>
            ) : (
              conversas.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === 'incoming' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      msg.direction === 'incoming'
                        ? 'bg-gray-800 rounded-bl-sm'
                        : 'bg-purple-600 rounded-br-sm'
                    }`}
                  >
                    <p className="text-sm">{msg.mensagem}</p>
                    <p className={`text-xs mt-1 ${msg.direction === 'incoming' ? 'text-gray-500' : 'text-purple-100'}`}>
                      {new Date(msg.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Send message */}
          <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="flex-1"
            />
            <Button type="submit" disabled={sending || !newMessage.trim()}>
              {sending ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        </Card>

        {/* Agendamentos */}
        {lead.agendamentos && lead.agendamentos.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Agendamentos</h3>
            <div className="space-y-2">
              {lead.agendamentos.map((ag: any) => (
                <div key={ag.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div>
                    <p className="font-medium">{new Date(ag.data).toLocaleString('pt-BR')}</p>
                    <p className="text-sm text-gray-400">{ag.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md m-4">
              <h3 className="text-lg font-semibold mb-4">Editar Lead</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <Input
                  label="Nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(f => ({ ...f, nome: e.target.value }))}
                />
                <Input
                  label="Veículo"
                  value={formData.veiculo}
                  onChange={(e) => setFormData(f => ({ ...f, veiculo: e.target.value }))}
                />
                <Input
                  label="Telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(f => ({ ...f, telefone: e.target.value }))}
                />
                <select
                  value={formData.etapa}
                  onChange={(e) => setFormData(f => ({ ...f, etapa: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {ETAPAS.map(e => (
                    <option key={e} value={e}>{ETAPA_LABELS[e]}</option>
                  ))}
                </select>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" type="button" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                  <Button type="submit" className="flex-1">Salvar</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}