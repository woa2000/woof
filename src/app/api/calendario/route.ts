import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// =====================================================
// CONFIGURAÇÃO SUPABASE
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

// =====================================================
// UTILITÁRIOS DE AUTENTICAÇÃO E VALIDAÇÃO
// =====================================================

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

// =====================================================
// INTERFACES TYPESCRIPT
// =====================================================

export interface CalendarioFilters {
  categoria_pet?: string;
  mes?: string; // YYYY-MM
  prioridade?: 'baixa' | 'media' | 'alta';
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface CreateSazonalidadeRequest {
  evento: string;
  data_inicio: string;
  data_fim?: string;
  categoria_pet?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  campanhas_sugeridas?: any[];
  tags?: string[];
  notificacao_antecedencia?: number;
}

export interface SazonalidadeResponse {
  id: string;
  evento: string;
  data_inicio: string;
  data_fim?: string;
  categoria_pet?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  campanhas_sugeridas: any[];
  notificacao_antecedencia: number;
  tags: string[];
  status: string;
  created_at: string;
}

// =====================================================
// API ROUTES - GET /api/calendario
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createSupabaseServerClient();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const filters: CalendarioFilters = {
      categoria_pet: searchParams.get('categoria_pet') || undefined,
      mes: searchParams.get('mes') || undefined,
      prioridade: (searchParams.get('prioridade') as 'baixa' | 'media' | 'alta') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0')
    };
    
    // Build query
    let query = supabase
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
      .eq('user_id', user.id)
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
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({
      data: data || [],
      total: data?.length || 0,
      filters,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        hasMore: (data?.length || 0) === filters.limit
      },
      success: true
    });
    
  } catch (error) {
    return handleApiError(error, 'GET_Calendario');
  }
}

// =====================================================
// API ROUTES - POST /api/calendario  
// =====================================================

export async function POST(request: NextRequest) {
  try {
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
    
    // Preparar dados para inserção
    const insertData = {
      user_id: user.id,
      evento: body.evento,
      data_inicio: body.data_inicio,
      data_fim: body.data_fim || null,
      categoria_pet: body.categoria_pet || null,
      prioridade: body.prioridade || 'media',
      campanhas_sugeridas: body.campanhas_sugeridas || [],
      notificacao_antecedencia: body.notificacao_antecedencia || 7,
      tags: body.tags || [],
      status: 'ativo'
    };
    
    const { data, error } = await supabase
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
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      success: true,
      message: 'Evento de sazonalidade criado com sucesso'
    }, { status: 201 });
    
  } catch (error) {
    return handleApiError(error, 'POST_Calendario');
  }
}