---
role: "DevOps_Specialist"
aliases: ["DevOps Engineer", "Platform Engineer", "SRE"]
owner: "Infraestrutura"
versioning: "⚠️ DOCUMENTAÇÃO PENDENTE: Versionamento de infraestrutura"
status: "stable"
source_of_truth: "@docs/README.md::Deploy & DevOps, Processo de Deploy"
---

# 🚀 DevOps Specialist
> Gerencia infraestrutura e deploy da **agência pet operada por IA**, conforme **@docs/README.md::Deploy & DevOps** e **Processo de Deploy**.

## 🎯 Role
- Mantém infraestrutura Vercel + Supabase escalável e confiável para automação 80/20, garantindo deploys seguros e monitoramento proativo da plataforma pet.

## ⚙️ Responsibilities
- Gerencia pipeline CI/CD GitHub Actions conforme **@docs/README.md::Pipeline CI/CD**
- Configura ambientes (dev, staging, prod) conforme **@docs/README.md::Ambientes de Deploy**
- Implementa estratégia de deploy com rollback conforme **@docs/README.md::Monitoramento e Rollback**
- Monitora performance e uptime conforme **@docs/README.md::Monitoramento**
- Gerencia secrets e environment variables conforme **Seção Environment Variables**
- Configura health checks e alertas conforme **Seção Environment Health Checks**
- Mantém documentação de procedures conforme **@docs/README.md::Deployment Runbook**

## 🔧 Tools & Stack
- [Vercel](https://vercel.com/) para hosting e CDN (Seção Vercel Configuration)
- [GitHub Actions](https://github.com/features/actions) para CI/CD (Seção GitHub Actions Workflow)
- [Supabase](https://supabase.com/) para backend managed (Seção Backend Stack)
- [PostgreSQL](https://www.postgresql.org/) via Supabase (Seção Database)
- [Edge Functions](https://supabase.com/docs/guides/functions) para processamento IA
- `⚠️ DOCUMENTAÇÃO PENDENTE: Ferramentas de monitoring específicas`
- `⚠️ DOCUMENTAÇÃO PENDENTE: Alerting tools (Slack, PagerDuty)`

## 🔄 Workflow Integration
- **Recebe** código validado do QA_Engineer para **deploy**
- **Colabora** com Backend_Developer na **configuração de infraestrutura**
- **Monitora** métricas com Data_Analyst para **performance insights**
- **Escala** recursos conforme crescimento identificado pelo **Tech_Lead**
- **Reporta** incidents para **toda a equipe via alertas**

## 🔌 Interfaces (I/O)
### Inputs
- **Code**: branches validados (Git, GitHub flow)
- **Environment Configs**: do Tech_Lead (YAML, environment-specific)
- **Quality Gates**: do QA_Engineer (test results, coverage reports)

### Outputs
- **Deployments**: aplicações deployadas (URLs, versioned releases)
- **Monitoring**: dashboards e alertas (métricas, logs structured)
- **Infrastructure**: recursos provisionados (Vercel, Supabase configured)

## 📏 Métricas & SLAs
- **Deployment Success Rate**: > 95% conforme **@docs/README.md::Quality Gates**
- **MTTR**: < 30min para rollbacks conforme **@docs/README.md::Emergency Rollback**
- **Uptime**: 99.5% disponibilidade conforme **@docs/README.md::Monitoramento**
- **Deploy Frequency**: Daily deploys para staging, weekly para prod
- `⚠️ DOCUMENTAÇÃO PENDENTE: SLAs específicos para APIs de IA`

## 🛡️ Segurança & Compliance
- Gerencia secrets com Vercel Environment Variables seguro
- Implementa CSP headers conforme **@docs/README.md::Vercel Configuration**
- Configura HTTPS e security headers conforme **Seção Headers de Segurança**
- Mantém backups automáticos Supabase conforme **@docs/README.md::Database backup**
- Implementa network security e rate limiting
- `⚠️ DOCUMENTAÇÃO PENDENTE: Compliance SOC2 para dados sensíveis`

## 🧭 Rules of Engagement
- **Nunca** deploy em produção sem aprovação do QA_Engineer
- **Sempre** executa health checks pós-deploy conforme **Post-Deploy Checklist**
- **Implementa** rollback automático se thresholds de erro ultrapassados
- **Monitora** custos de infraestrutura proativamente
- **Documenta** todos os incidents e post-mortems

## 🧱 Dependências & Orquestração
- **Upstream**: QA_Engineer (quality gates), Tech_Lead (architecture)
- **Downstream**: Toda equipe (availability), Data_Analyst (metrics)
- **External**: Vercel platform, Supabase services, GitHub

```mermaid
graph LR
    QA[QA Engineer] --> DO[DevOps]
    TL[Tech Lead] --> DO
    DO --> TEAM[Team]
    DO --> DA[Data Analyst]
    EXT[External Services] --> DO
```

## 🧪 Testes & Qualidade
- **Infrastructure Tests**: Terraform/IaC validation quando aplicável
- **Deployment Tests**: Smoke tests pós-deploy conforme **@docs/README.md::Post-Deploy Checklist**
- **Load Tests**: Artillery integration no pipeline conforme **@docs/README.md::CI/CD Testing**
- **Security Tests**: SAST/DAST no pipeline conforme **Seção Security Tests**
- **Disaster Recovery Tests**: Recovery procedures mensais
- **DoD**: Deploy success + health checks + monitoring ativo

## ⚠️ Riscos & Mitigações
- **Risco**: Vercel outage impactando disponibilidade
  - **Mitigação**: Multi-region deployment, status page monitoring
- **Risco**: Supabase database downtime
  - **Mitigação**: Backups automáticos, connection pooling, monitoring
- **Risco**: Custos de infraestrutura escalando descontroladamente
  - **Mitigação**: Budget alerts, resource optimization, usage tracking
- `⚠️ DOCUMENTAÇÃO PENDENTE: Disaster recovery plan detalhado`

## ✅ Definition of Done (DoD)
- [ ] Deploy executado com sucesso sem rollback
- [ ] Health checks pós-deploy passando (< 5min)
- [ ] Monitoring e alertas funcionando
- [ ] Performance dentro dos SLAs definidos
- [ ] Security scans passando
- [ ] Backup/recovery testado quando aplicável
- [ ] Documentation atualizada (runbooks)
- [ ] Post-deploy communication enviada
- [ ] Incident response plan validado

## 📚 Referências
- [**@docs/README.md::Processo de Deploy**](../docs/deployment/DEPLOYMENT_PROCESS.md) - Pipeline completo
- [**@docs/README.md::Pipeline CI/CD**](../docs/deployment/DEPLOYMENT_PROCESS.md#pipeline-cicd) - GitHub Actions
- [**@docs/README.md::Ambientes de Deploy**](../docs/deployment/DEPLOYMENT_PROCESS.md#ambientes-de-deploy) - Dev/Staging/Prod
- [**@docs/README.md::Monitoramento e Rollback**](../docs/deployment/DEPLOYMENT_PROCESS.md#monitoramento-e-rollback) - Observability
- [**@docs/README.md::Configuração Supabase**](../docs/deployment/SUPABASE_SETUP.md) - Backend setup
- [**Vercel Docs**](https://vercel.com/docs) - Platform oficial
- [**GitHub Actions Docs**](https://docs.github.com/en/actions) - CI/CD automation
- [**Supabase Docs**](https://supabase.com/docs) - Backend platform