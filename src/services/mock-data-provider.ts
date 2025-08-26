/**
 * Mock Data Provider - Woof Marketing Platform
 * 
 * Implementa todas as interfaces do DataProvider usando dados mockados
 * do sistema src/lib/mocks/ para desenvolvimento e testes
 */

import {
  DataProvider,
  AnamneseProvider,
  BrandManualProvider,
  CampaignProvider,
  ContentProvider,
  AnalyticsProvider,
  BrandManual
} from './data-provider.service';

import { AnamneseDigital } from '@/lib/types/anamnese';

// Imports dos mocks existentes
import { mockAnamneseVeterinary, createMockAnamnese } from '@/lib/mocks/anamnese';
import { mockProfiles, mockUsers } from '@/lib/mocks/users';

export class MockAnamneseProvider implements AnamneseProvider {
  private anamneses: AnamneseDigital[] = [];

  async getAll(userId: string): Promise<AnamneseDigital[]> {
    // Simula delay de rede
    await this.mockDelay(200);
    
    console.log(`🔍 MockAnamneseProvider.getAll: Buscando anamneses para usuário ${userId}`);
    console.log(`🔍 Total de anamneses no mock: ${this.anamneses.length}`);
    
    // Retorna anamneses mockadas para o usuário
    const userAnamneses = this.anamneses.filter(a => a.user_id === userId);
    console.log(`🔍 Anamneses encontradas para o usuário: ${userAnamneses.length}`);
    
    return userAnamneses;
  }

  async getById(id: string, userId: string): Promise<AnamneseDigital | null> {
    await this.mockDelay(150);
    
    const anamnese = this.anamneses.find(a => a.id === id && a.user_id === userId);
    return anamnese || null;
  }

  async getByUrl(url: string, userId: string): Promise<AnamneseDigital | null> {
    await this.mockDelay(300);
    
    const anamnese = this.anamneses.find(a => a.url_analisada === url && a.user_id === userId);
    return anamnese || null;
  }

  async create(data: Omit<AnamneseDigital, 'id' | 'created_at' | 'updated_at'>): Promise<AnamneseDigital> {
    await this.mockDelay(800); // Simula processamento mais longo
    
    const newAnamnese: AnamneseDigital = {
      ...data,
      id: `mock-anamnese-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.anamneses.push(newAnamnese);
    return newAnamnese;
  }

  async update(id: string, data: Partial<AnamneseDigital>): Promise<AnamneseDigital> {
    await this.mockDelay(400);
    
    const index = this.anamneses.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Anamnese não encontrada');
    }
    
    this.anamneses[index] = {
      ...this.anamneses[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    return this.anamneses[index];
  }

  async delete(id: string): Promise<void> {
    await this.mockDelay(300);
    
    const index = this.anamneses.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Anamnese não encontrada');
    }
    
    this.anamneses.splice(index, 1);
  }

  private async mockDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para popular com dados iniciais mockados
  populateWithMockData(userId: string) {
    if (this.anamneses.length === 0) {
      // Cria uma anamnese mockada para o usuário
      const mockAnamnese = createMockAnamnese({
        user_id: userId,
        id: `mock-anamnese-${userId}-1`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      
      // Também adiciona a anamnese veterinária pré-definida
      const vetAnamnese = {
        ...mockAnamneseVeterinary,
        id: `mock-anamnese-${userId}-vet`,
        user_id: userId,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      };
      
      this.anamneses.push(mockAnamnese as AnamneseDigital);
      this.anamneses.push(vetAnamnese as AnamneseDigital);
      
      console.log(`🎭 MockAnamneseProvider: ${this.anamneses.length} anamneses mockadas criadas para usuário ${userId}`);
    }
  }
}

export class MockBrandManualProvider implements BrandManualProvider {
  private brandManuals: BrandManual[] = [];

  async getAll(userId: string): Promise<BrandManual[]> {
    await this.mockDelay(200);
    
    console.log(`🔍 MockBrandManualProvider.getAll: Buscando manuais para usuário ${userId}`);
    console.log(`🔍 Total de manuais no mock: ${this.brandManuals.length}`);
    
    const userManuals = this.brandManuals.filter(bm => bm.user_id === userId);
    console.log(`🔍 Manuais encontrados para o usuário: ${userManuals.length}`);
    
    return userManuals;
  }

  async getById(id: string, userId: string): Promise<BrandManual | null> {
    await this.mockDelay(150);
    const manual = this.brandManuals.find(bm => bm.id === id && bm.user_id === userId);
    return manual || null;
  }

  async getByBrandId(brandId: string, userId: string): Promise<BrandManual | null> {
    await this.mockDelay(150);
    const manual = this.brandManuals.find(bm => bm.brand_id === brandId && bm.user_id === userId);
    return manual || null;
  }

  async create(data: Omit<BrandManual, 'id' | 'created_at' | 'updated_at'>): Promise<BrandManual> {
    await this.mockDelay(600);
    
    const newManual: BrandManual = {
      ...data,
      id: `mock-manual-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.brandManuals.push(newManual);
    return newManual;
  }

  async update(id: string, data: Partial<BrandManual>): Promise<BrandManual> {
    await this.mockDelay(400);
    
    const index = this.brandManuals.findIndex(bm => bm.id === id);
    if (index === -1) {
      throw new Error('Manual da marca não encontrado');
    }
    
    this.brandManuals[index] = {
      ...this.brandManuals[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    return this.brandManuals[index];
  }

  async delete(id: string): Promise<void> {
    await this.mockDelay(300);
    
    const index = this.brandManuals.findIndex(bm => bm.id === id);
    if (index === -1) {
      throw new Error('Manual da marca não encontrado');
    }
    
    this.brandManuals.splice(index, 1);
  }

  private async mockDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para popular com dados iniciais mockados
  populateWithMockData(userId: string) {
    if (this.brandManuals.length === 0) {
      // Import dos mocks existentes
      const { mockBrandManualVet, mockBrandManualPetShop } = require('@/lib/mocks/brand-manual');
      
      // Criar manuais mockados para o usuário
      const vetManual: BrandManual = {
        id: `mock-manual-${userId}-vet`,
        brand_id: `mock-brand-${userId}-vet`,
        user_id: userId,
        title: 'Manual da Marca - Clínica Veterinária VetAmor',
        chapters: mockBrandManualVet.manual_data.chapters,
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
        updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
      };

      const petShopManual: BrandManual = {
        id: `mock-manual-${userId}-petshop`,
        brand_id: `mock-brand-${userId}-petshop`, 
        user_id: userId,
        title: 'Manual da Marca - Pet Shop Premium',
        chapters: mockBrandManualPetShop.manual_data.chapters,
        created_at: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
        updated_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
      };
      
      this.brandManuals.push(vetManual, petShopManual);
      
      console.log(`📘 MockBrandManualProvider: ${this.brandManuals.length} manuais mockados criados para usuário ${userId}`);
    }
  }
}

export class MockCampaignProvider implements CampaignProvider {
  private campaigns: any[] = [];

  async getAll(userId: string): Promise<any[]> {
    await this.mockDelay(200);
    return this.campaigns.filter(c => c.user_id === userId);
  }

  async getById(id: string, userId: string): Promise<any | null> {
    await this.mockDelay(150);
    const campaign = this.campaigns.find(c => c.id === id && c.user_id === userId);
    return campaign || null;
  }

  async getByType(type: string, userId: string): Promise<any[]> {
    await this.mockDelay(200);
    return this.campaigns.filter(c => c.type === type && c.user_id === userId);
  }

  async create(data: any): Promise<any> {
    await this.mockDelay(500);
    
    const newCampaign = {
      ...data,
      id: `mock-campaign-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  async update(id: string, data: any): Promise<any> {
    await this.mockDelay(400);
    
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Campanha não encontrada');
    }
    
    this.campaigns[index] = {
      ...this.campaigns[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    return this.campaigns[index];
  }

  async delete(id: string): Promise<void> {
    await this.mockDelay(300);
    
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Campanha não encontrada');
    }
    
    this.campaigns.splice(index, 1);
  }

  private async mockDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class MockContentProvider implements ContentProvider {
  async getVariants(campaignId: string): Promise<any[]> {
    await this.mockDelay(300);
    
    // Retorna variantes mockadas baseadas no campaign
    return [
      {
        id: `variant-${campaignId}-1`,
        campaign_id: campaignId,
        title: 'Variante Principal - Vacinação Pet',
        content: 'Proteja seu melhor amigo! 🐕 Vacinas essenciais com 30% de desconto.',
        platform: 'instagram',
        score: 0.87,
        created_at: new Date().toISOString()
      },
      {
        id: `variant-${campaignId}-2`,
        campaign_id: campaignId,
        title: 'Variante Alternativa - Cuidado Pet',
        content: 'Seu pet merece o melhor cuidado! Agende já a vacinação com desconto especial.',
        platform: 'facebook',
        score: 0.82,
        created_at: new Date().toISOString()
      }
    ];
  }

  async generateVariant(prompt: string, brandVoice: any): Promise<any> {
    await this.mockDelay(2000); // Simula tempo de geração da IA
    
    return {
      id: `generated-${Date.now()}`,
      content: `Conteúdo gerado para: ${prompt}. Tom de voz: ${brandVoice?.personality || 'profissional'}`,
      title: 'Conteúdo Gerado pela IA',
      score: Math.random() * 0.3 + 0.7, // Score entre 0.7 e 1.0
      tokens_used: Math.floor(Math.random() * 200) + 50,
      cost_estimate: 0.002,
      created_at: new Date().toISOString()
    };
  }

  async validateContent(content: string): Promise<any> {
    await this.mockDelay(500);
    
    // Mock de validação de compliance
    const containsVetTerms = /veterinário|médico|diagnóstico|tratamento/i.test(content);
    
    return {
      is_compliant: !containsVetTerms, // Simplificado: apenas check de termos médicos
      issues: containsVetTerms ? ['Conteúdo contém terminologia veterinária que requer disclaimers'] : [],
      score: containsVetTerms ? 0.3 : 0.95,
      suggestions: containsVetTerms ? ['Adicionar disclaimer sobre consulta veterinária'] : []
    };
  }

  private async mockDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class MockAnalyticsProvider implements AnalyticsProvider {
  async getPerformanceReport(dateRange: string): Promise<any> {
    await this.mockDelay(800);
    
    return {
      period: dateRange,
      campaigns: {
        total: 12,
        active: 8,
        performance_avg: 0.73
      },
      engagement: {
        likes: 1240,
        comments: 89,
        shares: 156,
        click_through_rate: 0.034
      },
      conversions: {
        leads_generated: 47,
        appointments_booked: 23,
        conversion_rate: 0.049
      },
      generated_at: new Date().toISOString()
    };
  }

  async getCampaignMetrics(campaignId: string): Promise<any> {
    await this.mockDelay(400);
    
    return {
      campaign_id: campaignId,
      impressions: Math.floor(Math.random() * 5000) + 1000,
      clicks: Math.floor(Math.random() * 200) + 50,
      conversions: Math.floor(Math.random() * 20) + 5,
      cost: Math.random() * 200 + 50,
      roas: Math.random() * 3 + 1.5,
      updated_at: new Date().toISOString()
    };
  }

  async getDashboardData(userId: string): Promise<any> {
    await this.mockDelay(600);
    
    return {
      user_id: userId,
      summary: {
        total_campaigns: 8,
        active_campaigns: 5,
        total_leads: 127,
        conversion_rate: 0.041
      },
      recent_activity: [
        {
          type: 'campaign_created',
          title: 'Campanha de Vacinação V+',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          type: 'lead_generated',
          title: 'Novo lead para consulta',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      performance_chart: this.generateMockChart()
    };
  }

  private generateMockChart() {
    const days = 30;
    const data = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      data.push({
        date: date.toISOString().split('T')[0],
        leads: Math.floor(Math.random() * 10) + 2,
        conversions: Math.floor(Math.random() * 5) + 1
      });
    }
    
    return data;
  }

  private async mockDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ==================== PROVIDER PRINCIPAL ====================

export class MockDataProvider implements DataProvider {
  public readonly anamneses: MockAnamneseProvider;
  public readonly brandManuals: MockBrandManualProvider;
  public readonly campaigns: MockCampaignProvider;
  public readonly content: MockContentProvider;
  public readonly analytics: MockAnalyticsProvider;

  constructor() {
    this.anamneses = new MockAnamneseProvider();
    this.brandManuals = new MockBrandManualProvider();
    this.campaigns = new MockCampaignProvider();
    this.content = new MockContentProvider();
    this.analytics = new MockAnalyticsProvider();
    
    console.log('🎭 MockDataProvider initialized - Todas as entidades usando dados mockados');
    console.log('🎭 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      MOCK_DATA_ENABLED: process.env.MOCK_DATA_ENABLED,
    });
  }

  // Método para popular dados iniciais para um usuário
  populateUserData(userId: string) {
    console.log(`🎭 MockDataProvider: Populando dados para usuário ${userId}`);
    
    // Popular anamneses
    this.anamneses.populateWithMockData(userId);
    
    // Popular manuais da marca
    this.brandManuals.populateWithMockData(userId);
    
    console.log(`✅ MockDataProvider: Dados mockados populados para usuário ${userId}`);
  }
}