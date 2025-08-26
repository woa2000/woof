/**
 * AI Service Factory
 * 
 * Factory pattern para gerenciar provedores de IA
 * Permite alternar entre IA real (OpenAI) e mock para desenvolvimento
 */

import { MockAIProvider } from './mock-ai-provider';

export interface AIService {
  generateContent(request: any): Promise<any>;
  generateVariations(request: any, count: number): Promise<any[]>;
  checkCompliance(content: string, businessType: string): Promise<any>;
  predictPerformance(content: string, platform: string): Promise<any>;
  getOperationLogs(): any[];
  getTotalCosts(): { total: number; count: number; average: number };
}

// Placeholder para futuro provedor real de IA
class OpenAIProvider implements AIService {
  async generateContent(request: any): Promise<any> {
    throw new Error('OpenAI Provider não implementado ainda');
  }

  async generateVariations(request: any, count: number): Promise<any[]> {
    throw new Error('OpenAI Provider não implementado ainda');
  }

  async checkCompliance(content: string, businessType: string): Promise<any> {
    throw new Error('OpenAI Provider não implementado ainda');
  }

  async predictPerformance(content: string, platform: string): Promise<any> {
    throw new Error('OpenAI Provider não implementado ainda');
  }

  getOperationLogs(): any[] {
    return [];
  }

  getTotalCosts(): { total: number; count: number; average: number } {
    return { total: 0, count: 0, average: 0 };
  }
}

export class AIServiceFactory {
  private static instance: AIService | null = null;

  static getAIService(): AIService {
    if (!this.instance) {
      const useMockAI = process.env.NEXT_PUBLIC_MOCK_AI_ENABLED === 'true' || 
                       process.env.NODE_ENV === 'development';

      if (useMockAI) {
        console.log('🤖 Usando Mock AI Provider para desenvolvimento');
        this.instance = new MockAIProvider();
      } else {
        console.log('🚀 Usando OpenAI Provider para produção');
        this.instance = new OpenAIProvider();
      }
    }

    return this.instance;
  }

  // Método para testes - permite injetar um provedor específico
  static setAIService(service: AIService): void {
    this.instance = service;
  }

  // Reset do singleton (útil para testes)
  static reset(): void {
    this.instance = null;
  }
}

// Hook personalizado para usar o serviço de IA
export function useAIService(): AIService {
  return AIServiceFactory.getAIService();
}