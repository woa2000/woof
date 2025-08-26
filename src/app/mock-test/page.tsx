/**
 * Página de Teste de Mocks
 * Para debuggar e testar o sistema de dados mockados
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useDataProvider, getProviderConfig } from '@/services/data-provider.service';
import { useAuth } from '@/hooks/features/useAuth';
import { useAnamneseDigital } from '@/hooks/features/useAnamneseDigital';

export default function MockTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<any>({});
  
  const dataProvider = useDataProvider();
  const config = getProviderConfig();
  const { user } = useAuth();
  const anamneseHook = useAnamneseDigital();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const runTests = async () => {
    addLog('🧪 Iniciando testes do sistema de mocks...');
    
    try {
      // Teste 1: Verificar provider
      addLog(`📊 Provider Type: ${config.type}`);
      addLog(`🔧 Mock Data Enabled: ${config.mockDataEnabled}`);
      addLog(`🤖 Mock AI Enabled: ${config.mockAiEnabled}`);
      
      // Teste 2: Verificar usuário
      if (user) {
        addLog(`👤 Usuário logado: ${user.email} (ID: ${user.id.slice(0, 8)}...)`);
        
        // Teste 3: Popular dados mock
        if ('populateUserData' in dataProvider && typeof dataProvider.populateUserData === 'function') {
          addLog('📝 Populando dados mock para usuário...');
          dataProvider.populateUserData(user.id);
          addLog('✅ Dados mock populados');
        } else {
          addLog('⚠️ Método populateUserData não disponível no provider');
        }
        
        // Teste 4: Buscar anamneses
        addLog('🔍 Buscando anamneses via DataProvider...');
        const anamneses = await dataProvider.anamneses.getAll(user.id);
        addLog(`📄 Anamneses encontradas: ${anamneses.length}`);
        
        setTestResults(prev => ({
          ...prev,
          anamneses: anamneses.length,
          anamneseData: anamneses[0] ? {
            id: anamneses[0].id,
            url: anamneses[0].url_analisada,
            status: anamneses[0].status
          } : null
        }));
        
        // Teste 5: Hook de anamneses
        addLog(`🎯 Hook anamneses count: ${anamneseHook.anamneses.length}`);
        addLog(`🔄 Hook loading: ${anamneseHook.loading}`);
        addLog(`❌ Hook error: ${anamneseHook.error || 'none'}`);
        
      } else {
        addLog('❌ Usuário não logado');
      }
      
      addLog('✅ Testes concluídos');
      
    } catch (error) {
      addLog(`❌ Erro durante os testes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const testAnalysis = async () => {
    if (!user) {
      addLog('❌ Não é possível testar análise sem usuário logado');
      return;
    }

    addLog('🔬 Testando análise de URL...');
    
    try {
      const testUrl = 'https://test-vet-clinic.com.br';
      const result = await anamneseHook.analyzeUrl(testUrl, ['@test_vet']);
      
      if (result) {
        addLog(`✅ Análise criada: ${result.id}`);
        addLog(`📊 URL analisada: ${result.url_analisada}`);
        addLog(`⭐ Score geral: ${result.overall_score || 'N/A'}`);
        setTestResults(prev => ({
          ...prev,
          newAnalysis: {
            id: result.id,
            url: result.url_analisada,
            score: result.overall_score
          }
        }));
      } else {
        addLog('❌ Falha na criação da análise');
      }
    } catch (error) {
      addLog(`❌ Erro na análise: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  useEffect(() => {
    // Auto-run basic tests when component mounts
    if (user) {
      setTimeout(runTests, 1000);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🧪 Sistema de Testes - Mocks Debug
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações do Sistema */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Informações do Sistema</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment:</span>
                  <span className="font-mono">{config.environment}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider Type:</span>
                  <span className={`font-mono ${config.type === 'mock' ? 'text-green-600' : 'text-blue-600'}`}>
                    {config.type}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Mock Data:</span>
                  <span className={`font-mono ${config.mockDataEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {config.mockDataEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">User Status:</span>
                  <span className={`font-mono ${user ? 'text-green-600' : 'text-red-600'}`}>
                    {user ? 'Authenticated' : 'Not authenticated'}
                  </span>
                </div>
              </div>
            </div>

            {/* Resultados dos Testes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Resultados dos Testes</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Anamneses Carregadas:</span>
                  <span className="font-mono text-blue-600">
                    {testResults.anamneses || 0}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Hook Anamneses:</span>
                  <span className="font-mono text-purple-600">
                    {anamneseHook.anamneses.length}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Hook Loading:</span>
                  <span className={`font-mono ${anamneseHook.loading ? 'text-orange-600' : 'text-gray-400'}`}>
                    {anamneseHook.loading ? 'true' : 'false'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Hook Error:</span>
                  <span className={`font-mono ${anamneseHook.error ? 'text-red-600' : 'text-gray-400'}`}>
                    {anamneseHook.error ? 'Yes' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Botões de Ação */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={runTests}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              🔄 Executar Testes
            </button>
            
            <button
              onClick={testAnalysis}
              disabled={!user || anamneseHook.analyzing}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {anamneseHook.analyzing ? '⏳ Analisando...' : '🔬 Testar Análise'}
            </button>
            
            <button
              onClick={() => setLogs([])}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              🗑️ Limpar Logs
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-black text-green-400 rounded-lg p-4 font-mono text-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-bold">📊 Logs do Sistema</h3>
            <span className="text-gray-400 text-xs">{logs.length} entradas</span>
          </div>
          
          <div className="h-96 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <div className="text-gray-500">Aguardando logs...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Debug Data */}
        {testResults.anamneseData && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🔍 Dados de Exemplo (Primeira Anamnese)</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(testResults.anamneseData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}