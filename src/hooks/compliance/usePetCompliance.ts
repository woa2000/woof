/**
 * Hook para Compliance de Conteúdo Pet
 * 
 * Validação automática de compliance para conteúdo relacionado ao setor pet
 * Integração com sistema de IA para validação em tempo real
 */

import { useState, useCallback, useEffect } from 'react';
import { PetComplianceService } from '@/services/compliance/pet-compliance-service';
import type { 
  ComplianceValidation, 
  ComplianceViolation,
  VeterinaryTerminology 
} from '@/services/compliance/pet-compliance-service';

interface ComplianceState {
  isValidating: boolean;
  isGeneratingReport: boolean;
  error: string | null;
  lastValidation: ComplianceValidation | null;
  batchValidations: Map<string, ComplianceValidation>;
  complianceGuide: any | null;
}

export function usePetCompliance(
  businessType: 'veterinary_clinic' | 'pet_shop' | 'grooming_salon' | 'pet_training' | 'pet_hotel' = 'veterinary_clinic'
) {
  const [complianceService] = useState(() => new PetComplianceService());
  
  const [state, setState] = useState<ComplianceState>({
    isValidating: false,
    isGeneratingReport: false,
    error: null,
    lastValidation: null,
    batchValidations: new Map(),
    complianceGuide: null
  });

  // Validar conteúdo único
  const validateContent = useCallback(async (
    content: string,
    contentType: 'social_post' | 'email' | 'landing_page' | 'ad_copy' = 'social_post'
  ): Promise<ComplianceValidation | null> => {
    if (!content.trim()) return null;

    setState(prev => ({ ...prev, isValidating: true, error: null }));

    try {
      const validation = await complianceService.validateContent(content, businessType, contentType);
      
      setState(prev => ({ 
        ...prev, 
        lastValidation: validation,
        isValidating: false 
      }));

      return validation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao validar compliance';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isValidating: false 
      }));
      return null;
    }
  }, [complianceService, businessType]);

  // Validar múltiplos conteúdos
  const validateBatch = useCallback(async (
    contents: Array<{ id: string; content: string; type: string }>
  ): Promise<Map<string, ComplianceValidation> | null> => {
    setState(prev => ({ ...prev, isValidating: true, error: null }));

    try {
      const validations = new Map<string, ComplianceValidation>();
      
      // Validar em paralelo com limite para não sobrecarregar
      const chunkSize = 5;
      for (let i = 0; i < contents.length; i += chunkSize) {
        const chunk = contents.slice(i, i + chunkSize);
        const chunkPromises = chunk.map(async item => {
          const validation = await complianceService.validateContent(
            item.content, 
            businessType, 
            item.type as any
          );
          return { id: item.id, validation };
        });
        
        const chunkResults = await Promise.all(chunkPromises);
        chunkResults.forEach(({ id, validation }) => {
          validations.set(id, validation);
        });
      }

      setState(prev => ({ 
        ...prev, 
        batchValidations: validations,
        isValidating: false 
      }));

      return validations;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao validar lote de conteúdo';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isValidating: false 
      }));
      return null;
    }
  }, [complianceService, businessType]);

  // Gerar relatório de compliance
  const generateComplianceReport = useCallback(async (
    contents: Array<{ id: string; content: string; type: string }>
  ) => {
    setState(prev => ({ ...prev, isGeneratingReport: true, error: null }));

    try {
      const report = await complianceService.generateComplianceReport(contents, businessType);
      
      setState(prev => ({ 
        ...prev, 
        isGeneratingReport: false 
      }));

      return report;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar relatório';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isGeneratingReport: false 
      }));
      return null;
    }
  }, [complianceService, businessType]);

  // Carregar guia de compliance
  const loadComplianceGuide = useCallback(() => {
    try {
      const guide = complianceService.getComplianceGuide(businessType);
      setState(prev => ({ ...prev, complianceGuide: guide }));
      return guide;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar guia';
      setState(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, [complianceService, businessType]);

  // Adicionar terminologia personalizada
  const addCustomTerminology = useCallback((terminology: VeterinaryTerminology) => {
    complianceService.addCustomTerminology(terminology);
  }, [complianceService]);

  // Obter estatísticas da última validação
  const getValidationStats = useCallback(() => {
    const { lastValidation, batchValidations } = state;
    
    if (batchValidations.size > 0) {
      const validations = Array.from(batchValidations.values());
      const compliantCount = validations.filter(v => v.is_compliant).length;
      const totalViolations = validations.reduce((sum, v) => sum + v.violations.length, 0);
      const criticalViolations = validations.reduce((sum, v) => 
        sum + v.violations.filter(viol => viol.severity === 'critical').length, 0
      );
      const averageConfidence = validations.reduce((sum, v) => sum + v.confidence_score, 0) / validations.length;

      return {
        total_content: validations.length,
        compliant_content: compliantCount,
        compliance_rate: Number((compliantCount / validations.length * 100).toFixed(1)),
        total_violations: totalViolations,
        critical_violations: criticalViolations,
        average_confidence: Number(averageConfidence.toFixed(2))
      };
    }

    if (lastValidation) {
      return {
        total_content: 1,
        compliant_content: lastValidation.is_compliant ? 1 : 0,
        compliance_rate: lastValidation.is_compliant ? 100 : 0,
        total_violations: lastValidation.violations.length,
        critical_violations: lastValidation.violations.filter(v => v.severity === 'critical').length,
        average_confidence: lastValidation.confidence_score
      };
    }

    return null;
  }, [state]);

  // Obter violações por severidade
  const getViolationsBySeverity = useCallback(() => {
    const { lastValidation, batchValidations } = state;
    
    let allViolations: ComplianceViolation[] = [];
    
    if (batchValidations.size > 0) {
      allViolations = Array.from(batchValidations.values())
        .flatMap(v => v.violations);
    } else if (lastValidation) {
      allViolations = lastValidation.violations;
    }

    if (allViolations.length === 0) return null;

    const bySeverity = {
      critical: allViolations.filter(v => v.severity === 'critical'),
      high: allViolations.filter(v => v.severity === 'high'),
      medium: allViolations.filter(v => v.severity === 'medium'),
      low: allViolations.filter(v => v.severity === 'low')
    };

    return bySeverity;
  }, [state]);

  // Obter violações por categoria
  const getViolationsByCategory = useCallback(() => {
    const { lastValidation, batchValidations } = state;
    
    let allViolations: ComplianceViolation[] = [];
    
    if (batchValidations.size > 0) {
      allViolations = Array.from(batchValidations.values())
        .flatMap(v => v.violations);
    } else if (lastValidation) {
      allViolations = lastValidation.violations;
    }

    if (allViolations.length === 0) return null;

    const categories = ['medical', 'promotional', 'safety', 'legal', 'ethical'];
    const byCategory = categories.reduce((acc, category) => {
      acc[category] = allViolations.filter(v => v.category === category);
      return acc;
    }, {} as Record<string, ComplianceViolation[]>);

    return byCategory;
  }, [state]);

  // Obter recomendações consolidadas
  const getConsolidatedRecommendations = useCallback(() => {
    const { lastValidation, batchValidations } = state;
    
    let allRecommendations: string[] = [];
    
    if (batchValidations.size > 0) {
      allRecommendations = Array.from(batchValidations.values())
        .flatMap(v => v.recommendations);
    } else if (lastValidation) {
      allRecommendations = lastValidation.recommendations;
    }

    // Remover duplicatas e organizar por prioridade
    const uniqueRecommendations = [...new Set(allRecommendations)];
    
    // Priorizar recomendações críticas
    const prioritized = uniqueRecommendations.sort((a, b) => {
      const aCritical = a.includes('🚨') || a.includes('crítica');
      const bCritical = b.includes('🚨') || b.includes('crítica');
      if (aCritical && !bCritical) return -1;
      if (!aCritical && bCritical) return 1;
      return 0;
    });

    return prioritized;
  }, [state]);

  // Verificar se conteúdo pode ser publicado
  const canPublish = useCallback((contentId?: string) => {
    const { lastValidation, batchValidations } = state;
    
    if (contentId && batchValidations.has(contentId)) {
      const validation = batchValidations.get(contentId)!;
      return validation.is_compliant && 
             validation.violations.filter(v => v.severity === 'critical').length === 0;
    }
    
    if (lastValidation) {
      return lastValidation.is_compliant && 
             lastValidation.violations.filter(v => v.severity === 'critical').length === 0;
    }
    
    return false;
  }, [state]);

  // Limpar estado
  const clearValidations = useCallback(() => {
    setState({
      isValidating: false,
      isGeneratingReport: false,
      error: null,
      lastValidation: null,
      batchValidations: new Map(),
      complianceGuide: null
    });
  }, []);

  // Carregar guia na inicialização
  useEffect(() => {
    loadComplianceGuide();
  }, [loadComplianceGuide]);

  return {
    // Estado
    ...state,
    
    // Funções de validação
    validateContent,
    validateBatch,
    generateComplianceReport,
    
    // Configuração
    loadComplianceGuide,
    addCustomTerminology,
    
    // Análises
    getValidationStats,
    getViolationsBySeverity,
    getViolationsByCategory,
    getConsolidatedRecommendations,
    
    // Utilitários
    canPublish,
    clearValidations
  };
}