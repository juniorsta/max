'use client';

import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useState } from 'react';

export default function SuperadminConfig() {
  const [form, setForm] = useState({
    nomePlataforma: 'Kera',
    emailSuporte: 'suporte@kera.com',
    limiteLeadsBasico: 1000,
    limiteLeadsPro: 10000,
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-white">Configurações da Plataforma</h1>
      
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Geral</h2>
        <div className="space-y-4">
          <Input 
            label="Nome da Plataforma"
            value={form.nomePlataforma}
            onChange={e => setForm({ ...form, nomePlataforma: e.target.value })}
          />
          <Input 
            label="Email de Suporte"
            value={form.emailSuporte}
            onChange={e => setForm({ ...form, emailSuporte: e.target.value })}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Planos</h2>
        <div className="space-y-4">
          <Input 
            label="Limite Leads - Plano Básico"
            type="number"
            value={form.limiteLeadsBasico}
            onChange={e => setForm({ ...form, limiteLeadsBasico: Number(e.target.value) })}
          />
          <Input 
            label="Limite Leads - Plano Pro"
            type="number"
            value={form.limiteLeadsPro}
            onChange={e => setForm({ ...form, limiteLeadsPro: Number(e.target.value) })}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Salvar Configurações</Button>
      </div>
    </div>
  );
}