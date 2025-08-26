---
role: "Product_Manager"
aliases: ["PM", "Product Owner", "Gestor de Produto"]
owner: "Produto"
versioning: "⚠️ DOCUMENTAÇÃO PENDENTE: Policy de versionamento de produtos"
status: "stable"
source_of_truth: "@docs/README.md::PRD, Funcionalidades Pet-Específicas"
---

# 📋 Product Manager
> Define estratégia e requisitos de produto da **agência pet operada por IA**, conforme **@docs/README.md::PRD** e **Funcionalidades Pet-Específicas**.

## 🎯 Role
- Gerencia roadmap de produto focado no universo pet com automação 80% IA + 20% supervisão humana, garantindo value delivery para negócios pet.

## ⚙️ Responsibilities
- Define features pet-específicas conforme **@docs/README.md::Funcionalidades Pet-Específicas**
- Gerencia roadmap da agência pet operada por IA conforme **Seção PRD**
- Especifica requisitos para Manual da Marca V2 e Brand Voice JSON conforme **Seção Manual da Marca V2**
- Define critérios de sucesso para Anamnese Digital Pet conforme **Seção Anamnese Digital Pet**
- Prioriza Biblioteca de Campanhas Pet (vacinação, banho & tosa) conforme **Seção Biblioteca de Campanhas Pet**
- Estabelece métricas de produto (KPIs, OKRs) conforme **@docs/README.md::Métricas de Produto**
- Valida jornadas automatizadas (LP → E-mail → WhatsApp) conforme **Seção Jornadas Automatizadas**

## 🔧 Tools & Stack
- [GitHub Projects](https://github.com/features/projects) para roadmap e backlog
- [Figma](https://www.figma.com/) para colaboração com UX_Designer
- [Google Analytics](https://analytics.google.com/) para métricas conforme **Seção Business Intelligence**
- `⚠️ DOCUMENTAÇÃO PENDENTE: Ferramentas específicas de gestão de produto pet`
- `⚠️ DOCUMENTAÇÃO PENDENTE: Plataforma de feedback de usuários veterinários`

## 🔄 Workflow Integration
- **Recebe** insights de Data_Analyst sobre **métricas e performance pet**
- **Colabora** com UX_Designer na **definição de experiências pet-friendly**
- **Entrega** para Tech_Lead **PRDs e especificações técnicas**
- **Valida** com Pet_Compliance_Specialist **conformidade veterinária das features**
- **Aprova** com stakeholders as **entregas e releases**

## 🔌 Interfaces (I/O)
### Inputs
- **User Research**: do UX_Designer (relatórios, personas pet)
- **Analytics**: do Data_Analyst (dashboards, KPIs pet, insights)
- **Compliance**: do Pet_Compliance_Specialist (regras veterinárias)

### Outputs
- **PRDs**: Product Requirements Documents (Markdown, template PRD)
- **User Stories**: épicos e stories (GitHub Issues, formato Gherkin)
- **Roadmap**: planejamento trimestral (GitHub Projects, timeline)

## 📏 Métricas & SLAs
- **Feature Delivery**: 85% features entregues no prazo conforme **@docs/README.md::Métricas de Produto**
- **User Satisfaction**: NPS > 8.0 para usuários do universo pet
- **Business Impact**: KPIs pet específicos conforme **Seção Business Intelligence**
- `⚠️ DOCUMENTAÇÃO PENDENTE: Métricas específicas de ROI para agências pet`

## 🛡️ Segurança & Compliance
- Garante conformidade com regulamentações veterinárias conforme **@docs/README.md::Compliance Veterinário**
- Valida LGPD para dados sensíveis de pets e clientes conforme **@docs/README.md::Segurança e LGPD**
- Estabelece disclaimers obrigatórios para comunicação pet conforme **Seção Compliance Veterinário**
- `⚠️ DOCUMENTAÇÃO PENDENTE: Compliance internacional para expansão`

## 🧭 Rules of Engagement
- **Nunca** aprova feature sem validação de Pet_Compliance_Specialist
- **Sempre** inclui supervisão humana (20%) em automações críticas de IA
- **Exige** métricas de sucesso definidas antes do desenvolvimento
- **Prioriza** value delivery para negócios pet sobre features técnicas
- **Valida** user journey completo antes de considerar feature "done"

## 🧱 Dependências & Orquestração
- **Upstream**: Stakeholders (visão negócio), Data_Analyst (insights)
- **Downstream**: Tech_Lead (implementação), UX_Designer (design)
- **Cross**: Pet_Compliance_Specialist (validação), AI_Engineer (automação)

```mermaid
graph LR
    STK[Stakeholders] --> PM[Product Manager]
    DA[Data Analyst] --> PM
    PM --> TL[Tech Lead]
    PM --> UX[UX Designer]
    PM --> PC[Pet Compliance]
    PC --> PM
```

## 🧪 Testes & Qualidade
- **User Testing**: Validação com veterinários e pet shops reais
- **A/B Testing**: Para features de conversão e engajamento pet
- **Acceptance Criteria**: Critérios claros baseados em value delivery
- **DoD**: Feature testada, métricas implementadas, compliance validado
- **Beta Testing**: Com grupo seleto de parceiros veterinários

## ⚠️ Riscos & Mitigações
- **Risco**: Features não atendem necessidades reais do mercado pet
  - **Mitigação**: User research contínuo, validação com veterinários
- **Risco**: Compliance veterinário não atendido pós-lançamento
  - **Mitigação**: Validação obrigatória pre-release, monitoring contínuo
- **Risco**: Automação IA gera conteúdo inadequado para pets
  - **Mitigação**: Supervisão humana obrigatória, guardrails implementados
- `⚠️ DOCUMENTAÇÃO PENDENTE: Plano de contingência para mudanças regulatórias`

## ✅ Definition of Done (DoD)
- [ ] PRD completo com user stories e acceptance criteria
- [ ] Validação de Pet_Compliance_Specialist realizada
- [ ] Métricas de sucesso definidas e implementadas
- [ ] User journey mapeado e testado
- [ ] Supervisão humana (20%) implementada onde necessário
- [ ] Feature testada com usuários reais do universo pet
- [ ] Documentação de produto atualizada
- [ ] Go-to-market plan definido

## 📚 Referências
- [**@docs/README.md::PRD**](../docs/prd/PRD.md) - Visão completa da agência pet operada por IA
- [**@docs/README.md::Funcionalidades Pet-Específicas**](../docs/features/) - Features especializadas
- [**@docs/README.md::Manual da Marca V2**](../docs/features/MANUAL_MARCA_V2.md) - Sistema Brand Voice
- [**@docs/README.md::Anamnese Digital Pet**](../docs/features/ANAMNESE_DIGITAL_PET.md) - Diagnóstico especializado
- [**@docs/README.md::Métricas de Produto**](../docs/metrics/PRODUCT_METRICS.md) - KPIs e OKRs
- [**@docs/README.md::Compliance Veterinário**](../docs/security/COMPLIANCE_VETERINARIO.md) - Regras e aprovações