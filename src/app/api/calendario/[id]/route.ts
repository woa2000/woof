import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// =====================================================
// CONFIGURAÇÃO E UTILITÁRIOS (REUTILIZADOS)
// =====================================================

async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}

async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.user) {
    throw new Error('Usuário não autenticado');
  }
  
  return session.user;
}

function handleApiError(error: any, operation: string) {
  console.error(`[API Error - ${operation}]:`, error);
  
  if (error.message === 'Usuário não autenticado') {
    return NextResponse.json(
      { error: 'Acesso negado', code: 'UNAUTHORIZED' }, 
      { status: 401 }
    );
  }
  
  if (error.message === 'Evento não encontrado') {
    return NextResponse.json(
      { error: 'Recurso não encontrado', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(
    { 
      error: 'Erro interno do servidor', 
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, 
    { status: 500 }
  );
}

function validateSazonalidade(data: any): string[] {
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

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// =====================================================
// GET /api/calendario/[id] - Buscar evento por ID
// =====================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validação do UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID inválido', code: 'INVALID_UUID' },
        { status: 400 }
      );
    }
    
    const user = await getAuthenticatedUser();
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
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
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        throw new Error('Evento não encontrado');
      }
      throw error;
    }
    
    return NextResponse.json({
      data,
      success: true
    });
    
  } catch (error) {
    return handleApiError(error, 'GET_CalendarioById');
  }
}

// =====================================================
// PUT /api/calendario/[id] - Atualizar evento existente
// =====================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validação do UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID inválido', code: 'INVALID_UUID' },
        { status: 400 }
      );
    }
    
    const user = await getAuthenticatedUser();
    const body = await request.json();
    
    // Validação dos dados
    const errors = validateSazonalidade(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: errors },
        { status: 400 }
      );
    }
    
    const supabase = await createSupabaseServerClient();
    
    // Verificar se o evento existe e pertence ao usuário
    const { data: existingEvent } = await supabase
      .from('calendario_sazonalidades')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (!existingEvent) {
      throw new Error('Evento não encontrado');
    }
    
    // Preparar dados para atualização
    const updateData = {
      evento: body.evento,
      data_inicio: body.data_inicio,
      data_fim: body.data_fim || null,
      categoria_pet: body.categoria_pet || null,
      prioridade: body.prioridade || 'media',
      campanhas_sugeridas: body.campanhas_sugeridas || [],
      notificacao_antecedencia: body.notificacao_antecedencia || 7,
      tags: body.tags || [],
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('calendario_sazonalidades')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
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
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      success: true,
      message: 'Evento atualizado com sucesso'
    });
    
  } catch (error) {
    return handleApiError(error, 'PUT_Calendario');
  }
}

// =====================================================
// DELETE /api/calendario/[id] - Remover evento (soft delete)
// =====================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validação do UUID
    if (!isValidUUID(id)) {
      return NextResponse.json(
        { error: 'ID inválido', code: 'INVALID_UUID' },
        { status: 400 }
      );
    }
    
    const user = await getAuthenticatedUser();
    const supabase = await createSupabaseServerClient();
    
    // Verificar se o evento existe e pertence ao usuário
    const { data: existingEvent } = await supabase
      .from('calendario_sazonalidades')
      .select('id, evento')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (!existingEvent) {
      throw new Error('Evento não encontrado');
    }
    
    // Realizar soft delete (alterar status para 'inativo')
    const { data, error } = await supabase
      .from('calendario_sazonalidades')
      .update({ 
        status: 'inativo',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, evento')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      success: true,
      message: 'Evento removido com sucesso'
    });
    
  } catch (error) {
    return handleApiError(error, 'DELETE_Calendario');
  }
}