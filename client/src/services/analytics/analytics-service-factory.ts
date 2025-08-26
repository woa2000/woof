/**
 * Analytics Service Factory
 * 
 * Factory pattern para gerenciar provedores de analytics
 * Permite alternar entre analytics real e mock para desenvolvimento
 */

import { MockAnalyticsProvider } from './mock-analytics-provider';
import type { 
  AnalyticsTimeRange,
  MetricDataPoint,
  CampaignMetrics,
  SocialMetrics,
  BusinessMetrics,
  CompetitorAnalysis
} from './mock-analytics-provider';

export interface AnalyticsService {
  // Séries temporais
  generateTimeSeries(
    metric: string,
    timeRange: AnalyticsTimeRange,
    baseValue?: number,
    volatility?: number,
    trend?: number
  ): MetricDataPoint[];

  // Métricas específicas
  getCampaignMetrics(timeRange: AnalyticsTimeRange): Promise<CampaignMetrics[]>;
  getSocialMetrics(): Promise<SocialMetrics[]>;
  getBusinessMetrics(timeRange: AnalyticsTimeRange): Promise<BusinessMetrics[]>;
  getCompetitorAnalysis(): Promise<CompetitorAnalysis[]>;

  // Dashboard consolidado
  getDashboardData(timeRange: AnalyticsTimeRange): Promise<any>;
  getChannelROIReport(): Promise<any[]>;
  getCustomerJourneyAnalytics(): Promise<any>;

  // Utilitários
  clearCache(): void;
  getCacheStats(): { size: number; keys: string[] };
}

// Placeholder para futuro provedor real de analytics
class GoogleAnalyticsProvider implements AnalyticsService {
  generateTimeSeries(): MetricDataPoint[] {
    throw new Error('Google Analytics Provider não implementado ainda');
  }

  async getCampaignMetrics(): Promise<CampaignMetrics[]> {
    throw new Error('Google Analytics Provider não implementado ainda');
  }

  async getSocialMetrics(): Promise<SocialMetrics[]> {
    throw new Error('Google Analytics Provider não implementado ainda');
  }

  async getBusinessMetrics(): Promise<BusinessMetrics[]> {
    throw new Error('Google Analytics Provider não implementado ainda');
  }

  async getCompetitorAnalysis(): Promise<CompetitorAnalysis[]> {
    throw new Error('Google Analytics Provider não implementado ainda');
  }

  async getDashboardData(): Promise<any> {
    throw new Error('Google Analytics Provider não implementado ainda');
  }

  async getChannelROIReport(): Promise<any[]> {
    throw new Error('Google Analytics Provider não implementado ainda');
  }

  async getCustomerJourneyAnalytics(): Promise<any> {
    throw new Error('Google Analytics Provider não implementado ainda');
  }

  clearCache(): void {
    // Implementar quando necessário
  }

  getCacheStats(): { size: number; keys: string[] } {
    return { size: 0, keys: [] };
  }
}

export class AnalyticsServiceFactory {
  private static instance: AnalyticsService | null = null;

  static getAnalyticsService(): AnalyticsService {
    if (!this.instance) {
      const useMockAnalytics = process.env.NEXT_PUBLIC_MOCK_ANALYTICS_ENABLED === 'true' || 
                              process.env.NODE_ENV === 'development';

      if (useMockAnalytics) {
        console.log('📊 Usando Mock Analytics Provider para desenvolvimento');
        this.instance = new MockAnalyticsProvider();
      } else {
        console.log('🔗 Usando Google Analytics Provider para produção');
        this.instance = new GoogleAnalyticsProvider();
      }
    }

    return this.instance;
  }

  // Método para testes - permite injetar um provedor específico
  static setAnalyticsService(service: AnalyticsService): void {
    this.instance = service;
  }

  // Reset do singleton (útil para testes)
  static reset(): void {
    this.instance = null;
  }
}

// Hook personalizado para usar o serviço de analytics
export function useAnalyticsService(): AnalyticsService {
  return AnalyticsServiceFactory.getAnalyticsService();
}

// Utilitários para criação de time ranges
export const TimeRangeUtils = {
  last7Days(): AnalyticsTimeRange {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    
    return {
      start,
      end,
      period: 'day'
    };
  },

  last30Days(): AnalyticsTimeRange {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    return {
      start,
      end,
      period: 'day'
    };
  },

  last3Months(): AnalyticsTimeRange {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    
    return {
      start,
      end,
      period: 'week'
    };
  },

  lastYear(): AnalyticsTimeRange {
    const end = new Date();
    const start = new Date();
    start.setFullYear(start.getFullYear() - 1);
    
    return {
      start,
      end,
      period: 'month'
    };
  },

  custom(startDate: Date, endDate: Date, period: 'day' | 'week' | 'month' = 'day'): AnalyticsTimeRange {
    return {
      start: startDate,
      end: endDate,
      period
    };
  },

  thisMonth(): AnalyticsTimeRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date();
    
    return {
      start,
      end,
      period: 'day'
    };
  },

  thisYear(): AnalyticsTimeRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date();
    
    return {
      start,
      end,
      period: 'month'
    };
  }
};

// Exportar tipos principais para uso em outros arquivos
export type {
  AnalyticsTimeRange,
  MetricDataPoint,
  CampaignMetrics,
  SocialMetrics,
  BusinessMetrics,
  CompetitorAnalysis
} from './mock-analytics-provider';