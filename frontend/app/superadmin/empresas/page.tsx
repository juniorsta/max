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
      default: return 'bg-[#6B7280]/20 text-[#9CA3AF]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[32px] font-bold text-[#F3F4F6]">Gestão de Empresas</h1>
          <p className="text-[#9CA3AF] mt-1">Gerencie todas as empresas da plataforma</p>
        </div>
        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">+ Nova Empresa</Button>
      </div>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-semibold text-[#F3F4F6]">Empresas Cadastradas</h2>
          <input
            type="text"
            placeholder="Buscar empresa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64 px-4 py-2 bg-[#111827] border border-[#1E293B] rounded-lg text-[#F3F4F6] placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                {['Nome', 'Plano', 'Status', 'Usuários', 'Criado em', 'Ações'].map(h => (
                  <th key={h} className="text-left text-sm font-medium text-[#9CA3AF] pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {empresas.filter(e => e.nome.toLowerCase().includes(search.toLowerCase())).map(emp => (
                <tr key={emp.id} className="hover:bg-[#111827]/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#2563EB] flex items-center justify-center text-white font-bold">
                        {emp.nome[0]}
                      </div>
                      <span className="font-medium text-[#F3F4F6]">{emp.nome}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-[#111827] border border-[#1E293B] text-[#F3F4F6]">
                      {emp.plano}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(emp.status)}`}>
                      {emp.status === 'Ativo' ? '🟢 ' : emp.status === 'Inativo' ? '🔴 ' : '🟡 '}{emp.status}
                    </span>
                  </td>
                  <td className="py-4 text-[#9CA3AF]">{emp.usuarios}</td>
                  <td className="py-4 text-[#9CA3AF]">{new Date(emp.createdAt).toLocaleDateString('pt-BR')}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="text-[#9CA3AF] hover:text-[#F3F4F6]">Entrar</button>
                      <button className="text-[#9CA3AF] hover:text-[#F3F4F6]">Editar</button>
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
