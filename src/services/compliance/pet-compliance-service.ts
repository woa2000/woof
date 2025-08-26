/**
 * Pet Compliance Service - Pet Compliance Specialist Role
 * 
 * Sistema completo de compliance para negócios do setor pet
 * Validação de terminologias médicas, disclaimers e regulamentações
 */

export interface ComplianceRule {
  id: string;
  category: 'medical' | 'promotional' | 'safety' | 'legal' | 'ethical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  pattern: RegExp;
  required_disclaimer?: string;
  suggestions: string[];
  business_types: ('veterinary_clinic' | 'pet_shop' | 'grooming_salon' | 'pet_training' | 'pet_hotel')[];
}

export interface ComplianceValidation {
  is_compliant: boolean;
  violations: ComplianceViolation[];
  required_disclaimers: string[];
  confidence_score: number;
  recommendations: string[];
  approved_content?: string;
}

export interface ComplianceViolation {
  rule_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  message: string;
  matched_text: string;
  position: { start: number; end: number };
  suggestion: string;
  required_action: 'remove' | 'modify' | 'add_disclaimer' | 'review';
}

export interface VeterinaryTerminology {
  term: string;
  approved: boolean;
  requires_disclaimer: boolean;
  context: 'diagnostic' | 'therapeutic' | 'preventive' | 'surgical' | 'general';
  disclaimer_text?: string;
  alternative_terms?: string[];
}

export class PetComplianceService {
  private complianceRules: ComplianceRule[] = [
    // Regras Médicas Veterinárias - CRÍTICAS
    {
      id: 'vet-001',
      category: 'medical',
      severity: 'critical',
      title: 'Terminologia Médica Veterinária',
      description: 'Uso de termos médicos veterinários requer disclaimer',
      pattern: /\b(diagnóstico|diagnóstica|tratamento|tratar|curar|cura|medicina|médic[oa]|doença|patologia|sintoma|terapia|cirurgia|operação|medicamento|remédio|prescrição)\b/gi,
      required_disclaimer: 'Não substitui consulta veterinária presencial. Sempre consulte um médico veterinário.',
      suggestions: [
        'Adicionar disclaimer obrigatório',
        'Usar terminologia mais genérica quando possível',
        'Reforçar necessidade de consulta profissional'
      ],
      business_types: ['veterinary_clinic', 'pet_shop', 'grooming_salon', 'pet_training', 'pet_hotel']
    },
    {
      id: 'vet-002',
      category: 'medical', 
      severity: 'critical',
      title: 'Promessas de Cura Proibidas',
      description: 'Promessas definitivas de cura são proibidas',
      pattern: /\b(garantimos? (a )?cura|curamos? definitivamente|tratamento definitivo|solução definitiva|eliminamos? a doença|fim da doença)\b/gi,
      suggestions: [
        'Substituir por "pode auxiliar no tratamento"',
        'Usar "consulte um veterinário"',
        'Evitar promessas definitivas'
      ],
      business_types: ['veterinary_clinic', 'pet_shop']
    },
    {
      id: 'vet-003',
      category: 'medical',
      severity: 'high',
      title: 'Prescrição de Medicamentos',
      description: 'Não é permitido prescrever medicamentos sem consulta',
      pattern: /\b(prescrevo|receito|tome|administre|dose|posologia|mg\/kg|aplique.*medicamento)\b/gi,
      suggestions: [
        'Remover instruções específicas de medicação',
        'Direcionar para consulta veterinária',
        'Usar linguagem informativa apenas'
      ],
      business_types: ['veterinary_clinic', 'pet_shop']
    },

    // Regras Promocionais - MÉDIA/ALTA
    {
      id: 'promo-001',
      category: 'promotional',
      severity: 'medium',
      title: 'Superlativos Excessivos',
      description: 'Evitar superlativos que podem gerar expectativas irreais',
      pattern: /\b(melhor do mundo|número 1|único|exclusivo|milagroso|revolucionário|infalível|perfeito)\b/gi,
      suggestions: [
        'Usar linguagem mais equilibrada',
        'Basear claims em evidências',
        'Substituir por termos mais moderados'
      ],
      business_types: ['veterinary_clinic', 'pet_shop', 'grooming_salon', 'pet_training', 'pet_hotel']
    },
    {
      id: 'promo-002',
      category: 'promotional',
      severity: 'medium',
      title: 'Urgência Excessiva',
      description: 'Evitar criação de urgência falsa ou pressão excessiva',
      pattern: /\b(últimas? (horas?|vagas?)|apenas hoje|nunca mais|oportunidade única|só restam? \d+)\b/gi,
      suggestions: [
        'Usar calls-to-action mais equilibrados',
        'Focar nos benefícios reais',
        'Evitar pressão psicológica excessiva'
      ],
      business_types: ['pet_shop', 'grooming_salon', 'pet_training']
    },

    // Regras de Segurança - ALTA
    {
      id: 'safety-001',
      category: 'safety',
      severity: 'high',
      title: 'Produtos Tóxicos para Pets',
      description: 'Alertar sobre produtos perigosos para animais',
      pattern: /\b(chocolate|uva|cebola|alho|abacate|café|álcool|xilitol)\b/gi,
      required_disclaimer: 'ATENÇÃO: Alguns alimentos humanos são tóxicos para pets. Consulte sempre um veterinário.',
      suggestions: [
        'Adicionar aviso de toxicidade',
        'Listar alimentos seguros como alternativa',
        'Reforçar consulta veterinária'
      ],
      business_types: ['pet_shop', 'veterinary_clinic']
    },
    {
      id: 'safety-002',
      category: 'safety',
      severity: 'high',
      title: 'Procedimentos Caseiros Perigosos',
      description: 'Não recomendar procedimentos que requerem conhecimento técnico',
      pattern: /\b(corte?( as| suas)? unhas? em casa|limpeza de ouvido|expressão de glândulas?|aplicação de injeção)\b/gi,
      suggestions: [
        'Recomendar procurar profissional',
        'Explicar riscos de procedimentos caseiros',
        'Sugerir alternativas seguras'
      ],
      business_types: ['grooming_salon', 'pet_shop', 'veterinary_clinic']
    },

    // Regras Legais - ALTA
    {
      id: 'legal-001',
      category: 'legal',
      severity: 'high',
      title: 'Responsabilidade Civil',
      description: 'Não assumir responsabilidades além do escopo profissional',
      pattern: /\b(garantimos? que|assumimos responsabilidade|nos responsabilizamos por|promessa de resultado)\b/gi,
      suggestions: [
        'Usar "buscamos oferecer" em vez de "garantimos"',
        'Adicionar limitações de responsabilidade',
        'Focar no processo, não no resultado garantido'
      ],
      business_types: ['veterinary_clinic', 'grooming_salon', 'pet_training', 'pet_hotel']
    },

    // Regras Éticas - BAIXA/MÉDIA
    {
      id: 'ethics-001',
      category: 'ethical',
      severity: 'low',
      title: 'Linguagem Inclusiva',
      description: 'Usar linguagem inclusiva e acessível',
      pattern: /\b(dono|proprietário)( do pet| da espécie)\b/gi,
      suggestions: [
        'Usar "tutor" ou "cuidador" em vez de "dono"',
        'Linguagem mais humanizada e respeitosa',
        'Reconhecer o vínculo emocional'
      ],
      business_types: ['veterinary_clinic', 'pet_shop', 'grooming_salon', 'pet_training', 'pet_hotel']
    }
  ];

  // Terminologias veterinárias aprovadas e suas regras
  private veterinaryTerminology: VeterinaryTerminology[] = [
    {
      term: 'check-up',
      approved: true,
      requires_disclaimer: true,
      context: 'preventive',
      disclaimer_text: 'Consulta preventiva não substitui atendimento para problemas específicos.',
      alternative_terms: ['consulta preventiva', 'avaliação de saúde']
    },
    {
      term: 'vacinação',
      approved: true,
      requires_disclaimer: true,
      context: 'preventive',
      disclaimer_text: 'Esquema vacinal deve ser personalizado conforme histórico e necessidades do animal.',
      alternative_terms: ['imunização', 'proteção vacinal']
    },
    {
      term: 'vermifugação',
      approved: true,
      requires_disclaimer: true,
      context: 'preventive',
      disclaimer_text: 'Protocolo antiparasitário deve ser definido por médico veterinário.',
      alternative_terms: ['controle parasitário', 'desverminação']
    },
    {
      term: 'castração',
      approved: true,
      requires_disclaimer: true,
      context: 'surgical',
      disclaimer_text: 'Procedimento cirúrgico requer avaliação pré-operatória completa.',
      alternative_terms: ['esterilização', 'cirurgia reprodutiva']
    },
    {
      term: 'emergência',
      approved: true,
      requires_disclaimer: true,
      context: 'diagnostic',
      disclaimer_text: 'Em casos de emergência, procure atendimento veterinário imediatamente.',
      alternative_terms: ['urgência', 'atendimento emergencial']
    },
    // Termos NÃO aprovados
    {
      term: 'autodiagnóstico',
      approved: false,
      requires_disclaimer: false,
      context: 'diagnostic',
      alternative_terms: ['observação de sintomas', 'consulta veterinária']
    },
    {
      term: 'automedicação',
      approved: false,
      requires_disclaimer: false,
      context: 'therapeutic',
      alternative_terms: ['consulta veterinária', 'prescrição profissional']
    }
  ];

  // Disclaimers específicos por tipo de negócio
  private businessDisclaimers = {
    veterinary_clinic: [
      'Este conteúdo tem caráter informativo e não substitui consulta veterinária presencial.',
      'Cada animal é único. O diagnóstico e tratamento devem ser individualizados.',
      'Em caso de emergência, procure atendimento veterinário imediatamente.'
    ],
    pet_shop: [
      'Produtos devem ser utilizados conforme orientação profissional quando aplicável.',
      'Consulte um médico veterinário antes de alterar a dieta ou rotina do seu pet.',
      'Leia sempre as instruções e contraindicações dos produtos.'
    ],
    grooming_salon: [
      'Serviços de estética pet devem respeitar as condições de saúde do animal.',
      'Informar sobre problemas de pele, alergias ou sensibilidades antes do serviço.',
      'Em caso de reações adversas, procurar atendimento veterinário.'
    ],
    pet_training: [
      'Treinamento deve ser adaptado à personalidade e necessidades de cada animal.',
      'Métodos baseados em reforço positivo e bem-estar animal.',
      'Consultar veterinário comportamentalista em casos complexos.'
    ],
    pet_hotel: [
      'Serviços de hospedagem requerem carteira de vacinação atualizada.',
      'Informar sobre medicações, dietas especiais e comportamentos específicos.',
      'Equipe treinada para identificar situações que requerem atendimento veterinário.'
    ]
  };

  // Validar conteúdo completo
  async validateContent(
    content: string, 
    businessType: keyof typeof this.businessDisclaimers = 'veterinary_clinic',
    contentType: 'social_post' | 'email' | 'landing_page' | 'ad_copy' = 'social_post'
  ): Promise<ComplianceValidation> {
    
    await this.mockDelay(500 + Math.random() * 1000);

    const violations: ComplianceViolation[] = [];
    const requiredDisclaimers: string[] = [];
    let approved_content = content;

    // Verificar cada regra de compliance
    for (const rule of this.complianceRules) {
      if (!rule.business_types.includes(businessType)) continue;

      const matches = Array.from(content.matchAll(rule.pattern));
      
      for (const match of matches) {
        if (!match.index) continue;

        const violation: ComplianceViolation = {
          rule_id: rule.id,
          severity: rule.severity,
          category: rule.category,
          message: rule.description,
          matched_text: match[0],
          position: { start: match.index, end: match.index + match[0].length },
          suggestion: rule.suggestions[0],
          required_action: rule.severity === 'critical' ? 'add_disclaimer' : 
                          rule.severity === 'high' ? 'modify' : 'review'
        };

        violations.push(violation);

        // Adicionar disclaimer se necessário
        if (rule.required_disclaimer && !requiredDisclaimers.includes(rule.required_disclaimer)) {
          requiredDisclaimers.push(rule.required_disclaimer);
        }
      }
    }

    // Adicionar disclaimers padrão do tipo de negócio
    const businessSpecificDisclaimers = this.businessDisclaimers[businessType];
    businessSpecificDisclaimers.forEach(disclaimer => {
      if (!requiredDisclaimers.includes(disclaimer)) {
        requiredDisclaimers.push(disclaimer);
      }
    });

    // Verificar terminologia veterinária
    const terminologyViolations = this.checkVeterinaryTerminology(content, businessType);
    violations.push(...terminologyViolations);

    // Calcular score de confiança
    const criticalViolations = violations.filter(v => v.severity === 'critical').length;
    const highViolations = violations.filter(v => v.severity === 'high').length;
    const mediumViolations = violations.filter(v => v.severity === 'medium').length;
    
    let confidenceScore = 1.0;
    confidenceScore -= criticalViolations * 0.4;
    confidenceScore -= highViolations * 0.2;
    confidenceScore -= mediumViolations * 0.1;
    confidenceScore = Math.max(0, confidenceScore);

    // Determinar se é compliant
    const isCompliant = criticalViolations === 0 && highViolations === 0;

    // Gerar recomendações
    const recommendations = this.generateRecommendations(violations, businessType, contentType);

    // Aplicar correções automáticas se possível
    if (isCompliant && requiredDisclaimers.length > 0) {
      approved_content = this.addDisclaimersToContent(content, requiredDisclaimers, contentType);
    }

    return {
      is_compliant: isCompliant,
      violations,
      required_disclaimers: requiredDisclaimers,
      confidence_score: Number(confidenceScore.toFixed(2)),
      recommendations,
      approved_content: isCompliant ? approved_content : undefined
    };
  }

  // Verificar terminologia veterinária específica
  private checkVeterinaryTerminology(
    content: string, 
    businessType: keyof typeof this.businessDisclaimers
  ): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];

    for (const terminology of this.veterinaryTerminology) {
      const pattern = new RegExp(`\\b${terminology.term}\\b`, 'gi');
      const matches = Array.from(content.matchAll(pattern));

      for (const match of matches) {
        if (!match.index) continue;

        if (!terminology.approved) {
          violations.push({
            rule_id: `term-${terminology.term}`,
            severity: 'high',
            category: 'medical',
            message: `Termo "${terminology.term}" não aprovado para uso`,
            matched_text: match[0],
            position: { start: match.index, end: match.index + match[0].length },
            suggestion: terminology.alternative_terms ? 
              `Use: ${terminology.alternative_terms.join(' ou ')}` : 
              'Remover ou substituir termo',
            required_action: 'modify'
          });
        } else if (terminology.requires_disclaimer && businessType === 'veterinary_clinic') {
          // Termo aprovado mas requer disclaimer adicional
          violations.push({
            rule_id: `disclaimer-${terminology.term}`,
            severity: 'medium',
            category: 'medical',
            message: `Termo "${terminology.term}" requer disclaimer específico`,
            matched_text: match[0],
            position: { start: match.index, end: match.index + match[0].length },
            suggestion: terminology.disclaimer_text || 'Adicionar disclaimer apropriado',
            required_action: 'add_disclaimer'
          });
        }
      }
    }

    return violations;
  }

  // Gerar recomendações personalizadas
  private generateRecommendations(
    violations: ComplianceViolation[],
    businessType: keyof typeof this.businessDisclaimers,
    contentType: string
  ): string[] {
    const recommendations: string[] = [];

    // Recomendações por severidade
    const criticalCount = violations.filter(v => v.severity === 'critical').length;
    const highCount = violations.filter(v => v.severity === 'high').length;

    if (criticalCount > 0) {
      recommendations.push(
        `🚨 ${criticalCount} violação(ões) crítica(s) encontrada(s). Revisão obrigatória antes da publicação.`
      );
    }

    if (highCount > 0) {
      recommendations.push(
        `⚠️ ${highCount} problema(s) de alta prioridade identificado(s). Recomenda-se correção.`
      );
    }

    // Recomendações por categoria
    const medicalViolations = violations.filter(v => v.category === 'medical');
    if (medicalViolations.length > 0) {
      recommendations.push(
        '🩺 Conteúdo contém terminologia médica. Considere revisão por profissional da área.'
      );
    }

    // Recomendações por tipo de negócio
    if (businessType === 'veterinary_clinic') {
      recommendations.push(
        '📋 Para clínicas veterinárias: sempre incluir disclaimers sobre não substituição de consulta presencial.'
      );
    } else if (businessType === 'pet_shop') {
      recommendations.push(
        '🛍️ Para pet shops: enfatizar consulta profissional para produtos de saúde e alimentação.'
      );
    }

    // Recomendações por tipo de conteúdo
    if (contentType === 'ad_copy' && violations.some(v => v.category === 'promotional')) {
      recommendations.push(
        '📢 Para anúncios: evitar promessas excessivas e manter linguagem equilibrada.'
      );
    }

    return recommendations;
  }

  // Adicionar disclaimers ao conteúdo
  private addDisclaimersToContent(
    content: string,
    disclaimers: string[],
    contentType: string
  ): string {
    let updatedContent = content;

    if (contentType === 'social_post') {
      // Para posts sociais, adicionar ao final
      const disclaimerText = disclaimers.join(' ');
      updatedContent += `\n\n⚠️ ${disclaimerText}`;
    } else if (contentType === 'email') {
      // Para emails, adicionar seção específica
      const disclaimerSection = disclaimers.map(d => `• ${d}`).join('\n');
      updatedContent += `\n\n---\nInformações Importantes:\n${disclaimerSection}`;
    } else if (contentType === 'landing_page') {
      // Para landing pages, seção destacada
      const disclaimerSection = disclaimers.map(d => `<p><small>${d}</small></p>`).join('\n');
      updatedContent += `\n\n<div class="disclaimers">\n${disclaimerSection}\n</div>`;
    }

    return updatedContent;
  }

  // Aprovar terminologia personalizada
  addCustomTerminology(term: VeterinaryTerminology): void {
    const existingIndex = this.veterinaryTerminology.findIndex(t => t.term === term.term);
    
    if (existingIndex >= 0) {
      this.veterinaryTerminology[existingIndex] = term;
    } else {
      this.veterinaryTerminology.push(term);
    }
  }

  // Obter guia de compliance por tipo de negócio
  getComplianceGuide(businessType: keyof typeof this.businessDisclaimers): {
    mandatory_disclaimers: string[];
    restricted_terms: string[];
    approved_terms: string[];
    best_practices: string[];
  } {
    const relevantRules = this.complianceRules.filter(rule => 
      rule.business_types.includes(businessType)
    );

    const restrictedTerms = this.veterinaryTerminology
      .filter(t => !t.approved)
      .map(t => t.term);

    const approvedTerms = this.veterinaryTerminology
      .filter(t => t.approved)
      .map(t => t.term);

    const bestPractices = [
      'Use sempre linguagem clara e acessível',
      'Evite promessas definitivas de resultados',
      'Reforce a importância do acompanhamento profissional',
      'Mantenha foco no bem-estar animal',
      'Seja transparente sobre limitações e riscos'
    ];

    return {
      mandatory_disclaimers: this.businessDisclaimers[businessType],
      restricted_terms: restrictedTerms,
      approved_terms: approvedTerms,
      best_practices: bestPractices
    };
  }

  // Relatório de compliance
  async generateComplianceReport(contents: Array<{ id: string; content: string; type: string }>, businessType: keyof typeof this.businessDisclaimers): Promise<{
    overall_compliance: number;
    total_violations: number;
    critical_violations: number;
    content_analysis: Array<{
      id: string;
      is_compliant: boolean;
      violations_count: number;
      confidence: number;
    }>;
    recommendations: string[];
  }> {
    await this.mockDelay(1000);

    const analyses = await Promise.all(
      contents.map(async content => {
        const validation = await this.validateContent(content.content, businessType, content.type as any);
        return {
          id: content.id,
          is_compliant: validation.is_compliant,
          violations_count: validation.violations.length,
          confidence: validation.confidence_score,
          validation
        };
      })
    );

    const totalViolations = analyses.reduce((sum, a) => sum + a.violations_count, 0);
    const criticalViolations = analyses.reduce((sum, a) => 
      sum + a.validation.violations.filter(v => v.severity === 'critical').length, 0
    );
    
    const overallCompliance = analyses.filter(a => a.is_compliant).length / analyses.length;

    const allRecommendations = analyses.flatMap(a => a.validation.recommendations);
    const uniqueRecommendations = [...new Set(allRecommendations)];

    return {
      overall_compliance: Number(overallCompliance.toFixed(2)),
      total_violations: totalViolations,
      critical_violations: criticalViolations,
      content_analysis: analyses.map(a => ({
        id: a.id,
        is_compliant: a.is_compliant,
        violations_count: a.violations_count,
        confidence: a.confidence
      })),
      recommendations: uniqueRecommendations
    };
  }

  // Utilitários
  private async mockDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}