import type { AuthUser, AuthSession, LoginCredentials, SignupCredentials } from '../types/auth';
export declare function validateEmail(email: string): boolean;
export declare function validatePassword(password: string): {
    valid: boolean;
    errors: string[];
};
export declare function validateSignupForm(credentials: SignupCredentials): {
    valid: boolean;
    errors: Record<string, string>;
};
export declare function validateLoginForm(credentials: LoginCredentials): {
    valid: boolean;
    errors: Record<string, string>;
};
export declare function extractTokenFromHeader(authHeader?: string): string | null;
export declare function createAuthHeader(token: string): string;
export declare function getUserInitials(user: AuthUser | null): string;
export declare function getUserDisplayName(user: AuthUser | null): string;
export declare function isSessionValid(session: AuthSession | null): boolean;
export declare function getSessionExpirationTime(session: AuthSession | null): Date | null;
export declare function formatAuthError(error: any): string;
//# sourceMappingURL=helpers.d.ts.map