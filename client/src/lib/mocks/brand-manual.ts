/**
 * Mocks para Brand Manual System
 * Baseado em src/lib/utils/brand-manual-types.ts
 * 
 * NOTA: Usando 'any' para conteúdo dos capítulos para simplificar
 * Em produção, usar as interfaces corretas dos tipos
 */

export interface MockBrandManual {
  id: string;
  user_id: string;
  brand_name: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  creation_method: 'manual' | 'ai_extraction' | 'hybrid';
  manual_data: {
    metadata: {
      brand: string;
      version: string;
      last_updated: string;
      author: string;
    };
    chapters: Array<{
      id: string;
      title: string;
      objective: string;
      completion_status?: 'empty' | 'partial' | 'complete';
      last_updated?: string;
      content: any; // Simplificado para demo
    }>;
  };
  source_files: any[];
  source_urls: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
  description?: string;
  tags: string[];
  is_template: boolean;
  is_public: boolean;
  share_token: string;
}

// Mock Data - Manual da Marca Completo (Clínica Veterinária)
export const mockBrandManualVet: MockBrandManual = {
  id: 'manual-vet-amor-001',
  user_id: '550e8400-e29b-41d4-a716-446655440001',
  brand_name: 'Clínica Veterinária Vet Amor',
  version: '2.1',
  status: 'published',
  creation_method: 'hybrid',
  description: 'Manual da marca completo para clínica veterinária focada em atendimento humanizado',
  tags: ['veterinária', 'pets', 'saúde animal', 'cuidado especializado'],
  is_template: false,
  is_public: false,
  share_token: 'vet-amor-share-token-12345',
  source_files: [],
  source_urls: ['https://vetamor.com.br'],
  created_at: '2024-01-15T08:00:00Z',
  updated_at: '2024-08-24T14:30:00Z',
  published_at: '2024-08-24T14:30:00Z',
  
  manual_data: {
    metadata: {
      brand: 'Clínica Veterinária Vet Amor',
      version: '2.1',
      last_updated: '2024-08-24',
      author: 'Dr. Ana Paula Silva'
    },
    chapters: [
      {
        id: '01',
        title: 'Visão & Essência',
        objective: 'Relembrar propósito, missão e personalidade da marca para orientar decisões digitais.',
        completion_status: 'complete',
        last_updated: '2024-08-24',
        content: {
          purpose: 'Proporcionar cuidado veterinário especializado e humanizado',
          manifesto: 'Acreditamos que cada pet é único e merece atenção personalizada',
          personality_adjectives: ['Confiável', 'Acolhedor', 'Especializado', 'Transparente']
        }
      },
      {
        id: '02', 
        title: 'Sistema de Logotipo Digital',
        objective: 'Definir versões, formatos e aplicações corretas da marca.',
        completion_status: 'complete',
        last_updated: '2024-08-20',
        content: {
          logo_versions: ['Principal (horizontal)', 'Símbolo isolado', 'Versão vertical'],
          file_formats: ['.svg', '.png', '.jpg', '.pdf'],
          clear_space: 'Mínimo 2x altura da letra',
          min_size_px: 120
        }
      },
      {
        id: '03',
        title: 'Paleta de Cores Web',
        objective: 'Estabelecer hierarquia cromática para aplicações digitais.',
        completion_status: 'complete',
        content: {
          primary: { name: 'Azul Confiança', hex: '#2563EB' },
          support: [
            { name: 'Verde Saúde', hex: '#10B981' },
            { name: 'Laranja Cuidado', hex: '#F59E0B' }
          ]
        }
      },
      {
        id: '08',
        title: 'Social Media Toolkit',
        objective: 'Manter visual coeso entre redes sociais.',
        completion_status: 'complete',
        content: {
          templates: {
            feed: '1080x1080',
            story: '1080x1920',
            reel_cover: '1080x1920'
          },
          hashtag_rules: {
            brand_tag: '#VetAmor',
            max_per_post: 5
          },
          safe_margins_percent: 10,
          posting_frequency: '1x por dia',
          content_pillars: ['Educação (40%)', 'Bastidores (30%)', 'Depoimentos (20%)']
        }
      },
      {
        id: '09',
        title: 'Tom de Voz & Linguagem',
        objective: 'Estabelecer personalidade da marca na comunicação.',
        completion_status: 'complete',
        content: {
          tone: 'Profissional, confiável, carinhoso, educativo',
          personality: 'Veterinária experiente que genuinamente ama animais',
          approved_terms: ['bem-estar animal', 'cuidado especializado'],
          blocked_terms: ['barato', 'promoção', 'cura garantida'],
          pillars: ['caloroso', 'consultivo', 'confiante'],
          examples: {
            banner_cta: 'Cuide do seu pet com carinho',
            support_reply: 'Estamos aqui para cuidar do seu melhor amigo!',
            push_notification: 'Lembre-se: é hora do check-up do seu pet!'
          },
          avoid_words: ['garantia absoluta', 'barato'],
          preferred_words: ['cuidado', 'carinho', 'bem-estar']
        }
      }
    ]
  }
};

// Mock Data - Manual Pet Shop
export const mockBrandManualPetShop: MockBrandManual = {
  id: 'manual-petshop-bella-002',
  user_id: '550e8400-e29b-41d4-a716-446655440002',
  brand_name: 'Pet Shop Bella',
  version: '1.5',
  status: 'draft',
  creation_method: 'manual',
  description: 'Manual da marca para pet shop focado em produtos premium e atendimento familiar',
  tags: ['pet shop', 'produtos pet', 'atendimento familiar'],
  is_template: false,
  is_public: false,
  share_token: 'petshop-bella-share-token-67890',
  source_files: [],
  source_urls: ['https://petshopbella.com.br'],
  created_at: '2024-02-10T10:15:00Z',
  updated_at: '2024-08-20T16:45:00Z',
  
  manual_data: {
    metadata: {
      brand: 'Pet Shop Bella',
      version: '1.5',
      last_updated: '2024-08-20',
      author: 'Carlos Eduardo Santos'
    },
    chapters: [
      {
        id: '01',
        title: 'Visão & Essência',
        objective: 'Definir propósito e personalidade da marca.',
        completion_status: 'complete',
        content: {
          purpose: 'Ser o parceiro de confiança dos tutores',
          manifesto: 'Acreditamos que cada pet merece o melhor',
          personality_adjectives: ['Confiável', 'Próximo', 'Especializado', 'Familiar']
        }
      }
      // Outros capítulos em desenvolvimento...
    ]
  }
};

// Factory Function
export const createMockBrandManual = (overrides: Partial<MockBrandManual> = {}): MockBrandManual => ({
  id: `manual-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  user_id: 'mock-user-id',
  brand_name: 'Mock Pet Business',
  version: '1.0',
  status: 'draft',
  creation_method: 'manual',
  description: 'Manual da marca mock para testes',
  tags: ['mock', 'test'],
  is_template: false,
  is_public: false,
  share_token: `mock-share-${Math.random().toString(36).slice(2)}`,
  source_files: [],
  source_urls: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  manual_data: {
    metadata: {
      brand: 'Mock Pet Business',
      version: '1.0',
      last_updated: new Date().toISOString().split('T')[0],
      author: 'Mock Author'
    },
    chapters: []
  },
  ...overrides
});