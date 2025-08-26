// API ROUTES PARA FUNDAMENTOS & INSIGHTS - AGÊNCIA PET IA
// Gerado por: Backend_Developer durante Sprint 1-2
// Data: 2025-08-24
// Fonte: @agents/Backend_Developer.md + Schema Database

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// =====================================================
// SCHEMAS DE VALIDAÇÃO ZOD
// =====================================================

// Schema para Pilares Editoriais
export const pilarEditorialSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100),
  descricao: z.string().optional(),
  temas_mae: z.array(z.string()).default([]),
  jornada_mapping: z.object({
    tofu: z.array(z.string()).default([]),
    mofu: z.array(z.string()).default([]),
    bofu: z.array(z.string()).default([])
  }).default({tofu: [], mofu: [], bofu: []}),
  brand_voice_id: z.string().uuid().optional(),
  status: z.enum(['ativo', 'inativo', 'arquivado']).default('ativo')
});

// Schema para Metas e OKRs
export const metaOkrSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100),
  tipo: z.enum(['awareness', 'leads', 'vendas', 'retencao']),
  canal: z.string().max(50).optional(),
  meta_numerica: z.number().positive().optional(),
  unidade_medida: z.string().max(20).optional(),
  prazo_conclusao: z.string().date().optional(),
  kpis: z.array(z.any()).default([]),
  alertas_config: z.object({
    threshold: z.number().min(0).max(1).default(0.8),
    frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily')
  }).default({threshold: 0.8, frequency: 'daily'})
});

// Schema para Calendário de Sazonalidades
export const sazonalidadeSchema = z.object({
  evento: z.string().min(1, 'Evento é obrigatório').max(150),
  data_inicio: z.string().date(),
  data_fim: z.string().date().optional(),
  categoria_pet: z.string().max(50).optional(),
  prioridade: z.enum(['baixa', 'media', 'alta']).default('media'),
  campanhas_sugeridas: z.array(z.any()).default([]),
  notificacao_antecedencia: z.number().int().positive().default(7),
  tags: z.array(z.string()).default([])
});

// Schema para SEO Keywords
export const seoKeywordSchema = z.object({
  keyword_principal: z.string().min(1, 'Keyword é obrigatória').max(150),
  categoria_pet: z.string().max(50).optional(),
  volume_busca: z.number().int().positive().optional(),
  dificuldade_seo: z.number().min(0).max(1).optional(),
  intencao_busca: z.enum(['informacional', 'comercial', 'navegacional', 'transacional']).optional(),
  cluster_topicos: z.array(z.string()).default([]),
  keywords_relacionadas: z.array(z.string()).default([]),
  competidores: z.array(z.any()).default([]),
  oportunidade_score: z.number().min(0).max(1).optional()
});

// =====================================================
// UTILITÁRIOS DE AUTENTICAÇÃO
// =====================================================

export async function getAuthenticatedUser() {
  const supabase = createServerComponentClient({ cookies });
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
    { error: 'Erro interno do servidor', code: 'INTERNAL_ERROR' }, 
    { status: 500 }
  );
}

// =====================================================
// API ROUTES - PILARES EDITORIAIS
// =====================================================

export async function GET_PilaresEditoriais(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = createServerComponentClient({ cookies });
    
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
        updated_at,
        brand_manuals!inner(id, title)
      `)
      .eq('user_id', user.id)
      .eq('status', 'ativo')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
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
    
    // Validação Zod
    const validatedData = pilarEditorialSchema.parse(body);
    
    const supabase = createServerComponentClient({ cookies });
    
    const { data, error } = await supabase
      .from('pilares_editoriais')
      .insert({
        user_id: user.id,
        ...validatedData
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      success: true,
      message: 'Pilar editorial criado com sucesso'
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return handleApiError(error, 'POST_PilaresEditoriais');
  }
}

// =====================================================
// API ROUTES - METAS E OKRS
// =====================================================

export async function GET_MetasOKRs(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = createServerComponentClient({ cookies });
    
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
      data,
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
    
    const validatedData = metaOkrSchema.parse(body);
    
    const supabase = createServerComponentClient({ cookies });
    
    const { data, error } = await supabase
      .from('metas_okrs')
      .insert({
        user_id: user.id,
        ...validatedData
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      success: true,
      message: 'Meta/OKR criada com sucesso'
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return handleApiError(error, 'POST_MetasOKRs');
  }
}

// =====================================================
// API ROUTES - CALENDÁRIO DE SAZONALIDADES
// =====================================================

export async function GET_CalendarioSazonalidades(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = createServerComponentClient({ cookies });
    
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
      data,
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
    
    const validatedData = sazonalidadeSchema.parse(body);
    
    const supabase = createServerComponentClient({ cookies });
    
    const { data, error } = await supabase
      .from('calendario_sazonalidades')
      .insert({
        user_id: user.id,
        ...validatedData
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      success: true,
      message: 'Evento de sazonalidade criado com sucesso'
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return handleApiError(error, 'POST_CalendarioSazonalidades');
  }
}

// =====================================================
// API ROUTES - SEO KEYWORDS
// =====================================================

export async function GET_SeoKeywords(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = createServerComponentClient({ cookies });
    
    const { searchParams } = new URL(request.url);
    const categoria_pet = searchParams.get('categoria_pet');
    const ordenacao = searchParams.get('sort') || 'oportunidade_score'; // oportunidade_score, volume_busca, dificuldade_seo
    const limite = parseInt(searchParams.get('limit') || '50');
    
    let query = supabase
      .from('seo_keywords')
      .select('*')
      .eq('user_id', user.id)
      .limit(limite);
    
    if (categoria_pet) {
      query = query.eq('categoria_pet', categoria_pet);
    }
    
    // Ordenação
    if (ordenacao === 'oportunidade_score') {
      query = query.order('oportunidade_score', { ascending: false, nullsLast: true });
    } else if (ordenacao === 'volume_busca') {
      query = query.order('volume_busca', { ascending: false, nullsLast: true });
    } else if (ordenacao === 'dificuldade_seo') {
      query = query.order('dificuldade_seo', { ascending: true, nullsLast: true });
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      total: data?.length || 0,
      filters: { categoria_pet, ordenacao, limite },
      success: true
    });
    
  } catch (error) {
    return handleApiError(error, 'GET_SeoKeywords');
  }
}

export async function POST_SeoKeywords(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    
    const validatedData = seoKeywordSchema.parse(body);
    
    const supabase = createServerComponentClient({ cookies });
    
    const { data, error } = await supabase
      .from('seo_keywords')
      .insert({
        user_id: user.id,
        ...validatedData
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({
      data,
      success: true,
      message: 'Keyword SEO adicionada com sucesso'
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    return handleApiError(error, 'POST_SeoKeywords');
  }
}

// =====================================================
// API ROUTES - ANALYTICS E DASHBOARDS
// =====================================================

export async function GET_DashboardInsights(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = createServerComponentClient({ cookies });
    
    // Agregações para dashboard
    const [
      pilaresAtivos,
      metasAtivas,
      eventosProximos,
      keywordsTop
    ] = await Promise.all([
      supabase
        .from('pilares_editoriais')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'ativo'),
      
      supabase
        .from('metas_okrs')
        .select('tipo, progresso_atual')
        .eq('user_id', user.id)
        .eq('status', 'ativo'),
      
      supabase
        .from('calendario_sazonalidades')
        .select('evento, data_inicio, prioridade')
        .eq('user_id', user.id)
        .gte('data_inicio', new Date().toISOString().split('T')[0])
        .order('data_inicio', { ascending: true })
        .limit(5),
      
      supabase
        .from('seo_keywords')
        .select('keyword_principal, oportunidade_score, volume_busca')
        .eq('user_id', user.id)
        .order('oportunidade_score', { ascending: false, nullsLast: true })
        .limit(10)
    ]);
    
    const insights = {
      pilares_editoriais: {
        total_ativos: pilaresAtivos.data?.length || 0
      },
      metas_okrs: {
        total_ativas: metasAtivas.data?.length || 0,
        progresso_medio: metasAtivas.data?.reduce((acc, meta) => 
          acc + (meta.progresso_atual || 0), 0) / (metasAtivas.data?.length || 1)
      },
      eventos_proximos: eventosProximos.data || [],
      keywords_oportunidade: keywordsTop.data || []
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
// MIDDLEWARE PARA RATE LIMITING (FUTURO)
// =====================================================

export function withRateLimit(handler: Function, limit: number = 100) {
  return async function (request: NextRequest) {
    // TODO: Implementar rate limiting baseado em IP/usuário
    // Para agora, apenas chama o handler
    return handler(request);
  };
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
  brand_manuals?: {
    id: string;
    title: string;
  };
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

export interface SeoKeywordResponse {
  id: string;
  keyword_principal: string;
  categoria_pet?: string;
  volume_busca?: number;
  dificuldade_seo?: number;
  oportunidade_score?: number;
  intencao_busca?: string;
  cluster_topicos: string[];
  keywords_relacionadas: string[];
  created_at: string;
}

// Export para uso em Next.js API Routes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};