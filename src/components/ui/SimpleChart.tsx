// src/components/ui/SimpleChart.tsx
'use client';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: ChartData[];
  title?: string;
  type?: 'bar' | 'line';
  className?: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  title = 'Performance',
  type = 'bar',
  className = '',
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const colors = [
    'bg-woof-orange',
    'bg-warm-yellow', 
    'bg-teal-accent',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-dark-brown mb-6">{title}</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const color = item.color || colors[index % colors.length];
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-dark-brown">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-gray-600">
                  {item.value}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${color} transition-all duration-1000 ease-out rounded-full`}
                  style={{ 
                    width: `${percentage}%`,
                    animation: 'slideIn 1s ease-out'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Nenhum dado disponível</p>
        </div>
      )}
    </div>
  );
};

export default SimpleChart;
