'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '../../components/AppLayout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { api } from '../../lib/api';

interface Appointment {
  id: string;
  leadId: string;
  lead: { nome: string | null; telefone: string };
  data: string;
  status: string;
  observacoes: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído',
};
const STATUS_COLORS: Record<string, string> = {
  pendente: 'bg-yellow-500',
  confirmado: 'bg-green-500',
  cancelado: 'bg-red-500',
  concluido: 'bg-gray-500',
};

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', dataInicio: '', dataFim: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    leadId: '',
    data: '',
    status: 'pendente',
    observacoes: '',
  });
  const [leads, setLeads] = useState<{ id: string; nome: string | null; telefone: string }[]>([]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(filters.status && { status: filters.status }),
        ...(filters.dataInicio && { dataInicio: filters.dataInicio }),
        ...(filters.dataFim && { dataFim: filters.dataFim }),
      });
      const res = await api.get<Appointment[]>(`/api/v1/appointments?${params}`);
      setAppointments(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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

  useEffect(() => { fetchAppointments(); fetchLeads(); }, [filters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await api.patch(`/api/v1/appointments/${editingAppointment.id}`, formData);
      } else {
        await api.post('/api/v1/appointments', formData);
      }
      setShowModal(false);
      setEditingAppointment(null);
      setFormData({ leadId: '', data: '', status: 'pendente', observacoes: '' });
      fetchAppointments();
    } catch (e) {
      alert('Erro ao salvar agendamento');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este agendamento?')) return;
    try {
      await api.delete(`/api/v1/appointments/${id}`);
      fetchAppointments();
    } catch (e) {
      alert('Erro ao excluir');
    }
  };

  const openCreate = () => {
    setEditingAppointment(null);
    setFormData({ leadId: '', data: '', status: 'pendente', observacoes: '' });
    setShowModal(true);
  };

  const openEdit = (apt: Appointment) => {
    setEditingAppointment(apt);
    setFormData({
      leadId: apt.leadId,
      data: apt.data.slice(0, 16),
      status: apt.status,
      observacoes: apt.observacoes || '',
    });
    setShowModal(true);
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('pt-BR');

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Agendamentos</h1>
            <p className="text-gray-400">Gerencie agendamentos e lembretes</p>
          </div>
          <Button onClick={openCreate}>+ Novo Agendamento</Button>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="date"
              value={filters.dataInicio}
              onChange={(e) => setFilters(f => ({ ...f, dataInicio: e.target.value }))}
              placeholder="Data início"
            />
            <Input
              type="date"
              value={filters.dataFim}
              onChange={(e) => setFilters(f => ({ ...f, dataFim: e.target.value }))}
              placeholder="Data fim"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos os status</option>
              {Object.keys(STATUS_LABELS).map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-800">
                  <th className="pb-2">Lead</th>
                  <th className="pb-2">Data/Hora</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Observações</th>
                  <th className="pb-2">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-800/50">
                    <td className="py-2 font-medium">{apt.lead.nome || 'Sem nome'}<br/><span className="text-gray-400 text-xs">{apt.lead.telefone}</span></td>
                    <td className="py-2 text-gray-300">{formatDate(apt.data)}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[apt.status]}`}>
                        {STATUS_LABELS[apt.status]}
                      </span>
                    </td>
                    <td className="py-2 text-gray-400 truncate max-w-xs">{apt.observacoes || '-'}</td>
                    <td className="py-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(apt)}>✏️</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(apt.id)}>🗑️</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {appointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">Nenhum agendamento encontrado</div>
          )}
        </Card>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md m-4">
              <h3 className="text-lg font-semibold mb-4">{editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Lead *"
                  type="select"
                  value={formData.leadId}
                  onChange={(e) => setFormData(f => ({ ...f, leadId: e.target.value }))}
                  required
                >
                  <option value="">Selecione um lead</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.nome || 'Sem nome'} - {l.telefone}</option>
                  ))}
                </Input>
                <Input
                  label="Data/Hora *"
                  type="datetime-local"
                  value={formData.data}
                  onChange={(e) => setFormData(f => ({ ...f, data: e.target.value }))}
                  required
                />
                <Input
                  label="Status"
                  type="select"
                  value={formData.status}
                  onChange={(e) => setFormData(f => ({ ...f, status: e.target.value }))}
                >
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </Input>
                <Input
                  label="Observações"
                  type="textarea"
                  value={formData.observacoes}
                  onChange={(e) => setFormData(f => ({ ...f, observacoes: e.target.value }))}
                  placeholder="Observações..."
                />
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" type="button" onClick={() => { setShowModal(false); setEditingAppointment(null); }}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingAppointment ? 'Salvar' : 'Criar'}
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