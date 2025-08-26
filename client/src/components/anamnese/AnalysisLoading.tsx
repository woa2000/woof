import React, { useEffect, useState, useMemo } from 'react';
import { Loader, Brain, Search, BarChart3, Target, Check, Lightbulb } from 'lucide-react';

interface AnalysisLoadingProps {
  isVisible?: boolean;
}

const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ isVisible = true }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  const stages = useMemo(() => [
    {
      id: 'initializing',
      label: 'Coletando dados do site',
      icon: Search,
      description: 'Analisando estrutura e conteúdo',
      duration: 1200,
      tips: [
        'Coletando metadados da página principal',
        'Analisando estrutura de navegação',
        'Verificando presença nas redes sociais',
        'Identificando tecnologias utilizadas'
      ]
    },
    {
      id: 'analyzing',
      label: 'Processando com IA',
      icon: Brain,
      description: 'Identificando padrões e insights',
      duration: 1500,
      tips: [
        'Identificando DNA da marca',
        'Mapeando jornada do cliente',
        'Analisando tom de voz e personalidade',
        'Detectando pontos de melhoria'
      ]
    },
    {
      id: 'processing',
      label: 'Gerando métricas',
      icon: BarChart3,
      description: 'Calculando scores e recomendações',
      duration: 1000,
      tips: [
        'Calculando scores de usabilidade',
        'Priorizando oportunidades por impacto',
        'Criando matriz de esforço x benefício',
        'Desenvolvendo roadmap estratégico'
      ]
    },
    {
      id: 'finalizing',
      label: 'Finalizando relatório',
      icon: Target,
      description: 'Organizando resultados',
      duration: 800,
      tips: [
        'Estruturando diagnóstico final',
        'Criando plano de ação detalhado',
        'Preparando nova anatomia de home',
        'Gerando perguntas de aprofundamento'
      ]
    }
  ], []);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStage(0);
      setCurrentTip(0);
      setCompletedStages([]);
      return;
    }

    let stageTimeout: NodeJS.Timeout;
    let tipInterval: NodeJS.Timeout;

    const progressToNextStage = () => {
      if (currentStage < stages.length - 1) {
        setCompletedStages(prev => [...prev, currentStage]);
        setCurrentStage(prev => prev + 1);
        setCurrentTip(0);
      } else {
        setCompletedStages(prev => [...prev, currentStage]);
      }
    };

    const rotateTips = () => {
      setCurrentTip(prev => (prev + 1) % stages[currentStage].tips.length);
    };

    if (currentStage < stages.length) {
      stageTimeout = setTimeout(progressToNextStage, stages[currentStage].duration);
      tipInterval = setInterval(rotateTips, 600);
    }

    return () => {
      clearTimeout(stageTimeout);
      clearInterval(tipInterval);
    };
  }, [isVisible, currentStage, stages]);

  if (!isVisible) return null;

  const isAnalysisComplete = completedStages.includes(stages.length - 1);

  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
      <div className="text-center mb-8">
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
          <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-4">
            {isAnalysisComplete ? (
              <Check className="w-8 h-8 text-white animate-bounce" />
            ) : (
              <Brain className="w-8 h-8 text-white animate-pulse" />
            )}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isAnalysisComplete ? 'Análise Concluída!' : 'Processando Anamnese Digital'}
        </h3>
        <p className="text-gray-600">
          {isAnalysisComplete 
            ? 'Sua anamnese digital foi processada com sucesso'
            : 'Nossa IA está analisando o site e gerando insights estratégicos'
          }
        </p>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4 mb-8">
        {stages.map((stageItem, index) => {
          const isActive = index === currentStage && !isAnalysisComplete;
          const isComplete = completedStages.includes(index);
          const IconComponent = stageItem.icon;

          return (
            <div 
              key={stageItem.id}
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-500 transform ${
                isActive 
                  ? 'bg-orange-50 border border-orange-200 scale-[1.02]' 
                  : isComplete 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : isComplete 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-500'
              }`}>
                {isActive ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium transition-colors duration-300 ${
                  isActive 
                    ? 'text-orange-900' 
                    : isComplete 
                      ? 'text-green-900' 
                      : 'text-gray-700'
                }`}>
                  {stageItem.label}
                </h4>
                <p className={`text-sm transition-colors duration-300 ${
                  isActive 
                    ? 'text-orange-700' 
                    : isComplete 
                      ? 'text-green-700' 
                      : 'text-gray-500'
                }`}>
                  {stageItem.description}
                </p>
              </div>
              {isComplete && (
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progresso</span>
          <span>{Math.round(((completedStages.length + (isAnalysisComplete ? 0 : 1)) / stages.length) * 100)}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-700 ease-out relative"
            style={{ 
              width: `${((completedStages.length + (isAnalysisComplete ? 0 : 1)) / stages.length) * 100}%` 
            }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Current Tip or Completion Message */}
      {!isAnalysisComplete ? (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 animate-fade-in">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">O que estamos fazendo agora:</h4>
              <p className="text-sm text-blue-800 transition-all duration-500">
                {stages[currentStage]?.tips[currentTip]}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-green-900 mb-1">Análise Finalizada!</h4>
              <p className="text-sm text-green-800">
                Sua anamnese digital está pronta. Visualize os resultados abaixo.
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AnalysisLoading;
