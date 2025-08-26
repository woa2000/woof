/**
 * Componente Analytics Dashboard
 * 
 * Dashboard completo com métricas de analytics, campanhas e insights
 * Visualização de dados temporais e comparações
 */

'use client';

import React, { useState } from 'react';
import { useAnalyticsDashboard } from '@/hooks/analytics/useAnalyticsDashboard';
import { useCampaignMetrics } from '@/hooks/analytics/useCampaignMetrics';
import { TimeRangeUtils } from '@/services/analytics/analytics-service-factory';

export function AnalyticsDashboard() {
  const dashboard = useAnalyticsDashboard();
  const campaigns = useCampaignMetrics(dashboard.timeRange);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'social' | 'competitors' | 'roi'>('overview');

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'campaigns', label: 'Campanhas', icon: '🎯' },
    { id: 'social', label: 'Redes Sociais', icon: '📱' },
    { id: 'competitors', label: 'Concorrência', icon: '⚔️' },
    { id: 'roi', label: 'ROI por Canal', icon: '💰' }
  ];

  const timeRangeOptions = [
    { label: 'Últimos 7 dias', action: dashboard.setLast7Days },
    { label: 'Últimos 30 dias', action: dashboard.setLast30Days },
    { label: 'Últimos 3 meses', action: dashboard.setLast3Months },
    { label: 'Este mês', action: dashboard.setThisMonth },
    { label: 'Este ano', action: dashboard.setThisYear }
  ];

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('pt-BR').format(value);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Visão completa das métricas de marketing</p>
            </div>
            
            <div className="flex space-x-4">
              {/* Seletor de Período */}
              <div className="relative">
                <select 
                  className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const selectedAction = timeRangeOptions[parseInt(e.target.value)];
                    selectedAction?.action();
                  }}
                >
                  {timeRangeOptions.map((option, index) => (
                    <option key={index} value={index}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={dashboard.refreshAll}
                disabled={dashboard.isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>🔄</span>
                <span>{dashboard.isLoading ? 'Atualizando...' : 'Atualizar'}</span>
              </button>
            </div>
          </div>

          {/* Insights Rápidos */}
          {dashboard.getInsights().length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">💡 Insights Automáticos</h3>
              <div className="space-y-1">
                {dashboard.getInsights().map((insight, index) => (
                  <p key={index} className="text-blue-700 text-sm">{insight}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {dashboard.isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando dados...</span>
          </div>
        )}

        {/* Error State */}
        {dashboard.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h3 className="font-medium text-red-800">❌ Erro ao carregar dados</h3>
            <p className="text-red-700 text-sm mt-1">{dashboard.error}</p>
          </div>
        )}

        {/* Tab Content */}
        {!dashboard.isLoading && !dashboard.error && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Métricas Principais */}
                {dashboard.overview && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="text-blue-600 text-2xl mr-3">🎯</div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatNumber(dashboard.overview.total_leads)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="text-green-600 text-2xl mr-3">💰</div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Receita Total</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(dashboard.overview.total_revenue)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="text-purple-600 text-2xl mr-3">📊</div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">CPA Médio</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(dashboard.overview.avg_cpa)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="text-orange-600 text-2xl mr-3">📈</div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Taxa de Crescimento</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatPercentage(dashboard.overview.growth_rate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Séries Temporais */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Leads ao Longo do Tempo</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                      <div className="text-center text-gray-500">
                        <p>Gráfico de Séries Temporais</p>
                        <p className="text-sm">{dashboard.timeSeries.leads.length} pontos de dados</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">💰 Receita ao Longo do Tempo</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                      <div className="text-center text-gray-500">
                        <p>Gráfico de Receita</p>
                        <p className="text-sm">{dashboard.timeSeries.revenue.length} pontos de dados</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jornada do Cliente */}
                {dashboard.customerJourney && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">🛣️ Jornada do Cliente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                          <span className="font-bold">{formatNumber(dashboard.customerJourney.awareness)}</span>
                        </div>
                        <p className="text-sm font-medium">Consciência</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                          <span className="font-bold">{formatNumber(dashboard.customerJourney.consideration)}</span>
                        </div>
                        <p className="text-sm font-medium">Consideração</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-yellow-100 text-yellow-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                          <span className="font-bold">{formatNumber(dashboard.customerJourney.conversion)}</span>
                        </div>
                        <p className="text-sm font-medium">Conversão</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-purple-100 text-purple-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                          <span className="font-bold">{formatNumber(dashboard.customerJourney.retention)}</span>
                        </div>
                        <p className="text-sm font-medium">Retenção</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-pink-100 text-pink-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                          <span className="font-bold">{formatNumber(dashboard.customerJourney.advocacy)}</span>
                        </div>
                        <p className="text-sm font-medium">Advocacia</p>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        Tempo médio da jornada: <span className="font-medium">{dashboard.customerJourney.avg_journey_time} dias</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                {/* Alertas de Campanha */}
                {campaigns.campaignInsights.alerts.length > 0 && (
                  <div className="space-y-2">
                    {campaigns.campaignInsights.alerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                          alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                          'bg-red-50 border-red-200 text-red-800'
                        }`}
                      >
                        <span className="font-medium">{alert.campaign}:</span> {alert.message}
                      </div>
                    ))}
                  </div>
                )}

                {/* Lista de Campanhas */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Campanhas Ativas</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Campanha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Impressões
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Cliques
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            CTR
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Conversões
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            CPA
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            ROAS
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboard.campaigns.map((campaign) => (
                          <tr key={campaign.campaign_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {campaign.campaign_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatNumber(campaign.impressions)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatNumber(campaign.clicks)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatPercentage(campaign.ctr)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatNumber(campaign.conversions)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(campaign.cpa)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                campaign.roas >= 3 ? 'bg-green-100 text-green-800' :
                                campaign.roas >= 1.5 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {campaign.roas.toFixed(1)}x
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dashboard.socialMetrics.map((social) => (
                    <div key={social.platform} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900 capitalize">
                          {social.platform}
                        </h3>
                        <div className="text-2xl">
                          {social.platform === 'instagram' ? '📸' :
                           social.platform === 'facebook' ? '👤' :
                           social.platform === 'tiktok' ? '🎵' : '📱'}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Seguidores:</span>
                          <span className="font-medium">{formatNumber(social.followers)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Engajamento:</span>
                          <span className="font-medium">{formatPercentage(social.avg_engagement)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Alcance:</span>
                          <span className="font-medium">{formatNumber(social.reach)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cliques no site:</span>
                          <span className="font-medium">{formatNumber(social.website_clicks)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo Redes Sociais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatNumber(dashboard.getTotalSocialFollowers())}
                      </div>
                      <div className="text-sm text-gray-600">Total de Seguidores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatPercentage(dashboard.getAverageEngagementRate())}
                      </div>
                      <div className="text-sm text-gray-600">Engajamento Médio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {dashboard.socialMetrics.length}
                      </div>
                      <div className="text-sm text-gray-600">Plataformas Ativas</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Competitors Tab */}
            {activeTab === 'competitors' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Análise da Concorrência</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Concorrente
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Market Share
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Seguidores
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Gasto Estimado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Engajamento
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Trend Score
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboard.competitors.map((competitor, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {competitor.competitor_name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatPercentage(competitor.market_share)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatNumber(competitor.social_following)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(competitor.estimated_spend)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatPercentage(competitor.engagement_rate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${competitor.trend_score}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600">{competitor.trend_score}/100</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ROI Tab */}
            {activeTab === 'roi' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">ROI por Canal de Marketing</h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dashboard.channelROI.map((channel, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">{channel.channel}</h4>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Investimento:</span>
                              <span className="font-medium">{formatCurrency(channel.spend)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Receita:</span>
                              <span className="font-medium">{formatCurrency(channel.revenue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Leads:</span>
                              <span className="font-medium">{formatNumber(channel.leads)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Custo por Lead:</span>
                              <span className="font-medium">{formatCurrency(channel.cost_per_lead)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span className="font-medium">ROI:</span>
                              <span className={`font-bold ${
                                channel.roi >= 200 ? 'text-green-600' :
                                channel.roi >= 100 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {formatPercentage(channel.roi)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Melhor Canal */}
                {dashboard.getBestROIChannel() && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-medium text-green-800 mb-2">
                      🏆 Melhor Canal de ROI
                    </h3>
                    <p className="text-green-700">
                      <span className="font-medium">{dashboard.getBestROIChannel()?.channel}</span> com ROI de{' '}
                      <span className="font-bold">{formatPercentage(dashboard.getBestROIChannel()?.roi || 0)}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}