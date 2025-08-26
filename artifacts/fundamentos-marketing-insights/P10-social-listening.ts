// SISTEMA DE SOCIAL LISTENING AUTOMATIZADO - AGÊNCIA PET
// Implementado por: AI_Engineer durante Sprint 6-8
// Monitoramento inteligente de redes sociais com análise de sentimento e IA

import { createClient } from '@supabase/supabase-js';

// =====================================================
// INTERFACES DE SOCIAL LISTENING
// =====================================================

export interface SocialMention {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'youtube';
  mention_type: 'mention' | 'hashtag' | 'comment' | 'review' | 'story';
  content: string;
  author: {
    username: string;
    display_name: string;
    followers_count: number;
    verified: boolean;
    profile_image?: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  sentiment: {
    score: number; // -1 to 1 (negative to positive)
    label: 'positive' | 'negative' | 'neutral';
    confidence: number; // 0 to 1
    emotions: {
      joy: number;
      anger: number;
      fear: number;
      sadness: number;
      surprise: number;
    };
  };
  keywords_detected: string[];
  location?: {
    city: string;
    state: string;
    country: string;
  };
  created_at: string;
  collected_at: string;
  relevance_score: number; // 0 to 100
}

export interface BrandMonitoring {
  id: string;
  user_id: string;
  brand_name: string;
  keywords_monitored: string[];
  hashtags_monitored: string[];
  competitors_monitored: string[];
  platforms_active: string[];
  monitoring_settings: {
    sentiment_threshold: number;
    relevance_threshold: number;
    alert_keywords: string[];
    exclusion_keywords: string[];
    languages: string[];
    regions: string[];
  };
  alerts_config: {
    email_alerts: boolean;
    push_notifications: boolean;
    webhook_url?: string;
    alert_frequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  };
  created_at: string;
  last_update: string;
}

export interface SentimentAnalysis {
  period: {
    start: string;
    end: string;
  };
  metrics: {
    total_mentions: number;
    positive_mentions: number;
    negative_mentions: number;
    neutral_mentions: number;
    average_sentiment: number;
    sentiment_trend: 'improving' | 'declining' | 'stable';
  };
  top_keywords: Array<{
    keyword: string;
    mentions: number;
    sentiment_avg: number;
  }>;
  influencers_detected: Array<{
    username: string;
    platform: string;
    followers: number;
    mentions_count: number;
    sentiment_avg: number;
  }>;
  geographic_insights: Array<{
    location: string;
    mentions: number;
    sentiment_avg: number;
  }>;
  competitive_analysis: Array<{
    competitor: string;
    mentions: number;
    sentiment_avg: number;
    share_of_voice: number;
  }>;
}

export interface CrisisAlert {
  id: string;
  brand_id: string;
  alert_type: 'negative_spike' | 'viral_negative' | 'competitor_crisis' | 'reputation_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  trigger_conditions: {
    negative_mentions_spike: boolean;
    sentiment_drop_threshold: boolean;
    viral_content_detected: boolean;
    keyword_alerts_triggered: string[];
  };
  affected_platforms: string[];
  estimated_reach: number;
  recommended_actions: string[];
  created_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

// =====================================================
// SISTEMA DE ANÁLISE DE SENTIMENTO COM IA
// =====================================================

export class SentimentAnalyzer {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  async analyzeSentiment(content: string, context: 'veterinary' | 'pet_care' | 'general' = 'general'): Promise<SocialMention['sentiment']> {
    try {
      const prompt = this.buildSentimentPrompt(content, context);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a specialized sentiment analysis AI for veterinary and pet care content. Return only valid JSON.'
            },
            {
              role: 'user', 
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      return {
        score: this.normalizeScore(result.score),
        label: this.determineLabel(result.score),
        confidence: result.confidence || 0.8,
        emotions: {
          joy: result.emotions?.joy || 0,
          anger: result.emotions?.anger || 0,
          fear: result.emotions?.fear || 0,
          sadness: result.emotions?.sadness || 0,
          surprise: result.emotions?.surprise || 0
        }
      };

    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      // Fallback para análise básica
      return this.fallbackSentimentAnalysis(content);
    }
  }

  private buildSentimentPrompt(content: string, context: string): string {
    const contextPrompts = {
      veterinary: `
Analise o sentimento desta menção relacionada a serviços veterinários.
Considere aspectos específicos do setor pet:
- Preocupação com saúde animal
- Satisfação com atendimento veterinário
- Custos de tratamentos
- Experiências em clínicas
- Resultados de tratamentos
      `,
      pet_care: `
Analise o sentimento desta menção sobre cuidados com pets.
Considere aspectos como:
- Bem-estar animal
- Produtos para pets
- Serviços de pet shop/banho e tosa
- Experiências com pets
- Dicas e conselhos
      `,
      general: `
Analise o sentimento geral desta menção relacionada ao universo pet.
      `
    };

    return `
${contextPrompts[context]}

TEXTO PARA ANÁLISE:
"${content}"

Retorne a análise em JSON com esta estrutura:
{
  "score": número entre -1 e 1 (negativo para positivo),
  "confidence": número entre 0 e 1,
  "emotions": {
    "joy": número entre 0 e 1,
    "anger": número entre 0 e 1,
    "fear": número entre 0 e 1,
    "sadness": número entre 0 e 1,
    "surprise": número entre 0 e 1
  },
  "reasoning": "explicação breve da análise",
  "keywords_sentiment": ["palavras-chave que influenciaram o sentimento"]
}
    `;
  }

  private normalizeScore(score: number): number {
    return Math.max(-1, Math.min(1, score));
  }

  private determineLabel(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 0.1) return 'positive';
    if (score < -0.1) return 'negative';
    return 'neutral';
  }

  private fallbackSentimentAnalysis(content: string): SocialMention['sentiment'] {
    // Análise simples baseada em palavras-chave
    const positiveWords = [
      'excelente', 'ótimo', 'bom', 'amor', 'carinho', 'cuidado', 'recomendo',
      'satisfeito', 'feliz', 'grato', 'profissional', 'atencioso'
    ];
    
    const negativeWords = [
      'ruim', 'péssimo', 'horrível', 'decepcionado', 'insatisfeito', 'caro',
      'demora', 'mal atendimento', 'não recomendo', 'problema'
    ];

    const contentLower = content.toLowerCase();
    let score = 0;

    positiveWords.forEach(word => {
      if (contentLower.includes(word)) score += 0.2;
    });

    negativeWords.forEach(word => {
      if (contentLower.includes(word)) score -= 0.2;
    });

    return {
      score: Math.max(-1, Math.min(1, score)),
      label: this.determineLabel(score),
      confidence: 0.6, // Menor confiança para fallback
      emotions: {
        joy: score > 0 ? Math.abs(score) : 0,
        anger: score < 0 ? Math.abs(score) : 0,
        fear: 0,
        sadness: 0,
        surprise: 0
      }
    };
  }
}

// =====================================================
// SISTEMA DE MONITORAMENTO DE REDES SOCIAIS
// =====================================================

export class SocialListeningEngine {
  private supabase;
  private sentimentAnalyzer: SentimentAnalyzer;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.sentimentAnalyzer = new SentimentAnalyzer();
  }

  // Configurar monitoramento de marca
  async setupBrandMonitoring(config: Omit<BrandMonitoring, 'id' | 'created_at' | 'last_update'>): Promise<string> {
    try {
      const brandMonitoring: BrandMonitoring = {
        ...config,
        id: `brand_${Date.now()}`,
        created_at: new Date().toISOString(),
        last_update: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('brand_monitoring')
        .insert(brandMonitoring)
        .select('id')
        .single();

      if (error) throw error;

      // Iniciar coleta de dados históricos
      await this.startHistoricalCollection(brandMonitoring.id);

      return data.id;
    } catch (error) {
      console.error('Error setting up brand monitoring:', error);
      throw error;
    }
  }

  // Coletar menções de redes sociais (simulação - integração real com APIs)
  async collectSocialMentions(brandId: string): Promise<SocialMention[]> {
    try {
      // Buscar configuração de monitoramento
      const { data: brandConfig, error } = await this.supabase
        .from('brand_monitoring')
        .select('*')
        .eq('id', brandId)
        .single();

      if (error || !brandConfig) {
        throw new Error('Brand monitoring configuration not found');
      }

      // Simular coleta de menções (em produção, integraria com APIs reais)
      const mockMentions = await this.simulateMentionCollection(brandConfig);

      // Processar cada menção com análise de sentimento
      const processedMentions: SocialMention[] = [];

      for (const mention of mockMentions) {
        const sentiment = await this.sentimentAnalyzer.analyzeSentiment(
          mention.content, 
          'veterinary'
        );

        const processedMention: SocialMention = {
          ...mention,
          sentiment,
          keywords_detected: this.extractKeywords(mention.content, brandConfig.keywords_monitored),
          relevance_score: this.calculateRelevanceScore(mention, brandConfig),
          collected_at: new Date().toISOString()
        };

        processedMentions.push(processedMention);

        // Salvar no banco
        await this.saveMention(processedMention, brandId);
      }

      // Verificar alertas de crise
      await this.checkCrisisAlerts(brandId, processedMentions);

      return processedMentions;

    } catch (error) {
      console.error('Error collecting social mentions:', error);
      throw error;
    }
  }

  private async simulateMentionCollection(brandConfig: BrandMonitoring): Promise<Partial<SocialMention>[]> {
    // Simulação de dados - em produção, faria calls para APIs das redes sociais
    const platforms: SocialMention['platform'][] = ['instagram', 'facebook', 'twitter'];
    const mockMentions: Partial<SocialMention>[] = [];

    const sampleContents = [
      `Levei meu ${brandConfig.brand_name} na clínica hoje, atendimento excelente! Recomendo muito.`,
      `Experiência incrível no ${brandConfig.brand_name}. Profissionais muito atenciosos com meu pet.`,
      `${brandConfig.brand_name} salvou meu gatinho! Tratamento rápido e eficiente.`,
      `Preço um pouco alto no ${brandConfig.brand_name}, mas a qualidade compensa.`,
      `Demora no atendimento do ${brandConfig.brand_name}. Esperamos muito tempo.`,
      `${brandConfig.brand_name} tem os melhores veterinários da região! Super indico.`,
      `Meu cachorro adora ir no ${brandConfig.brand_name}. Ambiente muito acolhedor.`,
      `${brandConfig.brand_name} sempre cuida bem dos meus pets. Confiança total!`
    ];

    for (let i = 0; i < 8; i++) {
      const platform = platforms[i % platforms.length];
      
      mockMentions.push({
        id: `mention_${Date.now()}_${i}`,
        platform,
        mention_type: 'mention',
        content: sampleContents[i % sampleContents.length],
        author: {
          username: `user_${i + 1}`,
          display_name: `Pet Lover ${i + 1}`,
          followers_count: Math.floor(Math.random() * 5000) + 100,
          verified: Math.random() > 0.8
        },
        engagement: {
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 10),
          shares: Math.floor(Math.random() * 5)
        },
        created_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() // Última semana
      });
    }

    return mockMentions;
  }

  private extractKeywords(content: string, monitoredKeywords: string[]): string[] {
    const contentLower = content.toLowerCase();
    const detectedKeywords: string[] = [];

    // Verificar keywords monitoradas
    monitoredKeywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        detectedKeywords.push(keyword);
      }
    });

    // Detectar keywords do universo pet
    const petKeywords = [
      'veterinário', 'veterinária', 'clínica', 'pet', 'cachorro', 'gato', 'animal',
      'consulta', 'vacina', 'tratamento', 'cirurgia', 'exame', 'medicamento',
      'atendimento', 'cuidado', 'saúde', 'emergência'
    ];

    petKeywords.forEach(keyword => {
      if (contentLower.includes(keyword) && !detectedKeywords.includes(keyword)) {
        detectedKeywords.push(keyword);
      }
    });

    return detectedKeywords.slice(0, 10); // Limitar a 10 keywords
  }

  private calculateRelevanceScore(mention: Partial<SocialMention>, brandConfig: BrandMonitoring): number {
    let score = 0;

    // Score baseado em menção direta da marca
    if (mention.content?.toLowerCase().includes(brandConfig.brand_name.toLowerCase())) {
      score += 40;
    }

    // Score baseado em keywords monitoradas
    const keywordsFound = brandConfig.keywords_monitored.filter(keyword =>
      mention.content?.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    score += Math.min(keywordsFound * 10, 30);

    // Score baseado em engajamento
    if (mention.engagement) {
      const totalEngagement = mention.engagement.likes + mention.engagement.comments + mention.engagement.shares;
      score += Math.min(totalEngagement * 0.5, 20);
    }

    // Score baseado em influência do autor
    if (mention.author) {
      if (mention.author.verified) score += 5;
      if (mention.author.followers_count > 1000) score += 5;
      if (mention.author.followers_count > 10000) score += 5;
    }

    return Math.min(score, 100);
  }

  private async saveMention(mention: SocialMention, brandId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('social_mentions')
        .insert({
          id: mention.id,
          brand_id: brandId,
          platform: mention.platform,
          mention_type: mention.mention_type,
          content: mention.content,
          author: mention.author,
          engagement: mention.engagement,
          sentiment: mention.sentiment,
          keywords_detected: mention.keywords_detected,
          location: mention.location,
          created_at: mention.created_at,
          collected_at: mention.collected_at,
          relevance_score: mention.relevance_score
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving mention:', error);
    }
  }

  // Verificar alertas de crise
  private async checkCrisisAlerts(brandId: string, mentions: SocialMention[]): Promise<void> {
    try {
      // Buscar configuração de alertas
      const { data: brandConfig } = await this.supabase
        .from('brand_monitoring')
        .select('*')
        .eq('id', brandId)
        .single();

      if (!brandConfig) return;

      // Análise de spike negativo
      const negativeMentions = mentions.filter(m => m.sentiment.label === 'negative');
      const negativeRatio = negativeMentions.length / mentions.length;

      if (negativeRatio > 0.6 && mentions.length > 5) {
        await this.createCrisisAlert({
          brand_id: brandId,
          alert_type: 'negative_spike',
          severity: 'high',
          trigger_conditions: {
            negative_mentions_spike: true,
            sentiment_drop_threshold: true,
            viral_content_detected: false,
            keyword_alerts_triggered: []
          },
          affected_platforms: [...new Set(negativeMentions.map(m => m.platform))],
          estimated_reach: negativeMentions.reduce((sum, m) => sum + (m.author.followers_count || 0), 0),
          recommended_actions: [
            'Monitorar situação de perto',
            'Preparar resposta oficial se necessário',
            'Identificar fonte dos comentários negativos',
            'Considerar ação proativa de comunicação'
          ]
        });
      }

      // Verificar keywords de alerta
      const alertKeywords = brandConfig.monitoring_settings.alert_keywords || [];
      const triggeredKeywords = alertKeywords.filter(keyword =>
        mentions.some(m => m.keywords_detected.includes(keyword))
      );

      if (triggeredKeywords.length > 0) {
        await this.createCrisisAlert({
          brand_id: brandId,
          alert_type: 'reputation_risk',
          severity: 'medium',
          trigger_conditions: {
            negative_mentions_spike: false,
            sentiment_drop_threshold: false,
            viral_content_detected: false,
            keyword_alerts_triggered: triggeredKeywords
          },
          affected_platforms: [...new Set(mentions.map(m => m.platform))],
          estimated_reach: mentions.reduce((sum, m) => sum + (m.author.followers_count || 0), 0),
          recommended_actions: [
            `Keywords de alerta detectadas: ${triggeredKeywords.join(', ')}`,
            'Revisar menções específicas',
            'Avaliar necessidade de resposta'
          ]
        });
      }

    } catch (error) {
      console.error('Error checking crisis alerts:', error);
    }
  }

  private async createCrisisAlert(alertData: Omit<CrisisAlert, 'id' | 'created_at'>): Promise<void> {
    try {
      const alert: CrisisAlert = {
        ...alertData,
        id: `alert_${Date.now()}`,
        created_at: new Date().toISOString()
      };

      const { error } = await this.supabase
        .from('crisis_alerts')
        .insert(alert);

      if (error) throw error;

      // Enviar notificações se configurado
      await this.sendAlertNotifications(alert);

    } catch (error) {
      console.error('Error creating crisis alert:', error);
    }
  }

  private async sendAlertNotifications(alert: CrisisAlert): Promise<void> {
    // Implementar envio de notificações (email, push, webhook)
    console.log('Crisis Alert Created:', alert);
    
    // Em produção, integraria com serviços de notificação
    // - SendGrid para emails
    // - Firebase para push notifications  
    // - Webhooks para integrações
  }

  // Análise de sentimento agregada
  async generateSentimentAnalysis(
    brandId: string, 
    startDate: string, 
    endDate: string
  ): Promise<SentimentAnalysis> {
    try {
      const { data: mentions, error } = await this.supabase
        .from('social_mentions')
        .select('*')
        .eq('brand_id', brandId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      const totalMentions = mentions?.length || 0;
      if (totalMentions === 0) {
        throw new Error('No mentions found for the specified period');
      }

      // Calcular métricas de sentimento
      const positiveMentions = mentions.filter(m => m.sentiment.label === 'positive').length;
      const negativeMentions = mentions.filter(m => m.sentiment.label === 'negative').length;
      const neutralMentions = mentions.filter(m => m.sentiment.label === 'neutral').length;

      const averageSentiment = mentions.reduce((sum, m) => sum + m.sentiment.score, 0) / totalMentions;

      // Calcular tendência (comparando com período anterior)
      const previousPeriodStart = new Date(new Date(startDate).getTime() - (new Date(endDate).getTime() - new Date(startDate).getTime()));
      const { data: previousMentions } = await this.supabase
        .from('social_mentions')
        .select('sentiment')
        .eq('brand_id', brandId)
        .gte('created_at', previousPeriodStart.toISOString())
        .lt('created_at', startDate);

      let sentimentTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (previousMentions && previousMentions.length > 0) {
        const previousAvgSentiment = previousMentions.reduce((sum, m) => sum + m.sentiment.score, 0) / previousMentions.length;
        const trendDiff = averageSentiment - previousAvgSentiment;
        
        if (trendDiff > 0.1) sentimentTrend = 'improving';
        else if (trendDiff < -0.1) sentimentTrend = 'declining';
      }

      // Top keywords
      const keywordCount: Record<string, { count: number; sentiment_sum: number }> = {};
      mentions.forEach(mention => {
        mention.keywords_detected.forEach((keyword: string) => {
          if (!keywordCount[keyword]) {
            keywordCount[keyword] = { count: 0, sentiment_sum: 0 };
          }
          keywordCount[keyword].count++;
          keywordCount[keyword].sentiment_sum += mention.sentiment.score;
        });
      });

      const topKeywords = Object.entries(keywordCount)
        .map(([keyword, data]) => ({
          keyword,
          mentions: data.count,
          sentiment_avg: data.sentiment_sum / data.count
        }))
        .sort((a, b) => b.mentions - a.mentions)
        .slice(0, 10);

      // Influencers detectados
      const influencers = mentions
        .filter(m => m.author.followers_count > 1000)
        .reduce((acc, mention) => {
          const key = `${mention.author.username}_${mention.platform}`;
          if (!acc[key]) {
            acc[key] = {
              username: mention.author.username,
              platform: mention.platform,
              followers: mention.author.followers_count,
              mentions_count: 0,
              sentiment_sum: 0
            };
          }
          acc[key].mentions_count++;
          acc[key].sentiment_sum += mention.sentiment.score;
          return acc;
        }, {} as Record<string, any>);

      const influencersDetected = Object.values(influencers)
        .map((inf: any) => ({
          ...inf,
          sentiment_avg: inf.sentiment_sum / inf.mentions_count
        }))
        .sort((a: any, b: any) => b.followers - a.followers)
        .slice(0, 5);

      return {
        period: {
          start: startDate,
          end: endDate
        },
        metrics: {
          total_mentions: totalMentions,
          positive_mentions: positiveMentions,
          negative_mentions: negativeMentions,
          neutral_mentions: neutralMentions,
          average_sentiment: Math.round(averageSentiment * 100) / 100,
          sentiment_trend: sentimentTrend
        },
        top_keywords: topKeywords,
        influencers_detected: influencersDetected,
        geographic_insights: [], // Implementar se dados de localização estiverem disponíveis
        competitive_analysis: [] // Implementar análise competitiva
      };

    } catch (error) {
      console.error('Error generating sentiment analysis:', error);
      throw error;
    }
  }

  // Coleta histórica inicial
  private async startHistoricalCollection(brandId: string): Promise<void> {
    try {
      // Simular coleta de dados históricos dos últimos 30 dias
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Em produção, faria múltiplas chamadas para APIs com diferentes datas
      await this.collectSocialMentions(brandId);
      
      console.log(`Historical collection started for brand ${brandId}`);
    } catch (error) {
      console.error('Error in historical collection:', error);
    }
  }
}

// =====================================================
// SISTEMA DE ALERTAS E NOTIFICAÇÕES
// =====================================================

export class AlertNotificationSystem {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async getActiveAlerts(brandId: string): Promise<CrisisAlert[]> {
    try {
      const { data, error } = await this.supabase
        .from('crisis_alerts')
        .select('*')
        .eq('brand_id', brandId)
        .is('resolved_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      return [];
    }
  }

  async resolveAlert(alertId: string, resolutionNotes: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('crisis_alerts')
        .update({
          resolved_at: new Date().toISOString(),
          resolution_notes: resolutionNotes
        })
        .eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  }
}

// =====================================================
// EXPORTAÇÕES E INSTÂNCIAS
// =====================================================

export const socialListeningEngine = new SocialListeningEngine();
export const sentimentAnalyzer = new SentimentAnalyzer();
export const alertSystem = new AlertNotificationSystem();

// Utilitários para componentes
export const formatSentimentScore = (score: number): string => {
  if (score > 0.5) return 'Muito Positivo';
  if (score > 0.1) return 'Positivo';
  if (score > -0.1) return 'Neutro';
  if (score > -0.5) return 'Negativo';
  return 'Muito Negativo';
};

export const getSentimentColor = (sentiment: SocialMention['sentiment']['label']): string => {
  const colors = {
    positive: 'text-green-600 bg-green-50 border-green-200',
    negative: 'text-red-600 bg-red-50 border-red-200',
    neutral: 'text-gray-600 bg-gray-50 border-gray-200'
  };
  
  return colors[sentiment];
};

export const getPlatformIcon = (platform: SocialMention['platform']): string => {
  const icons = {
    instagram: '📷',
    facebook: '👥', 
    twitter: '🐦',
    tiktok: '🎵',
    youtube: '📺'
  };
  
  return icons[platform] || '📱';
};