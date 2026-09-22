
'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/AppLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../lib/api';

interface Lead {
  id: string;
  telefone: string;
  nome: string | null;
  veiculo: string | null;
  etapa: string;
  createdAt: string;
}

interface LeadsResponse {
  data: Lead[];
  meta: { page: number; perPage: number; total: number; totalPages: number };
}

const ETAPAS = ['novo', 'contato', 'proposta', 'agendado', 'fechado', 'perdido'];
const ETAPA_LABELS: Record<string, string> = {
  novo: 'Novo',
  contato: 'Contato',
  proposta: 'Proposta',
  agendado: 'Agendado',
  fechado: 'Fechado',
  perdido: 'Perdido',
};
const ETAPA_COLORS: Record<string, string> = {
  novo: 'bg-blue-500',
  contato: 'bg-yellow-500',
  proposta: 'bg-purple-500',
  agendado: 'bg-green-500',
  fechado: 'bg-gray-500',
  perdido: 'bg-red-500',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState({ page: 1, perPage: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({ etapa: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({ telefone: '', nome: '', veiculo: '', etapa: 'novo' });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(meta.page),
        perPage: String(meta.perPage),
        ...(filters.etapa && { etapa: filters.etapa }),
        ...(filters.search && { search: filters.search }),
      });
      const res = await api.get<LeadsResponse>(`/api/v1/leads?${params}`);
      setLeads(res.data);
      setMeta(res.meta);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [meta.page, filters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await api.patch(`/api/v1/leads/${editingLead.id}`, formData);
      } else {
        await api.post('/api/v1/leads', formData);
      }
      setShowModal(false);
      setEditingLead(null);
      setFormData({ telefone: '', nome: '', veiculo: '', etapa: 'novo' });
      fetchLeads();
    } catch (e) {
      alert('Erro ao salvar lead');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este lead?')) return;
    try {
      await api.delete(`/api/v1/leads/${id}`);
      fetchLeads();
    } catch (e) {
      alert('Erro ao excluir');
    }
  };

  const openCreate = () => {
    setEditingLead(null);
    setFormData({ telefone: '', nome: '', veiculo: '', etapa: 'novo' });
    setShowModal(true);
  };

  const openEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({ telefone: lead.telefone, nome: lead.nome || '', veiculo: lead.veiculo || '', etapa: lead.etapa });
    setShowModal(true);
  };

  // Group leads by etapa for Kanban
  const leadsByEtapa = ETAPAS.reduce((acc, etapa) => {
    acc[etapa] = leads.filter(l => l.etapa === etapa);
    return acc;
  }, {} as Record<string, Lead[]>);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Leads</h1>
            <p className="text-gray-400">Gerencie seus leads e pipeline de vendas</p>
          </div>
          <Button onClick={openCreate}>+ Novo Lead</Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por nome, telefone ou veículo..."
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              className="flex-1"
            />
            <select
              value={filters.etapa}
              onChange={(e) => setFilters(f => ({ ...f, etapa: e.target.value }))}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todas as etapas</option>
              {ETAPAS.map(e => (
                <option key={e} value={e}>{ETAPA_LABELS[e]}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Kanban View */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {ETAPAS.map((etapa) => (
              <Card key={etapa} className="w-72 flex-1 flex flex-col" style={{ minWidth: '280px' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${ETAPA_COLORS[etapa]}`}></span>
                    {ETAPA_LABELS[etapa]}
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700">
                      {leadsByEtapa[etapa]?.length || 0}
                    </span>
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 min-h-[400px]">
                  {leadsByEtapa[etapa].map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 hover:border-purple-500/50 transition-colors cursor-pointer"
                      onClick={() => openEdit(lead)}
                    >
                      <p className="font-medium text-white truncate">{lead.nome || 'Sem nome'}</p>
                      <p className="text-sm text-gray-400>{lead.telefone}</p>
                      {lead.veiculo && <p className="text-xs text-gray-500 mt-1>{lead.veiculo}</p>}
                      <p className="text-xs text-gray-500 mt-1>
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                {leadsByEtapa[etapa].length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm>
                    Arraste um lead para cá
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Table View (mobile fallback) */}
        <div className="lg:hidden">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800>
                    <th className="pb-2>Nome</th>
                    <th className="pb-2>Telefone</th>
                    <th className="pb-2>Etapa</th>
                    <th className="pb-2>Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-800/50>
                      <td className="py-2 font-medium>{lead.nome || 'Sem nome'}</td>
                      <td className="py-2 text-gray-400>{lead.telefone}</td>
                      <td className="py-2>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${ETAPA_COLORS[lead.etapa]}`}>
                          {ETAPA_LABELS[lead.etapa]}
                        </span>
                      </td>
                      <td className="py-2>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(lead); }}>
                            ✏️
                          </Button>
                          <Button variant="ghost" size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}>
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4>
                <span className="text-sm text-gray-400>
                  Página {meta.page} de {meta.totalPages} — {meta.total} leads
                </span>
                <div className="flex gap-2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMeta(m => ({ ...m, page: m.page - 1 }))}
                    disabled={meta.page === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMeta(m => ({ ...m, page: m.page + 1 }))}
                    disabled={meta.page === meta.totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50>
            <Card className="w-full max-w-md m-4>
              <h3 className="text-lg font-semibold mb-4>
                {editingLead ? 'Editar Lead' : 'Novo Lead'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4>
                <Input
                  label="Telefone *"
                  value={formData.telefone}
                  onChange={(e) => setFormData(f => ({ ...f, telefone: e.target.value }))}
                  required
                  placeholder="(11) 99999-9999"
                />
                <Input
                  label="Nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(f => ({ ...f, nome: e.target.value }))}
                  placeholder="João Silva"
                />
                <Input
                  label="Veículo"
                  value={formData.veiculo}
                  onChange={(e) => setFormData(f => ({ ...f, veiculo: e.target.value }))}
                  placeholder="Honda Civic 2022"
                />
                <Input
                  label="Etapa"
                  type="select"
                  value={formData.etapa}
                  onChange={(e) => setFormData(f => ({ ...f, etapa: e.target.value }))}
                  className="relative"
                >
                  {ETAPAS.map(e => (
                    <option key={e} value={e}>{ETAPA_LABELS[e]}</option>
                  ))}
                </Input>

                <div className="flex gap-2 pt-2>
                  <Button variant="outline" type="button" onClick={() => { setShowModal(false); setEditingLead(null); }}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1>
                    {editingLead ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
