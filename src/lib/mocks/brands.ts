/**
 * Mocks para Brands e Brand Voice
 * Baseado no DATABASE_SCHEMA.md - brands table e brand_voice JSONB
 */

export type BrandStatus = 'active' | 'inactive' | 'suspended';
export type PetBusinessType = 
  | 'pet_shop'
  | 'veterinary_clinic' 
  | 'grooming_salon'
  | 'pet_hotel'
  | 'dog_training'
  | 'pet_franchise';

export interface BrandVoiceData {
  tone: string;
  persona: string;
  approved_terms: string[];
  blocked_terms: string[];
  compliance_rules: {
    veterinary: boolean;
    disclaimers: string[];
  };
  business_context: {
    services: string[];
    target_audience: string[];
    differentials: string[];
  };
}

export interface MockBrand {
  id: string;
  user_id: string;
  name: string;
  business_type: PetBusinessType;
  logo_url: string;
  website_url: string;
  brand_voice: BrandVoiceData;
  primary_color: string;
  secondary_color: string;
  target_audience: {
    primary: string[];
    secondary: string[];
    demographics: {
      age_range: string;
      income_level: string;
      pet_types: string[];
    };
  };
  veterinary_license?: string;
  responsible_veterinarian?: string;
  status: BrandStatus;
  created_at: string;
  updated_at: string;
}

// Mock Data - Brands Específicas
export const mockBrands: MockBrand[] = [
  {
    id: 'brand-vet-amor-001',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Clínica Veterinária Vet Amor',
    business_type: 'veterinary_clinic',
    logo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200',
    website_url: 'https://vetamor.com.br',
    brand_voice: {
      tone: 'Profissional, confiável, carinhoso, educativo',
      persona: 'Veterinária experiente que genuinamente ama animais e educa tutores com paciência',
      approved_terms: [
        'bem-estar animal', 'saúde preventiva', 'cuidado especializado',
        'diagnóstico preciso', 'tratamento humanizado', 'emergência 24h'
      ],
      blocked_terms: [
        'barato', 'desconto', 'promoção relâmpago', 'milagre',
        'cura garantida', 'sem dor', 'instantâneo'
      ],
      compliance_rules: {
        veterinary: true,
        disclaimers: [
          'Consulte sempre um médico veterinário',
          'Diagnóstico e tratamento devem ser realizados por profissional habilitado',
          'Em casos de emergência, procure atendimento imediatamente'
        ]
      },
      business_context: {
        services: ['consultas', 'vacinação', 'cirurgias', 'exames', 'emergência'],
        target_audience: ['tutores conscientes', 'famílias com pets', 'criadores'],
        differentials: ['equipamentos modernos', 'equipe especializada', 'atendimento 24h']
      }
    },
    primary_color: '#2563eb',
    secondary_color: '#10b981',
    target_audience: {
      primary: ['Tutores de cães e gatos', 'Famílias classe média'],
      secondary: ['Criadores responsáveis', 'Protetores de animais'],
      demographics: {
        age_range: '25-55 anos',
        income_level: 'Classe B/C',
        pet_types: ['cães', 'gatos', 'pets exóticos']
      }
    },
    veterinary_license: 'CRMV-SP 12345',
    responsible_veterinarian: 'Dr. Ana Paula Silva - CRMV-SP 12345',
    status: 'active',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-08-20T14:30:00Z'
  },
  {
    id: 'brand-petshop-bella-002',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Pet Shop Bella',
    business_type: 'pet_shop',
    logo_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200',
    website_url: 'https://petshopbella.com.br',
    brand_voice: {
      tone: 'Amigável, próximo, alegre, confiável',
      persona: 'Amigo dos pets que conhece cada produto e ama ajudar tutores a cuidarem melhor',
      approved_terms: [
        'qualidade premium', 'nutrição balanceada', 'brinquedos seguros',
        'acessórios funcionais', 'cuidado diário', 'amor pelos pets'
      ],
      blocked_terms: [
        'mais barato da cidade', 'liquidação total', 'preço imbatível'
      ],
      compliance_rules: {
        veterinary: false,
        disclaimers: [
          'Para questões de saúde, consulte um veterinário',
          'Leia sempre as instruções dos produtos'
        ]
      },
      business_context: {
        services: ['vendas', 'banho e tosa', 'delivery', 'consultoria'],
        target_audience: ['tutores iniciantes', 'famílias', 'moradores locais'],
        differentials: ['produtos premium', 'atendimento personalizado', 'delivery grátis']
      }
    },
    primary_color: '#f59e0b',
    secondary_color: '#ec4899',
    target_audience: {
      primary: ['Tutores de primeira viagem', 'Moradores do bairro'],
      secondary: ['Cuidadores profissionais', 'Pet sitters'],
      demographics: {
        age_range: '20-60 anos',
        income_level: 'Classe B/C/D',
        pet_types: ['cães', 'gatos', 'pássaros']
      }
    },
    status: 'active',
    created_at: '2024-02-10T10:15:00Z',
    updated_at: '2024-08-22T09:45:00Z'
  },
  {
    id: 'brand-tosa-chique-003',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Tosa & Chique',
    business_type: 'grooming_salon',
    logo_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200',
    website_url: 'https://tosaechique.com.br',
    brand_voice: {
      tone: 'Elegante, cuidadoso, artístico, profissional',
      persona: 'Artista especializada em grooming que trata cada pet como uma obra de arte',
      approved_terms: [
        'tosa artística', 'cuidado especializado', 'bem-estar animal',
        'técnicas modernas', 'produtos premium', 'resultado impecável'
      ],
      blocked_terms: [
        'rápido e barato', 'desconto imperdível', 'tosa express'
      ],
      compliance_rules: {
        veterinary: false,
        disclaimers: [
          'Serviços estéticos não substituem cuidados veterinários',
          'Informamos sobre qualquer alteração notada durante o grooming'
        ]
      },
      business_context: {
        services: ['tosa higiênica', 'tosa na tesoura', 'banho terapêutico', 'spa'],
        target_audience: ['tutores exigentes', 'pets de exposição', 'clientes premium'],
        differentials: ['técnicas artísticas', 'produtos importados', 'ambiente relaxante']
      }
    },
    primary_color: '#8b5cf6',
    secondary_color: '#f97316',
    target_audience: {
      primary: ['Tutores de pets de exposição', 'Clientes premium'],
      secondary: ['Criadores profissionais', 'Influenciadores pet'],
      demographics: {
        age_range: '30-65 anos',
        income_level: 'Classe A/B',
        pet_types: ['cães de raça', 'gatos persas', 'pets de competição']
      }
    },
    status: 'active',
    created_at: '2024-03-05T14:20:00Z',
    updated_at: '2024-08-24T16:10:00Z'
  }
];

// Factory Function
export const createMockBrand = (overrides: Partial<MockBrand> = {}): MockBrand => {
  const businessTypes: PetBusinessType[] = ['pet_shop', 'veterinary_clinic', 'grooming_salon', 'pet_hotel'];
  const businessType = overrides.business_type || businessTypes[0];
  
  return {
    id: `brand-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    user_id: overrides.user_id || 'mock-user-id',
    name: overrides.name || 'Mock Pet Business',
    business_type: businessType,
    logo_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200',
    website_url: 'https://mockpetbusiness.com.br',
    brand_voice: createMockBrandVoice(businessType),
    primary_color: '#2563eb',
    secondary_color: '#10b981',
    target_audience: {
      primary: ['Tutores de pets'],
      secondary: ['Amantes de animais'],
      demographics: {
        age_range: '25-55 anos',
        income_level: 'Classe B/C',
        pet_types: ['cães', 'gatos']
      }
    },
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
};

const createMockBrandVoice = (businessType: PetBusinessType): BrandVoiceData => {
  const baseVoice: BrandVoiceData = {
    tone: 'Amigável, profissional, carinhoso',
    persona: 'Especialista pet que ama animais',
    approved_terms: ['bem-estar animal', 'cuidado especializado'],
    blocked_terms: ['barato', 'desconto'],
    compliance_rules: {
      veterinary: businessType === 'veterinary_clinic',
      disclaimers: ['Consulte sempre um veterinário quando necessário']
    },
    business_context: {
      services: ['atendimento pet'],
      target_audience: ['tutores'],
      differentials: ['qualidade', 'experiência']
    }
  };

  // Customizar por tipo de negócio
  if (businessType === 'veterinary_clinic') {
    baseVoice.compliance_rules.disclaimers = [
      'Consulte sempre um médico veterinário',
      'Diagnóstico deve ser feito por profissional habilitado'
    ];
  }

  return baseVoice;
};