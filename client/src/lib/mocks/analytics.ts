/**
 * Mocks para Analytics e Performance
 * Baseado no DATABASE_SCHEMA.md - post_performance e analytics_reports
 */

export interface PostPerformance {
  id: string;
  brand_id: string;
  content_variant_id: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'whatsapp';
  published_at: string;
  // Métricas básicas
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  // Métricas calculadas
  engagement_rate: number; // (likes + comments + shares) / reach
  click_through_rate: number; // clicks / impressions
  save_rate: number; // saves / reach
  // Métricas específicas por plataforma
  instagram_metrics?: {
    story_views?: number;
    story_exits?: number;
    story_replies?: number;
    reel_plays?: number;
    reel_completion_rate?: number;
    profile_visits?: number;
    website_clicks?: number;
  };
  facebook_metrics?: {
    video_views?: number;
    video_completion_rate?: number;
    page_likes?: number;
    post_clicks?: number;
    check_ins?: number;
  };
  // Análise demográfica
  demographics: {
    age_ranges: { [key: string]: number }; // "18-24": 30, "25-34": 45
    gender: { male: number; female: number; other: number };
    locations: { [city: string]: number }; // "São Paulo": 60
  };
  created_at: string;
}

export interface AnalyticsReport {
  id: string;
  brand_id: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'campaign' | 'custom';
  title: string;
  date_from: string;
  date_to: string;
  // Métricas agregadas
  summary_metrics: {
    total_posts: number;
    total_impressions: number;
    total_reach: number;
    total_engagement: number;
    avg_engagement_rate: number;
    total_new_followers: number;
    follower_growth_rate: number;
  };
  // Performance por plataforma
  platform_performance: {
    [platform: string]: {
      posts_count: number;
      impressions: number;
      reach: number;
      engagement: number;
      engagement_rate: number;
      best_posting_time: string;
      top_content_types: string[];
    };
  };
  // Análise de conteúdo
  content_analysis: {
    best_performing_posts: Array<{
      content_variant_id: string;
      title: string;
      engagement_rate: number;
      reach: number;
    }>;
    worst_performing_posts: Array<{
      content_variant_id: string;
      title: string;
      engagement_rate: number;
      reach: number;
    }>;
    content_type_performance: { [type: string]: number };
    hashtag_performance: { [hashtag: string]: number };
  };
  // Insights e recomendações
  insights: {
    key_findings: string[];
    recommendations: string[];
    growth_opportunities: string[];
    content_gaps: string[];
  };
  // Comparação com período anterior
  period_comparison: {
    engagement_rate_change: number; // % change
    reach_change: number;
    follower_growth_change: number;
    performance_trend: 'improving' | 'stable' | 'declining';
  };
  created_at: string;
  updated_at: string;
}

export interface BenchmarkData {
  id: string;
  industry: string; // 'veterinary', 'pet_shop', 'grooming', 'pet_hotel'
  region: string; // 'brazil', 'sao_paulo', 'rio_de_janeiro'
  // Benchmarks por plataforma
  platform_benchmarks: {
    instagram: {
      avg_engagement_rate: number;
      avg_reach_rate: number; // reach / followers
      avg_save_rate: number;
      optimal_posting_frequency: number; // posts per week
      best_posting_times: string[];
      top_content_types: string[];
    };
    facebook: {
      avg_engagement_rate: number;
      avg_reach_rate: number;
      avg_click_rate: number;
      optimal_posting_frequency: number;
      best_posting_times: string[];
      top_content_types: string[];
    };
  };
  // Benchmarks por tamanho de negócio
  business_size_benchmarks: {
    small: { followers_range: string; avg_engagement: number };
    medium: { followers_range: string; avg_engagement: number };
    large: { followers_range: string; avg_engagement: number };
  };
  last_updated: string;
}

// Mock Data - Performance de Posts
export const mockPostPerformances: PostPerformance[] = [
  {
    id: 'perf-001',
    brand_id: 'brand-vet-amor-001',
    content_variant_id: 'content-var-001',
    platform: 'instagram',
    published_at: '2024-08-24T14:00:00Z',
    impressions: 2850,
    reach: 2120,
    likes: 156,
    comments: 28,
    shares: 12,
    saves: 34,
    clicks: 89,
    engagement_rate: 0.092, // (156+28+12)/2120 = 9.2%
    click_through_rate: 0.031, // 89/2850 = 3.1%
    save_rate: 0.016, // 34/2120 = 1.6%
    instagram_metrics: {
      profile_visits: 45,
      website_clicks: 23,
      story_views: 890,
      story_exits: 156,
      story_replies: 8
    },
    demographics: {
      age_ranges: {
        '18-24': 15,
        '25-34': 35,
        '35-44': 28,
        '45-54': 15,
        '55+': 7
      },
      gender: { male: 35, female: 62, other: 3 },
      locations: {
        'São Paulo': 45,
        'Rio de Janeiro': 20,
        'Belo Horizonte': 15,
        'Brasília': 10,
        'Outras': 10
      }
    },
    created_at: '2024-08-24T20:00:00Z'
  },
  {
    id: 'perf-002',
    brand_id: 'brand-tosa-chique-003',
    content_variant_id: 'content-var-002',
    platform: 'instagram',
    published_at: '2024-08-23T18:00:00Z',
    impressions: 4200,
    reach: 3150,
    likes: 298,
    comments: 45,
    shares: 23,
    saves: 67,
    clicks: 112,
    engagement_rate: 0.116, // (298+45+23)/3150 = 11.6%
    click_through_rate: 0.027, // 112/4200 = 2.7%
    save_rate: 0.021, // 67/3150 = 2.1%
    instagram_metrics: {
      profile_visits: 78,
      website_clicks: 34,
      story_views: 1240,
      story_exits: 189,
      story_replies: 15
    },
    demographics: {
      age_ranges: {
        '18-24': 25,
        '25-34': 40,
        '35-44': 22,
        '45-54': 10,
        '55+': 3
      },
      gender: { male: 25, female: 72, other: 3 },
      locations: {
        'São Paulo': 60,
        'Campinas': 15,
        'Santos': 10,
        'Guarulhos': 8,
        'Outras': 7
      }
    },
    created_at: '2024-08-23T22:00:00Z'
  },
  {
    id: 'perf-003',
    brand_id: 'brand-petshop-bella-002',
    content_variant_id: 'content-var-003',
    platform: 'facebook',
    published_at: '2024-08-22T10:00:00Z',
    impressions: 1890,
    reach: 1420,
    likes: 78,
    comments: 15,
    shares: 8,
    saves: 0, // Facebook não tem saves
    clicks: 45,
    engagement_rate: 0.071, // (78+15+8)/1420 = 7.1%
    click_through_rate: 0.024, // 45/1890 = 2.4%
    save_rate: 0,
    facebook_metrics: {
      page_likes: 12,
      post_clicks: 34,
      video_views: 0 // Não é vídeo
    },
    demographics: {
      age_ranges: {
        '18-24': 12,
        '25-34': 38,
        '35-44': 30,
        '45-54': 15,
        '55+': 5
      },
      gender: { male: 42, female: 55, other: 3 },
      locations: {
        'Curitiba': 50,
        'São José dos Pinhais': 20,
        'Pinhais': 15,
        'Araucária': 10,
        'Outras': 5
      }
    },
    created_at: '2024-08-22T16:00:00Z'
  }
];

// Mock Data - Relatórios de Analytics
export const mockAnalyticsReports: AnalyticsReport[] = [
  {
    id: 'report-001',
    brand_id: 'brand-vet-amor-001',
    report_type: 'weekly',
    title: 'Relatório Semanal - 18 a 24 de Agosto',
    date_from: '2024-08-18',
    date_to: '2024-08-24',
    summary_metrics: {
      total_posts: 8,
      total_impressions: 18500,
      total_reach: 14200,
      total_engagement: 1250,
      avg_engagement_rate: 0.088,
      total_new_followers: 45,
      follower_growth_rate: 0.025 // 2.5%
    },
    platform_performance: {
      instagram: {
        posts_count: 5,
        impressions: 12500,
        reach: 9800,
        engagement: 890,
        engagement_rate: 0.091,
        best_posting_time: '18:00',
        top_content_types: ['educational', 'behind_scenes']
      },
      facebook: {
        posts_count: 3,
        impressions: 6000,
        reach: 4400,
        engagement: 360,
        engagement_rate: 0.082,
        best_posting_time: '19:30',
        top_content_types: ['educational', 'testimonial']
      }
    },
    content_analysis: {
      best_performing_posts: [
        {
          content_variant_id: 'content-var-001',
          title: 'Sinais de que seu pet precisa de check-up',
          engagement_rate: 0.092,
          reach: 2120
        },
        {
          content_variant_id: 'content-var-007',
          title: 'Dra. Maria explica sobre vacinação',
          engagement_rate: 0.089,
          reach: 1980
        }
      ],
      worst_performing_posts: [
        {
          content_variant_id: 'content-var-012',
          title: 'Horários de funcionamento',
          engagement_rate: 0.034,
          reach: 890
        }
      ],
      content_type_performance: {
        'educational': 0.089,
        'behind_scenes': 0.095,
        'promotional': 0.067,
        'testimonial': 0.078
      },
      hashtag_performance: {
        '#SaudeAnimal': 0.091,
        '#VetAmor': 0.088,
        '#CuidadoVeterinario': 0.085,
        '#PetSaudavel': 0.082
      }
    },
    insights: {
      key_findings: [
        'Posts educativos têm 25% mais engajamento que promocionais',
        'Melhor horário para postagem: 18h às 20h',
        'Conteúdo com a equipe veterinária performa 15% melhor',
        'Hashtags específicas da clínica têm boa performance'
      ],
      recommendations: [
        'Aumentar frequência de posts educativos',
        'Incluir mais conteúdo da equipe (behind the scenes)',
        'Testar stories para aumentar alcance',
        'Criar série de posts sobre prevenção'
      ],
      growth_opportunities: [
        'Parcerias com influencers pet',
        'Conteúdo em vídeo (reels)',
        'Campanhas sazonais',
        'User-generated content com pacientes'
      ],
      content_gaps: [
        'Falta conteúdo sobre emergências',
        'Poucos depoimentos de clientes',
        'Ausência de conteúdo sobre especialidades',
        'Falta FAQ sobre procedimentos'
      ]
    },
    period_comparison: {
      engagement_rate_change: 0.12, // +12%
      reach_change: 0.08, // +8%
      follower_growth_change: -0.05, // -5%
      performance_trend: 'improving'
    },
    created_at: '2024-08-25T09:00:00Z',
    updated_at: '2024-08-25T09:00:00Z'
  },
  {
    id: 'report-002',
    brand_id: 'brand-tosa-chique-003',
    report_type: 'monthly',
    title: 'Relatório Mensal - Agosto 2024',
    date_from: '2024-08-01',
    date_to: '2024-08-31',
    summary_metrics: {
      total_posts: 28,
      total_impressions: 95000,
      total_reach: 72000,
      total_engagement: 8500,
      avg_engagement_rate: 0.118,
      total_new_followers: 185,
      follower_growth_rate: 0.089 // 8.9%
    },
    platform_performance: {
      instagram: {
        posts_count: 28,
        impressions: 95000,
        reach: 72000,
        engagement: 8500,
        engagement_rate: 0.118,
        best_posting_time: '18:30',
        top_content_types: ['behind_scenes', 'before_after', 'educational']
      }
    },
    content_analysis: {
      best_performing_posts: [
        {
          content_variant_id: 'content-var-002',
          title: 'Transformação do Dia: Schnauzer Theo',
          engagement_rate: 0.116,
          reach: 3150
        },
        {
          content_variant_id: 'content-var-015',
          title: 'Tosa artística: Poodle Princesa',
          engagement_rate: 0.134,
          reach: 4200
        }
      ],
      worst_performing_posts: [
        {
          content_variant_id: 'content-var-023',
          title: 'Produtos de higiene disponíveis',
          engagement_rate: 0.067,
          reach: 1200
        }
      ],
      content_type_performance: {
        'behind_scenes': 0.125,
        'before_after': 0.128,
        'educational': 0.098,
        'promotional': 0.089
      },
      hashtag_performance: {
        '#TosaArtistica': 0.125,
        '#TransformacaoPet': 0.121,
        '#TosaEChique': 0.118,
        '#PetLindo': 0.115
      }
    },
    insights: {
      key_findings: [
        'Transformações antes/depois são o conteúdo mais engajado',
        'Posts mostrando o processo têm 40% mais engajamento',
        'Clientes adoram ver seus pets sendo mimados',
        'Horário de pico: 18h30 (fim do trabalho)'
      ],
      recommendations: [
        'Documentar mais processos de grooming',
        'Criar série sobre técnicas específicas',
        'Incentivar clientes a compartilhar',
        'Explorar vídeos de transformação'
      ],
      growth_opportunities: [
        'Parcerias com pet influencers',
        'Workshops de grooming',
        'Colaboração com veterinárias',
        'Programa de fidelidade visual'
      ],
      content_gaps: [
        'Conteúdo sobre cuidados em casa',
        'Dicas de manutenção da tosa',
        'Informações sobre produtos usados',
        'Conteúdo sobre bem-estar animal'
      ]
    },
    period_comparison: {
      engagement_rate_change: 0.23, // +23%
      reach_change: 0.35, // +35%
      follower_growth_change: 0.18, // +18%
      performance_trend: 'improving'
    },
    created_at: '2024-09-01T10:00:00Z',
    updated_at: '2024-09-01T10:00:00Z'
  }
];

// Mock Data - Benchmarks da Indústria
export const mockBenchmarkData: BenchmarkData[] = [
  {
    id: 'benchmark-vet-001',
    industry: 'veterinary',
    region: 'brazil',
    platform_benchmarks: {
      instagram: {
        avg_engagement_rate: 0.085, // 8.5%
        avg_reach_rate: 0.65, // 65% dos seguidores
        avg_save_rate: 0.015, // 1.5%
        optimal_posting_frequency: 4, // 4 posts por semana
        best_posting_times: ['18:00', '19:30', '20:00'],
        top_content_types: ['educational', 'behind_scenes', 'testimonial']
      },
      facebook: {
        avg_engagement_rate: 0.072, // 7.2%
        avg_reach_rate: 0.45, // 45% dos seguidores
        avg_click_rate: 0.025, // 2.5%
        optimal_posting_frequency: 3, // 3 posts por semana
        best_posting_times: ['19:00', '20:00', '21:00'],
        top_content_types: ['educational', 'community', 'promotional']
      }
    },
    business_size_benchmarks: {
      small: { followers_range: '500-2000', avg_engagement: 0.095 },
      medium: { followers_range: '2000-10000', avg_engagement: 0.075 },
      large: { followers_range: '10000+', avg_engagement: 0.055 }
    },
    last_updated: '2024-08-15T00:00:00Z'
  },
  {
    id: 'benchmark-grooming-001',
    industry: 'grooming',
    region: 'brazil',
    platform_benchmarks: {
      instagram: {
        avg_engagement_rate: 0.105, // 10.5%
        avg_reach_rate: 0.72, // 72% dos seguidores
        avg_save_rate: 0.025, // 2.5%
        optimal_posting_frequency: 5, // 5 posts por semana
        best_posting_times: ['17:30', '18:30', '19:00'],
        top_content_types: ['before_after', 'behind_scenes', 'educational']
      },
      facebook: {
        avg_engagement_rate: 0.089, // 8.9%
        avg_reach_rate: 0.52, // 52% dos seguidores
        avg_click_rate: 0.032, // 3.2%
        optimal_posting_frequency: 3, // 3 posts por semana
        best_posting_times: ['18:00', '19:30', '20:30'],
        top_content_types: ['showcase', 'testimonial', 'educational']
      }
    },
    business_size_benchmarks: {
      small: { followers_range: '300-1500', avg_engagement: 0.125 },
      medium: { followers_range: '1500-8000', avg_engagement: 0.098 },
      large: { followers_range: '8000+', avg_engagement: 0.078 }
    },
    last_updated: '2024-08-15T00:00:00Z'
  },
  {
    id: 'benchmark-petshop-001',
    industry: 'pet_shop',
    region: 'brazil',
    platform_benchmarks: {
      instagram: {
        avg_engagement_rate: 0.068, // 6.8%
        avg_reach_rate: 0.58, // 58% dos seguidores
        avg_save_rate: 0.012, // 1.2%
        optimal_posting_frequency: 4, // 4 posts por semana
        best_posting_times: ['18:00', '19:00', '20:00'],
        top_content_types: ['product_showcase', 'educational', 'promotional']
      },
      facebook: {
        avg_engagement_rate: 0.055, // 5.5%
        avg_reach_rate: 0.38, // 38% dos seguidores
        avg_click_rate: 0.028, // 2.8%
        optimal_posting_frequency: 3, // 3 posts por semana
        best_posting_times: ['19:00', '20:00', '21:00'],
        top_content_types: ['promotional', 'educational', 'community']
      }
    },
    business_size_benchmarks: {
      small: { followers_range: '200-1000', avg_engagement: 0.078 },
      medium: { followers_range: '1000-5000', avg_engagement: 0.062 },
      large: { followers_range: '5000+', avg_engagement: 0.048 }
    },
    last_updated: '2024-08-15T00:00:00Z'
  }
];

// Factory Functions
export const createMockPostPerformance = (overrides: Partial<PostPerformance> = {}): PostPerformance => ({
  id: `perf-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  brand_id: 'mock-brand-id',
  content_variant_id: 'mock-content-id',
  platform: 'instagram',
  published_at: new Date().toISOString(),
  impressions: Math.floor(Math.random() * 5000) + 1000,
  reach: Math.floor(Math.random() * 3000) + 800,
  likes: Math.floor(Math.random() * 200) + 50,
  comments: Math.floor(Math.random() * 50) + 10,
  shares: Math.floor(Math.random() * 30) + 5,
  saves: Math.floor(Math.random() * 40) + 10,
  clicks: Math.floor(Math.random() * 100) + 20,
  engagement_rate: Math.random() * 0.15 + 0.05, // 5% to 20%
  click_through_rate: Math.random() * 0.05 + 0.01, // 1% to 6%
  save_rate: Math.random() * 0.03 + 0.01, // 1% to 4%
  demographics: {
    age_ranges: {
      '18-24': Math.floor(Math.random() * 30) + 10,
      '25-34': Math.floor(Math.random() * 40) + 20,
      '35-44': Math.floor(Math.random() * 30) + 15,
      '45-54': Math.floor(Math.random() * 20) + 10,
      '55+': Math.floor(Math.random() * 15) + 5
    },
    gender: {
      male: Math.floor(Math.random() * 50) + 20,
      female: Math.floor(Math.random() * 60) + 35,
      other: Math.floor(Math.random() * 10) + 2
    },
    locations: {
      'São Paulo': Math.floor(Math.random() * 40) + 30,
      'Rio de Janeiro': Math.floor(Math.random() * 30) + 15,
      'Outras': Math.floor(Math.random() * 30) + 20
    }
  },
  created_at: new Date().toISOString(),
  ...overrides
});

export const createMockAnalyticsReport = (overrides: Partial<AnalyticsReport> = {}): AnalyticsReport => ({
  id: `report-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  brand_id: 'mock-brand-id',
  report_type: 'weekly',
  title: 'Mock Analytics Report',
  date_from: '2024-08-18',
  date_to: '2024-08-24',
  summary_metrics: {
    total_posts: Math.floor(Math.random() * 15) + 5,
    total_impressions: Math.floor(Math.random() * 50000) + 10000,
    total_reach: Math.floor(Math.random() * 30000) + 8000,
    total_engagement: Math.floor(Math.random() * 3000) + 500,
    avg_engagement_rate: Math.random() * 0.12 + 0.04,
    total_new_followers: Math.floor(Math.random() * 100) + 20,
    follower_growth_rate: Math.random() * 0.05 + 0.01
  },
  platform_performance: {
    instagram: {
      posts_count: Math.floor(Math.random() * 10) + 3,
      impressions: Math.floor(Math.random() * 30000) + 8000,
      reach: Math.floor(Math.random() * 20000) + 6000,
      engagement: Math.floor(Math.random() * 2000) + 400,
      engagement_rate: Math.random() * 0.15 + 0.05,
      best_posting_time: '18:00',
      top_content_types: ['educational', 'behind_scenes']
    }
  },
  content_analysis: {
    best_performing_posts: [
      {
        content_variant_id: 'mock-content-1',
        title: 'Mock Best Post',
        engagement_rate: Math.random() * 0.15 + 0.08,
        reach: Math.floor(Math.random() * 5000) + 2000
      }
    ],
    worst_performing_posts: [
      {
        content_variant_id: 'mock-content-2',
        title: 'Mock Worst Post',
        engagement_rate: Math.random() * 0.05 + 0.01,
        reach: Math.floor(Math.random() * 1500) + 500
      }
    ],
    content_type_performance: {
      'educational': Math.random() * 0.12 + 0.06,
      'promotional': Math.random() * 0.08 + 0.04
    },
    hashtag_performance: {
      '#MockHashtag': Math.random() * 0.1 + 0.05
    }
  },
  insights: {
    key_findings: ['Mock finding 1', 'Mock finding 2'],
    recommendations: ['Mock recommendation 1', 'Mock recommendation 2'],
    growth_opportunities: ['Mock opportunity 1', 'Mock opportunity 2'],
    content_gaps: ['Mock gap 1', 'Mock gap 2']
  },
  period_comparison: {
    engagement_rate_change: (Math.random() - 0.5) * 0.4, // -20% to +20%
    reach_change: (Math.random() - 0.5) * 0.6, // -30% to +30%
    follower_growth_change: (Math.random() - 0.5) * 0.3, // -15% to +15%
    performance_trend: Math.random() > 0.5 ? 'improving' : 'stable'
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});