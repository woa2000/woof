# 📊 Plano Estratégico: Implementação de Mocks para População de Dados

**Plano criado em:** 24 de agosto de 2025  
**Status:** 🔄 Pronto para execução  
**Agente principal:** Backend Developer  
**Complexidade:** Média  

## 🎯 Objetivo

Implementar o uso sistemático de mocks para popular todos os objetos da Plataforma Woof Marketing, com exceção dos usuários que continuarão utilizando o Supabase Auth.

## 📋 Contexto e Análise

### Situação Atual
- ✅ Sistema de mocks já implementado em `src/lib/mocks/`
- ✅ 8 domínios cobertos: users, brands, anamnese, manual de marca, campanhas, conteúdo, analytics, compliance
- ✅ Factory functions para geração dinâmica de dados
- ⚠️ Mocks não estão sendo utilizados sistematicamente na aplicação
- ⚠️ Dados reais do Supabase misturados com dados mockados

### Requisitos Identificados
1. **Manter autenticação Supabase** - Usuários reais via Supabase Auth
2. **Popular demais entidades** - Usar mocks para brands, campanhas, anamneses, etc.
3. **Desenvolvimento eficiente** - Facilitar desenvolvimento local sem dependências externas
4. **Dados consistentes** - Garantir qualidade dos dados para demos e testes

## 🤖 Orquestração de Agentes

### 🔵 Agente Principal: Backend Developer
**Responsabilidade:** Liderar implementação da integração de mocks
- Criar sistema de integração mock/real data
- Implementar providers de dados híbridos
- Configurar environment flags para controle
- Coordenar com demais agentes

### 🟡 Agentes Secundários

#### Frontend Developer
- Atualizar hooks e componentes para usar providers de dados
- Implementar interfaces de debug para visualização de mocks
- Adaptar componentes para trabalhar com dados mockados

#### AI Engineer  
- Configurar geração de conteúdo com dados mockados
- Implementar simulação de operações de IA
- Criar mock responses para LLM calls

#### QA Engineer
- Validar integridade dos dados mockados
- Criar testes de integração mock/real data
- Verificar compliance dos dados gerados

#### Pet Compliance Specialist
- Validar conformidade dos dados mockados com regras veterinárias
- Revisar conteúdo gerado pelos mocks
- Aprovar terminologias e disclaimers

#### Data Analyst
- Configurar métricas com dados mockados
- Validar relatórios e dashboards
- Definir KPIs para ambiente de desenvolvimento

## 🗂️ Fluxo de Desenvolvimento

### Etapa 1: Setup do Sistema Híbrido (Backend Developer)
**Duração:** 2 dias  
**Entradas:**
- Sistema de mocks existente (`src/lib/mocks/`)
- Configuração atual do Supabase
- Documentação de tipos de dados

**Ações:**
1. Criar `DataProviderService` com interface única
2. Implementar `MockDataProvider` e `SupabaseDataProvider`
3. Configurar environment variables para controle
4. Criar factory de providers baseado em configuração

**Saídas:**
- `/src/services/data-provider.service.ts`
- `/src/services/mock-data-provider.ts`  
- `/src/services/supabase-data-provider.ts`
- Configurações de ambiente atualizadas

**Validação:** QA Engineer testa switching entre mocks e dados reais

### Etapa 2: Integração com Hooks (Frontend Developer)
**Duração:** 3 dias  
**Entradas:**
- DataProviderService implementado
- Hooks existentes (useAnamneseDigital, useBrandManual, etc.)
- Componentes que consomem dados

**Ações:**
1. Refatorar hooks para usar DataProviderService
2. Implementar loading states consistentes
3. Adicionar error handling para ambos providers
4. Criar hooks de debug para visualização de dados

**Saídas:**
- Hooks refatorados para usar providers
- `/src/hooks/debug/useMockDataViewer.ts`
- `/src/components/debug/MockDataPanel.tsx`
- Interfaces de debug implementadas

**Validação:** Frontend funciona com mocks e dados reais sem alteração de código

### Etapa 3: Configuração de IA com Mocks (AI Engineer)
**Duração:** 2 dias  
**Entradas:**
- Mocks de conteúdo e operações de IA (`src/lib/mocks/content.ts`)
- Configuração atual de OpenAI
- Prompt engineering templates

**Ações:**
1. Implementar `MockAIProvider` para simular LLM calls
2. Configurar responses mockadas com base em templates
3. Implementar simulação de custos e métricas de IA
4. Criar logs mockados para debugging

**Saídas:**
- `/src/services/ai/mock-ai-provider.ts`
- Configuração de IA híbrida (mock/real)
- Templates de responses mockadas
- Sistema de métricas mockadas

**Validação:** Pet Compliance Specialist valida conteúdo gerado pelos mocks

### Etapa 4: Analytics e Métricas Mockadas (Data Analyst)
**Duração:** 1 dia  
**Entradas:**
- Mocks de analytics (`src/lib/mocks/analytics.ts`)
- Dashboards existentes
- KPIs definidos na documentação

**Ações:**
1. Configurar providers de métricas mockadas
2. Implementar simulação de dados temporais
3. Criar benchmarks da indústria pet mockados
4. Configurar relatórios automáticos

**Saídas:**
- `/src/services/analytics/mock-analytics-provider.ts`
- Dashboards funcionando com dados mockados
- Relatórios de performance simulados
- Métricas de benchmark configuradas

**Validação:** Dashboards mostram dados realistas e consistentes

### Etapa 5: Validação de Compliance (Pet Compliance Specialist)
**Duração:** 1 dia  
**Entradas:**
- Sistema completo com mocks integrados
- Regras de compliance (`src/lib/mocks/compliance.ts`)
- Conteúdo gerado pelos sistemas mockados

**Ações:**
1. Revisar todo conteúdo gerado pelos mocks
2. Validar terminologias veterinárias
3. Aprovar disclaimers e avisos legais
4. Criar checklist de compliance para mocks

**Saídas:**
- Aprovação de compliance para todos os mocks
- Checklist de validação atualizado
- Correções implementadas conforme necessário
- Documentação de compliance atualizada

**Validação:** Todos os mocks atendem requisitos de compliance veterinário

### Etapa 6: Testes e Documentação (QA Engineer)
**Duração:** 2 dias  
**Entradas:**
- Sistema completo implementado
- Todos os agentes validaram suas etapas
- Mocks integrados e funcionando

**Ações:**
1. Executar testes de integração completos
2. Testar switching entre mocks e dados reais
3. Validar performance com dados mockados
4. Documentar uso e configuração do sistema

**Saídas:**
- Suite de testes de integração atualizada
- Documentação de uso do sistema híbrido
- Performance benchmarks validados
- Manual de troubleshooting

**Validação:** Sistema funciona perfeitamente em dev, staging e produção

## ⚙️ Configuração Técnica

### Environment Variables
```bash
# Controle de providers de dados
MOCK_DATA_ENABLED=true
MOCK_AI_ENABLED=true
MOCK_ANALYTICS_ENABLED=true

# Supabase (sempre real para users)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (condicional)
OPENAI_API_KEY=sk-... # apenas se MOCK_AI_ENABLED=false
```

### Arquitetura de Providers
```typescript
interface DataProvider {
  brands: BrandProvider;
  campaigns: CampaignProvider; 
  anamneses: AnamneseProvider;
  content: ContentProvider;
  analytics: AnalyticsProvider;
}

class MockDataProvider implements DataProvider {
  // Usa dados de src/lib/mocks/
}

class SupabaseDataProvider implements DataProvider {  
  // Conecta com Supabase (exceto users)
}
```

## 📊 Métricas de Sucesso

### Critérios de Aceitação
- [ ] ✅ Usuários continuam via Supabase Auth sem alterações
- [ ] ✅ Todas as outras entidades usam mocks em desenvolvimento
- [ ] ✅ Switch entre mock/real data via environment vars
- [ ] ✅ Performance mantida ou melhorada
- [ ] ✅ Compliance veterinário validado em todos os mocks
- [ ] ✅ Documentação completa de uso
- [ ] ✅ Testes de integração passando

### KPIs Técnicos
- **Tempo de setup desenvolvimento:** < 5 minutos
- **Tempo de response mocks:** < 100ms
- **Coverage de testes:** > 85%
- **Compliance score:** 100%

## 🔄 Pontos de Coordenação

### Dailies de Coordenação
**Frequência:** Diária às 9h  
**Participantes:** Backend Developer (líder), Frontend Developer, AI Engineer

### Reviews Intermediários
- **Day 2:** Review do sistema híbrido (Backend + QA)
- **Day 5:** Review da integração completa (todos os agentes)
- **Day 8:** Review final e deployment (Tech Lead + Product Manager)

### Bloqueadores Identificados
1. **Dependência sequencial:** Frontend depende do Backend
2. **Validação de compliance:** Pode requerer ajustes nos mocks
3. **Performance testing:** Pode requerer otimizações

## 📚 Artefatos Finais

### Código
- [ ] `DataProviderService` implementado e testado
- [ ] Hooks refatorados para usar providers
- [ ] Sistema de IA mockado funcionando
- [ ] Analytics mockados integrados
- [ ] Compliance validado e aprovado

### Documentação
- [ ] Manual de uso do sistema híbrido
- [ ] Guia de desenvolvimento com mocks
- [ ] Troubleshooting guide
- [ ] Checklist de compliance atualizado

### Testes
- [ ] Testes unitários para providers
- [ ] Testes de integração mock/real
- [ ] Testes de performance
- [ ] Testes de compliance

## 🚀 Critério de Finalização

**Este plano está completo quando:**
1. Um agente de IA consegue configurar o ambiente de desenvolvimento em < 5 minutos
2. Todos os dados (exceto users) vêm de mocks em desenvolvimento
3. O switch entre mock/real data funciona via environment variables
4. Todos os mocks passaram na validação de compliance veterinário
5. A documentação permite qualquer desenvolvedor usar o sistema sem ajuda

---

**Aprovado por:** Tech Lead  
**Revisado por:** Pet Compliance Specialist  
**Validado por:** QA Engineer

*Este plano segue as diretrizes estabelecidas em @docs/README.md e foi criado seguindo a metodologia do prompt plano-simples.prompt.md*