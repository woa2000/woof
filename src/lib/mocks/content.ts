/**
 * Mocks para Conteúdo e AI Operations
 * Baseado no DATABASE_SCHEMA.md - content_variants e ai_operation_logs
 */

export type ContentStatus = 'generated' | 'reviewing' | 'approved' | 'rejected' | 'published';
export type AIOperationType = 
  | 'content_generation'
  | 'brand_analysis' 
  | 'anamnese_analysis'
  | 'compliance_check'
  | 'performance_optimization';
export type OperationStatus = 'processing' | 'completed' | 'failed' | 'cancelled';

export interface ContentVariant {
  id: string;
  calendar_item_id: string;
  brand_id: string;
  title: string;
  content: string;
  hashtags: string[];
  call_to_action: string;
  // Metadados de IA
  ai_model: string;
  generation_prompt: string;
  ai_confidence: number; // 0-1
  // Scores de qualidade
  brand_alignment_score: number; // 1-10
  compliance_score: number; // 1-10
  engagement_prediction: number; // 0-1
  // Validações
  compliance_check: {
    veterinary_approved: boolean;
    blocked_terms_found: string[];
    disclaimers_included: boolean;
    manual_review_required: boolean;
  };
  // Status e aprovação
  status: ContentStatus;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface AIOperationLog {
  id: string;
  brand_id: string;
  user_id: string;
  operation_type: AIOperationType;
  model_used: string;
  input_data: any;
  output_data: any;
  // Métricas
  tokens_input: number;
  tokens_output: number;
  estimated_cost: number;
  processing_time_ms: number;
  status: OperationStatus;
  error_message?: string;
  created_at: string;
}

export interface CalendarItem {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  scheduled_date: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'whatsapp';
  post_type: 'educational' | 'promotional' | 'behind_scenes' | 'testimonial' | 'seasonal';
  status: 'scheduled' | 'published' | 'draft' | 'cancelled';
  auto_generate_content: boolean;
  created_at: string;
  updated_at: string;
}

// Mock Data - Variantes de Conteúdo
export const mockContentVariants: ContentVariant[] = [
  {
    id: 'content-var-001',
    calendar_item_id: 'calendar-item-001',
    brand_id: 'brand-vet-amor-001',
    title: 'Sinais de que seu pet precisa de check-up',
    content: 'Fique atento aos sinais que indicam que seu companheiro precisa de uma avaliação veterinária: mudanças no apetite, comportamento mais quieto que o normal, ou dificuldades para se locomover. A prevenção é sempre o melhor cuidado! 🐕❤️',
    hashtags: ['#CheckupPet', '#SaudeAnimal', '#VetAmor', '#CuidadoPreventivo', '#PetSaudavel'],
    call_to_action: 'Agende uma consulta pelo WhatsApp: (11) 99999-1234',
    ai_model: 'gpt-4o',
    generation_prompt: 'Crie um post educativo sobre sinais de que um pet precisa de check-up, usando tom profissional mas carinhoso, incluindo disclaimer veterinário',
    ai_confidence: 0.89,
    brand_alignment_score: 9,
    compliance_score: 10,
    engagement_prediction: 0.75,
    compliance_check: {
      veterinary_approved: true,
      blocked_terms_found: [],
      disclaimers_included: true,
      manual_review_required: false
    },
    status: 'approved',
    approved_by: '550e8400-e29b-41d4-a716-446655440001',
    approved_at: '2024-08-24T14:30:00Z',
    created_at: '2024-08-24T14:00:00Z'
  },
  {
    id: 'content-var-002',
    calendar_item_id: 'calendar-item-002',
    brand_id: 'brand-tosa-chique-003',
    title: 'Transformação do Dia: Schnauzer Theo',
    content: 'Olha que transformação incrível do Theo! 🌟 Tosa na tesoura com carinho e técnica profissional. Cada pet tem sua personalidade única, e nosso trabalho é realçar essa beleza natural. Theo saiu daqui se sentindo um verdadeiro príncipe! ✨',
    hashtags: ['#TransformacaoPet', '#TosaArtistica', '#TosaEChique', '#SchnauzerLove', '#PetLindo'],
    call_to_action: 'Agende a transformação do seu pet: (11) 97777-9012',
    ai_model: 'gpt-4o',
    generation_prompt: 'Crie post sobre caso de sucesso de grooming, destacando a transformação e técnica artística, tom elegante mas próximo',
    ai_confidence: 0.92,
    brand_alignment_score: 10,
    compliance_score: 9,
    engagement_prediction: 0.82,
    compliance_check: {
      veterinary_approved: false,
      blocked_terms_found: [],
      disclaimers_included: true,
      manual_review_required: false
    },
    status: 'published',
    approved_by: '550e8400-e29b-41d4-a716-446655440003',
    approved_at: '2024-08-23T16:45:00Z',
    created_at: '2024-08-23T16:20:00Z'
  },
  {
    id: 'content-var-003',
    calendar_item_id: 'calendar-item-003',
    brand_id: 'brand-petshop-bella-002',
    title: 'Dica: Como escolher a ração ideal',
    content: 'Escolher a ração perfeita pode ser desafiador! 🤔 Consideramos: idade do pet, porte, nível de atividade e necessidades especiais. Nossa equipe está sempre pronta para orientar você na melhor escolha para seu companheiro. Venha conversar conosco! 🐕🐱',
    hashtags: ['#RacaoIdeal', '#NutricaoPet', '#PetShopBella', '#CuidadoNutricional', '#OrientacaoEspecializada'],
    call_to_action: 'Visite nossa loja e tire suas dúvidas!',
    ai_model: 'gpt-4o',
    generation_prompt: 'Post educativo sobre escolha de ração, tom consultivo e próximo, incluindo convite para visita na loja',
    ai_confidence: 0.85,
    brand_alignment_score: 9,
    compliance_score: 9,
    engagement_prediction: 0.68,
    compliance_check: {
      veterinary_approved: false,
      blocked_terms_found: [],
      disclaimers_included: true,
      manual_review_required: false
    },
    status: 'approved',
    created_at: '2024-08-22T11:15:00Z'
  },
  {
    id: 'content-var-004',
    calendar_item_id: 'calendar-item-004',
    brand_id: 'brand-vet-amor-001',
    title: 'Campanha Vacinação: Proteção + Amor',
    content: 'Setembro é mês da vacinação! 💉 Proteja seu melhor amigo com nossa programação completa de imunização. Cada vacina é um ato de amor e cuidado preventivo. Nossa equipe especializada está pronta para receber vocês com todo carinho.',
    hashtags: ['#VacinacaoPet', '#SetembroVacinacao', '#ProtecaoAnimal', '#VetAmor'],
    call_to_action: 'Agende já: (11) 99999-1234',
    ai_model: 'gpt-4o',
    generation_prompt: 'Post promocional para campanha de vacinação, tom educativo mas promocional, destacar expertise da equipe',
    ai_confidence: 0.87,
    brand_alignment_score: 9,
    compliance_score: 8, // Nota menor por tom promocional
    engagement_prediction: 0.79,
    compliance_check: {
      veterinary_approved: false, // Precisa aprovação
      blocked_terms_found: [],
      disclaimers_included: false, // Faltou disclaimer
      manual_review_required: true
    },
    status: 'reviewing',
    created_at: '2024-08-24T09:30:00Z'
  }
];

// Mock Data - Itens de Calendário
export const mockCalendarItems: CalendarItem[] = [
  {
    id: 'calendar-item-001',
    brand_id: 'brand-vet-amor-001',
    title: 'Post Educativo: Sinais de Check-up',
    description: 'Conteúdo educativo sobre quando levar o pet para consulta',
    scheduled_date: '2024-08-25T14:00:00Z',
    platform: 'instagram',
    post_type: 'educational',
    status: 'scheduled',
    auto_generate_content: true,
    created_at: '2024-08-24T10:00:00Z',
    updated_at: '2024-08-24T14:30:00Z'
  },
  {
    id: 'calendar-item-002',
    brand_id: 'brand-tosa-chique-003',
    title: 'Case de Sucesso: Transformação Schnauzer',
    description: 'Mostrar antes/depois de grooming artístico',
    scheduled_date: '2024-08-24T18:00:00Z',
    platform: 'instagram',
    post_type: 'behind_scenes',
    status: 'published',
    auto_generate_content: true,
    created_at: '2024-08-23T15:00:00Z',
    updated_at: '2024-08-23T17:00:00Z'
  },
  {
    id: 'calendar-item-003',
    brand_id: 'brand-petshop-bella-002',
    title: 'Dica: Escolhendo Ração',
    description: 'Post educativo sobre seleção de ração por porte/idade',
    scheduled_date: '2024-08-26T10:00:00Z',
    platform: 'facebook',
    post_type: 'educational',
    status: 'scheduled',
    auto_generate_content: true,
    created_at: '2024-08-22T09:00:00Z',
    updated_at: '2024-08-22T11:30:00Z'
  },
  {
    id: 'calendar-item-004',
    brand_id: 'brand-vet-amor-001',
    title: 'Promoção: Campanha Vacinação',
    description: 'Lançamento da campanha de vacinação de setembro',
    scheduled_date: '2024-08-27T16:00:00Z',
    platform: 'instagram',
    post_type: 'promotional',
    status: 'draft',
    auto_generate_content: true,
    created_at: '2024-08-24T08:00:00Z',
    updated_at: '2024-08-24T09:30:00Z'
  }
];

// Mock Data - Logs de Operações de IA
export const mockAIOperationLogs: AIOperationLog[] = [
  {
    id: 'ai-log-001',
    brand_id: 'brand-vet-amor-001',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    operation_type: 'content_generation',
    model_used: 'gpt-4o',
    input_data: {
      prompt: 'Crie um post educativo sobre sinais de que um pet precisa de check-up',
      brand_voice: 'Profissional, confiável, carinhoso, educativo',
      target_platform: 'instagram',
      max_length: 280
    },
    output_data: {
      content: 'Fique atento aos sinais que indicam que seu companheiro precisa...',
      hashtags: ['#CheckupPet', '#SaudeAnimal'],
      confidence: 0.89
    },
    tokens_input: 156,
    tokens_output: 98,
    estimated_cost: 0.0034,
    processing_time_ms: 2340,
    status: 'completed',
    created_at: '2024-08-24T14:00:00Z'
  },
  {
    id: 'ai-log-002',
    brand_id: 'brand-tosa-chique-003',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    operation_type: 'compliance_check',
    model_used: 'gpt-4o',
    input_data: {
      content: 'Olha que transformação incrível do Theo!...',
      business_type: 'grooming_salon',
      compliance_rules: ['Não prometer resultados', 'Incluir disclaimers adequados']
    },
    output_data: {
      compliance_score: 9,
      blocked_terms: [],
      required_disclaimers: ['Resultados podem variar por pet'],
      approved: true
    },
    tokens_input: 89,
    tokens_output: 45,
    estimated_cost: 0.0018,
    processing_time_ms: 1580,
    status: 'completed',
    created_at: '2024-08-23T16:25:00Z'
  },
  {
    id: 'ai-log-003',
    brand_id: 'brand-petshop-bella-002',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    operation_type: 'brand_analysis',
    model_used: 'gpt-4o',
    input_data: {
      website_content: 'Pet Shop Bella - Produtos premium para seu melhor amigo...',
      social_media_posts: ['Post 1...', 'Post 2...'],
      competitor_analysis: ['Petshop X', 'Loja Y']
    },
    output_data: {
      brand_consistency_score: 8.5,
      tone_analysis: 'Amigável, próximo, familiar',
      improvement_suggestions: ['Padronizar CTAs', 'Incluir mais cases de sucesso'],
      brand_voice_adherence: 0.85
    },
    tokens_input: 1240,
    tokens_output: 320,
    estimated_cost: 0.0156,
    processing_time_ms: 4200,
    status: 'completed',
    created_at: '2024-08-22T15:30:00Z'
  },
  {
    id: 'ai-log-004',
    brand_id: 'brand-vet-amor-001',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    operation_type: 'performance_optimization',
    model_used: 'gpt-4o',
    input_data: {
      historical_posts: [
        { content: 'Post A', engagement: 45, reach: 1200 },
        { content: 'Post B', engagement: 78, reach: 1800 }
      ],
      current_performance: { avg_engagement: 3.2, avg_reach: 1500 },
      optimization_goal: 'increase_engagement'
    },
    output_data: {
      optimized_content_suggestions: [
        'Incluir mais perguntas diretas',
        'Usar mais emojis relacionados a pets',
        'Postar nos horários de maior engajamento (18h-20h)'
      ],
      predicted_improvement: 0.25,
      confidence: 0.78
    },
    tokens_input: 890,
    tokens_output: 180,
    estimated_cost: 0.0089,
    processing_time_ms: 3100,
    status: 'completed',
    created_at: '2024-08-24T11:45:00Z'
  },
  {
    id: 'ai-log-005',
    brand_id: 'brand-vet-amor-001',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    operation_type: 'anamnese_analysis',
    model_used: 'gpt-4o',
    input_data: {
      website_url: 'https://vetamor.com.br',
      scraped_content: { pages: 8, content_blocks: 45 },
      business_type: 'veterinary_clinic'
    },
    output_data: {
      strengths: ['Equipe qualificada', 'Equipamentos modernos'],
      weaknesses: ['Site lento', 'Falta de depoimentos'],
      opportunities: ['Telemedicina', 'App mobile'],
      threats: ['Concorrência crescente'],
      overall_score: 8
    },
    tokens_input: 2100,
    tokens_output: 450,
    estimated_cost: 0.0255,
    processing_time_ms: 8900,
    status: 'completed',
    created_at: '2024-08-20T16:30:00Z'
  }
];

// Factory Functions
export const createMockContentVariant = (overrides: Partial<ContentVariant> = {}): ContentVariant => ({
  id: `content-var-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  calendar_item_id: 'mock-calendar-item-id',
  brand_id: 'mock-brand-id',
  title: 'Mock Content Title',
  content: 'Mock content generated by AI for testing purposes.',
  hashtags: ['#MockContent', '#TestPost'],
  call_to_action: 'Mock CTA',
  ai_model: 'gpt-4o',
  generation_prompt: 'Mock generation prompt',
  ai_confidence: 0.8,
  brand_alignment_score: 8,
  compliance_score: 9,
  engagement_prediction: 0.7,
  compliance_check: {
    veterinary_approved: false,
    blocked_terms_found: [],
    disclaimers_included: true,
    manual_review_required: false
  },
  status: 'generated',
  created_at: new Date().toISOString(),
  ...overrides
});

export const createMockAIOperationLog = (overrides: Partial<AIOperationLog> = {}): AIOperationLog => ({
  id: `ai-log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  brand_id: 'mock-brand-id',
  user_id: 'mock-user-id',
  operation_type: 'content_generation',
  model_used: 'gpt-4o',
  input_data: { prompt: 'Mock input' },
  output_data: { content: 'Mock output' },
  tokens_input: 100,
  tokens_output: 50,
  estimated_cost: 0.002,
  processing_time_ms: 1500,
  status: 'completed',
  created_at: new Date().toISOString(),
  ...overrides
});

export const createMockCalendarItem = (overrides: Partial<CalendarItem> = {}): CalendarItem => ({
  id: `calendar-item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  brand_id: 'mock-brand-id',
  title: 'Mock Calendar Item',
  description: 'Mock description',
  scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  platform: 'instagram',
  post_type: 'educational',
  status: 'scheduled',
  auto_generate_content: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});