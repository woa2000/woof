import { useState, useEffect } from 'react';
import { supabase } from '@/lib/auth/supabase';
import { debugAuth } from '@/lib/auth/auth-debug';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Interfaces para tipagem
interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Função para converter SupabaseUser para User
const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email!,
  name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
  avatar: supabaseUser.user_metadata?.avatar_url
});

// Hook de autenticação personalizado
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          setAuthState({
            user: null,
            loading: false,
            error: error.message
          });
          return;
        }

        if (session?.user) {
          setAuthState({
            user: mapSupabaseUser(session.user),
            loading: false,
            error: null
          });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setAuthState({
          user: null,
          loading: false,
          error: 'Erro ao verificar sessão'
        });
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        debugAuth.log('Auth state changed:', { event, session: session ? 'exists' : 'null' });
        
        if (event === 'SIGNED_IN' && session?.user) {
          const user = mapSupabaseUser(session.user);
          setAuthState({
            user,
            loading: false,
            error: null
          });
          debugAuth.logUserState(true, false, user);
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            loading: false,
            error: null
          });
          debugAuth.logUserState(false, false, null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          const user = mapSupabaseUser(session.user);
          setAuthState(prev => ({ 
            ...prev, 
            user,
            loading: false 
          }));
        } else if (!session) {
          // Não há sessão ativa
          setAuthState(prev => ({
            user: null,
            loading: false,
            error: null
          }));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setAuthState({
          user: null,
          loading: false,
          error: error.message
        });
        return { success: false, error: error.message };
      }
      
      if (data.user && data.session) {
        debugAuth.log('Login successful, updating state immediately');
        
        // Atualiza o estado imediatamente para garantir que funcione
        const user = mapSupabaseUser(data.user);
        setAuthState({
          user,
          loading: false,
          error: null
        });
        
        return { success: true, user };
      }
      
      // Fallback se não tiver dados esperados
      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: false, error: 'Dados de autenticação inválidos' };
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setAuthState({
        user: null,
        loading: false,
        error: errorMessage
      });
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        const errorMessage = error.message || `Erro ao fazer login com ${provider}`;
        setAuthState(prev => ({
          ...prev,
          error: errorMessage
        }));
        return { success: false, error: errorMessage };
      }
      
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Erro ao fazer login com ${provider}`;
      setAuthState(prev => ({
        ...prev,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        const errorMessage = error.message || 'Erro ao fazer logout';
        setAuthState(prev => ({
          ...prev,
          error: errorMessage
        }));
        return { success: false, error: errorMessage };
      }
      
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
      
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer logout';
      setAuthState(prev => ({
        ...prev,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...authState,
    signIn,
    signInWithProvider,
    signOut,
    isAuthenticated: !!authState.user
  };
};
