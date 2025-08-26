'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/features/useAuth';
import Logo from '@/components/ui/Logo';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login',
  requireAuth = true 
}) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!loading && !hasRedirected) {
      const shouldRedirect = requireAuth ? !isAuthenticated : isAuthenticated;
      
      if (shouldRedirect) {
        setHasRedirected(true);
        router.replace(redirectTo);
      }
    }
  }, [loading, isAuthenticated, requireAuth, redirectTo, router, hasRedirected]);

  // Mostra loading enquanto verifica autenticação ou durante redirecionamento
  if (loading || hasRedirected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-gray via-white to-warm-yellow/20 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-woof-orange mx-auto mb-4"></div>
          <p className="text-dark-gray">
            {hasRedirected ? 'Redirecionando...' : 'Verificando autenticação...'}
          </p>
        </div>
      </div>
    );
  }

  // Se chegou aqui, significa que a condição de auth está ok
  return <>{children}</>;
};

export default ProtectedRoute;
