'use client';

import { useEffect, useState } from 'react';
import { Sparkles, FileText, Palette, Type, Grid, Camera, Zap, Shield, MessageSquare, Share2, Mail, Image, FolderOpen, CheckSquare } from 'lucide-react';

interface AIExtractionLoadingProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const extractionSteps = [
  {
    id: 'vision',
    title: 'Analisando Visão & Essência',
    description: 'Identificando propósito, manifesto e personalidade da marca',
    icon: Sparkles,
    duration: 3000
  },
  {
    id: 'logo',
    title: 'Processando Sistema de Logotipo',
    description: 'Extraindo versões, formatos e especificações técnicas',
    icon: FileText,
    duration: 2500
  },
  {
    id: 'colors',
    title: 'Detectando Paleta de Cores',
    description: 'Identificando cores primárias, suporte e modo escuro',
    icon: Palette,
    duration: 2000
  },
  {
    id: 'typography',
    title: 'Reconhecendo Tipografia',
    description: 'Analisando fontes, hierarquia e escala responsiva',
    icon: Type,
    duration: 2200
  },
  {
    id: 'layout',
    title: 'Mapeando Grid & Layout',
    description: 'Definindo breakpoints e sistema de espaçamentos',
    icon: Grid,
    duration: 1800
  },
  {
    id: 'components',
    title: 'Catalogando Componentes',
    description: 'Identificando biblioteca de componentes e UI Kit',
    icon: Camera,
    duration: 2000
  },
  {
    id: 'motion',
    title: 'Analisando Motion Design',
    description: 'Detectando padrões de animação e micro-interações',
    icon: Zap,
    duration: 1500
  },
  {
    id: 'accessibility',
    title: 'Verificando Acessibilidade',
    description: 'Validando contraste e padrões WCAG 2.2',
    icon: Shield,
    duration: 1800
  },
  {
    id: 'voice',
    title: 'Extraindo Tom de Voz',
    description: 'Identificando pilares e padrões de comunicação',
    icon: MessageSquare,
    duration: 2200
  },
  {
    id: 'social',
    title: 'Mapeando Social Media',
    description: 'Analisando templates e diretrizes de redes sociais',
    icon: Share2,
    duration: 1600
  },
  {
    id: 'email',
    title: 'Processando E-mail Templates',
    description: 'Extraindo estruturas e configurações de e-mail',
    icon: Mail,
    duration: 1400
  },
  {
    id: 'ads',
    title: 'Analisando Banners & Ads',
    description: 'Identificando formatos e diretrizes publicitárias',
    icon: Image,
    duration: 1300
  },
  {
    id: 'assets',
    title: 'Organizando Gestão de Ativos',
    description: 'Estruturando nomenclatura e organização de arquivos',
    icon: FolderOpen,
    duration: 1200
  },
  {
    id: 'checklist',
    title: 'Criando Checklist de Aprovação',
    description: 'Definindo processo de validação e aprovação',
    icon: CheckSquare,
    duration: 1000
  }
];

export default function AIExtractionLoading({ isVisible, onComplete }: AIExtractionLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setCompletedSteps([]);
      setIsCompleted(false);
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const processStep = (stepIndex: number) => {
      if (stepIndex < extractionSteps.length) {
        setCurrentStep(stepIndex);
        
        timeoutId = setTimeout(() => {
          setCompletedSteps(prev => [...prev, stepIndex]);
          
          if (stepIndex === extractionSteps.length - 1) {
            setIsCompleted(true);
            setTimeout(() => {
              onComplete?.();
            }, 1500);
          } else {
            processStep(stepIndex + 1);
          }
        }, extractionSteps[stepIndex].duration);
      }
    };

    processStep(0);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const progress = (completedSteps.length / extractionSteps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <h2 className="text-xl font-semibold">Extração por IA em Andamento</h2>
          </div>
          <p className="text-blue-100">
            Nossa IA está analisando seus materiais e extraindo informações para criar o manual da marca automaticamente.
          </p>
        </div>

        {/* Progress */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progresso Geral</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white bg-opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {extractionSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(index);
              const isCurrent = currentStep === index;
              const isPending = index > currentStep;

              return (
                <div 
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-50 border border-green-200' 
                      : isCurrent 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : isCurrent 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${
                      isCompleted 
                        ? 'text-green-900' 
                        : isCurrent 
                          ? 'text-blue-900' 
                          : 'text-gray-500'
                    }`}>
                      {step.title}
                      {isCurrent && (
                        <span className="ml-2">
                          <span className="animate-pulse">•</span>
                          <span className="animate-pulse" style={{ animationDelay: '0.5s' }}>•</span>
                          <span className="animate-pulse" style={{ animationDelay: '1s' }}>•</span>
                        </span>
                      )}
                    </div>
                    <div className={`text-xs mt-1 ${
                      isCompleted 
                        ? 'text-green-700' 
                        : isCurrent 
                          ? 'text-blue-700' 
                          : 'text-gray-400'
                    }`}>
                      {step.description}
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="text-green-500 text-xs font-medium">
                      ✓ Concluído
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {isCompleted && (
          <div className="p-6 bg-green-50 border-t border-green-200">
            <div className="flex items-center gap-3 text-green-800">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">Extração Concluída!</div>
                <div className="text-sm text-green-700">
                  Seu manual da marca foi criado automaticamente. Redirecionando...
                </div>
              </div>
            </div>
          </div>
        )}

        {!isCompleted && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-1">
                <strong>Tempo estimado:</strong> 2-4 minutos
              </p>
              <p>
                Nossa IA está processando {extractionSteps.length} capítulos do seu manual da marca.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
