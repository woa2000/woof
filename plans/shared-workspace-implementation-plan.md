# 📋 Plano de Compartilhamento de Elementos Comuns - Client ↔ Server

## 🎯 **Situação Atual**

Após análise da arquitetura, identifiquei que o projeto **Woof Marketing** possui uma estrutura de **monorepo com workspaces** já estabelecida, onde:

- **Client**: Next.js 15.4.2 (porta 3000/3001)  
- **Server**: Express.js 4.19.2 (porta 3002) incorporando Next.js
- **Duplicação**: Muitos tipos, utilities e auth helpers estão duplicados

## 🔍 **Elementos Identificados Para Compartilhamento**

### **1. Types & Interfaces** 
```
📂 Atualmente duplicados:
├── client/src/lib/types/ ← Definições duplicadas
├── src/lib/types/          ← Definições duplicadas  
└── server/ (sem types/     ← Faltam types server)
```

**Tipos para compartilhar:**
- `CalendarioInsights`, `Lead`, `Campaign`, `AnamneseReport`
- Interfaces de anamnese (Persona, HeuristicasNielsen, etc.)
- Types de mock data (PetBusinessType, CampaignStatus)
- Database schema types

### **2. Utilities Compartilháveis**
```
📂 Duplicação atual:
├── client/src/lib/utils/
├── src/lib/utils/
└── server/src/utils/ (parcialmente diferente)
```

**Utils para compartilhar:**
- `utils.ts` (cn função, helpers básicos)
- `anamnese-helpers.ts` 
- `brand-logo-upload.ts`
- Validation schemas
- Date/string formatters

### **3. Auth Helpers**
```
📂 Auth duplicado:
├── client/src/lib/auth/
├── src/lib/auth/
└── server/src/middleware/auth.ts (diferente)
```

**Auth para unificar:**
- Supabase client configs
- Auth validation helpers  
- Token management utilities
- User type definitions

### **4. Constants & Configs**
- Environment variables validation
- API endpoints constants  
- Business rules constants
- Error messages/codes

## 🏗️ **Estrutura Proposta - Shared Workspace**

```
woof/
├── package.json (monorepo + shared workspace)
├── shared/                 ← 🆕 NOVO WORKSPACE
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── types/
│   │   │   ├── index.ts          # Re-exports
│   │   │   ├── common.ts         # Lead, Campaign, etc.
│   │   │   ├── anamnese.ts       # Anamnese types
│   │   │   ├── calendario.ts     # CalendarioInsights, etc.
│   │   │   ├── auth.ts           # User, Session types
│   │   │   └── api.ts            # Request/Response types
│   │   ├── utils/
│   │   │   ├── index.ts          # Re-exports
│   │   │   ├── common.ts         # cn(), validators
│   │   │   ├── date.ts           # Date helpers
│   │   │   ├── validation.ts     # Zod schemas
│   │   │   └── formatters.ts     # String/number formats
│   │   ├── constants/
│   │   │   ├── index.ts
│   │   │   ├── api.ts            # Endpoints
│   │   │   ├── business.ts       # Business rules
│   │   │   └── errors.ts         # Error codes
│   │   └── auth/
│   │       ├── index.ts
│   │       ├── types.ts          # Auth types
│   │       ├── config.ts         # Supabase configs
│   │       └── helpers.ts        # Validation helpers
│   └── dist/              ← Build output
├── client/                ← Import from @woof/shared
├── server/                ← Import from @woof/shared
└── src/                   ← Mantido por compatibilidade
```

## ⚙️ **Implementação - Fases**

### **FASE 1: Setup Shared Workspace** 
**Duração**: ~30 min

1. **Criar workspace shared/**
   - `package.json` com exports
   - `tsconfig.json` com path mapping
   - Build script (tsc)

2. **Configurar monorepo**
   - Adicionar "shared" em workspaces
   - Dependências compartilhadas no root

3. **Path aliases**
   - Client: `@woof/shared`
   - Server: `@woof/shared`

### **FASE 2: Migrar Types** 
**Duração**: ~45 min

1. **Consolidar interfaces**
   - Mover types duplicados → `shared/src/types/`
   - Resolver conflitos/diferenças
   - Criar re-exports organizados

2. **Update imports**
   - Client: `import { Lead } from '@woof/shared'`
   - Server: `import { CalendarioInsights } from '@woof/shared'`

3. **Remove duplicações**
   - Deletar `client/src/lib/types/` duplicados
   - Deletar `src/lib/types/` duplicados

### **FASE 3: Migrar Utils**
**Duração**: ~30 min

1. **Consolidar utilities**
   - Mover utils compartilháveis
   - Separar client-specific vs universal
   - Criar validation schemas centralizados

2. **Update imports everywhere**

### **FASE 4: Auth Unification**
**Duração**: ~45 min

1. **Centralizar auth helpers**
   - Config Supabase uniforme
   - Types de User/Session
   - Validation helpers

2. **Adaptar middlewares**
   - Server mantém Express middleware
   - Client usa helpers compartilhados

### **FASE 5: Constants & Testing**
**Duração**: ~20 min

1. **Centralizar constants**
2. **Testar builds**
3. **Validar imports**

## 📦 **Configurações Técnicas**

### **shared/package.json**
```json
{
  "name": "@woof/shared",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./types": "./dist/types/index.js",
    "./utils": "./dist/utils/index.js",
    "./auth": "./dist/auth/index.js",
    "./constants": "./dist/constants/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.6.3"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.52.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  }
}
```

### **shared/tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "incremental": true
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### **Root package.json update**
```json
{
  "workspaces": ["client", "server", "shared"],
  "scripts": {
    "shared:build": "npm --workspace shared run build",
    "shared:dev": "npm --workspace shared run dev",
    "shared:clean": "npm --workspace shared run clean",
    "build": "npm run shared:build && npm run client:build && npm run server:build",
    "dev": "concurrently \"npm run shared:dev\" \"npm run server:dev\" \"npm run client:dev\" --names \"SHARED,SERVER,CLIENT\" --prefix-colors \"yellow,cyan,magenta\"",
    "clean": "npm run shared:clean && npm run client:clean && npm run server:clean"
  }
}
```

### **Client tsconfig.json path mapping**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@woof/shared": ["../shared/src/index"],
      "@woof/shared/*": ["../shared/src/*"]
    }
  }
}
```

### **Server tsconfig.json path mapping**
```json
{
  "compilerOptions": {
    "paths": {
      "@woof/shared": ["../shared/src/index"],
      "@woof/shared/*": ["../shared/src/*"]
    }
  }
}
```

### **Import Examples**
```typescript
// ✅ Client usage
import { Lead, Campaign, CalendarioInsights } from '@woof/shared/types';
import { cn, formatDate } from '@woof/shared/utils';
import { API_ENDPOINTS } from '@woof/shared/constants';

// ✅ Server usage  
import { CalendarioInsights } from '@woof/shared/types';
import { validateUser } from '@woof/shared/auth';
```

## 🎯 **Benefícios Esperados**

### **✅ Immediate**
- **Zero duplicação** de types/utils
- **Imports limpos** e organizados
- **Single source of truth**

### **✅ Medium-term**
- **Faster development** (no more sync duplicados)
- **Better type safety** (shared contracts)
- **Easier refactoring** (change once, affect both)

### **✅ Long-term**
- **Microservices ready** (shared pode virar npm package)
- **Team scalability** (clear boundaries)
- **Testing consistency** (shared validation)

## 📊 **Impacto no Projeto**

- **Breaking changes**: Mínimos (apenas import paths)
- **Build time**: +5-10s (shared build)
- **Development**: Muito mais eficiente
- **Deployment**: Sem impacto (builds independentes)

## 🚨 **Considerações & Riscos**

### **⚠️ Potenciais Issues**
- Build dependency (shared deve buildar primeiro)
- Circular dependencies possíveis
- TypeScript path resolution complexa

### **✅ Mitigações**
- Build order no package.json scripts
- Lint rules contra circular deps
- Path aliases bem documentados

## 📋 **Checklist de Implementação**

### **FASE 1: Setup Workspace**
- [ ] Criar `shared/` directory
- [ ] Configurar `shared/package.json`
- [ ] Configurar `shared/tsconfig.json`
- [ ] Atualizar root `package.json` workspaces
- [ ] Atualizar scripts de build/dev
- [ ] Configurar path aliases em client/server

### **FASE 2: Migrar Types**
- [ ] Criar `shared/src/types/` structure
- [ ] Consolidar interfaces duplicadas
- [ ] Mover tipos de `client/src/lib/types/`
- [ ] Mover tipos de `src/lib/types/`
- [ ] Criar re-exports organizados
- [ ] Atualizar imports no client
- [ ] Atualizar imports no server
- [ ] Remover arquivos duplicados

### **FASE 3: Migrar Utils**
- [ ] Criar `shared/src/utils/` structure
- [ ] Consolidar utils duplicados
- [ ] Separar client-specific vs universal
- [ ] Atualizar imports no client
- [ ] Atualizar imports no server
- [ ] Remover arquivos duplicados

### **FASE 4: Auth Unification**
- [ ] Criar `shared/src/auth/` structure
- [ ] Centralizar configs Supabase
- [ ] Mover auth helpers compartilháveis
- [ ] Adaptar middleware do server
- [ ] Atualizar imports no client
- [ ] Atualizar imports no server

### **FASE 5: Constants & Finalização**
- [ ] Criar `shared/src/constants/` structure
- [ ] Centralizar constants
- [ ] Testar builds de todos workspaces
- [ ] Validar imports funcionando
- [ ] Testar dev mode com watch
- [ ] Documentar novos patterns

## 🚦 **Status de Implementação**

**Data de criação**: 26 de agosto de 2025  
**Status**: 📋 **PLANEJAMENTO CONCLUÍDO - AGUARDANDO FEEDBACK**

**Próximos passos**: Aguardando aprovação para iniciar implementação das fases.

---

## 🤔 **FEEDBACK SOLICITADO**

**Gostaria do seu feedback sobre:**

1. **📋 Escopo**: Os elementos identificados para compartilhamento fazem sentido?

2. **🏗️ Estrutura**: A organização `shared/src/{types,utils,auth,constants}` parece adequada?

3. **⚙️ Implementação**: As 5 fases propostas estão bem divididas?

4. **📦 Technical**: Configuração de workspaces e exports está apropriada?

5. **🎯 Priorização**: Devemos implementar tudo ou começar apenas com types/utils?

**Posso proceder com a implementação ou há ajustes necessários no plano?**