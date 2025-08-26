// SISTEMA DE TEMAS-MÃE PARA PILARES EDITORIAIS - AGÊNCIA PET IA
// Implementado por: AI_Engineer durante Sprint 3-5
// Data: 2025-08-24
// Integração com OpenAI GPT-4o para geração automática

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// =====================================================
// INTERFACES E TIPOS TYPESCRIPT
// =====================================================

export interface PilarEditorialData {
  nome: string;
  descricao?: string;
  businessType: string;
  targetAudience: string;
  location?: string;
  brandVoiceId?: string;
}

export interface TemaMae {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'saude' | 'comportamento' | 'nutricao' | 'cuidados' | 'lazer';
  jornada: 'tofu' | 'mofu' | 'bofu';
  keywords: string[];
  compliance_status: 'aprovado' | 'pendente' | 'bloqueado';
  formatos_sugeridos: string[];
}

export interface JornadaMapeamento {
  tofu: TemaMae[];
  mofu: TemaMae[];
  bofu: TemaMae[];
}

export interface PilarGeradoIA {
  nome_pilar: string;
  descricao: string;
  temas_mae: TemaMae[];
  jornada_mapping: JornadaMapeamento;
  compliance_check: 'aprovado' | 'pendente';
  observacoes: string;
  disclaimers_necessarios: string[];
}

// =====================================================
// SYSTEM PROMPTS ESPECÍFICOS POR TIPO DE NEGÓCIO PET
// =====================================================

export const PROMPTS_POR_TIPO_NEGOCIO = {
  clinica_veterinaria: `
Você é um estrategista de marketing especializado em clínicas veterinárias brasileiras.

CONTEXTO ESPECÍFICO:
- Negócio: Clínica Veterinária
- Regulamentação: CFMV (Conselho Federal de Medicina Veterinária)
- Público: Tutores de pets preocupados com saúde animal
- Compliance: RIGOROSO - conteúdo médico requer supervisão veterinária

PILARES EDITORIAIS RECOMENDADOS PARA CLÍNICAS:
1. EDUCAÇÃO EM SAÚDE PREVENTIVA (TOFU)
2. SINAIS DE ALERTA E QUANDO PROCURAR AJUDA (MOFU)  
3. ESPECIALIDADES E DIFERENCIAIS DA CLÍNICA (BOFU)
4. CASOS DE SUCESSO E DEPOIMENTOS (BOFU)
5. SAZONALIDADES VETERINÁRIAS (TOFU/MOFU)

COMPLIANCE CRÍTICO:
- NUNCA diagnosticar ou prescrever tratamentos
- SEMPRE incluir "Consulte um médico veterinário"
- EVITAR termos como "cura", "tratamento definitivo"
- PRIORIZAR prevenção e educação geral
`,

  pet_shop: `
Você é um estrategista de marketing especializado em pet shops brasileiros.

CONTEXTO ESPECÍFICO:
- Negócio: Pet Shop / Loja de Produtos Pet
- Público: Tutores buscando produtos e acessórios
- Foco: Produto, variedade, atendimento, preço-qualidade

PILARES EDITORIAIS RECOMENDADOS PARA PET SHOPS:
1. EDUCAÇÃO SOBRE PRODUTOS (TOFU)
2. COMPARATIVOS E RECOMENDAÇÕES (MOFU)
3. OFERTAS E LANÇAMENTOS (BOFU)  
4. DICAS DE USO E CUIDADOS (TOFU)
5. ATENDIMENTO E EXPERIÊNCIA NA LOJA (BOFU)

COMPLIANCE:
- EVITAR claims médicos sobre produtos
- INCLUIR "Consulte veterinário para orientações específicas"
- DESTACAR qualidade e procedência dos produtos
`,

  banho_tosa: `
Você é um estrategista de marketing especializado em serviços de banho e tosa.

CONTEXTO ESPECÍFICO:
- Negócio: Banho e Tosa / Estética Animal
- Público: Tutores preocupados com higiene e bem-estar
- Foco: Estética, higiene, conforto do animal

PILARES EDITORIAIS RECOMENDADOS PARA BANHO E TOSA:
1. EDUCAÇÃO EM HIGIENE ANIMAL (TOFU)
2. TÉCNICAS E CUIDADOS ESPECIAIS (MOFU)
3. SERVIÇOS E DIFERENCIAIS (BOFU)
4. ANTES E DEPOIS - TRANSFORMAÇÕES (BOFU)  
5. CUIDADOS DOMÉSTICOS (TOFU)

COMPLIANCE:
- DESTACAR bem-estar animal
- MENCIONAR produtos hipoalergênicos quando aplicável
- INCLUIR cuidados pós-procedimento
`
};

// =====================================================
// GERADOR DE PILARES EDITORIAIS COM IA
// =====================================================

export class PilarEditorialGenerator {
  private supabase;
  private openaiApiKey: string;

  constructor() {
    this.supabase = this.createSupabaseClient();
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  private createSupabaseClient() {
    const cookieStore = cookies();
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
  }

  async gerarPilarEditorial(data: PilarEditorialData): Promise<PilarGeradoIA> {
    try {
      // 1. Obter Brand Voice se disponível
      let brandVoiceContext = '';
      if (data.brandVoiceId) {
        brandVoiceContext = await this.obterBrandVoiceContext(data.brandVoiceId);
      }

      // 2. Selecionar prompt específico para tipo de negócio
      const promptBase = PROMPTS_POR_TIPO_NEGOCIO[data.businessType as keyof typeof PROMPTS_POR_TIPO_NEGOCIO] 
        || PROMPTS_POR_TIPO_NEGOCIO.pet_shop;

      // 3. Construir prompt completo
      const promptCompleto = `
${promptBase}

INFORMAÇÕES DO NEGÓCIO:
- Nome do Pilar: ${data.nome}
- Descrição: ${data.descricao || 'Não informada'}
- Público-alvo: ${data.targetAudience}
- Localização: ${data.location || 'Brasil'}

BRAND VOICE CONTEXT:
${brandVoiceContext}

TAREFA: Gere um pilar editorial completo seguindo este formato JSON:

{
  "nome_pilar": "string (use o nome fornecido: ${data.nome})",
  "descricao": "string (descrição detalhada do pilar)",
  "temas_mae": [
    {
      "id": "string (formato: tema-001)",
      "nome": "string",
      "descricao": "string",
      "categoria": "saude|comportamento|nutricao|cuidados|lazer",
      "jornada": "tofu|mofu|bofu",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "compliance_status": "aprovado|pendente",
      "formatos_sugeridos": ["post", "stories", "reel", "carrossel"]
    }
  ],
  "jornada_mapping": {
    "tofu": [/* temas educacionais */],
    "mofu": [/* temas de consideração */], 
    "bofu": [/* temas de conversão */]
  },
  "compliance_check": "aprovado|pendente",
  "observacoes": "string",
  "disclaimers_necessarios": ["disclaimer1", "disclaimer2"]
}

REGRAS IMPORTANTES:
- Gere 8-12 temas-mãe bem distribuídos pela jornada
- 40% TOFU, 35% MOFU, 25% BOFU
- Todos os temas devem estar compliance com regulamentações veterinárias
- Keywords específicas do nicho pet brasileiro
- Observações sobre aplicação prática de cada tema
`;

      // 4. Chamar OpenAI
      const resultado = await this.chamarOpenAI(promptCompleto);

      // 5. Validar compliance
      const resultadoValidado = await this.validarCompliance(resultado);

      return resultadoValidado;

    } catch (error) {
      console.error('Erro ao gerar pilar editorial:', error);
      throw new Error(`Falha na geração: ${error}`);
    }
  }

  private async obterBrandVoiceContext(brandVoiceId: string): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('brand_manuals')
        .select('chapters')
        .eq('id', brandVoiceId)
        .single();

      if (error || !data) {
        return 'Brand Voice não disponível';
      }

      // Extrair informações relevantes do Brand Manual
      const chapters = data.chapters || {};
      return `
Tom de voz: ${chapters.tom_voz || 'Não definido'}
Personalidade: ${chapters.personalidade || 'Não definida'}
Valores: ${chapters.valores || 'Não definidos'}
Termos aprovados: ${chapters.termos_aprovados?.join(', ') || 'Não definidos'}
Termos bloqueados: ${chapters.termos_bloqueados?.join(', ') || 'Não definidos'}
      `.trim();

    } catch (error) {
      console.error('Erro ao obter Brand Voice:', error);
      return 'Brand Voice não disponível';
    }
  }

  private async chamarOpenAI(prompt: string): Promise<PilarGeradoIA> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em marketing para negócios pet no Brasil. Retorne sempre JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Erro OpenAI: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    try {
      return JSON.parse(content) as PilarGeradoIA;
    } catch (error) {
      console.error('Erro ao parsear JSON da OpenAI:', content);
      throw new Error('Resposta da IA inválida');
    }
  }

  private async validarCompliance(pilar: PilarGeradoIA): Promise<PilarGeradoIA> {
    // Termos automaticamente bloqueados para compliance veterinário
    const termosProibidos = [
      'diagnóstico', 'prescrição', 'tratamento específico', 'medicação',
      'cura garantida', 'elimina completamente', 'resolve definitivamente',
      'substitui consulta veterinária', 'auto-medicação'
    ];

    const termosObrigatorios = [
      'consulte um veterinário', 'orientação profissional',
      'acompanhamento veterinário', 'supervisão especializada'
    ];

    let complianceIssues: string[] = [];

    // Verificar cada tema-mãe
    pilar.temas_mae.forEach((tema, index) => {
      const textoCompleto = `${tema.nome} ${tema.descricao}`.toLowerCase();

      // Verificar termos proibidos
      termosProibidos.forEach(termo => {
        if (textoCompleto.includes(termo.toLowerCase())) {
          complianceIssues.push(`Tema "${tema.nome}": contém termo proibido "${termo}"`);
          tema.compliance_status = 'pendente';
        }
      });

      // Para temas de saúde, verificar disclaimers
      if (tema.categoria === 'saude' && tema.jornada === 'mofu') {
        const temDisclaimer = termosObrigatorios.some(termo => 
          textoCompleto.includes(termo.toLowerCase())
        );
        
        if (!temDisclaimer) {
          complianceIssues.push(`Tema "${tema.nome}": requer disclaimer veterinário`);
          tema.compliance_status = 'pendente';
        }
      }
    });

    // Definir status geral de compliance
    if (complianceIssues.length > 0) {
      pilar.compliance_check = 'pendente';
      pilar.observacoes += `\n\nISSUES DE COMPLIANCE:\n${complianceIssues.join('\n')}`;
    } else {
      pilar.compliance_check = 'aprovado';
    }

    return pilar;
  }

  async salvarPilarNoBanco(userId: string, pilar: PilarGeradoIA): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('pilares_editoriais')
        .insert({
          user_id: userId,
          nome: pilar.nome_pilar,
          descricao: pilar.descricao,
          temas_mae: pilar.temas_mae,
          jornada_mapping: pilar.jornada_mapping,
          status: pilar.compliance_check === 'aprovado' ? 'ativo' : 'inativo'
        })
        .select('id')
        .single();

      if (error) throw error;

      return data.id;

    } catch (error) {
      console.error('Erro ao salvar pilar no banco:', error);
      throw new Error('Falha ao persistir dados');
    }
  }
}

// =====================================================
// ANÁLISE E OTIMIZAÇÃO DE PILARES EXISTENTES
// =====================================================

export class PilarAnalyzer {
  private supabase;

  constructor() {
    this.supabase = this.createSupabaseClient();
  }

  private createSupabaseClient() {
    const cookieStore = cookies();
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
  }

  async analisarPerformancePilar(pilarId: string): Promise<any> {
    try {
      // Buscar dados do pilar
      const { data: pilar, error } = await this.supabase
        .from('pilares_editoriais')
        .select('*')
        .eq('id', pilarId)
        .single();

      if (error || !pilar) {
        throw new Error('Pilar não encontrado');
      }

      // Analisar distribuição TOFU/MOFU/BOFU
      const distribuicao = this.calcularDistribuicaoJornada(pilar.jornada_mapping);

      // Analisar cobertura de categorias pet
      const coberturaCategorias = this.analisarCoberturaCategorias(pilar.temas_mae);

      // Identificar lacunas
      const lacunasIdentificadas = this.identificarLacunas(pilar.temas_mae, pilar.jornada_mapping);

      return {
        pilar_id: pilarId,
        nome: pilar.nome,
        distribuicao_jornada: distribuicao,
        cobertura_categorias: coberturaCategorias,
        lacunas_identificadas: lacunasIdentificadas,
        score_qualidade: this.calcularScoreQualidade(distribuicao, coberturaCategorias),
        recomendacoes: this.gerarRecomendacoes(distribuicao, coberturaCategorias, lacunasIdentificadas)
      };

    } catch (error) {
      console.error('Erro ao analisar performance do pilar:', error);
      throw error;
    }
  }

  private calcularDistribuicaoJornada(jornada: JornadaMapeamento): any {
    const totalTemas = (jornada.tofu?.length || 0) + (jornada.mofu?.length || 0) + (jornada.bofu?.length || 0);
    
    if (totalTemas === 0) {
      return { tofu: 0, mofu: 0, bofu: 0, total: 0 };
    }

    return {
      tofu: Math.round(((jornada.tofu?.length || 0) / totalTemas) * 100),
      mofu: Math.round(((jornada.mofu?.length || 0) / totalTemas) * 100),
      bofu: Math.round(((jornada.bofu?.length || 0) / totalTemas) * 100),
      total: totalTemas
    };
  }

  private analisarCoberturaCategorias(temas: TemaMae[]): any {
    const categorias = ['saude', 'comportamento', 'nutricao', 'cuidados', 'lazer'];
    const cobertura = categorias.map(categoria => ({
      categoria,
      temas_count: temas.filter(tema => tema.categoria === categoria).length,
      percentual: Math.round((temas.filter(tema => tema.categoria === categoria).length / temas.length) * 100)
    }));

    return {
      distribuicao: cobertura,
      categorias_cobertas: cobertura.filter(c => c.temas_count > 0).length,
      total_categorias: categorias.length
    };
  }

  private identificarLacunas(temas: TemaMae[], jornada: JornadaMapeamento): string[] {
    const lacunas: string[] = [];

    // Verificar distribuição ideal TOFU (40%), MOFU (35%), BOFU (25%)
    const distribuicao = this.calcularDistribuicaoJornada(jornada);
    
    if (distribuicao.tofu < 35) lacunas.push('Poucos temas TOFU - adicionar conteúdo educacional');
    if (distribuicao.mofu < 30) lacunas.push('Poucos temas MOFU - adicionar conteúdo de consideração');
    if (distribuicao.bofu < 20) lacunas.push('Poucos temas BOFU - adicionar conteúdo de conversão');

    // Verificar categorias pet essenciais
    const categorias = this.analisarCoberturaCategorias(temas);
    if (categorias.distribuicao.find(c => c.categoria === 'saude')?.temas_count === 0) {
      lacunas.push('Categoria SAÚDE não coberta - essencial para negócios pet');
    }
    if (categorias.distribuicao.find(c => c.categoria === 'cuidados')?.temas_count === 0) {
      lacunas.push('Categoria CUIDADOS não coberta - importante para educação');
    }

    return lacunas;
  }

  private calcularScoreQualidade(distribuicao: any, categorias: any): number {
    let score = 100;

    // Penalizar desvios da distribuição ideal
    const idealTofu = 40, idealMofu = 35, idealBofu = 25;
    score -= Math.abs(distribuicao.tofu - idealTofu) * 0.5;
    score -= Math.abs(distribuicao.mofu - idealMofu) * 0.5;
    score -= Math.abs(distribuicao.bofu - idealBofu) * 0.5;

    // Bonificar cobertura de categorias
    score += (categorias.categorias_cobertas / categorias.total_categorias) * 20;

    return Math.max(0, Math.round(score));
  }

  private gerarRecomendacoes(distribuicao: any, categorias: any, lacunas: string[]): string[] {
    const recomendacoes: string[] = [];

    if (lacunas.length > 0) {
      recomendacoes.push(`Identificadas ${lacunas.length} lacunas principais a serem endereçadas`);
    }

    if (distribuicao.total < 8) {
      recomendacoes.push('Considere adicionar mais temas para melhor cobertura (mínimo recomendado: 8-12 temas)');
    }

    if (categorias.categorias_cobertas < 4) {
      recomendacoes.push('Diversifique as categorias para cobrir mais aspectos do universo pet');
    }

    return recomendacoes;
  }
}

// =====================================================
// SUGESTÕES AUTOMÁTICAS DE CONTEÚDO
// =====================================================

export class ConteudoSuggestionEngine {
  async gerarSugestoesParaTema(tema: TemaMae, businessType: string): Promise<any> {
    const sugestoes = {
      tema_id: tema.id,
      tema_nome: tema.nome,
      formatos_prioritarios: this.definirFormatosPrioritarios(tema.categoria, tema.jornada),
      canais_recomendados: this.definirCanaisRecomendados(tema.jornada, businessType),
      cronograma_sugerido: this.definirCronograma(tema.categoria),
      call_to_actions: this.definirCTAs(tema.jornada),
      hashtags_sugeridas: await this.gerarHashtagsPersonalizadas(tema),
      compliance_alerts: this.definirAlertasCompliance(tema.categoria)
    };

    return sugestoes;
  }

  private definirFormatosPrioritarios(categoria: string, jornada: string): string[] {
    const formatosMap = {
      tofu: {
        saude: ['carrossel-educativo', 'stories-info', 'post-dicas'],
        comportamento: ['reel-demonstrativo', 'stories-cases', 'post-explicativo'],
        nutricao: ['infografico', 'carrossel-comparativo', 'post-educativo'],
        cuidados: ['tutorial-stories', 'post-checklist', 'reel-passo-a-passo'],
        lazer: ['reel-diversao', 'stories-momentos', 'post-inspiracional']
      },
      mofu: {
        saude: ['carrossel-sinais', 'post-when-to-see-vet', 'stories-qa'],
        comportamento: ['case-studies', 'before-after', 'post-solucoes'],
        nutricao: ['comparativo-produtos', 'post-recomendacoes', 'stories-duvidas'],
        cuidados: ['guia-completo', 'post-seasonal', 'carrossel-preparo'],
        lazer: ['ideias-atividades', 'post-produtos-rec', 'stories-experiences']
      },
      bofu: {
        saude: ['depoimentos', 'cases-sucesso', 'post-diferenciais'],
        comportamento: ['resultados-obtidos', 'post-metodologia', 'stories-transformacoes'],
        nutricao: ['post-ofertas', 'stories-promocoes', 'carrossel-beneficios'],
        cuidados: ['post-servicos', 'stories-processo', 'carrossel-antes-depois'],
        lazer: ['post-produtos', 'stories-vendas', 'carrossel-catalogo']
      }
    };

    return formatosMap[jornada as keyof typeof formatosMap]?.[categoria as keyof any] || ['post-generico'];
  }

  private definirCanaisRecomendados(jornada: string, businessType: string): string[] {
    const canaisMap = {
      tofu: ['instagram', 'facebook', 'blog', 'tiktok'],
      mofu: ['instagram', 'email', 'whatsapp', 'blog'],
      bofu: ['whatsapp', 'email', 'instagram-dm', 'ligacao']
    };

    return canaisMap[jornada as keyof typeof canaisMap] || ['instagram'];
  }

  private definirCronograma(categoria: string): any {
    return {
      frequencia_semanal: categoria === 'saude' ? 2 : 1,
      melhor_dia: categoria === 'lazer' ? 'weekend' : 'weekday',
      melhor_horario: categoria === 'saude' ? '09:00-11:00' : '19:00-21:00',
      sazonalidade: this.definirSazonalidade(categoria)
    };
  }

  private definirSazonalidade(categoria: string): string {
    const sazonalidadeMap = {
      saude: 'vacinacao-campaigns, checkup-reminders',
      comportamento: 'back-to-routine, holiday-stress',
      nutricao: 'summer-hydration, winter-nutrients',
      cuidados: 'summer-grooming, winter-protection',
      lazer: 'vacation-activities, holiday-toys'
    };

    return sazonalidadeMap[categoria as keyof typeof sazonalidadeMap] || 'year-round';
  }

  private definirCTAs(jornada: string): string[] {
    const ctaMap = {
      tofu: [
        'Saiba mais sobre [tópico]',
        'Compartilhe com outros tutores',
        'Salve este post para consultar depois',
        'Siga para mais dicas pet'
      ],
      mofu: [
        'Agende uma consulta',
        'Entre em contato para mais informações',
        'Visite nossa loja',
        'Converse conosco pelo WhatsApp'
      ],
      bofu: [
        'Agende agora',
        'Compre online',
        'Ligue para nós',
        'Venha nos conhecer'
      ]
    };

    return ctaMap[jornada as keyof typeof ctaMap] || ['Entre em contato'];
  }

  private async gerarHashtagsPersonalizadas(tema: TemaMae): Promise<string[]> {
    // Base de hashtags por categoria
    const hashtagsBase = {
      saude: ['#saudepet', '#veterinario', '#cuidadospet', '#prevencao', '#bemestarapet'],
      comportamento: ['#comportamentoanimal', '#adestramento', '#petbehavior', '#educacaopet'],
      nutricao: ['#nutricaopet', '#alimentacaosaudavel', '#dietapet', '#racaonatural'],
      cuidados: ['#cuidadospet', '#higieneanimal', '#groomingpet', '#petcare'],
      lazer: ['#diversaopet', '#brinquedospet', '#entretenimento', '#vidapet']
    };

    const baseHashtags = hashtagsBase[tema.categoria] || ['#pet', '#amor'];

    // Adicionar hashtags específicas das keywords do tema
    const keywordHashtags = tema.keywords.map(kw => 
      `#${kw.toLowerCase().replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}`
    );

    // Combinar e limitar a 10 hashtags
    return [...baseHashtags, ...keywordHashtags].slice(0, 10);
  }

  private definirAlertasCompliance(categoria: string): string[] {
    const alertsMap = {
      saude: [
        'OBRIGATÓRIO: Incluir disclaimer veterinário',
        'EVITAR: Claims médicos não comprovados',
        'INCLUIR: "Consulte sempre um veterinário"'
      ],
      comportamento: [
        'CUIDADO: Não substituir orientação profissional',
        'DESTACAR: Bem-estar animal sempre em primeiro lugar'
      ],
      nutricao: [
        'OBRIGATÓRIO: Não prescrever dietas específicas',
        'INCLUIR: "Consulte veterinário sobre alimentação"'
      ],
      cuidados: [
        'DESTACAR: Produtos hipoalergênicos quando aplicável',
        'INCLUIR: Cuidados de segurança'
      ],
      lazer: [
        'VERIFICAR: Segurança dos produtos/atividades',
        'DESTACAR: Supervisão durante brincadeiras'
      ]
    };

    return alertsMap[categoria as keyof typeof alertsMap] || ['Verificar compliance geral'];
  }
}

// =====================================================
// EXPORTAÇÕES PARA USO EM API ROUTES
// =====================================================

export const pilarGenerator = new PilarEditorialGenerator();
export const pilarAnalyzer = new PilarAnalyzer();
export const contentSuggester = new ConteudoSuggestionEngine();