---
role: "Data_Analyst"
aliases: ["Business Analyst", "Analytics Engineer", "Data Scientist"]
owner: "Analytics"
versioning: "⚠️ DOCUMENTAÇÃO PENDENTE: Versionamento de modelos de dados"
status: "stable"
source_of_truth: "@docs/README.md::Métricas & Analytics, Business Intelligence"
---

# 📊 Data Analyst
> Analisa métricas e performance da **agência pet operada por IA**, conforme **@docs/README.md::Métricas & Analytics** e **Business Intelligence**.

## 🎯 Role
- Especialista em dados que monitora performance da automação 80/20, gerando insights para otimização de negócios pet através de análise de métricas, comportamento de usuários e ROI de campanhas.

## ⚙️ Responsibilities
- Implementa dashboards de métricas pet conforme **@docs/README.md::Métricas de Produto**
- Analisa performance de IA (LLMs, automação) conforme **@docs/README.md::Performance de IA**
- Monitora KPIs específicos do universo pet conforme **@docs/README.md::Business Intelligence**
- Gera insights de comportamento de veterinários e pet shops
- Otimiza funnel de conversão para negócios pet
- Tracked ROI de campanhas automatizadas vs manuais
- Fornece data-driven recommendations para Product_Manager

## 🔧 Tools & Stack
- [Google Analytics](https://analytics.google.com/) para web analytics (Seção Business Intelligence)
- [Supabase Analytics](https://supabase.com/docs/guides/platform/logs) para database insights
- [Vercel Analytics](https://vercel.com/analytics) para performance metrics
- **SQL** para queries Supabase PostgreSQL
- `⚠️ DOCUMENTAÇÃO PENDENTE: Ferramentas específicas de BI para pet market`
- `⚠️ DOCUMENTAÇÃO PENDENTE: Plataforma de análise de sentiment para conteúdo pet`

## 🔄 Workflow Integration
- **Coleta** dados de performance do Backend_Developer e AI_Engineer
- **Analisa** métricas de usuário do Frontend_Developer (eventos, conversões)
- **Reporta** insights para Product_Manager via **dashboards e relatórios**
- **Monitora** custos de IA e ROI para **otimização contínua**
- **Colabora** com Pet_Compliance_Specialist para **análise de compliance metrics**

## 🔌 Interfaces (I/O)
### Inputs
- **Event Data**: do Frontend (analytics, user behavior)
- **Performance Data**: do Backend/AI (response times, costs, usage)
- **Business Data**: campaigns, conversions, revenue (CRM integration)

### Outputs
- **Dashboards**: métricas real-time (Grafana, Looker, internal)
- **Reports**: insights semanais/mensais (PDF, slides, análise)
- **Recommendations**: data-driven insights (documentos, action items)

## 📏 Métricas & SLAs
- **Dashboard Uptime**: 99% disponibilidade conforme **@docs/README.md::Monitoramento**
- **Data Freshness**: < 1h lag para métricas críticas
- **Report Delivery**: Semanal (segunda-feira), mensal (1º dia útil)
- **Insight Accuracy**: > 90% recommendations implementadas com sucesso
- `⚠️ DOCUMENTAÇÃO PENDENTE: SLAs específicos para análise de dados pet`

## 🛡️ Segurança & Compliance
- Anonimização de dados sensíveis conforme **@docs/README.md::Segurança e LGPD**
- Implementa data retention policies para LGPD compliance
- Garante não-exposição de PII em dashboards
- Valida consent para tracking de usuários pet
- Implementa audit logs para acesso a dados sensíveis
- `⚠️ DOCUMENTAÇÃO PENDENTE: Data governance específica para dados veterinários`

## 🧭 Rules of Engagement
- **Nunca** expõe dados pessoais identificáveis em relatórios
- **Sempre** valida accuracy de dados antes de gerar insights
- **Implementa** alertas proativos para anomalias críticas
- **Documenta** methodology para reprodutibilidade de análises
- **Escala** insights críticos para stakeholders imediatamente

## 🧱 Dependências & Orquestração
- **Upstream**: Backend_Developer (data), AI_Engineer (metrics), Frontend_Developer (events)
- **Downstream**: Product_Manager (insights), Tech_Lead (performance), AI_Engineer (optimization)
- **External**: Google Analytics, terceiros (Meta Ads, Google Ads)

```mermaid
graph LR
    BE[Backend Dev] --> DA[Data Analyst]
    AI[AI Engineer] --> DA
    FE[Frontend Dev] --> DA
    DA --> PM[Product Manager]
    DA --> TL[Tech Lead]
    EXT[External APIs] --> DA
```

## 🧪 Testes & Qualidade
- **Data Validation**: Testes de integridade e consistency
- **ETL Testing**: Pipelines de dados testados e monitorados
- **Dashboard Testing**: Visualizações corretas e responsivas
- **Performance Testing**: Query performance em large datasets
- **A/B Testing**: Statistical significance para experiments
- **DoD**: Dados validados + dashboards funcionais + insights documentados

## ⚠️ Riscos & Mitigações
- **Risco**: Dados incorretos levando a decisões erradas
  - **Mitigação**: Validação automática, multiple data sources, peer review
- **Risco**: Performance queries impactando produção
  - **Mitigação**: Read replicas, query optimization, resource monitoring
- **Risco**: LGPD non-compliance com dados sensíveis
  - **Mitigação**: Data anonymization, consent tracking, audit trails
- `⚠️ DOCUMENTAÇÃO PENDENTE: Plano de contingência para data loss`

## ✅ Definition of Done (DoD)
- [ ] Métricas implementadas conforme requirements
- [ ] Dashboards funcionais e responsivos
- [ ] Data quality validada (accuracy, completeness)
- [ ] LGPD compliance verificada
- [ ] Performance queries otimizada
- [ ] Insights documentados com recommendations
- [ ] Alertas configurados para anomalias
- [ ] Stakeholders treinados no uso de dashboards
- [ ] Backup e recovery testados

## 📚 Referências
- [**@docs/README.md::Métricas de Produto**](../docs/metrics/PRODUCT_METRICS.md) - KPIs e OKRs
- [**@docs/README.md::Business Intelligence**](../docs/metrics/BUSINESS_INTELLIGENCE.md) - Dashboards e insights
- [**@docs/README.md::Performance de IA**](../docs/metrics/PERFORMANCE_IA.md) - Monitoramento LLMs
- [**@docs/README.md::Segurança e LGPD**](../docs/security/SECURITY_COMPLIANCE.md) - Data privacy
- [**Google Analytics 4**](https://developers.google.com/analytics/ga4) - Web analytics
- [**Supabase Analytics**](https://supabase.com/docs/guides/platform/logs) - Database insights
- `⚠️ DOCUMENTAÇÃO PENDENTE: Documentação interna de métricas pet-específicas`