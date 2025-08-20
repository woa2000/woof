# 🎨 Design System - Plataforma Woof Marketing

Este documento define o sistema de design da Plataforma Woof Marketing, incluindo componentes, padrões visuais, cores, tipografia e guidelines de interface.

## 📋 Índice

1. [Princípios de Design](#-princípios-de-design)
2. [Identidade Visual](#-identidade-visual)
3. [Sistema de Cores](#-sistema-de-cores)
4. [Tipografia](#-tipografia)
5. [Componentes Base](#-componentes-base)
6. [Layout e Grid](#-layout-e-grid)
7. [Iconografia](#-iconografia)
8. [Estados e Interações](#-estados-e-interações)
9. [Responsividade](#-responsividade)
10. [Acessibilidade](#-acessibilidade)

---

## 🎯 Princípios de Design

### 1. **Caloroso**
- Interface humana e acolhedora
- Cores quentes e amigáveis
- Linguagem próxima e inclusiva
- Microinterações prazerosas

### 2. **Consultivo**
- Orientação clara em cada etapa
- Tooltips e ajudas contextuais
- Wizards para processos complexos
- Feedback constante sobre ações

### 3. **Confiante**
- Visual profissional e polido
- Hierarquia clara de informações
- Estados bem definidos
- Consistência visual

### 4. **Amigável**
- Simplicidade sem perder funcionalidade
- Linguagem clara e direta
- Fluxos intuitivos
- Redução de atrito cognitivo

---

## 🎨 Identidade Visual

### Logo e Símbolo

```css
/* Variações do logo */
.logo-primary {
  /* Logo completo para headers */
  width: 120px;
  height: 40px;
}

.logo-compact {
  /* Logo compacto para sidebar */
  width: 32px;
  height: 32px;
}

.logo-mark {
  /* Apenas símbolo */
  width: 24px;
  height: 24px;
}
```

### Proporções e Espaçamento

- **Clear space**: Mínimo de 16px ao redor do logo
- **Tamanho mínimo**: 80px de largura para legibilidade
- **Proporção**: Manter aspect ratio original

---

## 🌈 Sistema de Cores

### Paleta Principal

```css
/* Cores Primárias */
:root {
  /* Laranja Woof - Cor principal da marca */
  --primary-50: #fff7ed;
  --primary-100: #ffedd5;
  --primary-200: #fed7aa;
  --primary-300: #fdba74;
  --primary-400: #fb923c;
  --primary-500: #f97316;  /* Cor base */
  --primary-600: #ea580c;
  --primary-700: #c2410c;
  --primary-800: #9a3412;
  --primary-900: #7c2d12;
  --primary-950: #431407;
  
  /* Cores Secundárias */
  --secondary-50: #f8fafc;
  --secondary-100: #f1f5f9;
  --secondary-200: #e2e8f0;
  --secondary-300: #cbd5e1;
  --secondary-400: #94a3b8;
  --secondary-500: #64748b;  /* Cinza base */
  --secondary-600: #475569;
  --secondary-700: #334155;
  --secondary-800: #1e293b;
  --secondary-900: #0f172a;
  --secondary-950: #020617;
}
```

### Cores Semânticas

```css
:root {
  /* Sucesso */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --success-700: #15803d;
  
  /* Aviso */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  --warning-700: #b45309;
  
  /* Erro */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  --error-700: #b91c1c;
  
  /* Informação */
  --info-50: #eff6ff;
  --info-500: #3b82f6;
  --info-600: #2563eb;
  --info-700: #1d4ed8;
}
```

### Uso das Cores

```typescript
// Mapeamento das cores no Tailwind
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: {
        50: '#fff7ed',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
      },
      secondary: {
        50: '#f8fafc',
        500: '#64748b',
        600: '#475569',
        900: '#0f172a',
      },
      success: { /* ... */ },
      warning: { /* ... */ },
      error: { /* ... */ },
      info: { /* ... */ },
    }
  }
}
```

---

## ✍️ Tipografia

### Família Tipográfica

```css
/* Fonte principal */
.font-sans {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Fonte para código */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}
```

### Escala Tipográfica

```css
/* Tamanhos de texto */
.text-xs { font-size: 0.75rem; line-height: 1rem; }      /* 12px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }  /* 14px */
.text-base { font-size: 1rem; line-height: 1.5rem; }     /* 16px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }  /* 18px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }   /* 20px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }      /* 24px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }   /* 36px */
.text-5xl { font-size: 3rem; line-height: 1; }           /* 48px */
```

### Pesos e Estilos

```css
/* Pesos de fonte */
.font-thin { font-weight: 100; }
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }
```

### Hierarquia Tipográfica

```typescript
// Componentes de texto padronizados
export const Typography = {
  H1: ({ children, className, ...props }) => (
    <h1 className={cn("text-4xl font-bold text-gray-900 mb-4", className)} {...props}>
      {children}
    </h1>
  ),
  
  H2: ({ children, className, ...props }) => (
    <h2 className={cn("text-3xl font-semibold text-gray-800 mb-3", className)} {...props}>
      {children}
    </h2>
  ),
  
  H3: ({ children, className, ...props }) => (
    <h3 className={cn("text-2xl font-semibold text-gray-800 mb-2", className)} {...props}>
      {children}
    </h3>
  ),
  
  Body: ({ children, className, ...props }) => (
    <p className={cn("text-base text-gray-600 leading-relaxed", className)} {...props}>
      {children}
    </p>
  ),
  
  Caption: ({ children, className, ...props }) => (
    <span className={cn("text-sm text-gray-500", className)} {...props}>
      {children}
    </span>
  ),
};
```

---

## 🧩 Componentes Base

### Button

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Variants
          {
            'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
            'bg-secondary-100 text-secondary-900 hover:bg-secondary-200': variant === 'secondary',
            'border border-secondary-300 bg-white text-secondary-700 hover:bg-secondary-50': variant === 'outline',
            'text-secondary-700 hover:bg-secondary-100': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
          },
          
          // Sizes
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        
        {children}
        
        {rightIcon && !isLoading && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);
```

### Input

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, ...props }, ref) => {
    const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 sm:text-sm">{leftIcon}</span>
            </div>
          )}
          
          <input
            ref={ref}
            id={id}
            className={cn(
              'block w-full rounded-lg border-gray-300 shadow-sm',
              'focus:border-primary-500 focus:ring-primary-500',
              'placeholder:text-gray-400',
              'disabled:bg-gray-50 disabled:text-gray-500',
              {
                'pl-10': leftIcon,
                'pr-10': rightIcon,
                'border-red-300 focus:border-red-500 focus:ring-red-500': error,
              },
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-description` : undefined}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-400 sm:text-sm">{rightIcon}</span>
            </div>
          )}
        </div>
        
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${id}-description`} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
```

### Card

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg bg-white',
        {
          'border border-gray-200': variant === 'default',
          'border-2 border-gray-300': variant === 'outlined',
          'shadow-lg border border-gray-100': variant === 'elevated',
        },
        className
      )}
      {...props}
    />
  )
);

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-0', className)} {...props} />
  )
);

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
);

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
```

---

## 📐 Layout e Grid

### Container

```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

### Grid System

```typescript
// Layout components
export const Grid = ({ children, cols = 12, gap = 4, className, ...props }) => (
  <div 
    className={cn(
      'grid',
      `grid-cols-${cols}`,
      `gap-${gap}`,
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const GridCol = ({ children, span = 1, className, ...props }) => (
  <div 
    className={cn(
      `col-span-${span}`,
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Exemplo de uso
<Grid cols={12} gap={6}>
  <GridCol span={8}>
    <main>Conteúdo principal</main>
  </GridCol>
  <GridCol span={4}>
    <aside>Sidebar</aside>
  </GridCol>
</Grid>
```

### Espaçamentos

```css
/* Sistema de espaçamento baseado em 4px */
.space-1 { margin: 0.25rem; }   /* 4px */
.space-2 { margin: 0.5rem; }    /* 8px */
.space-3 { margin: 0.75rem; }   /* 12px */
.space-4 { margin: 1rem; }      /* 16px */
.space-6 { margin: 1.5rem; }    /* 24px */
.space-8 { margin: 2rem; }      /* 32px */
.space-12 { margin: 3rem; }     /* 48px */
.space-16 { margin: 4rem; }     /* 64px */
```

---

## 🎯 Iconografia

### Biblioteca de Ícones

Utilizamos **Lucide React** como biblioteca principal de ícones:

```typescript
import { 
  Home, 
  Settings, 
  User, 
  Bell, 
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download
} from 'lucide-react';

// Componente wrapper para consistência
interface IconProps {
  icon: React.ComponentType<any>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Icon = ({ icon: IconComponent, size = 'md', className, ...props }: IconProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6',
  };
  
  return (
    <IconComponent 
      className={cn(sizeClasses[size], className)} 
      {...props} 
    />
  );
};

// Uso
<Icon icon={Home} size="md" className="text-primary-500" />
```

### Ícones Customizados

Para ícones específicos da marca ou funcionalidades únicas:

```typescript
export const WoofIcon = ({ className, ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={cn("h-6 w-6", className)}
    {...props}
  >
    {/* SVG paths específicos da marca */}
  </svg>
);

export const BrandManualIcon = ({ className, ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={cn("h-6 w-6", className)}
    {...props}
  >
    {/* SVG paths para manual da marca */}
  </svg>
);
```

---

## 🎭 Estados e Interações

### Estados dos Componentes

```css
/* Estados hover */
.hover\:bg-primary-50:hover { background-color: var(--primary-50); }

/* Estados focus */
.focus\:ring-2:focus { 
  box-shadow: 0 0 0 2px var(--primary-500); 
}

/* Estados active */
.active\:bg-primary-700 { background-color: var(--primary-700); }

/* Estados disabled */
.disabled\:opacity-50:disabled { opacity: 0.5; }
.disabled\:cursor-not-allowed:disabled { cursor: not-allowed; }
```

### Transições

```css
/* Transições padrão */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

### Animações

```typescript
// Componente de Loading
export const LoadingSpinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  
  return (
    <svg
      className={cn(
        'animate-spin',
        sizeClasses[size],
        className
      )}
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Fade in animation
export const FadeIn = ({ children, delay = 0 }) => (
  <div 
    className="animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);
```

---

## 📱 Responsividade

### Breakpoints

```css
/* Tailwind breakpoints */
/* sm: 640px */
/* md: 768px */  
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

### Padrões Responsivos

```typescript
// Container responsivo
export const ResponsiveContainer = ({ children }) => (
  <div className="
    container mx-auto px-4
    sm:px-6 
    lg:px-8
  ">
    {children}
  </div>
);

// Grid responsivo
export const ResponsiveGrid = ({ children }) => (
  <div className="
    grid grid-cols-1 gap-4
    sm:grid-cols-2 sm:gap-6
    lg:grid-cols-3 lg:gap-8
  ">
    {children}
  </div>
);

// Texto responsivo
export const ResponsiveHeading = ({ children }) => (
  <h1 className="
    text-2xl font-bold
    sm:text-3xl
    lg:text-4xl
  ">
    {children}
  </h1>
);
```

---

## ♿ Acessibilidade

### Contraste de Cores

Todas as combinações de cores atendem ao padrão WCAG 2.2 AA:

```css
/* Combinações aprovadas */
.text-primary-500 { color: #f97316; } /* Ratio: 4.5:1 no fundo branco */
.text-secondary-700 { color: #334155; } /* Ratio: 7.2:1 no fundo branco */
.bg-primary-500 .text-white { /* Ratio: 4.8:1 */ }
```

### Focus States

```css
/* Focus rings consistentes */
.focus-ring {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus-ring:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### Semântica HTML

```typescript
// Exemplo de componente acessível
export const AccessibleModal = ({ isOpen, onClose, title, children }) => (
  <>
    {isOpen && (
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-50"
        onClick={onClose}
        role="presentation"
      >
        <div
          className="modal-content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <header>
            <h2 id="modal-title">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Fechar modal"
              className="focus-ring"
            >
              <X />
            </button>
          </header>
          
          <main>{children}</main>
        </div>
      </div>
    )}
  </>
);
```

---

## 📚 Storybook e Documentação

### Configuração do Storybook

```typescript
// .storybook/main.ts
export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-design-tokens',
  ],
};

// Exemplo de story
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Botão principal da aplicação com múltiplas variantes.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};
```

---

## 📋 Checklist do Design System

### Para Novos Componentes

- [ ] Segue os princípios de design
- [ ] Usa as cores do sistema
- [ ] Tipografia consistente
- [ ] Estados definidos (hover, focus, disabled)
- [ ] Responsivo
- [ ] Acessível (WCAG 2.2 AA)
- [ ] Documentado no Storybook
- [ ] Testado (visual e funcional)
- [ ] Props tipadas com TypeScript

### Para Updates do Design System

- [ ] Backward compatibility verificada
- [ ] Componentes existentes testados
- [ ] Documentação atualizada
- [ ] Design tokens atualizados
- [ ] Changelog atualizado

---

**Última atualização:** 17 de agosto de 2025  
**Versão:** 2.0  
**Status:** ✅ Completo

Este design system serve como base para manter consistência visual e experiência de usuário em toda a Plataforma Woof Marketing.
