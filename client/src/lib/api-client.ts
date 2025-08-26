import { createClient } from '@supabase/supabase-js';

// =====================================================
// CONFIGURAÇÃO
// =====================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');

// Supabase client para obter tokens
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =====================================================
// TYPES
// =====================================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  code?: string;
  details?: any;
  success: boolean;
  message?: string;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  requireAuth?: boolean;
}

// =====================================================
// API CLIENT CLASS
// =====================================================

export class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.defaultTimeout = timeout;
  }

  // =====================================================
  // AUTHENTICATION HELPERS
  // =====================================================

  async getAuthToken(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch (error) {
      console.error('Erro ao obter token de autenticação:', error);
      return null;
    }
  }

  // =====================================================
  // HTTP REQUEST METHOD
  // =====================================================

  async request<T = any>(
    endpoint: string, 
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      requireAuth = true
    } = config;

    try {
      // Preparar headers
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
      };

      // Adicionar token de autenticação se necessário
      if (requireAuth) {
        const token = await this.getAuthToken();
        if (token) {
          requestHeaders['Authorization'] = `Bearer ${token}`;
        } else {
          return {
            success: false,
            error: 'Token de autenticação não encontrado',
            code: 'MISSING_AUTH_TOKEN'
          };
        }
      }

      // Preparar URL completa
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

      // Criar AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Fazer a requisição
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Parse da resposta
      let responseData: ApiResponse<T>;
      
      try {
        responseData = await response.json();
      } catch (parseError) {
        responseData = {
          success: false,
          error: 'Erro ao processar resposta do servidor',
          code: 'PARSE_ERROR'
        };
      }

      // Verificar status HTTP
      if (!response.ok) {
        return {
          ...responseData,
          success: false,
          error: responseData.error || `Erro HTTP ${response.status}`,
          code: responseData.code || 'HTTP_ERROR'
        };
      }

      return responseData;

    } catch (error: any) {
      console.error(`Erro na requisição ${method} ${endpoint}:`, error);

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Timeout da requisição',
          code: 'REQUEST_TIMEOUT'
        };
      }

      return {
        success: false,
        error: error.message || 'Erro de rede',
        code: 'NETWORK_ERROR'
      };
    }
  }

  // =====================================================
  // CONVENIENCE METHODS
  // =====================================================

  async get<T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T = any>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async delete<T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// =====================================================
// SINGLETON INSTANCE
// =====================================================

export const apiClient = new ApiClient();

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        searchParams.append(key, value.join(','));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return obj && typeof obj === 'object' && 'success' in obj;
}