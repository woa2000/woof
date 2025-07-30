---
applyTo: '**'
---

# 🐶 Woof Marketing Platform — GitHub Copilot Instructions

Este repositório faz parte da **Plataforma Woof**, uma solução de marketing automatizado com IA para clínicas veterinárias e pet shops. A plataforma gera landing pages, campanhas de anúncios, realiza diagnósticos digitais e centraliza os resultados em um dashboard intuitivo.

## ⚙️ Arquitetura do Projeto

O sistema é dividido em três repositórios:

- **frontend/** – Next.js 14 com App Router + TailwindCSS + React Query
- **backend/** – ASP.NET Core 8 (Minimal APIs) atuando como BFF
- **worker/** – Worker assíncrono (ASP.NET Core 8) para crawling, análise com IA e geração de relatórios

> ⚠️ Todos os serviços são containerizados e devem rodar via `docker-compose`.

---

## 🚀 Principais Funcionalidades (MVP)

- Autenticação por e-mail e redes sociais (Google/Facebook)
- Geração de landing pages com IA (OpenAI GPT-4o)
- Captura e visualização de leads
- Integração com Meta Ads (Lead Generation)
- Diagnóstico de presença digital com análise de site/redes sociais
- Relatórios em PDF com branding da Woof
- Notificações por e-mail e WebSocket
- Painel de administração para superusuários

---

## 🎨 Frontend (`frontend/`)

A aplicação frontend utiliza **Next.js 14 com App Router** e **TailwindCSS**. O objetivo é uma experiência híbrida, com páginas públicas SSR (para SEO) e dashboard como SPA com React Query.

### 📁 Estrutura de Diretórios Recomendada

```
frontend/
├── app/
│   ├── page.tsx
│   ├── dashboard/
│   ├── login/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── charts/
│   └── LPWizard/
├── hooks/
├── lib/
├── services/
├── types/
├── styles/
└── utils/
```

### 📦 Dependências-Chave

- `next@14`
- `tailwindcss`
- `@tanstack/react-query`
- `zod`
- `axios`
- `lucide-react`
- `react-hook-form`

### 🔒 Autenticação

Autenticação via **Supabase Auth**:
- `signInWithPassword(email, password)`
- `signInWithOAuth({ provider })`
- `onAuthStateChange`
- Guardas de rota com middleware

### 🧩 Componentes Estratégicos

- `LPWizard`
- `AnamneseForm`
- `LeadTable`
- `CampaignCard`

### ⚙️ Comunicação com o Backend

```tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useLeads(clinicId: string) {
  return useQuery({
    queryKey: ["leads", clinicId],
    queryFn: () => api.get(`/clinicas/${clinicId}/leads`).then(res => res.data),
  });
}
```

### 🔔 Notificações

- Supabase Realtime + WebSocket
- Toast com `sonner`, `toastify` ou `shadcn/ui`

### 📱 Responsividade

- Mobile-first com breakpoints do Tailwind

### ✅ Boas Práticas

- Evitar lógica de negócio no frontend
- Documentar componentes com JSDoc
- Dividir componentes complexos
- Utilizar skeletons/spinners
- Nomear hooks com clareza (`useLeads`, `useAuth`)

---

## 🧱 Backend (`backend/`)

- ASP.NET Core 8 (Minimal APIs)
- JWT + JWKS + Supabase Auth
- Serilog para logs estruturados
- RESTful APIs
- SDK oficial Supabase C#

---

## 🧵 Worker (`worker/`)

- ASP.NET Core 8 + RabbitMQ/SQS
- QuestPDF para relatórios
- Pipeline: Crawl → Analyze → GeneratePDF → Store

---

## 🧪 CI/CD com GitHub Actions

- `main`: deploy produção
- `staging`: homologação
- `feature/*`: desenvolvimento

Workflows:
- Push: Lint + Unit Tests
- PR: + Integração + Build
- Merge: + Deploy containerizado

---

## ✅ Definition of Done (DoD)

- Código mergeado na `main`
- Testes automatizados passaram
- Funcionalidade validada em `staging`
- Logs/métricas configurados
- Documentação atualizada

---

## 📌 Recursos Externos

- https://supabase.com
- https://platform.openai.com
- https://developers.facebook.com
- https://www.questpdf.com

---

## 👥 Contato

Fale com o PO ou tech lead responsável por dúvidas técnicas.