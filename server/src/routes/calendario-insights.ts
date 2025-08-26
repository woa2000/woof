import express, { Request, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { 
  handleApiError, 
  sendSuccess,
  ApiException
} from '../utils/api-helpers';

const router = express.Router();

// =====================================================
// INTERFACES PARA INSIGHTS
// =====================================================

export interface CalendarioInsights {
  eventos_mes_atual: number;
  categoria_mais_ativa: string;
  proximos_eventos_criticos: any[];
  sugestoes_ia: {
    eventos_perdidos: string[];
    oportunidades_conteudo: any[];
  };
  metricas_gerais: {
    total_eventos_ativos: number;
    eventos_proximos_7_dias: number;
    eventos_proximos_30_dias: number;
    distribuicao_por_prioridade: Record<string, number>;
    distribuicao_por_categoria: Record<string, number>;
  };
  tendencias_sazonais: {
    periodo: string;
    total_eventos: number;
    principais_categorias: string[];
  }[];
}

// =====================================================
// GET /api/calendario/insights - Analytics do calendário
// =====================================================

router.get('/', requireAuth(), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.supabase) {
      throw new ApiException('Usuário não autenticado', 'UNAUTHORIZED', 401);
    }
    
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    const proximos7Dias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    const proximos30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Buscar todos os eventos ativos do usuário
    const { data: todosEventos, error: todosEventosError } = await req.supabase
      .from('calendario_sazonalidades')
      .select(`
        id,
        evento,
        data_inicio,
        data_fim,
        categoria_pet,
        prioridade,
        campanhas_sugeridas,
        tags,
        created_at
      `)
      .eq('user_id', req.user.id)
      .eq('status', 'ativo');
    
    if (todosEventosError) throw todosEventosError;
    
    // Eventos do mês atual
    const eventosMesAtual = (todosEventos || []).filter(evento => {
      const dataEvento = new Date(evento.data_inicio);
      return dataEvento >= inicioMes && dataEvento <= fimMes;
    });
    
    // Próximos eventos críticos (7 dias)
    const proximosEventosCriticos = (todosEventos || [])
      .filter(evento => {
        const dataEvento = new Date(evento.data_inicio);
        return dataEvento >= hoje && dataEvento <= proximos7Dias && 
               (evento.prioridade === 'alta' || evento.prioridade === 'critica');
      })
      .sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime())
      .slice(0, 5);
    
    // Eventos próximos (7 e 30 dias)
    const eventosProximos7Dias = (todosEventos || []).filter(evento => {
      const dataEvento = new Date(evento.data_inicio);
      return dataEvento >= hoje && dataEvento <= proximos7Dias;
    }).length;
    
    const eventosProximos30Dias = (todosEventos || []).filter(evento => {
      const dataEvento = new Date(evento.data_inicio);
      return dataEvento >= hoje && dataEvento <= proximos30Dias;
    }).length;
    
    // Distribuição por prioridade
    const distribuicaoPrioridade = (todosEventos || []).reduce((acc, evento) => {
      const prioridade = evento.prioridade || 'media';
      acc[prioridade] = (acc[prioridade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Distribuição por categoria
    const distribuicaoCategoria = (todosEventos || []).reduce((acc, evento) => {
      const categoria = evento.categoria_pet || 'outros';
      acc[categoria] = (acc[categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Categoria mais ativa
    const categoriaMaisAtiva = Object.entries(distribuicaoCategoria)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
    
    // Tendências sazonais (próximos 3 meses)
    const tendenciasSazonais = [];
    for (let i = 0; i < 3; i++) {
      const mesAnalise = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      const fimMesAnalise = new Date(hoje.getFullYear(), hoje.getMonth() + i + 1, 0);
      
      const eventosMes = (todosEventos || []).filter(evento => {
        const dataEvento = new Date(evento.data_inicio);
        return dataEvento >= mesAnalise && dataEvento <= fimMesAnalise;
      });
      
      const categoriasMes = eventosMes.reduce((acc, evento) => {
        const categoria = evento.categoria_pet || 'outros';
        acc[categoria] = (acc[categoria] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const principaisCategorias = Object.entries(categoriasMes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([categoria]) => categoria);
      
      tendenciasSazonais.push({
        periodo: mesAnalise.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        total_eventos: eventosMes.length,
        principais_categorias: principaisCategorias
      });
    }
    
    // Sugestões IA (simuladas com base na base de conhecimento veterinário)
    const eventosVeterinariosSugeridos = gerarSugestoesEventosVeterinarios(
      todosEventos || [],
      hoje.getMonth() + 1 // mês atual (1-12)
    );
    
    const oportunidadesConteudo = gerarOportunidadesConteudo(eventosMesAtual);
    
    // Montar resposta de insights
    const insights: CalendarioInsights = {
      eventos_mes_atual: eventosMesAtual.length,
      categoria_mais_ativa: categoriaMaisAtiva,
      proximos_eventos_criticos: proximosEventosCriticos,
      sugestoes_ia: {
        eventos_perdidos: eventosVeterinariosSugeridos,
        oportunidades_conteudo: oportunidadesConteudo
      },
      metricas_gerais: {
        total_eventos_ativos: (todosEventos || []).length,
        eventos_proximos_7_dias: eventosProximos7Dias,
        eventos_proximos_30_dias: eventosProximos30Dias,
        distribuicao_por_prioridade: distribuicaoPrioridade,
        distribuicao_por_categoria: distribuicaoCategoria
      },
      tendencias_sazonais: tendenciasSazonais
    };
    
    sendSuccess(res, insights, undefined);
    
  } catch (error) {
    handleApiError(error, 'GET_CalendarioInsights', res);
  }
});

// =====================================================
// FUNÇÕES AUXILIARES PARA IA E SUGESTÕES
// =====================================================

function gerarSugestoesEventosVeterinarios(eventosExistentes: any[], mesAtual: number): string[] {
  // Base de conhecimento veterinário brasileiro simplificada
  const eventosSazonaisBase: Record<number, string[]> = {
    1: ['Janeiro Roxo - Conscientização Hanseníase Animal', 'Campanha Hidratação Pet (Verão)'],
    2: ['Carnaval Pet - Cuidados Especiais', 'Pico de Intoxicações por Chocolate'],
    3: ['Campanha de Vacinação Anual', 'Mudança de Pelagem - Outono'],
    4: ['Dia Nacional dos Animais (14/04)', 'Temporada Leishmaniose (Nordeste)'],
    5: ['Mês das Mães Pet', 'Intensificação Gripe Canina (Inverno SE/S)'],
    6: ['Festa Junina Pet Safety', 'Pico Frio - Aquecimento Pet'],
    7: ['Férias Pet - Hotel/Creche', 'Pré-Temporada Castração'],
    8: ['Campanha Antirrábica Nacional', 'Semana do Aleitamento Animal'],
    9: ['Dia do Médico Veterinário (09/09)', 'Setembro Amarelo Pet (Saúde Mental)'],
    10: ['Dia Mundial dos Animais (04/10)', 'Outubro Rosa Pet (Prevenção Câncer)'],
    11: ['Novembro Azul Pet (Saúde Masculina)', 'Black Friday Pet Products'],
    12: ['Natal Pet Safety', 'Fogos de Artifício - Anti-Stress']
  };
  
  const eventosRecomendadosMes = eventosSazonaisBase[mesAtual] || [];
  const eventosExistentesNomes = eventosExistentes.map(e => e.evento.toLowerCase());
  
  // Filtrar eventos que ainda não foram criados
  const eventosPerdidos = eventosRecomendadosMes.filter(evento => {
    const eventoLower = evento.toLowerCase();
    return !eventosExistentesNomes.some(existente => 
      existente.includes(eventoLower.split(' ')[0]) || 
      eventoLower.includes(existente.split(' ')[0])
    );
  });
  
  return eventosPerdidos.slice(0, 3); // Máximo 3 sugestões
}

function gerarOportunidadesConteudo(eventosMes: any[]): any[] {
  return eventosMes.map(evento => ({
    evento_id: evento.id,
    evento_nome: evento.evento,
    tipo_conteudo_sugerido: inferirTipoConteudo(evento.categoria_pet),
    timing_otimo: calcularTimingOtimo(evento.data_inicio),
    hashtags_sugeridas: gerarHashtagsPorCategoria(evento.categoria_pet),
    call_to_action: gerarCTAPorCategoria(evento.categoria_pet)
  })).slice(0, 5); // Máximo 5 oportunidades
}

function inferirTipoConteudo(categoria?: string): string {
  const mapeamento: Record<string, string> = {
    'vacinacao': 'carrossel educativo + stories lembrete',
    'doenca_sazonal': 'post informativo + reel prevenção',
    'campanha_preventiva': 'stories conscientização + post engajamento',
    'data_comemorativa': 'post celebrativo + stories bastidores',
    'procedimento_sazonal': 'carrossel processo + depoimentos'
  };
  
  return mapeamento[categoria || ''] || 'post educativo + stories dicas';
}

function calcularTimingOtimo(dataInicio: string): string {
  const dataEvento = new Date(dataInicio);
  const hoje = new Date();
  const diasAteEvento = Math.ceil((dataEvento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diasAteEvento <= 0) return 'Publicar imediatamente';
  if (diasAteEvento <= 3) return 'Publicar em 1-2 dias';
  if (diasAteEvento <= 7) return 'Publicar em 3-4 dias';
  if (diasAteEvento <= 14) return 'Publicar em 1 semana';
  return 'Publicar em 2 semanas';
}

function gerarHashtagsPorCategoria(categoria?: string): string[] {
  const hashtags: Record<string, string[]> = {
    'vacinacao': ['#vacinacao', '#prevencao', '#saudeanimal', '#clinicaveterinaria'],
    'doenca_sazonal': ['#prevencao', '#cuidadospet', '#saudeanimal', '#doencasazonal'],
    'campanha_preventiva': ['#consciencia', '#prevencao', '#bemestaranimal', '#responsabilidade'],
    'data_comemorativa': ['#celebracao', '#veterinario', '#amorpet', '#profissao'],
    'procedimento_sazonal': ['#castracao', '#procedimento', '#cirurgia', '#controle']
  };
  
  const hashtagsGerais = ['#pet', '#cachorro', '#gato', '#veterinaria'];
  const hashtagsEspecificas = hashtags[categoria || ''] || ['#cuidadospet'];
  
  return [...hashtagsEspecificas, ...hashtagsGerais].slice(0, 8);
}

function gerarCTAPorCategoria(categoria?: string): string {
  const ctas: Record<string, string> = {
    'vacinacao': 'Agende a vacinação do seu pet hoje mesmo!',
    'doenca_sazonal': 'Consulte nosso veterinário para prevenção',
    'campanha_preventiva': 'Participe da campanha e compartilhe!',
    'data_comemorativa': 'Celebre conosco esta data especial!',
    'procedimento_sazonal': 'Agende sua consulta e tire suas dúvidas'
  };
  
  return ctas[categoria || ''] || 'Entre em contato para mais informações';
}

export default router;