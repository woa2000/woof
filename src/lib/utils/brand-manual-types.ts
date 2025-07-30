// Tipos para o Manual da Marca baseados no brand-model.json

export interface BrandManualMetadata {
  brand: string;
  version: string;
  last_updated: string;
  author: string;
}

// Capítulo 01 - Visão & Essência
export interface VisionEssenceContent {
  purpose: string;
  manifesto: string;
  personality_adjectives: string[];
}

// Capítulo 02 - Sistema de Logotipo Digital
export interface LogoSystemContent {
  logo_versions: string[];
  file_formats: string[];
  asset_sizes: {
    favicon: number[];
    app_icon: {
      android: number;
      ios: number;
    };
  };
  clear_space: string;
  min_size_px: number;
  donts: string[];
  uploaded_logos?: Array<{
    version: string;
    file_url: string;
    file_name: string;
    format: string;
    uploaded_at: string;
    size_bytes: number;
    application_notes?: string;
    storage_path?: string;
  }>;
}

// Capítulo 03 - Paleta de Cores Web
export interface ColorPaletteContent {
  primary: {
    name: string;
    hex: string;
    usage_min_percent: number;
  };
  support: Array<{
    name: string;
    hex: string;
  }>;
  dark_mode: {
    background: string;
    text: string;
  };
  contrast_standard: string;
}

// Capítulo 04 - Tipografia Responsiva
export interface TypographyContent {
  primary_font: string;
  secondary_font: string;
  fallbacks: string[];
  scale_rem: {
    h1: number;
    h2: number;
    h3: number;
    body: number;
    caption: number;
  };
  line_height: number;
  letter_spacing: string;
}

// Capítulo 05 - Grid & Layout Digital
export interface GridLayoutContent {
  grids: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  spacing_tokens_px: number[];
  breakpoints_px: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// Capítulo 06 - Component Library
export interface ComponentLibraryContent {
  components: string[];
  source_link: string;
}

// Capítulo 07 - Ícones & Ilustrações
export interface IconsIllustrationsContent {
  stroke_width_px: number;
  corner_radius_px: number;
  allowed_motifs: string[];
  palette_restricted: boolean;
  icon_repository: string;
}

// Capítulo 08 - Motion & Micro-interações
export interface MotionContent {
  duration_ms: {
    min: number;
    max: number;
  };
  easing: string;
  patterns: string[];
}

// Capítulo 09 - Acessibilidade Web
export interface AccessibilityContent {
  contrast_ratio_min: number;
  touch_target_px: number;
  focus_visible: boolean;
  required_aria: boolean;
}

// Capítulo 10 - Tom de Voz Digital
export interface VoiceToneContent {
  pillars: string[];
  examples: {
    push_notification: string;
    banner_cta: string;
    support_reply: string;
  };
  preferred_words: string[];
  avoid_words: string[];
}

// Capítulo 11 - Social Media Toolkit
export interface SocialMediaContent {
  templates: {
    feed: string;
    story: string;
    reel_cover: string;
  };
  safe_margins_percent: number;
  hashtag_rules: {
    max_per_post: number;
    brand_tag: string;
  };
}

// Capítulo 12 - E-mail & Notificações
export interface EmailNotificationsContent {
  max_width_px: number;
  sections: string[];
  dark_mode_ready: boolean;
}

// Capítulo 13 - Banners & Ads Digitais
export interface BannersAdsContent {
  iab_sizes_px: number[][];
  max_file_weight_kb: number;
  animation_guidelines: string;
}

// Capítulo 14 - Gestão de Ativos
export interface AssetManagementContent {
  folder_structure: string[];
  naming_convention: string;
  single_source_of_truth: string;
}

// Capítulo 15 - Checklist de Aprovação
export interface ApprovalChecklistContent {
  steps: string[];
}

// Union type para todos os conteúdos possíveis
export type ChapterContent = 
  | VisionEssenceContent
  | LogoSystemContent
  | ColorPaletteContent
  | TypographyContent
  | GridLayoutContent
  | ComponentLibraryContent
  | IconsIllustrationsContent
  | MotionContent
  | AccessibilityContent
  | VoiceToneContent
  | SocialMediaContent
  | EmailNotificationsContent
  | BannersAdsContent
  | AssetManagementContent
  | ApprovalChecklistContent;

// Estrutura de um capítulo
export interface BrandManualChapter {
  id: string;
  title: string;
  objective: string;
  content: ChapterContent;
  completion_status?: 'empty' | 'partial' | 'complete';
  last_updated?: string;
}

// Estrutura completa do manual
export interface BrandManualData {
  metadata: BrandManualMetadata;
  chapters: BrandManualChapter[];
}

// Arquivo source para IA
export interface SourceFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'url';
  size?: number;
  url: string;
  uploaded_at: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'error';
  extracted_data?: Partial<BrandManualData>;
}

// Entidade principal do banco
export interface BrandManual {
  id: string;
  user_id: string;
  brand_name: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  creation_method: 'manual' | 'ai_extraction' | 'hybrid';
  manual_data: BrandManualData;
  source_files: SourceFile[];
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

// Tipos para criação
export interface CreateBrandManualData {
  brand_name: string;
  description?: string;
  creation_method: 'manual' | 'ai_extraction' | 'hybrid';
  tags?: string[];
  is_template?: boolean;
  initial_data?: Partial<BrandManualData>;
}

// Tipos para atualização
export interface UpdateBrandManualData {
  brand_name?: string;
  description?: string;
  manual_data?: BrandManualData;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  is_public?: boolean;
}

// Estatísticas do usuário
export interface UserBrandManualStats {
  user_id: string;
  total_manuals: number;
  published_count: number;
  draft_count: number;
  ai_generated_count: number;
  last_activity: string;
}

// Template para novos manuais
export const EMPTY_BRAND_MANUAL_TEMPLATE: BrandManualData = {
  metadata: {
    brand: '',
    version: '1.0',
    last_updated: new Date().toISOString().split('T')[0],
    author: ''
  },
  chapters: [
    {
      id: '01',
      title: 'Visão & Essência',
      objective: 'Relembrar propósito, missão e personalidade da marca para orientar decisões digitais.',
      content: {
        purpose: '',
        manifesto: '',
        personality_adjectives: []
      } as VisionEssenceContent,
      completion_status: 'empty'
    },
    {
      id: '02',
      title: 'Sistema de Logotipo Digital',
      objective: 'Evitar usos incorretos em sites, apps e redes sociais.',
      content: {
        logo_versions: [],
        file_formats: ['SVG', 'PNG'],
        asset_sizes: {
          favicon: [32, 48],
          app_icon: { android: 512, ios: 1024 }
        },
        clear_space: '',
        min_size_px: 24,
        donts: []
      } as LogoSystemContent,
      completion_status: 'empty'
    },
    {
      id: '03',
      title: 'Paleta de Cores Web',
      objective: 'Garantir consistência visual e acessibilidade em ambientes digitais.',
      content: {
        primary: { name: '', hex: '', usage_min_percent: 0 },
        support: [],
        dark_mode: { background: '', text: '' },
        contrast_standard: 'WCAG 2.2 AA'
      } as ColorPaletteContent,
      completion_status: 'empty'
    },
    {
      id: '04',
      title: 'Tipografia Responsiva',
      objective: 'Manter hierarquia clara em qualquer tela.',
      content: {
        primary_font: '',
        secondary_font: '',
        fallbacks: ['Inter', 'Helvetica', 'Arial'],
        scale_rem: { h1: 2.25, h2: 1.75, h3: 1.5, body: 1, caption: 0.875 },
        line_height: 1.4,
        letter_spacing: 'normal'
      } as TypographyContent,
      completion_status: 'empty'
    },
    {
      id: '05',
      title: 'Grid & Layout Digital',
      objective: 'Padronizar espaçamentos e componibilizar telas.',
      content: {
        grids: { desktop: 12, tablet: 8, mobile: 4 },
        spacing_tokens_px: [4, 8, 16, 24, 32, 40],
        breakpoints_px: { sm: 640, md: 768, lg: 1024, xl: 1280 }
      } as GridLayoutContent,
      completion_status: 'empty'
    },
    {
      id: '06',
      title: 'Component Library (UI Kit)',
      objective: 'Reusar elementos e acelerar o desenvolvimento.',
      content: {
        components: [],
        source_link: ''
      } as ComponentLibraryContent,
      completion_status: 'empty'
    },
    {
      id: '07',
      title: 'Ícones & Ilustrações',
      objective: 'Alinhar estilo gráfico on-line.',
      content: {
        stroke_width_px: 2,
        corner_radius_px: 4,
        allowed_motifs: [],
        palette_restricted: true,
        icon_repository: ''
      } as IconsIllustrationsContent,
      completion_status: 'empty'
    },
    {
      id: '08',
      title: 'Motion & Micro-interações',
      objective: 'Adicionar vida sem comprometer performance.',
      content: {
        duration_ms: { min: 150, max: 300 },
        easing: 'ease-out-quad',
        patterns: []
      } as MotionContent,
      completion_status: 'empty'
    },
    {
      id: '09',
      title: 'Acessibilidade Web (WCAG 2.2)',
      objective: 'Incluir todos os usuários.',
      content: {
        contrast_ratio_min: 4.5,
        touch_target_px: 48,
        focus_visible: true,
        required_aria: true
      } as AccessibilityContent,
      completion_status: 'empty'
    },
    {
      id: '10',
      title: 'Tom de Voz Digital',
      objective: 'Unificar a comunicação escrita em todos os canais on-line.',
      content: {
        pillars: [],
        examples: {
          push_notification: '',
          banner_cta: '',
          support_reply: ''
        },
        preferred_words: [],
        avoid_words: []
      } as VoiceToneContent,
      completion_status: 'empty'
    },
    {
      id: '11',
      title: 'Social Media Toolkit',
      objective: 'Manter visual coeso entre redes sociais.',
      content: {
        templates: {
          feed: '1080x1080',
          story: '1080x1920',
          reel_cover: '1080x1920'
        },
        safe_margins_percent: 10,
        hashtag_rules: {
          max_per_post: 5,
          brand_tag: ''
        }
      } as SocialMediaContent,
      completion_status: 'empty'
    },
    {
      id: '12',
      title: 'E-mail & Notificações',
      objective: 'Garantir clareza e entregabilidade.',
      content: {
        max_width_px: 600,
        sections: ['header', 'body', 'footer'],
        dark_mode_ready: true
      } as EmailNotificationsContent,
      completion_status: 'empty'
    },
    {
      id: '13',
      title: 'Banners & Ads Digitais',
      objective: 'Facilitar criação de anúncios.',
      content: {
        iab_sizes_px: [[728, 90], [300, 250], [1080, 1080]],
        max_file_weight_kb: 150,
        animation_guidelines: 'HTML5, 15 s, loop = 1'
      } as BannersAdsContent,
      completion_status: 'empty'
    },
    {
      id: '14',
      title: 'Gestão de Ativos & Nomenclatura',
      objective: 'Evitar confusão de arquivos e versões.',
      content: {
        folder_structure: ['/logo', '/icons', '/ui', '/social'],
        naming_convention: 'tipo-versao-idioma.ext',
        single_source_of_truth: ''
      } as AssetManagementContent,
      completion_status: 'empty'
    },
    {
      id: '15',
      title: 'Checklist de Aprovação Digital',
      objective: 'Reduzir retrabalho antes da publicação.',
      content: {
        steps: [
          'logo_correto',
          'contraste_ok',
          'alt_text_inserido',
          'fontes_adequadas',
          'grid_respeitado',
          'links_testados',
          'responsivo_validado',
          'acessibilidade_passou',
          'revisao_copys',
          'aprovado_por_gerente'
        ]
      } as ApprovalChecklistContent,
      completion_status: 'empty'
    }
  ]
};
