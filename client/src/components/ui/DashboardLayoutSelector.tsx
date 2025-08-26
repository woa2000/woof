// src/components/ui/DashboardLayoutSelector.tsx
'use client';

import { UserPreferences } from '@/types/dashboard';

interface DashboardLayoutSelectorProps {
  currentLayout: UserPreferences['dashboardLayout'];
  onLayoutChange: (layout: UserPreferences['dashboardLayout']) => void;
  className?: string;
}

const DashboardLayoutSelector: React.FC<DashboardLayoutSelectorProps> = ({
  currentLayout,
  onLayoutChange,
  className = '',
}) => {
  const layouts = [
    {
      id: 'compact' as const,
      name: 'Compacto',
      description: 'Visão resumida com métricas essenciais',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      id: 'detailed' as const,
      name: 'Detalhado',
      description: 'Informações completas e widgets expandidos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      id: 'focus' as const,
      name: 'Foco',
      description: 'Interface minimalista para tarefas específicas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-dark-brown mb-4">Layout do Dashboard</h3>
      
      <div className="space-y-3">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onLayoutChange(layout.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              currentLayout === layout.id
                ? 'border-woof-orange bg-orange-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                currentLayout === layout.id ? 'bg-woof-orange text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {layout.icon}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-medium ${
                  currentLayout === layout.id ? 'text-woof-orange' : 'text-dark-brown'
                }`}>
                  {layout.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {layout.description}
                </p>
              </div>
              
              {currentLayout === layout.id && (
                <div className="text-woof-orange">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardLayoutSelector;
