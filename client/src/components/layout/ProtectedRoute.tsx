'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/features/useAuth';
import Logo from '@/components/ui/Logo';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-woof-orange mx-auto"></div>
          <p className="mt-2 text-dark-gray">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <p className="text-dark-gray">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
