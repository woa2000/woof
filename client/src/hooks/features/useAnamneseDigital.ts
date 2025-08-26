import { useState, useEffect, useCallback } from 'react';
import { AnamneseDigital } from '@/lib/types/anamnese';
import { useDataProvider } from '@/services/data-provider.service';
import { useAuth } from './useAuth';

export const useAnamneseDigital = () => {
  const [anamneses, setAnamneses] = useState<AnamneseDigital[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const dataProvider = useDataProvider();

  // Carregar anamneses do usuário
  const fetchAnamneses = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await dataProvider.anamneses.getAll(user.id);
      setAnamneses(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [user, dataProvider]);

  // Buscar anamnese por URL
  const findByUrl = async (url: string): Promise<AnamneseDigital | null> => {
    if (!user) return null;

    try {
      return await dataProvider.anamneses.getByUrl(url, user.id);
    } catch (err: unknown) {
      console.error('Erro ao buscar anamnese:', err);
      return null;
    }
  };

  // Simular análise com IA (mock data)
  const simulateAnalysis = async (url: string, redesSociais: string[] = []): Promise<AnamneseDigital> => {
    // Simular diferentes estágios de processamento
    const stages = ['initializing', 'analyzing', 'processing', 'finalizing'];
    
    for (const currentStage of stages) {
      // Simula tempo de processamento de cada estágio
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log(`Processando estágio: ${currentStage}`);
    }

    // Usar o mock existente da anamnese veterinária
    const { mockAnamneseVeterinary } = await import('@/lib/mocks/anamnese');
    
    // Sobrescrever com dados específicos da URL analisada
    const mockAnalysis: Omit<AnamneseDigital, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
      ...mockAnamneseVeterinary,
      url_analisada: url,
      redes_sociais: redesSociais,
    };

    return mockAnalysis as AnamneseDigital;
  };

  // Executar análise da URL
  const analyzeUrl = async (url: string, redesSociais: string[] = []) => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Simular análise
      const analysisData = await simulateAnalysis(url, redesSociais);
      
      // Usar o provider para criar a anamnese
      const result = await dataProvider.anamneses.create({
        ...analysisData,
        user_id: user.id
      });

      // Atualizar lista local
      setAnamneses(prev => [result, ...prev]);
      
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao processar análise');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  // Reprocessar análise existente
  const reprocessAnalysis = async (id: string, url: string, redesSociais: string[] = []) => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Simular nova análise
      const analysisData = await simulateAnalysis(url, redesSociais);

      // Usar o provider para atualizar
      const result = await dataProvider.anamneses.update(id, analysisData);

      // Atualizar lista local
      setAnamneses(prev => 
        prev.map(item => item.id === id ? result : item)
      );
      
      return result;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao reprocessar análise');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  // Deletar anamnese
  const deleteAnamnese = async (id: string) => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      await dataProvider.anamneses.delete(id);
      
      // Atualizar lista local
      setAnamneses(prev => prev.filter(item => item.id !== id));
      
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar anamnese');
      return false;
    }
  };

  // Carregar anamneses automaticamente quando user muda
  useEffect(() => {
    if (user) {
      // Se estamos usando MockDataProvider, popular com dados iniciais
      const provider = dataProvider;
      if ('populateUserData' in provider && typeof provider.populateUserData === 'function') {
        provider.populateUserData(user.id);
      }
      
      fetchAnamneses();
    } else {
      setAnamneses([]);
    }
  }, [user, fetchAnamneses, dataProvider]);

  return {
    // Estado
    anamneses,
    loading,
    analyzing,
    error,
    
    // Ações
    fetchAnamneses,
    findByUrl,
    analyzeUrl,
    reprocessAnalysis,
    deleteAnamnese,
    
    // Aliases para compatibilidade com componentes existentes
    processAnalysis: analyzeUrl,
    deleteAnalysis: deleteAnamnese,
    
    // Utilitários
    clearError: () => setError(null),
    setError,
  };
};