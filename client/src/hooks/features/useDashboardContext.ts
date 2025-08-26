// src/hooks/features/useDashboardContext.ts
'use client';

import { useState, useEffect, useMemo } from 'react';
import { UserPreferences, DashboardContext, Alert, SuggestedAction } from '@/types/dashboard';

const defaultPreferences: UserPreferences = {
  role: 'veterinario',
  dashboardLayout: 'detailed',
  priorityMetrics: ['leads', 'conversion', 'revenue'],
  theme: 'light',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  workingHours: {
    start: '08:00',
    end: '18:00',
    timezone: 'America/Sao_Paulo',
  },
};

export const useDashboardContext = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Simular carregamento das preferências
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Aqui você carregaria do localStorage ou API
        const stored = localStorage.getItem('woof-dashboard-preferences');
        if (stored) {
          setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
        }
      } catch (error) {
        console.warn('Failed to load preferences:', error);
      }
      setIsLoading(false);
    };

    loadPreferences();
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('woof-dashboard-preferences', JSON.stringify(newPreferences));
  };

  // Gerar contexto baseado no tempo e papel do usuário
  const dashboardContext = useMemo((): DashboardContext => {
    const now = new Date();
    const currentHour = now.getHours();
    const [startHour] = preferences.workingHours.start.split(':').map(Number);
    const [endHour] = preferences.workingHours.end.split(':').map(Number);
    
    const businessHours = currentHour >= startHour && currentHour < endHour;

    // Alertas inteligentes baseados no contexto
    const generateAlerts = (): Alert[] => {
      const alerts: Alert[] = [];
      
      if (preferences.role === 'gestor' || preferences.role === 'admin') {
        alerts.push({
          id: 'budget-alert',
          type: 'warning',
          priority: 'high',
          title: 'Budget de campanha próximo do limite',
          message: 'Campanha "Vacinação" utilizou 85% do budget mensal',
          timestamp: '1 hora atrás',
          actionable: true,
          category: 'financial',
          dismissed: false,
        });
      }

      if (preferences.role === 'veterinario' || preferences.role === 'admin') {
        alerts.push({
          id: 'patient-alert',
          type: 'info',
          priority: 'medium',
          title: 'Novos relatórios de anamnese',
          message: '3 relatórios aguardando revisão',
          timestamp: '30 min atrás',
          actionable: true,
          category: 'operational',
          dismissed: false,
        });
      }

      if (preferences.role === 'marketing' || preferences.role === 'admin') {
        alerts.push({
          id: 'content-alert',
          type: 'success',
          priority: 'low',
          title: 'Meta de engagement atingida',
          message: 'Posts desta semana superaram meta em 15%',
          timestamp: '2 horas atrás',
          actionable: false,
          category: 'marketing',
          dismissed: false,
        });
      }

      return alerts;
    };

    // Ações sugeridas baseadas no contexto
    const generateSuggestedActions = (): SuggestedAction[] => {
      const actions: SuggestedAction[] = [];
      
      if (businessHours) {
        if (preferences.role === 'veterinario') {
          actions.push({
            id: 'review-anamnesis',
            title: 'Revisar anamneses pendentes',
            description: '3 relatórios aguardando sua análise',
            priority: 'high',
            category: 'clinical',
            estimatedTime: '15 min',
            context: 'Horário comercial - ideal para revisões',
            action: () => console.log('Navigate to anamnesis'),
          });
        }

        if (preferences.role === 'gestor') {
          actions.push({
            id: 'check-metrics',
            title: 'Analisar performance de campanhas',
            description: 'Verificar ROI e ajustar budgets',
            priority: 'medium',
            category: 'management',
            estimatedTime: '10 min',
            context: 'Bom momento para análises estratégicas',
            action: () => console.log('Navigate to campaigns'),
          });
        }
      } else {
        actions.push({
          id: 'schedule-content',
          title: 'Agendar conteúdo para amanhã',
          description: 'Preparar posts para as redes sociais',
          priority: 'low',
          category: 'content',
          estimatedTime: '20 min',
          context: 'Fora do horário - ideal para planejamento',
          action: () => console.log('Navigate to content'),
        });
      }

      return actions;
    };

    return {
      currentTime: now,
      businessHours,
      userRole: preferences.role,
      activeAlerts: generateAlerts(),
      recentActivity: [], // Seria populado com dados reais
      suggestedActions: generateSuggestedActions(),
    };
  }, [preferences]);

  return {
    preferences,
    updatePreferences,
    dashboardContext,
    isLoading,
  };
};
