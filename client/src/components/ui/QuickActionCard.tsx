// src/components/ui/QuickActionCard.tsx
import { ReactNode } from 'react';

interface QuickActionProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  gradient?: string;
  className?: string;
}

const QuickActionCard: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onClick,
  gradient = 'from-woof-orange to-warm-yellow',
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left w-full ${className}`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-dark-brown group-hover:text-woof-orange transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {description}
            </p>
          </div>
          
          <div className="text-gray-400 group-hover:text-woof-orange transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
};

export default QuickActionCard;
