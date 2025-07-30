// src/components/ui/SmartAlertsWidget.tsx
'use client';

import { Alert } from '@/types/dashboard';

interface SmartAlertsWidgetProps {
  alerts: Alert[];
  onDismiss: (alertId: string) => void;
  onAction: (alertId: string) => void;
  className?: string;
}

const SmartAlertsWidget: React.FC<SmartAlertsWidgetProps> = ({
  alerts,
  onDismiss,
  onAction,
  className = '',
}) => {
  // Ordenar por prioridade e categoria
  const sortedAlerts = alerts
    .filter(alert => !alert.dismissed)
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const getPriorityStyles = (priority: Alert['priority'], type: Alert['type']) => {
    const baseStyles = {
      critical: 'border-red-500 bg-red-50',
      warning: 'border-yellow-500 bg-yellow-50',
      info: 'border-blue-500 bg-blue-50',
      success: 'border-green-500 bg-green-50',
    };

    const priorityBorder = {
      high: 'border-l-4',
      medium: 'border-l-2',
      low: 'border-l',
    };

    return `${baseStyles[type]} ${priorityBorder[priority]}`;
  };

  const getPriorityIcon = (priority: Alert['priority'], type: Alert['type']) => {
    const iconColor = {
      critical: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
      success: 'text-green-600',
    };

    const icons = {
      critical: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      success: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    };

    return <div className={iconColor[type]}>{icons[type]}</div>;
  };

  const getCategoryLabel = (category: Alert['category']) => {
    const labels = {
      financial: 'Financeiro',
      operational: 'Operacional',
      marketing: 'Marketing',
      system: 'Sistema',
    };
    return labels[category];
  };

  const getCategoryColor = (category: Alert['category']) => {
    const colors = {
      financial: 'bg-orange-100 text-orange-800',
      operational: 'bg-blue-100 text-blue-800',
      marketing: 'bg-purple-100 text-purple-800',
      system: 'bg-gray-100 text-gray-800',
    };
    return colors[category];
  };

  // Agrupar por prioridade
  const groupedAlerts = {
    high: sortedAlerts.filter(a => a.priority === 'high'),
    medium: sortedAlerts.filter(a => a.priority === 'medium'),
    low: sortedAlerts.filter(a => a.priority === 'low'),
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-brown">Alertas Inteligentes</h3>
        <div className="flex items-center space-x-2">
          {Object.entries(groupedAlerts).map(([priority, alerts]) => (
            alerts.length > 0 && (
              <span
                key={priority}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  priority === 'high' ? 'bg-red-100 text-red-800' :
                  priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}
              >
                {alerts.length} {priority === 'high' ? 'crítico' : priority === 'medium' ? 'médio' : 'baixo'}
              </span>
            )
          ))}
        </div>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {/* Alertas de alta prioridade primeiro */}
        {Object.entries(groupedAlerts).map(([priority, priorityAlerts]) => (
          priorityAlerts.length > 0 && (
            <div key={priority} className="space-y-3">
              {priority === 'high' && priorityAlerts.length > 0 && (
                <div className="flex items-center space-x-2 mt-4 first:mt-0">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-700">Prioridade Alta</span>
                </div>
              )}
              
              {priorityAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg p-4 transition-all duration-200 hover:shadow-sm ${getPriorityStyles(alert.priority, alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-0.5">
                        {getPriorityIcon(alert.priority, alert.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-dark-brown">
                            {alert.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(alert.category)}`}>
                              {getCategoryLabel(alert.category)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {alert.timestamp}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">
                          {alert.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {alert.actionable && (
                              <button
                                onClick={() => onAction(alert.id)}
                                className="text-xs font-medium text-woof-orange hover:text-warm-yellow transition-colors"
                              >
                                Tomar ação →
                              </button>
                            )}
                          </div>
                          
                          <button
                            onClick={() => onDismiss(alert.id)}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            Dispensar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ))}
      </div>
      
      {sortedAlerts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Tudo funcionando perfeitamente!</p>
          <p className="text-xs text-gray-400 mt-1">Nenhum alerta no momento</p>
        </div>
      )}
    </div>
  );
};

export default SmartAlertsWidget;
