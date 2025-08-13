// src/app/(dashboard)/dashboard-v2/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/features/useAuth';
import { useDashboardContext } from '@/hooks/features/useDashboardContext';
import { debugAuth } from '@/lib/auth/auth-debug';

// Componentes melhorados
import AdaptiveMetricsGrid from '@/components/ui/AdaptiveMetricsGrid';
import SmartAlertsWidget from '@/components/ui/SmartAlertsWidget';
import SmartActionsWidget from '@/components/ui/SmartActionsWidget';
import DashboardLayoutSelector from '@/components/ui/DashboardLayoutSelector';
import ActivityCard from '@/components/ui/ActivityCard';
import ProgressCard from '@/components/ui/ProgressCard';
import LiveStatsWidget from '@/components/ui/LiveStatsWidget';
import SimpleChart from '@/components/ui/SimpleChart';
import DashboardVersionToggle from '@/components/ui/DashboardVersionToggle';

const DashboardV2Page: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { preferences, updatePreferences, dashboardContext, isLoading: contextLoading } = useDashboardContext();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    debugAuth.log('Dashboard V2 loaded', {
      isAuthenticated,
      loading,
      user: user ? { id: user.id, email: user.email } : null,
      preferences,
    });
  }, [isAuthenticated, loading, user, preferences]);

  // Dados mockados adaptados por papel
  const getRoleBasedData = () => {
    const baseData = {
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
      ],
      weeklyPerformance: [
        { label: 'Segunda', value: 25 },
        { label: 'Terça', value: 32 },
        { label: 'Quarta', value: 28 },
        { label: 'Quinta', value: 45 },
        { label: 'Sexta', value: 38 },
        { label: 'Sábado', value: 22 },
        { label: 'Domingo', value: 15 },
      ],
      progress: {
        monthlyGoal: { current: 87, total: 120, label: 'Meta do mês' },
        secondaryGoal: { current: 1250, total: 2000, label: 'Budget mensal' },
      },
    };

    // Personalizar dados baseado no papel
    if (preferences.role === 'veterinario') {
      baseData.activities = [
        {
          id: '1',
          title: 'Nova anamnese recebida',
          description: 'Análise comportamental do Rex aguardando revisão',
          time: '5 min atrás',
          type: 'lead' as const,
        },
        {
          id: '2',
          title: 'Consulta agendada',
          description: 'Dra. Ana agendou consulta para amanhã às 14h',
          time: '30 min atrás',
          type: 'lead' as const,
        },
      ];
      baseData.progress = {
        monthlyGoal: { current: 45, total: 60, label: 'Consultas do mês' },
        secondaryGoal: { current: 23, total: 30, label: 'Relatórios pendentes' },
      };
    } else if (preferences.role === 'marketing') {
      baseData.weeklyPerformance = [
        { label: 'Segunda', value: 1200 },
        { label: 'Terça', value: 1500 },
        { label: 'Quarta', value: 1100 },
        { label: 'Quinta', value: 1800 },
        { label: 'Sexta', value: 1600 },
        { label: 'Sábado', value: 900 },
        { label: 'Domingo', value: 700 },
      ];
    }

    return baseData;
  };

  const dashboardData = getRoleBasedData();

  const handleDismissAlert = (alertId: string) => {
    console.log('Dismissing alert:', alertId);
    // Implementar lógica de dismissal
  };

  const handleAlertAction = (alertId: string) => {
    console.log('Taking action on alert:', alertId);
    // Implementar ações específicas
  };

  if (loading || contextLoading) {
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

  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      veterinario: 'Veterinário(a)',
      gestor: 'Gestor(a)',
      marketing: 'Marketing',
      admin: 'Administrador(a)',
    };
    return labels[role] || role;
  };

  const getLayoutLabel = (layout: string): string => {
    const labels: Record<string, string> = {
      compact: 'Compacto',
      detailed: 'Detalhado',
      focus: 'Foco',
    };
    return labels[layout] || layout;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header melhorado */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between animate-fade-in-up">
          <div className="text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full mb-2 lg:mb-0">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-green-800">Conectado • {getRoleLabel(preferences.role)}</span>
              </div>
              
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Layout: {getLayoutLabel(preferences.dashboardLayout)}
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-woof-dark-gray mb-2">
              {dashboardContext.businessHours ? '☀️' : '🌙'} Olá, {user?.name || user?.email?.split('@')[0] || 'Dr(a)'}!
            </h1>
            <p className="text-lg text-gray-600">
              {dashboardContext.businessHours 
                ? 'Aqui está um resumo do que está acontecendo na sua clínica hoje'
                : 'Fora do horário comercial - Perfeito para planejamento e análises'
              }
            </p>
          </div>

          {/* Controles de personalização */}
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Personalizar
            </button>
          </div>
        </div>

        {/* Configurações de layout (condicional) */}
        {showSettings && (
          <div className="animate-fade-in-up">
            <DashboardLayoutSelector
              currentLayout={preferences.dashboardLayout}
              onLayoutChange={(layout) => updatePreferences({ dashboardLayout: layout })}
            />
          </div>
        )}

        {/* Métricas adaptativas */}
        <AdaptiveMetricsGrid
          userRole={preferences.role}
          layout={preferences.dashboardLayout}
        />

        {/* Layout adaptativo do conteúdo principal */}
        <div className={`grid gap-8 ${
          preferences.dashboardLayout === 'focus' 
            ? 'grid-cols-1 lg:grid-cols-2' 
            : 'grid-cols-1 lg:grid-cols-3'
        }`}>
          {/* Área principal */}
          <div className={`space-y-6 animate-slide-in-left ${
            preferences.dashboardLayout === 'focus' ? 'lg:col-span-1' : 'lg:col-span-2'
          }`} style={{ animationDelay: '0.5s' }}>
            
            {/* Alertas inteligentes */}
            <SmartAlertsWidget
              alerts={dashboardContext.activeAlerts}
              onDismiss={handleDismissAlert}
              onAction={handleAlertAction}
            />

            {/* Atividades (somente em layouts detailed e compact) */}
            {preferences.dashboardLayout !== 'focus' && (
              <ActivityCard 
                activities={dashboardData.activities}
                title="Atividade Recente"
              />
            )}
            
            {/* Progress Cards (somente em layout detailed) */}
            {preferences.dashboardLayout === 'detailed' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProgressCard
                  title={dashboardData.progress.monthlyGoal.label}
                  current={dashboardData.progress.monthlyGoal.current}
                  total={dashboardData.progress.monthlyGoal.total}
                  label="Progresso atual"
                  color="bg-green-500"
                />
                <ProgressCard
                  title={dashboardData.progress.secondaryGoal.label}
                  current={dashboardData.progress.secondaryGoal.current}
                  total={dashboardData.progress.secondaryGoal.total}
                  label="Status atual"
                  color="bg-woof-orange"
                />
              </div>
            )}
          </div>

          {/* Sidebar inteligente */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {/* Ações sugeridas contextuais */}
            <SmartActionsWidget
              actions={dashboardContext.suggestedActions}
              currentTime={dashboardContext.currentTime}
              businessHours={dashboardContext.businessHours}
            />
            
            {/* Stats ao vivo (somente em layouts detailed e compact) */}
            {preferences.dashboardLayout !== 'focus' && <LiveStatsWidget />}
            
            {/* Gráfico de performance */}
            <SimpleChart 
              data={dashboardData.weeklyPerformance}
              title={preferences.role === 'marketing' ? 'Impressões esta Semana' : 'Performance Semanal'}
            />
          </div>
        </div>

        {/* Atalhos rápidos para modo foco */}
        {preferences.dashboardLayout === 'focus' && (
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-lg font-semibold text-dark-brown mb-4">Atalhos Rápidos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Nova Anamnese', href: '/dashboard/anamnese-digital', icon: '📋' },
                { name: 'Ver Leads', href: '/dashboard/leads', icon: '👥' },
                { name: 'Campanhas', href: '/dashboard/campanhas', icon: '📊' },
                { name: 'Relatórios', href: '/dashboard/manual-marca', icon: '📄' },
              ].map((shortcut) => (
                <button
                  key={shortcut.name}
                  onClick={() => router.push(shortcut.href)}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-woof-blue hover:text-white transition-all duration-200 text-center"
                >
                  <div className="text-2xl mb-2">{shortcut.icon}</div>
                  <div className="text-sm font-medium">{shortcut.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Version Toggle */}
      <DashboardVersionToggle />
    </div>
  );
};

export default DashboardV2Page;
