'use client';

interface StatsCardProps {
  title: string;
  value: number;
  color?: 'default' | 'green' | 'yellow' | 'blue' | 'red' | 'purple';
  icon?: React.ReactNode;
}

export default function StatsCard({ 
  title, 
  value, 
  color = 'default',
  icon 
}: StatsCardProps) {
  const colorClasses = {
    default: 'text-gray-900',
    green: 'text-green-600',
    yellow: 'text-yellow-600', 
    blue: 'text-blue-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-bold ${colorClasses[color]}`}>
            {value.toLocaleString('pt-BR')}
          </div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
        {icon && (
          <div className={`${colorClasses[color]} opacity-70`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
