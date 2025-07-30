// src/components/ui/LiveStatsWidget.tsx
'use client';

import { useState, useEffect } from 'react';

interface LiveStatsProps {
  className?: string;
}

const LiveStatsWidget: React.FC<LiveStatsProps> = ({ className = '' }) => {
  const [stats, setStats] = useState({
    onlineVisitors: 12,
    activeLeads: 5,
    responseTime: '2.3min',
    satisfaction: 4.8,
  });

  // Simular dados em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        onlineVisitors: Math.max(1, prev.onlineVisitors + Math.floor(Math.random() * 6) - 2),
        activeLeads: Math.max(0, prev.activeLeads + Math.floor(Math.random() * 3) - 1),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const liveStats = [
    {
      label: 'Visitantes Online',
      value: stats.onlineVisitors,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'text-green-600 bg-green-100',
      pulse: true,
    },
    {
      label: 'Leads Ativos',
      value: stats.activeLeads,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'text-blue-600 bg-blue-100',
      pulse: false,
    },
    {
      label: 'Tempo Resposta',
      value: stats.responseTime,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-orange-600 bg-orange-100',
      pulse: false,
    },
    {
      label: 'Satisfação',
      value: `${stats.satisfaction}⭐`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'text-pink-600 bg-pink-100',
      pulse: false,
    },
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dark-brown">Status em Tempo Real</h3>
        <div className="flex items-center text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-xs font-medium">Ao vivo</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {liveStats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className={`p-2 rounded-full ${stat.color} ${stat.pulse ? 'animate-pulse' : ''}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-dark-brown">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStatsWidget;
