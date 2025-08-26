/**
 * Mock Analytics Provider - Data Analyst Role
 * 
 * Simulação completa de analytics e métricas para desenvolvimento
 * Gera dados temporais realísticos para dashboards e relatórios
 */

export interface AnalyticsTimeRange {
  start: Date;
  end: Date;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface MetricDataPoint {
  timestamp: string;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface CampaignMetrics {
  campaign_id: string;
  campaign_name: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  cpa: number; // Cost per acquisition
  roas: number; // Return on ad spend
  reach: number;
  engagement_rate: number;
}

export interface SocialMetrics {
  platform: 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube';
  followers: number;
  following: number;
  posts_count: number;
  avg_engagement: number;
  reach: number;
  impressions: number;
  profile_visits: number;
  website_clicks: number;
}

export interface BusinessMetrics {
  period: string;
  leads_generated: number;
  appointments_scheduled: number;
  conversion_rate: number;
  customer_acquisition_cost: number;
  lifetime_value: number;
  revenue: number;
  retention_rate: number;
}

export interface CompetitorAnalysis {
  competitor_name: string;
  market_share: number;
  social_following: number;
  estimated_spend: number;
  content_volume: number;
  engagement_rate: number;
  trend_score: number;
}

export class MockAnalyticsProvider {
  private dataCache: Map<string, any> = new Map();
  private readonly businessTypes = [
    'veterinary_clinic',
    'pet_shop', 
    'grooming_salon',
    'pet_training',
    'pet_hotel',
    'veterinary_lab'
  ];

  // Gerar séries temporais realísticas
  generateTimeSeries(
    metric: string,
    timeRange: AnalyticsTimeRange,
    baseValue: number = 100,
    volatility: number = 0.2,
    trend: number = 0.05
  ): MetricDataPoint[] {
    const cacheKey = `${metric}_${timeRange.start.toISOString()}_${timeRange.end.toISOString()}`;
    
    if (this.dataCache.has(cacheKey)) {
      return this.dataCache.get(cacheKey);
    }

    const dataPoints: MetricDataPoint[] = [];
    const totalDays = Math.ceil((timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24));
    
    let currentValue = baseValue;
    const current = new Date(timeRange.start);
    
    for (let i = 0; i < totalDays; i++) {
      // Aplicar tendência gradual
      const trendFactor = 1 + (trend * i / totalDays);
      
      // Adicionar sazonalidade (picos nos fins de semana para negócios pet)
      const dayOfWeek = current.getDay();
      const weekendBonus = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1.0;
      
      // Volatilidade aleatória
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;
      
      // Padrões específicos por métrica
      let metricMultiplier = 1;
      if (metric === 'appointments' && (dayOfWeek === 1 || dayOfWeek === 0)) {
        metricMultiplier = 0.3; // Menos agendamentos aos domingos/segundas
      }
      if (metric === 'social_engagement' && dayOfWeek >= 1 && dayOfWeek <= 5) {
        metricMultiplier = 1.4; // Mais engajamento em dias úteis
      }
      
      currentValue = baseValue * trendFactor * weekendBonus * randomFactor * metricMultiplier;
      
      dataPoints.push({
        timestamp: current.toISOString(),
        value: Math.round(Math.max(0, currentValue)),
        metadata: {
          dayOfWeek,
          weekendBonus,
          trendFactor: trendFactor.toFixed(3)
        }
      });
      
      current.setDate(current.getDate() + 1);
    }

    this.dataCache.set(cacheKey, dataPoints);
    return dataPoints;
  }

  // Métricas de campanhas publicitárias
  async getCampaignMetrics(timeRange: AnalyticsTimeRange): Promise<CampaignMetrics[]> {
    await this.mockDelay(800);

    const campaigns: CampaignMetrics[] = [
      {
        campaign_id: 'camp_001',
        campaign_name: 'Campanha Consulta Preventiva - Cães',
        impressions: this.randomBetween(15000, 25000),
        clicks: this.randomBetween(800, 1200),
        conversions: this.randomBetween(40, 80),
        spend: this.randomBetween(200, 500),
        ctr: 0, cpc: 0, cpa: 0, roas: 0, // Calculados abaixo
        reach: this.randomBetween(10000, 18000),
        engagement_rate: this.randomBetween(2.5, 6.8)
      },
      {
        campaign_id: 'camp_002', 
        campaign_name: 'Promoção Vacinação Felina',
        impressions: this.randomBetween(8000, 15000),
        clicks: this.randomBetween(400, 700),
        conversions: this.randomBetween(20, 50),
        spend: this.randomBetween(150, 350),
        ctr: 0, cpc: 0, cpa: 0, roas: 0,
        reach: this.randomBetween(6000, 12000),
        engagement_rate: this.randomBetween(3.2, 7.1)
      },
      {
        campaign_id: 'camp_003',
        campaign_name: 'Banho e Tosa - Verão 2024',
        impressions: this.randomBetween(12000, 20000),
        clicks: this.randomBetween(600, 1000),
        conversions: this.randomBetween(30, 70),
        spend: this.randomBetween(180, 400),
        ctr: 0, cpc: 0, cpa: 0, roas: 0,
        reach: this.randomBetween(8000, 15000),
        engagement_rate: this.randomBetween(4.1, 8.2)
      },
      {
        campaign_id: 'camp_004',
        campaign_name: 'Ração Premium - Desconto Especial',
        impressions: this.randomBetween(20000, 35000),
        clicks: this.randomBetween(1200, 2000),
        conversions: this.randomBetween(80, 150),
        spend: this.randomBetween(300, 700),
        ctr: 0, cpc: 0, cpa: 0, roas: 0,
        reach: this.randomBetween(15000, 28000),
        engagement_rate: this.randomBetween(5.2, 9.5)
      }
    ];

    // Calcular métricas derivadas
    campaigns.forEach(campaign => {
      campaign.ctr = Number(((campaign.clicks / campaign.impressions) * 100).toFixed(2));
      campaign.cpc = Number((campaign.spend / campaign.clicks).toFixed(2));
      campaign.cpa = campaign.conversions > 0 ? Number((campaign.spend / campaign.conversions).toFixed(2)) : 0;
      
      // ROAS mockado (valor médio por conversão estimado)
      const avgOrderValue = this.randomBetween(80, 250);
      const revenue = campaign.conversions * avgOrderValue;
      campaign.roas = campaign.spend > 0 ? Number((revenue / campaign.spend).toFixed(2)) : 0;
    });

    return campaigns;
  }

  // Métricas de redes sociais
  async getSocialMetrics(): Promise<SocialMetrics[]> {
    await this.mockDelay(600);

    return [
      {
        platform: 'instagram',
        followers: this.randomBetween(2500, 8000),
        following: this.randomBetween(300, 800),
        posts_count: this.randomBetween(150, 400),
        avg_engagement: this.randomBetween(3.2, 7.8),
        reach: this.randomBetween(1500, 5000),
        impressions: this.randomBetween(3000, 12000),
        profile_visits: this.randomBetween(200, 600),
        website_clicks: this.randomBetween(50, 180)
      },
      {
        platform: 'facebook',
        followers: this.randomBetween(1800, 5500),
        following: 0, // Facebook pages não seguem
        posts_count: this.randomBetween(100, 300),
        avg_engagement: this.randomBetween(2.1, 5.5),
        reach: this.randomBetween(1200, 4200),
        impressions: this.randomBetween(2500, 8500),
        profile_visits: this.randomBetween(150, 400),
        website_clicks: this.randomBetween(80, 250)
      },
      {
        platform: 'tiktok',
        followers: this.randomBetween(500, 3200),
        following: this.randomBetween(100, 400),
        posts_count: this.randomBetween(50, 150),
        avg_engagement: this.randomBetween(8.5, 18.2),
        reach: this.randomBetween(800, 2800),
        impressions: this.randomBetween(2000, 15000),
        profile_visits: this.randomBetween(100, 350),
        website_clicks: this.randomBetween(20, 120)
      }
    ];
  }

  // Métricas de negócio
  async getBusinessMetrics(timeRange: AnalyticsTimeRange): Promise<BusinessMetrics[]> {
    await this.mockDelay(500);

    const periods = this.generatePeriods(timeRange);
    
    return periods.map(period => ({
      period,
      leads_generated: this.randomBetween(15, 45),
      appointments_scheduled: this.randomBetween(8, 25),
      conversion_rate: this.randomBetween(15, 35),
      customer_acquisition_cost: this.randomBetween(25, 85),
      lifetime_value: this.randomBetween(350, 850),
      revenue: this.randomBetween(2500, 8500),
      retention_rate: this.randomBetween(65, 88)
    }));
  }

  // Análise da concorrência
  async getCompetitorAnalysis(): Promise<CompetitorAnalysis[]> {
    await this.mockDelay(1200);

    return [
      {
        competitor_name: 'VetCare Premium',
        market_share: this.randomBetween(15, 25),
        social_following: this.randomBetween(5000, 12000),
        estimated_spend: this.randomBetween(800, 1500),
        content_volume: this.randomBetween(20, 40),
        engagement_rate: this.randomBetween(2.8, 6.2),
        trend_score: this.randomBetween(65, 85)
      },
      {
        competitor_name: 'Pet Shop do Bairro',
        market_share: this.randomBetween(8, 18),
        social_following: this.randomBetween(2500, 8000),
        estimated_spend: this.randomBetween(400, 900),
        content_volume: this.randomBetween(15, 30),
        engagement_rate: this.randomBetween(3.5, 7.8),
        trend_score: this.randomBetween(55, 75)
      },
      {
        competitor_name: 'Spa Pet Deluxe',
        market_share: this.randomBetween(5, 12),
        social_following: this.randomBetween(1800, 6500),
        estimated_spend: this.randomBetween(300, 700),
        content_volume: this.randomBetween(12, 25),
        engagement_rate: this.randomBetween(4.2, 9.1),
        trend_score: this.randomBetween(60, 80)
      },
      {
        competitor_name: 'Clínica Animal 24h',
        market_share: this.randomBetween(12, 22),
        social_following: this.randomBetween(4000, 10000),
        estimated_spend: this.randomBetween(600, 1200),
        content_volume: this.randomBetween(18, 35),
        engagement_rate: this.randomBetween(2.1, 5.4),
        trend_score: this.randomBetween(70, 90)
      }
    ];
  }

  // Dashboard consolidado
  async getDashboardData(timeRange: AnalyticsTimeRange): Promise<{
    overview: {
      total_leads: number;
      total_revenue: number;
      avg_cpa: number;
      growth_rate: number;
    };
    campaigns: CampaignMetrics[];
    social: SocialMetrics[];
    business: BusinessMetrics[];
    timeSeries: {
      leads: MetricDataPoint[];
      revenue: MetricDataPoint[];
      appointments: MetricDataPoint[];
      social_engagement: MetricDataPoint[];
    };
  }> {
    await this.mockDelay(1500);

    const [campaigns, social, business] = await Promise.all([
      this.getCampaignMetrics(timeRange),
      this.getSocialMetrics(),
      this.getBusinessMetrics(timeRange)
    ]);

    const totalLeads = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const totalRevenue = business.reduce((sum, b) => sum + b.revenue, 0);
    const avgCpa = campaigns.reduce((sum, c) => sum + c.cpa, 0) / campaigns.length;

    return {
      overview: {
        total_leads: totalLeads,
        total_revenue: totalRevenue,
        avg_cpa: Number(avgCpa.toFixed(2)),
        growth_rate: this.randomBetween(8, 25)
      },
      campaigns,
      social,
      business,
      timeSeries: {
        leads: this.generateTimeSeries('leads', timeRange, 15, 0.3, 0.1),
        revenue: this.generateTimeSeries('revenue', timeRange, 2500, 0.25, 0.15),
        appointments: this.generateTimeSeries('appointments', timeRange, 12, 0.4, 0.08),
        social_engagement: this.generateTimeSeries('social_engagement', timeRange, 250, 0.35, 0.12)
      }
    };
  }

  // Relatório de ROI por canal
  async getChannelROIReport(): Promise<Array<{
    channel: string;
    spend: number;
    revenue: number;
    roi: number;
    leads: number;
    cost_per_lead: number;
  }>> {
    await this.mockDelay(700);

    const channels = [
      { name: 'Google Ads', baseSpend: 800, baseRevenue: 2400 },
      { name: 'Facebook Ads', baseSpend: 600, baseRevenue: 1800 },
      { name: 'Instagram Ads', baseSpend: 500, baseRevenue: 1650 },
      { name: 'Email Marketing', baseSpend: 100, baseRevenue: 800 },
      { name: 'Organic Social', baseSpend: 150, baseRevenue: 500 },
      { name: 'Referral', baseSpend: 50, baseRevenue: 400 }
    ];

    return channels.map(channel => {
      const spend = this.randomBetween(channel.baseSpend * 0.8, channel.baseSpend * 1.2);
      const revenue = this.randomBetween(channel.baseRevenue * 0.7, channel.baseRevenue * 1.3);
      const leads = this.randomBetween(10, 50);
      
      return {
        channel: channel.name,
        spend,
        revenue,
        roi: Number(((revenue - spend) / spend * 100).toFixed(1)),
        leads,
        cost_per_lead: Number((spend / leads).toFixed(2))
      };
    });
  }

  // Análise de jornada do cliente
  async getCustomerJourneyAnalytics(): Promise<{
    awareness: number;
    consideration: number;
    conversion: number;
    retention: number;
    advocacy: number;
    avg_journey_time: number; // em dias
    top_touchpoints: Array<{ name: string; influence: number }>;
  }> {
    await this.mockDelay(900);

    return {
      awareness: this.randomBetween(1000, 3000),
      consideration: this.randomBetween(400, 800),
      conversion: this.randomBetween(80, 200),
      retention: this.randomBetween(50, 120),
      advocacy: this.randomBetween(15, 40),
      avg_journey_time: this.randomBetween(7, 21),
      top_touchpoints: [
        { name: 'Google Search', influence: this.randomBetween(25, 35) },
        { name: 'Instagram', influence: this.randomBetween(20, 30) },
        { name: 'Word of Mouth', influence: this.randomBetween(15, 25) },
        { name: 'Website', influence: this.randomBetween(10, 20) },
        { name: 'Email', influence: this.randomBetween(8, 18) }
      ]
    };
  }

  // Métodos auxiliares privados
  private async mockDelay(ms: number): Promise<void> {
    const delay = Math.random() * ms + ms * 0.5; // Variação de 50% - 150% do tempo base
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private randomBetween(min: number, max: number): number {
    return Number((Math.random() * (max - min) + min).toFixed(2));
  }

  private generatePeriods(timeRange: AnalyticsTimeRange): string[] {
    const periods: string[] = [];
    const current = new Date(timeRange.start);
    
    while (current <= timeRange.end) {
      if (timeRange.period === 'day') {
        periods.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      } else if (timeRange.period === 'week') {
        periods.push(`Semana de ${current.toLocaleDateString('pt-BR')}`);
        current.setDate(current.getDate() + 7);
      } else if (timeRange.period === 'month') {
        periods.push(current.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }));
        current.setMonth(current.getMonth() + 1);
      }
    }
    
    return periods;
  }

  // Limpar cache (útil para testes)
  clearCache(): void {
    this.dataCache.clear();
  }

  // Obter estatísticas do cache
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.dataCache.size,
      keys: Array.from(this.dataCache.keys())
    };
  }
}