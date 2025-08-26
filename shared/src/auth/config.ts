// Shared Supabase configuration
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

export const AUTH_CONFIG = {
  redirectTo: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  cookieName: 'sb-auth-token',
  cookieOptions: {
    maxAge: 60 * 60 * 8, // 8 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },
} as const;