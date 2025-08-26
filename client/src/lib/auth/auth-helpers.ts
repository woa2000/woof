import { supabase } from './supabase';

// Função para cadastro de usuário
export const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  return { data, error };
};

// Função para resetar senha
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  return { data, error };
};

// Função para atualizar senha
export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password
  });

  return { data, error };
};

// Função para atualizar perfil do usuário
export const updateProfile = async (updates: { name?: string; avatar?: string }) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });

  return { data, error };
};

// Verificar se o usuário está autenticado
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Obter sessão atual
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};
