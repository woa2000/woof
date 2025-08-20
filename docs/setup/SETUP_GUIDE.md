# 🚀 Guia de Configuração - Plataforma Woof Marketing

Este guia irá ajudar você a configurar o ambiente de desenvolvimento local da Plataforma Woof Marketing.

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Configuração do Projeto](#-configuração-do-projeto)
3. [Configuração do Supabase](#-configuração-do-supabase)
4. [Variáveis de Ambiente](#-variáveis-de-ambiente)
5. [Instalação e Execução](#-instalação-e-execução)
6. [Verificação da Configuração](#-verificação-da-configuração)
7. [Scripts Úteis](#-scripts-úteis)
8. [Troubleshooting](#-troubleshooting)

---

## 🛠️ Pré-requisitos

### Software Necessário

```bash
# Node.js (versão 18.17 ou superior)
node --version
# v18.17.0 ou superior

# npm (vem com Node.js)
npm --version
# 9.0.0 ou superior

# Git
git --version
# 2.34.0 ou superior

# VS Code (recomendado)
# https://code.visualstudio.com/
```

### Extensões Recomendadas para VS Code

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "supabase.supabase"
  ]
}
```

### Contas Necessárias

1. **GitHub** - Para acessar o repositório
2. **Supabase** - Backend e banco de dados ([supabase.com](https://supabase.com))
3. **Vercel** - Deploy (opcional para desenvolvimento) ([vercel.com](https://vercel.com))
4. **OpenAI** - Para funcionalidades de IA ([platform.openai.com](https://platform.openai.com))

---

## 📁 Configuração do Projeto

### 1. Clonagem do Repositório

```bash
# Clone o repositório
git clone https://github.com/woa2000/woof.git
cd woof

# Checkout da branch de desenvolvimento (se aplicável)
git checkout main
```

### 2. Estrutura do Projeto

Após a clonagem, você deve ter esta estrutura:

```
woof/
├── .env.local.example        # Exemplo de variáveis de ambiente
├── .env.local               # Suas variáveis de ambiente (criar)
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
├── docs/                    # Documentação
├── src/                     # Código fonte
│   ├── app/                 # Next.js App Router
│   ├── components/          # Componentes React
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Bibliotecas e utilitários
│   └── types/               # Definições TypeScript
├── public/                  # Assets estáticos
└── sql/                     # Scripts SQL do banco
```

---

## 🗄️ Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login/cadastro
3. Clique em "New Project"
4. Escolha uma organização
5. Configure:
   - **Nome do projeto**: `woof-marketing-dev` (ou similar)
   - **Senha do banco**: Use uma senha forte
   - **Região**: `South America (São Paulo)` (recomendado para Brasil)
6. Clique em "Create new project"

### 2. Configurar Authentication

```sql
-- No SQL Editor do Supabase, execute:

-- 1. Ativar providers de autenticação
-- Vá para Authentication > Providers no painel do Supabase
-- Ative: Email, Google (opcional), Facebook (opcional)

-- 2. Configurar URLs de redirecionamento
-- Em Authentication > URL Configuration:
-- Site URL: http://localhost:3000
-- Redirect URLs: 
--   - http://localhost:3000/auth/callback
--   - http://localhost:3000/dashboard
```

### 3. Configurar Database

Execute os scripts SQL na seguinte ordem:

```bash
# No SQL Editor do Supabase, execute os arquivos na ordem:
# 1. sql/storage_setup.sql      # Configurações de storage
# 2. sql/brand_manuals.sql      # Tabelas do manual da marca
# 3. sql/anamneses_digitais.sql # Tabelas da anamnese digital
# 4. sql/sample_data.sql        # Dados de exemplo (opcional)
```

### 4. Configurar Storage

```sql
-- No SQL Editor do Supabase:

-- Criar bucket para uploads de logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('brand-logos', 'brand-logos', true);

-- Política para upload de logos
CREATE POLICY "Users can upload own logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brand-logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para acessar logos
CREATE POLICY "Anyone can view logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-logos');
```

### 5. Obter Credenciais

No painel do Supabase, vá para **Settings > API** e copie:
- `Project URL`
- `anon public` key
- `service_role secret` key (apenas para desenvolvimento)

---

## 🔐 Variáveis de Ambiente

### 1. Criar Arquivo de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.local.example .env.local
```

### 2. Configurar .env.local

```bash
# .env.local

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI Configuration (para funcionalidades de IA)
OPENAI_API_KEY=your-openai-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 3. Validar Configuração

```bash
# Execute o script de validação
npm run validate-env
```

---

## 📦 Instalação e Execução

### 1. Instalar Dependências

```bash
# Instalar dependências do projeto
npm install

# Ou usando yarn
yarn install
```

### 2. Verificar Instalação

```bash
# Verificar se todas as dependências foram instaladas
npm list --depth=0
```

### 3. Executar em Modo Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento
npm run dev

# Ou
yarn dev
```

O aplicativo estará disponível em: http://localhost:3000

### 4. Build de Produção (Opcional)

```bash
# Criar build de produção
npm run build

# Executar build local
npm run start
```

---

## ✅ Verificação da Configuração

### 1. Checklist de Ambiente

Execute este checklist para verificar se tudo está funcionando:

```bash
# 1. Verificar Node.js
node --version
# ✅ Deve mostrar v18.17.0 ou superior

# 2. Verificar dependências
npm run check-deps
# ✅ Não deve mostrar vulnerabilidades críticas

# 3. Verificar TypeScript
npx tsc --noEmit
# ✅ Não deve mostrar erros

# 4. Verificar ESLint
npm run lint
# ✅ Não deve mostrar erros críticos

# 5. Testar conexão com Supabase
npm run test-supabase
# ✅ Deve conectar com sucesso
```

### 2. Teste Manual

1. **Abrir aplicação**: http://localhost:3000
2. **Testar navegação**: Deve carregar a página inicial
3. **Testar autenticação**: 
   - Ir para `/login`
   - Criar uma conta de teste
   - Fazer login
   - Acessar `/dashboard`
4. **Testar funcionalidades básicas**:
   - Criar um manual da marca
   - Fazer upload de logo (se configurado)
   - Executar uma anamnese digital

### 3. Scripts de Diagnóstico

```bash
# Verificar autenticação
npm run debug:auth

# Verificar storage
npm run debug:storage

# Verificar conexões de banco
npm run debug:database

# Verificar todas as configurações
npm run check-health
```

---

## 🛠️ Scripts Úteis

### Scripts de Desenvolvimento

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Scripts Customizados

```bash
# Desenvolvimento
npm run dev:debug          # Dev com debug habilitado
npm run dev:turbo         # Dev com turbopack (experimental)

# Testes
npm run test:integration  # Testes de integração
npm run test:e2e         # Testes end-to-end

# Database
npm run db:migrate       # Executar migrações
npm run db:seed         # Popular com dados de exemplo
npm run db:reset        # Resetar banco (cuidado!)

# Utilitários
npm run format          # Formatar código com Prettier
npm run analyze         # Analisar bundle size
npm run check-updates   # Verificar atualizações de deps
```

---

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com Supabase

```bash
# Erro: "Invalid API key"
# Solução: Verificar .env.local
cat .env.local | grep SUPABASE

# Verificar se as chaves estão corretas
npm run test-supabase
```

#### 2. Erro de TypeScript

```bash
# Erro: "Cannot find module"
# Solução: Verificar imports e tipos
npx tsc --noEmit --listFiles | grep -i error

# Reinstalar dependências de tipos
npm install --save-dev @types/node @types/react
```

#### 3. Erro de Build

```bash
# Erro: "Module not found"
# Solução: Verificar paths no tsconfig.json
cat tsconfig.json | grep paths

# Limpar cache do Next.js
rm -rf .next
npm run dev
```

#### 4. Erro de CORS

```bash
# Erro: "CORS policy"
# Solução: Verificar configuração do Supabase
# No painel Supabase > Settings > API
# Adicionar http://localhost:3000 aos allowed origins
```

#### 5. Erro de Environment Variables

```bash
# Erro: "Environment variable not found"
# Solução: Verificar .env.local
npm run validate-env

# Recarregar variáveis
source .env.local
npm run dev
```

### Logs de Debug

```bash
# Habilitar logs detalhados
DEBUG=* npm run dev

# Logs específicos do Supabase
DEBUG=supabase:* npm run dev

# Logs do Next.js
DEBUG=next:* npm run dev
```

### Reset Completo

Se nada funcionar, tente um reset completo:

```bash
# 1. Limpar dependências
rm -rf node_modules package-lock.json

# 2. Reinstalar
npm install

# 3. Limpar cache do Next.js
rm -rf .next

# 4. Verificar ambiente
npm run validate-env

# 5. Reiniciar
npm run dev
```

---

## 🆘 Suporte

### Documentação

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/docs

### Contatos

- **Tech Lead**: [Adicionar contato]
- **DevOps**: [Adicionar contato]
- **Slack**: #woof-development (se aplicável)

### Issues

Se encontrar um bug ou problema:

1. Verificar [issues existentes](https://github.com/woa2000/woof/issues)
2. Criar novo issue com:
   - Descrição detalhada
   - Steps to reproduce
   - Screenshots (se aplicável)
   - Ambiente (OS, Node.js version, etc.)

---

## 📋 Checklist Final

Antes de começar a desenvolver, certifique-se de que:

- [ ] Node.js 18.17+ instalado
- [ ] Projeto clonado e dependências instaladas
- [ ] Projeto Supabase criado e configurado
- [ ] Arquivo `.env.local` configurado com todas as variáveis
- [ ] Scripts SQL executados no Supabase
- [ ] Aplicação roda em http://localhost:3000
- [ ] Autenticação funciona (login/logout)
- [ ] Não há erros no console do browser
- [ ] TypeScript compila sem erros
- [ ] ESLint não mostra erros críticos

---

**Última atualização:** 17 de agosto de 2025  
**Versão:** 2.0  
**Status:** ✅ Completo

Agora você está pronto para contribuir com a Plataforma Woof Marketing! 🚀
