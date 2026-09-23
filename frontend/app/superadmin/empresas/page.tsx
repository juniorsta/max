'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface Empresa {
  id: string;
  nome: string;
  plano: 'Starter' | 'Profissional' | 'Enterprise';
  status: 'Ativo' | 'Inativo' | 'Teste';
  usuarios: number;
  createdAt: string;
}

export default function EmpresasPage() {
  const { token } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setEmpresas([
      { id: '1', nome: 'AutoBike Estética', plano: 'Enterprise', status: 'Ativo', usuarios: 12, createdAt: '2025-01-12' },
      { id: '2', nome: 'Detal Garage LTDA', plano: 'Profissional', status: 'Ativo', usuarios: 8, createdAt: '2025-03-15' },
      { id: '3', nome: 'Prime Clean', plano: 'Starter', status: 'Teste', usuarios: 3, createdAt: '2025-05-22' },
      { id: '4', nome: '22 Motors', plano: 'Profissional', status: 'Inativo', usuarios: 5, createdAt: '2025-04-08' },
    ]);
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-[#10B981]/20 text-[#10B981]';
      case 'Inativo': return 'bg-[#EF4444]/20 text-[#EF4444]';
      case 'Teste': return 'bg-[#F59E0B]/20 text-[#F59E0B]';
      default: return 'bg-[#6B7280]/20 text-[#94A3B8]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[32px] font-bold text-[#F8FAFC]">Gestão de Empresas</h1>
          <p className="text-[#94A3B8] mt-1">Gerencie todas as empresas da plataforma</p>
        </div>
        <Button className="bg-[#6366F1] hover:bg-[#4F46E5]">+ Nova Empresa</Button>
      </div>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-semibold text-[#F8FAFC]">Empresas Cadastradas</h2>
          <input
            type="text"
            placeholder="Buscar empresa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64 px-4 py-2 bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#F8FAFC] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                {['Nome', 'Plano', 'Status', 'Usuários', 'Criado em', 'Ações'].map(h => (
                  <th key={h} className="text-left text-sm font-medium text-[#94A3B8] pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {empresas.filter(e => e.nome.toLowerCase().includes(search.toLowerCase())).map(emp => (
                <tr key={emp.id} className="hover:bg-[#0F172A]/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#2563EB] flex items-center justify-center text-white font-bold">
                        {emp.nome[0]}
                      </div>
                      <span className="font-medium text-[#F8FAFC]">{emp.nome}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-[#0F172A] border border-[#1E293B] text-[#F8FAFC]">
                      {emp.plano}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(emp.status)}`}>
                      {emp.status === 'Ativo' ? '🟢 ' : emp.status === 'Inativo' ? '🔴 ' : '🟡 '}{emp.status}
                    </span>
                  </td>
                  <td className="py-4 text-[#94A3B8]">{emp.usuarios}</td>
                  <td className="py-4 text-[#94A3B8]">{new Date(emp.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="text-[#94A3B8] hover:text-[#F8FAFC]">Entrar</button>
                      <button className="text-[#94A3B8] hover:text-[#F8FAFC]">Editar</button>
                      <button className="text-[#EF4444] hover:text-[#FCA5A5]">Suspender</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
