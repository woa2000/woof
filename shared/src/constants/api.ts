// API endpoints and configuration constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    profile: '/api/auth/profile',
  },
  
  // Calendar endpoints
  calendario: {
    base: '/api/calendario',
    insights: '/api/calendario/insights',
    sugestoes: '/api/calendario/sugestoes',
    presets: '/api/calendario/presets',
    byId: (id: string) => `/api/calendario/${id}`,
  },
  
  // Anamnese endpoints
  anamnese: {
    base: '/api/anamnese',
    digital: '/api/anamnese/digital',
    reports: '/api/anamnese/reports',
    byId: (id: string) => `/api/anamnese/${id}`,
  },
  
  // Brand endpoints
  brands: {
    base: '/api/brands',
    manuals: '/api/brands/manuals',
    upload: '/api/brands/upload',
    byId: (id: string) => `/api/brands/${id}`,
  },
  
  // Utility endpoints
  health: '/api/health',
  upload: '/api/upload',
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;