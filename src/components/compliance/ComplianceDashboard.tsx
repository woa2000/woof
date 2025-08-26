/**
 * Componente de Compliance Dashboard
 * 
 * Interface completa para monitorar e gerenciar compliance de conteúdo
 * Integração com IA para validação automática e correção
 */

'use client';

import React, { useState } from 'react';
import { usePetCompliance } from '@/hooks/compliance/usePetCompliance';
import { useAIComplianceWorkflow } from '@/hooks/compliance/useAIComplianceWorkflow';

interface TestContent {
  id: string;
  content: string;
  type: 'social_post' | 'email' | 'landing_page' | 'ad_copy';
  source: 'manual' | 'ai_generated';
}

export function ComplianceDashboard() {
  const [businessType, setBusinessType] = useState<'veterinary_clinic' | 'pet_shop' | 'grooming_salon' | 'pet_training' | 'pet_hotel'>('veterinary_clinic');
  const [activeTab, setActiveTab] = useState<'validation' | 'workflow' | 'guide' | 'report'>('validation');
  
  const petCompliance = usePetCompliance(businessType);
  const aiWorkflow = useAIComplianceWorkflow(businessType);
  
  const [testContent, setTestContent] = useState('');
  const [contentType, setContentType] = useState<'social_post' | 'email' | 'landing_page' | 'ad_copy'>('social_post');
  const [testContents, setTestContents] = useState<TestContent[]>([]);

  // Amostras de conteúdo para teste
  const sampleContents = {
    veterinary_clinic: [
      'Nosso veterinário pode diagnosticar e curar qualquer doença do seu pet! Garantimos 100% de sucesso no tratamento.',
      'Check-up preventivo é essencial para a saúde do seu melhor amigo. Agende já sua consulta conosco!',
      'Vacinação em dia = pet protegido. Nossa clínica oferece todas as vacinas necessárias para seu animal.',
    ],
    pet_shop: [
      'Ração premium com desconto! A melhor do mundo para seu pet ficar sempre saudável.',
      'Chocolate para pets? NUNCA! Conheça os petiscos seguros em nossa loja.',
      'Tudo para seu pet em um só lugar. Qualidade garantida e preços imbatíveis!',
    ],
    grooming_salon: [
      'Seu pet mais bonito e cheiroso! Banho e tosa profissional com todo cuidado.',
      'Corte as unhas do seu pet em casa seguindo nossas dicas simples.',
      'Spa pet completo: banho, tosa, hidratação e muito carinho para seu peludo.',
    ]
  };

  const tabs = [
    { id: 'validation', label: 'Validação', icon: '✅' },
    { id: 'workflow', label: 'Workflow IA + Compliance', icon: '🤖' },
    { id: 'guide', label: 'Guia de Compliance', icon: '📋' },
    { id: 'report', label: 'Relatório', icon: '📊' }
  ];

  const businessTypes = [
    { value: 'veterinary_clinic', label: 'Clínica Veterinária' },
    { value: 'pet_shop', label: 'Pet Shop' },
    { value: 'grooming_salon', label: 'Grooming/Estética' },
    { value: 'pet_training', label: 'Adestramento' },
    { value: 'pet_hotel', label: 'Hotel Pet' }
  ];

  const handleTestSample = (sample: string) => {
    setTestContent(sample);
  };

  const handleValidateContent = async () => {
    if (!testContent.trim()) return;
    await petCompliance.validateContent(testContent, contentType);
  };

  const handleBatchValidation = async () => {
    if (testContents.length === 0) return;
    
    const contentData = testContents.map(tc => ({
      id: tc.id,
      content: tc.content,
      type: tc.type
    }));
    
    await petCompliance.validateBatch(contentData);
  };

  const addTestContent = () => {
    if (!testContent.trim()) return;
    
    const newContent: TestContent = {
      id: `content_${Date.now()}`,
      content: testContent,
      type: contentType,
      source: 'manual'
    };
    
    setTestContents(prev => [...prev, newContent]);
    setTestContent('');
  };

  const removeTestContent = (id: string) => {
    setTestContents(prev => prev.filter(tc => tc.id !== id));
  };

  const generateReport = async () => {
    if (testContents.length === 0) return;
    
    const contentData = testContents.map(tc => ({
      id: tc.id,
      content: tc.content,
      type: tc.type
    }));
    
    await petCompliance.generateComplianceReport(contentData);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-200';
      case 'high': return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-800 bg-blue-100 border-blue-200';
      default: return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
              <p className="text-gray-600">Sistema de validação de compliance para conteúdo pet</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Seletor de Tipo de Negócio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Negócio
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
                  className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {businessTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
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

        {/* Tab Content */}
        {activeTab === 'validation' && (
          <div className="space-y-8">
            {/* Teste de Conteúdo Único */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Validação de Conteúdo</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Conteúdo
                    </label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="social_post">Post Social</option>
                      <option value="email">Email</option>
                      <option value="landing_page">Landing Page</option>
                      <option value="ad_copy">Anúncio</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conteúdo para Validar
                    </label>
                    <textarea
                      value={testContent}
                      onChange={(e) => setTestContent(e.target.value)}
                      className="w-full h-32 border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Cole ou digite o conteúdo para validar..."
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={handleValidateContent}
                      disabled={!testContent.trim() || petCompliance.isValidating}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {petCompliance.isValidating ? 'Validando...' : 'Validar Compliance'}
                    </button>
                    <button
                      onClick={addTestContent}
                      disabled={!testContent.trim()}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Adicionar ao Lote
                    </button>
                  </div>

                  {/* Amostras de Teste */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amostras para Teste ({businessTypes.find(bt => bt.value === businessType)?.label})
                    </label>
                    <div className="space-y-2">
                      {sampleContents[businessType].map((sample, index) => (
                        <button
                          key={index}
                          onClick={() => handleTestSample(sample)}
                          className="w-full text-left p-2 text-xs bg-gray-50 rounded border hover:bg-gray-100"
                        >
                          {sample}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Resultado da Validação */}
                <div>
                  {petCompliance.lastValidation && (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg border ${
                        petCompliance.lastValidation.is_compliant
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">
                            {petCompliance.lastValidation.is_compliant ? '✅ Aprovado' : '❌ Reprovado'}
                          </h3>
                          <span className="text-sm">
                            Confiança: {(petCompliance.lastValidation.confidence_score * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        {petCompliance.lastValidation.violations.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Violações ({petCompliance.lastValidation.violations.length})</h4>
                            <div className="space-y-2">
                              {petCompliance.lastValidation.violations.map((violation, index) => (
                                <div key={index} className={`p-2 rounded border ${getSeverityColor(violation.severity)}`}>
                                  <div className="flex justify-between items-start">
                                    <span className="font-medium text-xs uppercase">{violation.severity}</span>
                                    <span className="text-xs">{violation.category}</span>
                                  </div>
                                  <p className="text-sm mt-1">{violation.message}</p>
                                  <p className="text-xs mt-1 font-mono bg-white/50 p-1 rounded">
                                    "{violation.matched_text}"
                                  </p>
                                  <p className="text-xs mt-1 text-gray-600">
                                    💡 {violation.suggestion}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {petCompliance.lastValidation.required_disclaimers.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Disclaimers Necessários</h4>
                            <ul className="text-sm space-y-1">
                              {petCompliance.lastValidation.required_disclaimers.map((disclaimer, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-yellow-600 mr-2">⚠️</span>
                                  {disclaimer}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {petCompliance.lastValidation.recommendations.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Recomendações</h4>
                            <ul className="text-sm space-y-1">
                              {petCompliance.lastValidation.recommendations.map((recommendation, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-600 mr-2">💡</span>
                                  {recommendation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {petCompliance.lastValidation.approved_content && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Conteúdo Aprovado (com correções)</h4>
                            <div className="bg-white p-3 rounded border text-sm">
                              {petCompliance.lastValidation.approved_content}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lote de Conteúdos */}
            {testContents.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Lote de Conteúdos ({testContents.length})
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleBatchValidation}
                      disabled={petCompliance.isValidating}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                      {petCompliance.isValidating ? 'Validando...' : 'Validar Lote'}
                    </button>
                    <button
                      onClick={generateReport}
                      disabled={petCompliance.isGeneratingReport}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {petCompliance.isGeneratingReport ? 'Gerando...' : 'Gerar Relatório'}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {testContents.map(content => (
                    <div key={content.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                            {content.type}
                          </span>
                          <span className="text-xs text-gray-500">{content.source}</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{content.content}</p>
                      </div>
                      <button
                        onClick={() => removeTestContent(content.id)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>

                {/* Estatísticas do Lote */}
                {petCompliance.getValidationStats() && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {petCompliance.getValidationStats()?.compliance_rate}%
                      </div>
                      <div className="text-xs text-blue-600">Taxa de Compliance</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {petCompliance.getValidationStats()?.compliant_content}
                      </div>
                      <div className="text-xs text-green-600">Conteúdos Aprovados</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-2xl font-bold text-red-600">
                        {petCompliance.getValidationStats()?.critical_violations}
                      </div>
                      <div className="text-xs text-red-600">Violações Críticas</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-2xl font-bold text-purple-600">
                        {petCompliance.getValidationStats()?.average_confidence.toFixed(1)}
                      </div>
                      <div className="text-xs text-purple-600">Confiança Média</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-8">
            {petCompliance.complianceGuide && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Disclaimers Obrigatórios */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    📋 Disclaimers Obrigatórios
                  </h2>
                  <div className="space-y-3">
                    {petCompliance.complianceGuide.mandatory_disclaimers.map((disclaimer, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm">{disclaimer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Termos Aprovados vs Restritos */}
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-green-800 mb-4">
                      ✅ Termos Aprovados
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {petCompliance.complianceGuide.approved_terms.map((term, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-red-800 mb-4">
                      ❌ Termos Restritos
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {petCompliance.complianceGuide.restricted_terms.map((term, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Melhores Práticas */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      💡 Melhores Práticas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {petCompliance.complianceGuide.best_practices.map((practice, index) => (
                        <div key={index} className="flex items-start p-3 bg-blue-50 rounded">
                          <span className="text-blue-600 mr-3 mt-0.5">📌</span>
                          <p className="text-sm text-blue-800">{practice}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🤖 Workflow IA + Compliance
            </h2>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Interface em Desenvolvimento
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                A interface visual para o workflow integrado de IA + Compliance está sendo desenvolvida. 
                O sistema backend está completamente funcional através dos hooks useAIComplianceWorkflow.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Relatório de Compliance
            </h2>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Relatórios Automáticos
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Funcionalidade de relatórios disponível através do hook usePetCompliance.generateComplianceReport(). 
                Interface visual em desenvolvimento.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}