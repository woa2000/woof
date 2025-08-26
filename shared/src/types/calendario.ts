export interface CalendarioInsights {
  eventos_mes_atual: number;
  categoria_mais_ativa: string;
  proximos_eventos_criticos: any[];
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

export interface CalendarioEvento {
  id: string;
  evento: string;
  data_inicio: string;
  data_fim: string;
  categoria_pet: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'ativo' | 'concluido' | 'cancelado';
  campanhas_sugeridas?: string[];
  tags?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarioPreset {
  id: string;
  nome: string;
  categoria: string;
  eventos: {
    evento: string;
    mes: number;
    dia?: number;
    categoria_pet: string;
    prioridade: string;
    campanhas_sugeridas: string[];
  }[];
  user_id: string;
  created_at: string;
}