import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Users, Heart, 
  MessageSquare, Share2, Eye, Calendar, MapPin, Target 
} from 'lucide-react';
import { socialListeningEngine, type SentimentAnalysis, type SocialMention, type CrisisAlert } from './P10-social-listening';

// =====================================================
// INTERFACES DE INSIGHTS DE MERCADO
// =====================================================

interface MarketInsight {
  id: string;
  type: 'trend' | 'opportunity' | 'threat' | 'behavior' | 'seasonal' | 'competitive';
  title: string;
  description: string;
  confidence_score: number; // 0 to 100
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  recommended_actions: string[];
  data_source: 'social_listening' | 'seasonal_calendar' | 'competitor_analysis' | 'ai_analysis';
  created_at: string;
  expires_at?: string;
  tags: string[];
  metrics: {
    mentions_volume: number;
    sentiment_shift: number;
    engagement_rate: number;
    reach_estimate: number;
  };
}

interface CompetitorAnalysis {
  competitor_name: string;
  share_of_voice: number; // percentage
  sentiment_avg: number;
  mentions_count: number;
  engagement_rate: number;
  top_content_types: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

interface MarketTrendData {
  date: string;
  mentions: number;
  sentiment_score: number;
  engagement_rate: number;
  reach: number;
  competitor_mentions: number;
}

interface GeographicInsight {
  location: string;
  state: string;
  mentions: number;
  sentiment_avg: number;
  market_penetration: number;
  growth_opportunity: 'low' | 'medium' | 'high';
  key_topics: string[];
}

interface PredictiveAnalytics {
  forecast_period: string;
  predictions: {
    mentions_volume: {
      predicted_value: number;
      confidence_interval: [number, number];
      trend_direction: 'up' | 'down' | 'stable';
    };
    sentiment_trend: {
      predicted_score: number;
      trend_direction: 'improving' | 'declining' | 'stable';
      key_factors: string[];
    };
    engagement_forecast: {
      predicted_rate: number;
      growth_potential: number;
    };
    market_opportunities: string[];
    risk_factors: string[];
  };
}

// =====================================================
// SISTEMA DE ANÁLISE PREDITIVA COM IA
// =====================================================

class MarketInsightEngine {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  async generateMarketInsights(
    sentimentData: SentimentAnalysis,
    mentions: SocialMention[],
    seasonalContext?: any
  ): Promise<MarketInsight[]> {
    try {
      const prompt = this.buildInsightPrompt(sentimentData, mentions, seasonalContext);
      
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
              content: 'You are a specialized market intelligence AI for veterinary and pet care businesses. Generate actionable insights from social media data and provide strategic recommendations. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.4,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      return result.insights.map((insight: any, index: number) => ({
        id: `insight_${Date.now()}_${index}`,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        confidence_score: Math.min(100, Math.max(0, insight.confidence_score || 75)),
        impact_level: insight.impact_level,
        recommended_actions: insight.recommended_actions || [],
        data_source: 'ai_analysis',
        created_at: new Date().toISOString(),
        expires_at: insight.expires_at,
        tags: insight.tags || [],
        metrics: {
          mentions_volume: sentimentData.metrics.total_mentions,
          sentiment_shift: sentimentData.metrics.average_sentiment,
          engagement_rate: this.calculateEngagementRate(mentions),
          reach_estimate: this.calculateReachEstimate(mentions)
        }
      }));

    } catch (error) {
      console.error('Error generating market insights:', error);
      return this.generateFallbackInsights(sentimentData, mentions);
    }
  }

  private buildInsightPrompt(sentimentData: SentimentAnalysis, mentions: SocialMention[], seasonalContext?: any): string {
    return `
Analise os dados de social listening e gere insights estratégicos para uma clínica veterinária/pet shop:

DADOS DE SENTIMENTO:
- Total de menções: ${sentimentData.metrics.total_mentions}
- Menções positivas: ${sentimentData.metrics.positive_mentions}
- Menções negativas: ${sentimentData.metrics.negative_mentions}
- Score médio de sentimento: ${sentimentData.metrics.average_sentiment}
- Tendência: ${sentimentData.metrics.sentiment_trend}

TOP KEYWORDS:
${sentimentData.top_keywords.map(k => `- ${k.keyword}: ${k.mentions} menções (sentimento: ${k.sentiment_avg.toFixed(2)})`).join('\n')}

INFLUENCIADORES DETECTADOS:
${sentimentData.influencers_detected.map(inf => `- @${inf.username} (${inf.platform}): ${inf.followers} seguidores, ${inf.mentions_count} menções`).join('\n')}

CONTEXTO SAZONAL (se disponível):
${seasonalContext ? JSON.stringify(seasonalContext) : 'Não disponível'}

Gere insights categorizados por tipo e retorne em JSON com esta estrutura:
{
  "insights": [
    {
      "type": "trend|opportunity|threat|behavior|seasonal|competitive",
      "title": "Título do insight",
      "description": "Descrição detalhada do que foi identificado",
      "confidence_score": número de 0-100,
      "impact_level": "low|medium|high|critical",
      "recommended_actions": ["ação 1", "ação 2", "ação 3"],
      "expires_at": "data de expiração se aplicável",
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}

Foque em insights acionáveis para o mercado veterinário brasileiro, considerando:
- Oportunidades de conteúdo
- Tendências de comportamento do consumidor
- Riscos de reputação
- Oportunidades sazonais
- Análise competitiva
- Estratégias de engajamento
    `;
  }

  private calculateEngagementRate(mentions: SocialMention[]): number {
    const totalEngagements = mentions.reduce((sum, mention) => 
      sum + mention.engagement.likes + mention.engagement.comments + mention.engagement.shares, 0
    );
    
    const totalReach = mentions.reduce((sum, mention) => 
      sum + (mention.author.followers_count || 0), 0
    );

    return totalReach > 0 ? (totalEngagements / totalReach) * 100 : 0;
  }

  private calculateReachEstimate(mentions: SocialMention[]): number {
    return mentions.reduce((sum, mention) => {
      const baseReach = mention.author.followers_count || 0;
      const engagementMultiplier = 1 + (mention.engagement.shares * 0.1);
      return sum + (baseReach * engagementMultiplier);
    }, 0);
  }

  private generateFallbackInsights(sentimentData: SentimentAnalysis, mentions: SocialMention[]): MarketInsight[] {
    const insights: MarketInsight[] = [];

    // Insight de tendência de sentimento
    if (sentimentData.metrics.sentiment_trend !== 'stable') {
      insights.push({
        id: `fallback_sentiment_${Date.now()}`,
        type: 'trend',
        title: `Tendência de Sentimento ${sentimentData.metrics.sentiment_trend === 'improving' ? 'Positiva' : 'Negativa'}`,
        description: `O sentimento geral sobre a marca está ${sentimentData.metrics.sentiment_trend === 'improving' ? 'melhorando' : 'piorando'} baseado nas ${sentimentData.metrics.total_mentions} menções analisadas.`,
        confidence_score: 80,
        impact_level: 'medium',
        recommended_actions: sentimentData.metrics.sentiment_trend === 'improving' 
          ? ['Amplificar conteúdos positivos', 'Engajar com clientes satisfeitos', 'Documentar casos de sucesso']
          : ['Identificar causas dos comentários negativos', 'Implementar plano de resposta', 'Melhorar comunicação'],
        data_source: 'social_listening',
        created_at: new Date().toISOString(),
        tags: ['sentimento', 'tendência'],
        metrics: {
          mentions_volume: sentimentData.metrics.total_mentions,
          sentiment_shift: sentimentData.metrics.average_sentiment,
          engagement_rate: this.calculateEngagementRate(mentions),
          reach_estimate: this.calculateReachEstimate(mentions)
        }
      });
    }

    // Insight de keywords populares
    if (sentimentData.top_keywords.length > 0) {
      const topKeyword = sentimentData.top_keywords[0];
      insights.push({
        id: `fallback_keyword_${Date.now()}`,
        type: 'opportunity',
        title: `Oportunidade: Foco em "${topKeyword.keyword}"`,
        description: `A palavra-chave "${topKeyword.keyword}" apareceu em ${topKeyword.mentions} menções com sentimento ${topKeyword.sentiment_avg > 0 ? 'positivo' : 'negativo'}. Há oportunidade para criar conteúdo focado neste tema.`,
        confidence_score: 75,
        impact_level: 'medium',
        recommended_actions: [
          `Criar conteúdo educativo sobre ${topKeyword.keyword}`,
          'Desenvolver campanha específica',
          'Monitorar menções relacionadas'
        ],
        data_source: 'social_listening',
        created_at: new Date().toISOString(),
        tags: ['keywords', 'conteúdo', topKeyword.keyword],
        metrics: {
          mentions_volume: topKeyword.mentions,
          sentiment_shift: topKeyword.sentiment_avg,
          engagement_rate: this.calculateEngagementRate(mentions),
          reach_estimate: this.calculateReachEstimate(mentions)
        }
      });
    }

    return insights;
  }

  async generatePredictiveAnalytics(
    historicalData: MarketTrendData[],
    currentInsights: MarketInsight[]
  ): Promise<PredictiveAnalytics> {
    try {
      // Análise simples de tendências
      const recentData = historicalData.slice(-7); // Últimos 7 dias
      const avgMentions = recentData.reduce((sum, d) => sum + d.mentions, 0) / recentData.length;
      const avgSentiment = recentData.reduce((sum, d) => sum + d.sentiment_score, 0) / recentData.length;
      const avgEngagement = recentData.reduce((sum, d) => sum + d.engagement_rate, 0) / recentData.length;

      // Calcular tendências
      const mentionsTrend = this.calculateTrend(recentData.map(d => d.mentions));
      const sentimentTrend = this.calculateTrend(recentData.map(d => d.sentiment_score));
      
      return {
        forecast_period: '7 dias',
        predictions: {
          mentions_volume: {
            predicted_value: Math.round(avgMentions * (1 + mentionsTrend)),
            confidence_interval: [
              Math.round(avgMentions * 0.8),
              Math.round(avgMentions * 1.2)
            ],
            trend_direction: mentionsTrend > 0.05 ? 'up' : mentionsTrend < -0.05 ? 'down' : 'stable'
          },
          sentiment_trend: {
            predicted_score: Math.round((avgSentiment * (1 + sentimentTrend)) * 100) / 100,
            trend_direction: sentimentTrend > 0.05 ? 'improving' : sentimentTrend < -0.05 ? 'declining' : 'stable',
            key_factors: currentInsights.filter(i => i.impact_level === 'high').map(i => i.title).slice(0, 3)
          },
          engagement_forecast: {
            predicted_rate: Math.round(avgEngagement * 100) / 100,
            growth_potential: Math.round(mentionsTrend * 100)
          },
          market_opportunities: [
            'Aproveitar sazonalidade atual',
            'Engajar com influenciadores identificados',
            'Criar conteúdo baseado em keywords populares'
          ],
          risk_factors: currentInsights
            .filter(i => i.type === 'threat' || i.impact_level === 'critical')
            .map(i => i.title)
            .slice(0, 3)
        }
      };

    } catch (error) {
      console.error('Error generating predictive analytics:', error);
      throw error;
    }
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.ceil(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    return firstAvg > 0 ? (secondAvg - firstAvg) / firstAvg : 0;
  }
}

// =====================================================
// COMPONENTE PRINCIPAL: DASHBOARD DE INSIGHTS
// =====================================================

const MarketInsightsDashboard: React.FC = () => {
  // Estados
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis | null>(null);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [trendData, setTrendData] = useState<MarketTrendData[]>([]);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState<PredictiveAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  
  const marketEngine = useMemo(() => new MarketInsightEngine(), []);

  // Carregar dados
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Simular carregamento de dados (em produção, seria API call)
        const mockSentimentData: SentimentAnalysis = {
          period: { 
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          metrics: {
            total_mentions: 127,
            positive_mentions: 89,
            negative_mentions: 23,
            neutral_mentions: 15,
            average_sentiment: 0.62,
            sentiment_trend: 'improving'
          },
          top_keywords: [
            { keyword: 'veterinário', mentions: 45, sentiment_avg: 0.8 },
            { keyword: 'atendimento', mentions: 32, sentiment_avg: 0.7 },
            { keyword: 'cuidado', mentions: 28, sentiment_avg: 0.9 },
            { keyword: 'consulta', mentions: 25, sentiment_avg: 0.4 },
            { keyword: 'vacina', mentions: 20, sentiment_avg: 0.6 }
          ],
          influencers_detected: [
            {
              username: 'petlover_sp',
              platform: 'instagram',
              followers: 15000,
              mentions_count: 3,
              sentiment_avg: 0.8
            },
            {
              username: 'veterinario_dicas',
              platform: 'instagram', 
              followers: 8500,
              mentions_count: 2,
              sentiment_avg: 0.9
            }
          ],
          geographic_insights: [],
          competitive_analysis: []
        };

        setSentimentData(mockSentimentData);

        // Gerar insights baseados nos dados
        const generatedInsights = await marketEngine.generateMarketInsights(
          mockSentimentData,
          [] // Mock mentions - em produção seria carregado do DB
        );

        setInsights(generatedInsights);

        // Dados de tendência (mock)
        const mockTrendData: MarketTrendData[] = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
          mentions: Math.floor(Math.random() * 50) + 10,
          sentiment_score: Math.random() * 2 - 1,
          engagement_rate: Math.random() * 5 + 1,
          reach: Math.floor(Math.random() * 10000) + 1000,
          competitor_mentions: Math.floor(Math.random() * 20) + 5
        }));

        setTrendData(mockTrendData);

        // Análise preditiva
        const predictions = await marketEngine.generatePredictiveAnalytics(mockTrendData, generatedInsights);
        setPredictiveAnalytics(predictions);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedPeriod, marketEngine]);

  // Calcular métricas resumidas
  const summaryMetrics = useMemo(() => {
    if (!sentimentData) return null;

    return {
      totalMentions: sentimentData.metrics.total_mentions,
      sentimentScore: Math.round(sentimentData.metrics.average_sentiment * 100),
      positivityRate: Math.round((sentimentData.metrics.positive_mentions / sentimentData.metrics.total_mentions) * 100),
      trendDirection: sentimentData.metrics.sentiment_trend,
      topKeyword: sentimentData.top_keywords[0]?.keyword || 'N/A',
      influencersReached: sentimentData.influencers_detected.length
    };
  }, [sentimentData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando insights de mercado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Insights Dashboard</h1>
          <p className="text-gray-600">Inteligência de mercado baseada em dados sociais</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === '7d' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('7d')}
            size="sm"
          >
            7 dias
          </Button>
          <Button
            variant={selectedPeriod === '30d' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('30d')}
            size="sm"
          >
            30 dias
          </Button>
          <Button
            variant={selectedPeriod === '90d' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('90d')}
            size="sm"
          >
            90 dias
          </Button>
        </div>
      </div>

      {/* Métricas Resumidas */}
      {summaryMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Menções</p>
                  <p className="text-2xl font-bold text-gray-900">{summaryMetrics.totalMentions}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {summaryMetrics.trendDirection === 'improving' ? '↗️ Crescendo' : 
                 summaryMetrics.trendDirection === 'declining' ? '↘️ Declinando' : '→ Estável'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Score de Sentimento</p>
                  <p className="text-2xl font-bold text-gray-900">{summaryMetrics.sentimentScore}%</p>
                </div>
                <Heart className={`w-8 h-8 ${summaryMetrics.sentimentScore > 50 ? 'text-green-600' : 'text-yellow-600'}`} />
              </div>
              <Progress value={summaryMetrics.positivityRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Palavra-chave Top</p>
                  <p className="text-lg font-bold text-gray-900">{summaryMetrics.topKeyword}</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {sentimentData?.top_keywords[0]?.mentions} menções
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Influenciadores</p>
                  <p className="text-2xl font-bold text-gray-900">{summaryMetrics.influencersReached}</p>
                </div>
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Identificados no período</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Abas Principais */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Insights Estratégicos</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="predictions">Predições</TabsTrigger>
          <TabsTrigger value="competitive">Análise Competitiva</TabsTrigger>
        </TabsList>

        {/* Tab: Insights Estratégicos */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insights por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Insights por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.slice(0, 6).map(insight => (
                    <div key={insight.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={
                          insight.type === 'opportunity' ? 'default' :
                          insight.type === 'threat' ? 'destructive' :
                          insight.type === 'trend' ? 'secondary' : 'outline'
                        }>
                          {insight.type}
                        </Badge>
                        <Badge variant="outline">
                          {insight.confidence_score}% confiança
                        </Badge>
                      </div>
                      
                      <h4 className="font-semibold mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Ações Recomendadas:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {insight.recommended_actions.slice(0, 2).map((action, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-blue-600">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-4 mt-3 text-xs text-gray-500">
                        <span>📊 {insight.metrics.mentions_volume} menções</span>
                        <span>👥 {Math.round(insight.metrics.reach_estimate / 1000)}K alcance</span>
                        <span className={`${insight.impact_level === 'high' ? 'text-red-600' : insight.impact_level === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                          {insight.impact_level === 'high' ? '🔴' : insight.impact_level === 'medium' ? '🟡' : '🟢'} {insight.impact_level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de Sentimento */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Sentimento</CardTitle>
              </CardHeader>
              <CardContent>
                {sentimentData && (
                  <>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Positivo', value: sentimentData.metrics.positive_mentions, fill: '#10B981' },
                              { name: 'Neutro', value: sentimentData.metrics.neutral_mentions, fill: '#6B7280' },
                              { name: 'Negativo', value: sentimentData.metrics.negative_mentions, fill: '#EF4444' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Comentários Positivos
                        </span>
                        <span className="font-semibold">{sentimentData.metrics.positive_mentions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          Comentários Neutros
                        </span>
                        <span className="font-semibold">{sentimentData.metrics.neutral_mentions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          Comentários Negativos
                        </span>
                        <span className="font-semibold">{sentimentData.metrics.negative_mentions}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Tendências */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Tendências */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Evolução das Métricas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="mentions" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Menções"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="engagement_rate" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Taxa Engajamento"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="competitor_mentions" 
                        stroke="#EF4444" 
                        strokeWidth={2}
                        name="Menções Competidores"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Keywords */}
            <Card>
              <CardHeader>
                <CardTitle>Keywords Mais Mencionadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sentimentData?.top_keywords.map((keyword, index) => (
                    <div key={keyword.keyword} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className="font-medium">{keyword.keyword}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{keyword.mentions}</Badge>
                        <div className={`w-2 h-2 rounded-full ${
                          keyword.sentiment_avg > 0.5 ? 'bg-green-500' :
                          keyword.sentiment_avg < 0 ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Influenciadores */}
            <Card>
              <CardHeader>
                <CardTitle>Influenciadores Identificados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sentimentData?.influencers_detected.map((influencer, index) => (
                    <div key={`${influencer.username}_${influencer.platform}`} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">@{influencer.username}</span>
                        <Badge variant="outline">{influencer.platform}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Seguidores:</span>
                          <span className="font-medium">{influencer.followers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Menções:</span>
                          <span className="font-medium">{influencer.mentions_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sentimento:</span>
                          <span className={`font-medium ${
                            influencer.sentiment_avg > 0.5 ? 'text-green-600' :
                            influencer.sentiment_avg < 0 ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {influencer.sentiment_avg > 0.5 ? 'Positivo' :
                             influencer.sentiment_avg < 0 ? 'Negativo' : 'Neutro'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Predições */}
        <TabsContent value="predictions" className="space-y-4">
          {predictiveAnalytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Previsões Quantitativas */}
              <Card>
                <CardHeader>
                  <CardTitle>Previsões para {predictiveAnalytics.forecast_period}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      Volume de Menções
                    </h4>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {predictiveAnalytics.predictions.mentions_volume.predicted_value}
                    </div>
                    <div className="text-sm text-gray-600">
                      Intervalo: {predictiveAnalytics.predictions.mentions_volume.confidence_interval[0]} - {predictiveAnalytics.predictions.mentions_volume.confidence_interval[1]}
                    </div>
                    <Badge 
                      variant={
                        predictiveAnalytics.predictions.mentions_volume.trend_direction === 'up' ? 'default' :
                        predictiveAnalytics.predictions.mentions_volume.trend_direction === 'down' ? 'destructive' : 'secondary'
                      }
                      className="mt-2"
                    >
                      {predictiveAnalytics.predictions.mentions_volume.trend_direction === 'up' ? '↗️ Crescimento' :
                       predictiveAnalytics.predictions.mentions_volume.trend_direction === 'down' ? '↘️ Declínio' : '→ Estável'}
                    </Badge>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4" />
                      Tendência de Sentimento
                    </h4>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {Math.round(predictiveAnalytics.predictions.sentiment_trend.predicted_score * 100)}%
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Direção: {predictiveAnalytics.predictions.sentiment_trend.trend_direction === 'improving' ? 'Melhorando' :
                                predictiveAnalytics.predictions.sentiment_trend.trend_direction === 'declining' ? 'Piorando' : 'Estável'}
                    </div>
                    {predictiveAnalytics.predictions.sentiment_trend.key_factors.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Fatores-chave:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {predictiveAnalytics.predictions.sentiment_trend.key_factors.map((factor, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-blue-600">•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Share2 className="w-4 h-4" />
                      Previsão de Engajamento
                    </h4>
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {predictiveAnalytics.predictions.engagement_forecast.predicted_rate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Potencial de crescimento: {predictiveAnalytics.predictions.engagement_forecast.growth_potential}%
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Oportunidades e Riscos */}
              <Card>
                <CardHeader>
                  <CardTitle>Oportunidades e Riscos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Oportunidades de Mercado
                    </h4>
                    <ul className="space-y-2">
                      {predictiveAnalytics.predictions.market_opportunities.map((opportunity, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {predictiveAnalytics.predictions.risk_factors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Fatores de Risco
                      </h4>
                      <ul className="space-y-2">
                        {predictiveAnalytics.predictions.risk_factors.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-red-600 mt-1">⚠️</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2">💡 Recomendação Estratégica</h5>
                    <p className="text-sm text-blue-800">
                      Com base nas previsões, recomendamos focar em 
                      {predictiveAnalytics.predictions.mentions_volume.trend_direction === 'up' ? ' amplificar a presença digital' : ' manter engajamento consistente'} e 
                      {predictiveAnalytics.predictions.sentiment_trend.trend_direction === 'improving' ? ' capitalizar no sentimento positivo' : ' trabalhar na melhoria da percepção da marca'}.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Tab: Análise Competitiva */}
        <TabsContent value="competitive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise Competitiva</CardTitle>
              <p className="text-sm text-gray-600">
                Em desenvolvimento - integrará com dados de concorrentes
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Análise Competitiva</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Este módulo será implementado na próxima fase com dados de monitoramento de concorrentes,
                  share of voice e benchmarking competitivo.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketInsightsDashboard;