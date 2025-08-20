## Blueprint: Woof Marketing Platform

**Visão Geral:**

O projeto "Woof Marketing Platform" é uma aplicação web construída com Next.js 15 (App Router) e Tailwind CSS. O objetivo é fornecer uma plataforma de dashboard para gerenciar leads e campanhas de marketing, com foco em uma interface amigável e alinhada com a identidade visual da marca Woof.

**Recursos Implementados:**

### ✅ Funcionalidades Básicas Concluídas
*   Configuração inicial do projeto Next.js 15.
*   Configuração do Tailwind CSS com a paleta de cores e fontes da marca Woof.
*   Definição de tipos de dados para Leads, Campanhas e AnamneseReport.
*   Criação de dados mocados para demonstração.
*   Instalação da biblioteca `lucide-react` para ícones.
*   Sistema de design básico com componentes UI reutilizáveis.

### 🔐 Sistema de Autenticação Implementado
*   **Página de login** moderna e responsiva com identidade visual Woof
*   **Página de cadastro** completa com validação robusta
*   **Hook useAuth** personalizado para gerenciamento de estado de autenticação
*   **Componente ProtectedRoute** para proteção de rotas do dashboard
*   **Configuração completa do Supabase** para autenticação
*   **Middleware** para proteção automática de rotas
*   **Callback de autenticação** para login social
*   **Validação de formulários** em tempo real
*   **Login social** (Google/Facebook) totalmente configurado
*   **Redirecionamento automático** baseado em estado de autenticação

### 🛠️ Integração com Supabase
*   **Cliente Supabase** configurado para client e server components
*   **Funções auxiliares** para cadastro, login, logout e recuperação de senha
*   **Middleware de autenticação** para proteção de rotas
*   **Gerenciamento de sessão** automático
*   **Suporte a OAuth** (Google, Facebook)
*   **Documentação completa** de configuração

### 🎨 Sistema de Design
*   **Componente Input** personalizado com validação visual
*   **Componente Button** com variantes primary/secondary e suporte a ícones
*   **Componente Card** para contêineres de informações
*   **Componente Logo** para identidade visual
*   **Componente MetricCard** para métricas do dashboard
*   **Layout responsivo** com mobile-first approach

### 📊 Dashboard e Páginas
*   **Dashboard principal** com métricas e visão geral
*   **Gestão de leads** com tabela e funcionalidades básicas
*   **Gestão de campanhas** com cards informativos
*   **Sidebar navegacional** com menu lateral
*   **Páginas placeholder** para Landing Pages, Anamnese Digital e Configurações

### 📝 Manual da Marca Digital
*   **Visualização de Capítulos:** Implementado um visualizador de capítulos para o manual da marca, permitindo navegação entre seções.
*   **Edição de Capítulos:** Funcionalidade de edição para o conteúdo de cada capítulo do manual da marca.
*   **Estrutura de Capítulos:** A estrutura inicial do manual da marca é definida por um template com capítulos pré-definidos.

**Alterações Recentes:**

### 🗑️ Capítulos Removidos do Manual da Marca
Os seguintes capítulos foram removidos do template padrão do Manual da Marca para simplificar a estrutura e focar nos recursos essenciais:
*   **06 - Component Library (UI Kit)**
*   **08 - Motion & Micro-interações**
*   **09 - Acessibilidade Web (WCAG 2.2)**
*   **12 - E-mail & Notificações**

Esta alteração visa otimizar o escopo inicial do projeto, permitindo um desenvolvimento mais focado e rápido nas funcionalidades prioritárias.

**Estrutura Atual do Projeto:**

```
```
src/
├── app/
│   ├── (dashboard)/          # Rotas protegidas do dashboard
│   │   ├── dashboard/        # Página principal ✅
│   │   ├── leads/           # Gestão de leads ✅
│   │   ├── campanhas/       # Gestão de campanhas ✅
│   │   ├── landing-pages/   # Placeholder 🔄
│   │   ├── anamnese-digital/# Placeholder 🔄
│   │   ├── configuracoes/   # Placeholder 🔄
│   │   ├── manual-marca/    # Manual da Marca Digital ✅
│   │   └── layout.tsx       # Layout com proteção ✅
│   ├── auth/
│   │   └── callback/        # Callback OAuth ✅
│   ├── login/               # Sistema de autenticação ✅
│   ├── cadastro/            # Página de registro ✅
│   └── page.tsx             # Redirecionamento ✅
├── components/
│   ├── ui/                  # Sistema de design ✅
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Logo.tsx
│   │   └── MetricCard.tsx
│   └── layout/              # Componentes de layout ✅
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── ProtectedRoute.tsx
├── hooks/
│   └── useAuth.ts           # Hook de autenticação ✅
├── lib/
│   ├── types.ts             # Definições TypeScript ✅
│   ├── mock-data.ts         # Dados de demonstração ✅
│   ├── utils.ts             # Utilitários ✅
│   ├── supabase.ts          # Cliente Supabase ✅
│   ├── supabase-server.ts   # Supabase para server ✅
│   └── auth-helpers.ts      # Funções de autenticação ✅
└── middleware.ts            # Middleware de autenticação ✅
```
```

**Próximas Prioridades:**

### 🚀 Próximos Passos (Ordem de Prioridade)
1.  **Configurar Projeto Supabase:**
    *   ✅ Instalar dependências (@supabase/supabase-js, @supabase/ssr)
    *   ✅ Configurar clientes Supabase (client e server)
    *   ✅ Implementar middleware de autenticação
    *   ✅ Criar funções auxiliares de autenticação
    *   🔄 Criar projeto no Supabase (https://app.supabase.com)
    *   🔄 Configurar variáveis de ambiente (.env.local)
    *   🔄 Configurar provedores OAuth (Google/Facebook)

2.  **Completar Páginas Faltantes:**
    *   Implementar página de Landing Pages com wizard de criação
    *   Desenvolver seção de Anamnese Digital com formulários
    *   Criar página de Configurações com perfil do usuário

3.  **Melhorar Funcionalidades Existentes:**
    *   Adicionar filtros e busca na tabela de leads
    *   Implementar gráficos no dashboard
    *   Criar sistema de notificações
    *   Adicionar estados de loading mais refinados

4.  **Deploy e Infraestrutura:**
    *   Configurar pipeline de CI/CD
    *   Deploy em Vercel ou plataforma similar
    *   Configurar domínio personalizado
    *   Implementar monitoramento

**Status Atual:** ✅ Sistema de Autenticação Completo com Supabase

O projeto agora possui um sistema de autenticação completo e robusto integrado com Supabase, incluindo login/cadastro por email, login social, proteção de rotas e gerenciamento de sessão. A próxima fase focará na configuração do projeto Supabase e desenvolvimento de funcionalidades avançadas.