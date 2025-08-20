# 🔐 Segurança e Conformidade - Plataforma Woof Marketing

Este documento descreve as medidas de segurança, conformidade com LGPD e boas práticas implementadas na Plataforma Woof Marketing.

## 📋 Índice

1. [Visão Geral de Segurança](#-visão-geral-de-segurança)
2. [Autenticação e Autorização](#-autenticação-e-autorização)
3. [Proteção de Dados](#-proteção-de-dados)
4. [Conformidade LGPD](#-conformidade-lgpd)
5. [Segurança da Aplicação](#-segurança-da-aplicação)
6. [Infraestrutura Segura](#-infraestrutura-segura)
7. [Monitoramento e Auditoria](#-monitoramento-e-auditoria)
8. [Incident Response](#-incident-response)

---

## 🛡️ Visão Geral de Segurança

### Princípios de Segurança

1. **Security by Design** - Segurança incorporada desde o design
2. **Zero Trust** - Verificar sempre, nunca confiar
3. **Least Privilege** - Mínimo privilégio necessário
4. **Defense in Depth** - Múltiplas camadas de proteção
5. **Privacy by Default** - Privacidade como configuração padrão

### Modelo de Ameaças

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   Application   │    │   Data Layer    │
│   Threats       │    │   Layer         │    │                 │
│                 │    │                 │    │                 │
│ • DDoS          │ ──►│ • XSS           │ ──►│ • SQL Injection │
│ • Bot Attacks   │    │ • CSRF          │    │ • Data Breach   │
│ • Phishing      │    │ • Auth Bypass   │    │ • Unauthorized  │
│ • Social Eng.   │    │ • Input Valid.  │    │   Access        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mitigations   │    │   Mitigations   │    │   Mitigations   │
│                 │    │                 │    │                 │
│ • Rate Limiting │    │ • Input Sanit.  │    │ • RLS Policies  │
│ • WAF           │    │ • HTTPS Only    │    │ • Encryption    │
│ • Bot Detection │    │ • CSP Headers   │    │ • Access Logs   │
│ • IP Filtering  │    │ • Auth Tokens   │    │ • Audit Trail   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔑 Autenticação e Autorização

### Sistema de Autenticação

#### Supabase Auth

```typescript
// Configuração segura do Supabase Auth
export const supabaseAuthConfig = {
  // JWT configuração
  jwt: {
    expiryTime: 60 * 60, // 1 hora
    refreshTokenRotationEnabled: true,
    autoRefreshToken: true,
  },
  
  // Providers seguros
  providers: {
    email: {
      enabled: true,
      confirmEmail: true,
      doubleConfirmEmail: false,
    },
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  
  // Políticas de senha
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  
  // Configurações de segurança
  security: {
    maxSessionsPerUser: 5,
    sessionTimeoutEnabled: true,
    sessionTimeoutMinutes: 480, // 8 horas
    suspiciousLoginDetection: true,
  },
};
```

#### Middleware de Autenticação

```typescript
// middleware.ts - Proteção de rotas
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Verificar sessão
  const { data: { session }, error } = await supabase.auth.getSession();
  
  // Log de tentativa de acesso
  console.log(`Access attempt: ${req.nextUrl.pathname} by ${session?.user?.email || 'anonymous'}`);
  
  // Proteger rotas do dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Verificar se usuário está ativo
    if (session.user.user_metadata?.status === 'suspended') {
      return NextResponse.redirect(new URL('/suspended', req.url));
    }
  }
  
  // Redirecionar usuários autenticados das páginas de auth
  if (['/login', '/cadastro'].includes(req.nextUrl.pathname) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Headers de segurança
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Autorização Granular

#### Row Level Security (RLS)

```sql
-- Políticas RLS para brand_manuals
CREATE POLICY "Users can only access own brand manuals"
ON public.brand_manuals
FOR ALL
USING (auth.uid() = user_id);

-- Política para compartilhamento público
CREATE POLICY "Public access for shared manuals"
ON public.brand_manuals
FOR SELECT
USING (
  is_public = true 
  AND status = 'published'
);

-- Política para administradores
CREATE POLICY "Admins can access all manuals"
ON public.brand_manuals
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Auditoria de acesso
CREATE TABLE public.access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  resource_type TEXT NOT NULL,
  resource_id UUID,
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para log automático
CREATE OR REPLACE FUNCTION public.log_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.access_logs (
    user_id, resource_type, resource_id, action, created_at
  )
  VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para auditoria
CREATE TRIGGER audit_brand_manuals
AFTER INSERT OR UPDATE OR DELETE ON public.brand_manuals
FOR EACH ROW EXECUTE FUNCTION public.log_access();
```

---

## 🛡️ Proteção de Dados

### Criptografia

#### Em Trânsito

```typescript
// Configuração HTTPS obrigatória
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // HTTPS obrigatório
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // Controle de conteúdo
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.supabase.co",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'none'",
            ].join('; ')
          },
        ],
      },
    ];
  },
};
```

#### Em Repouso

```sql
-- Criptografia de campos sensíveis no PostgreSQL
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para criptografar dados sensíveis
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    encrypt(
      data::bytea,
      'your-encryption-key'::bytea,
      'aes'
    ),
    'base64'
  );
END;
$$ LANGUAGE plpgsql;

-- Função para descriptografar
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN convert_from(
    decrypt(
      decode(encrypted_data, 'base64'),
      'your-encryption-key'::bytea,
      'aes'
    ),
    'UTF8'
  );
END;
$$ LANGUAGE plpgsql;

-- Exemplo de uso em tabela
ALTER TABLE public.profiles 
ADD COLUMN encrypted_phone TEXT;

-- Trigger para criptografia automática
CREATE OR REPLACE FUNCTION encrypt_profile_data()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.phone IS NOT NULL THEN
    NEW.encrypted_phone = encrypt_sensitive_data(NEW.phone);
    NEW.phone = NULL; -- Limpar campo não criptografado
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER encrypt_profile_trigger
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION encrypt_profile_data();
```

### Backup e Recovery

```sql
-- Política de backup automatizada do Supabase
-- Backups diários com retenção de 7 dias (plano gratuito)
-- Backups Point-in-Time Recovery até 7 dias

-- Script para backup manual de dados críticos
CREATE OR REPLACE FUNCTION backup_critical_data()
RETURNS TABLE (
  table_name TEXT,
  backup_timestamp TIMESTAMP WITH TIME ZONE,
  record_count BIGINT
) AS $$
BEGIN
  -- Backup de profiles
  CREATE TABLE IF NOT EXISTS backup_profiles AS 
  SELECT * FROM public.profiles WHERE created_at >= NOW() - INTERVAL '24 hours';
  
  -- Backup de brand_manuals
  CREATE TABLE IF NOT EXISTS backup_brand_manuals AS 
  SELECT * FROM public.brand_manuals WHERE updated_at >= NOW() - INTERVAL '24 hours';
  
  -- Retornar estatísticas
  RETURN QUERY
  SELECT 'profiles'::TEXT, NOW(), COUNT(*)::BIGINT FROM backup_profiles
  UNION ALL
  SELECT 'brand_manuals'::TEXT, NOW(), COUNT(*)::BIGINT FROM backup_brand_manuals;
END;
$$ LANGUAGE plpgsql;
```

---

## 📜 Conformidade LGPD

### Princípios Implementados

#### 1. Finalidade e Adequação

```typescript
// Definição clara de uso de dados
export const DATA_PROCESSING_PURPOSES = {
  ACCOUNT_MANAGEMENT: {
    purpose: 'Gerenciamento de conta do usuário',
    legalBasis: 'Execução de contrato',
    dataTypes: ['email', 'nome', 'telefone'],
    retention: '5 anos após encerramento da conta',
  },
  
  BRAND_MANUAL_CREATION: {
    purpose: 'Criação e gestão de manuais da marca',
    legalBasis: 'Execução de contrato',
    dataTypes: ['dados da empresa', 'logos', 'preferências de design'],
    retention: 'Enquanto a conta estiver ativa',
  },
  
  DIGITAL_ANALYSIS: {
    purpose: 'Análise digital de websites e redes sociais',
    legalBasis: 'Consentimento',
    dataTypes: ['URLs fornecidas', 'análises geradas'],
    retention: '2 anos após a análise',
  },
  
  MARKETING_COMMUNICATION: {
    purpose: 'Comunicação de marketing e atualizações do produto',
    legalBasis: 'Consentimento',
    dataTypes: ['email', 'preferências de comunicação'],
    retention: 'Até revogação do consentimento',
  },
} as const;
```

#### 2. Consentimento

```typescript
// Componente de consentimento LGPD
export function ConsentManager() {
  const [consents, setConsents] = useState({
    essential: true,       // Sempre true, não pode ser desabilitado
    analytics: false,      // Opcional
    marketing: false,      // Opcional
    personalization: false, // Opcional
  });
  
  const handleConsentChange = async (type: string, granted: boolean) => {
    // Atualizar no banco de dados
    await updateUserConsent(type, granted);
    
    // Atualizar estado local
    setConsents(prev => ({ ...prev, [type]: granted }));
    
    // Log para auditoria
    console.log(`Consent ${granted ? 'granted' : 'revoked'} for ${type}`);
  };
  
  return (
    <div className="consent-manager">
      <h3>Configurações de Privacidade</h3>
      
      <div className="consent-item">
        <label>
          <input
            type="checkbox"
            checked={consents.essential}
            disabled
          />
          <strong>Cookies Essenciais</strong> (obrigatório)
          <p>Necessários para o funcionamento básico da plataforma</p>
        </label>
      </div>
      
      <div className="consent-item">
        <label>
          <input
            type="checkbox"
            checked={consents.analytics}
            onChange={(e) => handleConsentChange('analytics', e.target.checked)}
          />
          <strong>Analytics</strong>
          <p>Nos ajuda a melhorar a plataforma analisando como você a usa</p>
        </label>
      </div>
      
      <div className="consent-item">
        <label>
          <input
            type="checkbox"
            checked={consents.marketing}
            onChange={(e) => handleConsentChange('marketing', e.target.checked)}
          />
          <strong>Marketing</strong>
          <p>Receber comunicações sobre novidades e ofertas</p>
        </label>
      </div>
    </div>
  );
}
```

#### 3. Direitos dos Titulares

```sql
-- Tabela para solicitações LGPD
CREATE TABLE public.lgpd_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  request_type TEXT NOT NULL CHECK (request_type IN (
    'access', 'rectification', 'erasure', 'portability', 'objection'
  )),
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'completed', 'rejected'
  )),
  request_details JSONB,
  response_data JSONB,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  requester_email TEXT NOT NULL,
  requester_ip INET
);

-- Função para processar direito ao esquecimento
CREATE OR REPLACE FUNCTION process_erasure_request(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN := TRUE;
BEGIN
  -- Anonimizar dados pessoais
  UPDATE public.profiles 
  SET 
    full_name = 'USUÁRIO REMOVIDO',
    email = 'removed_' || id::text || '@example.com',
    avatar_url = NULL,
    business_name = 'REMOVIDO',
    phone = NULL
  WHERE id = target_user_id;
  
  -- Remover dados sensíveis dos manuais da marca
  UPDATE public.brand_manuals 
  SET 
    title = 'Manual Removido',
    description = 'Dados removidos conforme LGPD',
    logo_url = NULL
  WHERE user_id = target_user_id;
  
  -- Log da operação
  INSERT INTO public.access_logs (
    user_id, resource_type, action, created_at
  ) VALUES (
    target_user_id, 'erasure_request', 'PROCESSED', NOW()
  );
  
  RETURN success;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro
    INSERT INTO public.system_logs (level, message, created_at)
    VALUES ('ERROR', 'Erasure request failed: ' || SQLERRM, NOW());
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para exportação de dados (portabilidade)
CREATE OR REPLACE FUNCTION export_user_data(target_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  user_data JSONB;
BEGIN
  SELECT jsonb_build_object(
    'profile', (
      SELECT to_jsonb(p) FROM public.profiles p WHERE id = target_user_id
    ),
    'brand_manuals', (
      SELECT jsonb_agg(to_jsonb(bm)) 
      FROM public.brand_manuals bm 
      WHERE user_id = target_user_id
    ),
    'anamneses', (
      SELECT jsonb_agg(to_jsonb(ad))
      FROM public.anamneses_digitais ad
      WHERE user_id = target_user_id
    ),
    'export_date', NOW()
  ) INTO user_data;
  
  RETURN user_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 4. Data Protection Officer (DPO)

```typescript
// Configuração do DPO
export const DPO_CONTACT = {
  email: 'dpo@digitalwoof.com',
  phone: '+55 11 9999-9999',
  address: 'Endereço da empresa',
  responsibilities: [
    'Monitorar conformidade com LGPD',
    'Conduzir avaliações de impacto',
    'Atuar como ponto de contato com ANPD',
    'Treinar equipe sobre proteção de dados',
  ],
};

// Formulário para contato com DPO
export function DPOContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    requestType: 'general',
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enviar solicitação para DPO
    await submitDPORequest(formData);
    
    // Confirmação para o usuário
    toast.success('Sua solicitação foi enviada ao nosso DPO');
  };
  
  return (
    <form onSubmit={handleSubmit} className="dpo-form">
      <h3>Contato com o Encarregado de Dados (DPO)</h3>
      
      <select 
        value={formData.requestType}
        onChange={(e) => setFormData(prev => ({...prev, requestType: e.target.value}))}
      >
        <option value="general">Dúvida geral</option>
        <option value="access">Direito de acesso</option>
        <option value="rectification">Correção de dados</option>
        <option value="erasure">Exclusão de dados</option>
        <option value="portability">Portabilidade</option>
        <option value="objection">Objeção ao tratamento</option>
      </select>
      
      {/* Outros campos do formulário */}
      
      <button type="submit">Enviar Solicitação</button>
    </form>
  );
}
```

---

## 🔒 Segurança da Aplicação

### Proteção contra Vulnerabilidades

#### XSS (Cross-Site Scripting)

```typescript
// Sanitização de entrada
import DOMPurify from 'dompurify';

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

// Hook para conteúdo seguro
export function useSafeHTML(html: string) {
  return useMemo(() => sanitizeHTML(html), [html]);
}

// Componente seguro para renderizar HTML
export function SafeHTML({ html, className }: { html: string; className?: string }) {
  const safeHTML = useSafeHTML(html);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: safeHTML }}
    />
  );
}
```

#### CSRF (Cross-Site Request Forgery)

```typescript
// Proteção CSRF com tokens
import { randomBytes } from 'crypto';

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

// Middleware CSRF
export async function csrfMiddleware(req: NextRequest) {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const csrfToken = req.headers.get('x-csrf-token');
    const sessionToken = req.cookies.get('csrf-token')?.value;
    
    if (!csrfToken || !validateCSRFToken(csrfToken, sessionToken)) {
      return new Response('CSRF token inválido', { status: 403 });
    }
  }
  
  return NextResponse.next();
}
```

#### SQL Injection

```typescript
// Usando Supabase com queries parametrizadas (proteção automática)
export async function getUserBrandManuals(userId: string) {
  // ✅ Seguro - parâmetros são escapados automaticamente
  const { data, error } = await supabase
    .from('brand_manuals')
    .select('*')
    .eq('user_id', userId) // Parâmetro seguro
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

// ❌ NUNCA faça isso (vulnerável a SQL injection)
// const query = `SELECT * FROM brand_manuals WHERE user_id = '${userId}'`;
```

### Rate Limiting

```typescript
// Rate limiting com Redis (ou memória local)
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(
    private maxAttempts: number = 100,
    private windowMs: number = 15 * 60 * 1000 // 15 minutos
  ) {}
  
  async isAllowed(identifier: string): Promise<boolean> {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }
    
    if (record.count >= this.maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
}

// Middleware de rate limiting
const loginLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 tentativas por 15min
const generalLimiter = new RateLimiter(100, 15 * 60 * 1000); // 100 requests por 15min

export async function rateLimitMiddleware(req: NextRequest) {
  const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown';
  const limiter = req.nextUrl.pathname.includes('/auth') ? loginLimiter : generalLimiter;
  
  if (!(await limiter.isAllowed(ip))) {
    return new Response('Too many requests', { 
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutos
      },
    });
  }
  
  return NextResponse.next();
}
```

---

## 🏗️ Infraestrutura Segura

### Configuração do Supabase

```yaml
# Configurações de segurança do Supabase
Database:
  ssl_mode: require
  max_connections: 100
  statement_timeout: 30s
  
Auth:
  site_url: https://woof.com.br
  redirect_urls:
    - https://woof.com.br/auth/callback
    - https://woof.com.br/dashboard
  jwt_secret: # Gerado automaticamente
  refresh_token_rotation: true
  
Storage:
  file_size_limit: 50MB
  allowed_mime_types:
    - image/jpeg
    - image/png
    - image/svg+xml
    - application/pdf
    
RLS:
  enabled: true
  default_role: authenticated
```

### Headers de Segurança

```typescript
// next.config.ts - Headers de segurança
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 📊 Monitoramento e Auditoria

### Sistema de Logs

```sql
-- Tabela de logs do sistema
CREATE TABLE public.system_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL CHECK (level IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL')),
  message TEXT NOT NULL,
  context JSONB,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_system_logs_level ON public.system_logs(level);
CREATE INDEX idx_system_logs_user_id ON public.system_logs(user_id);
CREATE INDEX idx_system_logs_created_at ON public.system_logs(created_at DESC);

-- Função para logging
CREATE OR REPLACE FUNCTION log_event(
  log_level TEXT,
  log_message TEXT,
  log_context JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.system_logs (
    level, message, context, user_id, created_at
  ) VALUES (
    log_level, log_message, log_context, auth.uid(), NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Monitoramento de Segurança

```typescript
// Detectar atividades suspeitas
export class SecurityMonitor {
  private static instance: SecurityMonitor;
  private suspiciousActivities: Map<string, number> = new Map();
  
  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }
  
  async logSecurityEvent(event: {
    type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_access',
    userId?: string,
    ip: string,
    userAgent: string,
    details?: Record<string, any>
  }) {
    // Log no banco de dados
    await this.logToDB(event);
    
    // Detectar padrões suspeitos
    await this.detectSuspiciousPatterns(event);
    
    // Alertas em tempo real para eventos críticos
    if (this.isCriticalEvent(event)) {
      await this.sendSecurityAlert(event);
    }
  }
  
  private async detectSuspiciousPatterns(event: any) {
    const key = `${event.ip}_${event.type}`;
    const count = (this.suspiciousActivities.get(key) || 0) + 1;
    this.suspiciousActivities.set(key, count);
    
    // Múltiplas tentativas de login falharam
    if (event.type === 'failed_login' && count >= 5) {
      await this.blockIP(event.ip, 'Multiple failed login attempts');
    }
    
    // Limpeza periódica
    setTimeout(() => {
      this.suspiciousActivities.delete(key);
    }, 15 * 60 * 1000); // 15 minutos
  }
  
  private async blockIP(ip: string, reason: string) {
    // Implementar bloqueio de IP
    console.log(`Blocking IP ${ip}: ${reason}`);
    
    // Em produção, integrar com WAF/CDN
    // await cloudflare.blockIP(ip);
  }
}
```

---

## 🚨 Incident Response

### Plano de Resposta a Incidentes

```typescript
// Classificação de incidentes
export enum IncidentSeverity {
  LOW = 'low',           // Impacto mínimo
  MEDIUM = 'medium',     // Impacto moderado
  HIGH = 'high',         // Impacto significativo
  CRITICAL = 'critical', // Impacto severo/dados expostos
}

export interface SecurityIncident {
  id: string;
  severity: IncidentSeverity;
  type: 'data_breach' | 'unauthorized_access' | 'ddos' | 'malware' | 'other';
  description: string;
  affectedUsers: string[];
  detectedAt: Date;
  resolvedAt?: Date;
  actions: IncidentAction[];
}

export interface IncidentAction {
  timestamp: Date;
  action: string;
  performedBy: string;
  result: string;
}

// Resposta automática a incidentes
export class IncidentResponse {
  async handleIncident(incident: SecurityIncident) {
    // 1. Log imediato
    console.error(`Security incident detected: ${incident.type} - ${incident.severity}`);
    
    // 2. Notificar equipe de segurança
    await this.notifySecurityTeam(incident);
    
    // 3. Ações imediatas baseadas na severidade
    switch (incident.severity) {
      case IncidentSeverity.CRITICAL:
        await this.handleCriticalIncident(incident);
        break;
      case IncidentSeverity.HIGH:
        await this.handleHighSeverityIncident(incident);
        break;
      default:
        await this.handleStandardIncident(incident);
        break;
    }
    
    // 4. Documentar resposta
    await this.documentIncident(incident);
  }
  
  private async handleCriticalIncident(incident: SecurityIncident) {
    // 1. Isolar sistemas afetados
    // 2. Revogar todas as sessões ativas
    // 3. Notificar ANPD (se aplicável)
    // 4. Preparar comunicado para usuários
    
    console.log('Executing critical incident response protocol');
  }
  
  private async notifySecurityTeam(incident: SecurityIncident) {
    // Integração com Slack, email, SMS, etc.
    const message = `🚨 SECURITY INCIDENT
Severity: ${incident.severity}
Type: ${incident.type}
Description: ${incident.description}
Time: ${incident.detectedAt.toISOString()}`;
    
    console.log(message);
    // await slack.sendMessage('#security-alerts', message);
  }
}
```

### Backup e Recovery

```sql
-- Procedimento de backup de emergência
CREATE OR REPLACE FUNCTION emergency_backup()
RETURNS BOOLEAN AS $$
DECLARE
  backup_success BOOLEAN := TRUE;
BEGIN
  -- Criar backup de todas as tabelas críticas
  BEGIN
    CREATE TABLE emergency_backup_profiles AS SELECT * FROM public.profiles;
    CREATE TABLE emergency_backup_brand_manuals AS SELECT * FROM public.brand_manuals;
    CREATE TABLE emergency_backup_anamneses AS SELECT * FROM public.anamneses_digitais;
    
    -- Log do backup
    INSERT INTO public.system_logs (level, message, created_at)
    VALUES ('INFO', 'Emergency backup completed successfully', NOW());
    
  EXCEPTION
    WHEN OTHERS THEN
      backup_success := FALSE;
      
      INSERT INTO public.system_logs (level, message, context, created_at)
      VALUES ('ERROR', 'Emergency backup failed', jsonb_build_object('error', SQLERRM), NOW());
  END;
  
  RETURN backup_success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 📋 Checklist de Segurança

### Desenvolvimento

- [ ] Todas as entradas são validadas e sanitizadas
- [ ] Queries usam prepared statements
- [ ] Senhas são hashadas com salt
- [ ] Tokens JWT têm expiração adequada
- [ ] Headers de segurança estão configurados
- [ ] Rate limiting implementado
- [ ] Logs de segurança funcionando
- [ ] Dados sensíveis são criptografados

### Deploy

- [ ] HTTPS obrigatório em produção
- [ ] Variáveis de ambiente seguras
- [ ] WAF configurado (se aplicável)
- [ ] Backup automatizado funcionando
- [ ] Monitoramento ativo
- [ ] Alertas de segurança configurados
- [ ] Políticas RLS ativas
- [ ] IP whitelisting (se necessário)

### LGPD

- [ ] Consentimento implementado
- [ ] Política de privacidade atualizada
- [ ] Processo para direitos dos titulares
- [ ] DPO designado e contactável
- [ ] Avaliação de impacto realizada
- [ ] Retenção de dados definida
- [ ] Procedimento de incident response
- [ ] Treinamento da equipe realizado

---

**Última atualização:** 17 de agosto de 2025  
**Responsável:** Tech Lead + DPO  
**Próxima revisão:** 17 de novembro de 2025  
**Status:** ✅ Completo
