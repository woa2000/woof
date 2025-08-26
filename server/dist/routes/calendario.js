import express from 'express';
import { requireAuth } from '../middleware/auth';
import { handleApiError, sendSuccess, sendCreated, validateSazonalidade, isValidUUID, ApiException } from '../utils/api-helpers';
const router = express.Router();
// =====================================================
// GET /api/calendario - Listar eventos do calendário
// =====================================================
router.get('/', requireAuth(), async (req, res) => {
    try {
        if (!req.user || !req.supabase) {
            throw new ApiException('Usuário não autenticado', 'UNAUTHORIZED', 401);
        }
        // Parse query parameters
        const filters = {
            limit: parseInt(req.query.limit || '50'),
            offset: parseInt(req.query.offset || '0')
        };
        // Add optional filters only if they exist
        if (req.query.categoria_pet) {
            filters.categoria_pet = req.query.categoria_pet;
        }
        if (req.query.mes) {
            filters.mes = req.query.mes;
        }
        if (req.query.prioridade) {
            filters.prioridade = req.query.prioridade;
        }
        if (req.query.tags) {
            filters.tags = req.query.tags.split(',');
        }
        // Build query
        let query = req.supabase
            .from('calendario_sazonalidades')
            .select(`
        id,
        evento,
        data_inicio,
        data_fim,
        categoria_pet,
        prioridade,
        campanhas_sugeridas,
        notificacao_antecedencia,
        tags,
        status,
        created_at
      `)
            .eq('user_id', req.user.id)
            .eq('status', 'ativo')
            .order('data_inicio', { ascending: true });
        // Apply filters
        if (filters.categoria_pet) {
            query = query.eq('categoria_pet', filters.categoria_pet);
        }
        if (filters.prioridade) {
            query = query.eq('prioridade', filters.prioridade);
        }
        if (filters.mes) {
            const startOfMonth = `${filters.mes}-01`;
            const endOfMonth = `${filters.mes}-31`;
            query = query
                .gte('data_inicio', startOfMonth)
                .lte('data_inicio', endOfMonth);
        }
        if (filters.tags && filters.tags.length > 0) {
            // PostgreSQL JSON contains any of the tags
            const tagsCondition = filters.tags.map(tag => `"${tag}"`).join(',');
            query = query.overlaps('tags', `[${tagsCondition}]`);
        }
        // Apply pagination
        if (filters.limit && filters.limit > 0) {
            query = query.range(filters.offset || 0, (filters.offset || 0) + filters.limit - 1);
        }
        const { data, error } = await query;
        if (error)
            throw error;
        sendSuccess(res, {
            data: data || [],
            total: data?.length || 0,
            filters,
            pagination: {
                limit: filters.limit,
                offset: filters.offset,
                hasMore: (data?.length || 0) === filters.limit
            }
        });
    }
    catch (error) {
        handleApiError(error, 'GET_Calendario', res);
    }
});
// =====================================================
// POST /api/calendario - Criar novo evento
// =====================================================
router.post('/', requireAuth(), async (req, res) => {
    try {
        if (!req.user || !req.supabase) {
            throw new ApiException('Usuário não autenticado', 'UNAUTHORIZED', 401);
        }
        // Validação dos dados
        const errors = validateSazonalidade(req.body);
        if (errors.length > 0) {
            throw new ApiException('Dados inválidos', 'VALIDATION_ERROR', 400, errors);
        }
        // Preparar dados para inserção
        const insertData = {
            user_id: req.user.id,
            evento: req.body.evento,
            data_inicio: req.body.data_inicio,
            data_fim: req.body.data_fim || null,
            categoria_pet: req.body.categoria_pet || null,
            prioridade: req.body.prioridade || 'media',
            campanhas_sugeridas: req.body.campanhas_sugeridas || [],
            notificacao_antecedencia: req.body.notificacao_antecedencia || 7,
            tags: req.body.tags || [],
            status: 'ativo'
        };
        const { data, error } = await req.supabase
            .from('calendario_sazonalidades')
            .insert(insertData)
            .select(`
        id,
        evento,
        data_inicio,
        data_fim,
        categoria_pet,
        prioridade,
        campanhas_sugeridas,
        notificacao_antecedencia,
        tags,
        status,
        created_at
      `)
            .single();
        if (error)
            throw error;
        sendCreated(res, data, 'Evento de sazonalidade criado com sucesso');
    }
    catch (error) {
        handleApiError(error, 'POST_Calendario', res);
    }
});
// =====================================================
// GET /api/calendario/:id - Buscar evento por ID
// =====================================================
router.get('/:id', requireAuth(), async (req, res) => {
    try {
        if (!req.user || !req.supabase) {
            throw new ApiException('Usuário não autenticado', 'UNAUTHORIZED', 401);
        }
        const { id } = req.params;
        // Validação do UUID
        if (!isValidUUID(id)) {
            throw new ApiException('ID inválido', 'INVALID_UUID', 400);
        }
        const { data, error } = await req.supabase
            .from('calendario_sazonalidades')
            .select(`
        id,
        evento,
        data_inicio,
        data_fim,
        categoria_pet,
        prioridade,
        campanhas_sugeridas,
        notificacao_antecedencia,
        tags,
        status,
        created_at,
        updated_at
      `)
            .eq('id', id)
            .eq('user_id', req.user.id)
            .single();
        if (error) {
            if (error.code === 'PGRST116') { // No rows returned
                throw new ApiException('Evento não encontrado', 'NOT_FOUND', 404);
            }
            throw error;
        }
        sendSuccess(res, data);
    }
    catch (error) {
        handleApiError(error, 'GET_CalendarioById', res);
    }
});
// =====================================================
// PUT /api/calendario/:id - Atualizar evento existente
// =====================================================
router.put('/:id', requireAuth(), async (req, res) => {
    try {
        if (!req.user || !req.supabase) {
            throw new ApiException('Usuário não autenticado', 'UNAUTHORIZED', 401);
        }
        const { id } = req.params;
        // Validação do UUID
        if (!isValidUUID(id)) {
            throw new ApiException('ID inválido', 'INVALID_UUID', 400);
        }
        // Validação dos dados
        const errors = validateSazonalidade(req.body);
        if (errors.length > 0) {
            throw new ApiException('Dados inválidos', 'VALIDATION_ERROR', 400, errors);
        }
        // Verificar se o evento existe e pertence ao usuário
        const { data: existingEvent } = await req.supabase
            .from('calendario_sazonalidades')
            .select('id')
            .eq('id', id)
            .eq('user_id', req.user.id)
            .single();
        if (!existingEvent) {
            throw new ApiException('Evento não encontrado', 'NOT_FOUND', 404);
        }
        // Preparar dados para atualização
        const updateData = {
            evento: req.body.evento,
            data_inicio: req.body.data_inicio,
            data_fim: req.body.data_fim || null,
            categoria_pet: req.body.categoria_pet || null,
            prioridade: req.body.prioridade || 'media',
            campanhas_sugeridas: req.body.campanhas_sugeridas || [],
            notificacao_antecedencia: req.body.notificacao_antecedencia || 7,
            tags: req.body.tags || [],
            updated_at: new Date().toISOString()
        };
        const { data, error } = await req.supabase
            .from('calendario_sazonalidades')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select(`
        id,
        evento,
        data_inicio,
        data_fim,
        categoria_pet,
        prioridade,
        campanhas_sugeridas,
        notificacao_antecedencia,
        tags,
        status,
        created_at,
        updated_at
      `)
            .single();
        if (error)
            throw error;
        sendSuccess(res, data, 'Evento atualizado com sucesso');
    }
    catch (error) {
        handleApiError(error, 'PUT_Calendario', res);
    }
});
// =====================================================
// DELETE /api/calendario/:id - Remover evento (soft delete)
// =====================================================
router.delete('/:id', requireAuth(), async (req, res) => {
    try {
        if (!req.user || !req.supabase) {
            throw new ApiException('Usuário não autenticado', 'UNAUTHORIZED', 401);
        }
        const { id } = req.params;
        // Validação do UUID
        if (!isValidUUID(id)) {
            throw new ApiException('ID inválido', 'INVALID_UUID', 400);
        }
        // Verificar se o evento existe e pertence ao usuário
        const { data: existingEvent } = await req.supabase
            .from('calendario_sazonalidades')
            .select('id, evento')
            .eq('id', id)
            .eq('user_id', req.user.id)
            .single();
        if (!existingEvent) {
            throw new ApiException('Evento não encontrado', 'NOT_FOUND', 404);
        }
        // Realizar soft delete (alterar status para 'inativo')
        const { data, error } = await req.supabase
            .from('calendario_sazonalidades')
            .update({
            status: 'inativo',
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select('id, evento')
            .single();
        if (error)
            throw error;
        sendSuccess(res, data, 'Evento removido com sucesso');
    }
    catch (error) {
        handleApiError(error, 'DELETE_Calendario', res);
    }
});
export default router;
//# sourceMappingURL=calendario.js.map