// SISTEMA DE VALIDAÇÃO DE COMPLIANCE VETERINÁRIO
// Implementado por: Pet_Compliance_Specialist durante Sprint 3-5
// Garantia de conformidade com CFMV e regulamentações brasileiras

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// =====================================================
// INTERFACES DE COMPLIANCE PET
// =====================================================

export interface ComplianceRule {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'cfmv' | 'anvisa' | 'mapa' | 'conar' | 'lgpd';
  nivel_severidade: 'critico' | 'alto' | 'medio' | 'baixo';
  termos_proibidos: string[];
  termos_obrigatorios: string[];
  contextos_aplicaveis: string[];
  penalidades: string[];
  referencias_legais: string[];
  criado_em: string;
  atualizado_em: string;
}

export interface ComplianceCheck {
  id: string;
  content_id: string;
  content_type: 'pilar_editorial' | 'tema_mae' | 'campanha' | 'post';
  content_text: string;
  status: 'aprovado' | 'pendente' | 'reprovado' | 'revisao';
  violations: ComplianceViolation[];
  recommendations: string[];
  disclaimers_necessarios: string[];
  score_compliance: number; // 0-100
  revisor_id?: string;
  revisado_em?: string;
  observacoes_revisor?: string;
  created_at: string;
}

export interface ComplianceViolation {
  rule_id: string;
  rule_name: string;
  violation_type: 'termo_proibido' | 'termo_ausente' | 'claim_inadequado' | 'disclaimer_ausente';
  violating_text: string;
  severity: 'critico' | 'alto' | 'medio' | 'baixo';
  suggestion: string;
  context: string;
}

export interface ComplianceReport {
  periodo: {
    inicio: string;
    fim: string;
  };
  resumo: {
    total_verificacoes: number;
    aprovados: number;
    pendentes: number;
    reprovados: number;
    score_medio: number;
  };
  violacoes_por_categoria: Array<{
    categoria: string;
    total: number;
    criticas: number;
    resolvidas: number;
  }>;
  tendencias: Array<{
    periodo: string;
    score_medio: number;
    total_verificacoes: number;
  }>;
  areas_atencao: string[];
  recomendacoes_gerais: string[];
}

// =====================================================
// BASE DE CONHECIMENTO CFMV - MEDICINA VETERINÁRIA
// =====================================================

export const CFMV_COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'cfmv-001',
    nome: 'Proibição de Diagnósticos Online',
    descricao: 'Vedação de diagnósticos, prescrições ou orientações médicas sem consulta presencial',
    categoria: 'cfmv',
    nivel_severidade: 'critico',
    termos_proibidos: [
      'diagnostico online', 'prescrevo', 'receito', 'trate com', 'medicamento para',
      'dose recomendada', 'tratamento específico', 'cura definitiva', 'elimina completamente'
    ],
    termos_obrigatorios: [
      'consulte um veterinário', 'orientação profissional', 'avaliação veterinária',
      'acompanhamento médico veterinário'
    ],
    contextos_aplicaveis: ['saude', 'comportamento', 'nutricao'],
    penalidades: ['Multa CFMV', 'Processo ético-profissional', 'Cancelamento registro'],
    referencias_legais: [
      'Lei Federal 5.517/68 - Exercício da Medicina Veterinária',
      'Resolução CFMV 1.138/2016 - Código de Ética do Médico Veterinário'
    ],
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  },
  {
    id: 'cfmv-002',
    nome: 'Claims de Eficácia Médica',
    descricao: 'Proibição de afirmações sobre eficácia terapêutica sem respaldo científico',
    categoria: 'cfmv',
    nivel_severidade: 'alto',
    termos_proibidos: [
      '100% eficaz', 'cura garantida', 'resolve definitivamente', 'elimina totalmente',
      'tratamento milagroso', 'sem efeitos colaterais', 'substitui medicamento'
    ],
    termos_obrigatorios: [
      'resultados podem variar', 'consulte veterinário', 'uso sob supervisão'
    ],
    contextos_aplicaveis: ['saude', 'produtos'],
    penalidades: ['Advertência', 'Multa', 'Suspensão temporária'],
    referencias_legais: ['Resolução CFMV 1.015/2012'],
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  },
  {
    id: 'cfmv-003',
    nome: 'Bem-estar Animal',
    descricao: 'Obrigatoriedade de priorizar bem-estar animal em todas as comunicações',
    categoria: 'cfmv',
    nivel_severidade: 'medio',
    termos_proibidos: [
      'forçar procedimento', 'ignorar stress', 'procedimento rápido a qualquer custo'
    ],
    termos_obrigatorios: [
      'bem-estar animal', 'conforto do pet', 'redução do stress', 'ambiente acolhedor'
    ],
    contextos_aplicaveis: ['cuidados', 'procedimentos', 'maneio'],
    penalidades: ['Orientação', 'Advertência'],
    referencias_legais: ['Lei Federal 9.605/98 - Crimes Ambientais'],
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  },
  {
    id: 'anvisa-001',
    nome: 'Produtos Veterinários',
    descricao: 'Regulamentação de claims sobre produtos farmacêuticos veterinários',
    categoria: 'anvisa',
    nivel_severidade: 'alto',
    termos_proibidos: [
      'sem registro anvisa', 'produto natural não precisa registro', 'fórmula secreta'
    ],
    termos_obrigatorios: [
      'registro anvisa', 'uso conforme bula', 'produto registrado'
    ],
    contextos_aplicaveis: ['produtos', 'medicamentos', 'suplementos'],
    penalidades: ['Apreensão produtos', 'Multa', 'Interdição'],
    referencias_legais: ['Lei 6.360/76 - Vigilância Sanitária'],
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  },
  {
    id: 'conar-001',
    nome: 'Publicidade Responsável',
    descricao: 'Diretrizes para publicidade ética no setor pet',
    categoria: 'conar',
    nivel_severidade: 'medio',
    termos_proibidos: [
      'melhor veterinário', 'único tratamento eficaz', 'concorrência inferior'
    ],
    termos_obrigatorios: [
      'informações verídicas', 'baseado em evidências', 'transparência'
    ],
    contextos_aplicaveis: ['marketing', 'publicidade', 'campanhas'],
    penalidades: ['Sustação campanha', 'Advertência pública'],
    referencias_legais: ['Código Brasileiro de Autorregulamentação Publicitária'],
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString()
  }
];

// =====================================================
// SISTEMA INTELIGENTE DE DETECÇÃO DE VIOLAÇÕES
// =====================================================

export class PetComplianceValidator {
  private rules: ComplianceRule[];
  private supabase;

  constructor() {
    this.rules = CFMV_COMPLIANCE_RULES;
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

  async validarCompliance(
    contentId: string,
    contentType: 'pilar_editorial' | 'tema_mae' | 'campanha' | 'post',
    contentText: string,
    contexto?: string[]
  ): Promise<ComplianceCheck> {
    
    const violations: ComplianceViolation[] = [];
    const recommendations: string[] = [];
    const disclaimersNecessarios: string[] = [];

    // 1. Verificar cada regra aplicável
    for (const rule of this.rules) {
      if (contexto && contexto.length > 0) {
        const aplicavel = rule.contextos_aplicaveis.some(ctx => 
          contexto.some(userCtx => userCtx.toLowerCase().includes(ctx.toLowerCase()))
        );
        if (!aplicavel) continue;
      }

      // 2. Verificar termos proibidos
      for (const termoPr of rule.termos_proibidos) {
        if (this.contemTermo(contentText, termoPr)) {
          violations.push({
            rule_id: rule.id,
            rule_name: rule.nome,
            violation_type: 'termo_proibido',
            violating_text: this.extrairContextoViolacao(contentText, termoPr),
            severity: rule.nivel_severidade,
            suggestion: this.gerarSugestaoCorrecao(termoPr, rule.categoria),
            context: `Termo "${termoPr}" identificado no texto`
          });
        }
      }

      // 3. Verificar termos obrigatórios (para contextos de saúde)
      if (contexto?.includes('saude') || contexto?.includes('medicamentos')) {
        for (const termoOb of rule.termos_obrigatorios) {
          if (!this.contemTermo(contentText, termoOb)) {
            violations.push({
              rule_id: rule.id,
              rule_name: rule.nome,
              violation_type: 'termo_ausente',
              violating_text: 'Disclaimer obrigatório ausente',
              severity: rule.nivel_severidade,
              suggestion: `Adicione: "${termoOb}"`,
              context: `Termo obrigatório "${termoOb}" não encontrado`
            });
            disclaimersNecessarios.push(termoOb);
          }
        }
      }
    }

    // 4. Análise contextual adicional
    const analiseContextual = this.analisarContextoEspecifico(contentText, contentType);
    violations.push(...analiseContextual.violations);
    recommendations.push(...analiseContextual.recommendations);

    // 5. Calcular score de compliance
    const scoreCompliance = this.calcularScoreCompliance(violations);

    // 6. Definir status final
    const status = this.definirStatusCompliance(scoreCompliance, violations);

    const complianceCheck: ComplianceCheck = {
      id: `check_${Date.now()}`,
      content_id: contentId,
      content_type: contentType,
      content_text: contentText,
      status,
      violations,
      recommendations,
      disclaimers_necessarios: disclaimersNecessarios,
      score_compliance: scoreCompliance,
      created_at: new Date().toISOString()
    };

    // 7. Salvar no banco
    await this.salvarComplianceCheck(complianceCheck);

    return complianceCheck;
  }

  private contemTermo(texto: string, termo: string): boolean {
    const textoLower = texto.toLowerCase();
    const termoLower = termo.toLowerCase();
    
    // Busca por palavras completas e expressões
    const regex = new RegExp(`\\b${termoLower.replace(/\s+/g, '\\s+')}\\b`, 'i');
    return regex.test(textoLower);
  }

  private extrairContextoViolacao(texto: string, termo: string): string {
    const textoLower = texto.toLowerCase();
    const termoLower = termo.toLowerCase();
    
    const index = textoLower.indexOf(termoLower);
    if (index === -1) return termo;

    const inicio = Math.max(0, index - 30);
    const fim = Math.min(texto.length, index + termo.length + 30);
    
    return `...${texto.substring(inicio, fim)}...`;
  }

  private gerarSugestaoCorrecao(termoProibido: string, categoria: string): string {
    const sugestoes = {
      'diagnostico online': 'Consulte um veterinário para diagnóstico preciso',
      'prescrevo': 'Recomendamos orientação veterinária',
      'cura garantida': 'Resultados podem variar, consulte especialista',
      'tratamento específico': 'Orientação individualizada com veterinário',
      'elimina completamente': 'Ajuda a reduzir significativamente',
      '100% eficaz': 'Alta eficácia comprovada em estudos',
      'sem efeitos colaterais': 'Baixo risco de efeitos adversos'
    };

    return sugestoes[termoProibido.toLowerCase()] || `Revisar uso de "${termoProibido}"`;
  }

  private analisarContextoEspecifico(texto: string, tipo: string): {
    violations: ComplianceViolation[];
    recommendations: string[];
  } {
    const violations: ComplianceViolation[] = [];
    const recommendations: string[] = [];

    // Análise específica por tipo de conteúdo
    if (tipo === 'pilar_editorial') {
      // Verificar se pilares de saúde têm disclaimers adequados
      if (texto.toLowerCase().includes('saúde') || texto.toLowerCase().includes('veterinár')) {
        if (!texto.toLowerCase().includes('consulte') && !texto.toLowerCase().includes('orientação')) {
          violations.push({
            rule_id: 'custom-001',
            rule_name: 'Disclaimer Veterinário em Pilares',
            violation_type: 'disclaimer_ausente',
            violating_text: 'Pilar sobre saúde sem disclaimer',
            severity: 'alto',
            suggestion: 'Adicionar: "Sempre consulte um médico veterinário"',
            context: 'Pilares relacionados à saúde requerem disclaimers'
          });
        }
      }
    }

    if (tipo === 'campanha') {
      // Verificar claims promocionais
      const claimsPromocionais = [
        'melhor preço', 'único no mercado', 'revolucionário', 'milagroso'
      ];
      
      for (const claim of claimsPromocionais) {
        if (this.contemTermo(texto, claim)) {
          recommendations.push(`Considerar moderação do claim "${claim}" para evitar exageros publicitários`);
        }
      }
    }

    return { violations, recommendations };
  }

  private calcularScoreCompliance(violations: ComplianceViolation[]): number {
    if (violations.length === 0) return 100;

    let totalDeducao = 0;
    
    for (const violation of violations) {
      switch (violation.severity) {
        case 'critico': totalDeducao += 30; break;
        case 'alto': totalDeducao += 20; break;
        case 'medio': totalDeducao += 10; break;
        case 'baixo': totalDeducao += 5; break;
      }
    }

    return Math.max(0, 100 - totalDeducao);
  }

  private definirStatusCompliance(score: number, violations: ComplianceViolation[]): ComplianceCheck['status'] {
    const temCriticas = violations.some(v => v.severity === 'critico');
    
    if (temCriticas) return 'reprovado';
    if (score < 70) return 'reprovado';
    if (score < 85) return 'revisao';
    if (violations.length > 0) return 'pendente';
    return 'aprovado';
  }

  private async salvarComplianceCheck(check: ComplianceCheck): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('compliance_checks')
        .insert({
          content_id: check.content_id,
          content_type: check.content_type,
          content_text: check.content_text,
          status: check.status,
          violations: check.violations,
          recommendations: check.recommendations,
          disclaimers_necessarios: check.disclaimers_necessarios,
          score_compliance: check.score_compliance,
          created_at: check.created_at
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao salvar compliance check:', error);
    }
  }

  // =====================================================
  // RELATÓRIOS E ANALYTICS DE COMPLIANCE
  // =====================================================

  async gerarRelatorioCompliance(
    userId: string, 
    periodoInicio: string, 
    periodoFim: string
  ): Promise<ComplianceReport> {
    
    try {
      const { data: checks, error } = await this.supabase
        .from('compliance_checks')
        .select('*')
        .gte('created_at', periodoInicio)
        .lte('created_at', periodoFim);

      if (error) throw error;

      const totalVerificacoes = checks?.length || 0;
      const aprovados = checks?.filter(c => c.status === 'aprovado').length || 0;
      const pendentes = checks?.filter(c => c.status === 'pendente').length || 0;
      const reprovados = checks?.filter(c => c.status === 'reprovado').length || 0;
      const scoreMedio = totalVerificacoes > 0 ? 
        Math.round(checks.reduce((sum, c) => sum + (c.score_compliance || 0), 0) / totalVerificacoes) : 0;

      // Análise de violações por categoria
      const violacoesPorCategoria = this.analisarViolacoesPorCategoria(checks || []);
      
      // Tendências temporais
      const tendencias = this.calcularTendencias(checks || []);
      
      // Áreas de atenção
      const areasAtencao = this.identificarAreasAtencao(checks || []);
      
      // Recomendações gerais
      const recomendacoesGerais = this.gerarRecomendacoesGerais(checks || []);

      return {
        periodo: {
          inicio: periodoInicio,
          fim: periodoFim
        },
        resumo: {
          total_verificacoes: totalVerificacoes,
          aprovados,
          pendentes,
          reprovados,
          score_medio: scoreMedio
        },
        violacoes_por_categoria: violacoesPorCategoria,
        tendencias,
        areas_atencao: areasAtencao,
        recomendacoes_gerais: recomendacoesGerais
      };

    } catch (error) {
      console.error('Erro ao gerar relatório de compliance:', error);
      throw error;
    }
  }

  private analisarViolacoesPorCategoria(checks: any[]): Array<{
    categoria: string;
    total: number;
    criticas: number;
    resolvidas: number;
  }> {
    const categorias = ['cfmv', 'anvisa', 'conar', 'mapa'];
    
    return categorias.map(categoria => {
      const violacoesCategoria = checks.reduce((acc, check) => {
        const violacoesCat = (check.violations || []).filter((v: any) => 
          this.rules.find(r => r.id === v.rule_id)?.categoria === categoria
        );
        return acc + violacoesCategoria.length;
      }, 0);

      const criticasCategoria = checks.reduce((acc, check) => {
        const criticas = (check.violations || []).filter((v: any) => 
          this.rules.find(r => r.id === v.rule_id)?.categoria === categoria && 
          v.severity === 'critico'
        );
        return acc + criticas.length;
      }, 0);

      const resolvidasCategoria = checks.filter(c => c.status === 'aprovado').length;

      return {
        categoria: categoria.toUpperCase(),
        total: violacoesCategoria,
        criticas: criticasCategoria,
        resolvidas: resolvidasCategoria
      };
    });
  }

  private calcularTendencias(checks: any[]): Array<{
    periodo: string;
    score_medio: number;
    total_verificacoes: number;
  }> {
    // Agrupa por semana para análise de tendência
    const porSemana = checks.reduce((acc, check) => {
      const semana = new Date(check.created_at).toISOString().slice(0, 10);
      if (!acc[semana]) acc[semana] = [];
      acc[semana].push(check);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(porSemana).map(([periodo, checksSemanais]) => ({
      periodo,
      score_medio: Math.round(
        checksSemanais.reduce((sum, c) => sum + (c.score_compliance || 0), 0) / checksSemanais.length
      ),
      total_verificacoes: checksSemanais.length
    }));
  }

  private identificarAreasAtencao(checks: any[]): string[] {
    const areas: string[] = [];
    
    const scoresMediosPorTipo = checks.reduce((acc, check) => {
      if (!acc[check.content_type]) acc[check.content_type] = [];
      acc[check.content_type].push(check.score_compliance || 0);
      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(scoresMediosPorTipo).forEach(([tipo, scores]) => {
      const media = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      if (media < 80) {
        areas.push(`${tipo}: Score médio baixo (${Math.round(media)}%)`);
      }
    });

    return areas;
  }

  private gerarRecomendacoesGerais(checks: any[]): string[] {
    const recomendacoes: string[] = [];
    
    const totalReprovados = checks.filter(c => c.status === 'reprovado').length;
    if (totalReprovados > checks.length * 0.2) {
      recomendacoes.push('Taxa de reprovação alta - revisar processos de criação de conteúdo');
    }

    const violacoesFrequentes = this.identificarViolacoesFrequentes(checks);
    if (violacoesFrequentes.length > 0) {
      recomendacoes.push(`Focar na correção das violações mais frequentes: ${violacoesFrequentes.join(', ')}`);
    }

    return recomendacoes;
  }

  private identificarViolacoesFrequentes(checks: any[]): string[] {
    const contadorViolacoes = checks.reduce((acc, check) => {
      (check.violations || []).forEach((v: any) => {
        acc[v.violation_type] = (acc[v.violation_type] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(contadorViolacoes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tipo]) => tipo);
  }
}

// =====================================================
// UTILITÁRIOS E EXPORTAÇÕES
// =====================================================

export const petComplianceValidator = new PetComplianceValidator();

export const DISCLAIMER_TEMPLATES = {
  saude_geral: "As informações apresentadas têm caráter educativo. Sempre consulte um médico veterinário para orientações específicas sobre a saúde do seu pet.",
  medicamentos: "Este conteúdo não substitui orientação veterinária. Medicamentos devem ser prescritos apenas por profissional habilitado.",
  nutricao: "Orientações nutricionais são gerais. Consulte veterinário para dieta específica do seu animal.",
  comportamento: "Dicas comportamentais são orientativas. Casos específicos requerem avaliação profissional.",
  procedimentos: "Procedimentos devem ser realizados por veterinário ou profissional capacitado. Bem-estar animal em primeiro lugar."
};

export const gerarDisclaimerPorContexto = (contexto: string): string => {
  return DISCLAIMER_TEMPLATES[contexto as keyof typeof DISCLAIMER_TEMPLATES] || 
         DISCLAIMER_TEMPLATES.saude_geral;
};