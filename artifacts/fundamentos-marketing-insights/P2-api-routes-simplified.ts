// API ROUTES SIMPLIFICADAS PARA FUNDAMENTOS & INSIGHTS
// Gerado por: Backend_Developer durante Sprint 1-2  
// Data: 2025-08-24
// Versão: Simplificada sem Zod (será adicionado depois)

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// =====================================================
// CONFIGURAÇÃO SUPABASE
// =====================================================

function createSupabaseServerClient() {
  const cookieStore = cookies();
  
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
// UTILITÁRIOS DE AUTENTICAÇÃO
// =====================================================

export async function getAuthenticatedUser() {
  const supabase = createSupabaseServerClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.user) {
    throw new Error('Usuário não autenticado');
  }
  
  return session.user;
}

export function handleApiError(error: any, operation: string) {
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

// =====================================================
// VALIDADORES SIMPLES (SUBSTITUEM ZOD TEMPORARIAMENTE)
// =====================================================

function validatePilarEditorial(data: any) {
  const errors: string[] = [];
  
  if (!data.nome || typeof data.nome !== 'string' || data.nome.length === 0) {
    errors.push('Nome é obrigatório');
  }
  
  if (data.nome && data.nome.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  }
  
  if (data.status && !['ativo', 'inativo', 'arquivado'].includes(data.status)) {
    errors.push('Status deve ser: ativo, inativo ou arquivado');
  }
  
  return errors;
}

function validateMetaOKR(data: any) {
  const errors: string[] = [];
  
  if (!data.nome || typeof data.nome !== 'string' || data.nome.length === 0) {
    errors.push('Nome é obrigatório');
  }
  
  if (!data.tipo || !['awareness', 'leads', 'vendas', 'retencao'].includes(data.tipo)) {
    errors.push('Tipo deve ser: awareness, leads, vendas ou retencao');
  }
  
  return errors;
}

function validateSazonalidade(data: any) {
  const errors: string[] = [];
  
  if (!data.evento || typeof data.evento !== 'string' || data.evento.length === 0) {
    errors.push('Evento é obrigatório');
  }
  
  if (!data.data_inicio || !isValidDate(data.data_inicio)) {
    errors.push('Data de início é obrigatória e deve estar em formato válido');
  }
  
  return errors;
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// =====================================================
// API ROUTES - PILARES EDITORIAIS
// =====================================================

export async function GET_PilaresEditoriais(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('pilares_editoriais')
      .select(`
        id,
        nome,
        descricao,
        temas_mae,
        jornada_mapping,
        status,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .eq('status', 'ativo')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({
      data: data || [],
      total: data?.length || 0,
      success: true
    });
    
  } catch (error) {
    return handleApiError(error, 'GET_PilaresEditoriais');
  }
}

export async function POST_PilaresEditoriais(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    
    // Validação básica
    const errors = validatePilarEditorial(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: errors },
        { status: 400 }
      );
    }
    
    const supabase = createSupabaseServerClient();
    
    const insertData = {
      user_id: user.id,
      nome: body.nome,
      descricao: body.descricao || null,
      temas_mae: body.temas_mae || [],
      jornada_mapping: body.jornada_mapping || { tofu: [], mofu: [], bofu: [] },
      brand_voice_id: body.brand_voice_id || null,
      status: body.status || 'ativo'
    };
    
    const { data, error } = await supabase
      .from('pilares_editoriais')
      .insert(insertData)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      success: true,
      message: 'Pilar editorial criado com sucesso'
    }, { status: 201 });
    
  } catch (error) {
    return handleApiError(error, 'POST_PilaresEditoriais');
  }
}

// =====================================================
// API ROUTES - METAS E OKRS  
// =====================================================

export async function GET_MetasOKRs(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = createSupabaseServerClient();
    
    // Query parameters
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const canal = searchParams.get('canal');
    
    let query = supabase
      .from('metas_okrs')
      .select('*')
      .eq('user_id', user.id)
      .order('prazo_conclusao', { ascending: true });
    
    if (tipo) query = query.eq('tipo', tipo);
    if (canal) query = query.eq('canal', canal);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({
      data: data || [],
      total: data?.length || 0,
      filters: { tipo, canal },
      success: true
    });
    
  } catch (error) {
    return handleApiError(error, 'GET_MetasOKRs');
  }
}

export async function POST_MetasOKRs(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    
    // Validação básica
    const errors = validateMetaOKR(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: errors },
        { status: 400 }
      );
    }
    
    const supabase = createSupabaseServerClient();
    
    const insertData = {
      user_id: user.id,
      nome: body.nome,
      tipo: body.tipo,
      canal: body.canal || null,
      meta_numerica: body.meta_numerica || null,
      unidade_medida: body.unidade_medida || null,
      prazo_conclusao: body.prazo_conclusao || null,
      kpis: body.kpis || [],
      alertas_config: body.alertas_config || { threshold: 0.8, frequency: 'daily' }
    };
    
    const { data, error } = await supabase
      .from('metas_okrs')
      .insert(insertData)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      success: true,
      message: 'Meta/OKR criada com sucesso'
    }, { status: 201 });
    
  } catch (error) {
    return handleApiError(error, 'POST_MetasOKRs');
  }
}

// =====================================================
// API ROUTES - CALENDÁRIO DE SAZONALIDADES
// =====================================================

export async function GET_CalendarioSazonalidades(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = createSupabaseServerClient();
    
    const { searchParams } = new URL(request.url);
    const categoria_pet = searchParams.get('categoria_pet');
    const mes = searchParams.get('mes'); // formato: YYYY-MM
    
    let query = supabase
      .from('calendario_sazonalidades')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'ativo')
      .order('data_inicio', { ascending: true });
    
    if (categoria_pet) {
      query = query.eq('categoria_pet', categoria_pet);
    }
    
    if (mes) {
      const startOfMonth = `${mes}-01`;
      const endOfMonth = `${mes}-31`;
      query = query
        .gte('data_inicio', startOfMonth)
        .lte('data_inicio', endOfMonth);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({
      data: data || [],
      total: data?.length || 0,
      filters: { categoria_pet, mes },
      success: true
    });
    
  } catch (error) {
    return handleApiError(error, 'GET_CalendarioSazonalidades');
  }
}

export async function POST_CalendarioSazonalidades(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    
    // Validação básica
    const errors = validateSazonalidade(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: errors },
        { status: 400 }
      );
    }
    
    const supabase = createSupabaseServerClient();
    
    const insertData = {
      user_id: user.id,
      evento: body.evento,
      data_inicio: body.data_inicio,
      data_fim: body.data_fim || null,
      categoria_pet: body.categoria_pet || null,
      prioridade: body.prioridade || 'media',
      campanhas_sugeridas: body.campanhas_sugeridas || [],
      notificacao_antecedencia: body.notificacao_antecedencia || 7,
      tags: body.tags || []
    };
    
    const { data, error } = await supabase
      .from('calendario_sazonalidades')
      .insert(insertData)
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      success: true,
      message: 'Evento de sazonalidade criado com sucesso'
    }, { status: 201 });
    
  } catch (error) {
    return handleApiError(error, 'POST_CalendarioSazonalidades');
  }
}

// =====================================================
// API ROUTES - DASHBOARD DE INSIGHTS
// =====================================================

export async function GET_DashboardInsights(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = createSupabaseServerClient();
    
    // Agregações para dashboard
    const [
      pilaresResult,
      metasResult,
      eventosResult
    ] = await Promise.all([
      supabase
        .from('pilares_editoriais')
        .select('id, status')
        .eq('user_id', user.id),
      
      supabase
        .from('metas_okrs')
        .select('tipo, progresso_atual, status')
        .eq('user_id', user.id),
      
      supabase
        .from('calendario_sazonalidades')
        .select('evento, data_inicio, prioridade, categoria_pet')
        .eq('user_id', user.id)
        .gte('data_inicio', new Date().toISOString().split('T')[0])
        .order('data_inicio', { ascending: true })
        .limit(5)
    ]);
    
    const pilares = pilaresResult.data || [];
    const metas = metasResult.data || [];
    const eventos = eventosResult.data || [];
    
    // Calcular insights
    const pilaresAtivos = pilares.filter(p => p.status === 'ativo').length;
    const metasAtivas = metas.filter(m => m.status === 'ativo');
    const progressoMedio = metasAtivas.length > 0 
      ? metasAtivas.reduce((acc, meta) => acc + (meta.progresso_atual || 0), 0) / metasAtivas.length
      : 0;
    
    const insights = {
      pilares_editoriais: {
        total_ativos: pilaresAtivos,
        total_geral: pilares.length
      },
      metas_okrs: {
        total_ativas: metasAtivas.length,
        progresso_medio: Math.round(progressoMedio * 100) / 100
      },
      eventos_proximos: eventos,
      resumo: {
        total_eventos_proximos: eventos.length,
        categorias_eventos: [...new Set(eventos.map(e => e.categoria_pet).filter(Boolean))]
      }
    };
    
    return NextResponse.json({
      data: insights,
      success: true,
      generated_at: new Date().toISOString()
    });
    
  } catch (error) {
    return handleApiError(error, 'GET_DashboardInsights');
  }
}

// =====================================================
// TIPOS TYPESCRIPT PARA FRONTEND
// =====================================================

export interface PilarEditorialResponse {
  id: string;
  nome: string;
  descricao?: string;
  temas_mae: string[];
  jornada_mapping: {
    tofu: string[];
    mofu: string[];
    bofu: string[];
  };
  status: 'ativo' | 'inativo' | 'arquivado';
  created_at: string;
  updated_at: string;
}

export interface MetaOKRResponse {
  id: string;
  nome: string;
  tipo: 'awareness' | 'leads' | 'vendas' | 'retencao';
  canal?: string;
  meta_numerica?: number;
  unidade_medida?: string;
  prazo_conclusao?: string;
  progresso_atual: number;
  status: string;
  created_at: string;
}

export interface SazonalidadeResponse {
  id: string;
  evento: string;
  data_inicio: string;
  data_fim?: string;
  categoria_pet?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  campanhas_sugeridas: any[];
  tags: string[];
  created_at: string;
}

export interface DashboardInsights {
  pilares_editoriais: {
    total_ativos: number;
    total_geral: number;
  };
  metas_okrs: {
    total_ativas: number;
    progresso_medio: number;
  };
  eventos_proximos: SazonalidadeResponse[];
  resumo: {
    total_eventos_proximos: number;
    categorias_eventos: string[];
  };
}