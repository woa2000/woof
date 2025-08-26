/**
 * Hook Integrado: IA + Compliance
 * 
 * Integração entre geração de conteúdo com IA e validação de compliance
 * Workflow completo: gerar → validar → aprovar/corrigir
 */

import { useState, useCallback } from 'react';
import { useContentGeneration } from '@/hooks/ai/useContentGeneration';
import { usePetCompliance } from '@/hooks/compliance/usePetCompliance';
import type { ContentGenerationRequest } from '@/services/ai/mock-ai-provider';
import type { ComplianceValidation } from '@/services/compliance/pet-compliance-service';

interface IntegratedWorkflowState {
  isProcessing: boolean;
  currentStep: 'idle' | 'generating' | 'validating' | 'completed' | 'error';
  error: string | null;
  generatedContent: any | null;
  complianceResult: ComplianceValidation | null;
  finalApprovedContent: string | null;
  workflowHistory: Array<{
    timestamp: string;
    step: string;
    data: any;
  }>;
}

export function useAIComplianceWorkflow(
  businessType: 'veterinary_clinic' | 'pet_shop' | 'grooming_salon' | 'pet_training' | 'pet_hotel' = 'veterinary_clinic'
) {
  const contentGeneration = useContentGeneration();
  const petCompliance = usePetCompliance(businessType);
  
  const [state, setState] = useState<IntegratedWorkflowState>({
    isProcessing: false,
    currentStep: 'idle',
    error: null,
    generatedContent: null,
    complianceResult: null,
    finalApprovedContent: null,
    workflowHistory: []
  });

  // Workflow completo: Gerar + Validar + Aprovar
  const generateCompliantContent = useCallback(async (
    request: ContentGenerationRequest,
    maxAttempts: number = 3
  ): Promise<{
    success: boolean;
    content?: string;
    compliance?: ComplianceValidation;
    attempts: number;
    history: any[];
  }> => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      currentStep: 'generating',
      error: null,
      workflowHistory: []
    }));

    let attempts = 0;
    let workflowHistory: any[] = [];

    while (attempts < maxAttempts) {
      attempts++;
      
      try {
        // Etapa 1: Gerar conteúdo com IA
        setState(prev => ({ ...prev, currentStep: 'generating' }));
        
        const generated = await contentGeneration.generateContent(request);
        
        if (!generated) {
          throw new Error('Falha na geração de conteúdo');
        }

        workflowHistory.push({
          timestamp: new Date().toISOString(),
          step: 'content_generated',
          data: {
            attempt: attempts,
            content: generated.content,
            tokens: generated.tokens_used,
            cost: generated.cost_estimate
          }
        });

        // Etapa 2: Validar compliance
        setState(prev => ({ 
          ...prev, 
          currentStep: 'validating',
          generatedContent: generated
        }));
        
        const compliance = await petCompliance.validateContent(
          generated.content,
          request.content_type
        );

        if (!compliance) {
          throw new Error('Falha na validação de compliance');
        }

        workflowHistory.push({
          timestamp: new Date().toISOString(),
          step: 'compliance_validated',
          data: {
            attempt: attempts,
            is_compliant: compliance.is_compliant,
            violations: compliance.violations.length,
            critical_violations: compliance.violations.filter(v => v.severity === 'critical').length,
            confidence: compliance.confidence_score
          }
        });

        // Etapa 3: Verificar se é aprovável
        if (compliance.is_compliant) {
          const finalContent = compliance.approved_content || generated.content;
          
          setState(prev => ({
            ...prev,
            currentStep: 'completed',
            isProcessing: false,
            complianceResult: compliance,
            finalApprovedContent: finalContent,
            workflowHistory: workflowHistory
          }));

          return {
            success: true,
            content: finalContent,
            compliance,
            attempts,
            history: workflowHistory
          };
        }

        // Se não é compliant, verificar se há violações críticas
        const criticalViolations = compliance.violations.filter(v => v.severity === 'critical');
        
        if (criticalViolations.length === 0) {
          // Sem violações críticas, pode aprovar com correções menores
          const finalContent = applySuggestions(generated.content, compliance.violations);
          
          setState(prev => ({
            ...prev,
            currentStep: 'completed',
            isProcessing: false,
            complianceResult: compliance,
            finalApprovedContent: finalContent,
            workflowHistory: workflowHistory
          }));

          return {
            success: true,
            content: finalContent,
            compliance,
            attempts,
            history: workflowHistory
          };
        }

        // Tem violações críticas, tentar gerar novamente com prompt melhorado
        if (attempts < maxAttempts) {
          request = improvePromptBasedOnViolations(request, compliance.violations);
          
          workflowHistory.push({
            timestamp: new Date().toISOString(),
            step: 'prompt_improved',
            data: {
              attempt: attempts,
              critical_violations: criticalViolations.length,
              improved_prompt: request.prompt
            }
          });
          
          // Continuar loop para próxima tentativa
          continue;
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no workflow';
        
        workflowHistory.push({
          timestamp: new Date().toISOString(),
          step: 'error',
          data: {
            attempt: attempts,
            error: errorMessage
          }
        });

        if (attempts >= maxAttempts) {
          setState(prev => ({
            ...prev,
            currentStep: 'error',
            isProcessing: false,
            error: errorMessage,
            workflowHistory: workflowHistory
          }));

          return {
            success: false,
            attempts,
            history: workflowHistory
          };
        }
      }
    }

    // Se chegou aqui, esgotou as tentativas
    setState(prev => ({
      ...prev,
      currentStep: 'error',
      isProcessing: false,
      error: `Não foi possível gerar conteúdo compliant após ${maxAttempts} tentativas`,
      workflowHistory: workflowHistory
    }));

    return {
      success: false,
      attempts: maxAttempts,
      history: workflowHistory
    };
  }, [contentGeneration, petCompliance]);

  // Melhorar prompt baseado nas violações
  const improvePromptBasedOnViolations = useCallback((
    originalRequest: ContentGenerationRequest,
    violations: any[]
  ): ContentGenerationRequest => {
    let improvedPrompt = originalRequest.prompt;
    
    // Adicionar instruções específicas baseadas nas violações
    const medicalViolations = violations.filter(v => v.category === 'medical');
    if (medicalViolations.length > 0) {
      improvedPrompt += ' IMPORTANTE: Evite termos médicos definitivos. Use linguagem informativa e sempre mencione consulta veterinária.';
    }

    const promotionalViolations = violations.filter(v => v.category === 'promotional');
    if (promotionalViolations.length > 0) {
      improvedPrompt += ' IMPORTANTE: Evite superlativos e promessas excessivas. Use linguagem equilibrada e factual.';
    }

    const safetyViolations = violations.filter(v => v.category === 'safety');
    if (safetyViolations.length > 0) {
      improvedPrompt += ' IMPORTANTE: Inclua avisos de segurança quando necessário e evite recomendações que possam ser perigosas.';
    }

    return {
      ...originalRequest,
      prompt: improvedPrompt
    };
  }, []);

  // Aplicar sugestões automáticas para violações menores
  const applySuggestions = useCallback((
    content: string,
    violations: any[]
  ): string => {
    let improvedContent = content;

    // Aplicar correções simples baseadas nas sugestões
    violations.forEach(violation => {
      if (violation.severity === 'low' || violation.severity === 'medium') {
        // Substituições simples
        if (violation.matched_text && violation.suggestion.includes('Use:')) {
          const replacement = violation.suggestion.split('Use:')[1]?.split(' ou ')[0]?.trim();
          if (replacement) {
            improvedContent = improvedContent.replace(violation.matched_text, replacement);
          }
        }
      }
    });

    return improvedContent;
  }, []);

  // Validar conteúdo existente
  const validateExistingContent = useCallback(async (
    content: string,
    contentType: 'social_post' | 'email' | 'landing_page' | 'ad_copy' = 'social_post'
  ): Promise<ComplianceValidation | null> => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      currentStep: 'validating',
      error: null
    }));

    try {
      const compliance = await petCompliance.validateContent(content, contentType);
      
      setState(prev => ({
        ...prev,
        currentStep: 'completed',
        isProcessing: false,
        complianceResult: compliance
      }));

      return compliance;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na validação';
      setState(prev => ({
        ...prev,
        currentStep: 'error',
        isProcessing: false,
        error: errorMessage
      }));
      return null;
    }
  }, [petCompliance]);

  // Workflow em lote para múltiplos conteúdos
  const processContentBatch = useCallback(async (
    requests: Array<ContentGenerationRequest & { id: string }>
  ): Promise<{
    successful: number;
    failed: number;
    results: Array<{
      id: string;
      success: boolean;
      content?: string;
      compliance?: ComplianceValidation;
      error?: string;
    }>;
  }> => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      currentStep: 'generating',
      error: null
    }));

    const results: Array<{
      id: string;
      success: boolean;
      content?: string;
      compliance?: ComplianceValidation;
      error?: string;
    }> = [];

    let successful = 0;
    let failed = 0;

    // Processar em chunks para não sobrecarregar
    const chunkSize = 3;
    for (let i = 0; i < requests.length; i += chunkSize) {
      const chunk = requests.slice(i, i + chunkSize);
      
      const chunkPromises = chunk.map(async request => {
        try {
          const result = await generateCompliantContent(request);
          
          if (result.success) {
            successful++;
            return {
              id: request.id,
              success: true,
              content: result.content!,
              compliance: result.compliance!
            };
          } else {
            failed++;
            return {
              id: request.id,
              success: false,
              error: 'Falha na geração de conteúdo compliant'
            };
          }
        } catch (error) {
          failed++;
          return {
            id: request.id,
            success: false,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          };
        }
      });

      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    setState(prev => ({
      ...prev,
      currentStep: 'completed',
      isProcessing: false
    }));

    return {
      successful,
      failed,
      results
    };
  }, []);

  // Obter métricas do workflow
  const getWorkflowMetrics = useCallback(() => {
    const { workflowHistory } = state;
    
    if (workflowHistory.length === 0) return null;

    const attempts = workflowHistory.filter(h => h.step === 'content_generated').length;
    const errors = workflowHistory.filter(h => h.step === 'error').length;
    const improvements = workflowHistory.filter(h => h.step === 'prompt_improved').length;
    
    const totalCost = workflowHistory
      .filter(h => h.step === 'content_generated')
      .reduce((sum, h) => sum + (h.data.cost || 0), 0);
    
    const totalTokens = workflowHistory
      .filter(h => h.step === 'content_generated')
      .reduce((sum, h) => sum + (h.data.tokens || 0), 0);

    return {
      total_attempts: attempts,
      total_errors: errors,
      prompt_improvements: improvements,
      total_cost: Number(totalCost.toFixed(4)),
      total_tokens: totalTokens,
      success_rate: attempts > 0 ? Number(((attempts - errors) / attempts * 100).toFixed(1)) : 0
    };
  }, [state.workflowHistory]);

  // Limpar estado do workflow
  const resetWorkflow = useCallback(() => {
    setState({
      isProcessing: false,
      currentStep: 'idle',
      error: null,
      generatedContent: null,
      complianceResult: null,
      finalApprovedContent: null,
      workflowHistory: []
    });
  }, []);

  return {
    // Estado do workflow
    ...state,
    
    // Workflow principal
    generateCompliantContent,
    
    // Validação standalone
    validateExistingContent,
    
    // Processamento em lote
    processContentBatch,
    
    // Métricas e análises
    getWorkflowMetrics,
    
    // Controles
    resetWorkflow,
    
    // Hooks subjacentes (para acesso direto se necessário)
    contentGeneration,
    petCompliance
  };
}