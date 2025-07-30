// src/components/ui/DashboardVersionToggle.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const DashboardVersionToggle: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isV2 = pathname.includes('dashboard-v2');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Simular carregamento suave
    setTimeout(() => {
      if (isV2) {
        router.push('/dashboard');
      } else {
        router.push('/dashboard-v2');
      }
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-600">Versão:</span>
          
          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            disabled={isAnimating}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-woof-orange focus:ring-offset-2 ${
              isV2 ? 'bg-woof-orange' : 'bg-gray-300'
            } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                isV2 ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          
          {/* Version Labels */}
          <div className="flex flex-col text-xs">
            <span className={`${!isV2 ? 'font-semibold text-woof-orange' : 'text-gray-500'}`}>
              V1
            </span>
            <span className={`${isV2 ? 'font-semibold text-woof-orange' : 'text-gray-500'}`}>
              V2
            </span>
          </div>
        </div>
        
        {/* Version Description */}
        <div className="mt-2 px-1">
          <p className="text-xs text-gray-600">
            {isV2 ? (
              <span className="flex items-center">
                <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Inteligente
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-3 h-3 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Clássico
              </span>
            )}
          </p>
        </div>
        
        {/* Loading indicator */}
        {isAnimating && (
          <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-woof-orange border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardVersionToggle;
