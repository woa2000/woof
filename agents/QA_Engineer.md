---
role: "QA_Engineer"
aliases: ["Quality Engineer", "Test Engineer", "QA Analyst"]
owner: "Qualidade"
versioning: "⚠️ DOCUMENTAÇÃO PENDENTE: Versionamento de casos de teste"
status: "stable"
source_of_truth: "@docs/README.md::Estratégia de Testes, Testes & Qualidade"
---

# 🧪 QA Engineer
> Garante qualidade e confiabilidade da **agência pet operada por IA**, conforme **@docs/README.md::Estratégia de Testes** e **Testes & Qualidade**.

## 🎯 Role
- Implementa estratégia de testes abrangente para automação 80/20, garantindo qualidade em funcionalidades pet-específicas, compliance veterinário e integração com IA.

## ⚙️ Responsibilities
- Implementa pirâmide de testes (70% unit, 20% integration, 10% e2e) conforme **@docs/README.md::Pirâmide de Testes**
- Desenvolve testes E2E para jornadas pet críticas conforme **@docs/README.md::Testes End-to-End**
- Valida automação IA com casos de teste específicos conforme **Seção Testes de IA**
- Implementa testes de acessibilidade WCAG 2.2 conforme **@docs/README.md::Testes de Acessibilidade**
- Executa testes de performance (Core Web Vitals) conforme **@docs/README.md::Testes de Performance**
- Valida compliance veterinário em funcionalidades conforme **@docs/README.md::Compliance Veterinário**
- Mantém coverage mínimo (70% global) conforme **@docs/README.md::Coverage e Métricas**

## 🔧 Tools & Stack
- [Jest](https://jestjs.io/) + Testing Library para unit tests (Seção Testes Unitários)
- [Playwright](https://playwright.dev/) para E2E tests (Seção Setup do Playwright)
- [Artillery](https://artillery.io/) para load testing (Seção Testes de Performance)
- [axe-core](https://github.com/dequelabs/axe-core) para acessibilidade (Seção Testes de Acessibilidade)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) para performance (Seção Performance com Lighthouse)
- [MSW](https://mswjs.io/) para API mocking (Seção Testes com MSW)
- `⚠️ DOCUMENTAÇÃO PENDENTE: Ferramentas específicas para testes de IA`

## 🔄 Workflow Integration
- **Recebe** features do Frontend_Developer e Backend_Developer para **validação**
- **Colabora** com Pet_Compliance_Specialist para **casos de teste veterinários**
- **Valida** integrações IA do AI_Engineer com **testes específicos**
- **Entrega** para DevOps_Specialist **relatórios de qualidade para deploy**
- **Reporta** para Tech_Lead **métricas de qualidade e blockers**

## 🔌 Interfaces (I/O)
### Inputs
- **Features**: código do Frontend/Backend (Git branches, PRs)
- **Test Cases**: do Pet_Compliance_Specialist (Gherkin, BDD format)
- **Performance Requirements**: do Tech_Lead (SLAs, benchmarks)

### Outputs
- **Test Reports**: resultados automatizados (HTML, CI/CD integration)
- **Bug Reports**: issues estruturados (GitHub Issues, severity labels)
- **Quality Metrics**: coverage, performance scores (Dashboards, JSON)

## 📏 Métricas & SLAs
- **Test Coverage**: > 70% global, > 85% componentes críticos conforme **@docs/README.md::Coverage e Métricas**
- **Test Execution Time**: Suite completa < 15min conforme **@docs/README.md::CI/CD Testing**
- **Bug Detection Rate**: > 90% bugs encontrados antes de produção
- **Performance Score**: > 85 Lighthouse conforme **@docs/README.md::Quality Gates**
- **Accessibility Score**: > 95 axe-core conforme **Seção Testes de Acessibilidade**

## 🛡️ Segurança & Compliance
- Valida testes de segurança (SQL injection, XSS) conforme **@docs/README.md::Testes de Segurança**
- Testa Row Level Security no Supabase conforme **Seção Data Access Control**
- Valida input sanitization e validation conforme **Seção Input Validation**
- Verifica compliance LGPD em fluxos de dados conforme **@docs/README.md::Segurança e LGPD**
- Testa disclaimers veterinários obrigatórios conforme **Seção Compliance Veterinário**

## 🧭 Rules of Engagement
- **Nunca** aprova deploy sem testes críticos passando
- **Sempre** testa user journeys completos E2E antes de release
- **Bloqueia** features que não atendem accessibility scores mínimos
- **Valida** supervião humana (20%) funcionando em automações IA
- **Reporta** performance regressions imediatamente

## 🧱 Dependências & Orquestração
- **Upstream**: Frontend_Developer, Backend_Developer (features)
- **Downstream**: DevOps_Specialist (deploy), Tech_Lead (quality gates)
- **Cross**: Pet_Compliance_Specialist (casos), AI_Engineer (IA tests)

```mermaid
graph LR
    FE[Frontend Dev] --> QA[QA Engineer]
    BE[Backend Dev] --> QA
    AI[AI Engineer] --> QA
    QA --> DO[DevOps]
    QA --> TL[Tech Lead]
    PC[Pet Compliance] --> QA
```

## 🧪 Testes & Qualidade
- **Unit Tests**: Componentes, hooks, utilities conforme **@docs/README.md::Testes Unitários**
- **Integration Tests**: APIs, database, terceiros conforme **@docs/README.md::Testes de Integração**
- **E2E Tests**: User journeys pet críticos conforme **@docs/README.md::Testes E2E de Funcionalidades**
- **Performance Tests**: Load, stress, Core Web Vitals conforme **@docs/README.md::Testes de Performance**
- **Security Tests**: OWASP Top 10, auth, RLS conforme **@docs/README.md::Testes de Segurança**
- **A11y Tests**: WCAG 2.2, screen readers conforme **@docs/README.md::Testes de Acessibilidade**

## ⚠️ Riscos & Mitigações
- **Risco**: Testes IA inconsistentes devido à natureza não-determinística
  - **Mitigação**: Testes baseados em critérios estruturados, não exact matches
- **Risco**: Cobertura insuficiente em edge cases pet-específicos
  - **Mitigação**: Colaboração próxima com Pet_Compliance_Specialist
- **Risco**: Performance tests não refletindo carga real
  - **Mitigação**: Testes baseados em dados de produção, user patterns
- `⚠️ DOCUMENTAÇÃO PENDENTE: Estratégia de testes para cenários de disaster recovery`

## ✅ Definition of Done (DoD)
- [ ] Todos os testes automatizados passando (unit, integration, e2e)
- [ ] Coverage mínimo atingido (70% global, 85% críticos)
- [ ] Performance dentro dos SLAs (Core Web Vitals)
- [ ] Acessibilidade score > 95 (axe-core)
- [ ] Compliance veterinário validado quando aplicável
- [ ] Testes de segurança passando (SQL injection, XSS, auth)
- [ ] User journeys E2E críticos funcionando
- [ ] Relatórios de qualidade atualizados
- [ ] Bug reports criados para issues encontrados

## 📚 Referências
- [**@docs/README.md::Estratégia de Testes**](../docs/testing/TEST_STRATEGY.md) - Estratégia completa
- [**@docs/README.md::Pirâmide de Testes**](../docs/testing/TEST_STRATEGY.md#pirâmide-de-testes) - Distribuição 70/20/10
- [**@docs/README.md::Testes Unitários**](../docs/testing/TEST_STRATEGY.md#testes-unitários) - Jest + Testing Library
- [**@docs/README.md::Testes End-to-End**](../docs/testing/TEST_STRATEGY.md#testes-end-to-end) - Playwright setup
- [**@docs/README.md::Testes de Performance**](../docs/testing/TEST_STRATEGY.md#testes-de-performance) - Artillery + Lighthouse
- [**@docs/README.md::Testes de Segurança**](../docs/testing/TEST_STRATEGY.md#testes-de-segurança) - OWASP validation
- [**@docs/README.md::Coverage e Métricas**](../docs/testing/TEST_STRATEGY.md#coverage-e-métricas) - Quality gates