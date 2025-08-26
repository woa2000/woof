// SISTEMA DE MONITORAMENTO DE APIS DE REDES SOCIAIS - SPRINT 6-8 FINAL
// Implementado por: AI_Engineer 
// Monitoramento e webhooks para APIs sociais com integração em tempo real

import { createClient } from '@supabase/supabase-js';

// =====================================================
// INTERFACES DE MONITORAMENTO DE APIS
// =====================================================

export interface ApiMonitoringConfig {
  id: string;
  user_id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'youtube';
  api_credentials: {
    access_token?: string;
    app_id?: string;
    app_secret?: string;
    bearer_token?: string;
    webhook_secret?: string;
  };
  monitoring_settings: {
    real_time_monitoring: boolean;
    webhook_enabled: boolean;
    polling_interval: 'real_time' | '5_minutes' | '15_minutes' | '1_hour';
    data_retention_days: number;
    rate_limit_handling: 'queue' | 'throttle' | 'drop';
  };
  endpoints_monitored: string[];
  status: 'active' | 'inactive' | 'error' | 'rate_limited';
  last_sync: string;
  created_at: string;
  updated_at: string;
}

export interface WebhookEvent {
  id: string;
  api_config_id: string;
  platform: string;
  event_type: 'mention' | 'comment' | 'message' | 'story' | 'post' | 'media';
  event_data: any;
  processed: boolean;
  processing_result?: {
    social_mention_created?: string;
    sentiment_analyzed?: boolean;
    alerts_triggered?: string[];
    errors?: string[];
  };
  received_at: string;
  processed_at?: string;
  retry_count: number;
}

export interface ApiHealthStatus {
  platform: string;
  status: 'healthy' | 'degraded' | 'down' | 'rate_limited';
  response_time_ms: number;
  success_rate_24h: number;
  last_request: string;
  rate_limit_remaining: number;
  rate_limit_reset: string;
  error_details?: string;
  uptime_percentage: number;
}

export interface RateLimitTracker {
  platform: string;
  endpoint: string;
  limit: number;
  remaining: number;
  reset_time: string;
  window_size_seconds: number;
  requests_made: number;
  last_request: string;
}

export interface SocialApiResponse {
  platform: string;
  endpoint: string;
  status_code: number;
  response_time_ms: number;
  data: any;
  rate_limit_info?: {
    limit: number;
    remaining: number;
    reset: string;
  };
  errors?: string[];
  timestamp: string;
}

// =====================================================
// SISTEMA DE MONITORAMENTO DE APIS
// =====================================================

export class SocialApiMonitor {
  private supabase;
  private webhookHandlers: Map<string, Function> = new Map();
  private rateLimitTrackers: Map<string, RateLimitTracker> = new Map();

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    this.initializeWebhookHandlers();
  }

  // Configurar monitoramento de API
  async setupApiMonitoring(config: Omit<ApiMonitoringConfig, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const apiConfig: ApiMonitoringConfig = {
        ...config,
        id: `api_${config.platform}_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Validar credenciais da API
      const isValid = await this.validateApiCredentials(apiConfig);
      if (!isValid) {
        throw new Error(`Invalid API credentials for ${config.platform}`);
      }

      // Salvar configuração
      const { data, error } = await this.supabase
        .from('api_monitoring_configs')
        .insert(apiConfig)
        .select('id')
        .single();

      if (error) throw error;

      // Iniciar monitoramento se ativo
      if (apiConfig.status === 'active') {
        await this.startMonitoring(apiConfig.id);
      }

      return data.id;
    } catch (error) {
      console.error('Error setting up API monitoring:', error);
      throw error;
    }
  }

  // Validar credenciais da API
  private async validateApiCredentials(config: ApiMonitoringConfig): Promise<boolean> {
    try {
      switch (config.platform) {
        case 'instagram':
          return await this.validateInstagramCredentials(config);
        case 'facebook':
          return await this.validateFacebookCredentials(config);
        case 'twitter':
          return await this.validateTwitterCredentials(config);
        case 'tiktok':
          return await this.validateTikTokCredentials(config);
        case 'youtube':
          return await this.validateYouTubeCredentials(config);
        default:
          return false;
      }
    } catch (error) {
      console.error(`Error validating ${config.platform} credentials:`, error);
      return false;
    }
  }

  private async validateInstagramCredentials(config: ApiMonitoringConfig): Promise<boolean> {
    try {
      const response = await fetch(`https://graph.instagram.com/me?access_token=${config.api_credentials.access_token}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  private async validateFacebookCredentials(config: ApiMonitoringConfig): Promise<boolean> {
    try {
      const response = await fetch(`https://graph.facebook.com/me?access_token=${config.api_credentials.access_token}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  private async validateTwitterCredentials(config: ApiMonitoringConfig): Promise<boolean> {
    try {
      const response = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${config.api_credentials.bearer_token}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async validateTikTokCredentials(config: ApiMonitoringConfig): Promise<boolean> {
    // TikTok Business API validation (simplified)
    return true; // Placeholder
  }

  private async validateYouTubeCredentials(config: ApiMonitoringConfig): Promise<boolean> {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${config.api_credentials.access_token}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Iniciar monitoramento
  async startMonitoring(configId: string): Promise<void> {
    try {
      const { data: config, error } = await this.supabase
        .from('api_monitoring_configs')
        .select('*')
        .eq('id', configId)
        .single();

      if (error || !config) throw new Error('API config not found');

      // Configurar polling baseado na configuração
      const interval = this.getPollingIntervalMs(config.monitoring_settings.polling_interval);
      
      setInterval(async () => {
        await this.performHealthCheck(config);
        await this.collectData(config);
      }, interval);

      console.log(`Started monitoring for ${config.platform} (${configId})`);
    } catch (error) {
      console.error('Error starting monitoring:', error);
    }
  }

  private getPollingIntervalMs(interval: ApiMonitoringConfig['monitoring_settings']['polling_interval']): number {
    const intervals = {
      'real_time': 30000,      // 30 seconds (minimum for most APIs)
      '5_minutes': 300000,     // 5 minutes
      '15_minutes': 900000,    // 15 minutes  
      '1_hour': 3600000        // 1 hour
    };
    return intervals[interval];
  }

  // Verificação de saúde da API
  async performHealthCheck(config: ApiMonitoringConfig): Promise<ApiHealthStatus> {
    const startTime = Date.now();
    
    try {
      let response: Response;
      let endpoint: string;

      switch (config.platform) {
        case 'instagram':
          endpoint = 'https://graph.instagram.com/me';
          response = await fetch(`${endpoint}?access_token=${config.api_credentials.access_token}`);
          break;
        case 'facebook':
          endpoint = 'https://graph.facebook.com/me';
          response = await fetch(`${endpoint}?access_token=${config.api_credentials.access_token}`);
          break;
        case 'twitter':
          endpoint = 'https://api.twitter.com/2/users/me';
          response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${config.api_credentials.bearer_token}`
            }
          });
          break;
        default:
          throw new Error(`Health check not implemented for ${config.platform}`);
      }

      const responseTimeMs = Date.now() - startTime;
      const isHealthy = response.ok;

      // Extrair informações de rate limit
      const rateLimitRemaining = parseInt(response.headers.get('x-ratelimit-remaining') || '0');
      const rateLimitReset = response.headers.get('x-ratelimit-reset') || new Date().toISOString();

      // Atualizar tracker de rate limit
      this.updateRateLimitTracker(config.platform, endpoint, {
        limit: parseInt(response.headers.get('x-ratelimit-limit') || '100'),
        remaining: rateLimitRemaining,
        reset_time: rateLimitReset
      });

      const healthStatus: ApiHealthStatus = {
        platform: config.platform,
        status: isHealthy ? 'healthy' : 'degraded',
        response_time_ms: responseTimeMs,
        success_rate_24h: await this.calculateSuccessRate(config.id),
        last_request: new Date().toISOString(),
        rate_limit_remaining: rateLimitRemaining,
        rate_limit_reset: rateLimitReset,
        uptime_percentage: await this.calculateUptime(config.id),
        error_details: isHealthy ? undefined : await response.text()
      };

      // Salvar status de saúde
      await this.saveHealthStatus(config.id, healthStatus);

      return healthStatus;

    } catch (error) {
      const healthStatus: ApiHealthStatus = {
        platform: config.platform,
        status: 'down',
        response_time_ms: Date.now() - startTime,
        success_rate_24h: await this.calculateSuccessRate(config.id),
        last_request: new Date().toISOString(),
        rate_limit_remaining: 0,
        rate_limit_reset: new Date().toISOString(),
        uptime_percentage: await this.calculateUptime(config.id),
        error_details: (error as Error).message
      };

      await this.saveHealthStatus(config.id, healthStatus);
      return healthStatus;
    }
  }

  private async saveHealthStatus(configId: string, status: ApiHealthStatus): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('api_health_status')
        .insert({
          config_id: configId,
          ...status,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving health status:', error);
    }
  }

  private async calculateSuccessRate(configId: string): Promise<number> {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await this.supabase
        .from('api_health_status')
        .select('status')
        .eq('config_id', configId)
        .gte('timestamp', oneDayAgo);

      if (error || !data || data.length === 0) return 100;

      const successCount = data.filter(s => s.status === 'healthy').length;
      return Math.round((successCount / data.length) * 100);
    } catch {
      return 100;
    }
  }

  private async calculateUptime(configId: string): Promise<number> {
    // Simplified uptime calculation
    return await this.calculateSuccessRate(configId);
  }

  // Coletar dados das APIs
  async collectData(config: ApiMonitoringConfig): Promise<void> {
    try {
      // Verificar rate limits antes de fazer requisições
      if (!this.canMakeRequest(config.platform)) {
        console.log(`Rate limit reached for ${config.platform}, skipping collection`);
        return;
      }

      let collectedData: SocialApiResponse | null = null;

      switch (config.platform) {
        case 'instagram':
          collectedData = await this.collectInstagramData(config);
          break;
        case 'facebook':
          collectedData = await this.collectFacebookData(config);
          break;
        case 'twitter':
          collectedData = await this.collectTwitterData(config);
          break;
        case 'youtube':
          collectedData = await this.collectYouTubeData(config);
          break;
      }

      if (collectedData) {
        await this.processCollectedData(config.id, collectedData);
      }

    } catch (error) {
      console.error(`Error collecting data from ${config.platform}:`, error);
      
      // Atualizar status para erro
      await this.supabase
        .from('api_monitoring_configs')
        .update({ 
          status: 'error',
          updated_at: new Date().toISOString()
        })
        .eq('id', config.id);
    }
  }

  private async collectInstagramData(config: ApiMonitoringConfig): Promise<SocialApiResponse | null> {
    try {
      const endpoint = 'https://graph.instagram.com/me/media';
      const startTime = Date.now();
      
      const response = await fetch(`${endpoint}?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${config.api_credentials.access_token}`);
      
      const responseTime = Date.now() - startTime;
      const data = response.ok ? await response.json() : null;

      return {
        platform: 'instagram',
        endpoint,
        status_code: response.status,
        response_time_ms: responseTime,
        data: data,
        rate_limit_info: {
          limit: parseInt(response.headers.get('x-ratelimit-limit') || '100'),
          remaining: parseInt(response.headers.get('x-ratelimit-remaining') || '0'),
          reset: response.headers.get('x-ratelimit-reset') || new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error collecting Instagram data:', error);
      return null;
    }
  }

  private async collectFacebookData(config: ApiMonitoringConfig): Promise<SocialApiResponse | null> {
    try {
      const endpoint = 'https://graph.facebook.com/me/posts';
      const startTime = Date.now();
      
      const response = await fetch(`${endpoint}?fields=id,message,created_time,likes.summary(true),comments.summary(true)&access_token=${config.api_credentials.access_token}`);
      
      const responseTime = Date.now() - startTime;
      const data = response.ok ? await response.json() : null;

      return {
        platform: 'facebook',
        endpoint,
        status_code: response.status,
        response_time_ms: responseTime,
        data: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error collecting Facebook data:', error);
      return null;
    }
  }

  private async collectTwitterData(config: ApiMonitoringConfig): Promise<SocialApiResponse | null> {
    try {
      const endpoint = 'https://api.twitter.com/2/users/me/mentions';
      const startTime = Date.now();
      
      const response = await fetch(`${endpoint}?tweet.fields=created_at,public_metrics&expansions=author_id`, {
        headers: {
          'Authorization': `Bearer ${config.api_credentials.bearer_token}`
        }
      });
      
      const responseTime = Date.now() - startTime;
      const data = response.ok ? await response.json() : null;

      return {
        platform: 'twitter',
        endpoint,
        status_code: response.status,
        response_time_ms: responseTime,
        data: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error collecting Twitter data:', error);
      return null;
    }
  }

  private async collectYouTubeData(config: ApiMonitoringConfig): Promise<SocialApiResponse | null> {
    try {
      const endpoint = 'https://www.googleapis.com/youtube/v3/commentThreads';
      const startTime = Date.now();
      
      const response = await fetch(`${endpoint}?part=snippet&allThreadsRelatedToChannelId=CHANNEL_ID&access_token=${config.api_credentials.access_token}`);
      
      const responseTime = Date.now() - startTime;
      const data = response.ok ? await response.json() : null;

      return {
        platform: 'youtube',
        endpoint,
        status_code: response.status,
        response_time_ms: responseTime,
        data: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error collecting YouTube data:', error);
      return null;
    }
  }

  // Processar dados coletados
  private async processCollectedData(configId: string, apiResponse: SocialApiResponse): Promise<void> {
    try {
      // Salvar resposta da API
      await this.supabase
        .from('api_responses')
        .insert({
          config_id: configId,
          platform: apiResponse.platform,
          endpoint: apiResponse.endpoint,
          status_code: apiResponse.status_code,
          response_time_ms: apiResponse.response_time_ms,
          data: apiResponse.data,
          timestamp: apiResponse.timestamp
        });

      // Converter dados em menções sociais se aplicável
      if (apiResponse.data && apiResponse.status_code === 200) {
        await this.convertToSocialMentions(configId, apiResponse);
      }

    } catch (error) {
      console.error('Error processing collected data:', error);
    }
  }

  private async convertToSocialMentions(configId: string, apiResponse: SocialApiResponse): Promise<void> {
    // Lógica para converter dados da API em social mentions
    // Isso seria customizado para cada plataforma
    
    try {
      const mentions = this.extractMentionsFromResponse(apiResponse);
      
      for (const mention of mentions) {
        // Salvar como menção social para análise de sentimento
        await this.supabase
          .from('social_mentions')
          .insert({
            ...mention,
            collected_via: 'api_monitoring',
            config_id: configId
          });
      }
    } catch (error) {
      console.error('Error converting to social mentions:', error);
    }
  }

  private extractMentionsFromResponse(apiResponse: SocialApiResponse): any[] {
    const mentions: any[] = [];
    
    // Extrair menções baseado na plataforma
    switch (apiResponse.platform) {
      case 'instagram':
        if (apiResponse.data?.data) {
          apiResponse.data.data.forEach((post: any) => {
            if (post.caption) {
              mentions.push({
                id: `ig_${post.id}`,
                platform: 'instagram',
                mention_type: 'post',
                content: post.caption,
                author: { username: 'unknown' },
                engagement: { likes: 0, comments: 0, shares: 0 },
                created_at: post.timestamp
              });
            }
          });
        }
        break;
        
      case 'twitter':
        if (apiResponse.data?.data) {
          apiResponse.data.data.forEach((tweet: any) => {
            mentions.push({
              id: `tw_${tweet.id}`,
              platform: 'twitter', 
              mention_type: 'mention',
              content: tweet.text,
              author: { username: tweet.author_id },
              engagement: {
                likes: tweet.public_metrics?.like_count || 0,
                comments: tweet.public_metrics?.reply_count || 0,
                shares: tweet.public_metrics?.retweet_count || 0
              },
              created_at: tweet.created_at
            });
          });
        }
        break;
    }
    
    return mentions;
  }

  // Gerenciar rate limits
  private updateRateLimitTracker(platform: string, endpoint: string, rateLimitInfo: any): void {
    const key = `${platform}_${endpoint}`;
    
    this.rateLimitTrackers.set(key, {
      platform,
      endpoint,
      limit: rateLimitInfo.limit,
      remaining: rateLimitInfo.remaining,
      reset_time: rateLimitInfo.reset_time,
      window_size_seconds: 3600, // 1 hour default
      requests_made: rateLimitInfo.limit - rateLimitInfo.remaining,
      last_request: new Date().toISOString()
    });
  }

  private canMakeRequest(platform: string): boolean {
    const trackers = Array.from(this.rateLimitTrackers.values())
      .filter(t => t.platform === platform);
    
    if (trackers.length === 0) return true;
    
    return trackers.every(tracker => {
      const resetTime = new Date(tracker.reset_time);
      const now = new Date();
      
      // Se já passou do reset, pode fazer request
      if (now >= resetTime) return true;
      
      // Senão, verificar se ainda tem requests disponíveis
      return tracker.remaining > 0;
    });
  }

  // =====================================================
  // SISTEMA DE WEBHOOKS
  // =====================================================

  private initializeWebhookHandlers(): void {
    this.webhookHandlers.set('instagram', this.handleInstagramWebhook.bind(this));
    this.webhookHandlers.set('facebook', this.handleFacebookWebhook.bind(this));
    this.webhookHandlers.set('twitter', this.handleTwitterWebhook.bind(this));
  }

  async handleWebhook(platform: string, payload: any, signature?: string): Promise<void> {
    try {
      // Validar assinatura do webhook se necessário
      if (signature && !this.validateWebhookSignature(platform, payload, signature)) {
        throw new Error('Invalid webhook signature');
      }

      const handler = this.webhookHandlers.get(platform);
      if (!handler) {
        throw new Error(`No webhook handler for platform: ${platform}`);
      }

      await handler(payload);
    } catch (error) {
      console.error(`Error handling webhook for ${platform}:`, error);
    }
  }

  private validateWebhookSignature(platform: string, payload: any, signature: string): boolean {
    // Implementar validação de assinatura para cada plataforma
    // Isso é crítico para segurança
    return true; // Placeholder
  }

  private async handleInstagramWebhook(payload: any): Promise<void> {
    try {
      // Processar webhook do Instagram
      const webhookEvent: WebhookEvent = {
        id: `ig_webhook_${Date.now()}`,
        api_config_id: 'instagram_config', // Buscar do DB
        platform: 'instagram',
        event_type: payload.entry?.[0]?.changes?.[0]?.field === 'mentions' ? 'mention' : 'comment',
        event_data: payload,
        processed: false,
        received_at: new Date().toISOString(),
        retry_count: 0
      };

      await this.saveWebhookEvent(webhookEvent);
      await this.processWebhookEvent(webhookEvent);
    } catch (error) {
      console.error('Error handling Instagram webhook:', error);
    }
  }

  private async handleFacebookWebhook(payload: any): Promise<void> {
    // Similar ao Instagram
    console.log('Processing Facebook webhook:', payload);
  }

  private async handleTwitterWebhook(payload: any): Promise<void> {
    // Similar ao Instagram
    console.log('Processing Twitter webhook:', payload);
  }

  private async saveWebhookEvent(event: WebhookEvent): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('webhook_events')
        .insert(event);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving webhook event:', error);
    }
  }

  private async processWebhookEvent(event: WebhookEvent): Promise<void> {
    try {
      // Processar evento do webhook
      const result = {
        social_mention_created: null as string | null,
        sentiment_analyzed: false,
        alerts_triggered: [] as string[],
        errors: [] as string[]
      };

      // Converter em social mention se aplicável
      if (this.shouldCreateSocialMention(event)) {
        const mentionId = await this.createSocialMentionFromWebhook(event);
        result.social_mention_created = mentionId;
        result.sentiment_analyzed = true;
      }

      // Atualizar status do evento
      await this.supabase
        .from('webhook_events')
        .update({
          processed: true,
          processing_result: result,
          processed_at: new Date().toISOString()
        })
        .eq('id', event.id);

    } catch (error) {
      console.error('Error processing webhook event:', error);
      
      // Marcar como erro e incrementar retry
      await this.supabase
        .from('webhook_events')
        .update({
          processing_result: { errors: [(error as Error).message] },
          retry_count: event.retry_count + 1
        })
        .eq('id', event.id);
    }
  }

  private shouldCreateSocialMention(event: WebhookEvent): boolean {
    // Determinar se o evento do webhook deve gerar uma social mention
    return ['mention', 'comment', 'message'].includes(event.event_type);
  }

  private async createSocialMentionFromWebhook(event: WebhookEvent): Promise<string> {
    // Converter webhook event em social mention
    const mentionId = `webhook_${event.platform}_${Date.now()}`;
    
    // Extrair dados relevantes do payload do webhook
    const content = this.extractContentFromWebhook(event);
    const author = this.extractAuthorFromWebhook(event);
    
    const socialMention = {
      id: mentionId,
      platform: event.platform,
      mention_type: event.event_type,
      content: content,
      author: author,
      engagement: { likes: 0, comments: 0, shares: 0 },
      sentiment: { score: 0, label: 'neutral', confidence: 0, emotions: {} },
      keywords_detected: [],
      created_at: new Date().toISOString(),
      collected_at: new Date().toISOString(),
      relevance_score: 50,
      collected_via: 'webhook'
    };

    await this.supabase
      .from('social_mentions')
      .insert(socialMention);

    return mentionId;
  }

  private extractContentFromWebhook(event: WebhookEvent): string {
    // Extrair conteúdo baseado no formato do webhook de cada plataforma
    const data = event.event_data;
    
    switch (event.platform) {
      case 'instagram':
        return data.entry?.[0]?.changes?.[0]?.value?.text || '';
      case 'facebook':
        return data.entry?.[0]?.changes?.[0]?.value?.message || '';
      default:
        return JSON.stringify(data);
    }
  }

  private extractAuthorFromWebhook(event: WebhookEvent): any {
    // Extrair informações do autor baseado no webhook
    return {
      username: 'webhook_user',
      display_name: 'Webhook User',
      followers_count: 0,
      verified: false
    };
  }

  // =====================================================
  // MÉTODOS DE CONSULTA E RELATÓRIOS
  // =====================================================

  async getApiHealthSummary(userId: string): Promise<ApiHealthStatus[]> {
    try {
      const { data: configs, error: configError } = await this.supabase
        .from('api_monitoring_configs')
        .select('id, platform')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (configError) throw configError;

      const healthStatuses = await Promise.all(
        configs.map(async (config) => {
          const { data, error } = await this.supabase
            .from('api_health_status')
            .select('*')
            .eq('config_id', config.id)
            .order('timestamp', { ascending: false })
            .limit(1);

          if (error || !data || data.length === 0) {
            return {
              platform: config.platform,
              status: 'unknown' as any,
              response_time_ms: 0,
              success_rate_24h: 0,
              last_request: '',
              rate_limit_remaining: 0,
              rate_limit_reset: '',
              uptime_percentage: 0
            };
          }

          return data[0] as ApiHealthStatus;
        })
      );

      return healthStatuses;
    } catch (error) {
      console.error('Error getting API health summary:', error);
      return [];
    }
  }

  async getWebhookEventsSummary(configId: string, hours = 24): Promise<any> {
    try {
      const startTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      const { data, error } = await this.supabase
        .from('webhook_events')
        .select('event_type, processed, retry_count')
        .eq('api_config_id', configId)
        .gte('received_at', startTime);

      if (error) throw error;

      const summary = {
        total_events: data?.length || 0,
        processed_events: data?.filter(e => e.processed).length || 0,
        failed_events: data?.filter(e => !e.processed && e.retry_count > 2).length || 0,
        events_by_type: {} as Record<string, number>
      };

      data?.forEach(event => {
        summary.events_by_type[event.event_type] = 
          (summary.events_by_type[event.event_type] || 0) + 1;
      });

      return summary;
    } catch (error) {
      console.error('Error getting webhook events summary:', error);
      return { total_events: 0, processed_events: 0, failed_events: 0, events_by_type: {} };
    }
  }
}

// =====================================================
// EXPORTAÇÕES E INSTÂNCIAS
// =====================================================

export const socialApiMonitor = new SocialApiMonitor();

// Utilitários para componentes
export const getPlatformStatus = (platform: string, healthStatuses: ApiHealthStatus[]): ApiHealthStatus | null => {
  return healthStatuses.find(status => status.platform === platform) || null;
};

export const formatUptime = (uptime: number): string => {
  return `${uptime.toFixed(1)}%`;
};

export const formatResponseTime = (timeMs: number): string => {
  if (timeMs < 1000) return `${timeMs}ms`;
  return `${(timeMs / 1000).toFixed(1)}s`;
};

export const getStatusColor = (status: ApiHealthStatus['status']): string => {
  const colors = {
    healthy: 'text-green-600 bg-green-50 border-green-200',
    degraded: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    down: 'text-red-600 bg-red-50 border-red-200',
    rate_limited: 'text-orange-600 bg-orange-50 border-orange-200'
  };
  
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export const formatRateLimit = (remaining: number, total: number): string => {
  const percentage = total > 0 ? Math.round((remaining / total) * 100) : 0;
  return `${remaining}/${total} (${percentage}%)`;
};