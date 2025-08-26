/**
 * Mocks para Usuários e Perfis
 * Baseado nas interfaces: ProfileData, User, BusinessProfile
 */

// Faker será instalado como dependência dev quando necessário
// import { faker } from '@faker-js/faker/locale/pt_BR';

// Mock faker temporário para demonstração
const faker = {
  string: { uuid: () => `mock-uuid-${Math.random()}` },
  person: { fullName: () => 'Mock Full Name' },
  internet: { email: () => 'mock@example.com' },
  image: { avatarGitHub: () => 'https://avatars.githubusercontent.com/u/1?v=4' },
  phone: { number: (pattern: string) => '+55 11 99999-9999' },
  date: { 
    past: () => new Date('2024-01-01'),
    recent: () => new Date(),
    future: () => new Date('2025-12-31')
  },
  helpers: {
    arrayElement: <T>(arr: T[]) => arr[0],
    maybe: <T>(fn: () => T, options: { probability: number }) => 
      Math.random() < options.probability ? fn() : undefined
  },
  datatype: { boolean: () => true }
};

export type PetBusinessType = 
  | 'pet_shop'
  | 'veterinary_clinic' 
  | 'grooming_salon'
  | 'pet_hotel'
  | 'dog_training'
  | 'pet_franchise';

export interface MockProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  business_name: string;
  business_type: PetBusinessType;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface MockUser extends MockProfile {
  subscription_plan: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due';
  trial_ends_at?: string;
  last_login_at: string;
  preferences: {
    notifications_email: boolean;
    notifications_whatsapp: boolean;
    ai_suggestions: boolean;
    auto_publish: boolean;
  };
}

// Mock Data - Profiles Base
export const mockProfiles: MockProfile[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'dr.silva@vetamor.com.br',
    full_name: 'Dr. Ana Paula Silva',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    business_name: 'Clínica Veterinária Vet Amor',
    business_type: 'veterinary_clinic',
    phone: '+55 11 99999-1234',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-08-20T14:30:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'carlos@petshopbella.com.br',
    full_name: 'Carlos Eduardo Santos',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    business_name: 'Pet Shop Bella',
    business_type: 'pet_shop',
    phone: '+55 11 98888-5678',
    created_at: '2024-02-10T10:15:00Z',
    updated_at: '2024-08-22T09:45:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'marina@tosaechique.com.br',
    full_name: 'Marina Costa Lima',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    business_name: 'Tosa & Chique',
    business_type: 'grooming_salon',
    phone: '+55 11 97777-9012',
    created_at: '2024-03-05T14:20:00Z',
    updated_at: '2024-08-24T16:10:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    email: 'joao@hotelcanino.com.br',
    full_name: 'João Pedro Oliveira',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    business_name: 'Hotel Canino Premium',
    business_type: 'pet_hotel',
    phone: '+55 11 96666-3456',
    created_at: '2024-04-12T11:30:00Z',
    updated_at: '2024-08-23T13:25:00Z'
  }
];

// Mock Data - Users Completos
export const mockUsers: MockUser[] = mockProfiles.map(profile => ({
  ...profile,
  subscription_plan: faker.helpers.arrayElement(['free', 'pro', 'enterprise']),
  subscription_status: faker.helpers.arrayElement(['active', 'canceled', 'past_due']),
  trial_ends_at: faker.helpers.maybe(() => faker.date.future().toISOString(), { probability: 0.3 }),
  last_login_at: faker.date.recent().toISOString(),
  preferences: {
    notifications_email: faker.datatype.boolean(),
    notifications_whatsapp: faker.datatype.boolean(),
    ai_suggestions: faker.datatype.boolean(),
    auto_publish: faker.datatype.boolean()
  }
}));

// Factory Functions
export const createMockProfile = (overrides: Partial<MockProfile> = {}): MockProfile => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  full_name: faker.person.fullName(),
  avatar_url: faker.image.avatarGitHub(),
  business_name: generateBusinessName(),
  business_type: faker.helpers.arrayElement(['pet_shop', 'veterinary_clinic', 'grooming_salon', 'pet_hotel', 'dog_training']),
  phone: faker.phone.number('+55 11 9####-####'),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  ...overrides
});

export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  ...createMockProfile(),
  subscription_plan: faker.helpers.arrayElement(['free', 'pro', 'enterprise']),
  subscription_status: 'active',
  last_login_at: faker.date.recent().toISOString(),
  preferences: {
    notifications_email: true,
    notifications_whatsapp: false,
    ai_suggestions: true,
    auto_publish: false
  },
  ...overrides
});

// Helper: Gerar nomes de negócios pet realísticos
const generateBusinessName = (): string => {
  const prefixes = ['Pet', 'Vet', 'Animal', 'Clínica', 'Hotel', 'Tosa', 'Banho'];
  const cores = ['Dourado', 'Azul', 'Verde', 'Premium', 'Real', 'Imperial'];
  const suffixes = ['Center', 'Care', 'House', 'Shop', 'Clínica', 'Veterinária', '& Tosa'];
  
  return `${faker.helpers.arrayElement(prefixes)} ${faker.helpers.arrayElement(cores)} ${faker.helpers.arrayElement(suffixes)}`;
};