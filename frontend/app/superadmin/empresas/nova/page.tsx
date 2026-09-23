'use client';

import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function NovaEmpresaPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-[32px] font-bold text-[#F3F4F6]">Nova Empresa</h1>
        <p className="text-[#9CA3AF] mt-1">Formulário de cadastro de um novo tenant</p>
      </div>

      <Card className="p-8 bg-[#1E293B] border-[#1E293B] rounded-xl">
        <div className="space-y-8">
          <div>
            <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nome da Empresa" placeholder="Ex: AutoBike Estética" />
              <Input label="Razão Social" placeholder="Ex: AutoBike Ltda ME" />
              <Input label="CNPJ" placeholder="00.000.000/0000-00" />
              <Input label="Telefone" placeholder="(11) 99999-9999" />
              <Input label="WhatsApp" placeholder="(11) 99999-9999" />
              <Input label="E-mail" placeholder="contato@empresa.com" />
              <Input label="Cidade" placeholder="São Paulo" />
              <Input label="Estado" placeholder="SP" />
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Plano e Configurações</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Plano</label>
                <select className="w-full px-4 py-2.5 bg-[#111827] border border-[#1E293B] rounded-lg text-[#F3F4F6] focus:outline-none focus:border-[#8B5CF6]">
                  <option>Starter - R$ 97/mês</option>
                  <option>Profissional - R$ 197/mês</option>
                  <option>Enterprise - R$ 397/mês</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Usuários Iniciais</label>
                <Input type="number" placeholder="3" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-[#1E293B]">
            <Button variant="outline" className="border-[#1E293B] text-[#9CA3AF] hover:bg-[#111827]">Cancelar</Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">Próximo</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
