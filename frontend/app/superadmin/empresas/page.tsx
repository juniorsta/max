'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface Empresa {
  id: string;
  nome: string;
  razaoSocial: string;
  cnpj: string;
  plano: string;
  status: string;
  cidade: string;
  usuarios: number;
  createdAt: string;
}

export default function EmpresasPage() {
  const { user, token } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchEmpresas();
  }, [token]);

  const fetchEmpresas = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/companies?search=${search}&page=1&limit=20`, {
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

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-purple-400">Carregando...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Empresas</h1>
          <p className="text-slate-400 mt-1">Cadastre, gerencie e controle todas as empresas da plataforma</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>+ Nova Empresa</Button>
      </div>

      {showForm && (
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Formulário de cadastro de um novo tenant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome da Empresa" placeholder="Ex: AutoBike Estética" />
            <Input label="Razão Social" placeholder="Ex: AutoBike Ltda ME" />
            <Input label="CNPJ" placeholder="00.000.000/0000-00" />
            <Input label="Telefone" placeholder="(11) 99999-9999" />
            <Input label="WhatsApp" placeholder="(11) 99999-9999" />
            <Input label="E-mail" type="email" placeholder="contato@empresa.com" />
            <Input label="Cidade" placeholder="São Paulo" />
            <select className="bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2 text-white">
              <option value="">Selecione o Estado</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
            </select>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">Plano</label>
              <select className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2 text-white">
                <option value="starter">Starter - R$ 97/mês</option>
                <option value="pro">Profissional - R$ 197/mês</option>
                <option value="enterprise">Enterprise - R$ 397/mês</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button>Próximo</Button>
            </div>
          </div>
        </Card>
      )}

      <Input 
        placeholder="Buscar empresa..." 
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="space-y-3">
        {empresas.map(emp => (
          <Card key={emp.id}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  {emp.nome[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{emp.nome}</h3>
                  <p className="text-sm text-slate-400">{emp.plano} • {emp.cidade}</p>
                  <p className="text-xs text-slate-500 mt-1">Criado em: {new Date(emp.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  emp.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  emp.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {emp.status === 'active' ? '🟢 Ativo' :
                   emp.status === 'blocked' ? '🔴 Bloqueado' :
                   '🟡 Teste'}
                </span>
                <Button size="sm" variant="ghost" onClick={() => changeStatus(emp.id, emp.status === 'active' ? 'blocked' : 'active')}>
                  {emp.status === 'active' ? 'Bloquear' : 'Ativar'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
