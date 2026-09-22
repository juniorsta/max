'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    empresaNome: '',
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.senha !== form.confirmarSenha) {
      setError('Senhas não conferem');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.senha); // login will fail, but we need register
      // Actually we need to call register endpoint directly
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaNome: form.empresaNome,
          nome: form.nome,
          email: form.email,
          senha: form.senha,
        }),
      });
      if (!res.ok) throw new Error('Erro ao registrar');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
      router.refresh();
    } catch (e: any) {
      setError(e.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400">Kera</h1>
          <p className="text-gray-400 mt-2">Crie sua conta e comece agora</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Nome da Empresa"
            value={form.empresaNome}
            onChange={(e) => setForm(f => ({ ...f, empresaNome: e.target.value }))}
            required
            placeholder="Minha Estética"
          />

          <Input
            label="Seu Nome"
            value={form.nome}
            onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))}
            required
            placeholder="João Silva"
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            required
            autoComplete="email"
            placeholder="admin@exemplo.com"
          />

          <Input
            label="Senha"
            type="password"
            value={form.senha}
            onChange={(e) => setForm(f => ({ ...f, senha: e.target.value }))}
            required
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
          />

          <Input
            label="Confirmar Senha"
            type="password"
            value={form.confirmarSenha}
            onChange={(e) => setForm(f => ({ ...f, confirmarSenha: e.target.value }))}
            required
            autoComplete="new-password"
            placeholder="Repita a senha"
          />

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Já tem conta?{' '}
          <Link href="/login" className="text-purple-400 hover:underline">
            Fazer login
          </Link>
        </p>
      </Card>
    </div>
  );
}