/**
 * Hook para visualização e debug de dados mockados
 * Permite inspecionar que tipo de provider está sendo usado
 * e visualizar os dados que estão sendo retornados
 */

import { useState, useEffect } from 'react';
import { useDataProvider, getProviderConfig, ProviderConfig } from '@/services/data-provider.service';
import { useAuth } from '@/hooks/features/useAuth';

export const useMockDataViewer = () => {
  const [providerConfig, setProviderConfig] = useState<ProviderConfig | null>(null);
  const [mockData, setMockData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const dataProvider = useDataProvider();
  const { user } = useAuth();

  // Carregar configuração do provider
  useEffect(() => {
    const config = getProviderConfig();
    setProviderConfig(config);
  }, []);

  // Carregar dados de exemplo de todos os providers
  const loadSampleData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [anamneses, campaigns, analytics] = await Promise.all([
        dataProvider.anamneses.getAll(user.id).catch(() => []),
        dataProvider.campaigns.getAll(user.id).catch(() => []),
        dataProvider.analytics.getDashboardData(user.id).catch(() => null),
      ]);

      setMockData({
        anamneses,
        campaigns,
        analytics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Limpar dados carregados
  const clearData = () => {
    setMockData(null);
  };

  // Verificar se está usando mocks
  const isMockMode = providerConfig?.type === 'mock';

  // Estatísticas dos dados carregados
  const getDataStats = () => {
    if (!mockData) return null;

    return {
      anamneses: mockData.anamneses?.length || 0,
      campaigns: mockData.campaigns?.length || 0,
      hasAnalytics: !!mockData.analytics,
      lastUpdated: mockData.timestamp
    };
  };

  return {
    // Estado
    providerConfig,
    mockData,
    loading,
    
    // Ações
    loadSampleData,
    clearData,
    
    // Utilitários
    isMockMode,
    getDataStats,
    
    // Debug info
    debugInfo: {
      environment: process.env.NODE_ENV,
      mockDataEnabled: process.env.MOCK_DATA_ENABLED,
      mockAiEnabled: process.env.MOCK_AI_ENABLED,
      mockAnalyticsEnabled: process.env.MOCK_ANALYTICS_ENABLED,
    }
  };
};

// Hook para forçar re-criação do provider (útil para testes)
export const useProviderReset = () => {
  const resetProvider = () => {
    // Re-importa o factory para forçar nova instância
    import('@/services/data-provider.service').then(({ DataProviderFactory }) => {
      DataProviderFactory.resetInstance();
      console.log('🔄 Provider resetado - Nova instância será criada na próxima chamada');
    });
  };

  const switchToMocks = () => {
    // Temporariamente força mocks (apenas para debugging)
    (window as any).__FORCE_MOCK_MODE__ = true;
    resetProvider();
    console.log('🎭 Forçando modo mock - Recarregue a página para aplicar');
  };

  const switchToReal = () => {
    // Remove forçar mocks
    delete (window as any).__FORCE_MOCK_MODE__;
    resetProvider();
    console.log('🗄️ Voltando para dados reais - Recarregue a página para aplicar');
  };

  return {
    resetProvider,
    switchToMocks,
    switchToReal
  };
};