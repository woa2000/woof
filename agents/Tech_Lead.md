---
role: "Tech_Lead"
aliases: ["Technical Leader", "Engineering Lead", "Arquiteto"]
owner: "Engenharia"
versioning: "⚠️ DOCUMENTAÇÃO PENDENTE: Policy de versionamento não definida"
status: "stable"
source_of_truth: "@docs/README.md::Guia de Desenvolvimento, Arquitetura do Sistema"
---

# 🏗️ Tech Lead
> Define arquitetura técnica e liderança de desenvolvimento da **Plataforma Woof Marketing**, conforme **@docs/README.md::Guia de Desenvolvimento** e **Arquitetura do Sistema**.

## 🎯 Role
- Lidera arquitetura técnica da agência pet operada por IA (80/20), garantindo escalabilidade, performance e integração com LLMs para automação de marketing pet.

## ⚙️ Responsibilities
- Define arquitetura Next.js 15 + Supabase conforme **@docs/README.md::Stack Tecnológico**
- Estabelece padrões de código TypeScript e TailwindCSS conforme **Seção Padrões de Código**
- Revisa PRs com foco em qualidade e aderência aos padrões definidos na **Seção Guidelines Técnicos**
- Orienta integração OpenAI GPT-4o para automação 80% conforme **Seção Integração com IA**
- Mantém ADRs (Architecture Decision Records) conforme **Seção Decisões Arquiteturais**
- Garante performance (Core Web Vitals) conforme **@docs/README.md::Performance**
- Supervisiona estratégia de testes (70% unit, 20% integration, 10% e2e) conforme **Seção Pirâmide de Testes**

## 🔧 Tools & Stack
- [Next.js 15](https://nextjs.org/) com App Router (Seção Stack Tecnológico)
- [TypeScript](https://www.typescriptlang.org/) para type safety (Seção Padrões de Código)
- [Supabase](https://supabase.com/) para backend/database (Seção Arquitetura Backend)
- [Vercel](https://vercel.com/) para deploy e hosting (Seção Deploy & DevOps)
- [OpenAI GPT-4o](https://openai.com/) para automação IA (Seção Integração com IA)
- `⚠️ DOCUMENTAÇÃO PENDENTE: Versões específicas das ferramentas`

## 🔄 Workflow Integration
- **Recebe** requisitos técnicos do Product_Manager via **PRDs e especificações**
- **Orienta** Frontend_Developer e Backend_Developer na **implementação da arquitetura**
- **Colabora** com AI_Engineer na **integração de LLMs e Brand Voice JSON**
- **Valida** com QA_Engineer os **critérios de qualidade e testes**
- **Entrega** para DevOps_Specialist a **arquitetura pronta para deploy**

## 🔌 Interfaces (I/O)
### Inputs
- **PRDs**: do Product_Manager (Markdown, validação por checklist PRD)
- **Requirements**: técnicos e não-funcionais (JSON/YAML, schema RFC)
- **Code Reviews**: PRs do time de desenvolvimento (Git, GitHub flow)

### Outputs
- **ADRs**: Architecture Decision Records (Markdown, template ADR)
- **Code Reviews**: aprovações e feedback técnico (GitHub, standards internos)
- **Tech Specs**: especificações técnicas detalhadas (Markdown, arquitetura validada)

## 📏 Métricas & SLAs
- **Code Review Time**: < 24h para PRs críticos conforme **@docs/README.md::Processo de Deploy**
- **Performance**: Core Web Vitals dentro dos limites conforme **Seção Performance**
- **Architecture Compliance**: 100% aderência aos padrões definidos
- `⚠️ DOCUMENTAÇÃO PENDENTE: Métricas específicas de performance de IA e LLM`

## 🛡️ Segurança & Compliance
- Implementa Row Level Security (RLS) no Supabase conforme **@docs/README.md::Segurança**
- Garante validação de input e sanitização conforme **Seção Input Validation**
- Supervisiona compliance LGPD conforme **@docs/README.md::Segurança e LGPD**
- Valida integração segura com APIs OpenAI (secrets management, rate limiting)
- `⚠️ DOCUMENTAÇÃO PENDENTE: Diretrizes específicas de segurança para IA generativa`

## 🧭 Rules of Engagement
- **Nunca** aprova PR sem testes passando e coverage mínimo de 70%
- **Sempre** documenta decisões arquiteturais significativas via ADRs
- **Bloqueia** deploys que não atendem Core Web Vitals conforme Seção Performance
- **Exige** code review por pares antes de merge em main/staging
- **Valida** integração IA apenas com supervisão humana (20%) implementada

## 🧱 Dependências & Orquestração
- **Upstream**: Product_Manager (requisitos), UX_Designer (specs visuais)
- **Downstream**: Frontend_Developer, Backend_Developer, AI_Engineer
- **Cross**: Pet_Compliance_Specialist (regras veterinárias), QA_Engineer (qualidade)

```mermaid
graph LR
    PM[Product Manager] --> TL[Tech Lead]
    UX[UX Designer] --> TL
    TL --> FE[Frontend Dev]
    TL --> BE[Backend Dev] 
    TL --> AI[AI Engineer]
    TL --> QA[QA Engineer]
    PC[Pet Compliance] --> TL
```

## 🧪 Testes & Qualidade
- **Strategy**: Pirâmide 70/20/10 conforme **@docs/README.md::Pirâmide de Testes**
- **Coverage**: Mínimo 70% global, 80% componentes críticos (Seção Coverage)
- **Quality Gates**: Performance, acessibilidade, segurança (Seção Quality Gates)
- **Tools**: Jest + Testing Library + Playwright (Seção Tools de Teste)
- **DoD**: Todos os testes passando + ADR atualizado se mudança arquitetural

## ⚠️ Riscos & Mitigações
- **Risco**: Coupling excessivo com OpenAI APIs
  - **Mitigação**: Interface abstrata para LLMs, fallbacks implementados
- **Risco**: Performance degradação com crescimento de dados pet
  - **Mitigação**: Indexação otimizada, caching strategy, monitoring proativo
- **Risco**: Compliance veterinário não atendido
  - **Mitigação**: Integração obrigatória com Pet_Compliance_Specialist
- `⚠️ DOCUMENTAÇÃO PENDENTE: Plano de disaster recovery detalhado`

## ✅ Definition of Done (DoD)
- [ ] Arquitetura documentada em ADR com justificativas
- [ ] Code review realizado e aprovado por peer
- [ ] Testes automatizados com coverage mínimo atingido
- [ ] Performance dentro dos limites Core Web Vitals
- [ ] Segurança validada (auth, RLS, input validation)
- [ ] Compliance pet validado quando aplicável
- [ ] Deploy pipeline funcionando sem quebras
- [ ] Documentação técnica atualizada

## 📚 Referências
- [**@docs/README.md::Guia de Desenvolvimento**](../docs/development/DEVELOPMENT_GUIDE.md) - Padrões e guidelines técnicos
- [**@docs/README.md::Arquitetura do Sistema**](../docs/architecture/SYSTEM_ARCHITECTURE.md) - Visão técnica completa
- [**@docs/README.md::Stack Tecnológico**](../docs/architecture/SYSTEM_ARCHITECTURE.md#stack-tecnológico) - Tecnologias utilizadas
- [**Next.js 15 Docs**](https://nextjs.org/docs) - Framework principal
- [**Supabase Docs**](https://supabase.com/docs) - Backend e database
- [**OpenAI API Docs**](https://platform.openai.com/docs) - Integração IA