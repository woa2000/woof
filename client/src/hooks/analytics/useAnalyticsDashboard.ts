/**
 * Hook para Analytics Dashboard
 * 
 * Fornece dados consolidados para dashboard de analytics
 * com métricas de campanhas, redes sociais e negócio
 */

import { useState, useEffect, useCallback } from 'react';
import { useAnalyticsService, TimeRangeUtils } from '@/services/analytics/analytics-service-factory';
import type { 
  AnalyticsTimeRange,
  CampaignMetrics,
  SocialMetrics,
  BusinessMetrics,
  MetricDataPoint,
  CompetitorAnalysis 
} from '@/services/analytics/analytics-service-factory';

interface DashboardState {
  isLoading: boolean;
  error: string | null;
  timeRange: AnalyticsTimeRange;
  overview: {
    total_leads: number;
    total_revenue: number;
    avg_cpa: number;
    growth_rate: number;
  } | null;
  campaigns: CampaignMetrics[];
  socialMetrics: SocialMetrics[];
  businessMetrics: BusinessMetrics[];
  competitors: CompetitorAnalysis[];
  timeSeries: {
    leads: MetricDataPoint[];
    revenue: MetricDataPoint[];
    appointments: MetricDataPoint[];
    social_engagement: MetricDataPoint[];
  };
  channelROI: Array<{
    channel: string;
    spend: number;
    revenue: number;
    roi: number;
    leads: number;
    cost_per_lead: number;
  }>;
  customerJourney: any | null;
}

export function useAnalyticsDashboard(initialTimeRange?: AnalyticsTimeRange) {
  const analyticsService = useAnalyticsService();
  
  const [state, setState] = useState<DashboardState>({
    isLoading: false,
    error: null,
    timeRange: initialTimeRange || TimeRangeUtils.last30Days(),
    overview: null,
    campaigns: [],
    socialMetrics: [],
    businessMetrics: [],
    competitors: [],
    timeSeries: {
      leads: [],
      revenue: [],
      appointments: [],
      social_engagement: []
    },
    channelROI: [],
    customerJourney: null
  });

  // Carregar dados do dashboard
  const loadDashboardData = useCallback(async (timeRange?: AnalyticsTimeRange) => {
    const targetTimeRange = timeRange || state.timeRange;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const dashboardData = await analyticsService.getDashboardData(targetTimeRange);
      
      setState(prev => ({
        ...prev,
        overview: dashboardData.overview,
        campaigns: dashboardData.campaigns,
        socialMetrics: dashboardData.social,
        businessMetrics: dashboardData.business,
        timeSeries: dashboardData.timeSeries,
        timeRange: targetTimeRange,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados do dashboard';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    }
  }, [analyticsService, state.timeRange]);

  // Carregar dados de concorrentes
  const loadCompetitorData = useCallback(async () => {
    try {
      const competitors = await analyticsService.getCompetitorAnalysis();
      setState(prev => ({ ...prev, competitors }));
    } catch (error) {
      console.error('Erro ao carregar dados de concorrentes:', error);
    }
  }, [analyticsService]);

  // Carregar dados de ROI por canal
  const loadChannelROI = useCallback(async () => {
    try {
      const channelROI = await analyticsService.getChannelROIReport();
      setState(prev => ({ ...prev, channelROI }));
    } catch (error) {
      console.error('Erro ao carregar dados de ROI por canal:', error);
    }
  }, [analyticsService]);

  // Carregar jornada do cliente
  const loadCustomerJourney = useCallback(async () => {
    try {
      const customerJourney = await analyticsService.getCustomerJourneyAnalytics();
      setState(prev => ({ ...prev, customerJourney }));
    } catch (error) {
      console.error('Erro ao carregar jornada do cliente:', error);
    }
  }, [analyticsService]);

  // Alterar período de tempo
  const setTimeRange = useCallback((newTimeRange: AnalyticsTimeRange) => {
    setState(prev => ({ ...prev, timeRange: newTimeRange }));
    loadDashboardData(newTimeRange);
  }, [loadDashboardData]);

  // Shortcuts para períodos comuns
  const setLast7Days = useCallback(() => setTimeRange(TimeRangeUtils.last7Days()), [setTimeRange]);
  const setLast30Days = useCallback(() => setTimeRange(TimeRangeUtils.last30Days()), [setTimeRange]);
  const setLast3Months = useCallback(() => setTimeRange(TimeRangeUtils.last3Months()), [setTimeRange]);
  const setThisMonth = useCallback(() => setTimeRange(TimeRangeUtils.thisMonth()), [setTimeRange]);
  const setThisYear = useCallback(() => setTimeRange(TimeRangeUtils.thisYear()), [setTimeRange]);

  // Recarregar todos os dados
  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadDashboardData(),
      loadCompetitorData(),
      loadChannelROI(),
      loadCustomerJourney()
    ]);
  }, [loadDashboardData, loadCompetitorData, loadChannelROI, loadCustomerJourney]);

  // Calcular métricas derivadas
  const getTopPerformingCampaign = useCallback(() => {
    if (state.campaigns.length === 0) return null;
    
    return state.campaigns.reduce((best, current) => 
      current.roas > best.roas ? current : best
    );
  }, [state.campaigns]);

  const getTotalSocialFollowers = useCallback(() => {
    return state.socialMetrics.reduce((total, platform) => total + platform.followers, 0);
  }, [state.socialMetrics]);

  const getAverageEngagementRate = useCallback(() => {
    if (state.socialMetrics.length === 0) return 0;
    
    const totalEngagement = state.socialMetrics.reduce((total, platform) => 
      total + platform.avg_engagement, 0
    );
    
    return Number((totalEngagement / state.socialMetrics.length).toFixed(2));
  }, [state.socialMetrics]);

  const getBestROIChannel = useCallback(() => {
    if (state.channelROI.length === 0) return null;
    
    return state.channelROI.reduce((best, current) => 
      current.roi > best.roi ? current : best
    );
  }, [state.channelROI]);

  // Obter insights automatizados
  const getInsights = useCallback(() => {
    const insights: string[] = [];
    
    // Insights de campanhas
    const topCampaign = getTopPerformingCampaign();
    if (topCampaign && topCampaign.roas > 3) {
      insights.push(`🎯 Campanha "${topCampaign.campaign_name}" tem excelente ROAS de ${topCampaign.roas}x`);
    }
    
    // Insights sociais
    const avgEngagement = getAverageEngagementRate();
    if (avgEngagement > 6) {
      insights.push(`📱 Taxa de engajamento social está excelente: ${avgEngagement}%`);
    } else if (avgEngagement < 3) {
      insights.push(`📱 Taxa de engajamento social precisa de atenção: ${avgEngagement}%`);
    }
    
    // Insights de ROI
    const bestChannel = getBestROIChannel();
    if (bestChannel && bestChannel.roi > 200) {
      insights.push(`💰 Canal "${bestChannel.channel}" tem ROI excepcional de ${bestChannel.roi}%`);
    }
    
    // Insights de crescimento
    if (state.overview && state.overview.growth_rate > 15) {
      insights.push(`📈 Crescimento acelerado de ${state.overview.growth_rate}% no período`);
    }
    
    return insights;
  }, [state, getTopPerformingCampaign, getAverageEngagementRate, getBestROIChannel]);

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData();
    loadCompetitorData();
    loadChannelROI();
    loadCustomerJourney();
  }, []); // Executar apenas uma vez na inicialização

  return {
    // Estado
    ...state,
    
    // Funções de carregamento
    loadDashboardData,
    refreshAll,
    
    // Controle de período
    setTimeRange,
    setLast7Days,
    setLast30Days,
    setLast3Months,
    setThisMonth,
    setThisYear,
    
    // Métricas calculadas
    getTopPerformingCampaign,
    getTotalSocialFollowers,
    getAverageEngagementRate,
    getBestROIChannel,
    getInsights
  };
}