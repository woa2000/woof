/**
 * Componente de Debug para IA
 * 
 * Painel para monitorar operações de IA, custos e performance
 * Útil para desenvolvimento e debugging
 */

'use client';

import React, { useState } from 'react';
import { useAIService } from '@/services/ai/ai-service-factory';
import { useAICostMonitoring } from '@/hooks/ai/useAICostMonitoring';
import { useContentGeneration } from '@/hooks/ai/useContentGeneration';

export function AIDebugPanel() {
  const aiService = useAIService();
  const costMonitoring = useAICostMonitoring();
  const contentGeneration = useContentGeneration();
  
  const [activeTab, setActiveTab] = useState<'costs' | 'logs' | 'test'>('costs');
  const [testContent, setTestContent] = useState('');
  const [testPlatform, setTestPlatform] = useState('instagram');

  const tabs = [
    { id: 'costs', label: 'Custos & Analytics' },
    { id: 'logs', label: 'Logs de Operações' },
    { id: 'test', label: 'Teste de IA' }
  ];

  const handleTestGeneration = async () => {
    const request = {
      prompt: 'Crie um post para promover consulta veterinária',
      brand_voice: {
        personality: 'profissional e cuidadoso',
        tone: 'amigável',
        target_audience: 'donos de pets',
        industry_context: 'clínica veterinária'
      },
      content_type: 'social_post' as const,
      platform: testPlatform
    };

    await contentGeneration.generateCompleteContent(request);
  };

  const handleTestCompliance = async () => {
    if (!testContent.trim()) return;
    await contentGeneration.checkCompliance(testContent);
  };

  const handleTestPerformance = async () => {
    if (!testContent.trim()) return;
    await contentGeneration.predictPerformance(testContent, testPlatform);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🤖 AI Debug Panel
        </h2>
        <p className="text-gray-600">
          Monitor de operações de IA, custos e testes
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          {/* Alertas */}
          {costMonitoring.alerts.length > 0 && (
            <div className="space-y-2">
              {costMonitoring.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    alert.type === 'danger'
                      ? 'bg-red-100 border border-red-200 text-red-800'
                      : 'bg-yellow-100 border border-yellow-200 text-yellow-800'
                  }`}
                >
                  <div className="font-medium">
                    {alert.type === 'danger' ? '🚨' : '⚠️'} {alert.message}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-medium">Total Gasto</div>
              <div className="text-2xl font-bold text-blue-800">
                ${costMonitoring.analytics.total.toFixed(4)}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 font-medium">Hoje</div>
              <div className="text-2xl font-bold text-green-800">
                ${costMonitoring.analytics.today.toFixed(4)}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 font-medium">Este Mês</div>
              <div className="text-2xl font-bold text-purple-800">
                ${costMonitoring.analytics.thisMonth.toFixed(4)}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-orange-600 font-medium">Operações</div>
              <div className="text-2xl font-bold text-orange-800">
                {costMonitoring.analytics.count}
              </div>
            </div>
          </div>

          {/* Limites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Limite Diário</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg">${costMonitoring.dailyLimit}</span>
                <div className={`px-2 py-1 rounded text-sm ${
                  costMonitoring.analytics.today > costMonitoring.dailyLimit 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {((costMonitoring.analytics.today / costMonitoring.dailyLimit) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Limite Mensal</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg">${costMonitoring.monthlyLimit}</span>
                <div className={`px-2 py-1 rounded text-sm ${
                  costMonitoring.analytics.thisMonth > costMonitoring.monthlyLimit 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {((costMonitoring.analytics.thisMonth / costMonitoring.monthlyLimit) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Dicas de Otimização */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">💡 Dicas de Otimização</h3>
            <ul className="space-y-1">
              {costMonitoring.getOptimizationTips().map((tip, index) => (
                <li key={index} className="text-blue-700 text-sm">• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Últimas Operações</h3>
            <button
              onClick={() => costMonitoring.updateAnalytics()}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Atualizar
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tokens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Conteúdo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aiService.getOperationLogs().slice(-10).map((log, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.request.content_type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.response.tokens_used || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${log.cost.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {log.response.content || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'test' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Teste de Geração */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">🎯 Teste de Geração</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plataforma
                </label>
                <select
                  value={testPlatform}
                  onChange={(e) => setTestPlatform(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>

              <button
                onClick={handleTestGeneration}
                disabled={contentGeneration.isGenerating}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {contentGeneration.isGenerating ? 'Gerando...' : 'Gerar Conteúdo Teste'}
              </button>

              {contentGeneration.lastGenerated && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Conteúdo Gerado:</h4>
                  <p className="text-green-700 mb-2">{contentGeneration.lastGenerated.content}</p>
                  <div className="text-sm text-green-600">
                    Tokens: {contentGeneration.lastGenerated.tokens_used} | 
                    Custo: ${contentGeneration.lastGenerated.cost_estimate.toFixed(4)} |
                    Confiança: {(contentGeneration.lastGenerated.confidence_score * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>

            {/* Teste Manual */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">✏️ Teste Manual</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo para Teste
                </label>
                <textarea
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Digite o conteúdo para testar compliance e performance..."
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleTestCompliance}
                  disabled={!testContent.trim() || contentGeneration.isCheckingCompliance}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                >
                  {contentGeneration.isCheckingCompliance ? 'Verificando...' : 'Compliance'}
                </button>
                <button
                  onClick={handleTestPerformance}
                  disabled={!testContent.trim() || contentGeneration.isPredictingPerformance}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {contentGeneration.isPredictingPerformance ? 'Analisando...' : 'Performance'}
                </button>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Compliance Result */}
            {contentGeneration.complianceResult && (
              <div className={`p-4 rounded-lg ${
                contentGeneration.complianceResult.is_compliant 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  contentGeneration.complianceResult.is_compliant 
                    ? 'text-green-800' 
                    : 'text-red-800'
                }`}>
                  📋 Resultado de Compliance
                </h4>
                
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 rounded text-sm ${
                    contentGeneration.complianceResult.is_compliant 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {contentGeneration.complianceResult.is_compliant ? '✅ Aprovado' : '❌ Reprovado'}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    Confiança: {(contentGeneration.complianceResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                {contentGeneration.complianceResult.issues.length > 0 && (
                  <div className="mb-2">
                    <div className="text-sm font-medium text-red-700">Problemas:</div>
                    <ul className="text-sm text-red-600">
                      {contentGeneration.complianceResult.issues.map((issue, i) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {contentGeneration.complianceResult.suggestions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-yellow-700">Sugestões:</div>
                    <ul className="text-sm text-yellow-600">
                      {contentGeneration.complianceResult.suggestions.map((suggestion, i) => (
                        <li key={i}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Performance Result */}
            {contentGeneration.performanceResult && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">📊 Previsão de Performance</h4>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Engajamento:</span>
                    <span className="font-medium">
                      {(contentGeneration.performanceResult.engagement_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Alcance estimado:</span>
                    <span className="font-medium">
                      {contentGeneration.performanceResult.reach_estimate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Taxa de conversão:</span>
                    <span className="font-medium">
                      {(contentGeneration.performanceResult.conversion_probability * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                {contentGeneration.performanceResult.recommendations.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-blue-700">Recomendações:</div>
                    <ul className="text-sm text-blue-600">
                      {contentGeneration.performanceResult.recommendations.map((rec, i) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}