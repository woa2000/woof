# PRD — Agência de Marketing Pet Operada por IA (Consolidado)

**Versão:** 1.0
**Data:** 24 de agosto de 2025
**Status:** Draft para validação
**Owner:** Produto (Woof / Agência Pet)

---

## 1. Visão & Objetivos

**Visão:** Ser a plataforma/serviço nº 1 de marketing digital para negócios do universo pet no Brasil, combinando agência + SaaS com **80% de operações automatizadas por IA** e **20% de supervisão humana**, entregando desempenho previsível, governança e marca consistente.

**Objetivos de negócio (12 meses):**

* Reduzir **time-to-publish** para ≤ **24h** por peça aprovada.
* Aumentar **produtividade de conteúdo ≥ 3×** por analista/gestor.
* Reduzir **CPA** em **15–25%** vs baseline de clientes pilotos.
* **NPS ≥ 60** entre gestores de marketing clientes.
* Conquistar **MRR** crescente e **churn < 5%** ao mês.

**North Star Metric:** Peças/experimentações **publicadas e aprovadas** por semana **com impacto (uplift)** medido em agendamentos, visitas e vendas de serviços pet.

---

## 2. Público-alvo & Personas

**Segmentos atendidos:** Clínicas veterinárias, pet shops, banho & tosa, adestradores, hotéis/pet care, redes/franquias.

**Personas (lado do cliente):**

1. **Proprietário(a) de Pet Shop** – busca aumentar ticket médio, fidelizar e padronizar comunicação.
2. **Médico(a) Veterinário(a) / Gestor(a) de Clínica** – quer agenda cheia, posicionamento de autoridade e recall de vacinas/retornos.
3. **Franqueado(a)/Rede** – precisa de padronização, compliance e ROI por unidade.

**Personas (lado agência/plataforma):**

* **Gestor(a) de Marketing (cliente/agência)** – foco em KPIs, previsibilidade e guardrails.
* **Criativo/Conteudista** – geração de variações aderentes a tom de voz.
* **Analista de Performance** – testes automatizados, alertas e atribuição básica.
* **Diretor(a) de Conta/Agência** – governança, faturamento por performance e SLAs.

---

## 3. Proposta de Valor & Diferenciais (setor pet)

* **Verticalização pet:** kits de campanha pré-prontos (vacinação, banho & tosa, check-up, datas sazonais pet), linguagem amigável e compliance para comunicações de saúde.
* **Marca consistente:** Manual de Marca digital + Tom de Voz consolidado em JSON de voz da marca, aplicado em todos os outputs da IA.
* **Operação 80/20:** planejamento, produção, publicação e otimização omnichannel com revisão humana.
* **Resultados práticos:** dashboards por papel (gestor, vet, franqueado), alertas proativos e playbooks de ação.

---

## 4. Escopo do MVP

### 4.1 IN

1. **Onboarding de Marca** (logo/cores, missão, proposta de valor, persona, tom, termos proibidos) e geração do **Brand Voice JSON**.
2. **Manual de Marca Digital** (visualizador + capítulos essenciais + gestão de assets) com criação guiada/IA.
3. **Anamnese Digital** focada no universo pet (site, presença, jornada do cliente, quick wins).
4. **Planejamento assistido** → calendário editorial semanal (10–15 ideias) por canal/objetivo.
5. **Geração de Conteúdo** (posts/anúncios/e-mails) com 3–5 variações + score de qualidade e checagens (tom, limites por canal, termos).
6. **Biblioteca Pet de Campanhas** (kits prontos: Vacinação, Banho & Tosa, Check-up, Adoção, Sazonais) com CTAs e layouts sugeridos.
7. **Publicação & Agendamento**: Instagram/Facebook (Meta) + Google Business Profile (postagens) + E-mail (SendGrid/Postmark).
8. **Jornadas simples (3 passos)**: LP → e-mail → WhatsApp (recall de vacinas/banho & tosa) com logs e opt-out.
9. **Ads (teste/guardrails)**: 2–3 criativos por campanha, pausa automática por CTR/CPA e alertas.
10. **Dashboard & Alertas**: CTR, CVR, leads, agendamentos, CPA, spend; alertas de queda e ausência de posts.

### 4.2 OUT (pós-MVP)

* Atribuição avançada/MMM; editor de vídeo; automações complexas;
* CRM completo; DCO multi-canais; CDP; BI custom;
* Integrações nativas com prontuários/agendas veterinárias e GMB avançado.

### 4.3 Assunções

* Clientes aceitam modelo **human-in-the-loop** e limites de autonomia.
* Aprovação de templates WhatsApp e compliance básico em saúde animal do lado do cliente.

---

## 5. Requisitos Funcionais (User Stories + Critérios)

### 5.1 Onboarding de Marca

**Story:** Como Gestor, cadastro a marca e obtenho **Brand Voice JSON**.
**Critérios:** upload de logo/cores (paleta detectada); missão/valor/persona/tom/termos; geração de exemplos positivos/negativos; salvamento seguro.

### 5.2 Manual de Marca Digital

**Story:** Como Gestor, crio/organizo o manual em capítulos essenciais (logotipo, cores, tipografia, ícones, tom de voz, social toolkit).
**Critérios:** visualizador, upload/organização de assets, links compartilháveis com controle de acesso.

### 5.3 Anamnese Digital Pet

**Story:** Como Gestor, executo diagnóstico (identidade, UX, jornada, concorrência) e recebo quick wins e plano de tratamento.
**Critérios:** checklist pet, geração de personas, anatomia de homepage, roadmap priorizado.

### 5.4 Planejamento & Calendário

**Story:** Como Gestor, gero calendário semanal com ideias por canal e KPI.
**Critérios:** 10–15 slots; fixar/regenerar; drag\&drop; objetivos/KPIs por item.

### 5.5 Conteúdo Generativo

**Story:** Como Criativo, gero 3–5 variações por peça com tom pet-friendly.
**Critérios:** limites por canal; score (clareza/originalidade/adequação); anti-plágio e termos bloqueados; aprovação humana obrigatória.

### 5.6 Biblioteca de Campanhas Pet

**Story:** Como Gestor, aplico kits prontos (vacinação, banho & tosa, etc.).
**Critérios:** templates com CTAs, metas e segmentações recomendadas; clonagem/edição.

### 5.7 Publicação & Agendamento

**Story:** Como Gestor, publico/agendo no IG/FB/GMB e e-mail.
**Critérios:** OAuth; preview; agendar; salvar `external_id`; puxar impressões/cliques/engajamento.

### 5.8 Jornadas (E-mail/WhatsApp)

**Story:** Como Gestor, configuro jornada 3 passos (LP → e-mail → WhatsApp).
**Critérios:** delays; placeholders; logs de envio/abertura/clique/lido; opt-out.

### 5.9 Ads: Testes & Guardrails

**Story:** Como Analista, ativo criativos com pausas automáticas por CTR/CPA.
**Critérios:** objetivos, público básico, budget, CPA alvo; desativação por regras (ex.: CTR abaixo do corte por 48h ou CPA > 1,2× alvo).

### 5.10 Dashboard & Alertas

**Story:** Como Gestor, vejo KPIs e recebo alertas proativos.
**Critérios:** filtros por marca/canal/período; export CSV; alertas por e-mail/UI (queda CTR >30%, CPA>alvo, falta de posts 48h).

---

## 6. Requisitos Não Funcionais

* **Disponibilidade:** 99,5% mensal (MVP).
* **Desempenho:** TTFB API < 300ms (95º pct leitura); geração de conteúdo < 12s/variação (95º pct).
* **Segurança:** Multi-tenant com RLS; RBAC; cofre de segredos; auditoria.
* **LGPD:** minimização; consentimento; DSR; retenção de logs 180 dias.
* **Observabilidade:** OpenTelemetry (traces/métricas/logs), SLOs e alertas.

---

## 7. Arquitetura (alto nível)

* **Frontend:** Next.js 14+ (App Router), Tailwind, Auth Supabase, ISR para LPs.
* **Backend:** Node.js 20+ (Express/Fastify). Camadas: Gateway → Services (Content, Calendar, BrandManual, CRM/Journey, Ads, Alerts) → Integrations.
* **Dados:** Supabase Postgres 15 (RLS); Storage p/ assets; filas/Jobs (Bull/Agenda) para geração/integrações.
* **Integrações:** Meta Graph API; Google Business Profile Posts; Google Ads (read); SendGrid/Postmark; WhatsApp BSP; Provedor LLM pluggable.
* **Observabilidade:** OTEL + exporter (Grafana/Datadog).

---

## 8. Modelo de Dados (MVP)

* **tenants, users** (RBAC)
* **brands** (tone jsonb, colors jsonb, blocked\_terms\[])
* **brand\_manuals, brand\_assets** (capítulos, arquivos, versões)
* **integrations** (brand\_id, provider, tokens criptografados, status)
* **calendar\_items** (brand\_id, channel, date, topic, goal, status)
* **content\_variants** (calendar\_item\_id, payload jsonb, score, status)
* **posts** (platform\_id, scheduled\_at, publish\_status, external\_id)
* **pet\_campaign\_kits** (tipo, metas, templates)
* **leads** (brand\_id, source, email/phone, consent)
* **journeys, journey\_steps, journey\_logs**
* **ads\_campaigns, ad\_creatives, ad\_metrics\_daily**
* **alerts** (type, severity, message, created\_at)
* **metrics\_raw / metrics\_rollup**

---

## 9. API (contratos — exemplos)

**Auth:** JWT Supabase (Bearer).
**Padrões:** JSON; idempotência em POST sensíveis; paginação `?page&size`.

* `POST /brands` → cria marca (cores/voz/persona).
* `POST /brands/{id}/brand-manual` → cria/atualiza capítulos/links.
* `POST /brands/{id}/calendar/generate` → slots `[{id, date, channel, topic, cta, kpi}]`.
* `POST /calendar/{itemId}/content/generate` → variações `[{id, title, copy, hashtags, score}]`.
* `POST /publish/meta` / `POST /publish/gmb` → agenda publicação.
* `POST /journeys` / `POST /journeys/{id}/activate`
* `GET /analytics/summary?brandId&range` → `{leads, bookings, ctr, cvr, cpa, spend}`.
* `GET /alerts?brandId`.

---

## 10. LLM & Prompt Engineering

* **System Prompt (voz da marca):** consolida Brand Voice + guardrails (palavras bloqueadas, claims proibidas, tom, persona).
* **Templates de prompts:** post/anúncio/e-mail; parâmetros de objetivo, canal, CTA, limites.
* **Crivo de qualidade:** segunda passada de IA avaliando legibilidade, originalidade, adequação e riscos.
* **Mitigação de custo/alucinação:** caching, compressão de contexto, verificação factual básica.

---

## 11. UX & Conteúdo

* **IA assistiva, transparente:** explicar recomendações ("por quê").
* **Fluxo feliz 6 cliques:** onboarding → calendário → conteúdo → aprovar → agendar → dashboard.
* **Componentes-chave:** calendário drag\&drop; editor com tokens ({{brand}}, {{cta}}); prévias por canal; dashboards por papel.
* **Acessibilidade:** WCAG 2.2 AA.

---

## 12. Segurança, LGPD & Compliance

* **RLS** por tenant; **RBAC** (admin, gestor, criativo, analista).
* **Cofre de segredos** (tokens); rotação trimestral.
* **Consentimento/Opt-out** nas LPs; exclusão/exportação de dados.
* **Compliance veterinária:** evitar alegações clínicas; templates com disclaimers; aprovação do responsável técnico.

---

## 13. Métricas & KPIs

**Produto:** time-to-publish, taxa de aprovação sem edição, uso de variações, latência de geração, erros LLM.
**Marketing (pet):** CTR, CVR, CPA, spend, **agendamentos**, **recall de vacinas/retornos**, **ticket médio de serviços**.
**Alertas:** queda CTR >30%, CPA>alvo, ausência de posts 48h.

---

## 14. Roadmap (6 semanas — 3 sprints)

**Sprint 1 — Fundação & Marca/Conteúdo**

* Auth multi-tenant + RBAC.
* Onboarding de marca + Brand Voice JSON.
* Manual de Marca (capítulos essenciais + assets).
* Calendário + geração de conteúdo.
* Storage/UTM + testes iniciais.

**Sprint 2 — Integrações & Publicação**

* Meta publish + insights.
* Google Business Profile Posts.
* E-mail (envio + logs).
* Jornadas 3 passos (LP → e-mail → WhatsApp).
* Dashboard inicial por papel.

**Sprint 3 — Testes & Guardrails**

* Motor de testes de criativos.
* Guardrails CPA/budget + alertas.
* Kits de campanha pet (v1).
* Polimento UX + UAT com 1–2 clientes.

**Pós-MVP:** SEO briefs; social care; integrações com agendas/prontuários; atribuição avançada; recomendador de budget.

---

## 15. Testes & Qualidade

* **Tipos:** unit, contratos (API), integração (jobs/webhooks), e2e (fluxo feliz), segurança (RBAC/RLS), performance (LLM/API).
* **Critérios de aceite (amostra):**

  1. Calendário gera ≥10 ideias com KPIs válidos.
  2. Conteúdo retorna ≥3 variações com score >7/10 e sem termos bloqueados.
  3. Publicação agenda no Meta/GMB e salva `external_id`.
  4. Jornada envia e-mail e WhatsApp com logs corretos.
  5. Guardrails pausam criativo ruim e emitem alerta.

---

## 16. Lançamento & Operação

* **Ambientes:** dev / staging / prod; semver; feature flags para IA.
* **Release:** canário 10% dos clientes; rollback blue/green.
* **SLA suporte:** P1 < 4h; P2 < 1 dia útil.
* **Playbooks:** falhas de publicação/envio; indisponibilidade de integrações; drift de custo LLM.

---

## 17. Pricing (modelo híbrido)

* **SaaS por tenant** (planos Starter/Professional/Enterprise) + **excedente de LLM** (tokens) + **módulo Ads** (fee % do spend ou fixo).
* Limites por plano: nº de marcas, peças/mês, jornadas ativas, assets do manual.
* Serviços de agência opcionais (setup, estratégia, produção extra, mídia gerenciada).

---

## 18. Riscos & Mitigações

* **Qualidade inconsistente de IA** → crivo + exemplos + revisão humana.
* **APIs de terceiros instáveis** → retries, DLQ, fallback manual.
* **Custo LLM** → caching, compressão, monitor de custo/cliente.
* **LGPD/compliance** → minimização + DSR + revisão jurídica + templates aprovados.
* **Escopo** → limitar canais e passos de jornada no MVP; priorizar vertical pet.

---

## 19. Dependências & Premissas

* Contas aprovadas em Meta/WhatsApp BSP; domínio de e-mail autenticado (SPF/DKIM/DMARC).
* Templates de WhatsApp pré-aprovados; política de conteúdos sensíveis.

---

## 20. Anexos

* Diagramas (arquitetura alto nível, sequência de publicação, fluxo de ads, ER).
* Exemplos de prompts (system/user/crivo).
* Esquemas SQL (DDL) do MVP.

---

## 21. Alterações (Changelog)

* **1.0 (2025-08-24):** Consolidação dos PRDs (agência IA + vertical pet) e definição do MVP com manual de marca, anamnese, geração de conteúdo, publicação, jornadas, ads e dashboards.
