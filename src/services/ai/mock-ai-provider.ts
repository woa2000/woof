/**
 * Mock AI Provider - Simulação de operações de IA
 * 
 * Simula todas as operações de IA (OpenAI, geração de conteúdo, etc)
 * com respostas realísticas e custos mockados para desenvolvimento
 */

export interface AIResponse {
  content: string;
  tokens_used: number;
  cost_estimate: number;
  model_used: string;
  processing_time: number;
  confidence_score: number;
}

export interface BrandVoicePrompt {
  personality: string;
  tone: string;
  target_audience: string;
  industry_context: string;
}

export interface ContentGenerationRequest {
  prompt: string;
  brand_voice: BrandVoicePrompt;
  content_type: 'social_post' | 'email' | 'landing_page' | 'ad_copy';
  platform?: string;
  word_count?: number;
}

export interface ComplianceCheck {
  is_compliant: boolean;
  issues: string[];
  suggestions: string[];
  confidence: number;
}

export class MockAIProvider {
  private requestLog: Array<{
    timestamp: string;
    request: any;
    response: any;
    cost: number;
  }> = [];

  // Templates de conteúdo por tipo de negócio pet
  private contentTemplates = {
    veterinary_clinic: {
      social_post: [
        "🐕 Cuide da saúde do seu melhor amigo! Agende já a consulta preventiva e garanta mais anos de alegria juntos. {cta}",
        "🩺 Check-up veterinário em dia = pet mais feliz e família mais tranquila. Não deixe para depois! {cta}",
        "❤️ Seu pet merece o melhor cuidado. Nossa equipe está pronta para cuidar dele com todo carinho. {cta}"
      ],
      email: [
        "Olá {nome}, notamos que faz um tempo que {pet_name} não passa por aqui. Que tal agendar um check-up?",
        "Chegou a hora da vacinação de {pet_name}! Garantimos proteção e cuidado com todo amor que ele merece.",
        "Prevenção é o melhor remédio. Agende o check-up anual de {pet_name} e ganhe desconto especial."
      ],
      ad_copy: [
        "Clínica Veterinária de Confiança - Cuidamos do seu pet como família",
        "Veterinários Experientes - Tecnologia de Ponta - Preços Justos",
        "Emergência 24h - Seu pet sempre protegido, mesmo de madrugada"
      ]
    },
    pet_shop: {
      social_post: [
        "🛍️ Tudo para o seu pet em um só lugar! Ração premium, brinquedos e muito carinho. {cta}",
        "🐾 Chegaram novidades incríveis para deixar seu pet ainda mais feliz! Vem conferir! {cta}",
        "💝 Cuidar bem é mostrar amor. Encontre aqui tudo que seu pet precisa com os melhores preços. {cta}"
      ],
      email: [
        "Oi {nome}! Separamos produtos especiais para {pet_name}. Confira nossa seleção exclusiva!",
        "Promoção especial para {pet_name}! Ração premium com 30% de desconto só hoje.",
        "Novidades chegaram! Produtos que vão deixar {pet_name} ainda mais feliz e saudável."
      ],
      ad_copy: [
        "Pet Shop Completo - Ração, Brinquedos, Acessórios e Muito Mais",
        "Os Melhores Produtos Pet com Preços Imbatíveis - Entrega Rápida",
        "Tudo para seu Pet em um só Lugar - Qualidade e Economia"
      ]
    },
    grooming_salon: {
      social_post: [
        "✨ Seu pet mais bonito e cheiroso! Banho e tosa com carinho e profissionalismo. {cta}",
        "🛁 Hora do spa pet! Deixe seu peludo mais elegante e confortável. {cta}",
        "💅 Beleza pet em primeiro lugar! Unhas, banho, tosa e muito mimo. {cta}"
      ],
      email: [
        "Que tal um dia de beleza para {pet_name}? Agende seu horário de banho e tosa!",
        "Chegou a hora de {pet_name} ficar ainda mais bonito! Horários especiais disponíveis.",
        "Pacote completo de beleza para {pet_name}: banho, tosa, corte de unhas e muito carinho!"
      ],
      ad_copy: [
        "Banho e Tosa Profissional - Seu Pet Sempre Bonito e Saudável",
        "Grooming de Qualidade - Produtos Premium e Cuidado Especial",
        "Spa Pet - Beleza e Bem-estar para seu Melhor Amigo"
      ]
    }
  };

  // Simular geração de conteúdo
  async generateContent(request: ContentGenerationRequest): Promise<AIResponse> {
    // Simular tempo de processamento da IA
    await this.mockDelay(1500 + Math.random() * 2000);

    const businessType = this.inferBusinessType(request.brand_voice);
    const templates = this.contentTemplates[businessType] || this.contentTemplates.veterinary_clinic;
    const contentPool = templates[request.content_type] || templates.social_post;
    
    // Selecionar template base
    const baseTemplate = contentPool[Math.floor(Math.random() * contentPool.length)];
    
    // Personalizar baseado no brand voice
    const personalizedContent = this.personalizeContent(baseTemplate, request.brand_voice);
    
    const tokensUsed = this.estimateTokens(personalizedContent);
    const processingTime = Math.random() * 3000 + 1000; // 1-4 segundos
    
    const response: AIResponse = {
      content: personalizedContent,
      tokens_used: tokensUsed,
      cost_estimate: tokensUsed * 0.00002, // $0.02 per 1K tokens (mock price)
      model_used: 'gpt-4o-mock',
      processing_time: processingTime,
      confidence_score: 0.85 + Math.random() * 0.15 // 0.85-1.0
    };

    // Log da operação
    this.logOperation(request, response, response.cost_estimate);
    
    return response;
  }

  // Gerar múltiplas variações
  async generateVariations(request: ContentGenerationRequest, count: number = 3): Promise<AIResponse[]> {
    const variations: AIResponse[] = [];
    
    for (let i = 0; i < count; i++) {
      const variation = await this.generateContent({
        ...request,
        prompt: `${request.prompt} (variação ${i + 1})`
      });
      variations.push(variation);
    }
    
    return variations;
  }

  // Verificar compliance do conteúdo
  async checkCompliance(content: string, businessType: string = 'veterinary_clinic'): Promise<ComplianceCheck> {
    await this.mockDelay(500 + Math.random() * 1000);

    // Regras básicas de compliance para negócios pet
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Termos veterinários que requerem disclaimer
    const vetTerms = /diagnóstico|tratamento|medicamento|doença|sintoma|médico|veterinário/i;
    if (vetTerms.test(content) && businessType === 'veterinary_clinic') {
      issues.push('Conteúdo contém terminologia médica veterinária');
      suggestions.push('Adicionar disclaimer: "Não substitui consulta veterinária presencial"');
    }

    // Promessas de cura (proibidas)
    const curePromises = /cura|curar|garantimos a cura|tratamento definitivo/i;
    if (curePromises.test(content)) {
      issues.push('Conteúdo promete cura, o que não é permitido');
      suggestions.push('Substituir por: "pode auxiliar no tratamento" ou "consulte um veterinário"');
    }

    // Tom muito promocional
    const overlyPromotional = /melhor do mundo|número 1|único|exclusivo|milagroso/i;
    if (overlyPromotional.test(content)) {
      issues.push('Tom muito promocional pode gerar desconfiança');
      suggestions.push('Use linguagem mais equilibrada e baseada em fatos');
    }

    const isCompliant = issues.length === 0;
    const confidence = issues.length === 0 ? 0.95 : Math.max(0.3, 0.9 - (issues.length * 0.2));

    return {
      is_compliant: isCompliant,
      issues,
      suggestions,
      confidence
    };
  }

  // Analisar performance de conteúdo
  async predictPerformance(content: string, platform: string = 'instagram'): Promise<{
    engagement_score: number;
    reach_estimate: number;
    conversion_probability: number;
    recommendations: string[];
  }> {
    await this.mockDelay(800);

    // Fatores que influenciam performance
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(content);
    const hasHashtags = /#\w+/.test(content);
    const hasCallToAction = /agende|ligue|clique|saiba mais|conheça/i.test(content);
    const length = content.length;
    
    let engagementScore = 0.5; // Base score
    
    if (hasEmojis) engagementScore += 0.15;
    if (hasHashtags) engagementScore += 0.1;
    if (hasCallToAction) engagementScore += 0.2;
    if (length > 50 && length < 200) engagementScore += 0.1; // Sweet spot
    
    // Ajustes por plataforma
    const platformMultipliers = {
      instagram: 1.0,
      facebook: 0.9,
      linkedin: 0.7,
      twitter: 0.8
    };
    
    engagementScore *= platformMultipliers[platform as keyof typeof platformMultipliers] || 1.0;
    engagementScore = Math.min(engagementScore, 1.0);

    const reachEstimate = Math.floor(1000 + (engagementScore * 5000) + Math.random() * 2000);
    const conversionProb = engagementScore * 0.05; // 0-5% conversion rate

    const recommendations = [];
    if (!hasEmojis) recommendations.push('Adicione emojis para aumentar engajamento');
    if (!hasCallToAction) recommendations.push('Inclua um call-to-action claro');
    if (length > 250) recommendations.push('Texto muito longo, considere encurtar');
    if (!hasHashtags) recommendations.push('Use hashtags relevantes para alcance');

    return {
      engagement_score: Number(engagementScore.toFixed(2)),
      reach_estimate: reachEstimate,
      conversion_probability: Number(conversionProb.toFixed(3)),
      recommendations
    };
  }

  // Obter logs de operações
  getOperationLogs(): Array<any> {
    return this.requestLog.slice(-50); // Últimas 50 operações
  }

  // Obter custos totais
  getTotalCosts(): { total: number; count: number; average: number } {
    const total = this.requestLog.reduce((sum, log) => sum + log.cost, 0);
    const count = this.requestLog.length;
    const average = count > 0 ? total / count : 0;

    return {
      total: Number(total.toFixed(4)),
      count,
      average: Number(average.toFixed(4))
    };
  }

  // Métodos privados auxiliares
  private async mockDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private inferBusinessType(brandVoice: BrandVoicePrompt): keyof typeof this.contentTemplates {
    const context = brandVoice.industry_context.toLowerCase();
    
    if (context.includes('veterinári') || context.includes('clínica')) {
      return 'veterinary_clinic';
    } else if (context.includes('pet shop') || context.includes('loja')) {
      return 'pet_shop';
    } else if (context.includes('banho') || context.includes('tosa') || context.includes('grooming')) {
      return 'grooming_salon';
    }
    
    return 'veterinary_clinic'; // Default
  }

  private personalizeContent(template: string, brandVoice: BrandVoicePrompt): string {
    let content = template;
    
    // Substituir placeholders
    content = content.replace('{cta}', 'Agende já! 📞');
    content = content.replace('{nome}', 'Cliente');
    content = content.replace('{pet_name}', 'seu pet');
    
    // Ajustar tom baseado no brand voice
    if (brandVoice.tone === 'formal') {
      content = content.replace(/!+/g, '.');
      content = content.replace(/😊|😃|🥰/g, '');
    } else if (brandVoice.tone === 'casual') {
      if (!content.includes('!')) {
        content += ' 😊';
      }
    }
    
    return content;
  }

  private estimateTokens(text: string): number {
    // Estimativa simples: ~4 chars = 1 token
    return Math.ceil(text.length / 4);
  }

  private logOperation(request: any, response: any, cost: number): void {
    this.requestLog.push({
      timestamp: new Date().toISOString(),
      request,
      response,
      cost
    });
    
    // Manter apenas os últimos 100 logs
    if (this.requestLog.length > 100) {
      this.requestLog = this.requestLog.slice(-100);
    }
  }
}