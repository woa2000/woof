// Debug helper for authentication redirects
export const debugAuth = {
  log: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUTH DEBUG] ${message}`, data || '');
    }
  },
  
  logUserState: (isAuthenticated: boolean, loading: boolean, user: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH DEBUG] User State:', {
        isAuthenticated,
        loading,
        user: user ? { id: user.id, email: user.email } : null,
        currentPath: typeof window !== 'undefined' ? window.location.pathname : 'server'
      });
    }
  },
  
  logRedirect: (from: string, to: string, reason: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUTH DEBUG] Redirecting from ${from} to ${to} - Reason: ${reason}`);
    }
  }
};
