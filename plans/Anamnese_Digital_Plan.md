# 🔍 Anamnese Digital - Plano Executável

## 🎯 Feature Scope  
- **Fonte:** `@docs/features/ANAMNESE_DIGITAL.md` - Sistema de análise estratégica de sites e redes sociais
- **Critérios de Aceitação:**  
  - Input para URL do site com validação automática de formato implementado
  - Campos dinâmicos para múltiplas redes sociais com add/remove funcional
  - Verificação de duplicatas para evitar reprocessamento desnecessário
  - Armazenamento completo no Supabase com associação por usuário autenticado
  - Interface de visualização organizada em cards para todos os componentes da análise
  - Gestão completa: histórico, reprocessamento e exclusão de análises
- **Status Atual:** ✅ Implementado com simulação de IA conforme `@docs/features/ANAMNESE_DIGITAL.md`

## 📋 Task Breakdown  

### Core Implementation (✅ COMPLETO)
- **[✅] Implementar Database Schema Anamneses**  
  - **Responsible Agent:** `Backend_Developer` (conforme `@agents/README.md#backend-developer`)  
  - **Tools & Stack:** PostgreSQL, Supabase, RLS policies, triggers  
  - **Dependencies:** Sistema de autenticação funcionando  
  - **Effort Estimate:** 6 pontos de história  

- **[✅] Criar TypeScript Types para Estrutura de Dados**  
  - **Responsible Agent:** `Backend_Developer`  
  - **Tools & Stack:** TypeScript, interface definitions, type guards  
  - **Dependencies:** Database schema finalizado  
  - **Effort Estimate:** 4 pontos de história  

- **[✅] Desenvolver Hook useAnamneseDigital**  
  - **Responsible Agent:** `Frontend_Developer` (conforme `@agents/README.md#frontend-developer`)  
  - **Tools & Stack:** React hooks, Supabase client, error handling  
  - **Dependencies:** Types definidos, database acessível  
  - **Effort Estimate:** 8 pontos de história  

- **[✅] Implementar Interface de Entrada de Dados**  
  - **Responsible Agent:** `Frontend_Developer`  
  - **Tools & Stack:** React Hook Form, Zod validation, dynamic fields  
  - **Dependencies:** Hook implementado  
  - **Effort Estimate:** 6 pontos de história  

- **[✅] Criar Componente AnamneseResults**  
  - **Responsible Agent:** `Frontend_Developer`  
  - **Tools & Stack:** React, Tailwind CSS, conditional rendering  
  - **Dependencies:** Interface de entrada funcionando  
  - **Effort Estimate:** 10 pontos de história  

- **[✅] Implementar Sistema de Gestão (CRUD)**  
  - **Responsible Agent:** `Backend_Developer`  
  - **Tools & Stack:** Supabase queries, soft delete, pagination  
  - **Dependencies:** Todos os componentes base implementados  
  - **Effort Estimate:** 6 pontos de história  

### AI Integration (🔄 ALTA PRIORIDADE)
- **[ ] Substituir Simulação por Integração Real com OpenAI**  
  - **Responsible Agent:** `Backend_Developer`  
  - **Tools & Stack:** OpenAI GPT-4 API, structured prompts, JSON parsing  
  - **Dependencies:** Depende de `AI_Integration_Plan.md`  
  - **Effort Estimate:** 15 pontos de história  

- **[ ] Implementar Web Scraping para Coleta de Dados**  
  - **Responsible Agent:** `Backend_Developer`  
  - **Tools & Stack:** Puppeteer, DOM parsing, content extraction, rate limiting  
  - **Dependencies:** OpenAI integration básica funcionando  
  - **Effort Estimate:** 12 pontos de história  

- **[ ] Integrar Análise de Performance (Lighthouse)**  
  - **Responsible Agent:** `Backend_Developer`  
  - **Tools & Stack:** Lighthouse CI, PageSpeed Insights API, performance metrics  
  - **Dependencies:** Web scraping implementado  
  - **Effort Estimate:** 8 pontos de história  

- **[ ] Desenvolver Sistema de Cache para URLs Similares**  
  - **Responsible Agent:** `Backend_Developer`  
  - **Tools & Stack:** Redis, URL normalization, cache invalidation  
  - **Dependencies:** AI integration estável  
  - **Effort Estimate:** 6 pontos de história  

### UX Enhancements
- **[ ] Implementar Upload de Screenshots**  
  - **Responsible Agent:** `Frontend_Developer`  
  - **Tools & Stack:** Supabase Storage, drag & drop, image preview  
  - **Dependencies:** Depende de `Asset_Management_System_Plan.md`  
  - **Effort Estimate:** 8 pontos de história  

- **[ ] Criar Gráficos e Visualizações de Dados**  
  - **Responsible Agent:** `Frontend_Developer`  
  - **Tools & Stack:** Chart.js ou D3.js, performance metrics visualization  
  - **Dependencies:** Dados reais de análise disponíveis  
  - **Effort Estimate:** 10 pontos de história  

- **[ ] Desenvolver Export para PDF/Word**  
  - **Responsible Agent:** `Backend_Developer`  
  - **Tools & Stack:** Puppeteer, template engine, document generation  
  - **Dependencies:** Visualizações implementadas  
  - **Effort Estimate:** 8 pontos de história  

- **[ ] Implementar Sistema de Comparação (Antes/Depois)**  
  - **Responsible Agent:** `Frontend_Developer`  
  - **Tools & Stack:** React comparison components, diff visualization  
  - **Dependencies:** Histórico de análises funcionando  
  - **Effort Estimate:** 6 pontos de história  

### Performance & Optimization
- **[ ] Implementar Processamento em Background**  
  - **Responsible Agent:** `DevOps_Specialist` (conforme `@agents/README.md#devops-specialist`)  
  - **Tools & Stack:** Background jobs, queue system, webhook notifications  
  - **Dependencies:** AI integration implementada  
  - **Effort Estimate:** 10 pontos de história  

- **[ ] Criar Sistema de Notificações Push**  
  - **Responsible Agent:** `Frontend_Developer`  
  - **Tools & Stack:** Web Push API, service workers, notification system  
  - **Dependencies:** Background processing funcionando  
  - **Effort Estimate:** 6 pontos de história  

- **[ ] Implementar Versionamento de Análises**  
  - **Responsible Agent:** `Backend_Developer`  
  - **Tools & Stack:** Database versioning, migration scripts, rollback system  
  - **Dependencies:** Sistema base estável  
  - **Effort Estimate:** 8 pontos de história  

## 📅 Timeline & Milestones  
- **✅ Fase 1 (01/07 - 31/07):** Core implementation com simulação IA
- **Fase 2 (01/09 - 15/09):** AI integration real substituindo simulação  
- **Fase 3 (20/09 - 10/10):** UX enhancements e visualizações  
- **Fase 4 (15/10 - 31/10):** Performance optimization e background processing  
- **Checkpoint de Qualidade:** Revisão do `QA_Engineer` com cobertura de teste ≥85% antes de cada fase

## ✅ Success Metrics  
- **Precisão da IA:** ≥90% de satisfação dos usuários com qualidade das análises (validado via CSAT específico)
- **Performance:** Análise completa processada em <5 minutos (validado via logs de sistema)
- **Adoção:** 60% dos usuários fazem pelo menos 1 anamnese por mês (validado via analytics Supabase)
- **Retenção:** 80% dos usuários que fazem anamnese fazem segunda dentro de 30 dias (validado via cohort analysis)
- **Qualidade Técnica:** 0 timeouts ou erros críticos durante processamento (validado via error tracking)

## ⚠️ Open Questions & Risks  

### Questões Pendentes
- [⚠️ DOCUMENTAÇÃO PENDENTE: Critérios específicos para qualidade de análise de IA não definidos]
- [⚠️ DOCUMENTAÇÃO PENDENTE: Limites de processamento por usuário/plano não especificados]
- [⚠️ DOCUMENTAÇÃO PENDENTE: Estratégia para websites com proteção anti-bot não documentada]
- [⚠️ DOCUMENTAÇÃO PENDENTE: Estrutura de prompts para diferentes tipos de negócios pet não definida]

### Riscos Identificados
- [⚠️ RISCO: OpenAI API pode ter instabilidade ou mudanças de pricing que afetem custos]
- [⚠️ RISCO: Websites com CAPTCHA ou proteção anti-bot podem bloquear análise]
- [⚠️ RISCO: Análise de sites grandes pode consumir muito tempo e recursos]
- [⚠️ RISCO: Dados extraídos podem ter inconsistências que quebrem a análise]

### Dependências Críticas
- **Hard Dependency:** OpenAI API deve ter quota adequada para volume esperado
- **Hard Dependency:** Supabase deve suportar operações complexas com JSONB
- **Soft Dependency:** Sistema de notificações deve estar implementado para UX
- **External Dependency:** Websites analisados devem ser acessíveis publicamente

### Mitigações Propostas
1. **API Stability:** Implementar retry logic e fallback para análise manual
2. **Bot Protection:** Usar rotating proxies e delays inteligentes
3. **Resource Management:** Implementar timeouts e limits por análise
4. **Data Quality:** Validação rigorosa de dados extraídos antes do processamento
5. **Cost Control:** Monitoramento em tempo real de custos de API

---

**Baseado em:** `@docs/features/ANAMNESE_DIGITAL.md`  
**Database Schema:** `sql/anamneses_digitais.sql`  
**Alinhamento com Métricas:** `@docs/metrics/PRODUCT_METRICS.md#métricas-de-ativação`  

**Status:** ✅ Core implementado com simulação, AI integration prioritária  
**Próxima Revisão:** 01/09/2025
