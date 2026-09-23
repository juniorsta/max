'use client';

import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

const usuarios = [
  { nome: 'João Silva', email: 'joao@empresa.com', papel: 'Admin', status: 'Ativo', criado: '12/01/2025' },
  { nome: 'Maria Santos', email: 'maria@empresa.com', papel: 'Gerente', status: 'Ativo', criado: '15/03/2025' },
  { nome: 'Carlos Oliveira', email: 'carlos@empresa.com', papel: 'Suporte', status: 'Inativo', criado: '08/04/2025' },
  { nome: 'Ana Costa', email: 'ana@empresa.com', papel: 'Vendedor', status: 'Ativo', criado: '22/05/2025' },
];

export default function UsuariosPage() {
  const { token } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[32px] font-bold text-[#F8FAFC]">Gestão de Usuários</h1>
          <p className="text-[#94A3B8] mt-1">Gerencie todos os usuários da plataforma</p>
        </div>
        <Button className="bg-[#6366F1] hover:bg-[#4F46E5]">+ Novo Usuário</Button>
      </div>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1E293B]">
                {['Nome', 'E-mail', 'Papel', 'Status', 'Criado em', 'Ações'].map(h => (
                  <th key={h} className="text-left text-sm font-medium text-[#94A3B8] pb-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {usuarios.map((u, idx) => (
                <tr key={idx} className="hover:bg-[#0F172A]/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#2563EB] flex items-center justify-center text-white font-bold">
                        {u.nome[0]}
                      </div>
                      <span className="font-medium text-[#F8FAFC]">{u.nome}</span>
                    </div>
                  </td>
                  <td className="py-4 text-[#94A3B8]">{u.email}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-[#0F172A] border border-[#1E293B] text-[#F8FAFC]">{u.papel}</span>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${u.status === 'Ativo' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'}`}>
                      {u.status === 'Ativo' ? '🟢 Ativo' : '🔴 Inativo'}
                    </span>
                  </td>
                  <td className="py-4 text-[#94A3B8]">{u.criado}</td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <button className="text-[#94A3B8] hover:text-[#F8FAFC]">✏️</button>
                      <button className="text-[#EF4444] hover:text-[#FCA5A5]">🗑️</button>
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
