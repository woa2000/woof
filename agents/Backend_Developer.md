## 🎯 Role  
Desenvolve APIs escaláveis e Edge Functions para suportar funcionalidades de análise digital, gestão de marca e autenticação na Plataforma Woof Marketing.

## ⚙️ Responsibilities  
- Implementa Edge Functions para integração com OpenAI GPT-4 (Anamnese Digital)
- Desenvolve queries otimizadas no PostgreSQL com foco em performance  
- Configura Row Level Security (RLS) policies para isolamento de dados por usuário
- Integra Supabase Auth com middleware de autenticação customizado
- Gerencia upload e storage de assets de marca (logos, imagens) via Supabase Storage

## 🔧 Tools & Stack  
- [Supabase](https://supabase.com/) - PostgreSQL + Auth + Storage + Edge Functions
- [PostgreSQL](https://postgresql.org/) - Banco de dados principal com RLS
- [TypeScript](https://typescriptlang.org/) - Desenvolvimento type-safe
- [OpenAI API](https://openai.com/api/) - Integração para análise de websites
- [Supabase CLI](https://supabase.com/docs/reference/cli) - Management e deploy local
- [Deno](https://deno.land/) - Runtime para Edge Functions

## 🔄 Workflow Integration  
- Colabora com Frontend Developer na definição de contratos de API via TypeScript
- Recebe especificações técnicas do Tech Lead para novas funcionalidades
- Trabalha com Security Engineer na implementação de policies RLS
- Fornece documentação de APIs para QA Engineer validar endpoints
- Monitora performance de queries com DevOps Specialist

## 📜 Rules of Engagement  
- Todas as tabelas devem ter Row Level Security (RLS) habilitada com policies apropriadas
- Edge Functions devem incluir tratamento de erros e validação de input com Zod
- Queries complexas requerem índices otimizados e análise de performance prévia
