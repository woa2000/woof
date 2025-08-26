/**
 * Mocks para Sistema de Compliance e Validação
 * Baseado no DATABASE_SCHEMA.md - compliance_validations e compliance_rules
 */

export type ComplianceRuleType = 
  | 'veterinary_disclaimer'
  | 'blocked_terms'
  | 'required_disclaimers'
  | 'medical_claims'
  | 'promotional_limits'
  | 'data_privacy'
  | 'accessibility_standards';

export type ComplianceSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ValidationStatus = 'pending' | 'passed' | 'failed' | 'manual_review' | 'approved' | 'rejected';

export interface ComplianceRule {
  id: string;
  name: string;
  rule_type: ComplianceRuleType;
  severity: ComplianceSeverity;
  business_types: string[]; // ['veterinary', 'pet_shop', 'grooming']
  description: string;
  // Configurações da regra
  config: {
    blocked_terms?: string[];
    required_patterns?: string[];
    max_promotional_percentage?: number;
    required_disclaimers?: string[];
    manual_review_keywords?: string[];
  };
  // Ações quando regra falha
  actions: {
    block_publication: boolean;
    require_manual_review: boolean;
    auto_add_disclaimer?: string;
    notify_compliance_team: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceValidation {
  id: string;
  content_variant_id: string;
  brand_id: string;
  user_id: string;
  // Status geral da validação
  overall_status: ValidationStatus;
  overall_score: number; // 1-10
  // Resultados por categoria
  validation_results: {
    [rule_type: string]: {
      rule_id: string;
      rule_name: string;
      status: ValidationStatus;
      score: number;
      issues_found: Array<{
        type: string;
        description: string;
        severity: ComplianceSeverity;
        suggestion?: string;
        auto_fixable: boolean;
      }>;
      disclaimers_added: string[];
    };
  };
  // Análise detalhada
  content_analysis: {
    word_count: number;
    promotional_percentage: number;
    medical_claims_count: number;
    blocked_terms_found: string[];
    missing_disclaimers: string[];
    accessibility_score: number;
  };
  // Ações tomadas
  automated_fixes: Array<{
    type: string;
    description: string;
    original_content: string;
    fixed_content: string;
  }>;
  manual_review_reasons: string[];
  // Aprovação manual
  manual_reviewer_id?: string;
  manual_review_notes?: string;
  manual_approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceTemplate {
  id: string;
  name: string;
  business_type: string;
  content_type: string; // 'social_post', 'email', 'website', 'advertisement'
  // Template de conteúdo
  template_structure: {
    required_sections: string[];
    optional_sections: string[];
    disclaimer_placement: 'top' | 'bottom' | 'both';
    max_length: number;
    min_length: number;
  };
  // Compliance automático
  auto_disclaimers: string[];
  blocked_patterns: string[];
  required_patterns: string[];
  // Exemplos
  good_examples: Array<{
    title: string;
    content: string;
    explanation: string;
  }>;
  bad_examples: Array<{
    title: string;
    content: string;
    issues: string[];
    how_to_fix: string;
  }>;
  created_at: string;
  updated_at: string;
}

// Mock Data - Regras de Compliance
export const mockComplianceRules: ComplianceRule[] = [
  {
    id: 'rule-vet-001',
    name: 'Disclaimers Veterinários Obrigatórios',
    rule_type: 'veterinary_disclaimer',
    severity: 'critical',
    business_types: ['veterinary'],
    description: 'Todo conteúdo médico deve incluir disclaimer sobre consulta presencial',
    config: {
      required_disclaimers: [
        'Este conteúdo é apenas informativo. Consulte sempre um veterinário.',
        'Em caso de emergência, procure atendimento presencial imediatamente.',
        'Cada animal é único. O diagnóstico precisa ser individualizado.'
      ],
      manual_review_keywords: ['diagnóstico', 'tratamento', 'medicamento', 'dosagem', 'receita']
    },
    actions: {
      block_publication: true,
      require_manual_review: true,
      auto_add_disclaimer: 'Este conteúdo é apenas informativo. Consulte sempre um veterinário.',
      notify_compliance_team: true
    },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T14:30:00Z'
  },
  {
    id: 'rule-blocked-001',
    name: 'Termos Proibidos - Medicina Veterinária',
    rule_type: 'blocked_terms',
    severity: 'high',
    business_types: ['veterinary', 'pet_shop'],
    description: 'Termos que podem configurar exercício ilegal da medicina veterinária',
    config: {
      blocked_terms: [
        'cure', 'cura', 'curar',
        'diagnóstico definitivo',
        'prescrição', 'receitar',
        'tratamento garantido',
        'medicina alternativa sem supervisão',
        'automedicação',
        'dose recomendada sem consulta'
      ]
    },
    actions: {
      block_publication: true,
      require_manual_review: true,
      notify_compliance_team: true
    },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-15T09:00:00Z'
  },
  {
    id: 'rule-promo-001',
    name: 'Limite de Conteúdo Promocional',
    rule_type: 'promotional_limits',
    severity: 'medium',
    business_types: ['veterinary', 'pet_shop', 'grooming'],
    description: 'Máximo de 30% do conteúdo pode ser promocional direto',
    config: {
      max_promotional_percentage: 30,
      manual_review_keywords: ['desconto', 'promoção', 'oferta', 'preço', 'barato']
    },
    actions: {
      block_publication: false,
      require_manual_review: true,
      notify_compliance_team: false
    },
    is_active: true,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-08-10T11:00:00Z'
  },
  {
    id: 'rule-medical-001',
    name: 'Alegações Médicas Não Comprovadas',
    rule_type: 'medical_claims',
    severity: 'high',
    business_types: ['veterinary', 'pet_shop'],
    description: 'Proibido fazer alegações médicas sem base científica',
    config: {
      blocked_terms: [
        'milagroso', 'revolucionário',
        '100% eficaz', 'garantido',
        'sem efeitos colaterais',
        'substitui consulta veterinária',
        'não precisa de receita'
      ],
      required_disclaimers: [
        'Consulte um veterinário antes de usar qualquer produto.',
        'Resultados podem variar entre diferentes animais.'
      ]
    },
    actions: {
      block_publication: true,
      require_manual_review: true,
      auto_add_disclaimer: 'Consulte um veterinário antes de usar qualquer produto.',
      notify_compliance_team: true
    },
    is_active: true,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-08-18T16:00:00Z'
  },
  {
    id: 'rule-accessibility-001',
    name: 'Padrões de Acessibilidade Digital',
    rule_type: 'accessibility_standards',
    severity: 'medium',
    business_types: ['veterinary', 'pet_shop', 'grooming', 'pet_hotel'],
    description: 'Conteúdo deve seguir padrões básicos de acessibilidade',
    config: {
      required_patterns: [
        'alt text para imagens',
        'contraste adequado de cores',
        'texto legível'
      ]
    },
    actions: {
      block_publication: false,
      require_manual_review: false,
      notify_compliance_team: false
    },
    is_active: true,
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-08-05T12:00:00Z'
  }
];

// Mock Data - Validações de Compliance
export const mockComplianceValidations: ComplianceValidation[] = [
  {
    id: 'validation-001',
    content_variant_id: 'content-var-001',
    brand_id: 'brand-vet-amor-001',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    overall_status: 'passed',
    overall_score: 9,
    validation_results: {
      veterinary_disclaimer: {
        rule_id: 'rule-vet-001',
        rule_name: 'Disclaimers Veterinários Obrigatórios',
        status: 'passed',
        score: 9,
        issues_found: [],
        disclaimers_added: ['Este conteúdo é apenas informativo. Consulte sempre um veterinário.']
      },
      blocked_terms: {
        rule_id: 'rule-blocked-001',
        rule_name: 'Termos Proibidos - Medicina Veterinária',
        status: 'passed',
        score: 10,
        issues_found: [],
        disclaimers_added: []
      },
      promotional_limits: {
        rule_id: 'rule-promo-001',
        rule_name: 'Limite de Conteúdo Promocional',
        status: 'passed',
        score: 8,
        issues_found: [
          {
            type: 'promotional_content',
            description: 'CTA pode ser considerado promocional',
            severity: 'low',
            suggestion: 'Focar mais no aspecto educativo',
            auto_fixable: false
          }
        ],
        disclaimers_added: []
      }
    },
    content_analysis: {
      word_count: 52,
      promotional_percentage: 15,
      medical_claims_count: 0,
      blocked_terms_found: [],
      missing_disclaimers: [],
      accessibility_score: 8.5
    },
    automated_fixes: [
      {
        type: 'disclaimer_addition',
        description: 'Adicionado disclaimer veterinário obrigatório',
        original_content: 'Fique atento aos sinais que indicam que seu companheiro precisa...',
        fixed_content: 'Fique atento aos sinais que indicam que seu companheiro precisa... Este conteúdo é apenas informativo. Consulte sempre um veterinário.'
      }
    ],
    manual_review_reasons: [],
    created_at: '2024-08-24T14:00:00Z',
    updated_at: '2024-08-24T14:05:00Z'
  },
  {
    id: 'validation-002',
    content_variant_id: 'content-var-004',
    brand_id: 'brand-vet-amor-001',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    overall_status: 'manual_review',
    overall_score: 6,
    validation_results: {
      veterinary_disclaimer: {
        rule_id: 'rule-vet-001',
        rule_name: 'Disclaimers Veterinários Obrigatórios',
        status: 'failed',
        score: 4,
        issues_found: [
          {
            type: 'missing_disclaimer',
            description: 'Disclaimer sobre vacinação está ausente',
            severity: 'critical',
            suggestion: 'Adicionar: "Consulte um veterinário para programa de vacinação personalizado"',
            auto_fixable: true
          }
        ],
        disclaimers_added: []
      },
      promotional_limits: {
        rule_id: 'rule-promo-001',
        rule_name: 'Limite de Conteúdo Promocional',
        status: 'failed',
        score: 5,
        issues_found: [
          {
            type: 'excessive_promotion',
            description: 'Conteúdo tem 45% de tom promocional (limite: 30%)',
            severity: 'medium',
            suggestion: 'Reduzir aspecto promocional, focar mais em educação',
            auto_fixable: false
          }
        ],
        disclaimers_added: []
      },
      medical_claims: {
        rule_id: 'rule-medical-001',
        rule_name: 'Alegações Médicas Não Comprovadas',
        status: 'manual_review',
        score: 7,
        issues_found: [
          {
            type: 'potential_medical_claim',
            description: 'Termo "proteção" pode ser interpretado como garantia médica',
            severity: 'medium',
            suggestion: 'Reformular para "ajuda na proteção"',
            auto_fixable: false
          }
        ],
        disclaimers_added: []
      }
    },
    content_analysis: {
      word_count: 38,
      promotional_percentage: 45,
      medical_claims_count: 1,
      blocked_terms_found: [],
      missing_disclaimers: ['Consulte um veterinário para programa de vacinação personalizado'],
      accessibility_score: 7.0
    },
    automated_fixes: [],
    manual_review_reasons: [
      'Conteúdo promocional acima do limite permitido',
      'Possível alegação médica não comprovada',
      'Falta disclaimer específico sobre vacinação'
    ],
    created_at: '2024-08-24T09:30:00Z',
    updated_at: '2024-08-24T09:35:00Z'
  },
  {
    id: 'validation-003',
    content_variant_id: 'content-var-002',
    brand_id: 'brand-tosa-chique-003',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    overall_status: 'approved',
    overall_score: 10,
    validation_results: {
      blocked_terms: {
        rule_id: 'rule-blocked-001',
        rule_name: 'Termos Proibidos - Medicina Veterinária',
        status: 'passed',
        score: 10,
        issues_found: [],
        disclaimers_added: []
      },
      promotional_limits: {
        rule_id: 'rule-promo-001',
        rule_name: 'Limite de Conteúdo Promocional',
        status: 'passed',
        score: 9,
        issues_found: [],
        disclaimers_added: []
      },
      accessibility_standards: {
        rule_id: 'rule-accessibility-001',
        rule_name: 'Padrões de Acessibilidade Digital',
        status: 'passed',
        score: 9,
        issues_found: [
          {
            type: 'image_alt_text',
            description: 'Verificar se imagem tem alt text apropriado',
            severity: 'low',
            suggestion: 'Adicionar: "Schnauzer Theo antes e depois da tosa artística"',
            auto_fixable: true
          }
        ],
        disclaimers_added: []
      }
    },
    content_analysis: {
      word_count: 45,
      promotional_percentage: 20,
      medical_claims_count: 0,
      blocked_terms_found: [],
      missing_disclaimers: [],
      accessibility_score: 9.0
    },
    automated_fixes: [
      {
        type: 'alt_text_suggestion',
        description: 'Sugerido alt text para imagem',
        original_content: 'Imagem sem alt text',
        fixed_content: 'Alt text: "Schnauzer Theo antes e depois da tosa artística"'
      }
    ],
    manual_review_reasons: [],
    manual_reviewer_id: '550e8400-e29b-41d4-a716-446655440003',
    manual_review_notes: 'Conteúdo excelente, mostra profissionalismo sem exageros promocionais.',
    manual_approved_at: '2024-08-23T16:45:00Z',
    created_at: '2024-08-23T16:20:00Z',
    updated_at: '2024-08-23T16:45:00Z'
  }
];

// Mock Data - Templates de Compliance
export const mockComplianceTemplates: ComplianceTemplate[] = [
  {
    id: 'template-vet-001',
    name: 'Post Educativo Veterinário',
    business_type: 'veterinary',
    content_type: 'social_post',
    template_structure: {
      required_sections: ['conteudo_educativo', 'disclaimer', 'cta_consulta'],
      optional_sections: ['hashtags', 'emoji', 'caso_exemplo'],
      disclaimer_placement: 'bottom',
      max_length: 300,
      min_length: 100
    },
    auto_disclaimers: [
      'Este conteúdo é apenas informativo. Consulte sempre um veterinário.',
      'Em caso de emergência, procure atendimento presencial imediatamente.'
    ],
    blocked_patterns: [
      'diagnóstico definitivo',
      'tratamento garantido',
      'cure sem consulta'
    ],
    required_patterns: [
      'consulte.*veterinário',
      'informativo.*consulta'
    ],
    good_examples: [
      {
        title: 'Sinais de Alerta - Exemplo Correto',
        content: 'Fique atento aos sinais que indicam que seu companheiro precisa de avaliação: mudanças no apetite, comportamento mais quieto, dificuldades de locomoção. Este conteúdo é apenas informativo. Consulte sempre um veterinário. 📞 Agende uma consulta.',
        explanation: 'Conteúdo educativo com disclaimer claro e CTA apropriado'
      },
      {
        title: 'Prevenção - Exemplo Correto',
        content: 'A prevenção é fundamental para a saúde do seu pet! Check-ups regulares ajudam a identificar problemas antes que se tornem sérios. Este conteúdo é apenas informativo. Consulte sempre um veterinário.',
        explanation: 'Foca na prevenção sem fazer promessas médicas'
      }
    ],
    bad_examples: [
      {
        title: 'Diagnóstico Definitivo - Exemplo Incorreto',
        content: 'Se seu pet está com esses sintomas, ele definitivamente tem X doença. Aqui está o tratamento garantido...',
        issues: ['Diagnóstico definitivo sem consulta', 'Promessa de cura', 'Sem disclaimer'],
        how_to_fix: 'Mudar para linguagem orientativa, adicionar disclaimer, sugerir consulta veterinária'
      },
      {
        title: 'Automedicação - Exemplo Incorreto',
        content: 'Use esse remédio caseiro que cura 100% dos casos...',
        issues: ['Promessa de cura', 'Automedicação', 'Percentual não comprovado'],
        how_to_fix: 'Focar em prevenção, sempre recomendar consulta veterinária'
      }
    ],
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-08-15T14:00:00Z'
  },
  {
    id: 'template-grooming-001',
    name: 'Showcase de Grooming',
    business_type: 'grooming',
    content_type: 'social_post',
    template_structure: {
      required_sections: ['antes_depois', 'tecnica_usada', 'cta_agendamento'],
      optional_sections: ['hashtags', 'depoimento_cliente', 'dicas_manutencao'],
      disclaimer_placement: 'bottom',
      max_length: 280,
      min_length: 80
    },
    auto_disclaimers: [
      'Resultados podem variar conforme características individuais do pet.'
    ],
    blocked_patterns: [
      'transformação garantida',
      'todos os pets ficam iguais',
      'resultado permanente'
    ],
    required_patterns: [
      'cada pet.*único',
      'resultados.*variar'
    ],
    good_examples: [
      {
        title: 'Transformação Schnauzer - Exemplo Correto',
        content: 'Que transformação incrível do Theo! 🌟 Tosa na tesoura com carinho e técnica profissional. Cada pet tem sua personalidade única, e nosso trabalho é realçar essa beleza natural. Resultados podem variar conforme características individuais do pet.',
        explanation: 'Mostra resultado sem prometer uniformidade, inclui disclaimer'
      }
    ],
    bad_examples: [
      {
        title: 'Promessa Irreal - Exemplo Incorreto',
        content: 'Garantimos que seu pet ficará exatamente assim! Transformação 100% garantida!',
        issues: ['Promessa de resultado idêntico', 'Garantia irreal', 'Sem disclaimer'],
        how_to_fix: 'Focar na técnica e cuidado, mencionar que cada pet é único'
      }
    ],
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-08-12T11:30:00Z'
  },
  {
    id: 'template-petshop-001',
    name: 'Recomendação de Produto',
    business_type: 'pet_shop',
    content_type: 'social_post',
    template_structure: {
      required_sections: ['produto_destaque', 'orientacao_uso', 'disclaimer_consulta'],
      optional_sections: ['preco', 'promocao', 'depoimento'],
      disclaimer_placement: 'bottom',
      max_length: 250,
      min_length: 100
    },
    auto_disclaimers: [
      'Para escolha adequada, consulte nossa equipe especializada.',
      'Em caso de problemas de saúde, consulte um veterinário.'
    ],
    blocked_patterns: [
      'substitui consulta veterinária',
      'dispensa orientação profissional',
      'uso sem supervisão'
    ],
    required_patterns: [
      'consulte.*equipe',
      'orientação.*especializada'
    ],
    good_examples: [
      {
        title: 'Dica de Ração - Exemplo Correto',
        content: 'Escolher a ração ideal considera idade, porte, atividade e necessidades especiais do pet. Nossa equipe está sempre pronta para orientar na melhor escolha. Para escolha adequada, consulte nossa equipe especializada.',
        explanation: 'Educativo com orientação para consulta especializada'
      }
    ],
    bad_examples: [
      {
        title: 'Autoprescrição - Exemplo Incorreto',
        content: 'Esta ração resolve todos os problemas, não precisa consultar ninguém!',
        issues: ['Promessa exagerada', 'Dispensa orientação profissional', 'Sem disclaimer'],
        how_to_fix: 'Focar em orientação, sempre sugerir consulta com equipe'
      }
    ],
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-08-10T09:00:00Z'
  }
];

// Factory Functions
export const createMockComplianceValidation = (overrides: Partial<ComplianceValidation> = {}): ComplianceValidation => ({
  id: `validation-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  content_variant_id: 'mock-content-id',
  brand_id: 'mock-brand-id',
  user_id: 'mock-user-id',
  overall_status: 'pending',
  overall_score: Math.floor(Math.random() * 4) + 7, // 7-10
  validation_results: {
    basic_compliance: {
      rule_id: 'mock-rule-id',
      rule_name: 'Mock Compliance Rule',
      status: 'passed',
      score: Math.floor(Math.random() * 3) + 8, // 8-10
      issues_found: [],
      disclaimers_added: []
    }
  },
  content_analysis: {
    word_count: Math.floor(Math.random() * 100) + 50,
    promotional_percentage: Math.floor(Math.random() * 40) + 10,
    medical_claims_count: Math.floor(Math.random() * 3),
    blocked_terms_found: [],
    missing_disclaimers: [],
    accessibility_score: Math.random() * 3 + 7 // 7-10
  },
  automated_fixes: [],
  manual_review_reasons: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockComplianceRule = (overrides: Partial<ComplianceRule> = {}): ComplianceRule => ({
  id: `rule-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name: 'Mock Compliance Rule',
  rule_type: 'blocked_terms',
  severity: 'medium',
  business_types: ['veterinary'],
  description: 'Mock compliance rule description',
  config: {
    blocked_terms: ['mock-blocked-term']
  },
  actions: {
    block_publication: false,
    require_manual_review: true,
    notify_compliance_team: false
  },
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});