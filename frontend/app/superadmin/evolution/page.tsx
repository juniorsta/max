'use client';

import { Card } from '@/components/Card';

const instancias = [
  { nome: 'AutoBike Estética', status: 'Online', whatsapp: '(11) 99999-9999', ultimaAtividade: '2 min atrás' },
  { nome: 'Detal Garage', status: 'Online', whatsapp: '(11) 98888-8888', ultimaAtividade: '5 min atrás' },
  { nome: 'Prime Clean', status: 'Offline', whatsapp: '(11) 97777-7777', ultimaAtividade: '1 hora atrás' },
  { nome: '22 Motors', status: 'QR Pendente', whatsapp: '(11) 96666-6666', ultimaAtividade: 'Agora' },
];

export default function EvolutionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[32px] font-bold text-[#F3F4F6]">Evolution API</h1>
        <p className="text-[#9CA3AF] mt-1">Gerencie as instâncias WhatsApp da plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl lg:col-span-1">
          <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Instâncias</h2>
          <div className="space-y-3">
            {instancias.map((inst, idx) => (
              <div key={idx} className="p-3 bg-[#111827] rounded-lg border border-[#1E293B] hover:border-[#8B5CF6]/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    inst.status === 'Online' ? 'bg-[#10B981]' :
                    inst.status === 'Offline' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F3F4F6] truncate">{inst.nome}</p>
                    <p className="text-xs text-[#9CA3AF]">{inst.whatsapp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl lg:col-span-1">
          <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">QR Code</h2>
          <div className="flex items-center justify-center h-64 bg-[#111827] rounded-lg border border-[#1E293B]">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-white p-4 rounded-lg">
                <div className="w-full h-full bg-[#111827] flex items-center justify-center text-[#F3F4F6] font-bold text-sm">QR CODE</div>
              </div>
              <p className="text-sm text-[#9CA3AF] mt-4">Escaneie para conectar</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1E293B] border-[#1E293B] rounded-xl lg:col-span-1">
          <h2 className="text-[20px] font-semibold text-[#F3F4F6] mb-4">Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Instância ID', value: 'auto_brito_01' },
              { label: 'Webhook URL', value: 'https://api.kera.../webhook' },
              { label: 'Conexão', value: 'Estabelecida', color: 'text-[#10B981]' },
              { label: 'Última atividade', value: '2 min atrás' },
              { label: 'Mensagens enviadas', value: '1.234' },
              { label: 'Qualidade', value: '98%' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-[#1E293B] last:border-0">
                <span className="text-sm text-[#9CA3AF]">{item.label}</span>
                <span className={`text-sm font-medium text-[#F3F4F6] ${item.color || ''}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
