'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState('geral');

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-[32px] font-bold text-[#F8FAFC]">Configurações Globais</h1>
        <p className="text-[#94A3B8] mt-1">Gerencie as configurações da plataforma KERA</p>
      </div>

      <div className="flex gap-2 border-b border-[#1E293B]">
        {['geral', 'segurança', 'notificações', 'integrações', 'sistema'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t 
                ? 'border-[#8B5CF6] text-[#6366F1]' 
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'geral' && (
        <Card className="p-8 bg-[#1E293B] border-[#1E293B] rounded-xl">
          <h2 className="text-[20px] font-semibold text-[#F8FAFC] mb-6">Configurações da Plataforma</h2>
          <div className="space-y-4">
            <Input label="Nome da Plataforma" value="KERA" />
            <Input label="URL base" value="https://kera.stazak.com.br" />
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Fuso horário</label>
              <select className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]">
                <option>America/Sao_Paulo</option>
                <option>UTC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Idioma</label>
              <select className="w-full px-4 py-2.5 bg-[#0F172A] border border-[#1E293B] rounded-lg text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6]">
                <option>Português (BR)</option>
                <option>English</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg">
              <div>
                <p className="text-[#F8FAFC] font-medium">Modo Manutenção</p>
                <p className="text-sm text-[#94A3B8] mt-1">Desativa o acesso para todos exceto superadmins</p>
              </div>
              <button className="w-12 h-6 bg-[#1E293B] rounded-full relative transition-colors hover:bg-[#0F172A]">
                <div className="absolute left-1 top-1 w-4 h-4 bg-[#9CA3AF] rounded-full transition-all" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {tab === 'segurança' && (
        <Card className="p-8 bg-[#1E293B] border-[#1E293B] rounded-xl">
          <h2 className="text-[20px] font-semibold text-[#F8FAFC] mb-6">Segurança</h2>
          <div className="space-y-4">
            <Input label="Tempo de sessão (minutos)" type="number" value="60" />
            <Input label="Tentativas de login antes de bloquear" type="number" value="5" />
            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg">
              <div>
                <p className="text-[#F8FAFC] font-medium">Autenticação 2FA</p>
                <p className="text-sm text-[#94A3B8] mt-1">Obrigar autenticação em dois fatores</p>
              </div>
              <button className="w-12 h-6 bg-[#6366F1] rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button className="bg-[#6366F1] hover:bg-[#4F46E5]">Salvar Configurações</Button>
      </div>
    </div>
  );
}
