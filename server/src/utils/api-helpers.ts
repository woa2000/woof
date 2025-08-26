import { Response } from 'express';

// =====================================================
// TYPES
// =====================================================

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  code?: string;
  details?: any;
  success: boolean;
  message?: string;
}

// =====================================================
// ERROR HANDLERS
// =====================================================

export function handleApiError(error: any, operation: string, res: Response): void {
  console.error(`[API Error - ${operation}]:`, error);
  
  // Erro de autenticação
  if (error.message === 'Usuário não autenticado' || error.message === 'Token inválido ou expirado') {
    res.status(401).json({
      error: 'Acesso negado',
      code: 'UNAUTHORIZED',
      success: false
    });
    return;
  }
  
  // Erro de recurso não encontrado
  if (error.message === 'Evento não encontrado' || error.message.includes('não encontrado')) {
    res.status(404).json({
      error: 'Recurso não encontrado',
      code: 'NOT_FOUND',
      success: false
    });
    return;
  }
  
  // Erro de validação
  if (error.message === 'Dados inválidos' || error.details?.length > 0) {
    res.status(400).json({
      error: 'Dados inválidos',
      code: 'VALIDATION_ERROR',
      details: error.details || error.message,
      success: false
    });
    return;
  }
  
  // Erro de UUID inválido
  if (error.message === 'ID inválido') {
    res.status(400).json({
      error: 'ID inválido',
      code: 'INVALID_UUID',
      success: false
    });
    return;
  }
  
  // Erro genérico do servidor
  res.status(500).json({
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    success: false
  });
}

// =====================================================
// SUCCESS RESPONSE HELPERS
// =====================================================

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  status: number = 200
): void {
  res.status(status).json({
    data,
    success: true,
    message
  });
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message?: string
): void {
  sendSuccess(res, data, message, 201);
}

// =====================================================
// VALIDATION HELPERS
// =====================================================

export function validateSazonalidade(data: any): string[] {
  const errors: string[] = [];
  
  if (!data.evento || typeof data.evento !== 'string' || data.evento.length === 0) {
    errors.push('Evento é obrigatório');
  }
  
  if (data.evento && data.evento.length > 150) {
    errors.push('Evento deve ter no máximo 150 caracteres');
  }
  
  if (!data.data_inicio || !isValidDate(data.data_inicio)) {
    errors.push('Data de início é obrigatória e deve estar em formato válido');
  }
  
  if (data.data_fim && !isValidDate(data.data_fim)) {
    errors.push('Data de fim deve estar em formato válido');
  }
  
  if (data.categoria_pet && !['vacinacao', 'doenca_sazonal', 'campanha_preventiva', 'data_comemorativa', 'procedimento_sazonal'].includes(data.categoria_pet)) {
    errors.push('Categoria pet inválida');
  }
  
  if (data.prioridade && !['baixa', 'media', 'alta'].includes(data.prioridade)) {
    errors.push('Prioridade deve ser: baixa, media ou alta');
  }
  
  if (data.notificacao_antecedencia && (typeof data.notificacao_antecedencia !== 'number' || data.notificacao_antecedencia < 0)) {
    errors.push('Notificação antecedência deve ser um número positivo');
  }
  
  return errors;
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// =====================================================
// CUSTOM ERROR CLASS
// =====================================================

export class ApiException extends Error {
  public code: string;
  public status: number;
  public details?: any;

  constructor(message: string, code: string = 'API_ERROR', status: number = 500, details?: any) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}