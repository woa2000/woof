// DASHBOARD KPI PARA METAS E OKRs - DATA ANALYST
// Implementado por: Data_Analyst durante Sprint 3-5  
// Métricas inteligentes para agência pet com automação IA

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Users,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';

// =====================================================
// INTERFACES E TIPOS DE DADOS
// =====================================================

interface MetaOKR {
  id: string;
  user_id: string;
  nome: string;
  categoria: 'engajamento' | 'vendas' | 'leads' | 'branding' | 'reach';
  valor_meta: number;
  valor_atual: number;
  prazo: string;
  status: 'ativo' | 'pausado' | 'concluido';
  frequencia: 'mensal' | 'trimestral' | 'semestral' | 'anual';
  created_at: string;
  key_results: KeyResult[];
}

interface KeyResult {
  id: string;
  nome: string;
  valor_meta: number;
  valor_atual: number;
  peso: number; // Peso na composição da Meta (0-100%)
  metrica: string; // Ex: 'likes', 'followers', 'sales', 'leads'
}

interface MetricaPeriodo {
  periodo: string;
  valor: number;
  meta: number;
  performance: number; // % da meta atingida
}

interface AnalyticsDashboard {
  resumo_geral: {
    total_metas: number;
    metas_no_prazo: number;
    metas_atrasadas: number;
    performance_media: number;
  };
  metas_por_categoria: Array<{
    categoria: string;
    total: number;
    performance_media: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  evolucao_mensal: MetricaPeriodo[];
  alertas: Array<{
    tipo: 'warning' | 'error' | 'success';
    mensagem: string;
    meta_id: string;
    prioridade: 'alta' | 'media' | 'baixa';
  }>;
}

interface SocialMetrics {
  instagram: {
    followers: number;
    engagement_rate: number;
    reach: number;
    impressions: number;
    stories_views: number;
    profile_visits: number;
  };
  facebook: {
    likes: number;
    engagement: number;
    reach: number;
    post_frequency: number;
  };
}

// =====================================================
// HOOK PARA DADOS DO DASHBOARD
// =====================================================

export const useKPIDashboardData = () => {
  const [metas, setMetas] = useState<MetaOKR[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [socialMetrics, setSocialMetrics] = useState<SocialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Carregar metas
      const metasResponse = await fetch(`/api/metas-okrs?periodo=${periodo}`);
      if (metasResponse.ok) {
        const metasData = await metasResponse.json();
        setMetas(metasData);
      }

      // Carregar analytics
      const analyticsResponse = await fetch(`/api/dashboard/analytics?periodo=${periodo}`);
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      // Carregar métricas sociais (mock para demonstração)
      setSocialMetrics({
        instagram: {
          followers: 12450,
          engagement_rate: 4.2,
          reach: 35600,
          impressions: 89200,
          stories_views: 15600,
          profile_visits: 2340
        },
        facebook: {
          likes: 8900,
          engagement: 3.1,
          reach: 22400,
          post_frequency: 12
        }
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return { 
    metas, 
    analytics, 
    socialMetrics, 
    loading, 
    periodo, 
    setPeriodo,
    recarregarDados: carregarDados 
  };
};

// =====================================================
// UTILITÁRIOS DE CÁLCULO E ANÁLISE
// =====================================================

export const calcularPerformanceMeta = (meta: MetaOKR): number => {
  if (meta.valor_meta === 0) return 0;
  return Math.round((meta.valor_atual / meta.valor_meta) * 100);
};

export const calcularTendencia = (evolucao: MetricaPeriodo[]): 'up' | 'down' | 'stable' => {
  if (evolucao.length < 2) return 'stable';
  
  const ultimo = evolucao[evolucao.length - 1];
  const penultimo = evolucao[evolucao.length - 2];
  
  const diferenca = ultimo.performance - penultimo.performance;
  
  if (diferenca > 5) return 'up';
  if (diferenca < -5) return 'down';
  return 'stable';
};

export const obterCorPerformance = (performance: number): string => {
  if (performance >= 90) return 'text-green-600 bg-green-50';
  if (performance >= 70) return 'text-blue-600 bg-blue-50';
  if (performance >= 50) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

export const gerarInsightsPredictivos = (metas: MetaOKR[]): string[] => {
  const insights: string[] = [];
  
  // Análise de tendências
  const metasAtrasadas = metas.filter(meta => {
    const prazo = new Date(meta.prazo);
    const agora = new Date();
    const performance = calcularPerformanceMeta(meta);
    
    const diasRestantes = Math.ceil((prazo.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
    const diasTotais = Math.ceil((prazo.getTime() - new Date(meta.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const tempoDecorrido = ((diasTotais - diasRestantes) / diasTotais) * 100;
    
    return performance < tempoDecorrido - 10; // Meta atrasada em relação ao tempo
  });

  if (metasAtrasadas.length > 0) {
    insights.push(`${metasAtrasadas.length} meta(s) estão atrasadas em relação ao prazo esperado`);
  }

  // Análise de performance por categoria
  const categorias = metas.reduce((acc, meta) => {
    if (!acc[meta.categoria]) acc[meta.categoria] = [];
    acc[meta.categoria].push(calcularPerformanceMeta(meta));
    return acc;
  }, {} as Record<string, number[]>);

  Object.entries(categorias).forEach(([categoria, performances]) => {
    const media = performances.reduce((sum, p) => sum + p, 0) / performances.length;
    if (media > 85) {
      insights.push(`Categoria "${categoria}" está com excelente performance (${Math.round(media)}%)`);
    } else if (media < 60) {
      insights.push(`Categoria "${categoria}" precisa de atenção (performance: ${Math.round(media)}%)`);
    }
  });

  return insights;
};

// =====================================================
// COMPONENTE CARD DE MÉTRICA
// =====================================================

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ComponentType<any>;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200'
  };

  const trendIcons = {
    up: <TrendingUp className="w-4 h-4 text-green-500" />,
    down: <TrendingDown className="w-4 h-4 text-red-500" />,
    stable: <div className="w-4 h-4 border-t-2 border-gray-400" />
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6" />
        {trend && trendValue && (
          <div className="flex items-center gap-1">
            {trendIcons[trend]}
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      <div className="mb-1">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm font-medium opacity-90">{title}</div>
      </div>
      {subtitle && (
        <div className="text-xs opacity-70">{subtitle}</div>
      )}
    </div>
  );
};

// =====================================================
// COMPONENTE PRINCIPAL DO DASHBOARD
// =====================================================

export const KPIDashboard: React.FC = () => {
  const { 
    metas, 
    analytics, 
    socialMetrics, 
    loading, 
    periodo, 
    setPeriodo 
  } = useKPIDashboardData();

  // Cálculos computados
  const insights = useMemo(() => gerarInsightsPredictivos(metas), [metas]);
  
  const metasComPerformance = useMemo(() => 
    metas.map(meta => ({
      ...meta,
      performance: calcularPerformanceMeta(meta)
    }))
  , [metas]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-8 bg-gray-200 rounded mb-1" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
        <div className="text-center text-gray-600">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header com filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard KPI</h1>
          <p className="text-gray-600 mt-1">Acompanhe o desempenho das suas metas e OKRs</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map(p => (
            <button
              key={p}
              onClick={() => setPeriodo(p as any)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodo === p 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p === '7d' ? '7 dias' : 
               p === '30d' ? '30 dias' : 
               p === '90d' ? '3 meses' : 
               '1 ano'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de métricas principais */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Metas"
            value={analytics.resumo_geral.total_metas}
            subtitle={`${analytics.resumo_geral.metas_no_prazo} no prazo`}
            icon={Target}
            color="blue"
          />
          <MetricCard
            title="Performance Média"
            value={`${analytics.resumo_geral.performance_media}%`}
            trend={analytics.resumo_geral.performance_media >= 75 ? 'up' : 'down'}
            trendValue={`${analytics.resumo_geral.performance_media >= 75 ? '+' : ''}${analytics.resumo_geral.performance_media - 70}%`}
            icon={BarChart3}
            color={analytics.resumo_geral.performance_media >= 75 ? 'green' : 'yellow'}
          />
          <MetricCard
            title="Metas Atrasadas"
            value={analytics.resumo_geral.metas_atrasadas}
            subtitle={`${Math.round((analytics.resumo_geral.metas_atrasadas / analytics.resumo_geral.total_metas) * 100)}% do total`}
            icon={Clock}
            color={analytics.resumo_geral.metas_atrasadas > 0 ? 'red' : 'green'}
          />
          <MetricCard
            title="Alertas Ativos"
            value={analytics.alertas.length}
            subtitle={`${analytics.alertas.filter(a => a.prioridade === 'alta').length} alta prioridade`}
            icon={AlertTriangle}
            color={analytics.alertas.length > 0 ? 'yellow' : 'green'}
          />
        </div>
      )}

      {/* Métricas de Social Media */}
      {socialMetrics && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Social Media Performance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Instagram Followers"
              value={socialMetrics.instagram.followers.toLocaleString()}
              subtitle={`${socialMetrics.instagram.engagement_rate}% engagement`}
              icon={Users}
              color="purple"
            />
            <MetricCard
              title="Reach Total"
              value={socialMetrics.instagram.reach.toLocaleString()}
              subtitle="Últimos 30 dias"
              icon={Eye}
              color="blue"
            />
            <MetricCard
              title="Stories Views"
              value={socialMetrics.instagram.stories_views.toLocaleString()}
              subtitle="Média diária: 520"
              icon={MessageCircle}
              color="green"
            />
            <MetricCard
              title="Profile Visits"
              value={socialMetrics.instagram.profile_visits.toLocaleString()}
              subtitle="Conversão: 12%"
              icon={Share2}
              color="yellow"
            />
          </div>
        </div>
      )}

      {/* Lista detalhada de metas */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Metas por Categoria</h2>
        <div className="space-y-4">
          {metasComPerformance.map(meta => (
            <div key={meta.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{meta.nome}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                      {meta.categoria}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {meta.frequencia}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      meta.status === 'ativo' ? 'bg-green-100 text-green-700' :
                      meta.status === 'pausado' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {meta.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${obterCorPerformance(meta.performance)}`}>
                    {meta.performance}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {meta.valor_atual.toLocaleString()} / {meta.valor_meta.toLocaleString()}
                  </div>
                </div>
              </div>
              
              {/* Barra de progresso */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      meta.performance >= 90 ? 'bg-green-500' :
                      meta.performance >= 70 ? 'bg-blue-500' :
                      meta.performance >= 50 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(meta.performance, 100)}%` }}
                  />
                </div>
              </div>

              {/* Key Results */}
              {meta.key_results && meta.key_results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {meta.key_results.map(kr => {
                    const krPerformance = kr.valor_meta > 0 ? Math.round((kr.valor_atual / kr.valor_meta) * 100) : 0;
                    return (
                      <div key={kr.id} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{kr.nome}</span>
                          <span className="text-sm font-bold">{krPerformance}%</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {kr.valor_atual.toLocaleString()} / {kr.valor_meta.toLocaleString()} {kr.metrica}
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-1 mt-2">
                          <div 
                            className="h-1 rounded-full bg-blue-500 transition-all"
                            style={{ width: `${Math.min(krPerformance, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Insights preditivos */}
      {insights.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Insights Preditivos
          </h2>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-blue-800">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alertas */}
      {analytics && analytics.alertas.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertas Ativos
          </h2>
          <div className="space-y-3">
            {analytics.alertas.map((alerta, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                alerta.tipo === 'error' ? 'bg-red-100 text-red-800' :
                alerta.tipo === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {alerta.tipo === 'error' ? <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" /> :
                 alerta.tipo === 'warning' ? <Clock className="w-5 h-5 text-yellow-600 mt-0.5" /> :
                 <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                <div className="flex-1">
                  <div className="font-medium">{alerta.mensagem}</div>
                  <div className="text-sm opacity-75 mt-1">
                    Prioridade: {alerta.prioridade} • Meta ID: {alerta.meta_id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIDashboard;