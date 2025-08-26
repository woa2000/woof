/**
 * Exemplo de uso dos hooks do calendário atualizados para usar o Express server
 * Este arquivo demonstra como usar os hooks após a migração da Fase 3
 */

'use client';

import React from 'react';
import { 
  useCalendarioEventos,
  useCalendarioEvento,
  useCalendarioInsights,
  useCalendarioPresets,
  useCalendarioSugestoes,
  useCalendarioMutations 
} from '@/hooks/calendario/useCalendarioEventos';

// =====================================================
// COMPONENTE DE EXEMPLO - LISTAGEM DE EVENTOS
// =====================================================

export function ExemploListagemEventos() {
  // Hook para listar eventos com filtros
  const { data: eventos, isLoading, error, refetch } = useCalendarioEventos({
    categoria_pet: 'cachorro',
    prioridade: 'alta',
    limit: 10
  });

  if (isLoading) return <div>Carregando eventos...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h2>Eventos do Calendário</h2>
      <button onClick={refetch}>🔄 Recarregar</button>
      
      {eventos?.map(evento => (
        <div key={evento.id} className="evento-card">
          <h3>{evento.evento}</h3>
          <p>Data: {evento.data_inicio}</p>
          <p>Prioridade: {evento.prioridade}</p>
          <p>Tags: {evento.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// COMPONENTE DE EXEMPLO - DETALHES DE UM EVENTO
// =====================================================

export function ExemploDetalheEvento({ eventoId }: { eventoId: string }) {
  const { data: evento, isLoading, error } = useCalendarioEvento(eventoId);

  if (isLoading) return <div>Carregando evento...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  if (!evento) return <div>Evento não encontrado</div>;

  return (
    <div className="evento-detalhes">
      <h2>{evento.evento}</h2>
      <p>Data de início: {evento.data_inicio}</p>
      {evento.data_fim && <p>Data de fim: {evento.data_fim}</p>}
      <p>Categoria: {evento.categoria_pet}</p>
      <p>Prioridade: {evento.prioridade}</p>
      <p>Status: {evento.status}</p>
      <div>
        <strong>Tags:</strong>
        {evento.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// COMPONENTE DE EXEMPLO - INSIGHTS E ANALYTICS
// =====================================================

export function ExemploInsights() {
  const { data: insights, isLoading, error, refetch } = useCalendarioInsights();

  if (isLoading) return <div>Carregando insights...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="insights-dashboard">
      <h2>Insights do Calendário</h2>
      <button onClick={refetch}>🔄 Atualizar Insights</button>
      
      {insights && (
        <div>
          <div className="metricas-gerais">
            <h3>Métricas Gerais</h3>
            <p>Eventos ativos: {insights.metricas_gerais?.total_eventos_ativos}</p>
            <p>Próximos 7 dias: {insights.metricas_gerais?.eventos_proximos_7_dias}</p>
            <p>Próximos 30 dias: {insights.metricas_gerais?.eventos_proximos_30_dias}</p>
          </div>

          {insights.tendencias_sazonais && (
            <div className="tendencias">
              <h3>Tendências Sazonais</h3>
              {insights.tendencias_sazonais.map((tendencia: any, index: number) => (
                <div key={index}>
                  <p>Período: {tendencia.periodo}</p>
                  <p>Total eventos: {tendencia.total_eventos}</p>
                  <p>Categorias: {tendencia.principais_categorias.join(', ')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =====================================================
// COMPONENTE DE EXEMPLO - PRESETS
// =====================================================

export function ExemploPresets() {
  const { data: presets, isLoading, error } = useCalendarioPresets({
    categoria: 'vacinacao',
    regiao: 'sudeste'
  });

  const { addPreset, isCreating } = useCalendarioMutations();

  const handleAddPreset = async (presetId: string) => {
    try {
      await addPreset({
        preset_id: presetId,
        personalizacoes: {
          prioridade: 'alta',
          notificacao_antecedencia: 7
        }
      });
    } catch (error) {
      console.error('Erro ao adicionar preset:', error);
    }
  };

  if (isLoading) return <div>Carregando presets...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h2>Presets Disponíveis</h2>
      
      {presets?.data?.map((preset: any) => (
        <div key={preset.id} className="preset-card">
          <h3>{preset.nome}</h3>
          <p>{preset.descricao}</p>
          <p>Categoria: {preset.categoria}</p>
          <p>Prioridade: {preset.prioridade}</p>
          
          <button 
            onClick={() => handleAddPreset(preset.id)}
            disabled={isCreating}
          >
            {isCreating ? 'Adicionando...' : '➕ Adicionar ao Calendário'}
          </button>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// COMPONENTE DE EXEMPLO - SUGESTÕES IA
// =====================================================

export function ExemploSugestoes() {
  const { data: sugestoes, isLoading, error } = useCalendarioSugestoes({
    tipo_negocio: 'clinica_veterinaria',
    regiao: 'sudeste',
    limite: 5
  });

  if (isLoading) return <div>Carregando sugestões IA...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h2>Sugestões da IA</h2>
      
      {sugestoes?.sugestoes?.map((sugestao: any, index: number) => (
        <div key={index} className="sugestao-card">
          <h3>{sugestao.evento_sugerido}</h3>
          <p>Categoria: {sugestao.categoria_detectada}</p>
          <p>Data ideal: {sugestao.data_ideal}</p>
          <p>Justificativa: {sugestao.justificativa}</p>
          <p>Confiança: {(sugestao.confianca_score * 100).toFixed(1)}%</p>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// COMPONENTE DE EXEMPLO - MUTATIONS
// =====================================================

export function ExemploMutations() {
  const { 
    createEvento, 
    updateEvento, 
    deleteEvento,
    isCreating, 
    isUpdating, 
    isDeleting 
  } = useCalendarioMutations();

  const handleCreateEvento = async () => {
    try {
      const novoEvento = await createEvento({
        evento: 'Campanha de Verão 2024',
        data_inicio: '2024-12-15',
        data_fim: '2024-12-31',
        categoria_pet: 'geral',
        prioridade: 'alta',
        tags: ['verao', 'campanha', '2024'],
        notificacao_antecedencia: 7
      });
      console.log('Evento criado:', novoEvento);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  const handleUpdateEvento = async (id: string) => {
    try {
      const eventoAtualizado = await updateEvento(id, {
        evento: 'Campanha de Verão 2024 - Atualizada',
        data_inicio: '2024-12-15',
        prioridade: 'media'
      });
      console.log('Evento atualizado:', eventoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
    }
  };

  const handleDeleteEvento = async (id: string) => {
    try {
      await deleteEvento(id);
      console.log('Evento removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover evento:', error);
    }
  };

  return (
    <div>
      <h2>Operações de Calendário</h2>
      
      <div className="mutation-buttons">
        <button 
          onClick={handleCreateEvento}
          disabled={isCreating}
        >
          {isCreating ? 'Criando...' : '➕ Criar Evento'}
        </button>
        
        <button 
          onClick={() => handleUpdateEvento('evento-id-exemplo')}
          disabled={isUpdating}
        >
          {isUpdating ? 'Atualizando...' : '✏️ Atualizar Evento'}
        </button>
        
        <button 
          onClick={() => handleDeleteEvento('evento-id-exemplo')}
          disabled={isDeleting}
        >
          {isDeleting ? 'Removendo...' : '🗑️ Remover Evento'}
        </button>
      </div>
    </div>
  );
}

// =====================================================
// COMPONENTE PRINCIPAL DE DEMONSTRAÇÃO
// =====================================================

export default function CalendarioHookUsageExample() {
  return (
    <div className="calendario-examples">
      <h1>🎯 Exemplo de Uso dos Hooks do Calendário</h1>
      <p>Hooks migrados para usar o Express server (Fase 3 completa)</p>
      
      <div className="examples-grid">
        <ExemploListagemEventos />
        <ExemploDetalheEvento eventoId="exemplo-id" />
        <ExemploInsights />
        <ExemploPresets />
        <ExemploSugestoes />
        <ExemploMutations />
      </div>

      <style jsx>{`
        .calendario-examples {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .examples-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .evento-card, .preset-card, .sugestao-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }
        
        .tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-right: 4px;
        }
        
        .mutation-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        button {
          padding: 8px 16px;
          border-radius: 4px;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
        }
        
        button:hover {
          background: #f5f5f5;
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}