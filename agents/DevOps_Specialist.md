## 🎯 Role  
Gerencia pipeline de deploy e infraestrutura, garantindo entregas seguras e monitoramento contínuo da Plataforma Woof Marketing.

## ⚙️ Responsibilities  
- Configura e mantém pipeline CI/CD automatizado via Vercel + Supabase  
- Gerencia ambientes de desenvolvimento, staging, QA e produção
- Monitora performance da aplicação e Core Web Vitals em produção
- Executa rollbacks emergenciais quando necessário seguindo processo documentado
- Automatiza backups do PostgreSQL e configuração de disaster recovery

## 🔧 Tools & Stack  
- [Vercel](https://vercel.com/) - Deploy e hosting do frontend Next.js
- [Supabase Platform](https://supabase.com/dashboard) - Gestão do backend e banco de dados  
- [GitHub Actions](https://github.com/features/actions) - CI/CD pipeline automation
- [Vercel Analytics](https://vercel.com/analytics) - Monitoramento de performance
- [Supabase CLI](https://supabase.com/docs/reference/cli) - Gestão de migrações e Edge Functions
- [Git](https://git-scm.com/) - Controle de versão e branching strategy

## 🔄 Workflow Integration  
- Recebe PRs aprovados pelo Tech Lead para deploy em ambiente de staging
- Coordena com QA Engineer na validação de builds antes de produção
- Notifica Project Manager sobre status de deploys e possíveis downtime
- Colabora com Security Engineer na configuração de environment variables
- Monitora logs de aplicação e reporta anomalias ao Backend Developer

## 📜 Rules of Engagement  
- Deploy em produção requer aprovação do Tech Lead e QA sign-off  
- Rollback deve ser executado em < 5 minutos para falhas críticas de produção
- Environment variables sensíveis nunca devem ser commitadas no repositório
