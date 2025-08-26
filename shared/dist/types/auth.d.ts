import type { User, Session } from '@supabase/supabase-js';
export interface AuthUser extends User {
}
export interface AuthSession extends Session {
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
//# sourceMappingURL=auth.d.ts.map