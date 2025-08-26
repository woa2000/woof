export interface PersonaThoughts {
    pensa: string;
    sente: string;
}
export interface Persona {
    nome: string;
    idade: number;
    papel: string;
    pensa_sente: PersonaThoughts;
    vê: string;
    fala_faz: string;
    dores: string;
    ganhos: string;
}
export interface HeuristicasNielsen {
    controle_e_liberdade: number;
    flexibilidade_e_eficiencia: number;
    design_minimalista: number;
}
export interface PontoCego {
    heuristicas_nielsen: HeuristicasNielsen;
    acessibilidade: string;
    performance: string;
    ui_visual: string;
}
export interface Johari {
    arena: string[];
    ponto_cego: PontoCego;
    fachada: string[];
    desconhecido: string[];
}
export interface AuditoriaPercepcao {
    jornada_paciente_zero: string[];
    johari: Johari;
}
export interface EcossistemaInspiracao {
    nome: string;
    url: string;
    resolve: string;
}
export interface HeroSection {
    proposito: string;
    gatilhos: string[];
    titulo: string;
    subtitulo: string;
    cta_primario: string;
    cta_secundario: string;
}
export interface BlocoSimples {
    proposito: string;
    conteudo?: string;
    cards?: string[];
    etapas_servico?: number;
    cta?: string;
    cases_destacados?: number;
    titulo?: string;
    formulario_simplificado?: boolean;
}
export interface NovaAnatomiaHome {
    hero: HeroSection;
    prova_social_imediata: BlocoSimples;
    bloco_dores: BlocoSimples;
    bloco_solucao: BlocoSimples;
    bloco_resultados: BlocoSimples;
    cta_final: BlocoSimples;
}
export interface RoadmapItem {
    item: string;
    prioridade: 'Alta' | 'Média' | 'Baixa';
    esforco: 'Alto' | 'Médio' | 'Baixo';
    impacto_negocio: 'Alto' | 'Médio' | 'Baixo';
}
export interface PlanoTratamento {
    quick_wins: string[];
    reestruturacao_arquitetura: string[];
    evolucao_identidade_visual: string[];
    otimizacao_narrativa: string[];
    saude_tecnica: string[];
}
export interface DiagnosticoIdentidade {
    dna_marca: string;
    hipotese_negocio: string;
    metrica_chave_sucesso: string;
}
export interface AnamneseDigital {
    id: string;
    brand_id?: string;
    url_analisada: string;
    redes_sociais?: string[];
    created_at?: string;
    updated_at?: string;
    user_id?: string;
    analysis_type?: 'complete' | 'quick' | 'competitor';
    website_data?: any;
    ai_analysis?: any;
    pet_recommendations?: {
        quick_wins: string[];
        medium_term: string[];
        long_term: string[];
        compliance_issues: string[];
    };
    competitors_analysis?: any;
    overall_score?: number;
    status?: 'processing' | 'completed' | 'failed';
    processed_at?: string;
    diagnostico_identidade_e_proposito: DiagnosticoIdentidade;
    personas: Persona[];
    auditoria_percepcao_experiencia: AuditoriaPercepcao;
    analise_ecossistema_inspiracoes: EcossistemaInspiracao[];
    plano_tratamento_e_evolucao: PlanoTratamento;
    roadmap_terapeutico: RoadmapItem[];
    nova_anatomia_home: NovaAnatomiaHome;
    perguntas_aprofundamento: string[];
}
//# sourceMappingURL=anamnese.d.ts.map