/**
 * Hook para Monitoramento de Custos de IA
 * 
 * Monitora e controla custos de operações de IA
 * Fornece insights sobre uso e limites de gastos
 */

import { useState, useEffect, useCallback } from 'react';
import { useAIService } from '@/services/ai/ai-service-factory';

interface CostAnalytics {
  total: number;
  count: number;
  average: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface UsageAlert {
  type: 'warning' | 'danger';
  message: string;
  threshold: number;
  current: number;
}

interface CostMonitoringState {
  analytics: CostAnalytics;
  alerts: UsageAlert[];
  dailyLimit: number;
  monthlyLimit: number;
  isNearLimit: boolean;
  isOverLimit: boolean;
}

export function useAICostMonitoring() {
  const aiService = useAIService();
  
  const [state, setState] = useState<CostMonitoringState>({
    analytics: {
      total: 0,
      count: 0,
      average: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    },
    alerts: [],
    dailyLimit: 10.0, // $10 por dia (mock)
    monthlyLimit: 200.0, // $200 por mês (mock)
    isNearLimit: false,
    isOverLimit: false
  });

  // Atualizar analytics
  const updateAnalytics = useCallback(() => {
    const logs = aiService.getOperationLogs();
    const costs = aiService.getTotalCosts();
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const todayCosts = logs
      .filter(log => new Date(log.timestamp) >= todayStart)
      .reduce((sum, log) => sum + log.cost, 0);
    
    const weekCosts = logs
      .filter(log => new Date(log.timestamp) >= weekStart)
      .reduce((sum, log) => sum + log.cost, 0);
    
    const monthCosts = logs
      .filter(log => new Date(log.timestamp) >= monthStart)
      .reduce((sum, log) => sum + log.cost, 0);

    // Verificar alertas
    const alerts: UsageAlert[] = [];
    
    if (todayCosts > state.dailyLimit * 0.8) {
      alerts.push({
        type: todayCosts > state.dailyLimit ? 'danger' : 'warning',
        message: todayCosts > state.dailyLimit 
          ? `Limite diário excedido: $${todayCosts.toFixed(2)}`
          : `Próximo do limite diário: $${todayCosts.toFixed(2)} de $${state.dailyLimit}`,
        threshold: state.dailyLimit,
        current: todayCosts
      });
    }

    if (monthCosts > state.monthlyLimit * 0.8) {
      alerts.push({
        type: monthCosts > state.monthlyLimit ? 'danger' : 'warning',
        message: monthCosts > state.monthlyLimit
          ? `Limite mensal excedido: $${monthCosts.toFixed(2)}`
          : `Próximo do limite mensal: $${monthCosts.toFixed(2)} de $${state.monthlyLimit}`,
        threshold: state.monthlyLimit,
        current: monthCosts
      });
    }

    setState(prev => ({
      ...prev,
      analytics: {
        total: costs.total,
        count: costs.count,
        average: costs.average,
        today: todayCosts,
        thisWeek: weekCosts,
        thisMonth: monthCosts
      },
      alerts,
      isNearLimit: alerts.some(a => a.type === 'warning'),
      isOverLimit: alerts.some(a => a.type === 'danger')
    }));
  }, [aiService, state.dailyLimit, state.monthlyLimit]);

  // Definir limites customizados
  const setDailyLimit = useCallback((limit: number) => {
    setState(prev => ({ ...prev, dailyLimit: limit }));
  }, []);

  const setMonthlyLimit = useCallback((limit: number) => {
    setState(prev => ({ ...prev, monthlyLimit: limit }));
  }, []);

  // Obter relatório detalhado
  const getDetailedReport = useCallback(() => {
    const logs = aiService.getOperationLogs();
    
    // Agrupar por dia
    const dailyUsage = logs.reduce((acc, log) => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { cost: 0, requests: 0 };
      }
      acc[date].cost += log.cost;
      acc[date].requests += 1;
      return acc;
    }, {} as Record<string, { cost: number; requests: number }>);

    // Agrupar por tipo de operação
    const operationTypes = logs.reduce((acc, log) => {
      const type = log.request.content_type || 'unknown';
      if (!acc[type]) {
        acc[type] = { cost: 0, requests: 0 };
      }
      acc[type].cost += log.cost;
      acc[type].requests += 1;
      return acc;
    }, {} as Record<string, { cost: number; requests: number }>);

    return {
      dailyUsage,
      operationTypes,
      totalLogs: logs.length,
      dateRange: logs.length > 0 ? {
        from: logs[0].timestamp,
        to: logs[logs.length - 1].timestamp
      } : null
    };
  }, [aiService]);

  // Verificar se pode fazer operação baseado nos limites
  const canPerformOperation = useCallback((estimatedCost: number = 0.01): boolean => {
    if (state.isOverLimit) return false;
    
    const projectedDailyCost = state.analytics.today + estimatedCost;
    const projectedMonthlyCost = state.analytics.thisMonth + estimatedCost;
    
    return projectedDailyCost <= state.dailyLimit && 
           projectedMonthlyCost <= state.monthlyLimit;
  }, [state]);

  // Obter recomendações de otimização
  const getOptimizationTips = useCallback(() => {
    const report = getDetailedReport();
    const tips: string[] = [];

    if (state.analytics.average > 0.05) {
      tips.push('Considere revisar prompts para reduzir tokens utilizados');
    }

    if (state.analytics.today > state.analytics.average * 10) {
      tips.push('Uso anormalmente alto hoje, verifique se há operações desnecessárias');
    }

    // Analisar tipos de operação mais caros
    const sortedOperations = Object.entries(report.operationTypes)
      .sort(([,a], [,b]) => (b as { cost: number }).cost - (a as { cost: number }).cost);
    
    if (sortedOperations.length > 0 && (sortedOperations[0][1] as { cost: number }).cost > state.analytics.total * 0.5) {
      tips.push(`Operações de "${sortedOperations[0][0]}" representam a maior parte dos custos`);
    }

    return tips;
  }, [state, getDetailedReport]);

  // Atualizar dados periodicamente
  useEffect(() => {
    updateAnalytics();
    
    const interval = setInterval(updateAnalytics, 30000); // A cada 30 segundos
    return () => clearInterval(interval);
  }, [updateAnalytics]);

  return {
    ...state,
    updateAnalytics,
    setDailyLimit,
    setMonthlyLimit,
    getDetailedReport,
    canPerformOperation,
    getOptimizationTips
  };
}