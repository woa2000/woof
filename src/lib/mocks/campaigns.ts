/**
 * Mocks para Campanhas Pet
 * Baseado no DATABASE_SCHEMA.md - pet_campaign_kits e campaign_instances
 */

export type PetCampaignCategory = 
  | 'vaccination'
  | 'grooming'
  | 'checkup'
  | 'dental_care'
  | 'nutrition'
  | 'seasonal'
  | 'adoption'
  | 'emergency_care';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface PetCampaignKit {
  id: string;
  name: string;
  category: PetCampaignCategory;
  business_types: string[];
  templates: {
    post_templates: Array<{
      title: string;
      content: string;
      hashtags: string[];
      cta?: string;
    }>;
    ad_templates: Array<{
      headline: string;
      description: string;
      call_to_action: string;
    }>;
    email_templates: Array<{
      subject: string;
      preview_text: string;
      content: string;
    }>;
  };
  default_goals: {
    primary: string;
    metrics: string[];
  };
  target_audience: {
    demographics: string[];
    interests: string[];
    behaviors: string[];
  };
  recommended_budget_range: {
    min: number;
    max: number;
  };
  compliance_requirements: {
    veterinary_approval: boolean;
    disclaimers: string[];
    prohibited_claims: string[];
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CampaignInstance {
  id: string;
  brand_id: string;
  kit_id: string;
  name: string;
  status: CampaignStatus;
  customizations: {
    custom_messages?: string[];
    brand_adjustments?: any;
    specific_services?: string[];
  };
  target_metrics: {
    impressions?: number;
    clicks?: number;
    appointments?: number;
    leads?: number;
  };
  budget_allocated: number;
  start_date: string;
  end_date: string;
  performance_metrics: {
    current_impressions: number;
    current_clicks: number;
    current_appointments: number;
    current_spend: number;
    cpa?: number;
    ctr?: number;
  };
  created_at: string;
  updated_at: string;
}

// Mock Data - Kits de Campanha Pet
export const mockPetCampaignKits: PetCampaignKit[] = [
  {
    id: 'kit-vaccination-001',
    name: 'Campanha de Vacinação V1',
    category: 'vaccination',
    business_types: ['veterinary_clinic', 'pet_shop'],
    templates: {
      post_templates: [
        {
          title: '🐕 Hora da Vacinação!',
          content: 'Proteja seu melhor amigo com a vacinação em dia. Nossa equipe especializada está pronta para cuidar do seu pet com todo carinho que ele merece.',
          hashtags: ['#VacinacaoPet', '#SaudePet', '#VeterinarioDeConfianca', '#ProteçaoAnimal'],
          cta: 'Agende já sua consulta!'
        },
        {
          title: '💉 Vacinação = Proteção + Amor',
          content: 'Cada vacina é um ato de amor. Proteja seu companheiro de doenças graves com nossa programação personalizada de imunização.',
          hashtags: ['#AmoPets', '#VacinacaoResponsavel', '#SaudePreventiva'],
          cta: 'WhatsApp (11) 99999-9999'
        },
        {
          title: '🏥 Check-up + Vacinação',
          content: 'Aproveite a consulta de vacinação para um check-up completo. Prevenção é o melhor cuidado que você pode oferecer.',
          hashtags: ['#CheckupCompleto', '#MedicinaPreventiva', '#CuidadoIntegral'],
          cta: 'Marque seu horário'
        }
      ],
      ad_templates: [
        {
          headline: 'Vacinação Pet com Especialistas',
          description: 'Proteja seu melhor amigo com nossa equipe veterinária experiente. Agendamento fácil e atendimento humanizado.',
          call_to_action: 'Agendar Consulta'
        },
        {
          headline: 'Imunização Completa para seu Pet',
          description: 'Protocolo personalizado de vacinação. Cuidado profissional com muito carinho pelo seu companheiro.',
          call_to_action: 'Saiba Mais'
        }
      ],
      email_templates: [
        {
          subject: 'Lembrete: Vacinação do [NOME_PET] está próxima',
          preview_text: 'Mantenha a proteção em dia com nossa programação...',
          content: 'Olá [NOME_TUTOR], chegou a hora de renovar a proteção do [NOME_PET]. Nossa equipe está pronta para recebê-los com todo cuidado.'
        }
      ]
    },
    default_goals: {
      primary: 'appointments',
      metrics: ['impressions', 'clicks', 'appointments', 'cost_per_appointment']
    },
    target_audience: {
      demographics: ['Tutores 25-55 anos', 'Classe B/C', 'Moradores região'],
      interests: ['Pets', 'Saúde animal', 'Cuidado preventivo'],
      behaviors: ['Buscam veterinário online', 'Agendam consultas', 'Seguem perfis pet']
    },
    recommended_budget_range: {
      min: 300,
      max: 800
    },
    compliance_requirements: {
      veterinary_approval: true,
      disclaimers: [
        'Consulte sempre um médico veterinário',
        'Protocolo de vacinação deve ser personalizado'
      ],
      prohibited_claims: [
        'Vacina garante 100% de proteção',
        'Sem efeitos colaterais'
      ]
    },
    is_active: true,
    created_at: '2024-08-01T08:00:00Z',
    updated_at: '2024-08-20T10:30:00Z'
  },
  {
    id: 'kit-grooming-002',
    name: 'Promoção Banho e Tosa',
    category: 'grooming',
    business_types: ['grooming_salon', 'pet_shop'],
    templates: {
      post_templates: [
        {
          title: '✨ Seu pet mais bonito!',
          content: 'Banho e tosa com produtos de qualidade premium. Seu pet merece o melhor cuidado estético com profissionais especializados.',
          hashtags: ['#BanhoETosa', '#PetLindo', '#CuidadosPet', '#GroomingProfissional'],
          cta: 'Agende já!'
        },
        {
          title: '🛁 Spa Day para seu Pet',
          content: 'Transformação completa! Banho relaxante, tosa artística e muito carinho. Seu companheiro vai sair se sentindo especial.',
          hashtags: ['#SpaPet', '#TosaArtistica', '#PetFeliz'],
          cta: 'Reserve o horário'
        }
      ],
      ad_templates: [
        {
          headline: 'Banho e Tosa Profissional',
          description: 'Seu pet merece cuidado especial. Produtos premium, técnicas modernas e muito amor.',
          call_to_action: 'Agendar Serviço'
        }
      ],
      email_templates: [
        {
          subject: 'Hora do banho! [NOME_PET] está precisando 🛁',
          preview_text: 'Cuidados especiais para deixar seu companheiro...',
          content: 'Oi [NOME_TUTOR], notamos que faz um tempo que [NOME_PET] não vem nos visitar. Que tal um banho relaxante?'
        }
      ]
    },
    default_goals: {
      primary: 'bookings',
      metrics: ['impressions', 'calls', 'bookings', 'revenue']
    },
    target_audience: {
      demographics: ['Tutores 25-65 anos', 'Classes A/B/C', 'Moradores urbanos'],
      interests: ['Estética pet', 'Cuidados especiais', 'Pets bem cuidados'],
      behaviors: ['Agendam serviços regularmente', 'Valorizam qualidade', 'Compartilham fotos dos pets']
    },
    recommended_budget_range: {
      min: 200,
      max: 600
    },
    compliance_requirements: {
      veterinary_approval: false,
      disclaimers: [
        'Serviços estéticos não substituem cuidados veterinários'
      ],
      prohibited_claims: [
        'Sem stress para o pet',
        'Resultado garantido'
      ]
    },
    is_active: true,
    created_at: '2024-08-05T09:00:00Z',
    updated_at: '2024-08-22T14:45:00Z'
  },
  {
    id: 'kit-checkup-003',
    name: 'Check-up Preventivo',
    category: 'checkup',
    business_types: ['veterinary_clinic'],
    templates: {
      post_templates: [
        {
          title: '🩺 Prevenção é o melhor remédio',
          content: 'Check-up completo para detectar problemas antes que se tornem graves. Cuidado preventivo é demonstração de amor.',
          hashtags: ['#CheckupPet', '#MedicinaPreventiva', '#SaudeAnimal', '#CuidadoResponsavel'],
          cta: 'Agende o check-up'
        }
      ],
      ad_templates: [
        {
          headline: 'Check-up Preventivo Completo',
          description: 'Detecte problemas de saúde cedo. Exames completos com nossa equipe especializada.',
          call_to_action: 'Marcar Consulta'
        }
      ],
      email_templates: [
        {
          subject: 'Check-up anual do [NOME_PET] - Agendamento disponível',
          preview_text: 'Mantenha a saúde em dia com exames preventivos...',
          content: 'Olá [NOME_TUTOR], está na hora do check-up anual do [NOME_PET]. Prevenção é o melhor cuidado!'
        }
      ]
    },
    default_goals: {
      primary: 'consultations',
      metrics: ['appointments', 'revenue', 'follow_ups']
    },
    target_audience: {
      demographics: ['Tutores experientes', '35-60 anos', 'Renda média/alta'],
      interests: ['Medicina preventiva', 'Longevidade pet', 'Cuidado integral'],
      behaviors: ['Fazem check-ups regulares', 'Investem em saúde', 'Pesquisam sobre cuidados']
    },
    recommended_budget_range: {
      min: 400,
      max: 1000
    },
    compliance_requirements: {
      veterinary_approval: true,
      disclaimers: [
        'Exames devem ser interpretados por veterinário',
        'Check-up não substitui consulta em caso de sintomas'
      ],
      prohibited_claims: [
        'Detecção 100% de problemas',
        'Garantia de saúde perfeita'
      ]
    },
    is_active: true,
    created_at: '2024-08-10T11:00:00Z',
    updated_at: '2024-08-24T16:20:00Z'
  }
];

// Mock Data - Instâncias de Campanhas Ativas
export const mockCampaignInstances: CampaignInstance[] = [
  {
    id: 'campaign-vet-vaccination-001',
    brand_id: 'brand-vet-amor-001',
    kit_id: 'kit-vaccination-001',
    name: 'Campanha Vacinação Outono - Vet Amor',
    status: 'active',
    customizations: {
      custom_messages: [
        'Atendimento 24h disponível',
        'Especialistas em pets idosos',
        'Primeira consulta com 20% desconto'
      ],
      brand_adjustments: {
        primary_color: '#2563EB',
        logo_included: true
      },
      specific_services: ['Vacinação múltipla', 'Vermifugação', 'Check-up básico']
    },
    target_metrics: {
      impressions: 15000,
      clicks: 450,
      appointments: 60,
      leads: 80
    },
    budget_allocated: 600,
    start_date: '2024-08-15',
    end_date: '2024-09-15',
    performance_metrics: {
      current_impressions: 8420,
      current_clicks: 267,
      current_appointments: 34,
      current_spend: 340.50,
      cpa: 10.01,
      ctr: 3.17
    },
    created_at: '2024-08-10T14:00:00Z',
    updated_at: '2024-08-24T09:30:00Z'
  },
  {
    id: 'campaign-grooming-promo-002',
    brand_id: 'brand-tosa-chique-003',
    kit_id: 'kit-grooming-002',
    name: 'Promoção Setembro - Tosa & Chique',
    status: 'active',
    customizations: {
      custom_messages: [
        'Tosa artística especializada',
        'Produtos importados premium',
        'Ambiente climatizado e relaxante'
      ],
      specific_services: ['Tosa na tesoura', 'Hidratação', 'Corte de unhas', 'Limpeza de ouvidos']
    },
    target_metrics: {
      impressions: 8000,
      clicks: 240,
      appointments: 40
    },
    budget_allocated: 400,
    start_date: '2024-09-01',
    end_date: '2024-09-30',
    performance_metrics: {
      current_impressions: 3200,
      current_clicks: 112,
      current_appointments: 18,
      current_spend: 156.00,
      cpa: 8.67,
      ctr: 3.50
    },
    created_at: '2024-08-25T10:00:00Z',
    updated_at: '2024-08-30T15:45:00Z'
  },
  {
    id: 'campaign-petshop-checkup-003',
    brand_id: 'brand-petshop-bella-002',
    kit_id: 'kit-checkup-003',
    name: 'Check-up Preventivo - Pet Shop Bella',
    status: 'paused',
    customizations: {
      custom_messages: [
        'Parceria com veterinário local',
        'Consulta + desconto em produtos',
        'Acompanhamento nutricional incluso'
      ]
    },
    target_metrics: {
      appointments: 25,
      leads: 50
    },
    budget_allocated: 300,
    start_date: '2024-08-01',
    end_date: '2024-08-31',
    performance_metrics: {
      current_impressions: 5600,
      current_clicks: 89,
      current_appointments: 12,
      current_spend: 180.50,
      cpa: 15.04,
      ctr: 1.59
    },
    created_at: '2024-07-28T12:00:00Z',
    updated_at: '2024-08-20T11:15:00Z'
  }
];

// Factory Functions
export const createMockPetCampaignKit = (overrides: Partial<PetCampaignKit> = {}): PetCampaignKit => ({
  id: `kit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name: 'Mock Campaign Kit',
  category: 'checkup',
  business_types: ['veterinary_clinic'],
  templates: {
    post_templates: [{
      title: 'Mock Post Title',
      content: 'Mock post content',
      hashtags: ['#MockPet', '#TestCampaign']
    }],
    ad_templates: [{
      headline: 'Mock Ad Headline',
      description: 'Mock ad description',
      call_to_action: 'Mock CTA'
    }],
    email_templates: [{
      subject: 'Mock Email Subject',
      preview_text: 'Mock preview',
      content: 'Mock email content'
    }]
  },
  default_goals: {
    primary: 'appointments',
    metrics: ['impressions', 'clicks']
  },
  target_audience: {
    demographics: ['Pet owners'],
    interests: ['Pet care'],
    behaviors: ['Online research']
  },
  recommended_budget_range: {
    min: 200,
    max: 500
  },
  compliance_requirements: {
    veterinary_approval: false,
    disclaimers: [],
    prohibited_claims: []
  },
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockCampaignInstance = (overrides: Partial<CampaignInstance> = {}): CampaignInstance => ({
  id: `campaign-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  brand_id: 'mock-brand-id',
  kit_id: 'mock-kit-id',
  name: 'Mock Campaign Instance',
  status: 'draft',
  customizations: {},
  target_metrics: {
    impressions: 5000,
    clicks: 150,
    appointments: 20
  },
  budget_allocated: 300,
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  performance_metrics: {
    current_impressions: 0,
    current_clicks: 0,
    current_appointments: 0,
    current_spend: 0
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});