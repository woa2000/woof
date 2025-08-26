import { apiClient, buildQueryString, ApiResponse } from '@/lib/api-client';

// =====================================================
// TYPES - Calendário API
// =====================================================

export interface CalendarioFilters {
  categoria_pet?: string;
  mes?: string; // YYYY-MM
  prioridade?: 'baixa' | 'media' | 'alta';
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface CreateSazonalidadeRequest {
  evento: string;
  data_inicio: string;
  data_fim?: string;
  categoria_pet?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  campanhas_sugeridas?: any[];
  tags?: string[];
  notificacao_antecedencia?: number;
}

export interface SazonalidadeResponse {
  id: string;
  evento: string;
  data_inicio: string;
  data_fim?: string;
  categoria_pet?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  campanhas_sugeridas: any[];
  notificacao_antecedencia: number;
  tags: string[];
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface CalendarioListResponse {
  data: SazonalidadeResponse[];
  total: number;
  filters: CalendarioFilters;
  pagination: {
    limit?: number;
    offset?: number;
    hasMore: boolean;
  };
}

// Insights Types
export interface CalendarioInsights {
  eventos_mes_atual: number;
  categoria_mais_ativa: string;
  proximos_eventos_criticos: SazonalidadeResponse[];
  sugestoes_ia: {
    eventos_perdidos: string[];
    oportunidades_conteudo: any[];
  };
  metricas_gerais: {
    total_eventos_ativos: number;
    eventos_proximos_7_dias: number;
    eventos_proximos_30_dias: number;
    distribuicao_por_prioridade: Record<string, number>;
    distribuicao_por_categoria: Record<string, number>;
  };
  tendencias_sazonais: {
    periodo: string;
    total_eventos: number;
    principais_categorias: string[];
  }[];
}

// Sugestões Types
export interface SugestaoIA {
  id: string;
  evento_sugerido: string;
  categoria_detectada: string;
  data_ideal: string;
  justificativa: string;
  confianca_score: number;
  campanhas_relacionadas: {
    tipo: string;
    titulo: string;
    hashtags: string[];
    timing: string;
  }[];
  compliance_alerts: string[];
  fonte: 'base_conhecimento' | 'padrao_usuario' | 'tendencia_sazonal';
}

export interface SugestoesResponse {
  sugestoes_eventos: SugestaoIA[];
  analise_preditiva: {
    periodo_analise: string;
    tendencias_detectadas: any[];
    oportunidades_identificadas: any[];
    alertas_sazonais: any[];
  };
  configuracao: {
    tipo_negocio: string;
    regiao: string;
    eventos_base: number;
  };
}

// Presets Types
export interface EventoPreset {
  id: string;
  nome: string;
  categoria: 'vacinacao' | 'doenca_sazonal' | 'campanha_preventiva' | 'data_comemorativa' | 'procedimento_sazonal';
  data_inicio: string;
  data_fim?: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  tags: string[];
  regioes_aplicaveis: string[];
  especies_aplicaveis: string[];
  campanhas_sugeridas: {
    tipo_conteudo: string;
    titulo_sugerido: string;
    hashtags: string[];
    cta: string;
  }[];
  data_inicio_completa?: string;
  data_fim_completa?: string;
  pode_ser_adicionado?: boolean;
}

export interface PresetsResponse {
  data: EventoPreset[];
  total: number;
  filters: {
    categoria?: string;
    regiao?: string;
    mes?: string;
  };
}

// =====================================================
// CALENDARIO API SERVICE
// =====================================================

export class CalendarioApiService {
  
  // =====================================================
  // CRUD OPERATIONS
  // =====================================================
  
  /**
   * Listar eventos do calendário com filtros
   */
  async listarEventos(filters: CalendarioFilters = {}): Promise<ApiResponse<CalendarioListResponse>> {
    const queryString = buildQueryString(filters);
    return apiClient.get<CalendarioListResponse>(`/api/calendario${queryString}`);
  }

  /**
   * Criar novo evento no calendário
   */
  async criarEvento(evento: CreateSazonalidadeRequest): Promise<ApiResponse<SazonalidadeResponse>> {
    return apiClient.post<SazonalidadeResponse>('/api/calendario', evento);
  }

  /**
   * Buscar evento por ID
   */
  async buscarEventoPorId(id: string): Promise<ApiResponse<SazonalidadeResponse>> {
    return apiClient.get<SazonalidadeResponse>(`/api/calendario/${id}`);
  }

  /**
   * Atualizar evento existente
   */
  async atualizarEvento(id: string, evento: Partial<CreateSazonalidadeRequest>): Promise<ApiResponse<SazonalidadeResponse>> {
    return apiClient.put<SazonalidadeResponse>(`/api/calendario/${id}`, evento);
  }

  /**
   * Remover evento (soft delete)
   */
  async removerEvento(id: string): Promise<ApiResponse<{ id: string; evento: string }>> {
    return apiClient.delete<{ id: string; evento: string }>(`/api/calendario/${id}`);
  }

  // =====================================================
  // INSIGHTS & ANALYTICS
  // =====================================================

  /**
   * Obter insights e analytics do calendário
   */
  async obterInsights(): Promise<ApiResponse<CalendarioInsights>> {
    return apiClient.get<CalendarioInsights>('/api/calendario/insights');
  }

  // =====================================================
  // SUGESTÕES IA
  // =====================================================

  /**
   * Obter sugestões automáticas baseadas em IA
   */
  async obterSugestoes(params: {
    tipo_negocio?: string;
    regiao?: string;
    limite?: number;
  } = {}): Promise<ApiResponse<SugestoesResponse>> {
    const queryString = buildQueryString(params);
    return apiClient.get<SugestoesResponse>(`/api/calendario/sugestoes${queryString}`);
  }

  // =====================================================
  // PRESETS VETERINÁRIOS
  // =====================================================

  /**
   * Listar presets disponíveis
   */
  async listarPresets(filters: {
    categoria?: string;
    regiao?: string;
    mes?: string;
  } = {}): Promise<ApiResponse<PresetsResponse>> {
    const queryString = buildQueryString(filters);
    return apiClient.get<PresetsResponse>(`/api/calendario/presets${queryString}`);
  }

  /**
   * Adicionar preset ao calendário do usuário
   */
  async adicionarPreset(presetId: string, personalizacoes?: {
    evento?: string;
    prioridade?: 'baixa' | 'media' | 'alta';
    notificacao_antecedencia?: number;
    tags?: string[];
  }): Promise<ApiResponse<SazonalidadeResponse>> {
    return apiClient.post<SazonalidadeResponse>('/api/calendario/presets', {
      preset_id: presetId,
      personalizacoes
    });
  }
}

// =====================================================
// SINGLETON INSTANCE
// =====================================================

export const calendarioApi = new CalendarioApiService();

// =====================================================
// CONVENIENCE FUNCTIONS
// =====================================================

/**
 * Helper para verificar se uma resposta da API teve sucesso
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true } {
  return response.success === true;
}

/**
 * Helper para extrair dados de uma resposta da API
 */
export function getApiData<T>(response: ApiResponse<T>): T | null {
  return isSuccessResponse(response) ? response.data || null : null;
}

/**
 * Helper para extrair erro de uma resposta da API
 */
export function getApiError(response: ApiResponse<any>): string {
  if (isSuccessResponse(response)) return '';
  return response.error || 'Erro desconhecido';
}

/**
 * Helper para formatar filtros do calendário para query string
 */
export function formatCalendarioFilters(filters: Partial<CalendarioFilters>): CalendarioFilters {
  return {
    ...filters,
    limit: filters.limit || 50,
    offset: filters.offset || 0
  };
}