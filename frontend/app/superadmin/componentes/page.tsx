'use client';

import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function ComponentesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#F3F4F6]">Biblioteca de Componentes</h1>
        <p className="text-[#9CA3AF] mt-1">Design system da plataforma KERA</p>
      </div>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Botões</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Perigo</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button disabled>Desabilitado</Button>
          <Button size="sm">Pequeno</Button>
          <Button size="lg">Grande</Button>
        </div>
      </Card>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Inputs</h2>
        <div className="max-w-md space-y-4">
          <Input label="Email" placeholder="seu@email.com" />
          <Input label="Senha" type="password" placeholder="Digite sua senha" error="Senha incorreta" />
        </div>
      </Card>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          {['Ativo', 'Pendente', 'Bloqueado', 'Info', 'Premium'].map((badge, idx) => {
            const colors = ['bg-[#10B981]/20 text-[#10B981]', 'bg-[#F59E0B]/20 text-[#F59E0B]', 'bg-[#EF4444]/20 text-[#EF4444]', 'bg-[#2563EB]/20 text-[#2563EB]', 'bg-[#8B5CF6]/20 text-[#8B5CF6]'];
            return (
              <span key={idx} className={`px-3 py-1 rounded-full text-xs ${colors[idx]}`}>{badge}</span>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Paleta de Cores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { nome: 'Primária', hex: '#8B5CF6' },
            { nome: 'Secundária', hex: '#2563EB' },
            { nome: 'Sucesso', hex: '#10B981' },
            { nome: 'Aviso', hex: '#F59E0B' },
            { nome: 'Erro', hex: '#EF4444' },
            { nome: 'Fundo escuro', hex: '#111827' },
            { nome: 'Fundo claro', hex: '#1E293B' },
            { nome: 'Texto', hex: '#F3F4F6' },
          ].map((color, idx) => (
            <div key={idx} className="text-center">
              <div className="w-full aspect-square rounded-lg mb-2" style={{ backgroundColor: color.hex }} />
              <p className="text-sm font-medium text-[#F3F4F6]">{color.nome}</p>
              <p className="text-xs text-[#9CA3AF] font-mono">{color.hex}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Tipografia</h2>
        <div className="space-y-3">
          <div className="flex items-baseline gap-4">
            <span className="text-[32px] font-bold text-[#F3F4F6]">H1 - 32px</span>
            <span className="text-[#9CA3AF]">Bold</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-[24px] font-semibold text-[#F3F4F6]">H2 - 24px</span>
            <span className="text-[#9CA3AF]">Semibold</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-[20px] font-medium text-[#F3F4F6]">H3 - 20px</span>
            <span className="text-[#9CA3AF]">Medium</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-[14px] text-[#F3F4F6]">Body - 14px</span>
            <span className="text-[#9CA3AF]">Regular</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-[12px] text-[#9CA3AF]">Caption - 12px</span>
            <span className="text-[#9CA3AF]">Regular</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
