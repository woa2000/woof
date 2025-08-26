'use client';

import Card from '@/components/ui/Card';
import { mockCampaigns } from '@/lib/mock-data';

const CampaignsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-semibold text-dark-brown">Suas Campanhas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCampaigns.map((campaign) => (
          <Card key={campaign.id}>
            <h2 className="text-xl font-display font-semibold text-dark-brown mb-2">{campaign.name}</h2>
            <p className="text-dark-gray mb-1">Plataforma: {campaign.platform}</p>
            <p className={`font-semibold ${campaign.status === 'Ativa' ? 'text-teal-accent' : 'text-dark-gray'}`}>Status: {campaign.status}</p>
            <p className="text-dark-gray">Gasto: R$ {campaign.spend.toFixed(2)}</p>
            <p className="text-dark-gray">Leads: {campaign.leads}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignsPage;
