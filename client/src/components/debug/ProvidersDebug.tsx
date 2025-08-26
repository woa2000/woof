/**
 * Componente de Debug para Providers
 * Mostra o status atual dos providers de dados na aplicação
 */

'use client';

import React from 'react';
import { useDataProvider, getProviderConfig } from '@/services/data-provider.service';
import { useAuth } from '@/hooks/features/useAuth';

export function ProvidersDebug() {
  const dataProvider = useDataProvider();
  const { user } = useAuth();
  const config = getProviderConfig();

  // Só mostra em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono max-w-sm z-50">
      <div className="mb-2 font-bold">🔧 Debug - Data Providers</div>
      
      <div className="space-y-1">
        <div>
          <span className="text-blue-300">Environment:</span> {config.environment}
        </div>
        
        <div>
          <span className="text-blue-300">Provider Type:</span>{' '}
          <span className={config.type === 'mock' ? 'text-green-400' : 'text-yellow-400'}>
            {config.type}
          </span>
        </div>
        
        <div>
          <span className="text-blue-300">Mock Data:</span>{' '}
          <span className={config.mockDataEnabled ? 'text-green-400' : 'text-red-400'}>
            {config.mockDataEnabled ? '✓ Enabled' : '✗ Disabled'}
          </span>
        </div>
        
        <div>
          <span className="text-blue-300">Mock AI:</span>{' '}
          <span className={config.mockAiEnabled ? 'text-green-400' : 'text-red-400'}>
            {config.mockAiEnabled ? '✓ Enabled' : '✗ Disabled'}
          </span>
        </div>
        
        <div>
          <span className="text-blue-300">User:</span>{' '}
          <span className={user ? 'text-green-400' : 'text-red-400'}>
            {user ? `✓ ${user.email}` : '✗ Not authenticated'}
          </span>
        </div>
        
        <div>
          <span className="text-blue-300">Provider Instance:</span>{' '}
          <span className="text-green-400">
            {dataProvider ? '✓ Active' : '✗ Not initialized'}
          </span>
        </div>

        {user && (
          <div>
            <span className="text-blue-300">User ID:</span>{' '}
            <span className="text-gray-300 text-xs">
              {user.id.slice(0, 8)}...
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-600">
        <div className="text-gray-400 text-xs">
          Mock system status for development
        </div>
      </div>
    </div>
  );
}

export default ProvidersDebug;