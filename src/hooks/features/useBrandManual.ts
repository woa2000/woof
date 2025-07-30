import { useState, useCallback } from 'react';
import { supabase } from '@/lib/auth/supabase';
import { 
  BrandManual, 
  CreateBrandManualData, 
  UpdateBrandManualData,
  UserBrandManualStats,
  EMPTY_BRAND_MANUAL_TEMPLATE,
  BrandManualData,
  SourceFile 
} from '@/lib/utils/brand-manual-types';

interface UseBrandManualReturn {
  // Estados
  manuals: BrandManual[];
  currentManual: BrandManual | null;
  userStats: UserBrandManualStats | null;
  loading: boolean;
  error: string | null;

  // Operações CRUD
  fetchUserManuals: () => Promise<void>;
  fetchManual: (id: string) => Promise<BrandManual | null>;
  createManual: (data: CreateBrandManualData) => Promise<BrandManual | null>;
  updateManual: (id: string, data: UpdateBrandManualData) => Promise<boolean>;
  duplicateManual: (id: string, newBrandName?: string) => Promise<BrandManual | null>;
  deleteManual: (id: string) => Promise<boolean>;
  publishManual: (id: string) => Promise<boolean>;
  archiveManual: (id: string) => Promise<boolean>;

  // Operações específicas
  updateChapterContent: (manualId: string, chapterIndex: number, content: any) => Promise<boolean>;
  addSourceFile: (manualId: string, file: Omit<SourceFile, 'id' | 'uploaded_at'>) => Promise<boolean>;
  removeSourceFile: (manualId: string, fileId: string) => Promise<boolean>;
  generateShareLink: (id: string) => Promise<string | null>;
  
  // Operações AI
  extractFromSources: (manualId: string) => Promise<boolean>;
  processSourceFile: (manualId: string, fileId: string) => Promise<boolean>;

  // Utilitários
  getUserStats: () => Promise<void>;
  resetError: () => void;
  setCurrentManual: (manual: BrandManual | null) => void;
}

export function useBrandManual(): UseBrandManualReturn {
  const [manuals, setManuals] = useState<BrandManual[]>([]);
  const [currentManual, setCurrentManualState] = useState<BrandManual | null>(null);
  const [userStats, setUserStats] = useState<UserBrandManualStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const setCurrentManual = useCallback((manual: BrandManual | null) => {
    setCurrentManualState(manual);
  }, []);

  const fetchUserManuals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('brand_manuals')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setManuals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar manuais');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const fetchManual = useCallback(async (id: string): Promise<BrandManual | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('brand_manuals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setCurrentManualState(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar manual');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const createManual = useCallback(async (data: CreateBrandManualData): Promise<BrandManual | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Preparar dados iniciais
      const initialManualData: BrandManualData = {
        ...EMPTY_BRAND_MANUAL_TEMPLATE,
        metadata: {
          ...EMPTY_BRAND_MANUAL_TEMPLATE.metadata,
          brand: data.brand_name,
          author: user.email || user.id
        }
      };

      // Se há dados iniciais personalizados, mesclá-los
      if (data.initial_data) {
        Object.assign(initialManualData, data.initial_data);
      }

      const manualData = {
        user_id: user.id,
        brand_name: data.brand_name,
        description: data.description || '',
        creation_method: data.creation_method,
        manual_data: initialManualData,
        source_files: [],
        source_urls: [],
        tags: data.tags || [],
        is_template: data.is_template || false,
        is_public: false,
        status: 'draft' as const
      };

      const { data: newManual, error } = await supabase
        .from('brand_manuals')
        .insert(manualData)
        .select()
        .single();

      if (error) throw error;

      // Atualizar lista local
      await fetchUserManuals();
      
      setCurrentManualState(newManual);
      return newManual;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar manual');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase, fetchUserManuals]);

  const updateManual = useCallback(async (id: string, data: UpdateBrandManualData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('brand_manuals')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      // Atualizar manual atual se for o mesmo
      if (currentManual?.id === id) {
        const updatedManual = { ...currentManual, ...data };
        setCurrentManualState(updatedManual);
      }

      // Atualizar lista
      await fetchUserManuals();
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar manual');
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase, currentManual, fetchUserManuals]);

  const duplicateManual = useCallback(async (id: string, newBrandName?: string): Promise<BrandManual | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .rpc('duplicate_brand_manual', { 
          manual_id: id, 
          new_brand_name: newBrandName 
        });

      if (error) throw error;

      await fetchUserManuals();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao duplicar manual');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase, fetchUserManuals]);

  const deleteManual = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('brand_manuals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Limpar manual atual se for o deletado
      if (currentManual?.id === id) {
        setCurrentManualState(null);
      }

      await fetchUserManuals();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar manual');
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase, currentManual, fetchUserManuals]);

  const publishManual = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .rpc('publish_brand_manual', { manual_id: id });

      if (error) throw error;

      await fetchUserManuals();
      
      // Atualizar manual atual
      if (currentManual?.id === id) {
        await fetchManual(id);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao publicar manual');
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase, currentManual, fetchUserManuals, fetchManual]);

  const archiveManual = useCallback(async (id: string): Promise<boolean> => {
    return await updateManual(id, { status: 'archived' });
  }, [updateManual]);

  const updateChapterContent = useCallback(async (
    manualId: string, 
    chapterIndex: number, 
    content: any
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Buscar manual atual
      const { data: manual, error: fetchError } = await supabase
        .from('brand_manuals')
        .select('manual_data')
        .eq('id', manualId)
        .single();

      if (fetchError) throw fetchError;

      // Atualizar capítulo específico
      const updatedManualData = { ...manual.manual_data };
      if (updatedManualData.chapters[chapterIndex]) {
        updatedManualData.chapters[chapterIndex] = {
          ...updatedManualData.chapters[chapterIndex],
          content,
          completion_status: Object.keys(content).length > 0 ? 'partial' : 'empty',
          last_updated: new Date().toISOString().split('T')[0]
        };
      }

      // Salvar no banco
      const { error } = await supabase
        .from('brand_manuals')
        .update({ manual_data: updatedManualData })
        .eq('id', manualId);

      if (error) throw error;

      // Atualizar estado local
      if (currentManual?.id === manualId) {
        setCurrentManualState({
          ...currentManual,
          manual_data: updatedManualData
        });
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar capítulo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase, currentManual]);

  const addSourceFile = useCallback(async (
    manualId: string, 
    file: Omit<SourceFile, 'id' | 'uploaded_at'>
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const newFile: SourceFile = {
        ...file,
        id: crypto.randomUUID(),
        uploaded_at: new Date().toISOString()
      };

      // Buscar manual atual
      const { data: manual, error: fetchError } = await supabase
        .from('brand_manuals')
        .select('source_files')
        .eq('id', manualId)
        .single();

      if (fetchError) throw fetchError;

      const updatedFiles = [...(manual.source_files || []), newFile];

      const { error } = await supabase
        .from('brand_manuals')
        .update({ source_files: updatedFiles })
        .eq('id', manualId);

      if (error) throw error;

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar arquivo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const removeSourceFile = useCallback(async (manualId: string, fileId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Buscar manual atual
      const { data: manual, error: fetchError } = await supabase
        .from('brand_manuals')
        .select('source_files')
        .eq('id', manualId)
        .single();

      if (fetchError) throw fetchError;

      const updatedFiles = (manual.source_files || []).filter(
        (file: SourceFile) => file.id !== fileId
      );

      const { error } = await supabase
        .from('brand_manuals')
        .update({ source_files: updatedFiles })
        .eq('id', manualId);

      if (error) throw error;

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover arquivo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const generateShareLink = useCallback(async (id: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('brand_manuals')
        .select('share_token')
        .eq('id', id)
        .single();

      if (error) throw error;

      return `${window.location.origin}/manual-marca/compartilhado/${data.share_token}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar link');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const extractFromSources = useCallback(async (manualId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Simular extração AI (implementar com API real depois)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Para now, retornar sucesso
      console.log('Extração AI simulada para manual:', manualId);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na extração AI');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const processSourceFile = useCallback(async (manualId: string, fileId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Simular processamento AI
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Processamento AI simulado para arquivo:', fileId);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no processamento');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_brand_manual_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setUserStats(data || {
        user_id: user.id,
        total_manuals: 0,
        published_count: 0,
        draft_count: 0,
        ai_generated_count: 0,
        last_activity: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar estatísticas');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    // Estados
    manuals,
    currentManual,
    userStats,
    loading,
    error,

    // Operações CRUD
    fetchUserManuals,
    fetchManual,
    createManual,
    updateManual,
    duplicateManual,
    deleteManual,
    publishManual,
    archiveManual,

    // Operações específicas
    updateChapterContent,
    addSourceFile,
    removeSourceFile,
    generateShareLink,
    
    // Operações AI
    extractFromSources,
    processSourceFile,

    // Utilitários
    getUserStats,
    resetError,
    setCurrentManual
  };
}
