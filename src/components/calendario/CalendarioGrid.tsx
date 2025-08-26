'use client';

import { useState, useMemo } from 'react';
import { CalendarioFilters, SazonalidadeResponse } from '@/lib/calendario/calendario-types';

// Tipos locais
type ViewMode = 'monthly' | 'weekly' | 'daily';

interface CalendarioGridProps {
  viewMode: ViewMode;
  selectedDate: Date;
  eventos: SazonalidadeResponse[];
  onEventClick: (evento: SazonalidadeResponse) => void;
  onDateClick: (date: Date) => void;
  onDeleteEvento: (id: string) => void;
  isLoading: boolean;
  filtros: CalendarioFilters;
}

export function CalendarioGrid({
  viewMode,
  selectedDate,
  eventos,
  onEventClick,
  onDateClick,
  onDeleteEvento,
  isLoading,
  filtros,
}: CalendarioGridProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // =====================================================
  // CÁLCULOS DO CALENDÁRIO
  // =====================================================

  const { calendarDays, monthInfo } = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Primeiro dia da semana (domingo = 0)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Último dia da grade (6 semanas * 7 dias = 42 dias)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 41);
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      calendarDays: days,
      monthInfo: {
        year,
        month,
        firstDay,
        lastDay,
        monthName: firstDay.toLocaleDateString('pt-BR', { month: 'long' }),
      }
    };
  }, [selectedDate]);

  // =====================================================
  // FILTROS E AGRUPAMENTO DE EVENTOS
  // =====================================================

  const eventosPorData = useMemo(() => {
    const grupos: Record<string, SazonalidadeResponse[]> = {};
    
    eventos.forEach(evento => {
      const dataInicio = new Date(evento.data_inicio);
      const dataKey = `${dataInicio.getFullYear()}-${dataInicio.getMonth()}-${dataInicio.getDate()}`;
      
      if (!grupos[dataKey]) {
        grupos[dataKey] = [];
      }
      grupos[dataKey].push(evento);
    });
    
    return grupos;
  }, [eventos]);

  const getEventosParaData = (date: Date): SazonalidadeResponse[] => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return eventosPorData[dateKey] || [];
  };

  // =====================================================
  // UTILIDADES
  // =====================================================

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === selectedDate.getMonth();
  };

  const isSameDate = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta':
        return 'bg-red-500 text-white';
      case 'media':
        return 'bg-yellow-500 text-white';
      case 'baixa':
        return 'bg-green-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  // =====================================================
  // RENDER CONDICIONAL POR MODO
  // =====================================================

  if (viewMode === 'weekly') {
    return <WeeklyView {...{ selectedDate, eventos, onEventClick, onDateClick, isLoading }} />;
  }

  if (viewMode === 'daily') {
    return <DailyView {...{ selectedDate, eventos, onEventClick, onDateClick, isLoading }} />;
  }

  // =====================================================
  // RENDER MONTHLY VIEW
  // =====================================================

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="animate-pulse">
          {/* Header dos dias da semana */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
              <div key={dia} className="bg-gray-50 p-4 text-center">
                <div className="h-4 w-8 bg-gray-300 rounded mx-auto"></div>
              </div>
            ))}
          </div>
          
          {/* Grid de loading */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {Array.from({ length: 42 }).map((_, i) => (
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
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header dos dias da semana */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
          <div key={dia} className="bg-gray-50 p-4 text-center">
            <div className="text-sm font-medium text-gray-700">{dia}</div>
          </div>
        ))}
      </div>
      
      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {calendarDays.map((date, index) => {
          const dayEventos = getEventosParaData(date);
          const isHovered = hoveredDate && isSameDate(date, hoveredDate);
          
          return (
            <div
              key={index}
              className={`bg-white min-h-[120px] p-2 cursor-pointer transition-colors hover:bg-gray-50 ${
                !isCurrentMonth(date) ? 'text-gray-400 bg-gray-25' : ''
              } ${
                isToday(date) ? 'bg-blue-50 border-2 border-blue-200' : ''
              } ${
                isHovered ? 'bg-blue-50' : ''
              }`}
              onClick={() => onDateClick(date)}
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {/* Número do dia */}
              <div className={`text-sm font-semibold mb-1 ${
                isToday(date) ? 'text-blue-600' : isCurrentMonth(date) ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {date.getDate()}
              </div>
              
              {/* Eventos do dia */}
              <div className="space-y-1">
                {dayEventos.slice(0, 3).map((evento) => (
                  <div
                    key={evento.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(evento);
                    }}
                    className={`text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-90 ${getPriorityColor(evento.prioridade)}`}
                    title={evento.evento}
                  >
                    {evento.evento}
                  </div>
                ))}
                
                {/* Indicador de mais eventos */}
                {dayEventos.length > 3 && (
                  <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    +{dayEventos.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer com resumo */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            {eventos.length} evento{eventos.length !== 1 ? 's' : ''} no mês
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
              <span>Alta</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
              <span>Média</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
              <span>Baixa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// COMPONENTES DE VISUALIZAÇÕES ALTERNATIVAS
// =====================================================

function WeeklyView({ selectedDate, eventos, onEventClick, onDateClick, isLoading }: {
  selectedDate: Date;
  eventos: SazonalidadeResponse[];
  onEventClick: (evento: SazonalidadeResponse) => void;
  onDateClick: (date: Date) => void;
  isLoading: boolean;
}) {
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [selectedDate]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-semibold text-gray-900">
          Semana de {weekDays[0].toLocaleDateString('pt-BR')} a {weekDays[6].toLocaleDateString('pt-BR')}
        </h3>
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {weekDays.map((day, index) => {
          const dayEventos = eventos.filter(evento => {
            const eventDate = new Date(evento.data_inicio);
            return (
              eventDate.getDate() === day.getDate() &&
              eventDate.getMonth() === day.getMonth() &&
              eventDate.getFullYear() === day.getFullYear()
            );
          });
          
          return (
            <div key={index} className="bg-white p-4 min-h-[200px] cursor-pointer hover:bg-gray-50"
                 onClick={() => onDateClick(day)}>
              <div className="text-sm font-semibold text-gray-900 mb-2">
                {day.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })}
              </div>
              
              <div className="space-y-2">
                {dayEventos.map((evento) => (
                  <div
                    key={evento.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(evento);
                    }}
                    className="text-xs px-2 py-1 bg-blue-500 text-white rounded cursor-pointer hover:opacity-90"
                  >
                    {evento.evento}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DailyView({ selectedDate, eventos, onEventClick, onDateClick, isLoading }: {
  selectedDate: Date;
  eventos: SazonalidadeResponse[];
  onEventClick: (evento: SazonalidadeResponse) => void;
  onDateClick: (date: Date) => void;
  isLoading: boolean;
}) {
  const dayEventos = eventos.filter(evento => {
    const eventDate = new Date(evento.data_inicio);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 bg-gray-50 border-b">
        <h3 className="text-xl font-semibold text-gray-900">
          {selectedDate.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {dayEventos.length} evento{dayEventos.length !== 1 ? 's' : ''} programado{dayEventos.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="p-6">
        {dayEventos.length > 0 ? (
          <div className="space-y-4">
            {dayEventos.map((evento) => (
              <div
                key={evento.id}
                onClick={() => onEventClick(evento)}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{evento.evento}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600">{evento.categoria_pet}</span>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        evento.prioridade === 'alta' 
                          ? 'bg-red-100 text-red-800'
                          : evento.prioridade === 'media'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {evento.prioridade}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 10h12m-6-6v6m-6-3h12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento</h3>
            <p className="text-gray-600 mb-4">Não há eventos programados para este dia.</p>
            <button
              onClick={() => onDateClick(selectedDate)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Criar Evento
            </button>
          </div>
        )}
      </div>
    </div>
  );
}