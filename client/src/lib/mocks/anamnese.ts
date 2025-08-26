/**
 * Mocks para Anamnese Digital
 * Baseado em src/lib/types/anamnese.ts
 */

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

export interface MockAnamneseDigital {
  id: string;
  brand_id: string;
  url_analisada: string;
  redes_sociais: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  diagnostico_identidade_e_proposito: DiagnosticoIdentidade;
  personas: Persona[];
  auditoria_percepcao_experiencia: AuditoriaPercepcao;
  analise_ecossistema_inspiracoes: EcossistemaInspiracao[];
  plano_tratamento_e_evolucao: PlanoTratamento;
  roadmap_terapeutico: RoadmapItem[];
  nova_anatomia_home: NovaAnatomiaHome;
  perguntas_aprofundamento: string[];
  // Campos adicionais do schema do banco
  analysis_type: 'complete' | 'quick' | 'competitor';
  website_data: any;
  ai_analysis: any;
  pet_recommendations: {
    quick_wins: string[];
    medium_term: string[];
    long_term: string[];
    compliance_issues: string[];
  };
  competitors_analysis: any;
  overall_score: number;
  status: 'processing' | 'completed' | 'failed';
  processed_at: string;
}

// Mock Data - Anamnese Clínica Veterinária
export const mockAnamneseVeterinary: MockAnamneseDigital = {
  id: 'anamnese-vet-001',
  brand_id: 'brand-vet-amor-001',
  url_analisada: 'https://vetamor.com.br',
  redes_sociais: ['@vetamor_oficial', 'facebook.com/vetamor'],
  created_at: '2024-08-20T10:00:00Z',
  updated_at: '2024-08-20T16:30:00Z',
  user_id: '550e8400-e29b-41d4-a716-446655440001',
  analysis_type: 'complete',
  website_data: {
    pages_analyzed: 12,
    content_blocks: 45,
    images_found: 23,
    forms_detected: 3
  },
  ai_analysis: {
    readability_score: 8.2,
    seo_score: 7.5,
    mobile_friendly: true,
    page_speed: 'good'
  },
  pet_recommendations: {
    quick_wins: [
      'Adicionar botão de emergência 24h na header',
      'Incluir depoimentos de tutores satisfeitos',
      'Otimizar formulário de agendamento'
    ],
    medium_term: [
      'Implementar sistema de recalls automáticos',
      'Criar seção de educação pet',
      'Melhorar SEO local'
    ],
    long_term: [
      'Integrar telemedicina veterinária',
      'Desenvolver app próprio',
      'Sistema completo de prontuário digital'
    ],
    compliance_issues: [
      'Adicionar disclaimer sobre diagnóstico profissional',
      'Incluir número CRMV em todas as páginas'
    ]
  },
  competitors_analysis: {
    analyzed: ['vetcenter.com.br', 'clinicaanimal.com.br'],
    gaps: ['atendimento 24h', 'telemedicina', 'app móvel'],
    opportunities: ['especialização em pets idosos', 'medicina preventiva']
  },
  overall_score: 8,
  status: 'completed',
  processed_at: '2024-08-20T16:30:00Z',
  
  diagnostico_identidade_e_proposito: {
    dna_marca: 'Clínica veterinária de referência que combina expertise técnica com amor genuíno pelos animais, oferecendo cuidado humanizado e tecnologia avançada.',
    hipotese_negocio: 'Tutores de pets procuram uma clínica que não apenas trate doenças, mas que eduque, previna e ofereça tranquilidade através de atendimento especializado e acolhedor.',
    metrica_chave_sucesso: 'Taxa de agendamentos de retorno voluntários (não apenas para tratamentos, mas para check-ups preventivos)'
  },
  
  personas: [
    {
      nome: 'Maria Silva - A Tutora Preocupada',
      idade: 34,
      papel: 'Tutora de primeira viagem com cãozinho adotado',
      pensa_sente: {
        pensa: 'Será que estou cuidando bem do Rex? Preciso de orientação profissional.',
        sente: 'Ansiedade por não saber identificar problemas de saúde, mas muito amor pelo pet.'
      },
      vê: 'Outros tutores mais experientes, veterinários nas redes sociais, grupos de WhatsApp.',
      fala_faz: 'Pesquisa muito na internet, pergunta tudo na consulta, quer agendar logo.',
      dores: 'Incerteza sobre sintomas, medo de emergências, custo dos tratamentos.',
      ganhos: 'Pet saudável e feliz, tranquilidade de ter orientação profissional, aprendizado contínuo.'
    },
    {
      nome: 'Carlos Rodrigues - O Tutor Experiente',
      idade: 52,
      papel: 'Tutor de 3 cães há mais de 15 anos',
      pensa_sente: {
        pensa: 'Preciso de uma clínica que me entenda e não tente empurrar procedimentos desnecessários.',
        sente: 'Confiança na própria experiência, mas respeito pela opinião médica.'
      },
      vê: 'Mudanças na veterinária, novos tratamentos, preços crescentes.',
      fala_faz: 'Faz perguntas técnicas, compara preços, busca segunda opinião.',
      dores: 'Custos altos, falta de transparência, tratamentos padronizados.',
      ganhos: 'Atendimento personalizado, preços justos, relação de longo prazo.'
    }
  ],
  
  auditoria_percepcao_experiencia: {
    jornada_paciente_zero: [
      'Busca no Google "veterinário perto de mim"',
      'Visita site e redes sociais',
      'Liga para agendar consulta',
      'Primeira consulta (momento da verdade)',
      'Decisão de retornar ou não'
    ],
    johari: {
      arena: [
        'Atendimento acolhedor',
        'Médicos qualificados',
        'Equipamentos modernos',
        'Localização acessível'
      ],
      ponto_cego: {
        heuristicas_nielsen: {
          controle_e_liberdade: 6,
          flexibilidade_e_eficiencia: 7,
          design_minimalista: 5
        },
        acessibilidade: 'Site não otimizado para deficientes visuais',
        performance: 'Carregamento lento em dispositivos móveis',
        ui_visual: 'Layout desatualizado, cores pouco atrativas'
      },
      fachada: [
        'Preços competitivos (mas na verdade são justos)',
        'Rapidez no atendimento (qualidade é prioridade)'
      ],
      desconhecido: [
        'Potencial para telemedicina',
        'Oportunidade em medicina preventiva',
        'Demanda por atendimento 24h'
      ]
    }
  },
  
  analise_ecossistema_inspiracoes: [
    {
      nome: 'VetSmart - Rede americana',
      url: 'https://vetsmart.com',
      resolve: 'Padronização de processos, sistema robusto de agendamento, educação pet'
    },
    {
      nome: 'Petlove - Telemedicina',
      url: 'https://petlove.com.br',
      resolve: 'Combinação e-commerce + telemedicina, experiência digital integrada'
    },
    {
      nome: 'Animal Hospital - São Paulo',
      url: 'https://animalhospital.com.br',
      resolve: 'Especialização por áreas, comunicação clara de diferenciais'
    }
  ],
  
  plano_tratamento_e_evolucao: {
    quick_wins: [
      'Adicionar botão "Emergência 24h" na header',
      'Incluir seção de depoimentos na homepage',
      'Otimizar formulário de contato',
      'Adicionar chat do WhatsApp',
      'Melhorar velocidade de carregamento'
    ],
    reestruturacao_arquitetura: [
      'Reorganizar menu principal por serviços',
      'Criar páginas dedicadas por especialidade',
      'Implementar sistema de agendamento online',
      'Desenvolver área do cliente'
    ],
    evolucao_identidade_visual: [
      'Modernizar paleta de cores',
      'Criar ilustrações próprias',
      'Padronizar fotografia dos pets',
      'Redesenhar logo para digital'
    ],
    otimizacao_narrativa: [
      'Reescrever textos focando em benefícios',
      'Criar storytelling da clínica',
      'Desenvolver tom de voz próprio',
      'Adicionar casos de sucesso'
    ],
    saude_tecnica: [
      'Implementar SSL em todo o site',
      'Otimizar para Core Web Vitals',
      'Melhorar SEO técnico',
      'Configurar Google Analytics 4'
    ]
  },
  
  roadmap_terapeutico: [
    {
      item: 'Implementar chat WhatsApp para emergências',
      prioridade: 'Alta',
      esforco: 'Baixo',
      impacto_negocio: 'Alto'
    },
    {
      item: 'Criar sistema de agendamento online',
      prioridade: 'Alta',
      esforco: 'Alto',
      impacto_negocio: 'Alto'
    },
    {
      item: 'Desenvolver conteúdo educativo pet',
      prioridade: 'Média',
      esforco: 'Médio',
      impacto_negocio: 'Médio'
    },
    {
      item: 'Implementar telemedicina básica',
      prioridade: 'Média',
      esforco: 'Alto',
      impacto_negocio: 'Alto'
    },
    {
      item: 'Criar programa de fidelidade',
      prioridade: 'Baixa',
      esforco: 'Médio',
      impacto_negocio: 'Médio'
    }
  ],
  
  nova_anatomia_home: {
    hero: {
      proposito: 'Estabelecer confiança imediata e facilitar agendamento',
      gatilhos: ['emergência', 'primeira consulta', 'check-up'],
      titulo: 'Cuidado Veterinário com Amor e Tecnologia',
      subtitulo: 'Sua clínica de referência há mais de 15 anos. Equipamentos modernos, equipe especializada e atendimento 24h para o seu melhor amigo.',
      cta_primario: 'Agendar Consulta',
      cta_secundario: 'Emergência 24h'
    },
    prova_social_imediata: {
      proposito: 'Reduzir ansiedade e criar credibilidade',
      conteudo: '+2.500 pets atendidos este ano',
      cards: ['Dr. Ana - CRMV 12345', '15 anos de experiência', 'Nota 4.9/5'],
      cta: 'Ver todos os depoimentos'
    },
    bloco_dores: {
      proposito: 'Conectar com preocupações dos tutores',
      titulo: 'Sabemos como é se preocupar com quem amamos',
      cards: [
        'Emergência no final de semana?',
        'Não sabe se é grave?',
        'Quer prevenir problemas?'
      ]
    },
    bloco_solucao: {
      proposito: 'Apresentar diferenciais únicos',
      titulo: 'Cuidado completo para seu pet',
      etapas_servico: 4,
      conteudo: 'Consulta → Diagnóstico → Tratamento → Acompanhamento'
    },
    bloco_resultados: {
      proposito: 'Mostrar valor e resultados',
      cases_destacados: 3,
      titulo: 'Pets saudáveis, tutores tranquilos',
      cta: 'Conheça nossas especialidades'
    },
    cta_final: {
      proposito: 'Conversão final',
      titulo: 'Seu pet merece o melhor cuidado',
      formulario_simplificado: true,
      cta: 'Agendar primeira consulta'
    }
  },
  
  perguntas_aprofundamento: [
    'Qual é o principal motivo pelo qual os tutores escolhem trocar de veterinário?',
    'Como vocês acompanham a satisfação dos clientes após o tratamento?',
    'Qual percentual dos seus clientes retorna para check-ups preventivos?',
    'Vocês têm dados sobre o ticket médio por tipo de atendimento?',
    'Como é feita a comunicação de emergências fora do horário?',
    'Qual é a especialidade que mais gera retorno financeiro?',
    'Vocês oferecem algum tipo de programa de fidelidade ou desconto?',
    'Como vocês educam os tutores sobre cuidados preventivos?'
  ]
};

// Factory Function
export const createMockAnamnese = (overrides: Partial<MockAnamneseDigital> = {}): MockAnamneseDigital => ({
  id: `anamnese-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  brand_id: overrides.brand_id || 'mock-brand-id',
  url_analisada: 'https://example-pet-business.com.br',
  redes_sociais: ['@mockpet', 'facebook.com/mockpet'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: 'mock-user-id',
  analysis_type: 'complete',
  website_data: {},
  ai_analysis: {},
  pet_recommendations: {
    quick_wins: ['Melhorar velocidade do site'],
    medium_term: ['Implementar agendamento online'],
    long_term: ['Desenvolver app mobile'],
    compliance_issues: ['Adicionar disclaimers necessários']
  },
  competitors_analysis: {},
  overall_score: 7,
  status: 'completed',
  processed_at: new Date().toISOString(),
  diagnostico_identidade_e_proposito: {
    dna_marca: 'Negócio pet focado em qualidade',
    hipotese_negocio: 'Tutores buscam confiança e resultado',
    metrica_chave_sucesso: 'Taxa de retorno de clientes'
  },
  personas: [],
  auditoria_percepcao_experiencia: {
    jornada_paciente_zero: [],
    johari: {
      arena: [],
      ponto_cego: {
        heuristicas_nielsen: { controle_e_liberdade: 5, flexibilidade_e_eficiencia: 5, design_minimalista: 5 },
        acessibilidade: 'A melhorar',
        performance: 'A melhorar',
        ui_visual: 'A melhorar'
      },
      fachada: [],
      desconhecido: []
    }
  },
  analise_ecossistema_inspiracoes: [],
  plano_tratamento_e_evolucao: {
    quick_wins: [],
    reestruturacao_arquitetura: [],
    evolucao_identidade_visual: [],
    otimizacao_narrativa: [],
    saude_tecnica: []
  },
  roadmap_terapeutico: [],
  nova_anatomia_home: {
    hero: {
      proposito: 'Converter visitantes',
      gatilhos: [],
      titulo: 'Mock Hero Title',
      subtitulo: 'Mock Hero Subtitle',
      cta_primario: 'Mock CTA',
      cta_secundario: 'Mock Secondary CTA'
    },
    prova_social_imediata: { proposito: 'Credibilidade' },
    bloco_dores: { proposito: 'Conectar com dores' },
    bloco_solucao: { proposito: 'Apresentar solução' },
    bloco_resultados: { proposito: 'Mostrar resultados' },
    cta_final: { proposito: 'Conversão final' }
  },
  perguntas_aprofundamento: [],
  ...overrides
});