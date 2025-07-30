import { AnamneseDigital, Persona, EcossistemaInspiracao, RoadmapItem, PontoCego } from './types';

// Converter de AnamneseDigital para formato do banco
export function anamneseToDbFormat(anamnese: Omit<AnamneseDigital, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  return {
    url_analisada: anamnese.url_analisada,
    redes_sociais: anamnese.redes_sociais || [],
    dna_marca: anamnese.diagnostico_identidade_e_proposito.dna_marca,
    hipotese_negocio: anamnese.diagnostico_identidade_e_proposito.hipotese_negocio,
    metrica_chave_sucesso: anamnese.diagnostico_identidade_e_proposito.metrica_chave_sucesso,
    personas: anamnese.personas,
    jornada_paciente_zero: anamnese.auditoria_percepcao_experiencia.jornada_paciente_zero,
    johari_arena: anamnese.auditoria_percepcao_experiencia.johari.arena,
    johari_ponto_cego: anamnese.auditoria_percepcao_experiencia.johari.ponto_cego,
    johari_fachada: anamnese.auditoria_percepcao_experiencia.johari.fachada,
    johari_desconhecido: anamnese.auditoria_percepcao_experiencia.johari.desconhecido,
    analise_ecossistema_inspiracoes: anamnese.analise_ecossistema_inspiracoes,
    quick_wins: anamnese.plano_tratamento_e_evolucao.quick_wins,
    reestruturacao_arquitetura: anamnese.plano_tratamento_e_evolucao.reestruturacao_arquitetura,
    evolucao_identidade_visual: anamnese.plano_tratamento_e_evolucao.evolucao_identidade_visual,
    otimizacao_narrativa: anamnese.plano_tratamento_e_evolucao.otimizacao_narrativa,
    saude_tecnica: anamnese.plano_tratamento_e_evolucao.saude_tecnica,
    roadmap_terapeutico: anamnese.roadmap_terapeutico,
    nova_anatomia_home: anamnese.nova_anatomia_home,
    perguntas_aprofundamento: anamnese.perguntas_aprofundamento
  };
}

// Helper para type assertion segura
function safeString(value: unknown, defaultValue = ''): string {
  return typeof value === 'string' ? value : defaultValue;
}

function safeArray<T>(value: unknown, defaultValue: T[] = []): T[] {
  return Array.isArray(value) ? value : defaultValue;
}

function safeObject<T>(value: unknown, defaultValue: T): T {
  return typeof value === 'object' && value !== null ? value as T : defaultValue;
}

// Converter do formato do banco para AnamneseDigital
export function dbToAnamneseFormat(dbData: Record<string, unknown>): AnamneseDigital {
  const defaultPontoCego: PontoCego = {
    heuristicas_nielsen: {
      controle_e_liberdade: 0,
      flexibilidade_e_eficiencia: 0,
      design_minimalista: 0
    },
    acessibilidade: '',
    performance: '',
    ui_visual: ''
  };

  return {
    id: safeString(dbData.id),
    url_analisada: safeString(dbData.url_analisada),
    redes_sociais: safeArray<string>(dbData.redes_sociais),
    created_at: safeString(dbData.created_at),
    updated_at: safeString(dbData.updated_at),
    user_id: safeString(dbData.user_id),
    diagnostico_identidade_e_proposito: {
      dna_marca: safeString(dbData.dna_marca),
      hipotese_negocio: safeString(dbData.hipotese_negocio),
      metrica_chave_sucesso: safeString(dbData.metrica_chave_sucesso)
    },
    personas: safeArray<Persona>(dbData.personas),
    auditoria_percepcao_experiencia: {
      jornada_paciente_zero: safeArray<string>(dbData.jornada_paciente_zero),
      johari: {
        arena: safeArray<string>(dbData.johari_arena),
        ponto_cego: safeObject<PontoCego>(dbData.johari_ponto_cego, defaultPontoCego),
        fachada: safeArray<string>(dbData.johari_fachada),
        desconhecido: safeArray<string>(dbData.johari_desconhecido)
      }
    },
    analise_ecossistema_inspiracoes: safeArray<EcossistemaInspiracao>(dbData.analise_ecossistema_inspiracoes),
    plano_tratamento_e_evolucao: {
      quick_wins: safeArray<string>(dbData.quick_wins),
      reestruturacao_arquitetura: safeArray<string>(dbData.reestruturacao_arquitetura),
      evolucao_identidade_visual: safeArray<string>(dbData.evolucao_identidade_visual),
      otimizacao_narrativa: safeArray<string>(dbData.otimizacao_narrativa),
      saude_tecnica: safeArray<string>(dbData.saude_tecnica)
    },
    roadmap_terapeutico: safeArray<RoadmapItem>(dbData.roadmap_terapeutico),
    nova_anatomia_home: safeObject(dbData.nova_anatomia_home, {
      hero: {
        proposito: '',
        gatilhos: [],
        titulo: '',
        subtitulo: '',
        cta_primario: '',
        cta_secundario: ''
      },
      prova_social_imediata: { proposito: '' },
      bloco_dores: { proposito: '' },
      bloco_solucao: { proposito: '' },
      bloco_resultados: { proposito: '' },
      cta_final: { proposito: '' }
    }),
    perguntas_aprofundamento: safeArray<string>(dbData.perguntas_aprofundamento)
  };
}
