# 🤖 Development Guide AI - Plataforma Woof Marketing

Este guia específico para desenvolvimento com **IA Generativa** complementa o [Development Guide](./DEVELOPMENT_GUIDE.md) principal, focando nas práticas para integração de **80% automação por IA** na agência pet.

## 📋 Índice

1. [Visão Geral da IA](#-visão-geral-da-ia)
2. [Stack de IA](#-stack-de-ia)
3. [Padrões de Desenvolvimento](#-padrões-de-desenvolvimento)
4. [Prompt Engineering](#-prompt-engineering)
5. [Error Handling para IA](#-error-handling-para-ia)
6. [Testing de IA](#-testing-de-ia)
7. [Performance e Custos](#-performance-e-custos)
8. [Security para IA](#-security-para-ia)

---

## 🎯 Visão Geral da IA

### Modelo 80/20

```typescript
// Estrutura base para operações de IA
interface AIOperation {
  // 80% - Automação
  automated: {
    generation: boolean;
    validation: boolean;
    optimization: boolean;
    compliance: boolean;
  };
  
  // 20% - Supervisão Humana
  humanOversight: {
    approval: 'required' | 'optional';
    review: 'validation' | 'guidance';
    intervention: 'manual' | 'automatic';
  };
}
```

### Casos de Uso Principais

1. **Geração de Conteúdo**: Posts, anúncios, e-mails pet-friendly
2. **Anamnese Digital**: Análise automatizada de sites de negócios pet
3. **Brand Voice Analysis**: Extração de tom de voz de materiais existentes
4. **Compliance Check**: Validação de termos e compliance veterinário
5. **Campaign Optimization**: Sugestões de melhoria baseadas em performance

---

## 🛠️ Stack de IA

### Fornecedores e Modelos

```typescript
// Configuração de Providers de IA
export const AI_PROVIDERS = {
  openai: {
    models: {
      'gpt-4o': {
        use: 'content-generation',
        maxTokens: 128000,
        temperature: 0.7,
        cost: 'high'
      },
      'gpt-4o-mini': {
        use: 'validation-analysis',
        maxTokens: 128000,
        temperature: 0.3,
        cost: 'low'
      },
      'text-embedding-3-small': {
        use: 'similarity-search',
        dimensions: 1536,
        cost: 'minimal'
      }
    }
  }
} as const;
```

### Arquitetura de Integração

```typescript
// Client de IA centralizado
export class AIClient {
  private provider: OpenAI;
  
  constructor(config: AIConfig) {
    this.provider = new OpenAI({
      apiKey: config.apiKey,
      timeout: 30000,
      maxRetries: 3
    });
  }
  
  async generateContent(params: ContentGenerationParams): Promise<ContentVariant[]> {
    const systemPrompt = this.buildSystemPrompt(params.brandVoice, params.compliance);
    
    const response = await this.provider.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: params.userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      n: params.variants || 3
    });
    
    return this.parseContentVariants(response.choices);
  }
}
```

---

## 📝 Padrões de Desenvolvimento

### Estrutura de Arquivos IA

```
src/
├── lib/
│   ├── ai/
│   │   ├── clients/
│   │   │   ├── openai-client.ts
│   │   │   └── ai-client-factory.ts
│   │   ├── prompts/
│   │   │   ├── system-prompts.ts
│   │   │   ├── pet-prompts.ts
│   │   │   └── compliance-prompts.ts
│   │   ├── validators/
│   │   │   ├── content-validator.ts
│   │   │   ├── compliance-validator.ts
│   │   │   └── brand-voice-validator.ts
│   │   └── types/
│   │       ├── ai-types.ts
│   │       ├── content-types.ts
│   │       └── prompt-types.ts
│   └── services/
│       ├── content-generation.service.ts
│       ├── brand-analysis.service.ts
│       └── anamnese-ai.service.ts
```

### Convenções de Nomenclatura

```typescript
// Interfaces de IA
interface AIContentRequest { }
interface AIContentResponse { }
interface AIValidationResult { }

// Classes de serviços
class ContentGenerationService { }
class BrandVoiceAnalysisService { }
class ComplianceValidationService { }

// Tipos de prompt
type SystemPrompt = string;
type UserPrompt = string;
type PetCampaignPrompt = string;

// Constantes
const AI_MODELS = { } as const;
const PROMPT_TEMPLATES = { } as const;
const COMPLIANCE_RULES = { } as const;
```

### Error Types para IA

```typescript
// Erros específicos de IA
export class AIError extends Error {
  constructor(
    message: string,
    public code: AIErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'AIError';
  }
}

export enum AIErrorCode {
  TOKEN_LIMIT_EXCEEDED = 'TOKEN_LIMIT_EXCEEDED',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  API_RATE_LIMIT = 'API_RATE_LIMIT',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  COMPLIANCE_VIOLATION = 'COMPLIANCE_VIOLATION',
  BRAND_VOICE_MISMATCH = 'BRAND_VOICE_MISMATCH'
}
```

---

## 🎨 Prompt Engineering

### Estrutura de System Prompts

```typescript
export function buildSystemPrompt(
  brandVoice: BrandVoiceJSON,
  campaignType: PetCampaignType,
  channel: SocialChannel
): string {
  return `
Você é um especialista em marketing para negócios pet, criando conteúdo ${channel} para ${campaignType}.

BRAND VOICE:
- Tom: ${brandVoice.tone}
- Persona: ${brandVoice.persona}
- Termos aprovados: ${brandVoice.approvedTerms.join(', ')}
- Termos bloqueados: ${brandVoice.blockedTerms.join(', ')}

COMPLIANCE VETERINÁRIO:
- SEMPRE incluir disclaimer: "${brandVoice.complianceRules.disclaimers[0]}"
- EVITAR alegações médicas específicas
- FOCO em prevenção e cuidados gerais

FORMATO DE SAÍDA:
- 3 variações diferentes
- Incluir hashtags pet relevantes
- Call-to-action claro
- Emojis apropriados para pets

CONTEXTO PET:
Tipo de negócio: ${brandVoice.businessType}
Público-alvo: Donos de pets que se preocupam com saúde e bem-estar
`;
}
```

### Templates de Prompt por Tipo

```typescript
export const PROMPT_TEMPLATES = {
  // Campanha de Vacinação
  vaccination: {
    system: buildVaccinationSystemPrompt,
    user: (petType: string) => `
Crie posts para campanha de vacinação de ${petType}.
Foque na importância da prevenção e no cronograma adequado.
Inclua informações sobre calendário de vacinas sem ser prescritivo.
`
  },
  
  // Banho e Tosa
  grooming: {
    system: buildGroomingSystemPrompt,
    user: (season: string) => `
Crie conteúdo promocional para serviços de banho e tosa na ${season}.
Destaque benefícios para saúde do pet e conforto.
Inclua dicas de cuidados complementares.
`
  },
  
  // Check-up Geral
  checkup: {
    system: buildCheckupSystemPrompt,
    user: (ageGroup: string) => `
Promova a importância do check-up para pets ${ageGroup}.
Foque em prevenção e detecção precoce.
Evite criar ansiedade, mantenha tom positivo.
`
  }
} as const;
```

### Prompt Optimization

```typescript
// Otimização de prompts para redução de tokens
export function optimizePrompt(prompt: string): string {
  return prompt
    .replace(/\s+/g, ' ')           // Múltiplos espaços
    .replace(/\n\s*\n/g, '\n')      // Linhas vazias
    .trim()                         // Espaços início/fim
    .substring(0, MAX_PROMPT_LENGTH); // Limite de tokens
}

// Versionamento de prompts
export const PROMPT_VERSIONS = {
  'v1.0': {
    contentGeneration: promptV1,
    brandAnalysis: brandPromptV1
  },
  'v1.1': {
    contentGeneration: promptV11,
    brandAnalysis: brandPromptV11
  }
} as const;
```

---

## ⚠️ Error Handling para IA

### Retry Logic

```typescript
export async function aiOperationWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Log retry attempt
      console.warn(`AI operation failed, retrying (${attempt}/${maxRetries})`, error);
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

### Fallback Strategies

```typescript
export class AIContentService {
  async generateContent(params: ContentParams): Promise<ContentVariant[]> {
    try {
      // Primary: GPT-4o
      return await this.generateWithGPT4o(params);
    } catch (error) {
      console.warn('GPT-4o failed, falling back to GPT-4o-mini', error);
      
      try {
        // Fallback: GPT-4o-mini
        return await this.generateWithGPT4oMini(params);
      } catch (fallbackError) {
        console.warn('All AI models failed, using templates', fallbackError);
        
        // Final fallback: Templates
        return this.generateFromTemplates(params);
      }
    }
  }
}
```

### Error Logging e Monitoring

```typescript
export function logAIError(error: AIError, context: AIOperationContext) {
  const logData = {
    timestamp: new Date().toISOString(),
    operation: context.operation,
    model: context.model,
    prompt: context.prompt.substring(0, 200), // Primeiros 200 chars
    error: {
      code: error.code,
      message: error.message,
      details: error.details
    },
    tokens: context.tokensUsed,
    cost: context.estimatedCost,
    userId: context.userId,
    brandId: context.brandId
  };
  
  // Log para monitoring
  console.error('AI Operation Failed', logData);
  
  // Enviar para serviço de monitoring (Sentry, etc.)
  // trackAIError(logData);
}
```

---

## 🧪 Testing de IA

### Unit Tests para IA

```typescript
// Mock de cliente OpenAI
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn()
      }
    }
  }))
}));

describe('ContentGenerationService', () => {
  let service: ContentGenerationService;
  let mockOpenAI: jest.Mocked<OpenAI>;
  
  beforeEach(() => {
    service = new ContentGenerationService();
    mockOpenAI = new OpenAI() as jest.Mocked<OpenAI>;
  });
  
  it('should generate content variants', async () => {
    // Arrange
    const mockResponse = {
      choices: [
        { message: { content: 'Variant 1' } },
        { message: { content: 'Variant 2' } },
        { message: { content: 'Variant 3' } }
      ]
    };
    
    mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);
    
    // Act
    const result = await service.generateContent({
      brandVoice: mockBrandVoice,
      campaignType: 'vaccination',
      channel: 'instagram'
    });
    
    // Assert
    expect(result).toHaveLength(3);
    expect(result[0].content).toBe('Variant 1');
  });
});
```

### Integration Tests

```typescript
describe('AI Integration Tests', () => {
  it('should handle real OpenAI API calls', async () => {
    const service = new ContentGenerationService({
      apiKey: process.env.OPENAI_API_KEY_TEST,
      model: 'gpt-4o-mini' // Modelo mais barato para testes
    });
    
    const result = await service.generateContent({
      brandVoice: testBrandVoice,
      campaignType: 'grooming',
      channel: 'facebook'
    });
    
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    
    // Validar compliance
    result.forEach(variant => {
      expect(variant.content).not.toContain('diagnóstico');
      expect(variant.content).not.toContain('tratamento');
      expect(variant.content).toContain('consulte um veterinário');
    });
  });
});
```

### Validation Tests

```typescript
describe('Compliance Validation', () => {
  const validator = new ComplianceValidator();
  
  it('should block prohibited veterinary terms', () => {
    const content = 'Este produto cura todas as doenças do seu pet';
    
    const result = validator.validate(content, {
      type: 'veterinary',
      strict: true
    });
    
    expect(result.isValid).toBe(false);
    expect(result.violations).toContain('MEDICAL_CLAIM');
  });
  
  it('should require disclaimers', () => {
    const content = 'Vacinação é importante para seu pet';
    
    const result = validator.validate(content, {
      requireDisclaimer: true
    });
    
    expect(result.isValid).toBe(false);
    expect(result.missing).toContain('VETERINARY_DISCLAIMER');
  });
});
```

---

## ⚡ Performance e Custos

### Otimização de Tokens

```typescript
export class TokenOptimizer {
  // Comprimir contexto mantendo informações essenciais
  static compressContext(context: string, maxTokens: number): string {
    const sentences = context.split('. ');
    const important = sentences.filter(s => 
      s.includes('marca') || 
      s.includes('pet') || 
      s.includes('cliente')
    );
    
    let compressed = important.join('. ');
    
    if (this.estimateTokens(compressed) > maxTokens) {
      compressed = compressed.substring(0, maxTokens * 4); // ~4 chars per token
    }
    
    return compressed;
  }
  
  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4); // Aproximação: 4 chars = 1 token
  }
}
```

### Cache Strategy

```typescript
export class AICache {
  private cache = new Map<string, CacheEntry>();
  
  async getCachedResult<T>(
    key: string,
    generator: () => Promise<T>,
    ttl: number = 3600000 // 1 hora
  ): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }
    
    const result = await generator();
    
    this.cache.set(key, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  }
  
  generateCacheKey(params: any): string {
    return crypto
      .createHash('md5')
      .update(JSON.stringify(params))
      .digest('hex');
  }
}
```

### Cost Monitoring

```typescript
export class CostTracker {
  private costs: CostEntry[] = [];
  
  trackOperation(operation: AIOperation, tokens: TokenUsage) {
    const cost = this.calculateCost(operation.model, tokens);
    
    this.costs.push({
      timestamp: new Date(),
      operation: operation.type,
      model: operation.model,
      tokensUsed: tokens,
      cost: cost,
      userId: operation.userId,
      brandId: operation.brandId
    });
    
    // Alert se custo diário exceder limite
    this.checkDailyCostLimit(operation.userId);
  }
  
  private calculateCost(model: string, tokens: TokenUsage): number {
    const rates = {
      'gpt-4o': { input: 0.0025, output: 0.01 },
      'gpt-4o-mini': { input: 0.00015, output: 0.0006 }
    };
    
    const rate = rates[model];
    return (tokens.input * rate.input + tokens.output * rate.output) / 1000;
  }
}
```

---

## 🔒 Security para IA

### Sanitização de Inputs

```typescript
export class PromptSanitizer {
  static sanitize(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove HTML
      .replace(/javascript:/gi, '') // Remove JavaScript
      .replace(/data:/gi, '') // Remove data URIs
      .replace(/\b(system|assistant)\b/gi, '') // Remove role keywords
      .trim()
      .substring(0, MAX_INPUT_LENGTH);
  }
  
  static validateBrandVoice(brandVoice: BrandVoiceJSON): ValidationResult {
    const errors: string[] = [];
    
    // Validar termos bloqueados
    if (brandVoice.blockedTerms.some(term => term.length < 2)) {
      errors.push('Termos bloqueados devem ter pelo menos 2 caracteres');
    }
    
    // Validar tom de voz
    const allowedTones = ['amigável', 'profissional', 'casual', 'formal'];
    if (!allowedTones.some(tone => brandVoice.tone.includes(tone))) {
      errors.push('Tom de voz deve incluir pelo menos um valor permitido');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

### Rate Limiting

```typescript
export class AIRateLimiter {
  private userLimits = new Map<string, UserLimit>();
  
  async checkLimit(userId: string, operation: string): Promise<boolean> {
    const limit = this.userLimits.get(userId) || this.createUserLimit(userId);
    const now = Date.now();
    
    // Reset counter se passou 1 hora
    if (now - limit.resetTime > 3600000) {
      limit.count = 0;
      limit.resetTime = now;
    }
    
    const maxOperations = this.getMaxOperations(operation);
    
    if (limit.count >= maxOperations) {
      throw new AIError(
        'Rate limit exceeded',
        AIErrorCode.API_RATE_LIMIT,
        { userId, operation, limit: maxOperations }
      );
    }
    
    limit.count++;
    return true;
  }
}
```

---

## 📋 Checklist de Desenvolvimento

### Antes de Implementar IA

- [ ] Definir caso de uso específico e métricas de sucesso
- [ ] Escolher modelo apropriado (custo vs. qualidade)
- [ ] Criar prompts seguindo templates estabelecidos
- [ ] Implementar fallbacks e error handling
- [ ] Configurar rate limiting e cost monitoring
- [ ] Escrever testes unitários e de integração

### Antes do Deploy

- [ ] Validar compliance veterinário em todos os outputs
- [ ] Testar com dados reais de marca
- [ ] Verificar performance e custos estimados
- [ ] Implementar logging e monitoring
- [ ] Configurar feature flags para rollback
- [ ] Documentar APIs e prompts utilizados

### Monitoramento Contínuo

- [ ] Acompanhar custos por usuário/operação
- [ ] Monitorar qualidade dos outputs
- [ ] Coletar feedback humano (20% supervisão)
- [ ] Otimizar prompts baseado em resultados
- [ ] Atualizar modelos quando disponíveis
- [ ] Revisar compliance regularmente

---

**Última atualização:** 24 de agosto de 2025  
**Versão:** 1.0  
**Status:** ✅ Completo - Pronto para desenvolvimento