'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { mockLeads } from '@/lib/mock-data';
import { Download } from 'lucide-react';

const LeadsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-semibold text-dark-brown">Gestão de Leads</h1>
        <Button variant="primary" icon={Download}>Exportar CSV</Button>
      </div>
      <Card>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-dark-brown font-semibold">Nome</th>
              <th className="px-4 py-2 text-left text-dark-brown font-semibold">Contato</th>
              <th className="px-4 py-2 text-left text-dark-brown font-semibold">Status</th>
              <th className="px-4 py-2 text-left text-dark-brown font-semibold">Origem</th>
              <th className="px-4 py-2 text-left text-dark-brown font-semibold">Data</th>
            </tr>
          </thead>
          <tbody>
            {mockLeads.map((lead) => (
              <tr key={lead.id} className="border-t border-light-gray">
                <td className="px-4 py-2 text-dark-gray">{lead.name}</td>
                <td className="px-4 py-2 text-dark-gray">{`${lead.email} / ${lead.phone}`}</td>
                <td className={`px-4 py-2 font-semibold ${lead.status === 'Convertido' ? 'text-teal-accent' : lead.status === 'Contatado' ? 'text-woof-orange' : 'text-dark-gray'}`}>
                  {lead.status}
                </td>
                <td className="px-4 py-2 text-dark-gray">{lead.source}</td>
                <td className="px-4 py-2 text-dark-gray">{lead.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default LeadsPage;
