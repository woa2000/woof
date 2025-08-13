// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/features/useAuth';
import { debugAuth } from '@/lib/auth/auth-debug';
import StatCard from '@/components/ui/StatCard';
import ActivityCard from '@/components/ui/ActivityCard';
import QuickActionCard from '@/components/ui/QuickActionCard';
import ProgressCard from '@/components/ui/ProgressCard';
import LiveStatsWidget from '@/components/ui/LiveStatsWidget';
import AlertsWidget from '@/components/ui/AlertsWidget';
import SimpleChart from '@/components/ui/SimpleChart';
import DashboardVersionToggle from '@/components/ui/DashboardVersionToggle';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    debugAuth.log('Dashboard loaded', {
      isAuthenticated,
      loading,
      user: user ? { id: user.id, email: user.email } : null
    });
  }, [isAuthenticated, loading, user]);

  // Placeholder data - replace with actual data fetching
  const dashboardData = {
    stats: {
      totalLeads: 150,
      newLeadsWeek: 32,
      activeCampaigns: 3,
      campaignSpend: 1250.50,
      cpl: 2.34,
      conversionRate: 8.5,
      reportsGenerated: 25,
      scheduledPosts: 12,
    },
    activities: [
      {
        id: '1',
        title: 'Novo lead registrado',
        description: 'Maria Silva se interessou pelo serviço de castração',
        time: '2 min atrás',
        type: 'lead' as const,
      },
      {
        id: '2',
        title: 'Campanha "Vacinação" ativada',
        description: 'Budget de R$ 300 por dia configurado',
        time: '1 hora atrás',
        type: 'campaign' as const,
      },
      {
        id: '3',
        title: 'Relatório de anamnese gerado',
        description: 'Análise comportamental do pet Rex',
        time: '3 horas atrás',
        type: 'report' as const,
      },
      {
        id: '4',
        title: 'Post agendado',
        description: 'Dicas de alimentação para cães idosos',
        time: 'Ontem',
        type: 'content' as const,
      },
    ],
    progress: {
      monthlyGoal: { current: 87, total: 120, label: 'Leads do mês' },
      campaignBudget: { current: 1250, total: 2000, label: 'Budget mensal usado' },
    },
    weeklyPerformance: [
      { label: 'Segunda', value: 25 },
      { label: 'Terça', value: 32 },
      { label: 'Quarta', value: 28 },
      { label: 'Quinta', value: 45 },
      { label: 'Sexta', value: 38 },
      { label: 'Sábado', value: 22 },
      { label: 'Domingo', value: 15 },
    ],
  };

  const quickActions = [
    {
      title: 'Nova Anamnese Digital',
      description: 'Criar questionário personalizado',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: () => router.push('/dashboard/anamnese-digital'),
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Configurar Campanha',
      description: 'Criar nova campanha de marketing',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      onClick: () => router.push('/dashboard/campanhas'),
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Manual da Marca',
      description: 'Gerenciar identidade visual',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 5h4a2 2 0 012 2v4" />
        </svg>
      ),
      onClick: () => router.push('/dashboard/manual-marca'),
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Ver Leads',
      description: 'Acompanhar novos interessados',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: () => router.push('/dashboard/leads'),
      gradient: 'from-teal-500 to-teal-600',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-gray to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-48"></div>
              <div className="h-8 bg-gray-200 rounded w-96"></div>
            </div>
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="text-center lg:text-left animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full mb-4">
            <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-800">Conectado com sucesso</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-woof-dark-gray mb-2">
            Olá, {user?.name || user?.email?.split('@')[0] || 'Dr(a)'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Aqui está um resumo do que está acontecendo na sua clínica hoje
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <StatCard
              title="Novos Leads (7 dias)"
              value={dashboardData.stats.newLeadsWeek}
              change="+15% vs semana passada"
              changeType="increase"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              gradient="from-green-500 to-green-600"
            />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <StatCard
              title="Taxa de Conversão"
              value={`${dashboardData.stats.conversionRate}%`}
              change="+2.1% vs último mês"
              changeType="increase"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              gradient="from-blue-500 to-blue-600"
            />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <StatCard
              title="Gasto em Campanhas"
              value={`R$ ${dashboardData.stats.campaignSpend.toFixed(2)}`}
              change={`CPL: R$ ${dashboardData.stats.cpl.toFixed(2)}`}
              changeType="neutral"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
              gradient="from-woof-blue to-blue-300"
            />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <StatCard
              title="Relatórios Gerados"
              value={dashboardData.stats.reportsGenerated}
              change="Este mês"
              changeType="neutral"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              gradient="from-purple-500 to-purple-600"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Activities */}
          <div className="lg:col-span-2 space-y-6 animate-slide-in-left" style={{ animationDelay: '0.5s' }}>
            <ActivityCard 
              activities={dashboardData.activities}
              title="Atividade Recente"
            />
            
            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProgressCard
                title="Meta Mensal de Leads"
                current={dashboardData.progress.monthlyGoal.current}
                total={dashboardData.progress.monthlyGoal.total}
                label={dashboardData.progress.monthlyGoal.label}
                color="bg-green-500"
              />
              <ProgressCard
                title="Budget de Campanhas"
                current={dashboardData.progress.campaignBudget.current}
                total={dashboardData.progress.campaignBudget.total}
                label={dashboardData.progress.campaignBudget.label}
                color="bg-woof-orange"
              />
            </div>
            
            {/* Alerts Widget */}
            <AlertsWidget />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {/* Live Stats Widget */}
            <LiveStatsWidget />
            
            {/* Weekly Performance Chart */}
            <SimpleChart 
              data={dashboardData.weeklyPerformance}
              title="Leads esta Semana"
            />
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-dark-brown mb-4">Ações Rápidas</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <QuickActionCard
                    key={index}
                    title={action.title}
                    description={action.description}
                    icon={action.icon}
                    onClick={action.onClick}
                    gradient={action.gradient}
                  />
                ))}
              </div>
            </div>

            {/* Upcoming Content */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-dark-brown mb-4">Próximos Conteúdos</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-warm-yellow bg-opacity-10 rounded-lg">
                  <div className="w-2 h-2 bg-warm-yellow rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-dark-brown">Dicas de Alimentação</p>
                    <p className="text-xs text-gray-600">Hoje, 15:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-dark-brown">Post sobre Vacinação</p>
                    <p className="text-xs text-gray-600">Amanhã, 10:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-dark-brown">Newsletter Semanal</p>
                    <p className="text-xs text-gray-600">Sexta, 09:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Version Toggle */}
      <DashboardVersionToggle />
    </div>
  );
};

export default DashboardPage;
