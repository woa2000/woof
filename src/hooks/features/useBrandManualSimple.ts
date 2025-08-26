/**
 * Hook simplificado para Manual da Marca - Compatível com Sistema de Providers
 * Funciona tanto com MockDataProvider quanto com SupabaseDataProvider
 */

import { useState, useEffect, useCallback } from 'react';
import { BrandManual, useDataProvider } from '@/services/data-provider.service';
import { useAuth } from './useAuth';

export const useBrandManualSimple = () => {
  const [brandManuals, setBrandManuals] = useState<BrandManual[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const dataProvider = useDataProvider();

  // Carregar manuais do usuário
  const fetchBrandManuals = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📘 useBrandManualSimple: Carregando manuais da marca...');
      const data = await dataProvider.brandManuals.getAll(user.id);
      setBrandManuals(data);
      console.log(`📘 useBrandManualSimple: ${data.length} manuais carregados`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar manuais';
      setError(errorMessage);
      console.error('❌ Erro ao carregar manuais:', err);
    } finally {
      setLoading(false);
    }
  }, [user, dataProvider]);

  // Buscar manual por ID
  const getBrandManualById = async (id: string): Promise<BrandManual | null> => {
    if (!user) return null;

    try {
      return await dataProvider.brandManuals.getById(id, user.id);
    } catch (err: unknown) {
      console.error('❌ Erro ao buscar manual por ID:', err);
      return null;
    }
  };

  // Buscar manual por brand_id
  const getBrandManualByBrandId = async (brandId: string): Promise<BrandManual | null> => {
    if (!user) return null;

    try {
      return await dataProvider.brandManuals.getByBrandId(brandId, user.id);
    } catch (err: unknown) {
      console.error('❌ Erro ao buscar manual por brand_id:', err);
      return null;
    }
  };

  // Criar novo manual
  const createBrandManual = async (title: string, brandId?: string): Promise<BrandManual | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setCreating(true);
    setError(null);

    try {
      const newManualData: Omit<BrandManual, 'id' | 'created_at' | 'updated_at'> = {
        brand_id: brandId || `brand-${Date.now()}`,
        user_id: user.id,
        title,
        chapters: []
      };

      const result = await dataProvider.brandManuals.create(newManualData);
      setBrandManuals(prev => [result, ...prev]);
      
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar manual';
      setError(errorMessage);
      return null;
    } finally {
      setCreating(false);
    }
  };

  // Atualizar manual
  const updateBrandManual = async (id: string, updates: Partial<BrandManual>): Promise<BrandManual | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    try {
      const result = await dataProvider.brandManuals.update(id, updates);
      setBrandManuals(prev => 
        prev.map(manual => manual.id === id ? result : manual)
      );
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar manual';
      setError(errorMessage);
      return null;
    }
  };

  // Deletar manual
  const deleteBrandManual = async (id: string): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      await dataProvider.brandManuals.delete(id);
      setBrandManuals(prev => prev.filter(manual => manual.id !== id));
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar manual';
      setError(errorMessage);
      return false;
    }
  };

  // Auto-carregar quando o usuário muda
  useEffect(() => {
    if (user) {
      // Popular dados mock se disponível
      const provider = dataProvider;
      if ('populateUserData' in provider && typeof provider.populateUserData === 'function') {
        provider.populateUserData(user.id);
      }
      
      fetchBrandManuals();
    } else {
      setBrandManuals([]);
    }
  }, [user, fetchBrandManuals, dataProvider]);

  return {
    // Estado
    brandManuals,
    loading,
    creating,
    error,
    
    // Ações
    fetchBrandManuals,
    getBrandManualById,
    getBrandManualByBrandId,
    createBrandManual,
    updateBrandManual,
    deleteBrandManual,
    
    // Aliases para compatibilidade
    manuals: brandManuals,
    fetchUserManuals: fetchBrandManuals,
    
    // Utilitários
    clearError: () => setError(null),
    setError,
  };
};