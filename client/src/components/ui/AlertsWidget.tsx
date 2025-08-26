// src/components/ui/AlertsWidget.tsx
'use client';

interface Alert {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  actionable?: boolean;
}

interface AlertsWidgetProps {
  className?: string;
}

const AlertsWidget: React.FC<AlertsWidgetProps> = ({ className = '' }) => {
  const alerts: Alert[] = [
    {
      id: '1',
      type: 'success',
      title: 'Meta de leads atingida!',
      message: 'Parabéns! Você superou a meta mensal em 12%',
      timestamp: '2 min atrás',
      actionable: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Budget da campanha',
      message: 'Campanha "Vacinação" está usando 85% do budget',
      timestamp: '1 hora atrás',
      actionable: true,
    },
    {
      id: '3',
      type: 'info',
      title: 'Novo relatório disponível',
      message: 'Análise semanal de performance está pronta',
      timestamp: '3 horas atrás',
      actionable: true,
    },
  ];

  const getAlertStyles = (type: Alert['type']) => {
    const styles = {
      success: {
        bg: 'bg-green-50 border-green-200',
        icon: 'text-green-600',
        title: 'text-green-800',
        message: 'text-green-700',
      },
      warning: {
        bg: 'bg-yellow-50 border-yellow-200',
        icon: 'text-yellow-600',
        title: 'text-yellow-800',
        message: 'text-yellow-700',
      },
      info: {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        message: 'text-blue-700',
      },
      error: {
        bg: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        title: 'text-red-800',
        message: 'text-red-700',
      },
    };
    return styles[type];
  };

  const getAlertIcon = (type: Alert['type']) => {
    const icons = {
      success: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
      error: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
    };
    return icons[type];
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-brown">Alertas & Notificações</h3>
        <span className="bg-woof-orange text-white text-xs font-bold px-2 py-1 rounded-full">
          {alerts.length}
        </span>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
        {alerts.map((alert) => {
          const styles = getAlertStyles(alert.type);
          return (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${styles.bg} transition-all duration-200 hover:shadow-sm`}
            >
              <div className="flex items-start space-x-3">
                <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${styles.title}`}>
                      {alert.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${styles.message}`}>
                    {alert.message}
                  </p>
                  {alert.actionable && (
                    <button className="text-xs font-medium text-woof-orange hover:text-warm-yellow mt-2 transition-colors">
                      Ver detalhes →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {alerts.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-7a1 1 0 011-1h4a1 1 0 011 1v7z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Nenhum alerta no momento</p>
        </div>
      )}
    </div>
  );
};

export default AlertsWidget;
