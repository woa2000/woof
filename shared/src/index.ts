// Main entry point for shared workspace
// Re-export all modules for easier imports

export * from './types';
export * from './utils';
export * from './constants';

// Auth exports (selective to avoid conflicts)
export {
  SUPABASE_CONFIG,
  AUTH_CONFIG,
  validateEmail,
  validateSignupForm,
  validateLoginForm,
  extractTokenFromHeader,
  createAuthHeader,
  getUserInitials,
  getUserDisplayName,
  isSessionValid,
  getSessionExpirationTime,
  formatAuthError,
} from './auth';