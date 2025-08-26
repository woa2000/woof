/**
 * Hook simplificado para Manual da Marca - Funciona com Mocks
 */

import { useState, useEffect, useCallback } from 'react';
import { useDataProvider } from '@/services/data-provider.service';
import { BrandManual as SimpleBrandManual } from '@/services/data-provider.service';
import { useAuth } from './useAuth';

// Interface para estatísticas simplificada
interface UserStats {
  user_id: string;
  total_manuals: number;
  published_count: number;
  draft_count: number;
  ai_generated_count: number;
  last_activity: string;
}

// Interface de Manual Estendida para compatibilidade com página
interface ExtendedBrandManual extends SimpleBrandManual {
  brand_name: string;
  status: 'draft' | 'published' | 'archived';
  creation_method: 'manual' | 'ai_extraction';
  description?: string;
  manual_data: {
    metadata: {
      brand: string;
      version: string;
      last_updated: string;
      author: string;
    };
    chapters: any[];
  };
}

const adaptManual = (simple: SimpleBrandManual): ExtendedBrandManual => {
  // Garantir que chapters existe e é um array
  const safeChapters = Array.isArray(simple.chapters) ? simple.chapters : [];
  
  return {
    ...simple,
    chapters: safeChapters,
    brand_name: simple.title || 'Sem nome',
    status: 'draft',
    creation_method: 'manual',
    description: simple.title,
    manual_data: {
      metadata: {
        brand: simple.title || 'Sem nome',
        version: '1.0',
        last_updated: simple.updated_at,
        author: simple.user_id
      },
      chapters: safeChapters.map((chapter: any, index: number) => ({
        id: chapter.id || `chapter-${index + 1}`,
        title: chapter.title || `Capítulo ${index + 1}`,
        completion_status: chapter.completion_status || 'empty',
        ...chapter
      }))
    }
  };
};

export const useBrandManual = () => {
  const [manuals, setManuals] = useState<ExtendedBrandManual[]>([]);
  const [currentManual, setCurrentManual] = useState<ExtendedBrandManual | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const dataProvider = useDataProvider();

  // Carregar manuais do usuário
  const fetchUserManuals = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📘 useBrandManual: Carregando manuais da marca...');
      const data = await dataProvider.brandManuals.getAll(user.id);
      console.log('📘 useBrandManual: Dados brutos recebidos:', data);
      
      const adaptedData = data.map((manual, index) => {
        console.log(`📘 useBrandManual: Adaptando manual ${index}:`, manual);
        const adapted = adaptManual(manual);
        console.log(`📘 useBrandManual: Manual adaptado ${index}:`, adapted);
        return adapted;
      });
      
      setManuals(adaptedData);
      console.log(`📘 useBrandManual: ${adaptedData.length} manuais carregados`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar manuais';
      setError(errorMessage);
      console.error('❌ Erro ao carregar manuais:', err);
    } finally {
      setLoading(false);
    }
  }, [user, dataProvider]);

  // Obter estatísticas do usuário
  const getUserStats = useCallback(async () => {
    if (!user) return;

    try {
      // Usar o estado atual dos manuais sem dependência
      setUserStats(prevStats => {
        const currentManuals = manuals; // Captura o valor atual
        const stats: UserStats = {
          user_id: user.id,
          total_manuals: currentManuals.length,
          published_count: currentManuals.filter(m => m.status === 'published').length,
          draft_count: currentManuals.filter(m => m.status === 'draft').length,
          ai_generated_count: currentManuals.filter(m => m.creation_method === 'ai_extraction').length,
          last_activity: new Date().toISOString()
        };
        return stats;
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar estatísticas';
      setError(errorMessage);
    }
  }, [user]); // ← REMOVIDA DEPENDÊNCIA DE 'manuals'

  // Criar manual
  const createManual = async (data: {
    brand_name: string;
    description?: string;
    creation_method: 'manual' | 'ai_extraction';
    tags?: string[];
  }): Promise<ExtendedBrandManual | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setCreating(true);
    setError(null);

    try {
      const newManualData = {
        brand_id: `brand-${Date.now()}`,
        user_id: user.id,
        title: data.brand_name,
        chapters: []
      };

      const result = await dataProvider.brandManuals.create(newManualData);
      const adaptedResult = adaptManual(result);
      setManuals(prev => [adaptedResult, ...prev]);
      
      return adaptedResult;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar manual';
      setError(errorMessage);
      return null;
    } finally {
      setCreating(false);
    }
  };

  // Duplicar manual
  const duplicateManual = async (id: string): Promise<ExtendedBrandManual | null> => {
    const original = manuals.find(m => m.id === id);
    if (!original) return null;

    return await createManual({
      brand_name: `${original.brand_name} (Cópia)`,
      creation_method: 'manual'
    });
  };

  // Deletar manual
  const deleteManual = async (id: string): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      await dataProvider.brandManuals.delete(id);
      setManuals(prev => prev.filter(manual => manual.id !== id));
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar manual';
      setError(errorMessage);
      return false;
    }
  };

  // Buscar manual específico por ID
  const fetchManual = useCallback(async (id: string): Promise<ExtendedBrandManual | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      // Primeiro tentar buscar de manuais já carregados
      const existingManual = manuals.find(manual => manual.id === id);
      if (existingManual) {
        setCurrentManual(existingManual);
        setLoading(false);
        return existingManual;
      }

      // Se não encontrou, buscar todos os manuais
      await fetchUserManuals();
      
      // Buscar novamente nos manuais atualizados (precisa aguardar o estado atualizar)
      const updatedManuals = await new Promise<ExtendedBrandManual[]>((resolve) => {
        // Como setManuals é assíncrono, vamos buscar direto da API novamente
        dataProvider.brandManuals.getAll(user.id).then(data => {
          const adaptedData = data.map(manual => adaptManual(manual));
          resolve(adaptedData);
        });
      });
      
      const foundManual = updatedManuals.find(manual => manual.id === id);
      if (foundManual) {
        setCurrentManual(foundManual);
      }
      
      setLoading(false);
      return foundManual || null;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar manual';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, [user, manuals, fetchUserManuals, dataProvider]);

  // Gerar link de compartilhamento
  const generateShareLink = async (id: string): Promise<string | null> => {
    return `${window.location.origin}/manual-marca/${id}`;
  };

  // Reset error
  const resetError = () => setError(null);

  // Auto-carregar quando o usuário muda
  useEffect(() => {
    if (user) {
      // Popular dados mock se disponível
      const provider = dataProvider;
      if ('populateUserData' in provider && typeof provider.populateUserData === 'function') {
        provider.populateUserData(user.id);
      }
      
      fetchUserManuals();
    } else {
      setManuals([]);
      setUserStats(null);
    }
  }, [user]); // ← REMOVIDAS DEPENDÊNCIAS PROBLEMÁTICAS

  // Recalcular stats quando manuais mudam
  useEffect(() => {
    if (manuals.length > 0) {
      getUserStats();
    }
  }, [manuals.length]); // ← MUDANÇA: apenas length ao invés do array completo

  return {
    // Estado
    manuals,
    currentManual,
    userStats,
    loading,
    creating,
    error,
    
    // Ações
    fetchUserManuals,
    fetchManual,
    getUserStats,
    createManual,
    duplicateManual,
    deleteManual,
    generateShareLink,
    resetError,
    
    // Utilitários
    clearError: resetError,
    setError,
  };
};