# 🐶 Guia de Desenvolvimento – Woof Marketing Platform (Frontend)

Este guia fornece as diretrizes e informações essenciais para o desenvolvimento do frontend da **Plataforma Woof**.

## 1. Visão Geral do Projeto

O frontend é uma parte da **Plataforma Woof**, uma solução de marketing automatizado com IA para clínicas veterinárias e pet shops. A aplicação é construída com **Next.js 14** e utiliza o **App Router**.

### Principais Funcionalidades

- Autenticação de usuários via Supabase.
- Geração e gerenciamento de Manuais de Marca.
- Realização de Anamneses Digitais.
- Dashboard para visualização de métricas e resultados.

## 2. Stack de Tecnologias

- **Framework:** Next.js 14 (com App Router)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS
- **Autenticação:** Supabase Auth
- **Componentes:** Shadcn/UI (implícito pelo uso de `tailwind-merge` e `class-variance-authority`)
- **Ícones:** Lucide React

## 3. Estrutura do Projeto

A estrutura de diretórios segue as convenções do Next.js App Router:

```
src/
├── app/
│   ├── (dashboard)/  # Rotas protegidas do dashboard
│   ├── auth/         # Rotas de autenticação (callback)
│   ├── login/        # Página de login
│   └── ...
├── components/
│   ├── ui/           # Componentes de UI reutilizáveis (ex: Button, Card)
│   ├── layout/       # Componentes de layout (Sidebar, Header)
│   └── ...           # Componentes específicos de features
├── lib/
│   ├── auth/         # Lógica e helpers de autenticação com Supabase
│   └── utils/        # Funções utilitárias
├── hooks/
│   └── ...           # Hooks customizados
└── ...
```

## 4. Gerenciamento de Dependências

O projeto utiliza `npm` para gerenciamento de pacotes. Para instalar as dependências, execute:

```bash
npm install
```

### Dependências Principais

- `next`: Framework React para produção.
- `@supabase/ssr` & `@supabase/supabase-js`: Para integração com Supabase.
- `tailwindcss`: Para estilização utility-first.
- `lucide-react`: Para ícones.
- `tailwind-merge` & `clsx`: Para mesclar classes do Tailwind de forma inteligente.

## 5. Autenticação

A autenticação é gerenciada pelo **Supabase**. A lógica principal pode ser encontrada em `src/lib/auth/`.

- **Cliente Supabase:** O cliente Supabase é inicializado para interagir com a API do Supabase.
- **Rotas Protegidas:** O diretório `src/app/(dashboard)` agrupa todas as rotas que exigem autenticação. O layout `src/app/(dashboard)/layout.tsx` provavelmente contém a lógica para proteger essas rotas.
- **Middleware:** O arquivo `middleware.ts` na raiz do projeto é usado para interceptar requisições e verificar o status de autenticação do usuário, redirecionando para a página de login se necessário.

## 6. Estilização e Componentes

- **TailwindCSS:** A estilização é feita utilizando classes utilitárias do TailwindCSS. As configurações estão no arquivo `tailwind.config.mjs`.
- **Componentes de UI:** O projeto utiliza componentes de UI que seguem as convenções de `Shadcn/UI`, localizados em `src/components/ui`. Ao criar novos componentes, siga o mesmo padrão.

## 7. Linting e Qualidade de Código

Utilizamos o **ESLint** para garantir a consistência e a qualidade do código. A configuração está no arquivo `eslint.config.mjs`.

Para verificar o código, execute:

```bash
npm run lint
```

## 8. Como Contribuir

1.  **Crie uma nova branch:** `git checkout -b feature/sua-nova-feature`.
2.  **Desenvolva a funcionalidade:** Siga as diretrizes de código e estrutura do projeto.
3.  **Verifique o código:** Rode `npm run lint` para garantir que não há erros.
4.  **Faça o commit:** Escreva uma mensagem de commit clara e descritiva.
5.  **Abra um Pull Request:** Descreva as alterações realizadas e o motivo.

> **Nota:** Este guia foi gerado com base na análise do código existente e do arquivo `instructions.md`. Ele deve ser mantido atualizado conforme o projeto evolui.
