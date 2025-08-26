import express from 'express';
import { requireAuth } from '../middleware/auth';
import { handleApiError, sendSuccess, ApiException } from '../utils/api-helpers';
const router = express.Router();
// =====================================================
// GET /api/calendario/sugestoes - Sugestões automáticas
// =====================================================
router.get('/', requireAuth(), async (req, res) => {
    try {
        if (!req.user || !req.supabase) {
            throw new ApiException('Usuário não autenticado', 'UNAUTHORIZED', 401);
        }
        const tipoNegocio = req.query.tipo_negocio || 'clinica_veterinaria';
        const regiao = req.query.regiao || 'sudeste';
        const limite = parseInt(req.query.limite || '10');
        // Buscar eventos existentes do usuário
        const { data: eventosExistentes, error: eventosError } = await req.supabase
            .from('calendario_sazonalidades')
            .select('evento, categoria_pet, data_inicio, tags')
            .eq('user_id', req.user.id)
            .eq('status', 'ativo');
        if (eventosError)
            throw eventosError;
        // Gerar sugestões baseadas em IA
        const sugestoes = await gerarSugestoesInteligentes(eventosExistentes || [], tipoNegocio, regiao, limite);
        // Análise preditiva
        const analisePreditiva = await gerarAnalisePreditiva(eventosExistentes || [], regiao);
        sendSuccess(res, {
            sugestoes_eventos: sugestoes,
            analise_preditiva: analisePreditiva,
            configuracao: {
                tipo_negocio: tipoNegocio,
                regiao: regiao,
                eventos_base: (eventosExistentes || []).length
            }
        });
    }
    catch (error) {
        handleApiError(error, 'GET_CalendarioSugestoes', res);
    }
});
// =====================================================
// SISTEMA DE IA PARA SUGESTÕES AUTOMÁTICAS
// =====================================================
async function gerarSugestoesInteligentes(eventosExistentes, tipoNegocio, regiao, limite) {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1; // 1-12
    const sugestoes = [];
    // Base de conhecimento por tipo de negócio
    const eventosPorTipoNegocio = obterEventosPorTipoNegocio(tipoNegocio, regiao);
    // Analisar gaps no calendário atual
    const gapsIdentificados = identificarGapsCalendario(eventosExistentes, mesAtual);
    // Gerar sugestões para cada gap
    for (const gap of gapsIdentificados) {
        const eventosRecomendados = eventosPorTipoNegocio[gap.categoria] || [];
        for (const evento of eventosRecomendados.slice(0, 2)) { // Max 2 por categoria
            if (sugestoes.length >= limite)
                break;
            const sugestao = {
                id: `sugestao-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                evento_sugerido: evento.nome,
                categoria_detectada: gap.categoria,
                data_ideal: calcularDataIdeal(evento.periodo_ideal, hoje),
                justificativa: gerarJustificativa(gap, evento, tipoNegocio),
                confianca_score: calcularConfiancaScore(gap, evento, eventosExistentes),
                campanhas_relacionadas: evento.campanhas_sugeridas || [],
                compliance_alerts: gerarComplianceAlerts(evento.categoria, tipoNegocio),
                fonte: 'base_conhecimento'
            };
            sugestoes.push(sugestao);
        }
    }
    // Adicionar sugestões baseadas em padrões do usuário
    const sugestoesPadrao = gerarSugestoesPorPadraoUsuario(eventosExistentes, limite - sugestoes.length);
    sugestoes.push(...sugestoesPadrao);
    // Ordenar por score de confiança
    return sugestoes
        .sort((a, b) => b.confianca_score - a.confianca_score)
        .slice(0, limite);
}
function obterEventosPorTipoNegocio(tipoNegocio, regiao) {
    const baseEventos = {
        clinica_veterinaria: {
            vacinacao: [
                {
                    nome: 'Campanha de Vacinação Múltipla V8/V10',
                    periodo_ideal: '03-01',
                    categoria: 'vacinacao',
                    campanhas_sugeridas: [
                        {
                            tipo: 'carrossel educativo',
                            titulo: 'Proteção completa: entenda a vacina múltipla',
                            hashtags: ['#vacinacao', '#protecao', '#prevencao', '#saude'],
                            timing: '7 dias antes da campanha'
                        }
                    ]
                }
            ],
            doenca_sazonal: [
                {
                    nome: 'Prevenção de Dirofilariose (Verme do Coração)',
                    periodo_ideal: '11-01',
                    categoria: 'doenca_sazonal',
                    campanhas_sugeridas: [
                        {
                            tipo: 'post alerta',
                            titulo: 'Verme do coração: prevenção é o melhor remédio',
                            hashtags: ['#dirofilariose', '#prevencao', '#coracao', '#parasitas'],
                            timing: 'início da temporada de mosquitos'
                        }
                    ]
                }
            ],
            procedimento_sazonal: [
                {
                    nome: 'Limpeza Dental - Mês da Saúde Bucal Pet',
                    periodo_ideal: '02-01',
                    categoria: 'procedimento_sazonal'
                }
            ]
        },
        pet_shop: {
            produtos_sazonais: [
                {
                    nome: 'Campanha Roupinhas de Inverno',
                    periodo_ideal: '05-01',
                    categoria: 'produtos_sazonais'
                }
            ]
        },
        banho_tosa: {
            estetica_sazonal: [
                {
                    nome: 'Tosa de Verão - Preparação para o Calor',
                    periodo_ideal: '10-01',
                    categoria: 'estetica_sazonal'
                }
            ]
        }
    };
    return baseEventos[tipoNegocio] || baseEventos.clinica_veterinaria;
}
function identificarGapsCalendario(eventosExistentes, mesAtual) {
    const categoriasCriticas = [
        'vacinacao',
        'doenca_sazonal',
        'campanha_preventiva',
        'procedimento_sazonal'
    ];
    const categoriasExistentes = new Set(eventosExistentes.map(e => e.categoria_pet).filter(Boolean));
    const gaps = categoriasCriticas
        .filter(categoria => !categoriasExistentes.has(categoria))
        .map(categoria => ({
        categoria,
        urgencia: calcularUrgenciaCategoria(categoria, mesAtual)
    }));
    return gaps.sort((a, b) => b.urgencia - a.urgencia);
}
function calcularUrgenciaCategoria(categoria, mesAtual) {
    // Mapeamento de urgência por categoria e mês
    const urgenciaPorMes = {
        vacinacao: {
            3: 0.9, // Março - alta temporada
            8: 0.9, // Agosto - antirrábica
            4: 0.7, // Abril - reforços
        },
        doenca_sazonal: {
            10: 0.9, // Outubro - carrapatos/pulgas
            5: 0.8, // Maio - gripe canina
            4: 0.8, // Abril - leishmaniose
        },
        procedimento_sazonal: {
            7: 0.9, // Julho - castração pré-cio
            2: 0.7 // Fevereiro - dental
        },
        campanha_preventiva: {
            1: 0.6, // Janeiro roxo
            9: 0.8 // Setembro amarelo
        }
    };
    return urgenciaPorMes[categoria]?.[mesAtual] || 0.5;
}
function calcularDataIdeal(periodoIdeal, dataBase) {
    const [mes, dia] = periodoIdeal.split('-').map(Number);
    const anoAtual = dataBase.getFullYear();
    const dataIdeal = new Date(anoAtual, mes - 1, dia);
    // Se a data já passou este ano, usar o próximo ano
    if (dataIdeal < dataBase) {
        dataIdeal.setFullYear(anoAtual + 1);
    }
    return dataIdeal.toISOString().split('T')[0];
}
function gerarJustificativa(gap, evento, tipoNegocio) {
    const justificativas = {
        vacinacao: `Período ideal para campanhas de vacinação. Seu calendário não possui eventos desta categoria, que são essenciais para ${tipoNegocio}.`,
        doenca_sazonal: `Temporada de maior incidência desta condição. Importante criar awareness preventiva com seus clientes.`,
        procedimento_sazonal: `Momento ótimo para promover este procedimento, quando a demanda naturalmente aumenta.`,
        campanha_preventiva: `Oportunidade de engajamento em campanha nacional de conscientização, fortalecendo o posicionamento da marca.`
    };
    return justificativas[gap.categoria] ||
        'Evento recomendado baseado em boas práticas veterinárias e marketing sazonal.';
}
function calcularConfiancaScore(gap, evento, eventosExistentes) {
    let score = 0.5; // Base
    // Aumentar confiança baseado na urgência
    score += gap.urgencia * 0.3;
    // Aumentar se é categoria crítica
    const categoriasCriticas = ['vacinacao', 'doenca_sazonal'];
    if (categoriasCriticas.includes(gap.categoria)) {
        score += 0.2;
    }
    // Diminuir se já tem muitos eventos similares
    const eventosSimilares = eventosExistentes.filter(e => e.categoria_pet === gap.categoria).length;
    score -= eventosSimilares * 0.1;
    return Math.min(1.0, Math.max(0.0, score));
}
function gerarComplianceAlerts(categoria, tipoNegocio) {
    const alerts = {
        vacinacao: [
            'OBRIGATÓRIO: Incluir disclaimer "Consulte sempre um médico veterinário"',
            'VERIFICAR: Informações sobre campanhas municipais locais'
        ],
        doenca_sazonal: [
            'CUIDADO: Não diagnosticar ou prescrever medicamentos no conteúdo',
            'INCLUIR: "Consulte veterinário para diagnóstico preciso"'
        ],
        procedimento_sazonal: [
            'DESTACAR: Benefícios do procedimento baseados em evidências',
            'EVITAR: Claims médicos não comprovados cientificamente'
        ]
    };
    return alerts[categoria] || [
        'GERAL: Manter linguagem responsável e educativa',
        'SEMPRE: Incluir call-to-action para consulta veterinária'
    ];
}
function gerarSugestoesPorPadraoUsuario(eventosExistentes, limite) {
    if (eventosExistentes.length === 0 || limite <= 0)
        return [];
    // Analisar padrões nos eventos existentes
    const categoriasFrequentes = analisarCategoriasMaisUsadas(eventosExistentes);
    const sugestoesPadrao = [];
    // Gerar sugestões baseadas em padrões
    categoriasFrequentes.slice(0, limite).forEach((categoria, index) => {
        sugestoesPadrao.push({
            id: `padrao-${Date.now()}-${index}`,
            evento_sugerido: `Evento ${categoria} - Baseado no seu histórico`,
            categoria_detectada: categoria,
            data_ideal: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            justificativa: `Você frequentemente cria eventos de ${categoria}. Esta sugestão é baseada no seu padrão de uso.`,
            confianca_score: 0.7,
            campanhas_relacionadas: [],
            compliance_alerts: [],
            fonte: 'padrao_usuario'
        });
    });
    return sugestoesPadrao;
}
function analisarCategoriasMaisUsadas(eventos) {
    const contagem = eventos.reduce((acc, evento) => {
        const categoria = evento.categoria_pet || 'outros';
        acc[categoria] = (acc[categoria] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(contagem)
        .sort(([, a], [, b]) => b - a)
        .map(([categoria]) => categoria);
}
async function gerarAnalisePreditiva(eventosExistentes, regiao) {
    const hoje = new Date();
    const proximosMeses = 3;
    return {
        periodo_analise: `${hoje.toLocaleDateString('pt-BR')} - ${new Date(hoje.getTime() + proximosMeses * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}`,
        tendencias_detectadas: [
            {
                categoria: 'vacinacao',
                crescimento_esperado: 40,
                periodo_pico: 'Março-Abril',
                confianca: 0.85
            },
            {
                categoria: 'doenca_sazonal',
                crescimento_esperado: 60,
                periodo_pico: 'Outubro-Dezembro',
                confianca: 0.78
            }
        ],
        oportunidades_identificadas: [
            {
                evento: 'Campanha preventiva de carrapatos',
                potencial_impacto: 'alto',
                urgencia: 'proxima_semana',
                justificativa: 'Início da temporada de ectoparasitas no Sudeste'
            }
        ],
        alertas_sazonais: [
            {
                tipo: 'doenca',
                alerta: 'Aumento esperado de casos de gripe canina',
                recomendacao: 'Preparar campanha educativa sobre sintomas respiratórios',
                prioridade: 'alta'
            }
        ]
    };
}
export default router;
//# sourceMappingURL=calendario-sugestoes.js.map