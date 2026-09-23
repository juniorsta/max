'use client';

import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function ComponentesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Componentes</h1>
        <p className="text-slate-400 mt-1">Biblioteca de componentes da UI</p>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Botões</h2>
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

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Inputs</h2>
        <div className="max-w-md space-y-4">
          <Input label="Email" placeholder="seu@email.com" />
          <Input label="Senha" type="password" placeholder="Digite sua senha" error="Senha incorreta" />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-white font-medium">Card Padrão</p>
            <p className="text-sm text-slate-400 mt-1">Conteúdo do card</p>
          </Card>
          <Card className="border-purple-500/50">
            <p className="text-white font-medium">Card Destaque</p>
            <p className="text-sm text-slate-400 mt-1">Com borda colorida</p>
          </Card>
          <Card>
            <p className="text-white font-medium">Card Glass</p>
            <p className="text-sm text-slate-400 mt-1">Efeito glassmorphism</p>
          </Card>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">🟢 Ativo</span>
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">🟡 Pendente</span>
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">🔴 Bloqueado</span>
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">🔵 Info</span>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">🟣 Premium</span>
        </div>
      </Card>
    </div>
  );
}
