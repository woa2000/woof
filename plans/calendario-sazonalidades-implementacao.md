# Calendário Sazonalidades - Plano de Implementação

```yaml
executor: Tech_Lead
sprint: 9-11
prioridade: ALTA
dependencias: [P1-database-schema, P2-api-routes, P9-calendario-sazonalidades]
estimativa_pontos: 21
prazo_dias: 10
```

## 📋 Análise Técnica Detalhada

### Schema de Banco (Baseado em P1-database-schema.sql)

#### Tabela `calendario_sazonalidades` - Estrutura Completa
```sql
CREATE TABLE public.calendario_sazonalidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  evento VARCHAR(150) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  categoria_pet VARCHAR(50), -- vacinacao, banho_tosa, nutricao, comportamento
  prioridade VARCHAR(10) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  campanhas_sugeridas JSONB DEFAULT '[]',
  notificacao_antecedencia INTEGER DEFAULT 7, -- dias
  tags JSONB DEFAULT '[]',
  status VARCHAR DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Relacionamentos e Dependências
- **Relacionamento Principal**: `user_id` → `profiles.id` (RLS habilitado)
- **Integração com Social Listening**: Via `social_listening.hashtag_monitorada` → `tags`
- **Conexão Manual da Marca**: Via `brand_manuals.id` para aplicação de brand voice
- **Link com Inventário**: `inventario_conteudo.categoria_pet` correlacionado

#### Índices para Performance Otimizada
```sql
-- Índices obrigatórios (baseados em P1)
CREATE INDEX idx_calendario_user_data ON public.calendario_sazonalidades(user_id, data_inicio);
CREATE INDEX idx_calendario_categoria ON public.calendario_sazonalidades(categoria_pet);
CREATE INDEX idx_calendario_prioridade_status ON public.calendario_sazonalidades(prioridade, status);
CREATE INDEX idx_calendario_tags_gin ON public.calendario_sazonalidades USING GIN (tags);
```

### APIs Necessárias (Baseado em P2-api-routes-simplified.ts)

#### Endpoints Principais
```typescript
// GET /api/calendario - Lista eventos com filtros avançados
interface CalendarioQueryParams {
  categoria_pet?: string;
  mes?: string; // YYYY-MM
  prioridade?: 'baixa' | 'media' | 'alta';
  tags?: string[];
  limit?: number;
  offset?: number;
}

// POST /api/calendario - Cria novo evento com validação IA
interface CreateSazonalidadeRequest {
  evento: string;
  data_inicio: string;
  data_fim?: string;
  categoria_pet?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  campanhas_sugeridas?: any[];
  tags?: string[];
}

// PUT /api/calendario/[id] - Atualiza evento existente
// DELETE /api/calendario/[id] - Remove evento (soft delete)

// GET /api/calendario/insights - Analytics do calendário
interface CalendarioInsights {
  eventos_mes_atual: number;
  categoria_mais_ativa: string;
  proximos_eventos_criticos: SazonalidadeResponse[];
  sugestoes_ia: {
    eventos_perdidos: string[];
    oportunidades_conteudo: ConteudoSazonal[];
  };
}
```

#### Validadores TypeScript (Substituindo Zod)
```typescript
function validateSazonalidade(data: any): string[] {
  const errors: string[] = [];
  
  if (!data.evento || typeof data.evento !== 'string' || data.evento.length === 0) {
    errors.push('Evento é obrigatório');
  }
  
  if (!data.data_inicio || !isValidDate(data.data_inicio)) {
    errors.push('Data de início é obrigatória e deve estar em formato válido');
  }
  
  if (data.categoria_pet && !['vacinacao', 'doenca_sazonal', 'campanha_preventiva', 'data_comemorativa', 'procedimento_sazonal'].includes(data.categoria_pet)) {
    errors.push('Categoria pet inválida');
  }
  
  if (data.prioridade && !['baixa', 'media', 'alta'].includes(data.prioridade)) {
    errors.push('Prioridade deve ser: baixa, media ou alta');
  }
  
  return errors;
}
```

### Componentes Frontend (Baseado em P9-calendario-sazonalidades.ts)

#### Estrutura de Componentes Obrigatória
```typescript
src/components/calendario/
├── CalendarioPage.tsx           // Página principal - container
├── CalendarioHeader.tsx         // Filtros, ações e navegação mensal
├── CalendarioGrid.tsx           // Grid mensal/semanal responsivo
├── EventoCard.tsx               // Card de evento individual
├── EventoModal.tsx              // Modal criar/editar eventos
├── FiltrosCalendario.tsx        // Filtros avançados (categoria, prioridade)
├── InsightsPanel.tsx            // Painel de insights e sugestões IA
├── SazonalidadesPreset.tsx      // Eventos veterinários pré-cadastrados
└── index.ts                     // Re-exports centralizados
```

#### Implementação dos Componentes Principais

```typescript
// CalendarioPage.tsx - Container Principal
interface CalendarioPageProps {
  initialFilters?: CalendarioFilters;
}

export function CalendarioPage({ initialFilters }: CalendarioPageProps) {
  const [filtros, setFiltros] = useState<CalendarioFilters>(initialFilters || {});
  const [eventoEditando, setEventoEditando] = useState<SazonalidadeResponse | null>(null);
  const [isModalAberto, setIsModalAberto] = useState(false);
  
  // Data fetching com React Query
  const { data: eventos, isLoading } = useCalendarioEventos(filtros);
  const { data: insights } = useCalendarioInsights();
  
  // Handlers
  const handleFiltroChange = useCallback((novosFiltros: Partial<CalendarioFilters>) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }));
  }, []);
  
  const handleEventoEdit = useCallback((evento: SazonalidadeResponse) => {
    setEventoEditando(evento);
    setIsModalAberto(true);
  }, []);
  
  if (isLoading) return <CalendarioSkeleton />;
  
  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 flex flex-col">
        <CalendarioHeader
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          onNovoEvento={() => setIsModalAberto(true)}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <CalendarioGrid
            eventos={eventos || []}
            onEventoEdit={handleEventoEdit}
            onEventoDelete={handleEventoDelete}
          />
          
          <InsightsPanel
            insights={insights}
            className="w-80 border-l"
          />
        </div>
      </div>
      
      <EventoModal
        evento={eventoEditando}
        isOpen={isModalAberto}
        onClose={() => {
          setIsModalAberto(false);
          setEventoEditando(null);
        }}
        onSave={handleEventoSave}
      />
    </div>
  );
}

// CalendarioGrid.tsx - Grid de Eventos
interface CalendarioGridProps {
  eventos: SazonalidadeResponse[];
  onEventoEdit: (evento: SazonalidadeResponse) => void;
  onEventoDelete: (id: string) => void;
  visualizacao?: 'mensal' | 'semanal' | 'lista';
}

export function CalendarioGrid({ eventos, onEventoEdit, onEventoDelete, visualizacao = 'mensal' }: CalendarioGridProps) {
  const [mesAtual, setMesAtual] = useState(new Date());
  
  const eventosPorData = useMemo(() => {
    return groupEventosByDate(eventos, mesAtual);
  }, [eventos, mesAtual]);
  
  const diasDoMes = useMemo(() => {
    return generateCalendarDays(mesAtual);
  }, [mesAtual]);
  
  if (visualizacao === 'lista') {
    return (
      <div className="flex-1 p-6 space-y-4">
        {eventos.map(evento => (
          <EventoCard
            key={evento.id}
            evento={evento}
            onEdit={() => onEventoEdit(evento)}
            onDelete={() => onEventoDelete(evento.id)}
            variant="lista"
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex-1 p-6">
      {/* Navegação do mês */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => setMesAtual(subMonths(mesAtual, 1))}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold">
          {format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}
        </h2>
        
        <Button
          variant="ghost"
          onClick={() => setMesAtual(addMonths(mesAtual, 1))}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
          <div key={dia} className="p-2 text-sm font-medium text-center text-muted-foreground">
            {dia}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {diasDoMes.map(({ date, isCurrentMonth, isToday }) => {
          const eventosNoDia = eventosPorData[format(date, 'yyyy-MM-dd')] || [];
          
          return (
            <div
              key={format(date, 'yyyy-MM-dd')}
              className={cn(
                "min-h-[120px] p-2 border border-border rounded-lg transition-colors hover:bg-accent/50",
                {
                  'bg-muted/30': !isCurrentMonth,
                  'bg-primary/10 border-primary': isToday,
                }
              )}
            >
              <div className={cn("text-sm font-medium mb-2", {
                'text-muted-foreground': !isCurrentMonth,
                'text-primary font-bold': isToday,
              })}>
                {format(date, 'd')}
              </div>
              
              <div className="space-y-1">
                {eventosNoDia.slice(0, 3).map(evento => (
                  <EventoCard
                    key={evento.id}
                    evento={evento}
                    onEdit={() => onEventoEdit(evento)}
                    variant="compacto"
                    className="text-xs"
                  />
                ))}
                
                {eventosNoDia.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{eventosNoDia.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## 🎯 Task Breakdown (DAG Executável)

### Fase 1: Backend & APIs (3-4 dias)
**Responsável**: Backend_Developer
**Dependências**: P1-database-schema, P2-api-routes

#### Task 1.1: Implementar API Routes Completas (1.5 dias)
**Descrição**: Criar todas as rotas da API com validação e tratamento de erros
**Entregáveis**:
- `src/app/api/calendario/route.ts` - GET/POST principais
- `src/app/api/calendario/[id]/route.ts` - PUT/DELETE por ID
- `src/app/api/calendario/insights/route.ts` - Analytics e insights
- Validadores TypeScript (substituindo Zod temporariamente)

**Critérios de Aceite**:
- [ ] APIs respondem em < 200ms para consultas básicas
- [ ] Validação de dados implementada com mensagens de erro claras
- [ ] RLS policies funcionando corretamente
- [ ] Filtros por categoria, data e prioridade implementados

#### Task 1.2: Configurar RLS Policies Avançadas (1 dia)
**Descrição**: Implementar políticas de segurança Row Level Security
**Entregáveis**:
- Políticas RLS para CRUD completo
- Testes de segurança para isolamento de dados
- Índices de performance otimizados

**Critérios de Aceite**:
- [ ] Usuários só acessam próprios dados
- [ ] Performance mantida com RLS ativo
- [ ] Políticas testadas em cenários de stress

#### Task 1.3: Testes Unitários APIs (0.5 dias)
**Descrição**: Cobertura de testes para todas as rotas
**Entregáveis**:
- Testes para cada endpoint
- Mocks do Supabase
- Testes de validação de dados

**Critérios de Aceite**:
- [ ] Cobertura > 85% para rotas da API
- [ ] Testes passando em pipeline CI/CD
- [ ] Cenários de erro testados

### Fase 2: Frontend Core (3-4 dias)
**Responsável**: Frontend_Developer  
**Dependências**: Fase 1 completa

#### Task 2.1: Página Principal Calendário (1.5 dias)
**Descrição**: Implementar CalendarioPage.tsx e CalendarioHeader.tsx
**Entregáveis**:
- Container principal com gerenciamento de estado
- Header com filtros e navegação
- Integração com APIs via React Query
- Loading states e error boundaries

**Critérios de Aceite**:
- [ ] Interface responsiva (mobile-first)
- [ ] Loading skeleton durante carregamento
- [ ] Filtros persistem na sessão do usuário
- [ ] Performance otimizada com React.memo

#### Task 2.2: Grid de Eventos Responsivo (1.5 dias)
**Descrição**: CalendarioGrid.tsx com visualizações mensal/semanal/lista
**Entregáveis**:
- Grid mensal responsivo
- Navegação entre meses
- EventoCard em diferentes variantes
- Agrupamento de eventos por data

**Critérios de Aceite**:
- [ ] Grid funcional em todas as resoluções
- [ ] Navegação suave entre meses
- [ ] Máximo 3 eventos visíveis por dia no grid
- [ ] Indicador "+X mais" para dias com muitos eventos

#### Task 2.3: Modal CRUD Eventos (1 dia)
**Descrição**: EventoModal.tsx para criação e edição
**Entregáveis**:
- Modal responsivo com formulário
- Validação client-side
- Integração com mutations do React Query
- Feedback de sucesso/erro com toasts

**Critérios de Aceite**:
- [ ] Modal acessível (foco, ESC, ARIA)
- [ ] Validação em tempo real
- [ ] Salvamento otimista implementado
- [ ] UX fluida para criação/edição

### Fase 3: Features Avançadas (2-3 dias)
**Responsável**: AI_Engineer + Data_Analyst + Frontend_Developer

#### Task 3.1: Sugestões Automáticas de Eventos (1 dia)
**Responsável**: AI_Engineer
**Descrição**: Integrar base de conhecimento P9 com sugestões inteligentes
**Entregáveis**:
- SazonalidadesPreset.tsx com eventos veterinários
- Sistema de sugestões baseado em categoria do negócio
- IA para detecção de eventos em falta

**Critérios de Aceite**:
- [ ] 25+ eventos veterinários pré-cadastrados
- [ ] Sugestões contextuais por tipo de negócio
- [ ] Alertas proativos para eventos críticos próximos

#### Task 3.2: Analytics e Insights (1 dia)
**Responsável**: Data_Analyst
**Descrição**: InsightsPanel.tsx com métricas e previsões
**Entregáveis**:
- Painel lateral com insights
- Métricas de engajamento histórico
- Previsões de demanda sazonal
- Identificação de gaps no calendário

**Critérios de Aceite**:
- [ ] Insights calculados automaticamente
- [ ] Visualização de tendências sazonais
- [ ] Sugestões estratégicas baseadas em dados

#### Task 3.3: Filtros e Busca Avançada (1 dia)
**Responsável**: Frontend_Developer
**Descrição**: FiltrosCalendario.tsx com busca inteligente
**Entregáveis**:
- Sistema de filtros compostos
- Busca textual nos eventos
- Filtro por tags (autocomplete)
- Salvar filtros favoritos

**Critérios de Aceite**:
- [ ] Busca instantânea (debounced)
- [ ] Filtros múltiplos simultâneos
- [ ] Autocomplete funcional para tags
- [ ] Estado dos filtros preservado

### Fase 4: Integração & Testes (1-2 dias)
**Responsável**: QA_Engineer + DevOps_Specialist

#### Task 4.1: Testes E2E Completos (1 dia)
**Responsável**: QA_Engineer
**Descrição**: Cobertura de testes end-to-end com Playwright
**Entregáveis**:
- Casos de teste para fluxos principais
- Testes de integração com Supabase
- Testes de responsividade
- Validação de acessibilidade

**Critérios de Aceite**:
- [ ] Fluxos críticos testados automaticamente
- [ ] Testes passando em diferentes browsers
- [ ] Performance validada (< 2s load time)
- [ ] Acessibilidade verificada (WCAG 2.1)

#### Task 4.2: Deploy e Monitoramento (0.5 dias)
**Responsável**: DevOps_Specialist
**Descrição**: Deploy em produção com monitoramento
**Entregáveis**:
- Deploy via Vercel
- Monitoramento de performance
- Alertas de erro configurados
- Backup de dados

**Critérios de Aceite**:
- [ ] Deploy automático via GitHub Actions
- [ ] Métricas Core Web Vitals < thresholds
- [ ] Sistema de alertas funcionando
- [ ] Rollback strategy definida

## 📋 Especificações Funcionais

### Eventos Veterinários Brasileiros (Baseado em P9)

#### Sazonalidades Críticas (25+ Eventos)

**Janeiro**
- Janeiro Roxo - Conscientização Hanseníase Animal
- Início da Temporada Anti-Pulgas (Região SE/S)
- Campanha Hidratação Pet (Verão)

**Fevereiro**
- Carnaval Pet - Cuidados Especiais
- Pico de Intoxicações por Chocolate
- Campanha Anti-Stress para Pets

**Março**
- Campanha de Vacinação Anual
- Outono - Mudança de Pelagem
- Início Temporada Gripal Canina

**Abril**
- Dia Nacional dos Animais (14/04)
- Temporada Leishmaniose (Nordeste)
- Easter Pet Safety Campaign

**Maio**
- Mês das Mães Pet
- Intensificação Gripe Canina (Inverno SE/S)
- Campanha Artrite Sênior

**Junho**
- Festa Junina Pet Safety
- Pico Frio - Aquecimento Pet
- Campanha Respiratory Care

**Julho**
- Férias Pet - Hotel/Creche
- Pré-Temporada Castração
- Winter Skin Care

**Agosto**
- Campanha Antirrábica Nacional
- Semana do Aleitamento Animal
- Pré-Spring Grooming

**Setembro**
- Dia do Médico Veterinário (09/09)
- Setembro Amarelo Pet (Saúde Mental)
- Campanha Castração Responsável

**Outubro**
- Dia Mundial dos Animais (04/10)
- Outubro Rosa Pet (Prevenção Câncer)
- Início Temporada Carrapatos

**Novembro**
- Novembro Azul Pet (Saúde Masculina)
- Black Friday Pet Products
- Pré-Verão Grooming

**Dezembro**
- Natal Pet Safety
- Fogos de Artifício - Anti-Stress
- Fim de Ano Veterinary Care

#### Categorias Pet Suportadas

```typescript
enum CategoriaPet {
  CLINICA_VETERINARIA = 'clinica_veterinaria',    // Foco médico/saúde
  PET_SHOP = 'pet_shop',                          // Produtos/comercial
  BANHO_TOSA = 'banho_tosa',                      // Estética/bem-estar
  HOTEL_PET = 'hotel_pet',                        // Hospedagem/serviços
  ADESTRAMENTO = 'adestramento',                  // Comportamento/treino
  NUTRICAO_ANIMAL = 'nutricao_animal'             // Alimentação especializada
}
```

#### Inteligência Artificial (Baseado em P9-calendario-sazonalidades.ts)

**Auto-sugestão Inteligente**:
```typescript
interface SugestaoIA {
  evento_sugerido: string;
  categoria_detectada: CategoriaPet;
  data_ideal: string;
  justificativa: string;
  confianca_score: number; // 0.0-1.0
  campanhas_relacionadas: ConteudoSazonal[];
}
```

**Análise Preditiva**:
- Machine Learning para detectar padrões históricos
- Correlação com dados de Social Listening (P10)
- Previsão de demanda por categoria
- Alertas proativos 15 dias antes de eventos críticos

**Compliance Veterinário Automático**:
- Validação de termos médicos (base CFMV)
- Sugestão de disclaimers obrigatórios  
- Alerta para regulamentações regionais
- Integração com Repositório de Evidências

## ✅ Critérios de Aceite Técnicos

### Performance
- [ ] **APIs < 200ms** (P95 para consultas básicas)
- [ ] **Frontend < 2s** (First Contentful Paint em 4G)
- [ ] **1000+ eventos por usuário** sem degradação
- [ ] **Scroll virtualizado** para listas grandes
- [ ] **Caching otimizado** com React Query (5min stale time)

### UX/UI
- [ ] **Interface responsiva** em todas as resoluções (320px+)
- [ ] **Drag & drop** para reposicionar eventos no grid
- [ ] **Filtros persistem** durante a sessão
- [ ] **Preview automático** de campanhas sugeridas
- [ ] **Keyboard navigation** completamente funcional
- [ ] **Dark/Light mode** suportados

### Segurança & Compliance
- [ ] **RLS policies** testadas com 100+ cenários
- [ ] **Dados sensíveis** não expostos em logs
- [ ] **LGPD compliance** para dados de eventos
- [ ] **Rate limiting** em APIs (100 req/min/user)
- [ ] **Input sanitization** em todos os campos
- [ ] **CSRF protection** implementada

### Acessibilidade  
- [ ] **WCAG 2.1 AA** compliance verificada
- [ ] **Screen reader** navegação completa
- [ ] **Focus management** em modais e grids
- [ ] **Color contrast** > 4.5:1 em todos os elementos
- [ ] **Keyboard shortcuts** para ações principais
- [ ] **ARIA labels** contextualizadas

## 🔗 Integrações Obrigatórias

### Com Artefatos Existentes

#### P10-social-listening.ts
```typescript
// Detectar tendências sazonais emergentes
interface IntegracaoSocialListening {
  hashtags_emergentes: string[];
  sentimento_sazonal: 'positivo' | 'neutro' | 'negativo';
  oportunidades_detectadas: {
    topico: string;
    volume_mencoes: number;
    score_oportunidade: number;
  }[];
}
```

#### P11-insights-mercado.tsx  
```typescript
// Exibir dados do calendário no dashboard principal
interface CalendarioMetrics {
  eventos_mes_atual: number;
  eventos_proximos_7_dias: SazonalidadeResponse[];
  categoria_mais_ativa: string;
  compliance_score: number; // % eventos com disclaimers
}
```

#### P5-sistema-temas-mae.ts
```typescript
// Gerar conteúdo automático baseado em eventos
interface ConteudoSazonal {
  evento_id: string;
  tema_mae_sugerido: string;
  pilares_aplicaveis: string[];
  conteudo_gerado: {
    titulo: string;
    descricao: string;
    call_to_action: string;
    hashtags: string[];
  };
}
```

### Com Sistema Atual

#### Manual da Marca
```typescript
// Aplicar brand voice nos eventos sugeridos
interface BrandVoiceCalendario {
  evento_personalizado: string;
  tom_adequado: string;
  termos_aprovados: string[];
  restricoes_categoria: string[];
}
```

#### Dashboard Principal
```typescript
// Widget de próximos eventos no dashboard
interface CalendarioWidget {
  proximos_3_eventos: SazonalidadeResponse[];
  alertas_criticos: number;
  sugestoes_pendentes: number;
  compliance_status: 'ok' | 'warning' | 'error';
}
```

#### Sistema de Notificações
```typescript
// Alertas automáticos de eventos próximos
interface NotificacaoSazonal {
  evento_id: string;
  dias_antecedencia: number;
  tipo_alerta: 'email' | 'push' | 'dashboard';
  mensagem_personalizada: string;
  campanhas_sugeridas: ConteudoSazonal[];
}
```

## 📊 Métricas de Sucesso

### Técnicas
- [ ] **0 erros críticos** em produção (primeira semana)
- [ ] **100% cobertura** das APIs com testes unitários
- [ ] **< 3 bugs P1** reportados na primeira semana
- [ ] **99.5% uptime** durante o primeiro mês
- [ ] **Performance budget** mantido (< 100kb JS inicial)

### Produto
- [ ] **+80% usuários** criam pelo menos 5 eventos (primeiro mês)
- [ ] **+60% engajamento** em campanhas sazonais sugeridas
- [ ] **+40% receita** de clientes usando calendário ativamente
- [ ] **90% satisfaction** score em pesquisa pós-implementação
- [ ] **< 2 min** para criar primeiro evento (onboarding)

### Negócio
- [ ] **15% redução** em eventos perdidos por clientes
- [ ] **25% aumento** em campanhas preventivas executadas
- [ ] **ROI 3:1** em primeiro trimestre de uso
- [ ] **30% melhoria** em compliance veterinário

## ⚠️ Riscos e Mitigações

### Riscos Técnicos

#### Risco: Performance com Muitos Eventos
**Probabilidade**: Media | **Impacto**: Alto
**Mitigação**: 
- Implementar paginação no backend (50 eventos/página)
- Cache Redis para queries frequentes
- Virtualização de scroll para listas grandes
- Lazy loading de componentes pesados

#### Risco: Complexidade do Drag & Drop
**Probabilidade**: Alta | **Impacto**: Medio  
**Mitigação**:
- Usar biblioteca testada (react-beautiful-dnd)
- Implementar fallback com botões move up/down
- Progressive enhancement approach
- Testes extensivos em touch devices

#### Risco: Integração com APIs Externas
**Probabilidade**: Media | **Impacto**: Medio
**Mitigação**:
- Timeout configurável (5s) para APIs externas
- Fallback para dados cached
- Circuit breaker pattern
- Monitoramento de health checks

### Riscos de Produto

#### Risco: Eventos Irrelevantes para Usuário  
**Probabilidade**: Alta | **Impacto**: Alto
**Mitigação**:
- Machine Learning para personalização
- Onboarding para detectar tipo de negócio
- Feedback loop para melhorar sugestões
- Possibilidade de desabilitar categorias

#### Risco: Overload de Informação
**Probabilidade**: Media | **Impacto**: Medio
**Mitigação**:
- Interface progressiva (começar simples)
- Filtros inteligentes pré-configurados
- Agrupamento automático por prioridade
- Dashboard focado em próximos eventos

#### Risco: Baixa Adoção de Features IA
**Probabilidade**: Media | **Impacto**: Alto
**Mitigação**:
- Demonstrar valor nas primeiras interações
- Explicar benefícios de cada sugestão
- A/B test diferentes abordagens de UI
- Gamificação para incentivar uso

## 📁 Arquivos a Serem Criados

### Backend (API Routes)
```
src/app/api/calendario/
├── route.ts                     # GET /api/calendario, POST /api/calendario
├── [id]/
│   └── route.ts                 # GET/PUT/DELETE /api/calendario/[id]
├── insights/
│   └── route.ts                 # GET /api/calendario/insights
├── presets/
│   └── route.ts                 # GET /api/calendario/presets
└── sugestoes/
    └── route.ts                 # GET /api/calendario/sugestoes
```

### Frontend (Páginas)
```
src/app/(dashboard)/calendario/
├── page.tsx                     # Página principal do calendário
├── [id]/
│   └── page.tsx                 # Página de detalhes/edição de evento
└── insights/
    └── page.tsx                 # Página de analytics detalhados
```

### Componentes
```
src/components/calendario/
├── CalendarioPage.tsx           # Container principal
├── CalendarioHeader.tsx         # Header com filtros e ações
├── CalendarioGrid.tsx           # Grid mensal/semanal
├── EventoCard.tsx               # Card de evento individual
├── EventoModal.tsx              # Modal criar/editar
├── FiltrosCalendario.tsx        # Filtros avançados
├── InsightsPanel.tsx            # Painel de insights lateral
├── SazonalidadesPreset.tsx      # Eventos pré-cadastrados
├── CalendarioSkeleton.tsx       # Loading skeleton
├── EventoQuickActions.tsx       # Ações rápidas para eventos
├── CalendarioExport.tsx         # Exportação de dados
└── index.ts                     # Re-exports centralizados
```

### Hooks e Utilitários
```
src/hooks/calendario/
├── useCalendarioEventos.ts      # Hook para listar eventos
├── useCreateEvento.ts           # Hook para criar evento
├── useUpdateEvento.ts           # Hook para editar evento
├── useDeleteEvento.ts           # Hook para deletar evento
├── useCalendarioInsights.ts     # Hook para insights
├── useCalendarioFilters.ts      # Hook para filtros persistidos
└── index.ts                     # Re-exports

src/lib/calendario/
├── calendario-utils.ts          # Funções utilitárias
├── sazonalidades-preset.ts      # Base de dados de eventos
├── calendario-types.ts          # Tipos TypeScript
├── calendario-constants.ts      # Constantes
└── calendario-validations.ts    # Validadores
```

### Testes
```
src/test/calendario/
├── api/
│   ├── calendario.test.ts       # Testes das APIs
│   └── insights.test.ts         # Testes de insights
├── components/
│   ├── CalendarioGrid.test.tsx  # Testes do grid
│   ├── EventoModal.test.tsx     # Testes do modal
│   └── EventoCard.test.tsx      # Testes do card
├── hooks/
│   └── useCalendarioEventos.test.ts # Testes dos hooks
├── e2e/
│   ├── calendario-crud.spec.ts  # Testes E2E CRUD
│   ├── calendario-filters.spec.ts # Testes E2E filtros
│   └── calendario-responsive.spec.ts # Testes responsivos
└── __mocks__/
    └── calendario-mocks.ts      # Mocks para testes
```

## 🚀 Cronograma de Execução

### Sprint 9 (Dias 1-3)
**Foco**: Foundation & Backend
- ✅ Day 1: Análise detalhada P1/P2/P9 + Setup inicial
- ✅ Day 2: APIs Route implementation + RLS policies  
- ✅ Day 3: API testing + validation + documentation

### Sprint 10 (Dias 4-7)  
**Foco**: Frontend Core
- ✅ Day 4: CalendarioPage + CalendarioHeader components
- ✅ Day 5: CalendarioGrid + EventoCard components
- ✅ Day 6: EventoModal + CRUD functionality
- ✅ Day 7: Integration testing + bug fixes

### Sprint 11 (Dias 8-10)
**Foco**: Advanced Features & Polish
- ✅ Day 8: IA suggestions + InsightsPanel + SazonalidadesPreset
- ✅ Day 9: Advanced filters + search + performance optimization
- ✅ Day 10: E2E testing + deployment + monitoring setup

### Milestones
- **Milestone 1** (Day 3): ✅ Backend APIs functional
- **Milestone 2** (Day 6): ✅ Frontend MVP working
- **Milestone 3** (Day 8): ✅ AI features integrated  
- **Milestone 4** (Day 10): ✅ Production ready

## 🎯 Definition of Done

### Técnico
- [ ] Código passa em todos os testes (unit + integration + e2e)
- [ ] Performance targets atingidos (< 200ms APIs, < 2s frontend)
- [ ] Acessibilidade validada (WCAG 2.1 AA)
- [ ] Documentação técnica atualizada
- [ ] Security review aprovado
- [ ] Browser testing completo (Chrome, Firefox, Safari, Mobile)

### Funcional  
- [ ] Todos os casos de uso testados
- [ ] Integrações com P10/P11/P5 funcionando
- [ ] 25+ eventos veterinários cadastrados
- [ ] Sistema de sugestões IA operacional
- [ ] Filtros e busca performando adequadamente
- [ ] Mobile experience otimizada

### Negócio
- [ ] Demo aprovada pelo Product Owner
- [ ] Treinamento da equipe realizado
- [ ] Documentação do usuário criada
- [ ] Métricas de sucesso implementadas
- [ ] Plano de rollout definido
- [ ] Suporte L1/L2 treinado

---

## 📞 Suporte e Escalação

**Tech Lead**: Responsável por decisões arquiteturais e review
**Backend Developer**: APIs, database, performance  
**Frontend Developer**: UI/UX, componentes, integração
**AI Engineer**: Sugestões inteligentes, compliance
**Data Analyst**: Insights, métricas, analytics  
**QA Engineer**: Testes, qualidade, acessibilidade
**DevOps Specialist**: Deploy, monitoramento, infraestrutura

**Daily Standups**: 9h00 (15min max)
**Sprint Review**: Sexta-feira 16h00
**Retrospective**: Sexta-feira 16h30

---

**Criado em:** 25 de agosto de 2025  
**Baseado em:** Artefatos P1, P2, P9, P10, P12 + @docs/architecture + @agents/README.md  
**Status:** ✅ Executável  
**Estimativa Total:** 21 pontos / 10 dias úteis  
**Próximo Passo:** Aprovação do Tech Lead → Início da implementação