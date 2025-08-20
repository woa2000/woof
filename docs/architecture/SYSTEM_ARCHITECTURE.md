# 🏗️ Arquitetura do Sistema - Plataforma Woof Marketing

Este documento descreve a arquitetura técnica da Plataforma Woof Marketing, incluindo componentes, fluxos de dados e decisões arquiteturais.

## 📋 Índice

1. [Visão Geral da Arquitetura](#-visão-geral-da-arquitetura)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Arquitetura Frontend](#-arquitetura-frontend)
4. [Arquitetura Backend](#-arquitetura-backend)
5. [Fluxo de Dados](#-fluxo-de-dados)
6. [Segurança](#-segurança)
7. [Performance](#-performance)
8. [Escalabilidade](#-escalabilidade)
9. [Monitoramento](#-monitoramento)

---

## 🎯 Visão Geral da Arquitetura

A Plataforma Woof Marketing segue uma arquitetura moderna **JAMstack** com foco em performance, segurança e escalabilidade.

### Arquitetura de Alto Nível

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Client   │    │   Vercel Edge   │    │   Supabase      │
│   (Next.js)     │◄──►│   Network       │◄──►│   Platform      │
│                 │    │                 │    │                 │
│ • React UI      │    │ • CDN           │    │ • PostgreSQL    │
│ • TypeScript    │    │ • Edge Runtime  │    │ • Auth          │
│ • TailwindCSS   │    │ • Functions     │    │ • Storage       │
│ • React Query   │    │ • Analytics     │    │ • Realtime      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   AI Services   │    │   Third-party   │
│   Integrations  │    │                 │    │   Services      │
│                 │    │ • OpenAI GPT-4  │    │                 │
│ • Google Auth   │    │ • AI Analysis   │    │ • Email Service │
│ • Facebook Auth │    │ • Content Gen   │    │ • Analytics     │
│ • Social APIs   │    │ • Image AI      │    │ • Monitoring    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Princípios Arquiteturais

1. **Server-Side First**: Páginas públicas renderizadas no servidor para SEO
2. **Client-Side Hydration**: Dashboard como SPA para interatividade
3. **Edge Computing**: Processamento próximo ao usuário via Vercel Edge
4. **Database-First**: Supabase como single source of truth
5. **Real-time Updates**: WebSocket para atualizações em tempo real
6. **Mobile-First**: Design responsivo priorizando mobile

---

## 🚀 Stack Tecnológico

### Frontend Stack
```typescript
// Core Framework
Next.js 15          // React framework with App Router
TypeScript          // Type safety
React 18           // UI library with concurrent features

// Styling & UI
TailwindCSS        // Utility-first CSS framework
Lucide React       // Icon library
Custom Components  // Reusable UI components

// State Management
React Query        // Server state management
React Context      // Client state management
Zustand           // Global state (if needed)

// Forms & Validation
React Hook Form    // Form management
Zod               // Schema validation

// Development
ESLint + Prettier  // Code quality
Jest + Testing Lib // Testing framework
Husky             // Git hooks
```

### Backend Stack
```yaml
# Database & Backend
Supabase:
  - PostgreSQL (Database)
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication
  - Storage for files
  
# Hosting & CDN
Vercel:
  - Edge Network
  - Serverless Functions
  - Analytics
  - Domain management
  
# External Services
OpenAI: AI analysis and content generation
Google/Facebook: OAuth authentication
Email Service: Transactional emails
Monitoring: Error tracking and analytics
```

---

## 🎨 Arquitetura Frontend

### App Router Structure

```
src/app/
├── layout.tsx                 # Root layout
├── page.tsx                   # Landing page
├── globals.css                # Global styles
│
├── (auth)/                    # Auth group
│   ├── login/
│   │   └── page.tsx          # Login page
│   └── cadastro/
│       └── page.tsx          # Register page
│
├── (dashboard)/               # Protected routes group
│   ├── layout.tsx            # Dashboard layout
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard
│   ├── anamnese-digital/
│   │   ├── page.tsx          # Anamnese list
│   │   ├── [id]/
│   │   │   └── page.tsx      # Anamnese details
│   │   └── nova/
│   │       └── page.tsx      # Create anamnese
│   ├── manual-marca/
│   │   ├── page.tsx          # Manual list
│   │   ├── [id]/
│   │   │   ├── page.tsx      # Manual viewer
│   │   │   └── editor/
│   │   │       └── page.tsx  # Manual editor
│   │   └── novo/
│   │       └── page.tsx      # Create manual
│   └── configuracoes/
│       └── page.tsx          # Settings
│
├── auth/
│   └── callback/
│       └── route.ts          # Auth callback
│
└── api/                      # API routes
    ├── auth/
    ├── anamnese/
    └── manual-marca/
```

### Component Architecture

```
src/components/
├── ui/                       # Base components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx
│   └── index.ts             # Re-exports
│
├── layout/                   # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   └── DashboardLayout.tsx
│
├── auth/                     # Auth components
│   ├── LoginForm.tsx
│   ├── AuthRedirect.tsx
│   └── ProtectedRoute.tsx
│
├── brand-manual/             # Brand manual features
│   ├── BrandManualEditor.tsx
│   ├── BrandManualViewer.tsx
│   ├── ChapterSelector.tsx
│   └── AssetUploader.tsx
│
└── anamnese/                 # Anamnese features
    ├── AnamneseForm.tsx
    ├── AnamneseResults.tsx
    ├── AnalysisLoading.tsx
    └── PersonaCard.tsx
```

### State Management Strategy

```typescript
// 1. Server State (React Query)
export function useBrandManuals() {
  return useQuery({
    queryKey: ['brand-manuals'],
    queryFn: brandManualService.list,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// 2. Auth State (Context)
export const AuthContext = createContext<AuthContextType>();

// 3. UI State (Component state or Zustand for global)
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
}));

// 4. Form State (React Hook Form)
export function useLoginForm() {
  return useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
}
```

---

## 🗄️ Arquitetura Backend

### Supabase Database Schema

```sql
-- Users table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email VARCHAR NOT NULL,
  full_name VARCHAR,
  avatar_url VARCHAR,
  business_name VARCHAR,
  business_type VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand Manuals
CREATE TABLE public.brand_manuals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  logo_url VARCHAR,
  status VARCHAR DEFAULT 'draft',
  chapters JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anamneses Digitais
CREATE TABLE public.anamneses_digitais (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  site_url VARCHAR NOT NULL,
  analysis_data JSONB NOT NULL,
  personas JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  status VARCHAR DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets Storage
CREATE TABLE public.brand_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_manual_id UUID REFERENCES public.brand_manuals(id) NOT NULL,
  file_name VARCHAR NOT NULL,
  file_url VARCHAR NOT NULL,
  file_type VARCHAR NOT NULL,
  file_size INTEGER,
  chapter_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Brand Manuals RLS
ALTER TABLE public.brand_manuals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own brand manuals" 
ON public.brand_manuals FOR ALL 
USING (auth.uid() = user_id);

-- Anamneses RLS
ALTER TABLE public.anamneses_digitais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own anamneses" 
ON public.anamneses_digitais FOR ALL 
USING (auth.uid() = user_id);
```

### Supabase Edge Functions

```typescript
// Edge Function: analyze-website
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { OpenAI } from 'https://esm.sh/openai@4.0.0';

serve(async (req) => {
  const { url, analysisType } = await req.json();
  
  // Fetch website content
  const websiteContent = await fetchWebsiteContent(url);
  
  // Analyze with OpenAI
  const analysis = await analyzeWithAI(websiteContent, analysisType);
  
  return new Response(JSON.stringify(analysis), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## 🔄 Fluxo de Dados

### Authentication Flow

```
User Action → Supabase Auth → JWT Token → Client State
     ↓              ↓              ↓           ↓
  Login Form → signInWithPassword → Session → useAuth Hook
     ↓              ↓              ↓           ↓
  Dashboard ← Authorization ← Middleware ← Protected Route
```

### Data Fetching Flow

```typescript
// 1. Component Mount
useEffect(() => {
  // React Query automatically handles:
  // - Cache checking
  // - Background refetching
  // - Loading states
  // - Error handling
}, []);

// 2. Query Execution
const { data, isLoading, error } = useQuery({
  queryKey: ['brand-manual', id],
  queryFn: () => supabase
    .from('brand_manuals')
    .select('*')
    .eq('id', id)
    .single(),
});

// 3. Real-time Updates
useEffect(() => {
  const subscription = supabase
    .channel('brand_manual_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'brand_manuals' },
      (payload) => {
        queryClient.invalidateQueries(['brand-manuals']);
      }
    )
    .subscribe();
    
  return () => subscription.unsubscribe();
}, []);
```

### Mutation Flow

```typescript
// Optimistic Updates Pattern
const updateBrandManual = useMutation({
  mutationFn: async (data) => {
    const { error } = await supabase
      .from('brand_manuals')
      .update(data)
      .eq('id', data.id);
    
    if (error) throw error;
  },
  
  // Optimistic update
  onMutate: async (newData) => {
    await queryClient.cancelQueries(['brand-manual', newData.id]);
    
    const previous = queryClient.getQueryData(['brand-manual', newData.id]);
    queryClient.setQueryData(['brand-manual', newData.id], newData);
    
    return { previous };
  },
  
  // Rollback on error
  onError: (err, newData, context) => {
    queryClient.setQueryData(
      ['brand-manual', newData.id], 
      context.previous
    );
  },
  
  // Always refetch
  onSettled: (data, error, newData) => {
    queryClient.invalidateQueries(['brand-manual', newData.id]);
  },
});
```

---

## 🔒 Segurança

### Authentication & Authorization

```typescript
// 1. JWT Token Validation
export async function validateToken(token: string) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return user;
  } catch (error) {
    throw new AuthError('Token inválido');
  }
}

// 2. Route Protection
export default function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <Spinner />;
  if (!user) redirect('/login');
  
  return <>{children}</>;
}

// 3. API Route Protection
export async function GET(request: Request) {
  const supabase = createServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Continue with protected logic...
}
```

### Data Security

```sql
-- Row Level Security Examples
CREATE POLICY "Users can only see own data" 
ON brand_manuals FOR SELECT 
USING (auth.uid() = user_id);

-- Secure functions
CREATE OR REPLACE FUNCTION public.get_user_stats(target_user_id UUID)
RETURNS JSON
SECURITY DEFINER
AS $$
BEGIN
  -- Check if requesting user owns the data
  IF auth.uid() != target_user_id THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Return stats...
END;
$$ LANGUAGE plpgsql;
```

### Input Validation & Sanitization

```typescript
// Zod Schema Validation
export const brandManualSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(100),
  description: z.string().max(500).optional(),
  logoFile: z
    .instanceof(File)
    .refine(file => file.size <= 5000000, 'Arquivo deve ter menos que 5MB')
    .refine(file => 
      ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type),
      'Formato deve ser JPG, PNG ou SVG'
    ),
});

// Usage in forms
export function CreateBrandManualForm() {
  const form = useForm<BrandManualFormData>({
    resolver: zodResolver(brandManualSchema),
  });
  
  // Form handles validation automatically
}
```

---

## ⚡ Performance

### Bundle Optimization

```typescript
// next.config.ts
const nextConfig = {
  // Tree shaking
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@supabase/auth-ui-react',
    ],
  },
  
  // Image optimization
  images: {
    domains: ['supabase.co'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
  },
  
  // Compression
  compress: true,
  
  // PWA features
  experimental: {
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true,
    },
  },
};
```

### React Optimizations

```typescript
// 1. Component memoization
export const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => 
    heavyCalculation(data), [data]
  );
  
  return <div>{processedData}</div>;
});

// 2. Callback stability
export function UserList({ users, onUserClick }) {
  const handleClick = useCallback((user) => {
    onUserClick(user);
  }, [onUserClick]);
  
  return (
    <>
      {users.map(user => 
        <UserCard 
          key={user.id} 
          user={user} 
          onClick={handleClick} 
        />
      )}
    </>
  );
}

// 3. Lazy loading
const BrandManualEditor = lazy(() => 
  import('@/components/BrandManualEditor')
);

export function BrandManualPage() {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <BrandManualEditor />
    </Suspense>
  );
}
```

### Database Performance

```sql
-- Indexes for common queries
CREATE INDEX idx_brand_manuals_user_id ON brand_manuals(user_id);
CREATE INDEX idx_brand_manuals_status ON brand_manuals(status);
CREATE INDEX idx_anamneses_user_created ON anamneses_digitais(user_id, created_at DESC);

-- Optimized queries
SELECT bm.*, COUNT(ba.id) as asset_count
FROM brand_manuals bm
LEFT JOIN brand_assets ba ON ba.brand_manual_id = bm.id
WHERE bm.user_id = $1
GROUP BY bm.id
ORDER BY bm.updated_at DESC
LIMIT 20;
```

---

## 📈 Escalabilidade

### Horizontal Scaling Strategy

```typescript
// 1. Database scaling via Supabase
// - Read replicas for queries
// - Connection pooling
// - Automatic backups

// 2. CDN scaling via Vercel
// - Global edge network
// - Automatic image optimization
// - Edge functions for API routes

// 3. Client-side scaling
// - Progressive loading
// - Virtual scrolling for large lists
// - Pagination for data sets

export function useInfiniteLeads() {
  return useInfiniteQuery({
    queryKey: ['leads'],
    queryFn: ({ pageParam = 0 }) => 
      leadService.list({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => 
      lastPage.hasNext ? lastPage.nextPage : undefined,
  });
}
```

### Caching Strategy

```typescript
// 1. Browser caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutes
      cacheTime: 10 * 60 * 1000,    // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => 
        Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// 2. Supabase caching
const { data } = await supabase
  .from('brand_manuals')
  .select('*')
  .eq('user_id', userId)
  .cache(300); // 5 minutes

// 3. Static generation for public pages
export async function generateStaticParams() {
  return [
    { slug: 'features' },
    { slug: 'pricing' },
    { slug: 'about' },
  ];
}
```

---

## 📊 Monitoramento

### Error Tracking

```typescript
// Error boundary for React components
export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    console.error('Component error:', error, errorInfo);
    
    // Send to external service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // trackError(error, errorInfo);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Track error
});
```

### Performance Monitoring

```typescript
// Web Vitals tracking
export function reportWebVitals(metric: Metric) {
  switch (metric.name) {
    case 'CLS':
    case 'FID':
    case 'FCP':
    case 'LCP':
    case 'TTFB':
      // Send to analytics
      console.log(metric);
      break;
    default:
      break;
  }
}

// Custom performance tracking
export function trackPageLoad(page: string) {
  const startTime = performance.now();
  
  return () => {
    const loadTime = performance.now() - startTime;
    console.log(`${page} loaded in ${loadTime}ms`);
    // Send to analytics
  };
}
```

### Business Metrics

```typescript
// Track user actions
export function trackEvent(event: string, properties?: Record<string, any>) {
  // Analytics implementation
  console.log('Event:', event, properties);
  
  // Example: Track brand manual creation
  if (event === 'brand_manual_created') {
    // Send to analytics service
  }
}

// Usage in components
export function CreateBrandManualButton() {
  const handleClick = () => {
    trackEvent('brand_manual_create_started');
    // Open creation modal
  };
  
  return <Button onClick={handleClick}>Criar Manual</Button>;
}
```

---

## 🔧 Decisões Arquiteturais

### Por que Next.js 15?
- **App Router**: Melhor organização de rotas
- **Server Components**: Performance superior
- **Edge Runtime**: Menor latência
- **Built-in Optimizations**: Imagens, fonts, etc.

### Por que Supabase?
- **PostgreSQL**: Database robusto e escalável
- **Real-time**: WebSocket nativo
- **Auth**: Sistema completo de autenticação
- **RLS**: Segurança a nível de linha
- **Edge Functions**: Processamento próximo ao usuário

### Por que React Query?
- **Cache Management**: Cache inteligente automático
- **Optimistic Updates**: UX superior
- **Background Refetching**: Dados sempre atualizados
- **Error Handling**: Tratamento robusto de erros

### Por que TailwindCSS?
- **Utility-First**: Desenvolvimento rápido
- **Consistency**: Design system integrado
- **Tree-Shaking**: CSS otimizado
- **Mobile-First**: Responsividade nativa

---

## 📋 ADRs (Architecture Decision Records)

### ADR-001: Escolha do Framework Frontend
**Decisão**: Next.js 15 com App Router  
**Status**: Aceito  
**Data**: 2025-08-01  

**Contexto**: Precisávamos de um framework que oferecesse SSR para SEO, performance otimizada e boa DX.

**Decisão**: Escolhemos Next.js 15 por:
- App Router moderno e flexível
- Server Components para performance
- Built-in optimizations
- Ecosistema maduro

**Consequências**:
- ✅ Performance superior
- ✅ SEO otimizado
- ✅ Developer experience excelente
- ❌ Curva de aprendizado do App Router

### ADR-002: Backend como Serviço
**Decisão**: Supabase como BaaS  
**Status**: Aceito  
**Data**: 2025-08-01  

**Contexto**: Time pequeno, foco no produto, não na infraestrutura.

**Decisão**: Supabase oferece:
- PostgreSQL gerenciado
- Auth nativo
- Real-time built-in
- Edge functions
- Storage integrado

**Consequências**:
- ✅ Desenvolvimento acelerado
- ✅ Infraestrutura gerenciada
- ✅ Escalabilidade automática
- ❌ Vendor lock-in
- ❌ Menos controle sobre infra

---

**Última atualização:** 17 de agosto de 2025  
**Versão:** 2.0  
**Status:** ✅ Completo
