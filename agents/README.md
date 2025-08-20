# 🤖 AI Agents - Plataforma Woof Marketing

Esta pasta contém a estrutura modular de AI Agents para equipes de desenvolvimento de software da Plataforma Woof Marketing. Cada agente representa uma função específica do time de software, com responsabilidades, ferramentas e fluxos de trabalho claramente definidos.

## 📋 Índice de Agentes

| Agente | Função Principal | Quando Utilizar |
|--------|-----------------|-----------------|
| [**Project Manager**](./Project_Manager.md) | 📊 Coordena projetos e recursos | Planejamento, acompanhamento de sprints, gestão de stakeholders |
| [**Tech Lead**](./Tech_Lead.md) | 🎯 Lidera arquitetura e decisões técnicas | Definição de padrões, revisão de código, mentoria técnica |
| [**Frontend Developer**](./Frontend_Developer.md) | 💻 Implementa interfaces e experiência do usuário | Desenvolvimento de componentes React, integração com APIs |
| [**Backend Developer**](./Backend_Developer.md) | 🛠️ Desenvolve APIs e lógica de negócio | Criação de endpoints, integração com Supabase, Edge Functions |
| [**QA Engineer**](./QA_Engineer.md) | 🔍 Garante qualidade através de testes | Criação de testes, validação de funcionalidades, automação |
| [**DevOps Specialist**](./DevOps_Specialist.md) | 🚀 Gerencia pipeline e infraestrutura | Deploy, monitoramento, configuração de ambientes |
| [**UI/UX Designer**](./UI_UX_Designer.md) | 🎨 Cria experiências visuais e interfaces | Design System, prototipação, user research |
| [**Security Engineer**](./Security_Engineer.md) | 🛡️ Implementa segurança e compliance | Autenticação, RLS, auditoria de segurança |

---

## 🎯 Como Utilizar os Agentes

### 📈 **Para Novos Projetos**
1. Comece com o **Project Manager** para definir escopo e cronograma
2. Consulte o **Tech Lead** para decisões arquiteturais
3. Utilize **Frontend** e **Backend Developers** para implementação
4. Aplique **QA Engineer** para garantir qualidade
5. Finalize com **DevOps Specialist** para deploy

### 🔄 **Para Manutenção/Evolução**
- **Bug fixes**: QA Engineer → Backend/Frontend Developer → DevOps Specialist  
- **Novas features**: Project Manager → UI/UX Designer → Tech Lead → Developers → QA → DevOps
- **Refatoração**: Tech Lead → Backend/Frontend Developer → QA Engineer
- **Segurança**: Security Engineer → Tech Lead → Backend Developer → DevOps

### 🚨 **Para Emergências**
- **Falhas de segurança**: Security Engineer + DevOps Specialist
- **Performance crítica**: Tech Lead + Backend Developer
- **Deploy com problemas**: DevOps Specialist + Tech Lead

---

## ✅ **Diretrizes de Implementação**

### **Padrões Seguidos**
- ✅ Todas as informações extraídas da documentação oficial em `@docs/README.md`
- ✅ Estrutura consistente com seções obrigatórias
- ✅ Nomenclatura em PascalCase + .md
- ✅ Linguagem técnica e específica
- ✅ Foco em responsabilidades de desenvolvimento de software

### **Estrutura de Cada Agente**
```markdown
## 🎯 Role  
[Definição concisa da função]

## ⚙️ Responsibilities  
- [Lista de 3-5 responsabilidades técnicas específicas]

## 🔧 Tools & Stack  
- [Ferramentas mencionadas na documentação]

## 🔄 Workflow Integration  
- [Como interage com outros papéis]

## 📜 Rules of Engagement  
- [2-3 regras críticas de atuação]
```

---

## 🔗 **Integração com Documentação**

Estes agentes estão diretamente alinhados com:
- [**Guia de Desenvolvimento**](../docs/development/DEVELOPMENT_GUIDE.md) - Padrões técnicos e stack
- [**Arquitetura do Sistema**](../docs/architecture/SYSTEM_ARCHITECTURE.md) - Decisões arquiteturais  
- [**PRD**](../docs/prd/PRD.md) - Requisitos e funcionalidades
- [**Processo de Deploy**](../docs/deployment/DEPLOYMENT_PROCESS.md) - Pipeline e infraestrutura
- [**Segurança**](../docs/security/SECURITY_COMPLIANCE.md) - Compliance e boas práticas

---

## 🎨 **Stack Tecnológico de Referência**

### **Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form + Zod

### **Backend**  
- Supabase (PostgreSQL + Auth + Storage)
- Edge Functions
- Row Level Security (RLS)

### **DevOps & Deploy**
- Vercel (Frontend)
- Supabase (Backend)
- Git workflow com branches
- CI/CD automatizado

### **Testing & Quality**
- Jest + Testing Library
- ESLint + Prettier
- Manual QA processes

---

## 📞 **Suporte e Contribuição**

- **Dúvidas sobre agentes**: Consulte a documentação referenciada em cada arquivo
- **Sugestões de melhoria**: Siga os padrões estabelecidos na estrutura
- **Novos agentes**: Deve estar no escopo de desenvolvimento de software

---

**Última atualização:** 17 de agosto de 2025  
**Versão dos agentes:** 1.0  
**Status:** ✅ Completo e alinhado com docs oficiais
