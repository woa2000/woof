'use client';

import { useState } from 'react';
import { CalendarioFilters } from '@/lib/calendario/calendario-types';

// Tipos locais para o header
type ViewMode = 'monthly' | 'weekly' | 'daily';

interface CalendarioHeaderProps {
  filtros: CalendarioFilters;
  onFilterChange: (filtros: Partial<CalendarioFilters>) => void;
  onResetFiltros: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onCreateEvento: () => void;
  onShowPresets: () => void;
  onToggleInsights: () => void;
  onToggleSugestoes: () => void;
  isLoading: boolean;
  totalEventos: number;
}

export function CalendarioHeader({
  filtros,
  onFilterChange,
  onResetFiltros,
  viewMode,
  onViewModeChange,
  selectedDate,
  onDateChange,
  onCreateEvento,
  onShowPresets,
  onToggleInsights,
  onToggleSugestoes,
  isLoading,
  totalEventos,
}: CalendarioHeaderProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleMonthNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Linha Principal do Header */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            {/* Título e Navegação */}
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Calendário de Sazonalidades
              </h1>
              
              {/* Navegação de Data */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleMonthNavigation('prev')}
                  disabled={isLoading}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="text-center min-w-[120px]">
                  <h2 className="text-lg font-semibold text-gray-900 capitalize">
                    {formatMonthYear(selectedDate)}
                  </h2>
                  <p className="text-sm text-gray-500">{totalEventos} eventos</p>
                </div>
                
                <button
                  onClick={() => handleMonthNavigation('next')}
                  disabled={isLoading}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  onClick={goToToday}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                >
                  Hoje
                </button>
              </div>
            </div>

            {/* Ações Principais */}
            <div className="flex items-center space-x-3">
              {/* Modo de Visualização */}
              <div className="flex bg-gray-100 rounded-md p-1">
                {(['monthly', 'weekly', 'daily'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => onViewModeChange(mode)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewMode === mode
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode === 'monthly' ? 'Mês' : mode === 'weekly' ? 'Semana' : 'Dia'}
                  </button>
                ))}
              </div>

              {/* Botões de Ação */}
              <button
                onClick={onToggleInsights}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Insights
              </button>

              <button
                onClick={onShowPresets}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 11H5m14-4h-9m5 8H5m14-4h-9" />
                </svg>
                Presets
              </button>

              <button
                onClick={onToggleSugestoes}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Sugestões IA
              </button>

              <button
                onClick={onCreateEvento}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Evento
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Filtro de Categoria Pet */}
                <select
                  value={filtros.categoria_pet || ''}
                  onChange={(e) => onFilterChange({ categoria_pet: e.target.value || undefined })}
                  className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Todas as Categorias</option>
                  <option value="cachorro">Cachorro</option>
                  <option value="gato">Gato</option>
                  <option value="pet_exotico">Pet Exótico</option>
                  <option value="geral">Geral</option>
                </select>

                {/* Filtro de Prioridade */}
                <select
                  value={filtros.prioridade || ''}
                  onChange={(e) => onFilterChange({ prioridade: e.target.value as any || undefined })}
                  className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Todas as Prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>

                {/* Filtro de Mês */}
                <select
                  value={filtros.mes || ''}
                  onChange={(e) => onFilterChange({ mes: e.target.value || undefined })}
                  className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Todos os Meses</option>
                  <option value="1">Janeiro</option>
                  <option value="2">Fevereiro</option>
                  <option value="3">Março</option>
                  <option value="4">Abril</option>
                  <option value="5">Maio</option>
                  <option value="6">Junho</option>
                  <option value="7">Julho</option>
                  <option value="8">Agosto</option>
                  <option value="9">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </select>

                {/* Botão de Filtros Avançados */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  Filtros
                  {showAdvancedFilters ? (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Botão Reset Filtros */}
              {(filtros.categoria_pet || filtros.prioridade || filtros.mes || filtros.tags?.length) && (
                <button
                  onClick={onResetFiltros}
                  className="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpar Filtros
                </button>
              )}
            </div>

            {/* Filtros Avançados (Expandível) */}
            {showAdvancedFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Filtro por Tags */}
                  <div>
                    <label htmlFor="tags-filter" className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      id="tags-filter"
                      type="text"
                      placeholder="vermifugacao, vacinacao, etc."
                      value={filtros.tags?.join(', ') || ''}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(',')
                          .map(tag => tag.trim())
                          .filter(tag => tag.length > 0);
                        onFilterChange({ tags: tags.length > 0 ? tags : undefined });
                      }}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  {/* Limite de Resultados */}
                  <div>
                    <label htmlFor="limit-filter" className="block text-sm font-medium text-gray-700 mb-2">
                      Limite de Resultados
                    </label>
                    <select
                      id="limit-filter"
                      value={filtros.limit || 50}
                      onChange={(e) => onFilterChange({ limit: parseInt(e.target.value) })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value={10}>10 eventos</option>
                      <option value={25}>25 eventos</option>
                      <option value={50}>50 eventos</option>
                      <option value={100}>100 eventos</option>
                      <option value={0}>Todos</option>
                    </select>
                  </div>

                  {/* Info dos Filtros Ativos */}
                  <div className="flex items-end">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Filtros ativos:</span>
                      <br />
                      {Object.keys(filtros).filter(key => filtros[key as keyof CalendarioFilters]).length} de 5
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status de Loading */}
        {isLoading && (
          <div className="py-2 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-gray-600">Carregando eventos...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}