'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function ConfiguracoesPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/superadmin/settings`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      alert('Configurações salvas!');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Carregando...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-white">Configurações da Plataforma</h1>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Geral</h2>
        <div className="space-y-4">
          <Input 
            label="Nome da Plataforma"
            value={settings.nome_plataforma || 'Kera'}
            onChange={e => setSettings({ ...settings, nome_plataforma: e.target.value })}
          />
          <Input 
            label="Email de Suporte"
            value={settings.email_suporte || 'suporte@kera.com'}
            onChange={e => setSettings({ ...settings, email_suporte: e.target.value })}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Limites por Plano</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            label="Leads - Básico"
            type="number"
            value={settings.limite_leads_basico || '1000'}
            onChange={e => setSettings({ ...settings, limite_leads_basico: e.target.value })}
          />
          <Input 
            label="Leads - Profissional"
            type="number"
            value={settings.limite_leads_pro || '10000'}
            onChange={e => setSettings({ ...settings, limite_leads_pro: e.target.value })}
          />
          <Input 
            label="Conversas - Básico"
            type="number"
            value={settings.limite_conversas_basico || '500'}
            onChange={e => setSettings({ ...settings, limite_conversas_basico: e.target.value })}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}
