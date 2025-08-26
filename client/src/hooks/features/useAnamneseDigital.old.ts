import { useState, useEffect, useCallback } from 'react';
import { AnamneseDigital } from '@/lib/types/anamnese';
import { useDataProvider } from '@/services/data-provider.service';
import { useAuth } from './useAuth';

export const useAnamneseDigital = () => {
  const [anamneses, setAnamneses] = useState<AnamneseDigital[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const dataProvider = useDataProvider();

  // Carregar anamneses do usuário
  const fetchAnamneses = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await dataProvider.anamneses.getAll(user.id);
      setAnamneses(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [user, dataProvider]);

  // Buscar anamnese por URL
  const findByUrl = async (url: string): Promise<AnamneseDigital | null> => {
    if (!user) return null;

    try {
      return await dataProvider.anamneses.getByUrl(url, user.id);
    } catch (err: unknown) {
      console.error('Erro ao buscar anamnese:', err);
      return null;
    }
  };

  // Simular análise com IA (placeholder)
  const simulateAnalysis = async (url: string, redesSociais: string[] = []): Promise<AnamneseDigital> => {
    // Simular diferentes estágios de processamento
    const stages = ['initializing', 'analyzing', 'processing', 'finalizing'];
    
    for (const currentStage of stages) {
      // Simula tempo de processamento de cada estágio
      await new Promise(resolve => setTimeout(resolve, 800));
      // Aqui você poderia notificar o componente sobre o estágio atual
      console.log(`Processando estágio: ${currentStage}`);
    }

    const mockAnalysis: Omit<AnamneseDigital, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
      url_analisada: url,
      redes_sociais: redesSociais,
      diagnostico_identidade_e_proposito: {
        dna_marca: "Marca inovadora focada em eficiência técnica e soluções baseadas em IA para o setor pet, com personalidade pragmática e analítica, mas que precisa desenvolver mais calor humano e conexão emocional.",
        hipotese_negocio: "Proprietários de clínicas veterinárias e pet shops, sobrecarregados e frustrados com o marketing tradicional, preferirão uma solução de IA mais eficiente e com melhor custo-benefício.",
        metrica_chave_sucesso: "Geração de leads qualificados via preenchimento do formulário 'Agendar Demonstração' com taxa de conversão superior a 3%."
      },
      personas: [
        {
          nome: "Dra. Ana",
          idade: 48,
          papel: "Veterinária e dona de clínica",
          pensa_sente: {
            pensa: "Não tenho tempo para marketing; preciso de pacientes; agências já me decepcionaram.",
            sente: "Cansaço, desconfiança sobre promessas digitais e orgulho do trabalho clínico."
          },
          vê: "Concorrentes com Instagram ativo, agenda com buracos e pacientes antigos que sumiram.",
          fala_faz: "Foco em salvar vidas, não em postar; pesquisa no Google 'como atrair clientes veterinário'.",
          dores: "Falta de tempo e expertise em marketing, medo de investimento sem retorno, dificuldade em delegar.",
          ganhos: "Agenda consistente, segurança financeira, tempo para atualização profissional e vida pessoal."
        },
        {
          nome: "Ricardo",
          idade: 35,
          papel: "Gerente de pet shop",
          pensa_sente: {
            pensa: "Como bato a meta este mês? Preciso de tráfego para a loja agora.",
            sente: "Pressão por resultados, urgência, curiosidade por novas tecnologias."
          },
          vê: "Redes grandes com promoções agressivas, movimento de rua em queda, anúncios concorrentes.",
          fala_faz: "Preciso aumentar ticket médio; impulsiona posts; analisa relatórios; conversa com equipe.",
          dores: "Orçamento limitado, forte concorrência, necessidade de comprovar ROI rapidamente.",
          ganhos: "Bater metas e bônus, reconhecimento como gerente inovador, loja sempre cheia."
        }
      ],
      auditoria_percepcao_experiencia: {
        jornada_paciente_zero: [
          "Impacto Inicial: curiosidade pela promessa de IA para o setor pet.",
          "Educação Forçada: rolagem em bloco de metodologia denso, focado no 'como' em vez do 'resultado'.",
          "Momento de Desconfiança: resultados genéricos sem provas sociais ou rostos reais.",
          "Decisão Crítica: formulário sem confiança prévia estabelecida gera alta taxa de abandono."
        ],
        johari: {
          arena: [
            "Agência de marketing digital especializada no nicho pet.",
            "Diferencial de IA para eficiência e menor custo.",
            "Objetivo principal: agendar demonstração comercial."
          ],
          ponto_cego: {
            heuristicas_nielsen: {
              controle_e_liberdade: 2,
              flexibilidade_e_eficiencia: 1,
              design_minimalista: 7
            },
            acessibilidade: "Contraste fraco em alguns elementos, falta de marcos de navegação ARIA, imagens sem alt text adequado.",
            performance: "Imagens pesadas podem causar lentidão em conexões móveis, falta de lazy loading.",
            ui_visual: "Layout uniforme demais transmite aparência de template genérico, não de marca premium."
          },
          fachada: [
            "Ausência de prova social concreta (depoimentos, métricas reais de clientes).",
            "Falta de rosto ou história da equipe/fundadores.",
            "Detalhes sobre a 'magia' da IA não são revelados, gerando desconfiança."
          ],
          desconhecido: [
            "Potencial para marketing de conteúdo educativo no setor pet.",
            "Oportunidade de produtos de entrada de menor valor para reduzir barreira inicial.",
            "Possibilidade de criação de comunidade para donos de negócios pet."
          ]
        }
      },
      analise_ecossistema_inspiracoes: [
        {
          nome: "Agência Mestre",
          url: "https://agenciamestre.com/",
          resolve: "Resolve a falta de autoridade através de blog robusto e materiais ricos para download."
        },
        {
          nome: "LYFE Marketing",
          url: "https://www.lyfemarketing.com/",
          resolve: "Supera a prova social fraca usando estudos de caso detalhados com números claros e antes/depois."
        },
        {
          nome: "Growth Machine",
          url: "https://growthmachine.com/",
          resolve: "Resolve comunicação excessivamente técnica focando em resultados finais e cases de sucesso."
        }
      ],
      plano_tratamento_e_evolucao: {
        quick_wins: [
          "Adicionar seção de depoimentos reais com fotos de clientes e métricas específicas.",
          "Incluir página 'Sobre Nós' com foto da equipe e história dos fundadores.",
          "Implementar botão flutuante de WhatsApp para dúvidas rápidas e suporte.",
          "Reescrever headline principal focada na dor/desejo do cliente, não na solução técnica.",
          "Resumir metodologia complexa em 3-4 tópicos visuais com ícones."
        ],
        reestruturacao_arquitetura: [
          "Migrar de página única para arquitetura multi-página: Home, Estudos de Caso, Sobre, Serviços, Blog, Contato.",
          "Criar fluxo de nutrição por email para leads que não convertem imediatamente.",
          "Desenvolver calculadora ou ferramenta gratuita de diagnóstico de marketing."
        ],
        evolucao_identidade_visual: [
          "Criar mini design system consistente em Figma com componentes reutilizáveis.",
          "Expandir paleta de cores para incluir tons de confiança (azul/verde) além do laranja.",
          "Desenvolver ícones personalizados e layouts mais variados para quebrar monotonia."
        ],
        otimizacao_narrativa: [
          "Mudar foco do processo de trabalho para o problema que resolve.",
          "Implementar copywriting mais empático e direto, menos técnico.",
          "Desenvolver storytelling consistente nos estudos de caso de sucesso."
        ],
        saude_tecnica: [
          "Realizar auditoria completa com Lighthouse e Axe para acessibilidade.",
          "Otimizar imagens para formato .webp e implementar lazy loading.",
          "Corrigir navegação por teclado e garantir foco visível em todos os elementos.",
          "Melhorar contraste de cores para atender padrões WCAG AA."
        ]
      },
      roadmap_terapeutico: [
        { item: "Implementar Quick Wins 1-3 (depoimentos, sobre nós, WhatsApp)", prioridade: "Alta", esforco: "Baixo", impacto_negocio: "Alto" },
        { item: "Criar página dedicada de Estudos de Caso com métricas", prioridade: "Alta", esforco: "Médio", impacto_negocio: "Alto" },
        { item: "Reestruturar para arquitetura multi-página", prioridade: "Alta", esforco: "Médio", impacto_negocio: "Médio" },
        { item: "Auditoria e correções de acessibilidade completas", prioridade: "Média", esforco: "Baixo", impacto_negocio: "Alto" },
        { item: "Desenvolvimento de nova identidade visual", prioridade: "Média", esforco: "Alto", impacto_negocio: "Médio" },
        { item: "Lançar blog com 3 artigos iniciais", prioridade: "Baixa", esforco: "Médio", impacto_negocio: "Baixo" }
      ],
      nova_anatomia_home: {
        hero: {
          proposito: "Conectar instantaneamente com a dor principal e apresentar solução clara.",
          gatilhos: ["Empatia", "Benefício Imediato", "Credibilidade"],
          titulo: "Sua agenda cheia. Seu marketing no piloto automático.",
          subtitulo: "A primeira IA de marketing criada especificamente para o setor pet.",
          cta_primario: "Ver Nossos Resultados",
          cta_secundario: "Falar com Especialista"
        },
        prova_social_imediata: {
          proposito: "Gerar confiança instantânea logo após o hero.",
          conteudo: "Faixa com logos de clientes ou números de impacto (X clínicas atendidas, Y% de aumento médio)."
        },
        bloco_dores: {
          proposito: "Espelhar as dores específicas das personas identificadas.",
          cards: ["Falta de tempo para marketing?", "Anúncios sem retorno garantido?", "Concorrência cada vez mais forte?"]
        },
        bloco_solucao: {
          proposito: "Mostrar a solução de forma visual e simplificada.",
          etapas_servico: 3,
          cta: "Conheça Nossos Serviços"
        },
        bloco_resultados: {
          proposito: "Provar que a solução realmente funciona com dados reais.",
          cases_destacados: 3,
          cta: "Ver Todos os Cases"
        },
        cta_final: {
          proposito: "Converter o visitante já convencido com proposta irresistível.",
          titulo: "Vamos conversar sobre o crescimento do seu negócio?",
          formulario_simplificado: true
        }
      },
      perguntas_aprofundamento: [
        "Qual a taxa de conversão atual do formulário de demonstração e qual o CPL (custo por lead)?",
        "Existe manual de marca definido com cores, fontes e tom de voz padronizados?",
        "Como é o fluxo de nutrição após o lead preencher o formulário de demonstração?",
        "Podemos entrevistar 2-3 clientes satisfeitos para obter métricas concretas e depoimentos?",
        "Qual a plataforma atual do site e existem restrições técnicas ou orçamentárias para o redesign?"
      ]
    };

    return mockAnalysis as AnamneseDigital;
  };

  // Processar análise
  const processAnalysis = async (url: string, redesSociais: string[] = []) => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Simular análise
      const analysisData = await simulateAnalysis(url, redesSociais);

      // Converter para formato do banco
      const dbData = anamneseToDbFormat(analysisData);

      // Salvar no banco
      const { data, error } = await supabase
        .from('anamneses_digitais')
        .insert({
          ...dbData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Converter de volta para formato AnamneseDigital
      const convertedResult = dbToAnamneseFormat(data);

      // Atualizar lista local
      setAnamneses(prev => [convertedResult, ...prev]);
      
      return convertedResult;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao processar análise');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  // Reprocessar análise existente
  const reprocessAnalysis = async (id: string, url: string, redesSociais: string[] = []) => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    setAnalyzing(true);
    setError(null);

    try {
      // Simular nova análise
      const analysisData = await simulateAnalysis(url, redesSociais);

      // Converter para formato do banco
      const dbData = anamneseToDbFormat(analysisData);

      // Atualizar no banco
      const { data, error } = await supabase
        .from('anamneses_digitais')
        .update({
          ...dbData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Converter de volta para formato AnamneseDigital
      const convertedResult = dbToAnamneseFormat(data);

      // Atualizar lista local
      setAnamneses(prev => 
        prev.map(item => item.id === id ? convertedResult : item)
      );
      
      return convertedResult;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao reprocessar análise');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  // Deletar anamnese
  const deleteAnalysis = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('anamneses_digitais')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAnamneses(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar análise');
      return false;
    }
  };

  useEffect(() => {
    fetchAnamneses();
  }, [fetchAnamneses]);

  return {
    anamneses,
    loading,
    analyzing,
    error,
    fetchAnamneses,
    findByUrl,
    processAnalysis,
    reprocessAnalysis,
    deleteAnalysis,
    setError
  };
};
