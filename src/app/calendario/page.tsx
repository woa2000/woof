'use client';

import { useState } from 'react';
import { CalendarioHeader } from '@/components/calendario/CalendarioHeader';
import { CalendarioGrid } from '@/components/calendario/CalendarioGrid';
import { EventoModal } from '@/components/calendario/EventoModal';
// import { PresetModal } from '@/components/calendario/PresetModal';
// import { InsightsSidebar } from '@/components/calendario/InsightsSidebar';
// import { SugestoesPanel } from '@/components/calendario/SugestoesPanel';

import { 
  useCalendarioEventos, 
  useCalendarioMutations, 
  useCalendarioFilters,
  useCalendarioInsights,
  useCalendarioSugestoes 
} from '@/hooks/calendario/useCalendarioEventos';

import { 
  SazonalidadeResponse, 
  CreateSazonalidadeRequest,
  UpdateSazonalidadeRequest,
  CalendarioFilters 
} from '@/lib/calendario/calendario-types';

// Tipos locais
type ViewMode = 'monthly' | 'weekly' | 'daily';

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function CalendarioPage() {
  // Estados locais
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showInsightsSidebar, setShowInsightsSidebar] = useState(false);
  const [showSugestoesPanel, setShowSugestoesPanel] = useState(false);
  const [editingEvento, setEditingEvento] = useState<SazonalidadeResponse | null>(null);
  
  // Hooks customizados
  const { filtros, setFiltros, resetFiltros } = useCalendarioFilters();
  const { data: eventos, isLoading, error, refetch } = useCalendarioEventos(filtros);
  const { data: insights } = useCalendarioInsights();
  const { data: sugestoes } = useCalendarioSugestoes({
    tipo_negocio: 'veterinaria',
    limite: 5
  });
  const mutations = useCalendarioMutations();

  // =====================================================
  // HANDLERS DE EVENTOS
  // =====================================================

  const handleCreateEvento = async (data: CreateSazonalidadeRequest) => {
    try {
      await mutations.createEvento(data);
      setShowEventoModal(false);
      refetch();
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  const handleUpdateEvento = async (id: string, data: UpdateSazonalidadeRequest) => {
    try {
      await mutations.updateEvento(id, data);
      setEditingEvento(null);
      setShowEventoModal(false);
      refetch();
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
    }
  };

  const handleDeleteEvento = async (id: string) => {
    try {
      await mutations.deleteEvento(id);
      refetch();
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
    }
  };

  const handleEventClick = (evento: SazonalidadeResponse) => {
    setEditingEvento(evento);
    setShowEventoModal(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventoModal(true);
  };

  const handleFilterChange = (novosFiltros: Partial<CalendarioFilters>) => {
    setFiltros(novosFiltros);
  };

  const handleViewModeChange = (newMode: ViewMode) => {
    setViewMode(newMode);
  };

  const handleCloseEventoModal = () => {
    setShowEventoModal(false);
    setEditingEvento(null);
  };

  const handleAddPreset = async (presetId: string) => {
    try {
      await mutations.addPreset({ preset_id: presetId });
      refetch();
    } catch (error) {
      console.error('Erro ao adicionar preset:', error);
    }
  };

  // =====================================================
  // RENDER CONDICIONAL PARA LOADING/ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Erro ao Carregar Calendário
            </h3>
            <p className="text-gray-600 mb-4">
              {error.message || 'Ocorreu um erro inesperado.'}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER PRINCIPAL
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header do Calendário */}
      <CalendarioHeader
        filtros={filtros}
        onFilterChange={handleFilterChange}
        onResetFiltros={resetFiltros}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onCreateEvento={() => setShowEventoModal(true)}
        onShowPresets={() => setShowPresetModal(true)}
        onToggleInsights={() => setShowInsightsSidebar(!showInsightsSidebar)}
        onToggleSugestoes={() => setShowSugestoesPanel(!showSugestoesPanel)}
        isLoading={isLoading}
        totalEventos={eventos?.length || 0}
      />

      <div className="flex">
        {/* Conteúdo Principal */}
        <div className={`flex-1 transition-all duration-300 ${
          showInsightsSidebar ? 'mr-80' : ''
        }`}>
          <div className="p-6">
            {/* Grid do Calendário */}
            <CalendarioGrid
              viewMode={viewMode}
              selectedDate={selectedDate}
              eventos={eventos || []}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
              onDeleteEvento={handleDeleteEvento}
              isLoading={isLoading}
              filtros={filtros}
            />
          </div>
        </div>

        {/* Placeholder para Sidebar de Insights */}
        {showInsightsSidebar && (
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Insights & Analytics</h3>
              <button
                onClick={() => setShowInsightsSidebar(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Insights em desenvolvimento...</p>
            </div>
          </div>
        )}
      </div>

      {/* Placeholder para Panel de Sugestões */}
      {showSugestoesPanel && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-10 p-6 border-t">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sugestões Inteligentes</h3>
              <button
                onClick={() => setShowSugestoesPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Sugestões de IA em desenvolvimento...</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Evento */}
      <EventoModal
        isOpen={showEventoModal}
        onClose={handleCloseEventoModal}
        evento={editingEvento}
        selectedDate={selectedDate}
        onCreate={handleCreateEvento}
        onUpdate={handleUpdateEvento}
        isCreating={mutations.isCreating}
        isUpdating={mutations.isUpdating}
      />

      {/* Modal de Presets (placeholder) */}
      {showPresetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Eventos Pré-cadastrados</h3>
              <button
                onClick={() => setShowPresetModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Modal de presets em desenvolvimento...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// COMPONENTE DE LOADING GLOBAL
// =====================================================

export function CalendarioLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gray-300 rounded"></div>
              <div className="flex space-x-3">
                <div className="h-10 w-24 bg-gray-300 rounded"></div>
                <div className="h-10 w-24 bg-gray-300 rounded"></div>
                <div className="h-10 w-32 bg-gray-300 rounded"></div>
              </div>
            </div>
            
            {/* Filtros Skeleton */}
            <div className="mt-4 flex space-x-4">
              <div className="h-10 w-32 bg-gray-300 rounded"></div>
              <div className="h-10 w-28 bg-gray-300 rounded"></div>
              <div className="h-10 w-36 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Header days */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="bg-gray-50 p-2">
                  <div className="h-4 w-12 bg-gray-300 rounded"></div>
                </div>
              ))}
              
              {/* Calendar cells */}
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="bg-white p-2 h-24">
                  <div className="h-4 w-6 bg-gray-300 rounded mb-2"></div>
                  <div className="space-y-1">
                    {Math.random() > 0.7 && (
                      <div className="h-3 w-full bg-blue-200 rounded"></div>
                    )}
                    {Math.random() > 0.8 && (
                      <div className="h-3 w-3/4 bg-green-200 rounded"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// COMPONENTE DE ERRO GLOBAL
// =====================================================

export function CalendarioErrorState({ 
  error, 
  onRetry 
}: { 
  error: Error; 
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full mx-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Erro no Calendário de Sazonalidades
          </h3>
          
          <p className="text-gray-600 mb-2">
            Não foi possível carregar os dados do calendário.
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            {error.message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tentar Novamente
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Recarregar Página
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}