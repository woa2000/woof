declare const router: import("express-serve-static-core").Router;
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
export default router;
//# sourceMappingURL=calendario-insights.d.ts.map