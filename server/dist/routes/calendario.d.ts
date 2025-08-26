declare const router: import("express-serve-static-core").Router;
export interface CalendarioFilters {
    categoria_pet?: string;
    mes?: string;
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
export default router;
//# sourceMappingURL=calendario.d.ts.map