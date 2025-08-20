# 🛠️ Guia de Desenvolvimento - Plataforma Woof Marketing

Este documento define os padrões, guidelines e boas práticas para desenvolvimento na Plataforma Woof Marketing.

## 📋 Índice

1. [Stack Tecnológico](#-stack-tecnológico)
2. [Estrutura do Projeto](#-estrutura-do-projeto)
3. [Padrões de Código](#-padrões-de-código)
4. [Componentes](#-componentes)
5. [Hooks](#-hooks)
6. [APIs e Serviços](#-apis-e-serviços)
7. [Autenticação](#-autenticação)
8. [Testes](#-testes)
9. [Performance](#-performance)
10. [Acessibilidade](#-acessibilidade)

---

## 🚀 Stack Tecnológico

### Frontend Principal
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query + Context API
- **Forms**: React Hook Form + Zod
- **UI Components**: Custom components + Lucide React (ícones)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deploy**: Vercel

### Ferramentas de Desenvolvimento
- **Linting**: ESLint + Prettier
- **Package Manager**: npm/yarn
- **Git Hooks**: Husky (opcional)
- **Testing**: Jest + Testing Library

---

## 📁 Estrutura do Projeto

### Organização de Diretórios

```
src/
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # Grupo de rotas protegidas
│   ├── auth/                 # Autenticação
│   └── globals.css           # Estilos globais
├── components/               # Componentes reutilizáveis
│   ├── ui/                   # Componentes base (Button, Input, etc.)
│   ├── layout/               # Componentes de layout
│   ├── auth/                 # Componentes de autenticação
│   ├── brand-manual/         # Componentes do Manual da Marca
│   └── anamnese/             # Componentes da Anamnese Digital
├── hooks/                    # Custom hooks
│   ├── features/             # Hooks por funcionalidade
│   └── index.ts              # Re-exports
├── lib/                      # Bibliotecas e utilitários
│   ├── auth/                 # Autenticação
│   ├── types/                # Definições de tipos
│   ├── utils/                # Utilitários
│   └── constants.ts          # Constantes
├── types/                    # Tipos TypeScript globais
└── test/                     # Configuração de testes
    └── __mocks__/            # Mocks
```

### Convenções de Nomenclatura

#### Arquivos e Pastas
- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase com prefixo use (`useAuth.ts`)
- **Utilitários**: camelCase (`formatCurrency.ts`)
- **Tipos**: PascalCase (`UserProfile.types.ts`)
- **Pastas**: kebab-case (`brand-manual/`)

#### Variáveis e Funções
- **Variáveis**: camelCase (`userName`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Componentes**: PascalCase (`UserProfile`)
- **Interfaces/Types**: PascalCase (`UserProfile`)

---

## 💻 Padrões de Código

### TypeScript

#### Tipos e Interfaces
```typescript
// ✅ Prefira interfaces para objetos
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ Use types para unions, primitivos e computed types
type UserRole = 'admin' | 'user' | 'moderator';
type UserWithRole = User & { role: UserRole };

// ✅ Seja explícito com tipos de retorno de funções
function getUserById(id: string): Promise<User | null> {
  return api.get(`/users/${id}`);
}
```

#### Organização de Imports
```typescript
// ✅ Ordem dos imports
// 1. React e libs externas
import React from 'react';
import { NextPage } from 'next';
import { useQuery } from '@tanstack/react-query';

// 2. Imports internos (@ alias)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks';
import { User } from '@/types';

// 3. Imports relativos
import './styles.css';
```

### Componentes React

#### Estrutura de Componentes
```typescript
// ✅ Template padrão para componentes
import React from 'react';

// Types
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  className?: string;
}

// Component
export function UserCard({ user, onEdit, className }: UserCardProps) {
  // Hooks
  const { mutate: updateUser } = useUpdateUser();
  
  // Handlers
  const handleEdit = () => {
    onEdit?.(user);
  };
  
  // Render
  return (
    <div className={cn('p-4 border rounded-lg', className)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <Button onClick={handleEdit}>
          Editar
        </Button>
      )}
    </div>
  );
}

// Default export (opcional, prefira named exports)
export default UserCard;
```

#### Boas Práticas para Componentes

1. **Single Responsibility**: Um componente = uma responsabilidade
2. **Props Interface**: Sempre defina interface para props
3. **Default Props**: Use destructuring com valores padrão
4. **Conditional Rendering**: Use `&&` para condicionais simples
5. **Event Handlers**: Prefixe com `handle` (`handleClick`)
6. **Refs**: Use `useRef` para elementos DOM, `forwardRef` se necessário

### Hooks Customizados

#### Padrões para Hooks
```typescript
// ✅ Hook para data fetching
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
    enabled: !!userId,
  });
}

// ✅ Hook para state management
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

---

## 🎨 Componentes

### Sistema de Design

#### Componentes Base (ui/)
Todos os componentes base devem:
- Aceitar `className` prop para customização
- Usar `cn()` utility para merge de classes
- Suportar `ref` forwarding quando necessário
- Ter variantes bem definidas

```typescript
// ✅ Exemplo: Button component
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          // Variants
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
          },
          // Sizes
          {
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8': size === 'lg',
          },
          className
        )}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

### Componentes de Funcionalidade

#### Estrutura para Componentes Complexos
```typescript
// ✅ Exemplo: BrandManualEditor
export function BrandManualEditor() {
  // State management
  const [activeChapter, setActiveChapter] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  
  // Data fetching
  const { data: manual, isLoading } = useBrandManual();
  const { mutate: updateManual } = useUpdateBrandManual();
  
  // Handlers
  const handleChapterChange = useCallback((chapterId: number) => {
    setActiveChapter(chapterId);
  }, []);
  
  const handleSave = useCallback(async (data: BrandManualData) => {
    try {
      await updateManual(data);
      toast.success('Manual atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erro ao salvar o manual');
    }
  }, [updateManual]);
  
  // Loading state
  if (isLoading) {
    return <BrandManualSkeleton />;
  }
  
  // Render
  return (
    <div className="flex h-full">
      <BrandManualSidebar
        chapters={manual?.chapters}
        activeChapter={activeChapter}
        onChapterChange={handleChapterChange}
      />
      <BrandManualContent
        chapter={manual?.chapters[activeChapter]}
        isEditing={isEditing}
        onSave={handleSave}
      />
    </div>
  );
}
```

---

## 🎣 Hooks

### React Query para Data Fetching

#### Padrões de Queries
```typescript
// ✅ Query simples
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// ✅ Query com parâmetros
export function useBrandManuals(filters: BrandManualFilters = {}) {
  return useQuery({
    queryKey: ['brand-manuals', filters],
    queryFn: () => brandManualService.list(filters),
    keepPreviousData: true,
  });
}

// ✅ Infinite query
export function useInfiniteLeads() {
  return useInfiniteQuery({
    queryKey: ['leads'],
    queryFn: ({ pageParam = 0 }) => leadService.list({ page: pageParam }),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasNext ? pages.length : undefined,
  });
}
```

#### Padrões de Mutations
```typescript
// ✅ Mutation simples
export function useCreateBrandManual() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: brandManualService.create,
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['brand-manuals'] });
      
      // Ou adicionar aos dados existentes
      queryClient.setQueryData(['brand-manual', data.id], data);
    },
    onError: (error) => {
      toast.error('Erro ao criar manual da marca');
    },
  });
}

// ✅ Optimistic update
export function useUpdateBrandManual() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: brandManualService.update,
    onMutate: async (updatedManual) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['brand-manual', updatedManual.id] });
      
      // Snapshot do estado anterior
      const previousManual = queryClient.getQueryData(['brand-manual', updatedManual.id]);
      
      // Atualização otimista
      queryClient.setQueryData(['brand-manual', updatedManual.id], updatedManual);
      
      return { previousManual };
    },
    onError: (err, updatedManual, context) => {
      // Rollback em caso de erro
      queryClient.setQueryData(['brand-manual', updatedManual.id], context?.previousManual);
    },
    onSettled: (data, error, updatedManual) => {
      // Revalidar sempre
      queryClient.invalidateQueries({ queryKey: ['brand-manual', updatedManual.id] });
    },
  });
}
```

### Custom Hooks para Lógica de Negócio

```typescript
// ✅ Hook para autenticação
export function useAuth() {
  const { data: session, isLoading } = useSession();
  
  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }, []);
  
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);
  
  return {
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    isLoading,
    login,
    logout,
  };
}
```

---

## 🌐 APIs e Serviços

### Organização de Serviços

```typescript
// ✅ lib/services/userService.ts
import { supabase } from '@/lib/auth/supabase';
import type { User, CreateUserData, UpdateUserData } from '@/types';

class UserService {
  async getById(id: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async create(userData: CreateUserData): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async update(id: string, userData: UpdateUserData): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

export const userService = new UserService();
```

### Error Handling

```typescript
// ✅ lib/utils/errorHandler.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleSupabaseError(error: any): AppError {
  if (error?.code === '23505') {
    return new AppError('Este email já está em uso', 'EMAIL_ALREADY_EXISTS', 400);
  }
  
  if (error?.code === 'PGRST116') {
    return new AppError('Registro não encontrado', 'NOT_FOUND', 404);
  }
  
  return new AppError(
    error?.message || 'Erro interno do servidor',
    'INTERNAL_ERROR',
    500
  );
}
```

---

## 🔐 Autenticação

### Configuração do Supabase

```typescript
// ✅ lib/auth/supabase.ts
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Cliente para componentes client-side
export const supabase = createClientComponentClient();

// Cliente para server components
export function createServerSupabaseClient() {
  return createServerComponentClient({ cookies });
}
```

### Middleware de Autenticação

```typescript
// ✅ middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Proteger rotas do dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  
  // Redirecionar usuários autenticados de páginas de auth
  if (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/cadastro')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/cadastro']
};
```

---

## 🧪 Testes

### Jest + Testing Library

```typescript
// ✅ __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

### Testes de Hooks

```typescript
// ✅ __tests__/hooks/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

// Mock do Supabase
jest.mock('@/lib/auth/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));

describe('useAuth Hook', () => {
  it('handles login correctly', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

---

## ⚡ Performance

### Code Splitting

```typescript
// ✅ Lazy loading de componentes pesados
import dynamic from 'next/dynamic';

const BrandManualEditor = dynamic(
  () => import('@/components/brand-manual/BrandManualEditor'),
  {
    loading: () => <BrandManualSkeleton />,
    ssr: false, // Desabilitar SSR se necessário
  }
);
```

### Otimização de Re-renders

```typescript
// ✅ Usar React.memo para componentes puros
export const UserCard = React.memo<UserCardProps>(({ user, onEdit }) => {
  return (
    <div className="p-4">
      <h3>{user.name}</h3>
      <Button onClick={() => onEdit?.(user)}>Edit</Button>
    </div>
  );
});

// ✅ Usar useCallback para handlers estáveis
const handleUserEdit = useCallback((user: User) => {
  setEditingUser(user);
  setIsModalOpen(true);
}, []);

// ✅ Usar useMemo para cálculos pesados
const expensiveValue = useMemo(() => {
  return performHeavyCalculation(data);
}, [data]);
```

---

## ♿ Acessibilidade

### Padrões WCAG 2.2

```typescript
// ✅ Estrutura semântica
<main>
  <header>
    <h1>Dashboard</h1>
    <nav aria-label="Navegação principal">
      {/* ... */}
    </nav>
  </header>
  
  <section aria-labelledby="metrics-title">
    <h2 id="metrics-title">Métricas</h2>
    {/* ... */}
  </section>
</main>

// ✅ Labels e descriptions
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-describedby="email-error"
    aria-invalid={hasError}
  />
  {hasError && (
    <div id="email-error" role="alert">
      Email é obrigatório
    </div>
  )}
</div>

// ✅ Estados de loading
<button disabled={isLoading} aria-label={isLoading ? 'Carregando...' : 'Salvar'}>
  {isLoading ? <Spinner /> : 'Salvar'}
</button>
```

### Focus Management

```typescript
// ✅ Focus trap em modais
import { trapFocus } from '@/lib/utils/accessibility';

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = trapFocus(modalRef.current);
      return cleanup;
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50"
    >
      {children}
    </div>
  );
}
```

---

## 📝 Documentação de Código

### JSDoc para Componentes

```typescript
/**
 * Componente para exibir informações do usuário
 * 
 * @param user - Dados do usuário
 * @param onEdit - Callback chamado quando o usuário clica em editar
 * @param className - Classes CSS adicionais
 * 
 * @example
 * ```tsx
 * <UserCard
 *   user={{ id: '1', name: 'João', email: 'joao@example.com' }}
 *   onEdit={(user) => console.log('Editing', user)}
 * />
 * ```
 */
export function UserCard({ user, onEdit, className }: UserCardProps) {
  // ...
}
```

### Comentários em Código

```typescript
// ✅ Explicar "porquê", não "o quê"
// Usamos setTimeout para permitir que o DOM seja atualizado
// antes de focar no próximo elemento
setTimeout(() => {
  nextInputRef.current?.focus();
}, 0);

// ✅ Documentar workarounds
// HACK: Supabase não suporta upsert com RLS ativo
// TODO: Remover quando https://github.com/supabase/postgrest/issues/xyz for resolvido
const result = await supabase.rpc('upsert_user_profile', { data });
```

---

## 🚀 Deploy e Build

### Build Otimizado

```json
// ✅ next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Analisar bundle size
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true',
  },
};
```

### Environment Variables

```bash
# ✅ .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ✅ .env.example
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 📋 Checklist de Code Review

### Antes de Abrir PR

- [ ] Código está formatado (Prettier)
- [ ] Não há erros de linting (ESLint)
- [ ] Testes estão passando
- [ ] Componentes têm props tipadas
- [ ] Handlers são estáveis (useCallback)
- [ ] Loading states implementados
- [ ] Error boundaries quando necessário
- [ ] Acessibilidade considerada
- [ ] Performance otimizada

### Durante Code Review

- [ ] Lógica está correta
- [ ] Nomenclatura é clara
- [ ] Não há duplicação de código
- [ ] Padrões do projeto seguidos
- [ ] Segurança considerada
- [ ] Documentação atualizada se necessário

---

**Última atualização:** 17 de agosto de 2025  
**Versão:** 2.0  
**Status:** ✅ Completo
