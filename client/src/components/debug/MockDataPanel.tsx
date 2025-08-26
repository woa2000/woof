/**
 * Painel de Debug para visualização e controle dos providers de dados
 * Mostra informações sobre mocks vs dados reais
 * Visível apenas em desenvolvimento
 */

'use client';

import { useState } from 'react';
import { useMockDataViewer, useProviderReset } from '@/hooks/debug/useMockDataViewer';

export const MockDataPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'data' | 'controls'>('config');
  
  const {
    providerConfig,
    mockData,
    loading,
    loadSampleData,
    clearData,
    isMockMode,
    getDataStats,
    debugInfo
  } = useMockDataViewer();
  
  const { resetProvider, switchToMocks, switchToReal } = useProviderReset();

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const stats = getDataStats();

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Botão toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-3 py-2 rounded-lg text-xs font-mono border-2 transition-all
          ${isMockMode 
            ? 'bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200' 
            : 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200'
          }
        `}
      >
        {isMockMode ? '🎭 MOCK' : '🗄️ REAL'} Data
      </button>

      {/* Painel principal */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 bg-white border border-gray-200 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold text-sm">Debug Data Provider</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {[
              { key: 'config', label: 'Config' },
              { key: 'data', label: 'Data' },
              { key: 'controls', label: 'Controls' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`
                  px-4 py-2 text-xs font-medium border-b-2 transition-colors
                  ${activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 max-h-80 overflow-y-auto">
            {/* Tab Config */}
            {activeTab === 'config' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Provider Type</label>
                  <div className={`
                    text-sm font-mono px-2 py-1 rounded mt-1
                    ${isMockMode 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-blue-100 text-blue-800'
                    }
                  `}>
                    {providerConfig?.type || 'loading...'}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Environment</label>
                  <div className="text-sm font-mono px-2 py-1 bg-gray-100 rounded mt-1">
                    {providerConfig?.environment}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="font-medium text-gray-600">Data</label>
                    <div className={`
                      text-center py-1 rounded mt-1 font-mono
                      ${providerConfig?.mockDataEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }
                    `}>
                      {providerConfig?.mockDataEnabled ? 'MOCK' : 'REAL'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-600">AI</label>
                    <div className={`
                      text-center py-1 rounded mt-1 font-mono
                      ${providerConfig?.mockAiEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }
                    `}>
                      {providerConfig?.mockAiEnabled ? 'MOCK' : 'REAL'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-600">Analytics</label>
                    <div className={`
                      text-center py-1 rounded mt-1 font-mono
                      ${providerConfig?.mockAnalyticsEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }
                    `}>
                      {providerConfig?.mockAnalyticsEnabled ? 'MOCK' : 'REAL'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Data */}
            {activeTab === 'data' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Sample Data</h4>
                  <button
                    onClick={loadSampleData}
                    disabled={loading}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load'}
                  </button>
                </div>

                {stats && (
                  <div className="bg-gray-50 p-3 rounded text-xs">
                    <div>Anamneses: {stats.anamneses}</div>
                    <div>Campanhas: {stats.campaigns}</div>
                    <div>Analytics: {stats.hasAnalytics ? '✓' : '✗'}</div>
                    <div className="text-gray-500 mt-1">
                      Updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                )}

                {mockData && (
                  <div className="space-y-2">
                    <button
                      onClick={clearData}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Clear Data
                    </button>
                    
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40">
                      {JSON.stringify(mockData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab Controls */}
            {activeTab === 'controls' && (
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Provider Controls</h4>
                  <div className="space-y-2">
                    <button
                      onClick={resetProvider}
                      className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
                    >
                      🔄 Reset Provider
                    </button>
                    
                    <button
                      onClick={switchToMocks}
                      className="w-full px-3 py-2 bg-orange-100 hover:bg-orange-200 text-sm rounded"
                    >
                      🎭 Force Mock Mode
                    </button>
                    
                    <button
                      onClick={switchToReal}
                      className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 text-sm rounded"
                    >
                      🗄️ Force Real Data
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    * Changes require page reload
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Debug Info</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};