'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface Empresa {
  id: string;
  nome: string;
  plano: string;
  status: string;
  cidade: string | null;
  usuarios: { id: string; nome: string; email: string }[];
  createdAt: string;
}

export default function EmpresasPage() {
  const { user, token } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: '', adminNome: '', adminEmail: '', adminSenha: '', plano: 'basic', cidade: '' });

  useEffect(() => {
    if (!token) return;
    fetchEmpresas();
  }, [token]);

  const fetchEmpresas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEmpresas(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/companies`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ nome: '', adminNome: '', adminEmail: '', adminSenha: '', plano: 'basic', cidade: '' });
        fetchEmpresas();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/companies/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchEmpresas();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-6 text-white">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gestão de Empresas</h1>
        <Button onClick={() => setShowModal(true)}>Nova Empresa</Button>
      </div>

      {showModal && (
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Nova Empresa</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome da Empresa" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
            <Input label="Cidade" value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} />
            <Input label="Nome do Admin" value={form.adminNome} onChange={e => setForm({ ...form, adminNome: e.target.value })} required />
            <Input label="Email do Admin" type="email" value={form.adminEmail} onChange={e => setForm({ ...form, adminEmail: e.target.value })} required />
            <Input label="Senha do Admin" type="password" value={form.adminSenha} onChange={e => setForm({ ...form, adminSenha: e.target.value })} required />
            <select 
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              value={form.plano}
              onChange={e => setForm({ ...form, plano: e.target.value })}
            >
              <option value="basic">Básico</option>
              <option value="pro">Profissional</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <div className="md:col-span-2 flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit">Criar Empresa</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {empresas.map(emp => (
          <Card key={emp.id}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{emp.nome}</h3>
                <p className="text-sm text-gray-400">Plano: {emp.plano}</p>
                <p className="text-sm text-gray-400">Status: <span className={`font-medium ${emp.status === 'active' ? 'text-green-400' : emp.status === 'blocked' ? 'text-red-400' : 'text-yellow-400'}`}>{emp.status}</span></p>
                {emp.cidade && <p className="text-sm text-gray-500">Cidade: {emp.cidade}</p>}
                <p className="text-sm text-gray-500 mt-1">Criado em: {new Date(emp.createdAt).toLocaleDateString('pt-BR')}</p>
                {emp.usuarios?.[0] && (
                  <p className="text-sm text-gray-400 mt-2">Admin: {emp.usuarios[0].nome} ({emp.usuarios[0].email})</p>
                )}
              </div>
              <div className="flex gap-2">
                {emp.status !== 'active' && (
                  <Button size="sm" variant="ghost" onClick={() => changeStatus(emp.id, 'active')}>Ativar</Button>
                )}
                {emp.status !== 'blocked' && (
                  <Button size="sm" variant="danger" onClick={() => changeStatus(emp.id, 'blocked')}>Bloquear</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
