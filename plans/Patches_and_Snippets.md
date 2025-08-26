# 📝 Patches & Snippets - Next.js → Client + Server (Express)

**Objetivo**: Snippets obrigatórios e diffs para migração da arquitetura monolítica Next.js para client + server (Express) com boot unificado.

---

## 🔧 Snippets Obrigatórios

### 1. server/src/index.ts (Modelo TypeScript)

```typescript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import next from 'next';
import path from 'path';
import { createServerClient } from '@supabase/ssr';

const dev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT ?? 3000);
const clientDir = path.resolve(process.cwd(), '../client');

// Initialize Next.js app
const app = next({ dev, dir: clientDir });
const handle = app.getRequestHandler();

async function main() {
  console.log('🚀 Starting Woof Marketing server...');
  
  // Prepare Next.js
  await app.prepare();
  console.log('✅ Next.js prepared');
  
  // Create Express server
  const server = express();
  
  // Trust proxy (for Vercel/production)
  server.set('trust proxy', 1);
  
  // Middleware stack
  server.use(compression());
  
  // CORS configuration
  if (process.env.CORS_ORIGIN) {
    server.use(cors({ 
      origin: process.env.CORS_ORIGIN.split(',').map(o => o.trim()),
      credentials: true 
    }));
  }
  
  // Body parsing
  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Request logging
  server.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
  
  // Health check endpoint
  server.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok',
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: '1.0.0'
    });
  });
  
  // Example API endpoint
  server.get('/api/example', (req, res) => {
    res.json({ 
      message: 'Hello from Express API - Woof Marketing',
      timestamp: new Date().toISOString()
    });
  });
  
  // Auth middleware for protected API routes
  const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Token required' });
      }
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: () => '', // Will be handled by Next.js middleware
            set: () => {},
            remove: () => {}
          }
        }
      );
      
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      (req as any).user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  };
  
  // Protected API routes (example)
  server.get('/api/user/profile', requireAuth, (req, res) => {
    res.json({ 
      user: (req as any).user,
      message: 'Protected route - User profile'
    });
  });
  
  // API routes for calendar (migrated from client/src/app/api/calendario)
  server.use('/api/calendario', require('./routes/calendario'));
  
  // All other routes go to Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  // Error handling
  server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: dev ? err.message : 'Something went wrong'
    });
  });
  
  // Graceful shutdown
  const shutdown = () => {
    console.log('🛑 Shutting down server...');
    process.exit(0);
  };
  
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  
  // Start server
  server.listen(port, () => {
    console.log(`✅ Woof Marketing server ready at http://localhost:${port}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Client dir: ${clientDir}`);
  });
}

// Handle startup errors
main().catch((err) => {
  console.error('❌ Fatal error starting server:', err);
  process.exit(1);
});
```

### 2. server/package.json (Modelo)

```json
{
  "name": "woof-server",
  "version": "1.0.0",
  "description": "Woof Marketing - Server Express + Next.js",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "next": "15.4.2",
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.52.1"
  },
  "devDependencies": {
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20",
    "tsx": "^4.7.0",
    "typescript": "^5.6.3"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 3. server/tsconfig.json (Modelo TypeScript)

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
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": false,
    "noEmit": false,
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.js"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### 4. server/.env.example (Modelo Server)

```bash
# === SERVER CONFIGURATION ===
PORT=3000
NODE_ENV=development

# === CORS CONFIGURATION ===
# Desenvolvimento: client Next.js standalone na porta 3001
# Produção: apenas domínio principal
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# === SUPABASE CONFIGURATION (compartilhado) ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# === AI INTEGRATION ===
OPENAI_API_KEY=sk-your-openai-api-key

# === DEVELOPMENT FLAGS ===
MOCK_DATA_ENABLED=true
MOCK_AI_ENABLED=true
MOCK_ANALYTICS_ENABLED=true
DEBUG_PROVIDERS=true

# === OBSERVABILITY ===
LOG_LEVEL=info
REQUEST_LOGGING=true

# === SECURITY ===
JWT_SECRET=your-jwt-secret-for-additional-auth
RATE_LIMIT_ENABLED=true
```

### 5. client/package.json (Modelo)

```json
{
  "name": "woof-client",
  "version": "1.0.0", 
  "description": "Woof Marketing - Client Next.js",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start --port 3001", 
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "clean": "rm -rf .next"
  },
  "dependencies": {
    "next": "15.4.2",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.52.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.525.0",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.4.2",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.5",
    "typescript": "^5",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 6. package.json Raiz (Workspaces)

```json
{
  "name": "woof-monorepo",
  "version": "1.0.0",
  "description": "Woof Marketing - Agência Pet Operada por IA",
  "private": true,
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "dev": "npm --workspace server run dev",
    "build": "npm run client:build && npm run server:build",
    "client:build": "npm --workspace client run build",
    "server:build": "npm --workspace server run build",
    "start": "npm --workspace server run start",
    "lint": "npm --workspace client run lint",
    "test": "npm --workspace client run test",
    "type-check": "npm run client:type-check && npm run server:type-check",
    "client:type-check": "npm --workspace client run type-check",
    "server:type-check": "npm --workspace server run type-check",
    "clean": "npm --workspace client run clean && npm --workspace server run clean",
    "postinstall": "echo '✅ Woof Marketing workspaces installed'"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/woa2000/woof.git"
  },
  "keywords": [
    "pet-marketing",
    "ai-agency",
    "next.js",
    "express",
    "monorepo"
  ],
  "author": "Digital Woof",
  "license": "UNLICENSED"
}
```

### 7. server/src/routes/calendario.ts (Migração API)

```typescript
import express from 'express';
import { createServerClient } from '@supabase/ssr';

const router = express.Router();

// Supabase client for server-side operations
const getSupabaseClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: () => '',
        set: () => {},
        remove: () => {}
      }
    }
  );
};

// GET /api/calendario - List calendar events
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    
    // Example query - adjust based on your actual schema
    const { data, error } = await supabase
      .from('calendar_events') // adjust table name
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Calendar fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
    
    res.json({ events: data || [] });
  } catch (error) {
    console.error('Calendar route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/calendario - Create calendar event
router.post('/', async (req, res) => {
  try {
    const { title, date, description } = req.body;
    
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }
    
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('calendar_events')
      .insert([{ title, date, description }])
      .select()
      .single();
    
    if (error) {
      console.error('Calendar creation error:', error);
      return res.status(500).json({ error: 'Failed to create calendar event' });
    }
    
    res.status(201).json({ event: data });
  } catch (error) {
    console.error('Calendar POST error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

### 8. client/middleware.ts (Simplificado)

```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Simplified middleware - only handle auth redirects
  // API routes are now handled by Express server
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes - only UI routes, no API
  const protectedRoutes = ['/dashboard', '/leads', '/campanhas', '/landing-pages', '/anamnese-digital', '/configuracoes']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Auth routes
  const authRoutes = ['/login', '/cadastro']
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (handled by Express server)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

---

## 🔄 Diffs/Patches Principais

### Diff 1: Mover estrutura src/app → client/src/app

```bash
# Estrutura atual → Nova estrutura
mkdir -p client/src
mv src/app client/src/app

# Remover APIs do client
rm -rf client/src/app/api

# Mover configs
mv next.config.ts client/
mv tailwind.config.mjs client/
mv postcss.config.mjs client/
mv eslint.config.mjs client/

# Atualizar imports se necessário
# @/ paths continuam funcionando
```

### Diff 2: Atualizar package.json scripts

```diff
// package.json (raiz)
- "scripts": {
-   "dev": "next dev --turbopack",
-   "build": "next build", 
-   "start": "next start",
-   "lint": "next lint"
- }

+ "workspaces": ["client", "server"],
+ "scripts": {
+   "dev": "npm --workspace server run dev",
+   "build": "npm run client:build && npm run server:build",
+   "client:build": "npm --workspace client run build", 
+   "server:build": "npm --workspace server run build",
+   "start": "npm --workspace server run start",
+   "lint": "npm --workspace client run lint"
+ }
```

### Diff 3: Atualizar client/next.config.ts

```typescript
// client/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Em desenvolvimento standalone, pode usar porta diferente
  // Em produção, será servido pelo Express
  
  eslint: {
    // Manter durante migração, depois remover
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    // Manter durante migração, depois remover  
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  
  // Output para integração com Express
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  // Configurações para servir via Express
  experimental: {
    serverComponentsExternalPackages: ['express'],
  },
  
  // Asset prefix se necessário para CDN futuro
  // assetPrefix: process.env.CDN_URL,
};

export default nextConfig;
```

### Diff 4: Environment Variables

```diff
# .env.example (consolidado na raiz)
+ # === EXPRESS SERVER CONFIG ===
+ PORT=3000
+ NODE_ENV=development
+ CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Mantém existing vars
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### Diff 5: Gitignore Atualizado

```diff
# .gitignore
+ # Monorepo
+ /client/.next/
+ /client/dist/
+ /server/dist/
+ /server/.tsbuildinfo

# Keep existing
node_modules/
.env.local
.env
```

---

## 📋 Comandos de Migração Step-by-Step

### Setup Inicial

```bash
# 1. Backup do estado atual
git checkout -b backup-before-migration
git add . && git commit -m "Backup before Express migration"

# 2. Criar branch para migração  
git checkout -b feature/express-server-migration

# 3. Criar estrutura base
mkdir -p client server
mkdir -p server/src/{routes,middleware,services,utils}
```

### Migração Estrutural

```bash
# 4. Mover frontend para client/
mkdir -p client/src
mv src/app client/src/
mv components client/src/ 2>/dev/null || true
mv hooks client/src/ 2>/dev/null || true  
mv lib client/src/ 2>/dev/null || true
mv services client/src/ 2>/dev/null || true
mv types client/src/ 2>/dev/null || true

# 5. Mover configs para client/
mv next.config.ts client/
mv tailwind.config.mjs client/
mv postcss.config.mjs client/
mv eslint.config.mjs client/

# 6. Limpar APIs do client
rm -rf client/src/app/api

# 7. Mover middleware simplificado
# (manual edit required)
```

### Setup Server

```bash
# 8. Criar server files
# (usar snippets acima para criar arquivos)

# 9. Instalar deps
npm install --workspace server express compression cors dotenv
npm install --workspace server --save-dev @types/express @types/compression @types/cors tsx

# 10. Atualizar raiz
# (atualizar package.json com workspaces config)
```

### Teste e Validação

```bash
# 11. Testar build
npm run client:build
npm run server:build

# 12. Testar desenvolvimento
npm run dev

# 13. Testar produção
npm run build
npm start

# 14. Smoke tests
curl http://localhost:3000/api/health
curl http://localhost:3000/
```

---

## ✅ Checklist de Validação Pós-Migração

### Funcionalidade Básica
- [ ] ✅ `npm run dev` inicia sistema completo
- [ ] ✅ Landing page carrega em http://localhost:3000
- [ ] ✅ Dashboard requer autenticação
- [ ] ✅ Login/logout funcionando
- [ ] ✅ API health retorna 200

### APIs Migradas  
- [ ] ✅ /api/calendario retorna dados
- [ ] ✅ Autenticação API funciona
- [ ] ✅ Error handling correto
- [ ] ✅ CORS configurado

### Performance
- [ ] ✅ Landing page < 3s LCP
- [ ] ✅ APIs < 500ms response
- [ ] ✅ No console errors

### Build & Deploy
- [ ] ✅ Client build funciona
- [ ] ✅ Server build funciona  
- [ ] ✅ Produção build funciona
- [ ] ✅ Environment vars carregam

---

**Autor**: GitHub Copilot (AI Agent)  
**Data**: 25 de agosto de 2025  
**Projeto**: Woof Marketing - Migration Next.js → Express  
**Status**: ✅ Snippets Completos