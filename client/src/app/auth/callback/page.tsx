'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/auth/supabase';
import Logo from '@/components/ui/Logo';

const AuthCallbackPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro no callback de autenticação:', error);
          router.push('/login?error=auth_callback_error');
          return;
        }

        if (data.session) {
          // Usuário autenticado com sucesso
          router.push('/dashboard');
        } else {
          // Nenhuma sessão encontrada
          router.push('/login');
        }
      } catch (error) {
        console.error('Erro no callback:', error);
        router.push('/login?error=callback_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray via-white to-warm-yellow/20 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-woof-orange mx-auto mb-4"></div>
        <p className="text-dark-gray">Finalizando autenticação...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
