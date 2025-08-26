import type { AuthUser, AuthSession, LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';

// Auth validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Senha deve ter pelo menos 6 caracteres');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateSignupForm(credentials: SignupCredentials): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  if (!credentials.email) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(credentials.email)) {
    errors.email = 'Email inválido';
  }
  
  if (!credentials.password) {
    errors.password = 'Senha é obrigatória';
  } else {
    const passwordValidation = validatePassword(credentials.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.errors[0];
    }
  }
  
  if (credentials.confirmPassword && credentials.password !== credentials.confirmPassword) {
    errors.confirmPassword = 'Senhas não coincidem';
  }
  
  if (credentials.fullName && credentials.fullName.trim().length < 2) {
    errors.fullName = 'Nome deve ter pelo menos 2 caracteres';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateLoginForm(credentials: LoginCredentials): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  if (!credentials.email) {
    errors.email = 'Email é obrigatório';
  } else if (!validateEmail(credentials.email)) {
    errors.email = 'Email inválido';
  }
  
  if (!credentials.password) {
    errors.password = 'Senha é obrigatória';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

// Token helpers
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) return null;
  
  return token;
}

export function createAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

// User helpers  
export function getUserInitials(user: AuthUser | null): string {
  if (!user) return '';
  
  const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email || '';
  return name
    .split(' ')
    .filter((part: string) => part.length > 0)
    .map((part: string) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

export function getUserDisplayName(user: AuthUser | null): string {
  if (!user) return '';
  
  return (
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email ||
    'Usuário'
  );
}

// Session helpers
export function isSessionValid(session: AuthSession | null): boolean {
  if (!session) return false;
  
  const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null;
  if (!expiresAt) return false;
  
  return expiresAt > new Date();
}

export function getSessionExpirationTime(session: AuthSession | null): Date | null {
  if (!session?.expires_at) return null;
  return new Date(session.expires_at * 1000);
}

// Error helpers
export function formatAuthError(error: any): string {
  if (!error) return 'Erro desconhecido';
  
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha inválidos',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
    'User already registered': 'Usuário já cadastrado com este email',
    'Password should be at least 6 characters': 'Senha deve ter pelo menos 6 caracteres',
    'Signup requires a valid password': 'Cadastro requer uma senha válida',
    'Invalid email': 'Email inválido',
    'Email rate limit exceeded': 'Muitas tentativas. Tente novamente mais tarde.',
    'Too many requests': 'Muitas tentativas. Tente novamente mais tarde.',
  };
  
  return errorMessages[error.message] || error.message || 'Erro de autenticação';
}