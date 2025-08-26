/**
 * Supabase Data Provider - Woof Marketing Platform
 * 
 * Implementa todas as interfaces do DataProvider usando Supabase
 * para dados reais em produção (exceto users que sempre vêm do Supabase Auth)
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
import { supabase } from '@/lib/auth/supabase';
import { anamneseToDbFormat, dbToAnamneseFormat } from '@/lib/utils/anamnese-helpers';

export class SupabaseAnamneseProvider implements AnamneseProvider {
  async getAll(userId: string): Promise<AnamneseDigital[]> {
    const { data, error } = await supabase
      .from('anamneses_digitais')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Converter dados do banco para formato AnamneseDigital
    return (data || []).map(dbToAnamneseFormat);
  }

  async getById(id: string, userId: string): Promise<AnamneseDigital | null> {
    const { data, error } = await supabase
      .from('anamneses_digitais')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = não encontrado
    if (!data) return null;
    
    return dbToAnamneseFormat(data);
  }

  async getByUrl(url: string, userId: string): Promise<AnamneseDigital | null> {
    const { data, error } = await supabase
      .from('anamneses_digitais')
      .select('*')
      .eq('user_id', userId)
      .eq('url_analisada', url)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    return dbToAnamneseFormat(data);
  }

  async create(data: Omit<AnamneseDigital, 'id' | 'created_at' | 'updated_at'>): Promise<AnamneseDigital> {
    const dbData = anamneseToDbFormat(data as AnamneseDigital);
    
    const { data: insertedData, error } = await supabase
      .from('anamneses_digitais')
      .insert(dbData)
      .select()
      .single();

    if (error) throw error;
    
    return dbToAnamneseFormat(insertedData);
  }

  async update(id: string, data: Partial<AnamneseDigital>): Promise<AnamneseDigital> {
    // Para o update, simplesmente repassamos os campos como estão
    // pois o helper anamneseToDbFormat cuidará da conversão
    const updates: any = {
      ...data,
      updated_at: new Date().toISOString()
    };

    const { data: updatedData, error } = await supabase
      .from('anamneses_digitais')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return dbToAnamneseFormat(updatedData);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('anamneses_digitais')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export class SupabaseBrandManualProvider implements BrandManualProvider {
  async getAll(userId: string): Promise<BrandManual[]> {
    const { data, error } = await supabase
      .from('brand_manuals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  }

  async getById(id: string, userId: string): Promise<BrandManual | null> {
    const { data, error } = await supabase
      .from('brand_manuals')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    return data || null;
  }

  async getByBrandId(brandId: string, userId: string): Promise<BrandManual | null> {
    const { data, error } = await supabase
      .from('brand_manuals')
      .select('*')
      .eq('brand_id', brandId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    return data || null;
  }

  async create(data: Omit<BrandManual, 'id' | 'created_at' | 'updated_at'>): Promise<BrandManual> {
    const { data: insertedData, error } = await supabase
      .from('brand_manuals')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    return insertedData;
  }

  async update(id: string, data: Partial<BrandManual>): Promise<BrandManual> {
    const { data: updatedData, error } = await supabase
      .from('brand_manuals')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return updatedData;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('brand_manuals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export class SupabaseCampaignProvider implements CampaignProvider {
  async getAll(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  }

  async getById(id: string, userId: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    return data || null;
  }

  async getByType(type: string, userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('type', type)
      .eq('user_id', userId);

    if (error) throw error;
    
    return data || [];
  }

  async create(data: any): Promise<any> {
    const { data: insertedData, error } = await supabase
      .from('campaigns')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    return insertedData;
  }

  async update(id: string, data: any): Promise<any> {
    const { data: updatedData, error } = await supabase
      .from('campaigns')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return updatedData;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export class SupabaseContentProvider implements ContentProvider {
  async getVariants(campaignId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('content_variants')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  }

  async generateVariant(prompt: string, brandVoice: any): Promise<any> {
    // Aqui seria feita a integração real com OpenAI
    // Por enquanto, usar um placeholder que salva no banco
    
    const generatedContent = {
      content: `Conteúdo gerado para: ${prompt}`,
      title: 'Conteúdo Gerado',
      score: 0.85,
      tokens_used: 150,
      cost_estimate: 0.003,
    };

    // Salvar log da operação de IA
    const { data, error } = await supabase
      .from('ai_operations')
      .insert({
        operation_type: 'content_generation',
        prompt: prompt,
        response: generatedContent.content,
        tokens_used: generatedContent.tokens_used,
        cost: generatedContent.cost_estimate,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...generatedContent,
      id: data.id,
      created_at: data.created_at
    };
  }

  async validateContent(content: string): Promise<any> {
    // Integração com sistema de compliance
    // Por enquanto, uma validação básica
    
    const validation = {
      is_compliant: true,
      issues: [],
      score: 0.95,
      suggestions: []
    };

    // Salvar log da validação
    const { data, error } = await supabase
      .from('compliance_validations')
      .insert({
        content: content,
        validation_result: validation,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    return validation;
  }
}

export class SupabaseAnalyticsProvider implements AnalyticsProvider {
  async getPerformanceReport(dateRange: string): Promise<any> {
    // Query complexa para agregar dados de performance
    const { data, error } = await supabase
      .from('campaign_metrics')
      .select(`
        *,
        campaigns!inner(*)
      `)
      .gte('created_at', this.parseDate(dateRange).start)
      .lte('created_at', this.parseDate(dateRange).end);

    if (error) throw error;
    
    // Agregar dados para relatório
    return this.aggregatePerformanceData(data);
  }

  async getCampaignMetrics(campaignId: string): Promise<any> {
    const { data, error } = await supabase
      .from('campaign_metrics')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    return data || null;
  }

  async getDashboardData(userId: string): Promise<any> {
    // Query para dados do dashboard
    const [campaigns, recentActivity, metrics] = await Promise.all([
      supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', userId),
      
      supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10),
        
      supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)
    ]);

    if (campaigns.error) throw campaigns.error;
    if (recentActivity.error) throw recentActivity.error;
    if (metrics.error) throw metrics.error;

    return {
      user_id: userId,
      summary: this.calculateSummary(campaigns.data || []),
      recent_activity: recentActivity.data || [],
      performance_chart: metrics.data || []
    };
  }

  private parseDate(dateRange: string) {
    // Parse simple para date ranges como "30d", "7d", etc.
    const days = parseInt(dateRange.replace('d', ''));
    const end = new Date();
    const start = new Date(end.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return {
      start: start.toISOString(),
      end: end.toISOString()
    };
  }

  private aggregatePerformanceData(data: any[]) {
    // Lógica de agregação dos dados
    return {
      period: '30d',
      campaigns: {
        total: data.length,
        active: data.filter(d => d.campaigns.status === 'active').length,
        performance_avg: data.reduce((sum, d) => sum + (d.performance_score || 0), 0) / data.length
      },
      // ... mais métricas agregadas
      generated_at: new Date().toISOString()
    };
  }

  private calculateSummary(campaigns: any[]) {
    return {
      total_campaigns: campaigns.length,
      active_campaigns: campaigns.filter(c => c.status === 'active').length,
      total_leads: campaigns.reduce((sum, c) => sum + (c.leads_count || 0), 0),
      conversion_rate: 0.041 // Calcular baseado em dados reais
    };
  }
}

// ==================== PROVIDER PRINCIPAL ====================

export class SupabaseDataProvider implements DataProvider {
  public readonly anamneses: SupabaseAnamneseProvider;
  public readonly brandManuals: SupabaseBrandManualProvider;
  public readonly campaigns: SupabaseCampaignProvider;
  public readonly content: SupabaseContentProvider;
  public readonly analytics: SupabaseAnalyticsProvider;

  constructor() {
    this.anamneses = new SupabaseAnamneseProvider();
    this.brandManuals = new SupabaseBrandManualProvider();
    this.campaigns = new SupabaseCampaignProvider();
    this.content = new SupabaseContentProvider();
    this.analytics = new SupabaseAnalyticsProvider();
    
    console.log('🗄️ SupabaseDataProvider initialized - Conectado ao banco de dados real');
  }
}