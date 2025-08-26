/**
 * Data Provider Service - Woof Marketing Platform
 * 
 * Sistema híbrido de providers de dados que permite alternar entre:
 * - Dados mockados (desenvolvimento/testing)
 * - Dados reais do Supabase (produção)
 * 
 * USUÁRIOS sempre vêm do Supabase Auth (conforme requisito)
 * Demais entidades podem ser mockadas ou reais via environment variables
 */

import { AnamneseDigital } from '@/lib/types/anamnese';

// Definindo interface BrandManual temporária até ser criada
export interface BrandManual {
  id: string;
  brand_id: string;
  user_id: string;
  title: string;
  chapters: any[];
  created_at: string;
  updated_at: string;
}

// ==================== INTERFACES DOS PROVIDERS ====================

export interface AnamneseProvider {
  getAll(userId: string): Promise<AnamneseDigital[]>;
  getById(id: string, userId: string): Promise<AnamneseDigital | null>;
  getByUrl(url: string, userId: string): Promise<AnamneseDigital | null>;
  create(data: Omit<AnamneseDigital, 'id' | 'created_at' | 'updated_at'>): Promise<AnamneseDigital>;
  update(id: string, data: Partial<AnamneseDigital>): Promise<AnamneseDigital>;
  delete(id: string): Promise<void>;
}

export interface BrandManualProvider {
  getAll(userId: string): Promise<BrandManual[]>;
  getById(id: string, userId: string): Promise<BrandManual | null>;
  getByBrandId(brandId: string, userId: string): Promise<BrandManual | null>;
  create(data: Omit<BrandManual, 'id' | 'created_at' | 'updated_at'>): Promise<BrandManual>;
  update(id: string, data: Partial<BrandManual>): Promise<BrandManual>;
  delete(id: string): Promise<void>;
}

export interface CampaignProvider {
  getAll(userId: string): Promise<any[]>;
  getById(id: string, userId: string): Promise<any | null>;
  getByType(type: string, userId: string): Promise<any[]>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}

export interface ContentProvider {
  getVariants(campaignId: string): Promise<any[]>;
  generateVariant(prompt: string, brandVoice: any): Promise<any>;
  validateContent(content: string): Promise<any>;
}

export interface AnalyticsProvider {
  getPerformanceReport(dateRange: string): Promise<any>;
  getCampaignMetrics(campaignId: string): Promise<any>;
  getDashboardData(userId: string): Promise<any>;
}

// ==================== INTERFACE PRINCIPAL ====================

export interface DataProvider {
  anamneses: AnamneseProvider;
  brandManuals: BrandManualProvider;
  campaigns: CampaignProvider;
  content: ContentProvider;
  analytics: AnalyticsProvider;
}

// ==================== FACTORY DE PROVIDERS ====================

export class DataProviderFactory {
  private static instance: DataProvider | null = null;

  static getInstance(): DataProvider {
    if (!this.instance) {
      this.instance = this.createProvider();
    }
    return this.instance;
  }

  static createProvider(): DataProvider {
    const useMocks = this.shouldUseMocks();
    
    console.log('🏭 DataProviderFactory: Creating provider...', {
      useMocks,
      NODE_ENV: process.env.NODE_ENV,
      MOCK_DATA_ENABLED: process.env.MOCK_DATA_ENABLED,
    });
    
    if (useMocks) {
      // Import dinâmico para evitar bundling desnecessário
      const { MockDataProvider } = require('./mock-data-provider');
      console.log('🎭 DataProviderFactory: Using MockDataProvider');
      return new MockDataProvider();
    } else {
      const { SupabaseDataProvider } = require('./supabase-data-provider');
      console.log('🗄️ DataProviderFactory: Using SupabaseDataProvider');
      return new SupabaseDataProvider();
    }
  }

  private static shouldUseMocks(): boolean {
    // Em desenvolvimento, sempre use mocks por padrão
    if (process.env.NODE_ENV === 'development') {
      // Permite override via environment variable
      return process.env.MOCK_DATA_ENABLED !== 'false';
    }
    
    // Em produção, só usa mocks se explicitamente habilitado
    return process.env.MOCK_DATA_ENABLED === 'true';
  }

  static isMockMode(): boolean {
    return this.shouldUseMocks();
  }

  static resetInstance(): void {
    this.instance = null;
  }

  static getProviderInfo(): { type: 'mock' | 'supabase', environment: string } {
    return {
      type: this.shouldUseMocks() ? 'mock' : 'supabase',
      environment: process.env.NODE_ENV || 'unknown'
    };
  }
}

// ==================== HOOK HELPER ====================

export function useDataProvider(): DataProvider {
  return DataProviderFactory.getInstance();
}

// ==================== TIPOS AUXILIARES ====================

export type ProviderType = 'mock' | 'supabase';

export interface ProviderConfig {
  type: ProviderType;
  environment: string;
  mockDataEnabled: boolean;
  mockAiEnabled: boolean;
  mockAnalyticsEnabled: boolean;
}

export function getProviderConfig(): ProviderConfig {
  return {
    type: DataProviderFactory.isMockMode() ? 'mock' : 'supabase',
    environment: process.env.NODE_ENV || 'unknown',
    mockDataEnabled: process.env.MOCK_DATA_ENABLED !== 'false',
    mockAiEnabled: process.env.MOCK_AI_ENABLED !== 'false',
    mockAnalyticsEnabled: process.env.MOCK_ANALYTICS_ENABLED !== 'false',
  };
}