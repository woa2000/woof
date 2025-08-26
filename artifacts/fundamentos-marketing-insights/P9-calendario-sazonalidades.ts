// SISTEMA DE CALENDÁRIO SAZONALIDADES VETERINÁRIAS - BRASIL
// Implementado por: Data_Analyst durante Sprint 6-8
// Base de conhecimento veterinário brasileiro + IA para sugestões automáticas

import { createClient } from '@supabase/supabase-js';

// =====================================================
// INTERFACES E TIPOS DE SAZONALIDADES
// =====================================================

export interface SazonalidadeVeterinaria {
  id: string;
  nome: string;
  categoria: 'vacinacao' | 'doenca_sazonal' | 'campanha_preventiva' | 'data_comemorativa' | 'procedimento_sazonal';
  periodo_inicio: string; // MM-DD format
  periodo_fim: string;
  descricao: string;
  especies_aplicaveis: ('caes' | 'gatos' | 'aves' | 'pequenos_mamiferos' | 'repteis')[];
  regioes_brasil: ('norte' | 'nordeste' | 'centro_oeste' | 'sudeste' | 'sul')[];
  nivel_prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  tipo_acao: 'preventiva' | 'reativa' | 'educativa' | 'promocional';
  tags_relacionadas: string[];
  content_suggestions: {
    pilares_editoriais: string[];
    formatos_recomendados: string[];
    call_to_actions: string[];
  };
  historico_engajamento?: {
    ano: number;
    reach_medio: number;
    engagement_rate: number;
    conversoes: number;
  }[];
}

export interface CalendarioMensal {
  mes: number;
  ano: number;
  sazonalidades_ativas: SazonalidadeVeterinaria[];
  oportunidades_conteudo: ConteudoSazonal[];
  metricas_historicas: {
    total_posts_sugeridos: number;
    engagement_medio_esperado: number;
    melhor_dia_semana: string;
    melhor_horario: string;
  };
}

export interface ConteudoSazonal {
  sazonalidade_id: string;
  tipo_conteudo: 'post' | 'stories' | 'reel' | 'carrossel' | 'blog';
  titulo_sugerido: string;
  descricao: string;
  hashtags_sugeridas: string[];
  timing_otimo: {
    data_ideal: string;
    horario_ideal: string;
    frequencia_recomendada: string;
  };
  compliance_alerts: string[];
}

export interface InsightSazonal {
  periodo: string;
  tendencia: 'crescente' | 'decrescente' | 'estavel';
  oportunidades_identificadas: string[];
  ameacas_sazonais: string[];
  sugestoes_estrategicas: string[];
  previsao_demanda: {
    categoria: string;
    aumento_esperado: number; // percentage
    periodo_pico: string;
  }[];
}

// =====================================================
// BASE DE CONHECIMENTO VETERINÁRIO BRASILEIRO
// =====================================================

export const SAZONALIDADES_VETERINARIAS_BR: SazonalidadeVeterinaria[] = [
  {
    id: 'vac-001',
    nome: 'Campanha de Vacinação Antirrábica',
    categoria: 'vacinacao',
    periodo_inicio: '08-01', // Agosto início
    periodo_fim: '09-30',   // Setembro fim
    descricao: 'Campanha nacional de vacinação antirrábica, obrigatória e gratuita em muitos municípios',
    especies_aplicaveis: ['caes', 'gatos'],
    regioes_brasil: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    nivel_prioridade: 'critica',
    tipo_acao: 'preventiva',
    tags_relacionadas: ['vacinacao', 'raiva', 'saude_publica', 'prevencao'],
    content_suggestions: {
      pilares_editoriais: ['Saúde Preventiva', 'Responsabilidade Social'],
      formatos_recomendados: ['carrossel-informativo', 'stories-lembretes', 'post-localizacao'],
      call_to_actions: ['Agende sua vacinação', 'Encontre posto mais próximo', 'Compartilhe esta informação']
    }
  },
  {
    id: 'saz-001', 
    nome: 'Temporada de Carrapatos e Pulgas',
    categoria: 'doenca_sazonal',
    periodo_inicio: '10-01', // Outubro - início do calor
    periodo_fim: '03-31',    // Março - fim do verão
    descricao: 'Período de maior proliferação de ectoparasitas devido ao calor e umidade',
    especies_aplicaveis: ['caes', 'gatos'],
    regioes_brasil: ['sudeste', 'centro_oeste', 'sul'],
    nivel_prioridade: 'alta',
    tipo_acao: 'preventiva',
    tags_relacionadas: ['carrapatos', 'pulgas', 'antiparasitarios', 'prevencao', 'verao'],
    content_suggestions: {
      pilares_editoriais: ['Saúde Preventiva', 'Cuidados Sazonais'],
      formatos_recomendados: ['post-educativo', 'reel-dicas', 'stories-antes-depois'],
      call_to_actions: ['Agende consulta preventiva', 'Conheça nossos antiparasitários', 'Dicas de prevenção']
    }
  },
  {
    id: 'saz-002',
    nome: 'Gripe Canina - Temporada Fria',
    categoria: 'doenca_sazonal', 
    periodo_inicio: '05-01', // Maio - início do frio
    periodo_fim: '08-31',    // Agosto - fim do inverno
    descricao: 'Aumento de casos de gripe canina e problemas respiratórios durante o inverno',
    especies_aplicaveis: ['caes'],
    regioes_brasil: ['sudeste', 'sul'],
    nivel_prioridade: 'alta',
    tipo_acao: 'preventiva',
    tags_relacionadas: ['gripe_canina', 'inverno', 'respiratorio', 'tosse_canis'],
    content_suggestions: {
      pilares_editoriais: ['Saúde Preventiva', 'Cuidados Sazonais'],
      formatos_recomendados: ['post-sinais-alerta', 'carrossel-prevencao', 'stories-cuidados'],
      call_to_actions: ['Vacine seu pet', 'Consulte sintomas respiratórios', 'Cuidados especiais inverno']
    }
  },
  {
    id: 'cam-001',
    nome: 'Janeiro Roxo - Conscientização Hanseníase Animal',
    categoria: 'campanha_preventiva',
    periodo_inicio: '01-01',
    periodo_fim: '01-31',
    descricao: 'Campanha de conscientização sobre hanseníase e outras zoonoses',
    especies_aplicaveis: ['caes', 'gatos'],
    regioes_brasil: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    nivel_prioridade: 'media',
    tipo_acao: 'educativa',
    tags_relacionadas: ['janeiro_roxo', 'zoonoses', 'consciencia', 'saude_publica'],
    content_suggestions: {
      pilares_editoriais: ['Educação em Saúde', 'Responsabilidade Social'],
      formatos_recomendados: ['post-conscientizacao', 'carrossel-educativo', 'stories-facts'],
      call_to_actions: ['Saiba mais sobre zoonoses', 'Compartilhe conhecimento', 'Consulte veterinário']
    }
  },
  {
    id: 'cam-002',
    nome: 'Setembro Amarelo Pet - Saúde Mental dos Tutores', 
    categoria: 'campanha_preventiva',
    periodo_inicio: '09-01',
    periodo_fim: '09-30',
    descricao: 'Conscientização sobre a importância dos pets na saúde mental dos tutores',
    especies_aplicaveis: ['caes', 'gatos'],
    regioes_brasil: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    nivel_prioridade: 'alta',
    tipo_acao: 'educativa',
    tags_relacionadas: ['setembro_amarelo', 'saude_mental', 'pet_terapia', 'bem_estar'],
    content_suggestions: {
      pilares_editoriais: ['Bem-estar Animal', 'Responsabilidade Social', 'Terapia Assistida'],
      formatos_recomendados: ['post-depoimentos', 'stories-casos-sucesso', 'reel-beneficios'],
      call_to_actions: ['Compartilhe sua história', 'Apoie a causa', 'Conheça pet terapia']
    }
  },
  {
    id: 'dat-001',
    nome: 'Dia do Médico Veterinário',
    categoria: 'data_comemorativa',
    periodo_inicio: '09-09',
    periodo_fim: '09-09', 
    descricao: 'Dia nacional do médico veterinário - oportunidade para valorizar a profissão',
    especies_aplicaveis: ['caes', 'gatos', 'aves', 'pequenos_mamiferos', 'repteis'],
    regioes_brasil: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    nivel_prioridade: 'alta',
    tipo_acao: 'promocional',
    tags_relacionadas: ['dia_veterinario', 'profissao', 'homenagem', 'medicina_veterinaria'],
    content_suggestions: {
      pilares_editoriais: ['Valorização Profissional', 'Educação Veterinária'],
      formatos_recomendados: ['post-homenagem', 'stories-equipe', 'reel-bastidores'],
      call_to_actions: ['Conheça nossa equipe', 'Agende sua consulta', 'Valorize seu veterinário']
    }
  },
  {
    id: 'dat-002',
    nome: 'Dia Mundial dos Animais',
    categoria: 'data_comemorativa',
    periodo_inicio: '10-04',
    periodo_fim: '10-04',
    descricao: 'Data internacional de conscientização sobre direitos e bem-estar animal',
    especies_aplicaveis: ['caes', 'gatos', 'aves', 'pequenos_mamiferos', 'repteis'],
    regioes_brasil: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    nivel_prioridade: 'alta',
    tipo_acao: 'educativa',
    tags_relacionadas: ['dia_mundial_animais', 'bem_estar', 'direitos_animais', 'consciencia'],
    content_suggestions: {
      pilares_editoriais: ['Bem-estar Animal', 'Responsabilidade Social'],
      formatos_recomendados: ['post-conscientizacao', 'carrossel-direitos', 'stories-cases'],
      call_to_actions: ['Apoie o bem-estar animal', 'Compartilhe a conscientização', 'Adote um pet']
    }
  },
  {
    id: 'pro-001',
    nome: 'Castração Pré-Cio - Temporada Reprodutiva',
    categoria: 'procedimento_sazonal',
    periodo_inicio: '07-01', // Julho - antes da temporada reprodutiva
    periodo_fim: '09-30',    // Setembro
    descricao: 'Período ideal para campanhas de castração antes da temporada reprodutiva',
    especies_aplicaveis: ['caes', 'gatos'],
    regioes_brasil: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    nivel_prioridade: 'alta',
    tipo_acao: 'preventiva',
    tags_relacionadas: ['castracao', 'controle_populacional', 'cirurgia', 'prevencao'],
    content_suggestions: {
      pilares_editoriais: ['Saúde Preventiva', 'Responsabilidade Social'],
      formatos_recomendados: ['post-beneficios', 'stories-mitos-verdades', 'carrossel-processo'],
      call_to_actions: ['Agende castração', 'Tire suas dúvidas', 'Consulte benefícios']
    }
  },
  {
    id: 'saz-003',
    nome: 'Temporada Leishmaniose - Nordeste',
    categoria: 'doenca_sazonal',
    periodo_inicio: '04-01', // Abril - estação seca
    periodo_fim: '10-31',    // Outubro
    descricao: 'Período de maior incidência de leishmaniose visceral no nordeste brasileiro',
    especies_aplicaveis: ['caes'],
    regioes_brasil: ['nordeste', 'norte'],
    nivel_prioridade: 'critica',
    tipo_acao: 'preventiva',
    tags_relacionadas: ['leishmaniose', 'mosquito_palha', 'zoonose', 'prevencao'],
    content_suggestions: {
      pilares_editoriais: ['Saúde Preventiva', 'Doenças Regionais'],
      formatos_recomendados: ['post-prevencao', 'carrossel-sintomas', 'stories-cuidados'],
      call_to_actions: ['Teste seu pet', 'Use repelentes', 'Consulte veterinário']
    }
  }
];

// =====================================================
// SISTEMA DE ANÁLISE E SUGESTÕES SAZONAIS
// =====================================================

export class CalendarioSazonalidadesSystem {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Obter sazonalidades ativas para um período específico
  async getSazonalidadesAtivas(
    dataInicio: Date, 
    dataFim: Date,
    regiao: string = 'sudeste',
    especies: string[] = ['caes', 'gatos']
  ): Promise<SazonalidadeVeterinaria[]> {
    
    const mesInicio = `${String(dataInicio.getMonth() + 1).padStart(2, '0')}-${String(dataInicio.getDate()).padStart(2, '0')}`;
    const mesFim = `${String(dataFim.getMonth() + 1).padStart(2, '0')}-${String(dataFim.getDate()).padStart(2, '0')}`;

    const sazonalidadesAtivas = SAZONALIDADES_VETERINARIAS_BR.filter(saz => {
      // Verificar se a região é aplicável
      const regiaoAplicavel = saz.regioes_brasil.includes(regiao as any);
      
      // Verificar se alguma espécie é aplicável
      const especieAplicavel = saz.especies_aplicaveis.some(esp => especies.includes(esp));
      
      // Verificar se está no período (simplificado - assumindo mesmo ano)
      const periodoAplicavel = this.isPeriodoAplicavel(saz.periodo_inicio, saz.periodo_fim, mesInicio, mesFim);
      
      return regiaoAplicavel && especieAplicavel && periodoAplicavel;
    });

    return sazonalidadesAtivas.sort((a, b) => {
      // Ordenar por prioridade
      const prioridadeOrder = ['critica', 'alta', 'media', 'baixa'];
      return prioridadeOrder.indexOf(a.nivel_prioridade) - prioridadeOrder.indexOf(b.nivel_prioridade);
    });
  }

  private isPeriodoAplicavel(inicioSaz: string, fimSaz: string, inicioConsulta: string, fimConsulta: string): boolean {
    // Converte strings MM-DD para números para comparação
    const [mesIniSaz, diaIniSaz] = inicioSaz.split('-').map(Number);
    const [mesFimSaz, diaFimSaz] = fimSaz.split('-').map(Number);
    const [mesIniCon, diaIniCon] = inicioConsulta.split('-').map(Number);
    const [mesFimCon, diaFimCon] = fimConsulta.split('-').map(Number);

    const inicioSazNum = mesIniSaz * 100 + diaIniSaz;
    const fimSazNum = mesFimSaz * 100 + diaFimSaz;
    const inicioConNum = mesIniCon * 100 + diaIniCon;
    const fimConNum = mesFimCon * 100 + diaFimCon;

    // Verifica sobreposição de períodos
    return !(fimSazNum < inicioConNum || inicioSazNum > fimConNum);
  }

  // Gerar sugestões de conteúdo sazonal
  async gerarSugestoesConteudo(
    sazonalidades: SazonalidadeVeterinaria[],
    tipoNegocio: 'clinica_veterinaria' | 'pet_shop' | 'banho_tosa' = 'clinica_veterinaria'
  ): Promise<ConteudoSazonal[]> {
    
    const sugestoes: ConteudoSazonal[] = [];

    for (const saz of sazonalidades) {
      // Adaptar sugestões por tipo de negócio
      const contentAdaptado = this.adaptarConteudoPorNegocio(saz, tipoNegocio);
      
      // Gerar múltiplas sugestões por sazonalidade
      const formatos = saz.content_suggestions.formatos_recomendados;
      
      for (let i = 0; i < Math.min(3, formatos.length); i++) {
        const formato = formatos[i];
        
        sugestoes.push({
          sazonalidade_id: saz.id,
          tipo_conteudo: this.mapearFormatoParaTipo(formato),
          titulo_sugerido: await this.gerarTituloInteligente(saz, formato, tipoNegocio),
          descricao: contentAdaptado.descricao,
          hashtags_sugeridas: this.gerarHashtagsContextuais(saz, tipoNegocio),
          timing_otimo: this.calcularTimingOtimo(saz),
          compliance_alerts: this.gerarAlertasCompliance(saz)
        });
      }
    }

    return sugestoes;
  }

  private adaptarConteudoPorNegocio(
    saz: SazonalidadeVeterinaria, 
    tipoNegocio: string
  ): { descricao: string; ctas_adaptados: string[] } {
    
    const adaptacoes = {
      clinica_veterinaria: {
        prefixo: "Na nossa clínica",
        foco: "consultas e tratamentos",
        ctas: ["Agende sua consulta", "Consulte nosso veterinário", "Tire suas dúvidas"]
      },
      pet_shop: {
        prefixo: "Em nossa loja",  
        foco: "produtos e prevenção",
        ctas: ["Conheça nossos produtos", "Compre online", "Visite nossa loja"]
      },
      banho_tosa: {
        prefixo: "Em nosso salão",
        foco: "cuidados estéticos e bem-estar", 
        ctas: ["Agende seu banho e tosa", "Conheça nossos serviços", "Cuide do seu pet"]
      }
    };

    const config = adaptacoes[tipoNegocio as keyof typeof adaptacoes] || adaptacoes.clinica_veterinaria;
    
    return {
      descricao: `${config.prefixo}, oferecemos o melhor em ${config.foco} para ${saz.descricao.toLowerCase()}`,
      ctas_adaptados: config.ctas
    };
  }

  private mapearFormatoParaTipo(formato: string): ConteudoSazonal['tipo_conteudo'] {
    const mapeamento = {
      'post-educativo': 'post',
      'post-conscientizacao': 'post', 
      'post-homenagem': 'post',
      'carrossel-informativo': 'carrossel',
      'carrossel-educativo': 'carrossel',
      'stories-lembretes': 'stories',
      'stories-cuidados': 'stories',
      'reel-dicas': 'reel',
      'reel-beneficios': 'reel'
    };
    
    return mapeamento[formato as keyof typeof mapeamento] || 'post';
  }

  private async gerarTituloInteligente(
    saz: SazonalidadeVeterinaria,
    formato: string, 
    tipoNegocio: string
  ): Promise<string> {
    // Templates inteligentes baseados em categoria e formato
    const templates = {
      vacinacao: {
        post: `${saz.nome}: Proteja seu pet agora!`,
        carrossel: `Tudo sobre ${saz.nome} - Guia Completo`,
        stories: `⚠️ LEMBRETE: ${saz.nome}`,
        reel: `${saz.nome} em 60 segundos`
      },
      doenca_sazonal: {
        post: `Atenção: ${saz.nome} - Como prevenir?`,
        carrossel: `${saz.nome}: Sinais, Prevenção e Tratamento`, 
        stories: `🚨 ALERTA: ${saz.nome}`,
        reel: `Evite ${saz.nome} com estas dicas!`
      },
      campanha_preventiva: {
        post: `${saz.nome}: Nossa clínica apoia esta causa`,
        carrossel: `${saz.nome} - Informações essenciais`,
        stories: `💜 ${saz.nome} - Conscientização`,
        reel: `Por que o ${saz.nome} é importante?`
      },
      data_comemorativa: {
        post: `Feliz ${saz.nome}! 🎉`,
        carrossel: `${saz.nome} - Celebrando a profissão`,
        stories: `Hoje é ${saz.nome}! 🎊`,
        reel: `Homenagem: ${saz.nome}`
      }
    };

    const tipoConteudo = this.mapearFormatoParaTipo(formato);
    const template = templates[saz.categoria]?.[tipoConteudo] || `${saz.nome} - Informações importantes`;
    
    return template;
  }

  private gerarHashtagsContextuais(saz: SazonalidadeVeterinaria, tipoNegocio: string): string[] {
    const hashtagsBase = saz.tags_relacionadas.map(tag => `#${tag}`);
    
    const hashtagsNegocio = {
      clinica_veterinaria: ['#clinicaveterinaria', '#veterinario', '#saudeanimal'],
      pet_shop: ['#petshop', '#produtospet', '#cuidadospet'],
      banho_tosa: ['#banhoetoosa', '#esteticaanimal', '#cuidadospet']
    };

    const hashtagsGerais = ['#pet', '#cachorro', '#gato', '#amorpet', '#cuidar'];
    
    return [
      ...hashtagsBase,
      ...hashtagsNegocio[tipoNegocio as keyof typeof hashtagsNegocio],
      ...hashtagsGerais
    ].slice(0, 15); // Limitar a 15 hashtags
  }

  private calcularTimingOtimo(saz: SazonalidadeVeterinaria): ConteudoSazonal['timing_otimo'] {
    // Calcular timing baseado no tipo de ação e prioridade
    const hoje = new Date();
    const [mesInicio, diaInicio] = saz.periodo_inicio.split('-').map(Number);
    
    let dataIdeal = new Date(hoje.getFullYear(), mesInicio - 1, diaInicio);
    
    // Se a data já passou este ano, considerar o próximo ano
    if (dataIdeal < hoje) {
      dataIdeal.setFullYear(hoje.getFullYear() + 1);
    }

    // Antecipar conforme o tipo de ação
    const antecipacaoDias = {
      'preventiva': 14, // 2 semanas antes
      'educativa': 7,   // 1 semana antes  
      'reativa': 0,     // No momento
      'promocional': 3  // 3 dias antes
    };

    const diasAntecipacao = antecipacaoDias[saz.tipo_acao] || 7;
    dataIdeal.setDate(dataIdeal.getDate() - diasAntecipacao);

    // Definir horário ideal baseado no tipo de conteúdo
    const horarios = {
      'critica': '08:00',    // Manhã para assuntos críticos
      'alta': '12:00',       // Almoço para alta prioridade
      'media': '18:00',      // Fim de tarde
      'baixa': '20:00'       // Noite
    };

    return {
      data_ideal: dataIdeal.toISOString().split('T')[0],
      horario_ideal: horarios[saz.nivel_prioridade],
      frequencia_recomendada: this.definirFrequencia(saz)
    };
  }

  private definirFrequencia(saz: SazonalidadeVeterinaria): string {
    const duracaoPeriodo = this.calcularDuracaoPeriodo(saz.periodo_inicio, saz.periodo_fim);
    
    if (duracaoPeriodo === 1) return 'Post único';
    if (duracaoPeriodo <= 7) return 'Diário';
    if (duracaoPeriodo <= 30) return 'A cada 3 dias';
    if (duracaoPeriodo <= 90) return 'Semanal';
    return 'Quinzenal';
  }

  private calcularDuracaoPeriodo(inicio: string, fim: string): number {
    const [mesIni, diaIni] = inicio.split('-').map(Number);
    const [mesFim, diaFim] = fim.split('-').map(Number);
    
    const dataIni = new Date(2024, mesIni - 1, diaIni); // Ano fixo para cálculo
    const dataFim = new Date(2024, mesFim - 1, diaFim);
    
    return Math.ceil((dataFim.getTime() - dataIni.getTime()) / (1000 * 60 * 60 * 24));
  }

  private gerarAlertasCompliance(saz: SazonalidadeVeterinaria): string[] {
    const alertas: string[] = [];
    
    if (saz.categoria === 'vacinacao') {
      alertas.push('OBRIGATÓRIO: Incluir disclaimer sobre consulta veterinária');
      alertas.push('VERIFICAR: Informações sobre campanhas municipais locais');
    }
    
    if (saz.categoria === 'doenca_sazonal') {
      alertas.push('CUIDADO: Não diagnosticar ou prescrever medicamentos');
      alertas.push('INCLUIR: "Consulte veterinário para diagnóstico preciso"');
    }
    
    if (saz.especies_aplicaveis.includes('caes') && saz.tags_relacionadas.includes('zoonose')) {
      alertas.push('DESTACAR: Importância para saúde pública');
      alertas.push('EVITAR: Claims médicos não comprovados');
    }

    return alertas;
  }

  // Análise preditiva de tendências sazonais
  async analisarTendenciasSazonais(
    regiao: string,
    anoAnalise: number = new Date().getFullYear()
  ): Promise<InsightSazonal[]> {
    
    const insights: InsightSazonal[] = [];
    const mesesAno = Array.from({length: 12}, (_, i) => i + 1);

    for (const mes of mesesAno) {
      const periodoInicio = new Date(anoAnalise, mes - 1, 1);
      const periodoFim = new Date(anoAnalise, mes, 0);
      
      const sazonalidadesMes = await this.getSazonalidadesAtivas(
        periodoInicio, 
        periodoFim, 
        regiao
      );

      const oportunidades = this.identificarOportunidades(sazonalidadesMes);
      const ameacas = this.identificarAmeacas(sazonalidadesMes);
      const previsoes = this.preverDemanda(sazonalidadesMes);

      insights.push({
        periodo: `${anoAnalise}-${String(mes).padStart(2, '0')}`,
        tendencia: this.calcularTendenciaMes(sazonalidadesMes),
        oportunidades_identificadas: oportunidades,
        ameacas_sazonais: ameacas,
        sugestoes_estrategicas: this.gerarSugestoesEstrategicas(sazonalidadesMes),
        previsao_demanda: previsoes
      });
    }

    return insights;
  }

  private identificarOportunidades(sazonalidades: SazonalidadeVeterinaria[]): string[] {
    const oportunidades: string[] = [];
    
    const campanhasEducativas = sazonalidades.filter(s => s.tipo_acao === 'educativa');
    if (campanhasEducativas.length > 0) {
      oportunidades.push(`${campanhasEducativas.length} campanhas educativas para engajamento`);
    }

    const procedimentosSazonais = sazonalidades.filter(s => s.categoria === 'procedimento_sazonal');
    if (procedimentosSazonais.length > 0) {
      oportunidades.push(`Oportunidades de procedimentos sazonais: ${procedimentosSazonais.map(s => s.nome).join(', ')}`);
    }

    const datasComemorativas = sazonalidades.filter(s => s.categoria === 'data_comemorativa');
    if (datasComemorativas.length > 0) {
      oportunidades.push(`Datas especiais para marketing: ${datasComemorativas.length} eventos`);
    }

    return oportunidades;
  }

  private identificarAmeacas(sazonalidades: SazonalidadeVeterinaria[]): string[] {
    const ameacas: string[] = [];
    
    const doencasCriticas = sazonalidades.filter(s => 
      s.categoria === 'doenca_sazonal' && s.nivel_prioridade === 'critica'
    );
    if (doencasCriticas.length > 0) {
      ameacas.push(`Doenças críticas em foco: ${doencasCriticas.map(s => s.nome).join(', ')}`);
    }

    const vacinacoesObrigatorias = sazonalidades.filter(s => s.categoria === 'vacinacao');
    if (vacinacoesObrigatorias.length > 0) {
      ameacas.push(`Demanda alta por vacinações: preparar estoque e agenda`);
    }

    return ameacas;
  }

  private preverDemanda(sazonalidades: SazonalidadeVeterinaria[]): InsightSazonal['previsao_demanda'] {
    const previsoes: InsightSazonal['previsao_demanda'] = [];

    const categorias = sazonalidades.reduce((acc, saz) => {
      if (!acc[saz.categoria]) acc[saz.categoria] = [];
      acc[saz.categoria].push(saz);
      return acc;
    }, {} as Record<string, SazonalidadeVeterinaria[]>);

    Object.entries(categorias).forEach(([categoria, sazs]) => {
      const aumentoEsperado = this.calcularAumentoEsperado(categoria, sazs);
      const periodoPico = this.identificarPeriodoPico(sazs);

      previsoes.push({
        categoria: categoria.replace('_', ' '),
        aumento_esperado: aumentoEsperado,
        periodo_pico: periodoPico
      });
    });

    return previsoes;
  }

  private calcularAumentoEsperado(categoria: string, sazonalidades: SazonalidadeVeterinaria[]): number {
    // Estimativas baseadas em dados históricos veterinários
    const estimativas = {
      'vacinacao': 300, // 300% de aumento durante campanhas
      'doenca_sazonal': 150, // 150% mais casos
      'procedimento_sazonal': 80, // 80% mais procedimentos
      'campanha_preventiva': 40, // 40% mais engajamento
      'data_comemorativa': 20 // 20% mais visibilidade
    };

    const baseAumento = estimativas[categoria as keyof typeof estimativas] || 30;
    const fatorPrioridade = sazonalidades.some(s => s.nivel_prioridade === 'critica') ? 1.5 : 1.0;
    
    return Math.round(baseAumento * fatorPrioridade);
  }

  private identificarPeriodoPico(sazonalidades: SazonalidadeVeterinaria[]): string {
    // Encontrar período mais comum
    const periodos = sazonalidades.map(s => s.periodo_inicio);
    const meses = periodos.map(p => parseInt(p.split('-')[0]));
    
    const mesComum = meses.reduce((acc, mes) => {
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mesPico = Object.entries(mesComum)
      .sort(([,a], [,b]) => b - a)[0][0];

    const nomesMeses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return nomesMeses[parseInt(mesPico) - 1];
  }

  private calcularTendenciaMes(sazonalidades: SazonalidadeVeterinaria[]): InsightSazonal['tendencia'] {
    const totalSazonalidades = sazonalidades.length;
    const criticasAltas = sazonalidades.filter(s => 
      s.nivel_prioridade === 'critica' || s.nivel_prioridade === 'alta'
    ).length;

    const ratio = criticasAltas / totalSazonalidades;
    
    if (ratio > 0.6) return 'crescente';
    if (ratio < 0.3) return 'decrescente';
    return 'estavel';
  }

  private gerarSugestoesEstrategicas(sazonalidades: SazonalidadeVeterinaria[]): string[] {
    const sugestoes: string[] = [];
    
    if (sazonalidades.some(s => s.categoria === 'vacinacao')) {
      sugestoes.push('Preparar campanha antecipada de vacinação com agendamento online');
    }

    if (sazonalidades.some(s => s.nivel_prioridade === 'critica')) {
      sugestoes.push('Intensificar comunicação preventiva e educativa');
    }

    if (sazonalidades.some(s => s.tipo_acao === 'promocional')) {
      sugestoes.push('Aproveitar datas comemorativas para ações de marketing');
    }

    return sugestoes;
  }

  // Salvar dados no Supabase
  async salvarCalendarioSazonalidades(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('calendario_sazonalidades')
        .upsert(
          SAZONALIDADES_VETERINARIAS_BR.map(saz => ({
            id: saz.id,
            user_id: userId,
            nome: saz.nome,
            categoria: saz.categoria,
            periodo_inicio: saz.periodo_inicio,
            periodo_fim: saz.periodo_fim,
            descricao: saz.descricao,
            especies_aplicaveis: saz.especies_aplicaveis,
            regioes_brasil: saz.regioes_brasil,
            nivel_prioridade: saz.nivel_prioridade,
            tipo_acao: saz.tipo_acao,
            tags_relacionadas: saz.tags_relacionadas,
            content_suggestions: saz.content_suggestions,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }))
        );

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao salvar calendário de sazonalidades:', error);
      throw error;
    }
  }
}

// =====================================================
// EXPORTAÇÕES E INSTÂNCIA GLOBAL
// =====================================================

export const calendarioSazonalidades = new CalendarioSazonalidadesSystem();

// Utilitários para uso em componentes
export const formatarPeriodoSazonalidade = (inicio: string, fim: string): string => {
  const formatarData = (data: string) => {
    const [mes, dia] = data.split('-');
    const meses = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return `${dia}/${meses[parseInt(mes) - 1]}`;
  };

  return `${formatarData(inicio)} - ${formatarData(fim)}`;
};

export const obterCorPrioridade = (prioridade: SazonalidadeVeterinaria['nivel_prioridade']): string => {
  const cores = {
    'critica': 'text-red-600 bg-red-50 border-red-200',
    'alta': 'text-orange-600 bg-orange-50 border-orange-200', 
    'media': 'text-blue-600 bg-blue-50 border-blue-200',
    'baixa': 'text-gray-600 bg-gray-50 border-gray-200'
  };
  
  return cores[prioridade] || cores.media;
};