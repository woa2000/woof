'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/features/useAuth';

interface AuthRedirectProps {
  to: string;
  condition: 'authenticated' | 'unauthenticated';
  children?: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ to, condition, children }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const shouldRedirect = 
        (condition === 'authenticated' && isAuthenticated) ||
        (condition === 'unauthenticated' && !isAuthenticated);

      if (shouldRedirect) {
        console.log(`Redirecionando para ${to} - Condição: ${condition}, Autenticado: ${isAuthenticated}`);
        
        // Tenta primeiro com router.push
        router.push(to);
        
        // Fallback com window.location
        setTimeout(() => {
          if (window.location.pathname !== to) {
            window.location.href = to;
          }
        }, 1000);
      }
    }
  }, [loading, isAuthenticated, condition, to, router]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-gray via-white to-warm-yellow/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-woof-orange mx-auto mb-4"></div>
          <p className="text-dark-gray">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthRedirect;
