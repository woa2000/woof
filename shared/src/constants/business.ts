// Business logic constants and rules
export const PET_BUSINESS_TYPES = {
  VETERINARY_CLINIC: 'clinica_veterinaria',
  PET_SHOP: 'pet_shop',
  GROOMING: 'pet_grooming',
  PET_HOTEL: 'pet_hotel',
  PET_TRAINER: 'adestramento',
  PET_CARE: 'cuidados_pet',
  OTHER: 'outros',
} as const;

export const CALENDAR_PRIORITIES = {
  LOW: 'baixa',
  MEDIUM: 'media',
  HIGH: 'alta',
  CRITICAL: 'critica',
} as const;

export const CALENDAR_CATEGORIES = {
  VACCINATION: 'vacinacao',
  SEASONAL_DISEASE: 'doenca_sazonal',
  PREVENTIVE_CAMPAIGN: 'campanha_preventiva',
  COMMEMORATIVE_DATE: 'data_comemorativa',
  SEASONAL_PROCEDURE: 'procedimento_sazonal',
  OTHER: 'outros',
} as const;

export const CAMPAIGN_PLATFORMS = {
  META_ADS: 'Meta Ads',
  GOOGLE_ADS: 'Google Ads',
  TIKTOK_ADS: 'TikTok Ads',
  LINKEDIN_ADS: 'LinkedIn Ads',
} as const;

export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const LEAD_STATUS = {
  NEW: 'Novo',
  CONTACTED: 'Contatado', 
  CONVERTED: 'Convertido',
} as const;

export const ANAMNESE_STATUS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const ANAMNESE_TYPES = {
  COMPLETE: 'complete',
  QUICK: 'quick',
  COMPETITOR: 'competitor',
} as const;

export const FILE_UPLOAD_LIMITS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'],
  maxFiles: 10,
} as const;

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

export const BRAND_COLORS = {
  primary: '#10B981', // emerald-500
  secondary: '#1F2937', // gray-800  
  accent: '#F59E0B', // amber-500
  success: '#22C55E', // green-500
  warning: '#F59E0B', // amber-500
  error: '#EF4444', // red-500
  info: '#3B82F6', // blue-500
} as const;

export const PET_SPECIALTIES = [
  'Clínica Geral',
  'Cardiologia',
  'Dermatologia',
  'Neurologia',
  'Oncologia',
  'Ortopedia',
  'Oftalmologia',
  'Comportamento Animal',
  'Medicina Interna',
  'Emergência e Terapia Intensiva',
  'Reprodução Animal',
  'Medicina Preventiva',
  'Acupuntura',
  'Fisioterapia',
  'Nutrição',
] as const;

export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;