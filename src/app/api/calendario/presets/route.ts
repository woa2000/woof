import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// =====================================================
// CONFIGURAÇÃO E UTILITÁRIOS
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
// BASE DE CONHECIMENTO VETERINÁRIO BRASILEIRO
// =====================================================

interface EventoPreset {
  id: string;
  nome: string;
  categoria: 'vacinacao' | 'doenca_sazonal' | 'campanha_preventiva' | 'data_comemorativa' | 'procedimento_sazonal';
  data_inicio: string; // MM-DD format
  data_fim?: string; // MM-DD format
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  tags: string[];
  regioes_aplicaveis: string[];
  especies_aplicaveis: string[];
  campanhas_sugeridas: {
    tipo_conteudo: string;
    titulo_sugerido: string;
    hashtags: string[];
    cta: string;
  }[];
}

const EVENTOS_VETERINARIOS_PRESETS: EventoPreset[] = [
  {
    id: 'preset-vac-001',
    nome: 'Campanha de Vacinação Antirrábica',
    categoria: 'vacinacao',
    data_inicio: '08-01',
    data_fim: '09-30',
    descricao: 'Campanha nacional de vacinação antirrábica, obrigatória e gratuita em muitos municípios',
    prioridade: 'alta',
    tags: ['vacinacao', 'raiva', 'saude_publica', 'prevencao', 'campanha_nacional'],
    regioes_aplicaveis: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    especies_aplicaveis: ['caes', 'gatos'],
    campanhas_sugeridas: [
      {
        tipo_conteudo: 'carrossel educativo',
        titulo_sugerido: 'Vacinação Antirrábica: Proteja seu pet e sua família',
        hashtags: ['#vacinacaoantirabica', '#prevencao', '#saudepublica', '#vacinacao'],
        cta: 'Encontre o posto de vacinação mais próximo'
      },
      {
        tipo_conteudo: 'stories lembrete',
        titulo_sugerido: '⚠️ LEMBRETE: Vacinação Antirrábica',
        hashtags: ['#vacinacao', '#lembrete', '#antirabica'],
        cta: 'Agende já a vacinação do seu pet'
      }
    ]
  },
  {
    id: 'preset-saz-001',
    nome: 'Temporada de Carrapatos e Pulgas',
    categoria: 'doenca_sazonal',
    data_inicio: '10-01',
    data_fim: '03-31',
    descricao: 'Período de maior proliferação de ectoparasitas devido ao calor e umidade do verão',
    prioridade: 'alta',
    tags: ['carrapatos', 'pulgas', 'ectoparasitas', 'verao', 'prevencao'],
    regioes_aplicaveis: ['sudeste', 'centro_oeste', 'sul'],
    especies_aplicaveis: ['caes', 'gatos'],
    campanhas_sugeridas: [
      {
        tipo_conteudo: 'post educativo',
        titulo_sugerido: 'Verão chegando: como proteger seu pet de carrapatos e pulgas',
        hashtags: ['#carrapatos', '#pulgas', '#verao', '#protecao', '#antiparasitarios'],
        cta: 'Conheça nossos tratamentos preventivos'
      }
    ]
  },
  {
    id: 'preset-saz-002',
    nome: 'Gripe Canina - Temporada Fria',
    categoria: 'doenca_sazonal',
    data_inicio: '05-01',
    data_fim: '08-31',
    descricao: 'Aumento de casos de gripe canina e problemas respiratórios durante o inverno',
    prioridade: 'alta',
    tags: ['gripe_canina', 'inverno', 'respiratorio', 'tosse_canis', 'frio'],
    regioes_aplicaveis: ['sudeste', 'sul'],
    especies_aplicaveis: ['caes'],
    campanhas_sugeridas: [
      {
        tipo_conteudo: 'carrossel sintomas',
        titulo_sugerido: 'Gripe Canina: sinais de alerta que todo tutor deve conhecer',
        hashtags: ['#gripecanina', '#sintomasalerta', '#inverno', '#tosse'],
        cta: 'Consulte sintomas respiratórios imediatamente'
      }
    ]
  },
  {
    id: 'preset-cam-001',
    nome: 'Janeiro Roxo - Conscientização Hanseníase',
    categoria: 'campanha_preventiva',
    data_inicio: '01-01',
    data_fim: '01-31',
    descricao: 'Campanha de conscientização sobre hanseníase e outras zoonoses',
    prioridade: 'media',
    tags: ['janeiro_roxo', 'zoonoses', 'consciencia', 'saude_publica', 'hanseniase'],
    regioes_aplicaveis: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    especies_aplicaveis: ['caes', 'gatos'],
    campanhas_sugeridas: [
      {
        tipo_conteudo: 'post conscientizacao',
        titulo_sugerido: 'Janeiro Roxo: a importância da prevenção de zoonoses',
        hashtags: ['#janeiroRoxo', '#zoonoses', '#consciencia', '#prevencao'],
        cta: 'Saiba mais sobre prevenção de zoonoses'
      }
    ]
  },
  {
    id: 'preset-dat-001',
    nome: 'Dia do Médico Veterinário',
    categoria: 'data_comemorativa',
    data_inicio: '09-09',
    descricao: 'Dia nacional do médico veterinário - oportunidade para valorizar a profissão',
    prioridade: 'alta',
    tags: ['dia_veterinario', 'profissao', 'homenagem', 'medicina_veterinaria'],
    regioes_aplicaveis: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    especies_aplicaveis: ['caes', 'gatos', 'aves', 'exoticos'],
    campanhas_sugeridas: [
      {
        tipo_conteudo: 'post homenagem',
        titulo_sugerido: 'Feliz Dia do Médico Veterinário! 🎉',
        hashtags: ['#DiaDoVeterinario', '#veterinario', '#homenagem', '#profissao'],
        cta: 'Conheça nossa equipe de veterinários'
      }
    ]
  },
  {
    id: 'preset-dat-002',
    nome: 'Dia Mundial dos Animais',
    categoria: 'data_comemorativa',
    data_inicio: '10-04',
    descricao: 'Data internacional de conscientização sobre direitos e bem-estar animal',
    prioridade: 'alta',
    tags: ['dia_mundial_animais', 'bem_estar', 'direitos_animais', 'consciencia'],
    regioes_aplicaveis: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    especies_aplicaveis: ['caes', 'gatos', 'aves', 'exoticos'],
    campanhas_sugeridas: [
      {
        tipo_conteudo: 'post conscientizacao',
        titulo_sugerido: 'Dia Mundial dos Animais: celebrando o amor e o respeito',
        hashtags: ['#DiaMundialDosAnimais', '#bemestaranimal', '#amorpet', '#respeito'],
        cta: 'Apoie o bem-estar animal'
      }
    ]
  },
  {
    id: 'preset-pro-001',
    nome: 'Castração Pré-Cio - Temporada Reprodutiva',
    categoria: 'procedimento_sazonal',
    data_inicio: '07-01',
    data_fim: '09-30',
    descricao: 'Período ideal para campanhas de castração antes da temporada reprodutiva',
    prioridade: 'alta',
    tags: ['castracao', 'controle_populacional', 'reproducao', 'prevencao'],
    regioes_aplicaveis: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    especies_aplicaveis: ['caes', 'gatos'],
    campanhas_sugeridas: [
      {
        tipo_conteudo: 'carrossel beneficios',
        titulo_sugerido: 'Castração: todos os benefícios para seu pet',
        hashtags: ['#castracao', '#beneficios', '#saude', '#prevencao'],
        cta: 'Agende a castração do seu pet'
      }
    ]
  },
  {
    id: 'preset-saz-003',
    nome: 'Temporada Leishmaniose - Nordeste',
    categoria: 'doenca_sazonal',
    data_inicio: '04-01',
    data_fim: '10-31',
    descricao: 'Período de maior incidência de leishmaniose visceral no nordeste brasileiro',
    prioridade: 'alta',
    tags: ['leishmaniose', 'mosquito_palha', 'zoonose', 'nordeste', 'prevencao'],
    regioes_aplicaveis: ['nordeste', 'norte'],
    especies_aplicaveis: ['caes'],
    campanhas_sugeridas: [
      {
        tipo_conteudo: 'post alerta',
        titulo_sugerido: 'Alerta Leishmaniose: proteja seu cão no Nordeste',
        hashtags: ['#leishmaniose', '#alerta', '#nordeste', '#protecao'],
        cta: 'Teste seu pet e use repelentes adequados'
      }
    ]
  },
  {
    id: 'preset-cam-002',
    nome: 'Setembro Amarelo Pet - Saúde Mental',
    categoria: 'campanha_preventiva',
    data_inicio: '09-01',
    data_fim: '09-30',
    descricao: 'Conscientização sobre a importância dos pets na saúde mental dos tutores',
    prioridade: 'alta',
    tags: ['setembro_amarelo', 'saude_mental', 'pet_terapia', 'bem_estar'],
    regioes_aplicaveis: ['norte', 'nordeste', 'centro_oeste', 'sudeste', 'sul'],
    especies_aplicaveis: ['caes', 'gatos'],
    campanhas_sugeridas: [
      {
        tipo_conteudo: 'post depoimento',
        titulo_sugerido: 'Setembro Amarelo: como os pets ajudam na saúde mental',
        hashtags: ['#SetembroAmarelo', '#saudemental', '#petterapia', '#bemestar'],
        cta: 'Compartilhe sua história com seu pet'
      }
    ]
  }
];

// =====================================================
// GET /api/calendario/presets - Eventos pré-cadastrados
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');
    const regiao = searchParams.get('regiao') || 'sudeste';
    const mes = searchParams.get('mes'); // 1-12
    
    let eventosFiltered = EVENTOS_VETERINARIOS_PRESETS;
    
    // Filtrar por categoria
    if (categoria) {
      eventosFiltered = eventosFiltered.filter(evento => evento.categoria === categoria);
    }
    
    // Filtrar por região
    eventosFiltered = eventosFiltered.filter(evento => 
      evento.regioes_aplicaveis.includes(regiao)
    );
    
    // Filtrar por mês
    if (mes) {
      const mesNum = parseInt(mes);
      if (mesNum >= 1 && mesNum <= 12) {
        eventosFiltered = eventosFiltered.filter(evento => {
          const [mesInicio] = evento.data_inicio.split('-').map(Number);
          const mesInicioEvento = mesInicio;
          
          // Se tem data fim, verificar se o mês está no período
          if (evento.data_fim) {
            const [mesFim] = evento.data_fim.split('-').map(Number);
            const mesFimEvento = mesFim;
            
            // Lidar com períodos que cruzam o ano (ex: out-mar)
            if (mesFimEvento < mesInicioEvento) {
              return mesNum >= mesInicioEvento || mesNum <= mesFimEvento;
            } else {
              return mesNum >= mesInicioEvento && mesNum <= mesFimEvento;
            }
          } else {
            return mesNum === mesInicioEvento;
          }
        });
      }
    }
    
    // Adicionar informações do ano atual para as datas
    const anoAtual = new Date().getFullYear();
    const eventosComAno = eventosFiltered.map(evento => ({
      ...evento,
      data_inicio_completa: `${anoAtual}-${evento.data_inicio}`,
      data_fim_completa: evento.data_fim ? `${anoAtual}-${evento.data_fim}` : undefined,
      pode_ser_adicionado: true // Flag para indicar que pode ser adicionado ao calendário do usuário
    }));
    
    return NextResponse.json({
      data: eventosComAno,
      total: eventosComAno.length,
      filters: {
        categoria,
        regiao,
        mes
      },
      success: true
    });
    
  } catch (error) {
    return handleApiError(error, 'GET_CalendarioPresets');
  }
}

// =====================================================
// POST /api/calendario/presets - Adicionar preset ao calendário do usuário
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    
    const { preset_id, personalizacoes } = body;
    
    if (!preset_id) {
      return NextResponse.json(
        { error: 'preset_id é obrigatório' },
        { status: 400 }
      );
    }
    
    // Buscar o preset
    const preset = EVENTOS_VETERINARIOS_PRESETS.find(p => p.id === preset_id);
    if (!preset) {
      return NextResponse.json(
        { error: 'Preset não encontrado' },
        { status: 404 }
      );
    }
    
    const supabase = await createSupabaseServerClient();
    
    // Preparar dados com personalizações opcionais
    const anoAtual = new Date().getFullYear();
    const insertData = {
      user_id: user.id,
      evento: personalizacoes?.evento || preset.nome,
      data_inicio: `${anoAtual}-${preset.data_inicio}`,
      data_fim: preset.data_fim ? `${anoAtual}-${preset.data_fim}` : null,
      categoria_pet: preset.categoria,
      prioridade: personalizacoes?.prioridade || preset.prioridade,
      campanhas_sugeridas: preset.campanhas_sugeridas,
      notificacao_antecedencia: personalizacoes?.notificacao_antecedencia || 7,
      tags: personalizacoes?.tags || preset.tags,
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
      message: 'Evento preset adicionado ao seu calendário com sucesso'
    }, { status: 201 });
    
  } catch (error) {
    return handleApiError(error, 'POST_CalendarioPresets');
  }
}