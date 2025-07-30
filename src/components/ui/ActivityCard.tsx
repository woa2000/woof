// src/components/ui/ActivityCard.tsx
import { ReactNode } from 'react';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'lead' | 'campaign' | 'content' | 'report';
  icon?: ReactNode;
}

interface ActivityCardProps {
  activities: ActivityItem[];
  title?: string;
  className?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activities,
  title = "Atividades Recentes",
  className = '',
}) => {
  const getTypeColor = (type: ActivityItem['type']) => {
    const colors = {
      lead: 'bg-green-100 text-green-800',
      campaign: 'bg-blue-100 text-blue-800',
      content: 'bg-purple-100 text-purple-800',
      report: 'bg-orange-100 text-orange-800',
    };
    return colors[type];
  };

  const getTypeLabel = (type: ActivityItem['type']) => {
    const labels = {
      lead: 'Lead',
      campaign: 'Campanha',
      content: 'Conteúdo',
      report: 'Relatório',
    };
    return labels[type];
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-dark-brown mb-4">{title}</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              {activity.icon || (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-woof-orange to-warm-yellow flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-dark-brown truncate">
                  {activity.title}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                  {getTypeLabel(activity.type)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
