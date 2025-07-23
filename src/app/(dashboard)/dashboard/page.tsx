// src/app/(dashboard)/dashboard/page.tsx
import MetricCard from '@/components/ui/MetricCard';
// Import placeholder data or fetch from Firebase here

const DashboardPage: React.FC = () => {
  // Placeholder data - replace with actual data fetching
  const totalLeads = 150;
  const activeCampaignPerformance = { name: 'Campanha Verão', spend: 350.75, cpl: 2.34 };
  const nextScheduledContent = { title: 'Post sobre Vacinação', dateTime: 'Amanhã, 10:00' };
  const reportsGenerated = 25;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold text-dark-brown">Seja bem-vindo(a) de volta, [Nome da Clínica]</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Novos Leads (7 dias)"
          metric={totalLeads}
          description="+15% vs semana passada"
          // chart={<LineChartPlaceholder />} // Add a chart component here
        />
        <MetricCard
          title="Performance Campanha Ativa"
          metric={`R$ ${activeCampaignPerformance.spend.toFixed(2)}`}
          description={`CPL: R$ ${activeCampaignPerformance.cpl.toFixed(2)} em ${activeCampaignPerformance.name}`}
        />
         <MetricCard
          title="Relatórios Gerados"
          metric={reportsGenerated}
          description="Total de relatórios de anamnese"
        />
        <MetricCard
          title="Próximo Conteúdo Agendado"
          metric={nextScheduledContent.title}
          description={`Em: ${nextScheduledContent.dateTime}`}
        />
      </div>
      {/* Add more sections as needed */}
    </div>
  );
};

export default DashboardPage;
