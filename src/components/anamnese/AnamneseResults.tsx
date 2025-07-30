import React, { useState } from 'react';
import { AnamneseDigital } from '@/lib/types/anamnese';
import { ChevronDown, ChevronRight, ExternalLink, Download, Share2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import AnamneseStats from './AnamneseStats';

interface AnamneseResultsProps {
  anamnese: AnamneseDigital;
}

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  color?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultExpanded = false,
  color = 'orange'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200 border-l-4 border-${color}-500`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const AnamneseResults: React.FC<AnamneseResultsProps> = ({ anamnese }) => {
  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEsforcoColor = (esforco: string) => {
    switch (esforco) {
      case 'Alto': return 'bg-red-100 text-red-800 border-red-200';
      case 'Médio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baixo': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'Alto': return 'bg-green-100 text-green-800 border-green-200';
      case 'Médio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baixo': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com informações da análise */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Anamnese Digital Completa</h2>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-orange-100">URL Analisada:</span>
              <a 
                href={anamnese.url_analisada} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-orange-100 transition-colors flex items-center space-x-1"
              >
                <span className="truncate max-w-md">{anamnese.url_analisada}</span>
                <ExternalLink size={16} />
              </a>
            </div>
            {anamnese.redes_sociais && anamnese.redes_sociais.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-orange-100">Redes Sociais:</span>
                <span className="text-white">{anamnese.redes_sociais.length} analisada(s)</span>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              icon={Download}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Exportar PDF
            </Button>
            <Button
              variant="secondary"
              icon={Share2}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Compartilhar
            </Button>
          </div>
        </div>
        <div className="text-right text-sm text-orange-100">
          {anamnese.created_at && (
            <p>Criado em: {new Date(anamnese.created_at).toLocaleDateString('pt-BR')}</p>
          )}
          {anamnese.updated_at && anamnese.updated_at !== anamnese.created_at && (
            <p>Atualizado em: {new Date(anamnese.updated_at).toLocaleDateString('pt-BR')}</p>
          )}
        </div>
      </div>

      {/* Statistics Overview */}
      <AnamneseStats anamnese={anamnese} />

      {/* Seções Colapsáveis */}
      <div className="space-y-4">
        {/* Diagnóstico de Identidade e Propósito */}
        <CollapsibleSection
          title="Diagnóstico de Identidade e Propósito"
          icon="🎯"
          defaultExpanded={true}
        >
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  DNA da Marca
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {anamnese.diagnostico_identidade_e_proposito.dna_marca}
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Hipótese de Negócio
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {anamnese.diagnostico_identidade_e_proposito.hipotese_negocio}
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Métrica Chave de Sucesso
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {anamnese.diagnostico_identidade_e_proposito.metrica_chave_sucesso}
                </p>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Personas */}
        <CollapsibleSection
          title="Personas Identificadas"
          icon="👥"
          defaultExpanded={true}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {anamnese.personas.map((persona, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {persona.nome.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{persona.nome}</h4>
                    <p className="text-gray-600">{persona.idade} anos • {persona.papel}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="font-medium text-blue-900 text-sm">Pensa:</span>
                      <p className="text-blue-800 text-sm mt-1">{persona.pensa_sente.pensa}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="font-medium text-purple-900 text-sm">Sente:</span>
                      <p className="text-purple-800 text-sm mt-1">{persona.pensa_sente.sente}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700 text-sm">👀 O que vê:</span>
                      <p className="text-gray-600 text-sm">{persona.vê}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 text-sm">💬 Fala/Faz:</span>
                      <p className="text-gray-600 text-sm">{persona.fala_faz}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="font-medium text-red-700 text-sm">😣 Dores:</span>
                        <p className="text-red-600 text-sm">{persona.dores}</p>
                      </div>
                      <div>
                        <span className="font-medium text-green-700 text-sm">🎯 Ganhos:</span>
                        <p className="text-green-600 text-sm">{persona.ganhos}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Quick Wins */}
        <CollapsibleSection
          title="Quick Wins - Ações Imediatas"
          icon="⚡"
          color="green"
          defaultExpanded={true}
        >
          <div className="space-y-3">
            {anamnese.plano_tratamento_e_evolucao.quick_wins.map((win, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{win}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                      Implementação rápida
                    </span>
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                      Alto impacto
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Jornada do Paciente Zero */}
        <CollapsibleSection
          title="Jornada do Paciente Zero"
          icon="🛤️"
          color="blue"
        >
          <div className="relative">
            {anamnese.auditoria_percepcao_experiencia.jornada_paciente_zero.map((etapa, index) => (
              <div key={index} className="flex items-start space-x-4 pb-8 relative">
                {index !== anamnese.auditoria_percepcao_experiencia.jornada_paciente_zero.length - 1 && (
                  <div className="absolute left-3 top-8 w-0.5 h-full bg-gradient-to-b from-blue-500 to-blue-300"></div>
                )}
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold relative z-10">
                  {index + 1}
                </div>
                <div className="flex-1 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-800">{etapa}</p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Janela de Johari */}
        <CollapsibleSection
          title="Janela de Johari - Análise de Autopercepção"
          icon="🪟"
          color="indigo"
          defaultExpanded={true}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Arena - Conhecido por mim e pelos outros */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">👁️</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-lg">Arena</h4>
                  <p className="text-green-700 text-sm">Conhecido por mim e pelos visitantes</p>
                </div>
              </div>
              <div className="space-y-3">
                {anamnese.auditoria_percepcao_experiencia.johari.arena.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p className="text-green-800 text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ponto Cego - Conhecido pelos outros, mas não por mim */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🔍</span>
                </div>
                <div>
                  <h4 className="font-bold text-orange-900 text-lg">Ponto Cego</h4>
                  <p className="text-orange-700 text-sm">Visível aos visitantes, mas não percebido por mim</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Heurísticas de Nielsen */}
                {anamnese.auditoria_percepcao_experiencia.johari.ponto_cego.heuristicas_nielsen && (
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-900 mb-3 flex items-center">
                      📊 Heurísticas de Nielsen
                    </h5>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(anamnese.auditoria_percepcao_experiencia.johari.ponto_cego.heuristicas_nielsen).map(([key, value], index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-orange-100 rounded">
                          <span className="text-orange-800 text-sm font-medium capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {[...Array(10)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < (value as number) ? 'bg-orange-500' : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-orange-700 font-bold text-sm">{value}/10</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acessibilidade */}
                {anamnese.auditoria_percepcao_experiencia.johari.ponto_cego.acessibilidade && (
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-900 mb-2 flex items-center">
                      ♿ Acessibilidade
                    </h5>
                    <p className="text-orange-800 text-sm">
                      {anamnese.auditoria_percepcao_experiencia.johari.ponto_cego.acessibilidade}
                    </p>
                  </div>
                )}

                {/* Performance */}
                {anamnese.auditoria_percepcao_experiencia.johari.ponto_cego.performance && (
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-900 mb-2 flex items-center">
                      ⚡ Performance
                    </h5>
                    <p className="text-orange-800 text-sm">
                      {anamnese.auditoria_percepcao_experiencia.johari.ponto_cego.performance}
                    </p>
                  </div>
                )}

                {/* UI Visual */}
                {anamnese.auditoria_percepcao_experiencia.johari.ponto_cego.ui_visual && (
                  <div className="bg-white/50 p-4 rounded-lg">
                    <h5 className="font-semibold text-orange-900 mb-2 flex items-center">
                      🎨 UI Visual
                    </h5>
                    <p className="text-orange-800 text-sm">
                      {anamnese.auditoria_percepcao_experiencia.johari.ponto_cego.ui_visual}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fachada - Conhecido por mim, mas não pelos outros */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🎭</span>
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-lg">Fachada</h4>
                  <p className="text-blue-700 text-sm">Conhecimento interno não transmitido</p>
                </div>
              </div>
              <div className="space-y-3">
                {anamnese.auditoria_percepcao_experiencia.johari.fachada.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-blue-800 text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desconhecido - Não conhecido por ninguém */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">❓</span>
                </div>
                <div>
                  <h4 className="font-bold text-purple-900 text-lg">Desconhecido</h4>
                  <p className="text-purple-700 text-sm">Potenciais ainda não explorados</p>
                </div>
              </div>
              <div className="space-y-3">
                {anamnese.auditoria_percepcao_experiencia.johari.desconhecido.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white/50 p-3 rounded-lg">
                    <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <p className="text-purple-800 text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explicação da Janela de Johari */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
              💡 Sobre a Janela de Johari
            </h5>
            <p className="text-gray-700 text-sm leading-relaxed">
              A Janela de Johari é uma ferramenta de autoconhecimento que mapeia a percepção do seu negócio 
              digital sob quatro perspectivas: o que é óbvio (Arena), o que os visitantes percebem mas você 
              pode não estar ciente (Ponto Cego), o que você sabe mas não está comunicando bem (Fachada), 
              e as oportunidades ainda não exploradas (Desconhecido).
            </p>
          </div>
        </CollapsibleSection>

        {/* Roadmap Terapêutico */}
        <CollapsibleSection
          title="Roadmap Estratégico"
          icon="🗺️"
          color="purple"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ação</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Prioridade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Esforço</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Impacto</th>
                </tr>
              </thead>
              <tbody>
                {anamnese.roadmap_terapeutico.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{item.item}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPrioridadeColor(item.prioridade)}`}>
                        {item.prioridade}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEsforcoColor(item.esforco)}`}>
                        {item.esforco}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getImpactoColor(item.impacto_negocio)}`}>
                        {item.impacto_negocio}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* Análise do Ecossistema */}
        <CollapsibleSection
          title="Análise do Ecossistema e Inspirações"
          icon="🌐"
          color="teal"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {anamnese.analise_ecossistema_inspiracoes.map((inspiracao, index) => (
              <div key={index} className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-bold text-teal-900 text-lg">{inspiracao.nome}</h4>
                  <a 
                    href={inspiracao.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-800 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                <div className="space-y-3">
                  <div className="text-xs text-teal-600 font-medium uppercase tracking-wider">
                    URL Analisada
                  </div>
                  <a 
                    href={inspiracao.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-teal-700 hover:text-teal-900 hover:underline break-all"
                  >
                    {inspiracao.url}
                  </a>
                  <div className="pt-2">
                    <div className="text-xs text-teal-600 font-medium uppercase tracking-wider mb-2">
                      Como resolve o problema
                    </div>
                    <p className="text-teal-800 text-sm leading-relaxed">{inspiracao.resolve}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h5 className="font-semibold text-teal-900 mb-2 flex items-center">
              💡 Sobre esta análise
            </h5>
            <p className="text-teal-700 text-sm leading-relaxed">
              Analisamos sites e empresas do seu segmento que resolvem problemas similares aos identificados 
              na sua anamnese. Use essas referências como inspiração, não como cópia, adaptando as soluções 
              para o seu contexto e público específico.
            </p>
          </div>
        </CollapsibleSection>

        {/* Nova Anatomia da Home */}
        <CollapsibleSection
          title="Nova Anatomia da Home - Proposta de Reestruturação"
          icon="🏗️"
          color="amber"
        >
          <div className="space-y-6">
            {/* Hero */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🚀</span>
                </div>
                <h4 className="font-bold text-amber-900 text-xl">Hero Section</h4>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-amber-800 mb-2">Propósito</h5>
                    <p className="text-amber-700 text-sm">{anamnese.nova_anatomia_home.hero.proposito}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-amber-800 mb-2">Gatilhos Utilizados</h5>
                    <div className="flex flex-wrap gap-2">
                      {anamnese.nova_anatomia_home.hero.gatilhos.map((gatilho, index) => (
                        <span key={index} className="px-3 py-1 bg-amber-200 text-amber-800 text-xs rounded-full font-medium">
                          {gatilho}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-amber-800 mb-2">Título Proposto</h5>
                    <p className="text-amber-900 font-bold text-lg italic">&ldquo;{anamnese.nova_anatomia_home.hero.titulo}&rdquo;</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-amber-800 mb-2">Subtítulo</h5>
                    <p className="text-amber-800">{anamnese.nova_anatomia_home.hero.subtitulo}</p>
                  </div>
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <h6 className="font-medium text-amber-700 text-xs mb-1">CTA Primário</h6>
                      <button className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium">
                        {anamnese.nova_anatomia_home.hero.cta_primario}
                      </button>
                    </div>
                    <div className="flex-1">
                      <h6 className="font-medium text-amber-700 text-xs mb-1">CTA Secundário</h6>
                      <button className="w-full px-4 py-2 border-2 border-amber-500 text-amber-600 rounded-lg text-sm font-medium">
                        {anamnese.nova_anatomia_home.hero.cta_secundario}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Outros blocos da anatomia */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Prova Social */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h5 className="font-bold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">🏆</span> Prova Social Imediata
                </h5>
                <p className="text-blue-700 text-sm mb-2 font-medium">Propósito:</p>
                <p className="text-blue-600 text-sm mb-3">{anamnese.nova_anatomia_home.prova_social_imediata.proposito}</p>
                <p className="text-blue-700 text-sm mb-2 font-medium">Conteúdo:</p>
                <p className="text-blue-600 text-sm">{anamnese.nova_anatomia_home.prova_social_imediata.conteudo}</p>
              </div>

              {/* Bloco de Dores */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h5 className="font-bold text-red-900 mb-3 flex items-center">
                  <span className="mr-2">😣</span> Bloco de Dores
                </h5>
                <p className="text-red-700 text-sm mb-2 font-medium">Propósito:</p>
                <p className="text-red-600 text-sm mb-3">{anamnese.nova_anatomia_home.bloco_dores.proposito}</p>
                <p className="text-red-700 text-sm mb-2 font-medium">Cards Sugeridos:</p>
                <div className="space-y-2">
                  {anamnese.nova_anatomia_home.bloco_dores.cards?.map((card, index) => (
                    <div key={index} className="bg-white p-2 rounded border border-red-200">
                      <p className="text-red-800 text-sm font-medium">{card}</p>
                    </div>
                  )) || <p className="text-red-600 text-sm">Nenhum card definido</p>}
                </div>
              </div>

              {/* Bloco de Solução */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h5 className="font-bold text-green-900 mb-3 flex items-center">
                  <span className="mr-2">✅</span> Bloco de Solução
                </h5>
                <p className="text-green-700 text-sm mb-2 font-medium">Propósito:</p>
                <p className="text-green-600 text-sm mb-3">{anamnese.nova_anatomia_home.bloco_solucao.proposito}</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-700 text-sm font-medium">Etapas do serviço:</span>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm font-bold">
                    {anamnese.nova_anatomia_home.bloco_solucao.etapas_servico}
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-2">CTA: {anamnese.nova_anatomia_home.bloco_solucao.cta}</p>
              </div>

              {/* Bloco de Resultados */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                <h5 className="font-bold text-purple-900 mb-3 flex items-center">
                  <span className="mr-2">📊</span> Bloco de Resultados
                </h5>
                <p className="text-purple-700 text-sm mb-2 font-medium">Propósito:</p>
                <p className="text-purple-600 text-sm mb-3">{anamnese.nova_anatomia_home.bloco_resultados.proposito}</p>
                <div className="flex items-center justify-between">
                  <span className="text-purple-700 text-sm font-medium">Cases destacados:</span>
                  <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm font-bold">
                    {anamnese.nova_anatomia_home.bloco_resultados.cases_destacados}
                  </span>
                </div>
                <p className="text-purple-700 text-sm mt-2">CTA: {anamnese.nova_anatomia_home.bloco_resultados.cta}</p>
              </div>
            </div>

            {/* CTA Final */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
              <h5 className="font-bold text-indigo-900 mb-3 flex items-center">
                <span className="mr-2">🎯</span> CTA Final
              </h5>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-indigo-700 text-sm mb-2 font-medium">Propósito:</p>
                  <p className="text-indigo-600 text-sm mb-3">{anamnese.nova_anatomia_home.cta_final.proposito}</p>
                  <p className="text-indigo-700 text-sm mb-2 font-medium">Título:</p>
                  <p className="text-indigo-900 font-bold text-lg">&ldquo;{anamnese.nova_anatomia_home.cta_final.titulo}&rdquo;</p>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <p className="text-indigo-700 text-sm mb-2 font-medium">Formulário:</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-indigo-600 text-sm">Simplificado:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        anamnese.nova_anatomia_home.cta_final.formulario_simplificado 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {anamnese.nova_anatomia_home.cta_final.formulario_simplificado ? 'Sim' : 'Não'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Perguntas de Aprofundamento */}
        <CollapsibleSection
          title="Perguntas de Aprofundamento"
          icon="❓"
          color="gray"
        >
          <div className="space-y-4">
            <p className="text-gray-700 mb-6">
              Para refinar ainda mais esta anamnese e personalizar as recomendações, considere responder estas perguntas:
            </p>
            {anamnese.perguntas_aprofundamento.map((pergunta, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{pergunta}</p>
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                💡 Como usar estas perguntas
              </h5>
              <p className="text-blue-700 text-sm leading-relaxed">
                Estas perguntas foram formuladas com base nas lacunas identificadas na análise. Responder a elas 
                permitirá uma próxima iteração ainda mais precisa da anamnese, com recomendações mais específicas 
                para o seu contexto e objetivos de negócio.
              </p>
            </div>
          </div>
        </CollapsibleSection>

        {/* Mais seções... (continua no próximo arquivo) */}
      </div>
    </div>
  );
};

export default AnamneseResults;
