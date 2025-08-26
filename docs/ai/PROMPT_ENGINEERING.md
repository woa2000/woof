# 🎨 Prompt Engineering - Agência Pet Operada por IA

Guia completo de **Prompt Engineering** para a Plataforma Woof Marketing, focado em **automação 80/20** e conteúdo pet-friendly com compliance veterinário.

## 📋 Índice

1. [Princípios Fundamentais](#-princípios-fundamentais)
2. [Estrutura de Prompts](#-estrutura-de-prompts)
3. [System Prompts Base](#-system-prompts-base)
4. [Templates por Funcionalidade](#-templates-por-funcionalidade)
5. [Compliance e Segurança](#-compliance-e-segurança)
6. [Otimização e Performance](#-otimização-e-performance)
7. [Testing de Prompts](#-testing-de-prompts)
8. [Versionamento](#-versionamento)

---

## 🎯 Princípios Fundamentais

### 1. Pet-First Approach
Todos os prompts devem considerar o contexto específico do universo pet:
- **Linguagem empática** com donos de pets
- **Conhecimento veterinário** básico sem ser prescritivo
- **Sazonalidade pet** (vacinas, cuidados especiais)
- **Emergências comuns** (sem causar pânico)

### 2. Compliance Integrado
- **Disclaimers obrigatórios** em conteúdo médico
- **Termos proibidos** configuráveis por marca
- **Aprovação veterinária** quando necessário
- **LGPD compliance** para dados de pets

### 3. Brand Voice Consistency
```typescript
// Brand Voice deve ser injetado em todos os prompts
interface BrandVoiceContext {
  tone: string; // "amigável, profissional, pet-friendly"
  persona: string; // "veterinária experiente que ama animais"
  approvedTerms: string[];
  blockedTerms: string[];
  businessType: PetBusinessType;
  uniqueSellingPoints: string[];
}
```

### 4. Modelo 80/20
- **80% Automação**: IA gera conteúdo completo seguindo regras
- **20% Supervisão**: Humano aprova, ajusta direção estratégica
- **Feedback loop**: Aprendizado contínuo com aprovações/rejeições

---

## 🏗️ Estrutura de Prompts

### Template Base
```
ROLE: [Definição do papel da IA]
CONTEXT: [Contexto do negócio pet e Brand Voice]
TASK: [Tarefa específica a ser executada]
CONSTRAINTS: [Limitações e regras de compliance]
OUTPUT: [Formato esperado da resposta]
EXAMPLES: [Exemplos de saídas desejadas]
```

### System Prompt Universal

```typescript
const SYSTEM_PROMPT_BASE = `
Você é um especialista em marketing para negócios do universo pet, com profundo conhecimento sobre:
- Comportamento e necessidades de pets (cães, gatos, aves, etc.)
- Preocupações e motivações de donos de pets
- Sazonalidade de serviços veterinários e pet care
- Compliance e ética em comunicação veterinária
- Marketing digital empático e responsável

REGRAS FUNDAMENTAIS:
1. NUNCA faça alegações médicas específicas ou diagnósticos
2. SEMPRE inclua disclaimers quando necessário
3. Use linguagem que demonstre amor e cuidado com os animais
4. Mantenha tom profissional mas acolhedor
5. Priorize prevenção e cuidados gerais sobre tratamentos específicos

DISCLAIMERS OBRIGATÓRIOS:
- Para conteúdo médico: "Consulte sempre um médico veterinário"
- Para emergências: "Em caso de emergência, procure um veterinário imediatamente"
- Para produtos: "Resultados podem variar. Use conforme orientação profissional"

TERMOS PROIBIDOS GLOBAIS:
- "Barato", "promoção relâmpago", "liquidação"
- "Cura", "tratamento definitivo", "solução milagrosa"
- "Único veterinário", "melhor da cidade", "mais barato"
`;
```

---

## 📝 System Prompts Base

### Content Generation System Prompt

```typescript
export function buildContentGenerationPrompt(
  brandVoice: BrandVoiceJSON,
  campaignType: PetCampaignType,
  channel: SocialChannel
): string {
  return `
${SYSTEM_PROMPT_BASE}

BRAND VOICE:
- Tom: ${brandVoice.tone}
- Persona: ${brandVoice.persona}
- Especialidades: ${brandVoice.businessContext.specialties?.join(', ')}
- Diferenciais: ${brandVoice.businessContext.uniqueSellingPoints?.join(', ')}
- Termos aprovados: ${brandVoice.approvedTerms.join(', ')}
- Termos bloqueados: ${brandVoice.blockedTerms.join(', ')}

CONTEXTO DA CAMPANHA:
- Tipo: ${campaignType}
- Canal: ${channel}
- Público-alvo: Donos de pets que se preocupam com saúde e bem-estar

COMPLIANCE ESPECÍFICO:
${brandVoice.complianceRules.veterinary ? 
  '- Aprovação veterinária necessária para alegações de saúde' : ''}
- Disclaimers obrigatórios: ${brandVoice.complianceRules.disclaimers.join(', ')}
- Evitar: Alegações médicas específicas, criar ansiedade desnecessária

FORMATO DE SAÍDA PARA ${channel.toUpperCase()}:
${getChannelSpecificInstructions(channel)}

GERAÇÃO DE VARIAÇÕES:
- Crie 3 versões diferentes do mesmo conceito
- Varie o approach: educativo, emocional, prático
- Mantenha consistência de marca em todas as variações
- Inclua hashtags relevantes e Call-to-Action apropriado
`;
}

function getChannelSpecificInstructions(channel: SocialChannel): string {
  const instructions = {
    instagram: `
- Texto: máximo 2.200 caracteres
- Formato: Texto cativante com emojis apropriados
- Hashtags: 5-10 hashtags relevantes para pets
- CTA: Claro e direcionado para ação desejada
- Tom: Visual e inspiracional`,
    
    facebook: `
- Texto: máximo 500 caracteres para melhor engajamento
- Formato: Texto direto com storytelling quando relevante
- Hashtags: 3-5 hashtags principais
- CTA: Focado em conversação e interação
- Tom: Conversacional e comunitário`,
    
    email: `
- Subject: máximo 50 caracteres, cativante
- Preview: máximo 90 caracteres
- Corpo: Estruturado com parágrafos curtos
- CTA: Botão/link claro e específico
- Tom: Pessoal e direto`,
    
    whatsapp: `
- Mensagem: máximo 1.000 caracteres
- Formato: Conversacional, como se fosse um amigo
- Emojis: Usar com moderação, apropriados para pets
- CTA: Simples e fácil de responder
- Tom: Íntimo e cuidadoso`
  };
  
  return instructions[channel] || '';
}
```

### Brand Analysis System Prompt

```typescript
export const BRAND_ANALYSIS_PROMPT = `
${SYSTEM_PROMPT_BASE}

ESPECIALIZAÇÃO: Análise de identidade de marca para negócios pet

TAREFA: Analisar materiais fornecidos e extrair elementos de Brand Voice

PROCESSO DE ANÁLISE:
1. Identificar tom de voz predominante
2. Extrair persona da marca (como ela se comunica)
3. Listar termos/frases frequentemente usados (approved_terms)
4. Identificar termos que a marca evita ou não usa
5. Mapear especialidades e diferenciais competitivos
6. Avaliar nível de compliance veterinário atual

ELEMENTOS A EXTRAIR:
- Tom: descreva em 3-5 adjetivos (ex: "amigável, profissional, pet-friendly")
- Persona: descreva em uma frase quem é a "voz" da marca
- Especialidades: lista de serviços/produtos de destaque
- Diferenciais: o que torna esta marca única no mercado pet
- Target audience: características do público-alvo
- Compliance level: atual nível de aderência às boas práticas veterinárias

FORMATO DE SAÍDA:
Retorne um JSON estruturado seguindo o schema BrandVoiceJSON, com análise detalhada de cada elemento e sugestões de melhoria quando aplicável.

CUIDADOS ESPECIAIS:
- Identifique se há inconsistências na comunicação
- Sugira melhorias para compliance veterinário
- Avalie adequação do tom para o tipo de negócio pet
- Considere sazonalidade e contexto local
`;
```

---

## 📋 Templates por Funcionalidade

### 1. Campanhas de Vacinação

```typescript
export const VACCINATION_CAMPAIGN_PROMPTS = {
  systemPrompt: `
${SYSTEM_PROMPT_BASE}

ESPECIALIZAÇÃO: Campanhas de vacinação para pets

CONHECIMENTO ESPECÍFICO:
- Importância da prevenção vs tratamento
- Calendário básico de vacinação (sem ser prescritivo)
- Sazonalidade de doenças (ex: leishmaniose no verão)
- Diferenças entre espécies (cães, gatos, aves)

APPROACH:
- FOQUE em prevenção e proteção
- EVITE criar medo ou ansiedade
- DESTAQUE amor e cuidado responsável
- INCLUA aspectos de saúde pública quando relevante

COMPLIANCE RIGOROSO:
- Sempre incluir: "Consulte seu veterinário sobre o calendário adequado"
- NUNCA especificar marcas de vacinas
- NUNCA dar calendários específicos
- SEMPRE mencionar importância do acompanhamento profissional
`,

  userPrompts: {
    filhotes: `
Crie conteúdo para campanha de vacinação de FILHOTES.
Contexto: Primeiras vacinas, donos inexperientes, muita emoção envolvida.
Tom: Educativo mas tranquilizador.
Foco: Proteção e desenvolvimento saudável.
Evitar: Listas específicas de vacinas, idades exatas, marcas.
`,

    adultos: `
Crie conteúdo para REFORÇO DE VACINAS em pets adultos.
Contexto: Lembrança anual, donos já experientes.
Tom: Prático e direto, mas carinhoso.
Foco: Manutenção da saúde, prevenção de doenças sazonais.
Evitar: Dramatização, comparações com pets não vacinados.
`,

    seasonal: `
Crie conteúdo para vacinação SAZONAL (ex: leishmaniose).
Contexto: Campanha específica por época do ano.
Tom: Informativo com urgência positiva.
Foco: Proteção contra doenças específicas da estação.
Evitar: Criar pânico sobre a doença, focar no negativo.
`
  }
};
```

### 2. Banho e Tosa

```typescript
export const GROOMING_CAMPAIGN_PROMPTS = {
  systemPrompt: `
${SYSTEM_PROMPT_BASE}

ESPECIALIZAÇÃO: Serviços de banho, tosa e estética pet

CONHECIMENTO ESPECÍFICO:
- Benefícios do grooming para saúde (não apenas estética)
- Sazonalidade (verão = mais banhos, inverno = cuidados especiais)
- Diferenças entre raças e tipos de pelo
- Produtos adequados e cuidados especiais

APPROACH:
- DESTAQUE benefícios de saúde (higiene, prevenção de problemas de pele)
- INCLUA aspecto de bem-estar e conforto do pet
- VALORIZE profissionalismo e cuidado especializado
- CONECTE com vínculo emocional dono-pet

EVITAR:
- Foco apenas em "beleza" ou "aparência"
- Comparações negativas com pets não tosados
- Promessas irreais sobre comportamento pós-banho
`,

  userPrompts: {
    summer: `
Crie conteúdo para serviços de grooming no VERÃO.
Contexto: Calor, necessidade de resfriamento, higiene redobrada.
Foco: Conforto térmico, prevenção de problemas de pele.
Tom: Refrescante e cuidadoso.
`,

    winter: `
Crie conteúdo para cuidados de grooming no INVERNO.
Contexto: Ressecamento, cuidados com temperatura.
Foco: Hidratação, proteção, conforto térmico.
Tom: Acolhedor e protetivo.
`,

    puppy: `
Crie conteúdo para PRIMEIRO BANHO de filhotes.
Contexto: Experiência nova, ansiedade dos donos, adaptação.
Foco: Cuidado especial, profissionais experientes, tranquilidade.
Tom: Tranquilizador e profissional.
`
  }
};
```

### 3. Check-up e Consultas

```typescript
export const CHECKUP_CAMPAIGN_PROMPTS = {
  systemPrompt: `
${SYSTEM_PROMPT_BASE}

ESPECIALIZAÇÃO: Consultas preventivas e check-ups veterinários

CONHECIMENTO ESPECÍFICO:
- Importância da medicina preventiva
- Diferenças por idade (filhotes, adultos, idosos)
- Exames de rotina básicos (sem especificar detalhes técnicos)
- Detecção precoce como benefício principal

APPROACH:
- PRIORIZE prevenção sobre tratamento
- DESTAQUE tranquilidade e paz de espírito
- VALORIZE relacionamento duradouro vet-pet-dono
- CONECTE com amor responsável

COMPLIANCE CRÍTICO:
- NUNCA sugerir autodiagnóstico
- SEMPRE focar em prevenção, não em sintomas específicos
- EVITAR criar hipocondria nos donos
- MANTER tom positivo e encorajador
`,

  userPrompts: {
    routine: `
Crie conteúdo para CHECK-UP PREVENTIVO de rotina.
Contexto: Consulta anual/semestral, pet aparentemente saudável.
Foco: Prevenção, detecção precoce, tranquilidade.
Tom: Positivo e encorajador.
`,

    senior: `
Crie conteúdo para check-up de PETS IDOSOS.
Contexto: Cuidados especiais da idade, atenção redobrada.
Foco: Qualidade de vida, conforto na terceira idade.
Tom: Carinhoso e respeitoso com a idade.
`,

    new_pet: `
Crie conteúdo para PRIMEIRA CONSULTA de pet adotado.
Contexto: Pet novo na família, avaliação inicial.
Foco: Início de relacionamento, cuidado integral.
Tom: Acolhedor e orientativo.
`
  }
};
```

---

## 🛡️ Compliance e Segurança

### Validation Prompts

```typescript
export const COMPLIANCE_VALIDATION_PROMPT = `
Você é um especialista em compliance veterinário e comunicação responsável para negócios pet.

TAREFA: Analisar o conteúdo fornecido e identificar violações de compliance.

CRITÉRIOS DE AVALIAÇÃO:
1. ALEGAÇÕES MÉDICAS:
   - Identificar diagnósticos específicos ❌
   - Identificar promessas de cura ❌
   - Identificar prescrições de tratamentos ❌
   
2. DISCLAIMERS OBRIGATÓRIOS:
   - Verificar presença quando necessário ✅
   - Validar adequação do disclaimer ✅
   
3. TERMOS PROIBIDOS:
   - Verificar lista de termos bloqueados da marca ❌
   - Identificar linguagem sensacionalista ❌
   - Identificar comparações inadequadas ❌
   
4. RESPONSABILIDADE SOCIAL:
   - Verificar se não cria ansiedade desnecessária ✅
   - Verificar se promove bem-estar animal ✅
   - Verificar se encoraja cuidado veterinário ✅

FORMATO DE SAÍDA:
{
  "is_compliant": boolean,
  "violations": [
    {
      "type": "MEDICAL_CLAIM" | "MISSING_DISCLAIMER" | "BLOCKED_TERM" | "SENSATIONALISM",
      "severity": "low" | "medium" | "high" | "critical",
      "text_found": "texto específico encontrado",
      "explanation": "por que é uma violação",
      "suggestion": "sugestão de correção"
    }
  ],
  "required_actions": [
    "ações necessárias para correção"
  ],
  "compliance_score": number // 0-10
}
`;

// Uso do compliance validation
export async function validateContent(content: string, brandRules: BrandVoiceJSON) {
  const prompt = `
${COMPLIANCE_VALIDATION_PROMPT}

REGRAS ESPECÍFICAS DA MARCA:
- Termos bloqueados: ${brandRules.blockedTerms.join(', ')}
- Disclaimers obrigatórios: ${brandRules.complianceRules.disclaimers.join(', ')}
- Nível de rigor: ${brandRules.complianceRules.veterinary ? 'Alto' : 'Médio'}

CONTEÚDO PARA ANÁLISE:
"""
${content}
"""

Analise o conteúdo e forneça avaliação detalhada de compliance.
`;

  return await aiClient.analyze(prompt);
}
```

### Safety Filters

```typescript
export const SAFETY_FILTERS = {
  // Termos que sempre devem acionar revisão manual
  CRITICAL_TERMS: [
    'cura', 'trata', 'diagnóstica', 'prescreve',
    'única solução', 'melhor veterinário', 'mais barato',
    'urgente', 'emergência', 'grave', 'perigoso'
  ],
  
  // Padrões que indicam alegações médicas
  MEDICAL_CLAIM_PATTERNS: [
    /cura (todas|qualquer|100%)/i,
    /diagnostica(mos)? (instantaneamente|rapidamente)/i,
    /tratamento (definitivo|garantido|infalível)/i,
    /(único|melhor) (veterinário|tratamento) (da|do)/i
  ],
  
  // Verificações automáticas
  AUTO_CHECKS: {
    hasDisclaimer: (content: string) => 
      content.includes('consulte') && content.includes('veterinário'),
      
    hasBlockedTerms: (content: string, blockedTerms: string[]) =>
      blockedTerms.some(term => 
        content.toLowerCase().includes(term.toLowerCase())),
        
    hasMedicalClaims: (content: string) =>
      SAFETY_FILTERS.MEDICAL_CLAIM_PATTERNS.some(pattern => 
        pattern.test(content))
  }
};
```

---

## ⚡ Otimização e Performance

### Token Optimization

```typescript
export class PromptOptimizer {
  // Reduzir tokens mantendo qualidade
  static optimizePrompt(prompt: string): string {
    return prompt
      // Remover espaços extras
      .replace(/\s+/g, ' ')
      // Remover quebras de linha desnecessárias
      .replace(/\n\s*\n/g, '\n')
      // Usar abreviações comuns
      .replace(/você/g, 'vc')
      .replace(/porque/g, 'pq')
      // Remover palavras de conectivo em excesso
      .replace(/\b(então|assim|portanto|desta forma)\b/g, '')
      .trim();
  }
  
  // Comprimir contexto mantendo informações essenciais
  static compressBrandContext(brandVoice: BrandVoiceJSON): string {
    return `
Tom: ${brandVoice.tone}
Persona: ${brandVoice.persona}
OK: ${brandVoice.approvedTerms.slice(0, 5).join(',')}
NO: ${brandVoice.blockedTerms.slice(0, 5).join(',')}
Disclaimers: ${brandVoice.complianceRules.disclaimers[0]}
`;
  }
}
```

### Caching Strategy

```typescript
export class PromptCache {
  private cache = new Map<string, CacheEntry>();
  
  // Gerar chave de cache baseada em parâmetros relevantes
  generateCacheKey(params: {
    brandId: string;
    campaignType: string;
    channel: string;
    customInstructions?: string;
  }): string {
    const { customInstructions, ...cacheableParams } = params;
    return crypto
      .createHash('md5')
      .update(JSON.stringify(cacheableParams))
      .digest('hex');
  }
  
  // Verificar se prompt similar já foi usado
  async getCachedResult(key: string): Promise<ContentVariant[] | null> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hora
      return cached.result;
    }
    
    return null;
  }
}
```

---

## 🧪 Testing de Prompts

### Test Suite Structure

```typescript
describe('Prompt Engineering Tests', () => {
  describe('Vaccination Campaign Prompts', () => {
    it('should generate compliant content for puppy vaccination', async () => {
      const result = await generateContent({
        campaignType: 'vaccination',
        targetAudience: 'puppy_owners',
        channel: 'instagram',
        brandVoice: testBrandVoice
      });
      
      // Compliance tests
      expect(result.every(variant => 
        variant.content.includes('Consulte seu veterinário')
      )).toBe(true);
      
      expect(result.every(variant =>
        !variant.content.match(/\b(cura|trata|diagnóstica)\b/i)
      )).toBe(true);
      
      // Quality tests
      expect(result.every(variant => 
        variant.scores.compliance >= 8
      )).toBe(true);
    });
  });
  
  describe('Brand Voice Consistency', () => {
    it('should maintain brand voice across different campaigns', async () => {
      const vaccinationContent = await generateContent({
        campaignType: 'vaccination',
        brandVoice: testBrandVoice
      });
      
      const groomingContent = await generateContent({
        campaignType: 'grooming', 
        brandVoice: testBrandVoice
      });
      
      // Verificar consistência de tom
      const vaccinationTone = analyzeTone(vaccinationContent);
      const groomingTone = analyzeTone(groomingContent);
      
      expect(similarityScore(vaccinationTone, groomingTone)).toBeGreaterThan(0.8);
    });
  });
});
```

### A/B Testing Framework

```typescript
export class PromptABTesting {
  async testPromptVariants(
    basePrompt: string,
    variants: string[],
    testCriteria: TestCriteria
  ): Promise<ABTestResult> {
    const results = await Promise.all([
      this.testPrompt(basePrompt, testCriteria),
      ...variants.map(variant => this.testPrompt(variant, testCriteria))
    ]);
    
    return {
      winner: this.selectWinner(results),
      results: results,
      confidence: this.calculateConfidence(results)
    };
  }
  
  private selectWinner(results: PromptTestResult[]): PromptTestResult {
    return results.reduce((best, current) => 
      current.overallScore > best.overallScore ? current : best
    );
  }
}
```

---

## 📚 Versionamento

### Prompt Versioning System

```typescript
export const PROMPT_VERSIONS = {
  'v1.0': {
    contentGeneration: {
      system: CONTENT_GENERATION_V1_SYSTEM,
      templates: CAMPAIGN_TEMPLATES_V1
    },
    brandAnalysis: {
      system: BRAND_ANALYSIS_V1_SYSTEM
    }
  },
  
  'v1.1': {
    contentGeneration: {
      system: CONTENT_GENERATION_V1_1_SYSTEM, // Melhor compliance
      templates: CAMPAIGN_TEMPLATES_V1_1 // Novos templates pet
    },
    brandAnalysis: {
      system: BRAND_ANALYSIS_V1_1_SYSTEM // Análise mais profunda
    }
  }
} as const;

// Usage with versioning
export function getPrompt(type: PromptType, version: string = 'latest') {
  const effectiveVersion = version === 'latest' ? 'v1.1' : version;
  return PROMPT_VERSIONS[effectiveVersion][type];
}
```

### Change Log

```markdown
## Prompt Engineering Changelog

### v1.1 (2025-08-24)
- ✅ Adicionado compliance veterinário rigoroso
- ✅ Melhorada estrutura de Brand Voice integration
- ✅ Novos templates para campanhas sazonais
- ✅ Otimização de tokens (-20% consumo médio)
- ✅ Safety filters para termos críticos

### v1.0 (2025-08-01)
- ✅ Sistema base de prompts para conteúdo pet
- ✅ Templates iniciais para vacinação, grooming, check-up
- ✅ Integração com Brand Voice JSON
- ✅ Compliance básico veterinário
```

---

## 📋 Checklist de Prompt Quality

### Para Novos Prompts

- [ ] **Contexto pet específico**: Menciona conhecimento sobre pets/veterinária?
- [ ] **Brand Voice integration**: Usa variáveis de Brand Voice JSON?
- [ ] **Compliance veterinário**: Inclui disclaimers e restrições?
- [ ] **Formato de saída**: Define estrutura clara do output esperado?
- [ ] **Exemplos relevantes**: Inclui exemplos do tipo de conteúdo desejado?
- [ ] **Safety filters**: Evita termos proibidos e alegações médicas?
- [ ] **Token efficiency**: Otimizado para menor consumo possível?
- [ ] **Channel specific**: Adaptado para as limitações do canal?

### Para Testes de Qualidade

- [ ] **Consistência**: 10 execuções produzem resultados similares?
- [ ] **Compliance**: 100% dos outputs passam na validação?
- [ ] **Brand alignment**: Score médio > 8/10?
- [ ] **Engagement prediction**: Score médio > 0.7?
- [ ] **Human approval rate**: > 90% aprovado na primeira tentativa?
- [ ] **Processing time**: < 10 segundos em 95% dos casos?
- [ ] **Cost efficiency**: Dentro do budget por operação?

---

**Última atualização:** 24 de agosto de 2025  
**Versão:** 1.1  
**Status:** ✅ Completo - Prompts otimizados para agência pet