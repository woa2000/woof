// =====================================================
// TIPOS TYPESCRIPT PARA CALENDÁRIO SAZONALIDADES
// =====================================================

// Tipos básicos do calendário
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
  campanhas_sugeridas?: CampanhaSugerida[];
  tags?: string[];
  notificacao_antecedencia?: number;
}

export interface UpdateSazonalidadeRequest extends CreateSazonalidadeRequest {}

export interface SazonalidadeResponse {
  id: string;
  evento: string;
  data_inicio: string;
  data_fim?: string;
  categoria_pet?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  campanhas_sugeridas: CampanhaSugerida[];
  notificacao_antecedencia: number;
  tags: string[];
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface CampanhaSugerida {
  tipo_conteudo: string;
  titulo_sugerido: string;
  hashtags: string[];
  cta: string;
  timing?: string;
}

// Tipos para insights e analytics
export interface CalendarioInsights {
  eventos_mes_atual: number;
  categoria_mais_ativa: string;
  proximos_eventos_criticos: SazonalidadeResponse[];
  sugestoes_ia: {
    eventos_perdidos: string[];
    oportunidades_conteudo: ConteudoSazonal[];
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

export interface ConteudoSazonal {
  evento_id: string;
  evento_nome: string;
  tipo_conteudo_sugerido: string;
  timing_otimo: string;
  hashtags_sugeridas: string[];
  call_to_action: string;
}

// Tipos para presets (eventos pré-cadastrados)
export interface EventoPreset {
  id: string;
  nome: string;
  categoria: 'vacinacao' | 'doenca_sazonal' | 'campanha_preventiva' | 'data_comemorativa' | 'procedimento_sazonal';
  data_inicio: string; // MM-DD format
  data_fim?: string; // MM-DD format
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  tags: string[];
  regioes_aplicaveis: string[];
  especies_aplicaveis: string[];
  campanhas_sugeridas: CampanhaSugerida[];
  data_inicio_completa?: string; // YYYY-MM-DD format
  data_fim_completa?: string; // YYYY-MM-DD format
  pode_ser_adicionado?: boolean;
}

export interface AddPresetRequest {
  preset_id: string;
  personalizacoes?: {
    evento?: string;
    prioridade?: 'baixa' | 'media' | 'alta';
    notificacao_antecedencia?: number;
    tags?: string[];
  };
}

// Tipos para sugestões IA
export interface SugestaoIA {
  id: string;
  evento_sugerido: string;
  categoria_detectada: string;
  data_ideal: string;
  justificativa: string;
  confianca_score: number; // 0.0-1.0
  campanhas_relacionadas: {
    tipo: string;
    titulo: string;
    hashtags: string[];
    timing: string;
  }[];
  compliance_alerts: string[];
  fonte: 'base_conhecimento' | 'padrao_usuario' | 'tendencia_sazonal';
}

export interface AnalisePreditiva {
  periodo_analise: string;
  tendencias_detectadas: {
    categoria: string;
    crescimento_esperado: number;
    periodo_pico: string;
    confianca: number;
  }[];
  oportunidades_identificadas: {
    evento: string;
    potencial_impacto: 'alto' | 'medio' | 'baixo';
    urgencia: 'imediata' | 'proxima_semana' | 'proximo_mes';
    justificativa: string;
  }[];
  alertas_sazonais: {
    tipo: 'doenca' | 'procedimento' | 'campanha';
    alerta: string;
    recomendacao: string;
    prioridade: 'critica' | 'alta' | 'media';
  }[];
}

export interface SugestoesResponse {
  sugestoes_eventos: SugestaoIA[];
  analise_preditiva: AnalisePreditiva;
  configuracao: {
    tipo_negocio: string;
    regiao: string;
    eventos_base: number;
  };
}

// Tipos para resposta padrão das APIs
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  total?: number;
  filters?: any;
  pagination?: {
    limit?: number;
    offset?: number;
    hasMore?: boolean;
  };
  generated_at?: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: string[] | string;
}

// Tipos para componentes de UI
export interface CalendarioViewOptions {
  visualizacao: 'mensal' | 'semanal' | 'lista';
  mesAtual: Date;
}

export interface EventoCardVariant {
  variant: 'completo' | 'compacto' | 'lista';
  className?: string;
}

export interface FiltroState {
  categoria_pet?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  mes?: string;
  tags?: string[];
  busca?: string;
}

// Constantes tipadas
export const CATEGORIAS_PET = [
  'vacinacao',
  'doenca_sazonal', 
  'campanha_preventiva',
  'data_comemorativa',
  'procedimento_sazonal'
] as const;

export const PRIORIDADES = ['baixa', 'media', 'alta'] as const;

export const REGIOES_BRASIL = [
  'norte',
  'nordeste', 
  'centro_oeste',
  'sudeste',
  'sul'
] as const;

export const TIPOS_NEGOCIO = [
  'clinica_veterinaria',
  'pet_shop',
  'banho_tosa',
  'hotel_pet',
  'adestramento',
  'nutricao_animal'
] as const;

export type CategoriaPet = typeof CATEGORIAS_PET[number];
export type Prioridade = typeof PRIORIDADES[number];
export type RegiaoBrasil = typeof REGIOES_BRASIL[number];
export type TipoNegocio = typeof TIPOS_NEGOCIO[number];

// Mapas de tradução para UI
export const CATEGORIA_LABELS: Record<CategoriaPet, string> = {
  vacinacao: 'Vacinação',
  doenca_sazonal: 'Doença Sazonal',
  campanha_preventiva: 'Campanha Preventiva',
  data_comemorativa: 'Data Comemorativa',
  procedimento_sazonal: 'Procedimento Sazonal'
};

export const PRIORIDADE_LABELS: Record<Prioridade, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta'
};

export const PRIORIDADE_COLORS: Record<Prioridade, string> = {
  baixa: 'text-gray-600 bg-gray-50 border-gray-200',
  media: 'text-blue-600 bg-blue-50 border-blue-200',
  alta: 'text-orange-600 bg-orange-50 border-orange-200'
};

export const REGIAO_LABELS: Record<RegiaoBrasil, string> = {
  norte: 'Norte',
  nordeste: 'Nordeste',
  centro_oeste: 'Centro-Oeste',
  sudeste: 'Sudeste',
  sul: 'Sul'
};

export const TIPO_NEGOCIO_LABELS: Record<TipoNegocio, string> = {
  clinica_veterinaria: 'Clínica Veterinária',
  pet_shop: 'Pet Shop',
  banho_tosa: 'Banho e Tosa',
  hotel_pet: 'Hotel Pet',
  adestramento: 'Adestramento',
  nutricao_animal: 'Nutrição Animal'
};

// Utilitários tipados
export interface CalendarioUtils {
  formatarPeriodo: (inicio: string, fim?: string) => string;
  obterCorPrioridade: (prioridade: Prioridade) => string;
  calcularDiasRestantes: (dataEvento: string) => number;
  isEventoProximo: (dataEvento: string, dias?: number) => boolean;
  agruparEventosPorData: (eventos: SazonalidadeResponse[]) => Record<string, SazonalidadeResponse[]>;
  gerarCalendarioMensal: (mes: Date) => {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
  }[];
}

// Hook types
export interface UseCalendarioEventosResult {
  data: SazonalidadeResponse[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseCalendarioInsightsResult {
  data: CalendarioInsights | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseCalendarioMutationsResult {
  createEvento: (data: CreateSazonalidadeRequest) => Promise<SazonalidadeResponse>;
  updateEvento: (id: string, data: UpdateSazonalidadeRequest) => Promise<SazonalidadeResponse>;
  deleteEvento: (id: string) => Promise<void>;
  addPreset: (data: AddPresetRequest) => Promise<SazonalidadeResponse>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

// Tipos para contexto/providers
export interface CalendarioContextValue {
  filtros: FiltroState;
  setFiltros: (filtros: Partial<FiltroState>) => void;
  viewOptions: CalendarioViewOptions;
  setViewOptions: (options: Partial<CalendarioViewOptions>) => void;
  eventoSelecionado: SazonalidadeResponse | null;
  setEventoSelecionado: (evento: SazonalidadeResponse | null) => void;
}