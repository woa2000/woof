# 🧪 Estratégia de Testes - Plataforma Woof Marketing

Este documento define a estratégia, padrões e práticas de testes para garantir a qualidade e confiabilidade da Plataforma Woof Marketing.

## 📋 Índice

1. [Visão Geral da Estratégia](#-visão-geral-da-estratégia)
2. [Pirâmide de Testes](#-pirâmide-de-testes)
3. [Testes Unitários](#-testes-unitários)
4. [Testes de Integração](#-testes-de-integração)
5. [Testes End-to-End](#-testes-end-to-end)
6. [Testes de Performance](#-testes-de-performance)
7. [Testes de Segurança](#-testes-de-segurança)
8. [Testes de Acessibilidade](#-testes-de-acessibilidade)
9. [Coverage e Métricas](#-coverage-e-métricas)
10. [CI/CD Testing](#-cicd-testing)

---

## 🎯 Visão Geral da Estratégia

### Objetivos dos Testes

1. **Qualidade**: Garantir que o código funciona conforme especificado
2. **Regressão**: Prevenir que mudanças quebrem funcionalidades existentes
3. **Confiança**: Permitir deploys seguros e frequentes
4. **Documentação**: Servir como documentação viva do comportamento esperado
5. **Performance**: Garantir que a aplicação atende aos requisitos de performance

### Princípios de Teste

- **Test-Driven Development (TDD)**: Escrever testes antes do código quando possível
- **Fail Fast**: Testes devem falhar rapidamente e com mensagens claras
- **Isolamento**: Cada teste deve ser independente e não afetar outros
- **Simplicidade**: Testes simples e focados em uma única responsabilidade
- **Manutenibilidade**: Testes fáceis de entender e manter

---

## 🏗️ Pirâmide de Testes

```
                    E2E Tests (10%)
               ┌─────────────────────────┐
               │  • User journeys        │
               │  • Integration flows    │
               │  • Browser testing      │
               └─────────────────────────┘
          Integration Tests (20%)
     ┌─────────────────────────────────────┐
     │  • API endpoints                    │
     │  • Database interactions            │
     │  • External service mocks           │
     └─────────────────────────────────────┘
        Unit Tests (70%)
┌───────────────────────────────────────────────┐
│  • Component testing                          │
│  • Function testing                           │
│  • Hook testing                               │
│  • Utility testing                            │
└───────────────────────────────────────────────┘
```

### Distribuição de Testes

| Tipo | Percentual | Características | Ferramentas |
|------|------------|-----------------|-------------|
| **Unitários** | 70% | Rápidos, isolados, focados | Jest, Testing Library |
| **Integração** | 20% | Moderados, testam conexões | Jest, Supertest, MSW |
| **E2E** | 10% | Lentos, testam fluxos completos | Playwright, Cypress |

---

## 🔬 Testes Unitários

### Setup e Configuração

```typescript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/src/test/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)'
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/test/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

```typescript
// src/test/jest.setup.ts
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock do Supabase
jest.mock('@/lib/auth/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

// Mock do Next.js Router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}));
```

### Testes de Componentes

```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });
  
  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state correctly', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Button</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

### Testes de Hooks

```typescript
// src/hooks/__tests__/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { supabase } from '@/lib/auth/supabase';

// Mock do Supabase
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });
  
  it('handles login successfully', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: { user: mockUser } },
      error: null,
    });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });
  
  it('handles login error correctly', async () => {
    const mockError = new Error('Invalid credentials');
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    });
    
    const { result } = renderHook(() => useAuth());
    
    await expect(
      act(async () => {
        await result.current.login('wrong@example.com', 'wrongpassword');
      })
    ).rejects.toThrow('Invalid credentials');
  });
});
```

### Testes de Utilitários

```typescript
// src/lib/utils/__tests__/formatters.test.ts
import { formatCurrency, formatDate, sanitizeHTML } from '../formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('formats Brazilian currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(0)).toBe('R$ 0,00');
      expect(formatCurrency(1000)).toBe('R$ 1.000,00');
    });
    
    it('handles negative values', () => {
      expect(formatCurrency(-100)).toBe('-R$ 100,00');
    });
  });
  
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2025-08-17T10:30:00Z');
      expect(formatDate(date)).toBe('17/08/2025');
    });
    
    it('handles invalid dates', () => {
      expect(formatDate(new Date('invalid'))).toBe('Data inválida');
    });
  });
  
  describe('sanitizeHTML', () => {
    it('removes dangerous scripts', () => {
      const input = '<p>Safe content</p><script>alert("hack")</script>';
      const output = sanitizeHTML(input);
      expect(output).toBe('<p>Safe content</p>');
    });
    
    it('preserves safe HTML tags', () => {
      const input = '<p><strong>Bold</strong> and <em>italic</em> text</p>';
      const output = sanitizeHTML(input);
      expect(output).toBe(input);
    });
  });
});
```

---

## 🔌 Testes de Integração

### Setup de Testes de Integração

```typescript
// src/test/integration/setup.ts
import { createClient } from '@supabase/supabase-js';

// Cliente de teste do Supabase
export const testSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper para limpar dados de teste
export async function cleanupTestData() {
  // Limpar dados de teste após cada teste
  await testSupabase.from('brand_manuals').delete().ilike('title', 'TEST_%');
  await testSupabase.from('anamneses_digitais').delete().ilike('site_url', 'test-%');
}

// Helper para criar usuário de teste
export async function createTestUser() {
  const testEmail = `test-${Date.now()}@example.com`;
  
  const { data: authData, error: authError } = await testSupabase.auth.admin.createUser({
    email: testEmail,
    password: 'testpass123',
    email_confirm: true,
  });
  
  if (authError) throw authError;
  
  return authData.user;
}
```

### Testes de API Routes

```typescript
// src/app/api/brand-manuals/__tests__/route.test.ts
import { POST, GET } from '../route';
import { NextRequest } from 'next/server';
import { testSupabase, createTestUser, cleanupTestData } from '@/test/integration/setup';

describe('/api/brand-manuals', () => {
  let testUser: any;
  
  beforeEach(async () => {
    testUser = await createTestUser();
  });
  
  afterEach(async () => {
    await cleanupTestData();
  });
  
  describe('POST', () => {
    it('creates a brand manual successfully', async () => {
      const requestData = {
        title: 'TEST_Manual de Marca',
        description: 'Descrição do manual de teste',
      };
      
      const request = new NextRequest('http://localhost:3000/api/brand-manuals', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${testUser.access_token}`,
        },
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.title).toBe('TEST_Manual de Marca');
      expect(data.user_id).toBe(testUser.id);
    });
    
    it('validates required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/brand-manuals', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${testUser.access_token}`,
        },
      });
      
      const response = await POST(request);
      
      expect(response.status).toBe(400);
    });
    
    it('requires authentication', async () => {
      const request = new NextRequest('http://localhost:3000/api/brand-manuals', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test' }),
        headers: { 'content-type': 'application/json' },
      });
      
      const response = await POST(request);
      
      expect(response.status).toBe(401);
    });
  });
});
```

### Testes com MSW (Mock Service Worker)

```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // Mock da API OpenAI
  rest.post('https://api.openai.com/v1/chat/completions', (req, res, ctx) => {
    return res(
      ctx.json({
        choices: [{
          message: {
            content: JSON.stringify({
              analysis: 'Mock analysis result',
              recommendations: ['Recommendation 1', 'Recommendation 2'],
            }),
          },
        }],
      })
    );
  }),
  
  // Mock de análise de website
  rest.post('/api/analyze-website', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          title: 'Test Website',
          description: 'Test description',
          analysis: 'Mock website analysis',
        },
      })
    );
  }),
];

// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

---

## 🌐 Testes End-to-End

### Setup do Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Testes E2E de Autenticação

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can sign up, login and access dashboard', async ({ page }) => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';
    
    // 1. Cadastro
    await page.goto('/cadastro');
    await page.fill('[data-testid=email-input]', testEmail);
    await page.fill('[data-testid=password-input]', testPassword);
    await page.fill('[data-testid=name-input]', 'Usuário Teste');
    await page.click('[data-testid=signup-button]');
    
    // Aguardar redirecionamento para verificação de email
    await expect(page).toHaveURL(/\/verificar-email/);
    
    // 2. Login (simulando email verificado)
    await page.goto('/login');
    await page.fill('[data-testid=email-input]', testEmail);
    await page.fill('[data-testid=password-input]', testPassword);
    await page.click('[data-testid=login-button]');
    
    // 3. Verificar acesso ao dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // 4. Verificar elementos do dashboard
    await expect(page.locator('[data-testid=user-profile]')).toBeVisible();
    await expect(page.locator('[data-testid=navigation-menu]')).toBeVisible();
  });
  
  test('shows error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid=email-input]', 'invalid@example.com');
    await page.fill('[data-testid=password-input]', 'wrongpassword');
    await page.click('[data-testid=login-button]');
    
    await expect(page.locator('[data-testid=error-message]')).toContainText('Credenciais inválidas');
  });
  
  test('user can logout', async ({ page }) => {
    // Login primeiro (usando helper)
    await loginAsTestUser(page);
    
    // Logout
    await page.click('[data-testid=user-menu]');
    await page.click('[data-testid=logout-button]');
    
    // Verificar redirecionamento
    await expect(page).toHaveURL('/');
    
    // Verificar que não consegue acessar dashboard sem login
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });
});

// Helper function
async function loginAsTestUser(page: Page) {
  await page.goto('/login');
  await page.fill('[data-testid=email-input]', 'test@example.com');
  await page.fill('[data-testid=password-input]', 'password123');
  await page.click('[data-testid=login-button]');
  await page.waitForURL('/dashboard');
}
```

### Testes E2E de Funcionalidades

```typescript
// e2e/brand-manual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Brand Manual Creation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
  });
  
  test('user can create a brand manual', async ({ page }) => {
    // Navegar para criação de manual
    await page.goto('/dashboard/manual-marca/novo');
    
    // Preencher formulário
    await page.fill('[data-testid=manual-title]', 'Manual de Teste E2E');
    await page.fill('[data-testid=manual-description]', 'Descrição do manual criado via E2E');
    
    // Upload de logo
    await page.setInputFiles('[data-testid=logo-upload]', './e2e/fixtures/test-logo.png');
    
    // Aguardar preview do logo
    await expect(page.locator('[data-testid=logo-preview]')).toBeVisible();
    
    // Criar manual
    await page.click('[data-testid=create-manual-button]');
    
    // Verificar sucesso
    await expect(page.locator('[data-testid=success-toast]')).toContainText('Manual criado com sucesso');
    
    // Verificar redirecionamento para visualização
    await expect(page).toHaveURL(/\/manual-marca\/[a-z0-9-]+$/);
    
    // Verificar conteúdo do manual
    await expect(page.locator('h1')).toContainText('Manual de Teste E2E');
    
    // Verificar capítulos gerados
    await expect(page.locator('[data-testid=chapter-list]')).toBeVisible();
    await expect(page.locator('[data-testid=chapter-1]')).toContainText('Visão & Essência');
  });
  
  test('validates required fields in brand manual creation', async ({ page }) => {
    await page.goto('/dashboard/manual-marca/novo');
    
    // Tentar criar sem preencher campos obrigatórios
    await page.click('[data-testid=create-manual-button]');
    
    // Verificar mensagens de erro
    await expect(page.locator('[data-testid=title-error]')).toContainText('Título é obrigatório');
    
    // Verificar que o formulário não foi enviado
    await expect(page).toHaveURL('/dashboard/manual-marca/novo');
  });
  
  test('user can edit brand manual chapters', async ({ page }) => {
    // Assumir que já existe um manual (criado em teste anterior ou fixture)
    await page.goto('/dashboard/manual-marca');
    
    // Clicar no primeiro manual
    await page.click('[data-testid=manual-card]:first-child');
    
    // Entrar no modo de edição
    await page.click('[data-testid=edit-manual-button]');
    
    // Editar capítulo 1
    await page.click('[data-testid=chapter-1]');
    
    // Verificar editor está visível
    await expect(page.locator('[data-testid=chapter-editor]')).toBeVisible();
    
    // Editar conteúdo
    await page.fill('[data-testid=vision-input]', 'Nova visão editada via E2E');
    await page.fill('[data-testid=mission-input]', 'Nova missão editada via E2E');
    
    // Salvar mudanças
    await page.click('[data-testid=save-chapter-button]');
    
    // Verificar toast de sucesso
    await expect(page.locator('[data-testid=success-toast]')).toContainText('Capítulo salvo');
    
    // Verificar que as mudanças foram salvas
    await page.reload();
    await expect(page.locator('[data-testid=vision-display]')).toContainText('Nova visão editada via E2E');
  });
});
```

---

## ⚡ Testes de Performance

### Testes de Load com Artillery

```yaml
# artillery/load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 10
  processor: "./test-functions.js"

scenarios:
  - name: "Homepage Load Test"
    weight: 30
    flow:
      - get:
          url: "/"
          
  - name: "Dashboard Load Test"
    weight: 40
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ $randomEmail }}"
            password: "testpass123"
          capture:
            - json: "$.token"
              as: "authToken"
      - get:
          url: "/dashboard"
          headers:
            Authorization: "Bearer {{ authToken }}"
            
  - name: "Brand Manual Creation"
    weight: 30
    flow:
      - post:
          url: "/api/brand-manuals"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            title: "Load Test Manual {{ $randomString }}"
            description: "Created during load testing"
```

### Testes de Performance com Lighthouse

```typescript
// src/test/performance/lighthouse.test.ts
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

describe('Lighthouse Performance Tests', () => {
  let chrome: any;
  
  beforeAll(async () => {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  });
  
  afterAll(async () => {
    await chrome.kill();
  });
  
  it('homepage meets performance thresholds', async () => {
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port,
    };
    
    const runnerResult = await lighthouse('http://localhost:3000', options);
    const { lhr } = runnerResult;
    
    // Verificar Core Web Vitals
    expect(lhr.audits['largest-contentful-paint'].numericValue).toBeLessThan(2500); // 2.5s
    expect(lhr.audits['cumulative-layout-shift'].numericValue).toBeLessThan(0.1);
    expect(lhr.audits['first-input-delay'].numericValue).toBeLessThan(100);
    
    // Score geral de performance
    expect(lhr.categories.performance.score * 100).toBeGreaterThanOrEqual(85);
  });
  
  it('dashboard meets performance thresholds', async () => {
    // Similar test for dashboard page
    // Need to handle authentication for protected routes
  });
});
```

---

## 🔒 Testes de Segurança

### Testes de Segurança Automatizados

```typescript
// src/test/security/security.test.ts
import { testSupabase, createTestUser } from '@/test/integration/setup';

describe('Security Tests', () => {
  describe('SQL Injection Protection', () => {
    it('prevents SQL injection in search queries', async () => {
      const maliciousInput = "'; DROP TABLE brand_manuals; --";
      
      const { error } = await testSupabase
        .from('brand_manuals')
        .select('*')
        .ilike('title', maliciousInput);
      
      // Should not cause error, just return empty results
      expect(error).toBeNull();
      
      // Verify table still exists
      const { data: tables } = await testSupabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'brand_manuals');
        
      expect(tables).toHaveLength(1);
    });
  });
  
  describe('Authentication', () => {
    it('requires authentication for protected endpoints', async () => {
      const response = await fetch('http://localhost:3000/api/brand-manuals', {
        method: 'GET',
      });
      
      expect(response.status).toBe(401);
    });
    
    it('validates JWT tokens correctly', async () => {
      const invalidToken = 'invalid.jwt.token';
      
      const response = await fetch('http://localhost:3000/api/brand-manuals', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${invalidToken}`,
        },
      });
      
      expect(response.status).toBe(401);
    });
  });
  
  describe('Data Access Control', () => {
    it('users can only access their own data', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      
      // Create brand manual for user1
      const { data: manual } = await testSupabase
        .from('brand_manuals')
        .insert({
          title: 'User 1 Manual',
          user_id: user1.id,
        })
        .select()
        .single();
      
      // Try to access user1's manual as user2
      // This should fail due to RLS policies
      const response = await fetch(`http://localhost:3000/api/brand-manuals/${manual.id}`, {
        headers: {
          'Authorization': `Bearer ${user2.access_token}`,
        },
      });
      
      expect(response.status).toBe(403);
    });
  });
  
  describe('Input Validation', () => {
    it('sanitizes HTML input', async () => {
      const maliciousHTML = '<script>alert("XSS")</script><p>Safe content</p>';
      
      const user = await createTestUser();
      const response = await fetch('http://localhost:3000/api/brand-manuals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          title: maliciousHTML,
          description: maliciousHTML,
        }),
      });
      
      const data = await response.json();
      
      // Should remove script tags but keep safe content
      expect(data.title).toBe('<p>Safe content</p>');
      expect(data.title).not.toContain('<script>');
    });
  });
});
```

---

## ♿ Testes de Acessibilidade

### Testes com axe-core

```typescript
// src/test/accessibility/a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/ui/Button';
import { LoginForm } from '@/components/auth/LoginForm';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('Button component has no accessibility violations', async () => {
    const { container } = render(<Button>Test Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('LoginForm has proper accessibility attributes', async () => {
    const { container } = render(<LoginForm />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    
    // Additional specific checks
    const emailInput = container.querySelector('input[type="email"]');
    expect(emailInput).toHaveAttribute('aria-label');
    expect(emailInput).toHaveAttribute('aria-describedby');
  });
  
  it('Dashboard layout maintains accessibility', async () => {
    const { container } = render(
      <DashboardLayout>
        <div>Dashboard Content</div>
      </DashboardLayout>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    
    // Check semantic structure
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('nav')).toBeInTheDocument();
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
```

### Testes E2E de Acessibilidade

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage is accessible', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('dashboard is accessible', async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/dashboard');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('.third-party-widget') // Excluir widgets de terceiros
      .analyze();
      
    expect(accessibilityScanResults.violations).toEqual([]);
  });
  
  test('keyboard navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveAttribute('role', 'button');
    
    // Test skip links
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    if (await skipLink.isVisible()) {
      await skipLink.press('Enter');
      await expect(page.locator('#main-content')).toBeFocused();
    }
  });
  
  test('screen reader announcements work', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test loading states have proper announcements
    await page.click('[data-testid=create-manual-button]');
    
    const loadingAnnouncement = page.locator('[aria-live="polite"]');
    await expect(loadingAnnouncement).toContainText('Carregando');
    
    // Test success announcements
    await page.fill('[data-testid=manual-title]', 'Test Manual');
    await page.click('[data-testid=submit-button]');
    
    await expect(loadingAnnouncement).toContainText('Manual criado com sucesso');
  });
});
```

---

## 📊 Coverage e Métricas

### Configuração de Coverage

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --coverage --ci --watchAll=false"
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/*.stories.{ts,tsx}",
      "!src/test/**/*"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      },
      "src/components/": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "src/hooks/": {
        "branches": 85,
        "functions": 85,
        "lines": 85,
        "statements": 85
      }
    }
  }
}
```

### Relatórios de Teste

```typescript
// src/test/utils/test-reporter.ts
export class TestReporter {
  static generateReport(results: any) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: results.numTotalTests,
        passedTests: results.numPassedTests,
        failedTests: results.numFailedTests,
        coverage: results.coverageMap?.getCoverageSummary(),
      },
      performance: {
        averageTestTime: this.calculateAverageTestTime(results),
        slowestTests: this.findSlowestTests(results, 5),
      },
      failures: this.extractFailures(results),
    };
    
    return report;
  }
  
  private static calculateAverageTestTime(results: any): number {
    const totalTime = results.testResults.reduce(
      (sum: number, result: any) => sum + (result.perfStats?.end - result.perfStats?.start),
      0
    );
    return totalTime / results.testResults.length;
  }
  
  private static findSlowestTests(results: any, limit: number) {
    return results.testResults
      .map((result: any) => ({
        testPath: result.testFilePath,
        duration: result.perfStats?.end - result.perfStats?.start,
      }))
      .sort((a: any, b: any) => b.duration - a.duration)
      .slice(0, limit);
  }
  
  private static extractFailures(results: any) {
    return results.testResults
      .filter((result: any) => result.numFailingTests > 0)
      .map((result: any) => ({
        testPath: result.testFilePath,
        failures: result.testResults
          .filter((test: any) => test.status === 'failed')
          .map((test: any) => ({
            title: test.title,
            error: test.failureMessages[0],
          })),
      }));
  }
}
```

---

## 🚀 CI/CD Testing

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:ci
      env:
        NODE_ENV: test
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
        file: ./coverage/lcov.info
  
  integration-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
        NODE_ENV: test
  
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Build application
      run: npm run build
    
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        NODE_ENV: test
    
    - name: Upload Playwright report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
  
  security-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run security audit
      run: npm audit --audit-level high
    
    - name: Run SAST scan
      uses: github/super-linter@v4
      env:
        DEFAULT_BRANCH: main
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        VALIDATE_TYPESCRIPT_ES: true
        VALIDATE_JAVASCRIPT_ES: true
```

### Quality Gates

```typescript
// src/test/quality-gates.ts
export interface QualityGate {
  name: string;
  threshold: number;
  current: number;
  passed: boolean;
}

export function checkQualityGates(testResults: any): QualityGate[] {
  const gates: QualityGate[] = [
    {
      name: 'Code Coverage',
      threshold: 70,
      current: testResults.coverage?.global?.lines || 0,
      passed: (testResults.coverage?.global?.lines || 0) >= 70,
    },
    {
      name: 'Test Pass Rate',
      threshold: 95,
      current: (testResults.numPassedTests / testResults.numTotalTests) * 100,
      passed: (testResults.numPassedTests / testResults.numTotalTests) * 100 >= 95,
    },
    {
      name: 'Performance Score',
      threshold: 85,
      current: testResults.lighthouse?.performance || 0,
      passed: (testResults.lighthouse?.performance || 0) >= 85,
    },
    {
      name: 'Accessibility Score',
      threshold: 95,
      current: testResults.axe?.score || 0,
      passed: (testResults.axe?.score || 0) >= 95,
    },
  ];
  
  return gates;
}

export function shouldBlockDeployment(gates: QualityGate[]): boolean {
  return gates.some(gate => !gate.passed);
}
```

---

## 📋 Checklist de Testes

### Para Cada Feature

- [ ] Testes unitários para componentes
- [ ] Testes unitários para hooks
- [ ] Testes unitários para utilitários
- [ ] Testes de integração para APIs
- [ ] Testes E2E para fluxo principal
- [ ] Testes de acessibilidade
- [ ] Coverage mínimo atingido
- [ ] Testes de performance (se aplicável)

### Para Cada PR

- [ ] Todos os testes passando
- [ ] Coverage não diminuiu
- [ ] Testes E2E críticos passando
- [ ] Sem violações de acessibilidade
- [ ] Performance dentro dos limites
- [ ] Testes de segurança passando
- [ ] Quality gates aprovados

### Para Cada Release

- [ ] Suite completa de testes executada
- [ ] Testes de regressão passando
- [ ] Testes de stress executados
- [ ] Testes de segurança completos
- [ ] Validação em múltiplos browsers
- [ ] Testes em ambiente de staging
- [ ] Métricas de qualidade validadas

---

**Última atualização:** 17 de agosto de 2025  
**Versão:** 2.0  
**Status:** ✅ Completo
