// src/components/ui/ProgressCard.tsx
interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  label?: string;
  color?: string;
  className?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  current,
  total,
  label,
  color = 'bg-woof-orange',
  className = '',
}) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-brown">{title}</h3>
        <span className="text-2xl font-bold text-woof-orange">
          {current}/{total}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{label || 'Progresso'}</span>
          <span className="font-medium text-dark-brown">{percentage}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-out ${color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      
      {percentage >= 100 && (
        <div className="mt-3 flex items-center text-green-600">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Completo!</span>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;
