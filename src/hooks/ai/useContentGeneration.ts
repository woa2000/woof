/**
 * Hook para Geração de Conteúdo com IA
 * 
 * Abstrai operações de IA para geração de conteúdo de marketing
 * Funciona tanto com mock quanto com IA real
 */

import { useState, useCallback } from 'react';
import { useAIService } from '@/services/ai/ai-service-factory';
import type { 
  AIResponse, 
  ContentGenerationRequest, 
  BrandVoicePrompt,
  ComplianceCheck 
} from '@/services/ai/mock-ai-provider';

interface ContentGenerationState {
  isGenerating: boolean;
  isCheckingCompliance: boolean;
  isPredictingPerformance: boolean;
  error: string | null;
  lastGenerated: AIResponse | null;
  variations: AIResponse[];
  complianceResult: ComplianceCheck | null;
  performanceResult: any | null;
}

export function useContentGeneration() {
  const aiService = useAIService();
  
  const [state, setState] = useState<ContentGenerationState>({
    isGenerating: false,
    isCheckingCompliance: false,
    isPredictingPerformance: false,
    error: null,
    lastGenerated: null,
    variations: [],
    complianceResult: null,
    performanceResult: null
  });

  const generateContent = useCallback(async (request: ContentGenerationRequest): Promise<AIResponse | null> => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const result = await aiService.generateContent(request);
      
      setState(prev => ({ 
        ...prev, 
        lastGenerated: result,
        isGenerating: false 
      }));
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isGenerating: false 
      }));
      return null;
    }
  }, [aiService]);

  const generateVariations = useCallback(async (
    request: ContentGenerationRequest, 
    count: number = 3
  ): Promise<AIResponse[]> => {
    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const variations = await aiService.generateVariations(request, count);
      
      setState(prev => ({ 
        ...prev, 
        variations,
        isGenerating: false 
      }));
      
      return variations;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isGenerating: false 
      }));
      return [];
    }
  }, [aiService]);

  const checkCompliance = useCallback(async (
    content: string, 
    businessType: string = 'veterinary_clinic'
  ): Promise<ComplianceCheck | null> => {
    setState(prev => ({ ...prev, isCheckingCompliance: true, error: null }));
    
    try {
      const result = await aiService.checkCompliance(content, businessType);
      
      setState(prev => ({ 
        ...prev, 
        complianceResult: result,
        isCheckingCompliance: false 
      }));
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isCheckingCompliance: false 
      }));
      return null;
    }
  }, [aiService]);

  const predictPerformance = useCallback(async (
    content: string, 
    platform: string = 'instagram'
  ): Promise<any | null> => {
    setState(prev => ({ ...prev, isPredictingPerformance: true, error: null }));
    
    try {
      const result = await aiService.predictPerformance(content, platform);
      
      setState(prev => ({ 
        ...prev, 
        performanceResult: result,
        isPredictingPerformance: false 
      }));
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isPredictingPerformance: false 
      }));
      return null;
    }
  }, [aiService]);

  // Função para geração completa com compliance e performance
  const generateCompleteContent = useCallback(async (
    request: ContentGenerationRequest
  ): Promise<{
    content: AIResponse | null;
    compliance: ComplianceCheck | null;
    performance: any | null;
  }> => {
    const content = await generateContent(request);
    
    if (!content) {
      return { content: null, compliance: null, performance: null };
    }

    const [compliance, performance] = await Promise.all([
      checkCompliance(content.content),
      predictPerformance(content.content, request.platform || 'instagram')
    ]);

    return { content, compliance, performance };
  }, [generateContent, checkCompliance, predictPerformance]);

  const clearResults = useCallback(() => {
    setState({
      isGenerating: false,
      isCheckingCompliance: false,
      isPredictingPerformance: false,
      error: null,
      lastGenerated: null,
      variations: [],
      complianceResult: null,
      performanceResult: null
    });
  }, []);

  return {
    ...state,
    generateContent,
    generateVariations,
    checkCompliance,
    predictPerformance,
    generateCompleteContent,
    clearResults
  };
}