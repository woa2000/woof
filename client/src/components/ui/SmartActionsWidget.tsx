// src/components/ui/SmartActionsWidget.tsx
'use client';

import { ReactElement } from 'react';
import { SuggestedAction } from '@/types/dashboard';

interface SmartActionsWidgetProps {
  actions: SuggestedAction[];
  currentTime: Date;
  businessHours: boolean;
  className?: string;
}

const SmartActionsWidget: React.FC<SmartActionsWidgetProps> = ({
  actions,
  currentTime,
  businessHours,
  className = '',
}) => {
  const getPriorityColor = (priority: SuggestedAction['priority']) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500',
    };
    return colors[priority];
  };

  const getPriorityLabel = (priority: SuggestedAction['priority']) => {
    const labels = {
      high: 'Urgente',
      medium: 'Importante',
      low: 'Quando possível',
    };
    return labels[priority];
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, ReactElement> = {
      clinical: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      management: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      content: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      marketing: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    };
    return icons[category] || icons.management;
  };

  const getTimeBasedMessage = () => {
    const hour = currentTime.getHours();
    
    if (hour < 6) return "🌙 Madrugada - Descanse bem!";
    if (hour < 12) return "☀️ Bom dia! Hora de começar o dia";
    if (hour < 18) return "🌤️ Boa tarde! Mantenha o foco";
    if (hour < 22) return "🌅 Boa noite! Finalizando o dia";
    return "🌙 Noite - Hora de relaxar";
  };

  const sortedActions = actions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-brown">Ações Sugeridas</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${businessHours ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-gray-600">
            {businessHours ? 'Horário comercial' : 'Fora do expediente'}
          </span>
        </div>
      </div>

      {/* Mensagem contextual baseada no tempo */}
      <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <p className="text-sm text-gray-700">
          {getTimeBasedMessage()}
        </p>
      </div>
      
      <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
        {sortedActions.map((action) => (
          <div
            key={action.id}
            className={`group relative overflow-hidden bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-woof-orange hover:shadow-md transition-all duration-200 cursor-pointer ${
              action.priority === 'high' ? 'ring-2 ring-red-100' : ''
            }`}
            onClick={action.action}
          >
            {/* Indicador de prioridade */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor(action.priority)}`}></div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-woof-orange group-hover:text-white transition-colors">
                  {getCategoryIcon(action.category)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-dark-brown group-hover:text-woof-orange transition-colors">
                    {action.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      action.priority === 'high' ? 'bg-red-100 text-red-800' :
                      action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {getPriorityLabel(action.priority)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {action.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{action.estimatedTime}</span>
                    </div>
                    
                    {action.deadline && (
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Até {action.deadline.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-woof-orange opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-400 italic">
                  💡 {action.context}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {sortedActions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Todas as tarefas concluídas!</p>
          <p className="text-xs text-gray-400 mt-1">Aproveite para descansar ou planejar</p>
        </div>
      )}
    </div>
  );
};

export default SmartActionsWidget;
