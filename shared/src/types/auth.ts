import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  // Extended user properties if needed
}

export interface AuthSession extends Session {
  // Extended session properties if needed  
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  confirmPassword?: string;
  fullName?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: AuthSession | null;
  error: string | null;
}