'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CalendarioFilters,
  SazonalidadeResponse,
  CreateSazonalidadeRequest,
  UpdateSazonalidadeRequest,
  AddPresetRequest,
  ApiResponse,
  UseCalendarioEventosResult,
  UseCalendarioMutationsResult
} from '@/lib/calendario/calendario-types';

// =====================================================
// CONFIGURAÇÃO BASE
// =====================================================

const API_BASE_URL = '/api/calendario';

// Cache simples em memória
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Função para gerar chave de cache
function getCacheKey(type: string, params: any = {}): string {
  return `${type}-${JSON.stringify(params)}`;
}

// Função para verificar cache
function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

// Função para salvar no cache
function setCache<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000) {
  cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}

// Função para invalidar cache relacionado
function invalidateCache(pattern: string) {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
}

// Simple toast system using console for now
const toast = {
  success: (message: string, options?: { description?: string }) => {
    console.log(`✅ ${message}${options?.description ? ` - ${options.description}` : ''}`);
  },
  error: (message: string, options?: { description?: string }) => {
    console.error(`❌ ${message}${options?.description ? ` - ${options.description}` : ''}`);
  }
};

// =====================================================
// HOOKS PARA CONSULTA (QUERY)
// =====================================================

/**
 * Hook para listar eventos do calendário
 */
export function useCalendarioEventos(
  filters: CalendarioFilters = {},
  options: { enabled?: boolean } = {}
): UseCalendarioEventosResult {
  const [data, setData] = useState<SazonalidadeResponse[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const cacheKey = getCacheKey('eventos', filters);
  
  const fetchEventos = useCallback(async () => {
    if (options.enabled === false) return;
    
    // Verificar cache primeiro
    const cached = getFromCache<SazonalidadeResponse[]>(cacheKey);
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }
    
    // Cancelar request anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const searchParams = new URLSearchParams();
      
      // Adicionar filtros aos params
      if (filters.categoria_pet) searchParams.append('categoria_pet', filters.categoria_pet);
      if (filters.mes) searchParams.append('mes', filters.mes);
      if (filters.prioridade) searchParams.append('prioridade', filters.prioridade);
      if (filters.tags?.length) searchParams.append('tags', filters.tags.join(','));
      if (filters.limit) searchParams.append('limit', filters.limit.toString());
      if (filters.offset) searchParams.append('offset', filters.offset.toString());
      
      const url = `${API_BASE_URL}?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse<SazonalidadeResponse[]> = await response.json();
      
      // Salvar no cache
      setCache(cacheKey, result.data, 5 * 60 * 1000);
      setData(result.data);
      
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters, cacheKey, options.enabled]);
  
  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);
  
  const refetch = useCallback(() => {
    cache.delete(cacheKey);
    fetchEventos();
  }, [cacheKey, fetchEventos]);

  return {
    data,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook para buscar um evento específico por ID
 */
export function useCalendarioEvento(id: string, options: { enabled?: boolean } = {}) {
  const [data, setData] = useState<SazonalidadeResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const cacheKey = getCacheKey('evento', { id });
  
  const fetchEvento = useCallback(async () => {
    if (!id || options.enabled === false) return;
    
    // Verificar cache primeiro
    const cached = getFromCache<SazonalidadeResponse>(cacheKey);
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse<SazonalidadeResponse> = await response.json();
      
      // Salvar no cache
      setCache(cacheKey, result.data, 5 * 60 * 1000);
      setData(result.data);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, cacheKey, options.enabled]);
  
  useEffect(() => {
    fetchEvento();
  }, [fetchEvento]);
  
  return { data, isLoading, error, refetch: fetchEvento };
}

/**
 * Hook para obter insights e analytics do calendário
 */
export function useCalendarioInsights() {
  const [data, setData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const cacheKey = getCacheKey('insights');
  
  const fetchInsights = useCallback(async () => {
    // Verificar cache primeiro
    const cached = getFromCache(cacheKey);
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/insights`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Salvar no cache por mais tempo (insights mudam menos)
      setCache(cacheKey, result.data, 10 * 60 * 1000);
      setData(result.data);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey]);
  
  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);
  
  return { data, isLoading, error, refetch: fetchInsights };
}

/**
 * Hook para listar eventos pré-cadastrados (presets)
 */
export function useCalendarioPresets(filters: {
  categoria?: string;
  regiao?: string;
  mes?: number;
} = {}) {
  const [data, setData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const cacheKey = getCacheKey('presets', filters);
  
  const fetchPresets = useCallback(async () => {
    // Verificar cache primeiro
    const cached = getFromCache(cacheKey);
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const searchParams = new URLSearchParams();
      
      if (filters.categoria) searchParams.append('categoria', filters.categoria);
      if (filters.regiao) searchParams.append('regiao', filters.regiao);
      if (filters.mes) searchParams.append('mes', filters.mes.toString());
      
      const url = `${API_BASE_URL}/presets?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Cache mais longo para presets (não mudam frequentemente)
      setCache(cacheKey, result.data, 60 * 60 * 1000);
      setData(result.data);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters, cacheKey]);
  
  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);
  
  return { data, isLoading, error, refetch: fetchPresets };
}

/**
 * Hook para obter sugestões automáticas via IA
 */
export function useCalendarioSugestoes(config: {
  tipo_negocio?: string;
  regiao?: string;
  limite?: number;
} = {}) {
  const [data, setData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const cacheKey = getCacheKey('sugestoes', config);
  
  const fetchSugestoes = useCallback(async () => {
    // Verificar cache primeiro
    const cached = getFromCache(cacheKey);
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const searchParams = new URLSearchParams();
      
      if (config.tipo_negocio) searchParams.append('tipo_negocio', config.tipo_negocio);
      if (config.regiao) searchParams.append('regiao', config.regiao);
      if (config.limite) searchParams.append('limite', config.limite.toString());
      
      const url = `${API_BASE_URL}/sugestoes?${searchParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Cache médio para sugestões IA
      setCache(cacheKey, result.data, 30 * 60 * 1000);
      setData(result.data);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [config, cacheKey]);
  
  useEffect(() => {
    fetchSugestoes();
  }, [fetchSugestoes]);
  
  return { data, isLoading, error, refetch: fetchSugestoes };
}

// =====================================================
// HOOKS PARA MUTAÇÕES (CREATE/UPDATE/DELETE)
// =====================================================

/**
 * Hook para mutations do calendário (criar, atualizar, deletar)
 */
export function useCalendarioMutations(): UseCalendarioMutationsResult {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Função para invalidar queries relacionadas
  const invalidateQueries = useCallback(() => {
    invalidateCache('eventos');
    invalidateCache('insights');
  }, []);
  
  const createEvento = useCallback(async (data: CreateSazonalidadeRequest) => {
    try {
      setIsCreating(true);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse<SazonalidadeResponse> = await response.json();
      
      invalidateQueries();
      toast.success('Evento criado com sucesso!', {
        description: `"${result.data.evento}" foi adicionado ao seu calendário`,
      });
      
      return result.data;
      
    } catch (error) {
      toast.error('Erro ao criar evento', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [invalidateQueries]);
  
  const updateEvento = useCallback(async (id: string, data: UpdateSazonalidadeRequest) => {
    try {
      setIsUpdating(true);
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse<SazonalidadeResponse> = await response.json();
      
      // Atualizar cache específico do evento
      const eventoCacheKey = getCacheKey('evento', { id });
      setCache(eventoCacheKey, result.data);
      
      invalidateQueries();
      
      toast.success('Evento atualizado com sucesso!', {
        description: `"${result.data.evento}" foi modificado`,
      });
      
      return result.data;
      
    } catch (error) {
      toast.error('Erro ao atualizar evento', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [invalidateQueries]);
  
  const deleteEvento = useCallback(async (id: string) => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      // Remover do cache específico
      const eventoCacheKey = getCacheKey('evento', { id });
      cache.delete(eventoCacheKey);
      
      invalidateQueries();
      
      toast.success('Evento removido com sucesso!');
      
    } catch (error) {
      toast.error('Erro ao remover evento', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [invalidateQueries]);
  
  const addPreset = useCallback(async (data: AddPresetRequest) => {
    try {
      setIsCreating(true);
      
      const response = await fetch(`${API_BASE_URL}/presets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const result: ApiResponse<SazonalidadeResponse> = await response.json();
      
      invalidateQueries();
      toast.success('Evento preset adicionado!', {
        description: `"${result.data.evento}" foi adicionado ao seu calendário`,
      });
      
      return result.data;
      
    } catch (error) {
      toast.error('Erro ao adicionar preset', {
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [invalidateQueries]);
  
  return {
    createEvento,
    updateEvento,
    deleteEvento,
    addPreset,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

// =====================================================
// HOOKS UTILITÁRIOS
// =====================================================

/**
 * Hook para filtros persistidos do calendário
 */
export function useCalendarioFilters() {
  const [filtros, setFiltrosState] = useState<CalendarioFilters>({});
  
  // Persistir filtros no localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('calendario-filters');
    if (savedFilters) {
      try {
        setFiltrosState(JSON.parse(savedFilters));
      } catch (error) {
        console.warn('Erro ao carregar filtros salvos:', error);
      }
    }
  }, []);
  
  const setFiltros = useCallback((novosFiltros: Partial<CalendarioFilters>) => {
    setFiltrosState(prev => {
      const filtrosAtualizados = { ...prev, ...novosFiltros };
      
      // Salvar no localStorage
      try {
        localStorage.setItem('calendario-filters', JSON.stringify(filtrosAtualizados));
      } catch (error) {
        console.warn('Erro ao salvar filtros:', error);
      }
      
      return filtrosAtualizados;
    });
  }, []);
  
  const resetFiltros = useCallback(() => {
    setFiltrosState({});
    localStorage.removeItem('calendario-filters');
  }, []);
  
  return { filtros, setFiltros, resetFiltros };
}

/**
 * Hook para scroll virtualizado de eventos
 */
export function useVirtualizedEventos(
  eventos: SazonalidadeResponse[] = [],
  itemHeight: number = 120,
  containerHeight: number = 600
) {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  
  useEffect(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
    setEndIndex(Math.min(startIndex + visibleCount, eventos.length - 1));
  }, [startIndex, containerHeight, itemHeight, eventos.length]);
  
  const handleScroll = useCallback((scrollTop: number) => {
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    if (newStartIndex !== startIndex) {
      setStartIndex(newStartIndex);
    }
  }, [itemHeight, startIndex]);
  
  const visibleEventos = eventos.slice(startIndex, endIndex + 1);
  const totalHeight = eventos.length * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  return {
    visibleEventos,
    totalHeight,
    offsetY,
    handleScroll,
  };
}