import { createClient } from '@supabase/supabase-js';
// =====================================================
// CONFIGURAÇÃO SUPABASE
// =====================================================
function createSupabaseClient() {
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
// =====================================================
// MIDDLEWARE DE AUTENTICAÇÃO
// =====================================================
export async function authenticateUser(req, res, next) {
    try {
        // Extrair token do header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Token de acesso requerido',
                code: 'MISSING_TOKEN'
            });
            return;
        }
        const token = authHeader.substring(7); // Remove "Bearer "
        // Criar cliente Supabase
        const supabase = createSupabaseClient();
        // Verificar o token
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            res.status(401).json({
                error: 'Token inválido ou expirado',
                code: 'INVALID_TOKEN'
            });
            return;
        }
        // Adicionar user e supabase ao request
        req.user = user;
        req.supabase = supabase;
        next();
    }
    catch (error) {
        console.error('[Auth Middleware Error]:', error);
        res.status(500).json({
            error: 'Erro interno de autenticação',
            code: 'AUTH_ERROR'
        });
    }
}
// =====================================================
// MIDDLEWARE OPCIONAL (PERMITE ACESSO ANÔNIMO)
// =====================================================
export async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const supabase = createSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser(token);
            if (user) {
                req.user = user;
                req.supabase = supabase;
            }
        }
        // Sempre continua, mesmo sem autenticação
        next();
    }
    catch (error) {
        console.error('[Optional Auth Middleware Error]:', error);
        // Continua mesmo com erro
        next();
    }
}
// =====================================================
// HELPER FUNCTIONS
// =====================================================
export function requireAuth() {
    return authenticateUser;
}
export function createSupabaseServerClient(req) {
    if (req.supabase) {
        return req.supabase;
    }
    return createSupabaseClient();
}
//# sourceMappingURL=auth.js.map