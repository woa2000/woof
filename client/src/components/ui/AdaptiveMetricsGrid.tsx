// src/components/ui/AdaptiveMetricsGrid.tsx
'use client';

import { UserPreferences, MetricConfig } from '@/types/dashboard';
import StatCard from './StatCard';

interface AdaptiveMetricsGridProps {
  userRole: UserPreferences['role'];
  layout: UserPreferences['dashboardLayout'];
  className?: string;
}

const AdaptiveMetricsGrid: React.FC<AdaptiveMetricsGridProps> = ({
  userRole,
  layout,
  className = '',
}) => {
  // Métricas específicas por papel
  const roleBasedMetrics = {
    veterinario: [
      {
        id: 'anamnesis_pending',
        title: 'Anamneses Pendentes',
        value: 5,
        change: '+2 hoje',
        changeType: 'neutral' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        gradient: 'from-blue-500 to-blue-600',
      },
      {
        id: 'reports_generated',
        title: 'Relatórios Gerados',
        value: 25,
        change: '+8 esta semana',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        gradient: 'from-purple-500 to-purple-600',
      },
      {
        id: 'patient_satisfaction',
        title: 'Satisfação Clientes',
        value: '4.8⭐',
        change: '+0.2 vs mês passado',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ),
        gradient: 'from-pink-500 to-pink-600',
      },
      {
        id: 'consultation_rate',
        title: 'Taxa de Consultas',
        value: '12/dia',
        change: 'Dentro da meta',
        changeType: 'neutral' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        gradient: 'from-green-500 to-green-600',
      },
    ],
    gestor: [
      {
        id: 'revenue',
        title: 'Receita Mensal',
        value: 'R$ 45.280',
        change: '+12% vs mês anterior',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        gradient: 'from-green-500 to-green-600',
      },
      {
        id: 'team_productivity',
        title: 'Produtividade Equipe',
        value: '89%',
        change: '+5% esta semana',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        gradient: 'from-blue-500 to-blue-600',
      },
      {
        id: 'operational_costs',
        title: 'Custos Operacionais',
        value: 'R$ 28.400',
        change: '-3% vs orçado',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        gradient: 'from-orange-500 to-orange-600',
      },
      {
        id: 'client_retention',
        title: 'Retenção Clientes',
        value: '94%',
        change: '+2% vs trimestre',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ),
        gradient: 'from-pink-500 to-pink-600',
      },
    ],
    marketing: [
      {
        id: 'leads_conversion',
        title: 'Conversão de Leads',
        value: '8.5%',
        change: '+2.1% vs último mês',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        gradient: 'from-blue-500 to-blue-600',
      },
      {
        id: 'campaign_roi',
        title: 'ROI Campanhas',
        value: '320%',
        change: '+45% vs meta',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          </svg>
        ),
        gradient: 'from-green-500 to-green-600',
      },
      {
        id: 'social_engagement',
        title: 'Engagement Social',
        value: '15.2%',
        change: '+8% esta semana',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        ),
        gradient: 'from-purple-500 to-purple-600',
      },
      {
        id: 'content_reach',
        title: 'Alcance Conteúdo',
        value: '28.5k',
        change: '+18% vs semana passada',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ),
        gradient: 'from-indigo-500 to-indigo-600',
      },
    ],
    admin: [
      {
        id: 'system_uptime',
        title: 'Uptime Sistema',
        value: '99.8%',
        change: 'Últimos 30 dias',
        changeType: 'neutral' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        ),
        gradient: 'from-green-500 to-green-600',
      },
      {
        id: 'data_processed',
        title: 'Dados Processados',
        value: '1.2M',
        change: '+15% vs mês anterior',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        ),
        gradient: 'from-blue-500 to-blue-600',
      },
      {
        id: 'security_score',
        title: 'Score Segurança',
        value: '95/100',
        change: 'Excelente',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        gradient: 'from-red-500 to-red-600',
      },
      {
        id: 'user_activity',
        title: 'Usuários Ativos',
        value: '127',
        change: '+8 esta semana',
        changeType: 'increase' as const,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
        gradient: 'from-purple-500 to-purple-600',
      },
    ],
  };

  const metrics = roleBasedMetrics[userRole] || roleBasedMetrics.veterinario;

  // Adaptar layout baseado na preferência
  const getGridLayout = () => {
    switch (layout) {
      case 'compact':
        return 'grid-cols-1 md:grid-cols-2 gap-4';
      case 'focus':
        return 'grid-cols-1 md:grid-cols-2 gap-6';
      case 'detailed':
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
    }
  };

  // Filtrar métricas baseado no layout
  const getDisplayedMetrics = () => {
    switch (layout) {
      case 'compact':
        return metrics.slice(0, 2);
      case 'focus':
        return metrics.slice(0, 2);
      case 'detailed':
      default:
        return metrics;
    }
  };

  const displayedMetrics = getDisplayedMetrics();

  return (
    <div className={`grid ${getGridLayout()} ${className}`}>
      {displayedMetrics.map((metric, index) => (
        <div
          key={metric.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${0.1 + index * 0.1}s` }}
        >
          <StatCard
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
            gradient={metric.gradient}
          />
        </div>
      ))}
    </div>
  );
};

export default AdaptiveMetricsGrid;
