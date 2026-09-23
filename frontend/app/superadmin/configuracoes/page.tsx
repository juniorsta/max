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
  const [tab, setTab] = useState('geral');

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

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-purple-400">Carregando...</div></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Configurações Globais</h1>
        <p className="text-slate-400 mt-1">Gerencie as configurações da plataforma KERA</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#334155]">
        {['geral', 'segurança', 'notificações', 'integrações', 'sistema'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t 
                ? 'bg-[#1E293B] text-purple-400 border-b-2 border-purple-500' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'geral' && (
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Configurações da Plataforma</h2>
          <div className="space-y-4">
            <Input 
              label="Nome da Plataforma"
              value={settings.nome_plataforma || 'KERA'}
              onChange={e => setSettings({ ...settings, nome_plataforma: e.target.value })}
            />
            <Input 
              label="URL base"
              value={settings.url_base || 'https://kera.stazak.com.br'}
              onChange={e => setSettings({ ...settings, url_base: e.target.value })}
            />
            <select 
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2 text-white"
              value={settings.fuso_horario || 'America/Sao_Paulo'}
              onChange={e => setSettings({ ...settings, fuso_horario: e.target.value })}
            >
              <option value="America/Sao_Paulo">America/Sao_Paulo</option>
              <option value="UTC">UTC</option>
            </select>
            <select 
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2 text-white"
              value={settings.idioma || 'pt-BR'}
              onChange={e => setSettings({ ...settings, idioma: e.target.value })}
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en">English</option>
            </select>
            <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg">
              <div>
                <p className="text-white font-medium">Modo Manutenção</p>
                <p className="text-sm text-slate-400">Desativa o acesso para todos exceto superadmins</p>
              </div>
              <button className="w-12 h-6 bg-[#334155] rounded-full relative transition-colors">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
}
