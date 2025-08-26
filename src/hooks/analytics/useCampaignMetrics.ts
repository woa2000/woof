/**
 * Hook para Métricas de Campanha
 * 
 * Focado especificamente em análise detalhada de campanhas publicitárias
 * Performance, otimização e comparação de campanhas
 */

import { useState, useCallback, useMemo } from 'react';
import { useAnalyticsService } from '@/services/analytics/analytics-service-factory';
import type { CampaignMetrics, AnalyticsTimeRange } from '@/services/analytics/analytics-service-factory';

interface CampaignAnalysisState {
  isLoading: boolean;
  error: string | null;
  campaigns: CampaignMetrics[];
  selectedCampaign: CampaignMetrics | null;
  compareMode: boolean;
  comparisonCampaigns: CampaignMetrics[];
}

interface CampaignInsights {
  bestPerforming: {
    byROAS: CampaignMetrics | null;
    byCTR: CampaignMetrics | null;
    byEngagement: CampaignMetrics | null;
    byConversions: CampaignMetrics | null;
  };
  averages: {
    roas: number;
    ctr: number;
    cpa: number;
    engagement_rate: number;
  };
  recommendations: string[];
  alerts: Array<{
    type: 'warning' | 'success' | 'danger';
    campaign: string;
    message: string;
  }>;
}

export function useCampaignMetrics(timeRange: AnalyticsTimeRange) {
  const analyticsService = useAnalyticsService();
  
  const [state, setState] = useState<CampaignAnalysisState>({
    isLoading: false,
    error: null,
    campaigns: [],
    selectedCampaign: null,
    compareMode: false,
    comparisonCampaigns: []
  });

  // Carregar dados de campanhas
  const loadCampaigns = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const campaigns = await analyticsService.getCampaignMetrics(timeRange);
      
      setState(prev => ({
        ...prev,
        campaigns,
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar campanhas';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    }
  }, [analyticsService, timeRange]);

  // Selecionar campanha para análise detalhada
  const selectCampaign = useCallback((campaign: CampaignMetrics | null) => {
    setState(prev => ({ ...prev, selectedCampaign: campaign }));
  }, []);

  // Ativar/desativar modo de comparação
  const toggleCompareMode = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      compareMode: !prev.compareMode,
      comparisonCampaigns: !prev.compareMode ? [] : prev.comparisonCampaigns
    }));
  }, []);

  // Adicionar campanha para comparação
  const addToComparison = useCallback((campaign: CampaignMetrics) => {
    setState(prev => {
      if (prev.comparisonCampaigns.length >= 4) return prev; // Máximo 4 campanhas
      
      const alreadyAdded = prev.comparisonCampaigns.some(c => c.campaign_id === campaign.campaign_id);
      if (alreadyAdded) return prev;
      
      return {
        ...prev,
        comparisonCampaigns: [...prev.comparisonCampaigns, campaign]
      };
    });
  }, []);

  // Remover campanha da comparação
  const removeFromComparison = useCallback((campaignId: string) => {
    setState(prev => ({
      ...prev,
      comparisonCampaigns: prev.comparisonCampaigns.filter(c => c.campaign_id !== campaignId)
    }));
  }, []);

  // Análise e insights das campanhas
  const campaignInsights: CampaignInsights = useMemo(() => {
    const { campaigns } = state;
    
    if (campaigns.length === 0) {
      return {
        bestPerforming: { byROAS: null, byCTR: null, byEngagement: null, byConversions: null },
        averages: { roas: 0, ctr: 0, cpa: 0, engagement_rate: 0 },
        recommendations: [],
        alerts: []
      };
    }

    // Identificar melhores campanhas por métrica
    const bestPerforming = {
      byROAS: campaigns.reduce((best, current) => current.roas > best.roas ? current : best),
      byCTR: campaigns.reduce((best, current) => current.ctr > best.ctr ? current : best),
      byEngagement: campaigns.reduce((best, current) => 
        current.engagement_rate > best.engagement_rate ? current : best
      ),
      byConversions: campaigns.reduce((best, current) => 
        current.conversions > best.conversions ? current : best
      )
    };

    // Calcular médias
    const totalCampaigns = campaigns.length;
    const averages = {
      roas: Number((campaigns.reduce((sum, c) => sum + c.roas, 0) / totalCampaigns).toFixed(2)),
      ctr: Number((campaigns.reduce((sum, c) => sum + c.ctr, 0) / totalCampaigns).toFixed(2)),
      cpa: Number((campaigns.reduce((sum, c) => sum + c.cpa, 0) / totalCampaigns).toFixed(2)),
      engagement_rate: Number((campaigns.reduce((sum, c) => sum + c.engagement_rate, 0) / totalCampaigns).toFixed(2))
    };

    // Gerar recomendações
    const recommendations: string[] = [];
    
    if (averages.ctr < 2.0) {
      recommendations.push('CTR geral abaixo da média. Teste novos criativos e copy');
    }
    
    if (averages.roas < 2.0) {
      recommendations.push('ROAS baixo. Revise segmentação e otimize landing pages');
    }
    
    const highCPACampaigns = campaigns.filter(c => c.cpa > averages.cpa * 1.5);
    if (highCPACampaigns.length > 0) {
      recommendations.push(`${highCPACampaigns.length} campanha(s) com CPA alto. Otimize ou pause`);
    }
    
    const lowEngagementCampaigns = campaigns.filter(c => c.engagement_rate < 3.0);
    if (lowEngagementCampaigns.length > 0) {
      recommendations.push('Campanhas com baixo engajamento. Teste conteúdo mais interativo');
    }

    // Gerar alertas
    const alerts: Array<{ type: 'warning' | 'success' | 'danger'; campaign: string; message: string }> = [];
    
    campaigns.forEach(campaign => {
      if (campaign.roas > 4.0) {
        alerts.push({
          type: 'success',
          campaign: campaign.campaign_name,
          message: `ROAS excelente: ${campaign.roas}x`
        });
      } else if (campaign.roas < 1.0) {
        alerts.push({
          type: 'danger',
          campaign: campaign.campaign_name,
          message: `ROAS negativo: ${campaign.roas}x`
        });
      }
      
      if (campaign.ctr < 1.0) {
        alerts.push({
          type: 'warning',
          campaign: campaign.campaign_name,
          message: `CTR baixo: ${campaign.ctr}%`
        });
      }
      
      if (campaign.conversions === 0 && campaign.spend > 100) {
        alerts.push({
          type: 'danger',
          campaign: campaign.campaign_name,
          message: 'Nenhuma conversão com gasto significativo'
        });
      }
    });

    return {
      bestPerforming,
      averages,
      recommendations,
      alerts
    };
  }, [state.campaigns]);

  // Comparação detalhada entre campanhas selecionadas
  const getComparisonAnalysis = useCallback(() => {
    const { comparisonCampaigns } = state;
    
    if (comparisonCampaigns.length < 2) return null;

    const metrics = ['impressions', 'clicks', 'conversions', 'spend', 'ctr', 'cpa', 'roas', 'engagement_rate'];
    
    return metrics.map(metric => {
      const values = comparisonCampaigns.map(campaign => ({
        campaign: campaign.campaign_name,
        value: campaign[metric as keyof CampaignMetrics] as number
      }));
      
      const winner = values.reduce((best, current) => {
        // Para CPA, menor é melhor
        if (metric === 'cpa') {
          return current.value < best.value ? current : best;
        }
        // Para outras métricas, maior é melhor
        return current.value > best.value ? current : best;
      });
      
      return {
        metric,
        values,
        winner: winner.campaign,
        winnerValue: winner.value
      };
    });
  }, [state.comparisonCampaigns]);

  // Obter tendências de performance
  const getPerformanceTrends = useCallback(() => {
    const { campaigns } = state;
    
    // Simular tendências baseadas nos dados atuais
    return campaigns.map(campaign => {
      const trendDirection = Math.random() > 0.5 ? 'up' : 'down';
      const trendPercentage = Math.random() * 20; // 0-20% de variação
      
      return {
        campaign_id: campaign.campaign_id,
        campaign_name: campaign.campaign_name,
        trends: {
          impressions: { direction: trendDirection, percentage: trendPercentage },
          clicks: { direction: Math.random() > 0.5 ? 'up' : 'down', percentage: Math.random() * 15 },
          conversions: { direction: Math.random() > 0.5 ? 'up' : 'down', percentage: Math.random() * 25 },
          ctr: { direction: Math.random() > 0.5 ? 'up' : 'down', percentage: Math.random() * 10 },
          roas: { direction: Math.random() > 0.5 ? 'up' : 'down', percentage: Math.random() * 30 }
        }
      };
    });
  }, [state.campaigns]);

  // Sugestões de otimização por campanha
  const getOptimizationSuggestions = useCallback((campaign: CampaignMetrics) => {
    const suggestions: string[] = [];
    
    if (campaign.ctr < 2.0) {
      suggestions.push('Teste diferentes headlines e descrições para melhorar CTR');
      suggestions.push('Experimente imagens mais chamativas ou vídeos');
    }
    
    if (campaign.cpa > campaignInsights.averages.cpa * 1.3) {
      suggestions.push('Refine a segmentação para reduzir CPA');
      suggestions.push('Otimize a página de destino para melhor conversão');
    }
    
    if (campaign.roas < 2.0) {
      suggestions.push('Revise a estratégia de lances');
      suggestions.push('Teste diferentes públicos-alvo');
    }
    
    if (campaign.engagement_rate < 4.0) {
      suggestions.push('Crie conteúdo mais interativo e engajante');
      suggestions.push('Use calls-to-action mais persuasivos');
    }
    
    if (campaign.conversions === 0) {
      suggestions.push('Verifique o pixel de conversão');
      suggestions.push('Analise a experiência do usuário na landing page');
      suggestions.push('Considere alterar o objetivo da campanha');
    }

    return suggestions;
  }, [campaignInsights.averages]);

  return {
    ...state,
    campaignInsights,
    
    // Funções principais
    loadCampaigns,
    selectCampaign,
    
    // Comparação
    toggleCompareMode,
    addToComparison,
    removeFromComparison,
    getComparisonAnalysis,
    
    // Análises avançadas
    getPerformanceTrends,
    getOptimizationSuggestions
  };
}