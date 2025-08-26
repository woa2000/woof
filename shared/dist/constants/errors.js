// Error codes and messages
export const ERROR_CODES = {
    // Generic errors
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    // Auth errors
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
    WEAK_PASSWORD: 'WEAK_PASSWORD',
    // Resource errors
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
    RESOURCE_FORBIDDEN: 'RESOURCE_FORBIDDEN',
    // Upload errors
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    UPLOAD_FAILED: 'UPLOAD_FAILED',
    // Database errors
    DATABASE_ERROR: 'DATABASE_ERROR',
    FOREIGN_KEY_VIOLATION: 'FOREIGN_KEY_VIOLATION',
    UNIQUE_VIOLATION: 'UNIQUE_VIOLATION',
    // External service errors
    SUPABASE_ERROR: 'SUPABASE_ERROR',
    AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
    EMAIL_SERVICE_ERROR: 'EMAIL_SERVICE_ERROR',
};
export const ERROR_MESSAGES = {
    [ERROR_CODES.UNKNOWN_ERROR]: 'Ocorreu um erro desconhecido',
    [ERROR_CODES.NETWORK_ERROR]: 'Erro de conexão. Verifique sua internet.',
    [ERROR_CODES.TIMEOUT_ERROR]: 'Tempo limite excedido. Tente novamente.',
    [ERROR_CODES.VALIDATION_ERROR]: 'Dados inválidos fornecidos',
    [ERROR_CODES.UNAUTHORIZED]: 'Acesso não autorizado',
    [ERROR_CODES.INVALID_CREDENTIALS]: 'Email ou senha inválidos',
    [ERROR_CODES.TOKEN_EXPIRED]: 'Sessão expirada. Faça login novamente.',
    [ERROR_CODES.USER_NOT_FOUND]: 'Usuário não encontrado',
    [ERROR_CODES.EMAIL_NOT_VERIFIED]: 'Email não verificado. Verifique sua caixa de entrada.',
    [ERROR_CODES.WEAK_PASSWORD]: 'Senha muito fraca. Use ao menos 8 caracteres.',
    [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Recurso não encontrado',
    [ERROR_CODES.RESOURCE_CONFLICT]: 'Conflito com recurso existente',
    [ERROR_CODES.RESOURCE_FORBIDDEN]: 'Acesso ao recurso negado',
    [ERROR_CODES.FILE_TOO_LARGE]: 'Arquivo muito grande. Máximo 5MB.',
    [ERROR_CODES.INVALID_FILE_TYPE]: 'Tipo de arquivo não permitido',
    [ERROR_CODES.UPLOAD_FAILED]: 'Falha no upload do arquivo',
    [ERROR_CODES.DATABASE_ERROR]: 'Erro no banco de dados',
    [ERROR_CODES.FOREIGN_KEY_VIOLATION]: 'Referência inválida detectada',
    [ERROR_CODES.UNIQUE_VIOLATION]: 'Registro duplicado não permitido',
    [ERROR_CODES.SUPABASE_ERROR]: 'Erro no serviço de banco de dados',
    [ERROR_CODES.AI_SERVICE_ERROR]: 'Erro no serviço de inteligência artificial',
    [ERROR_CODES.EMAIL_SERVICE_ERROR]: 'Erro no serviço de email',
};
export const SUCCESS_MESSAGES = {
    CREATED: 'Criado com sucesso',
    UPDATED: 'Atualizado com sucesso',
    DELETED: 'Removido com sucesso',
    SAVED: 'Salvo com sucesso',
    UPLOADED: 'Upload realizado com sucesso',
    SENT: 'Enviado com sucesso',
    LOGIN: 'Login realizado com sucesso',
    LOGOUT: 'Logout realizado com sucesso',
    SIGNUP: 'Cadastro realizado com sucesso',
    PASSWORD_RESET: 'Email de redefinição enviado',
    EMAIL_VERIFIED: 'Email verificado com sucesso',
};
//# sourceMappingURL=errors.js.map