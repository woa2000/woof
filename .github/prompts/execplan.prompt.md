---
mode: agent
---
# Executor de Plano Multiagente (Runbook)

## Objetivo
Executar, de ponta a ponta e sem interação humana, o plano especificado em `{PLAN_FILE}`, seguindo exatamente o que está em `plans/{PLAN_FILE}`:
- Respeitar o DAG (Seção 6) e a Tabela de Passos (Seção 7).
- Honrar RACI, critérios de aceite, gates de qualidade/segurança/release.
- Capturar logs, artefatos e evidências.
- Ao final, mover o plano **executado** para `plans/fineshed/`.

## Fontes Normativas (somente leitura)
- @docs/** (incl. @docs/README.md, padrões, ADRs, políticas, SLO/SLI)
- @agents/** (capacidades, limites, RACI base, ownership)
> Em caso de lacunas, criar **hipóteses conservadoras** + registrar em **Riscos & Mitigações** do próprio plano (Seção 13) com contingência.
> Em caso de conflitos: ADRs “Accepted” > padrões/standards > @docs/README.md > demais docs.

## Entrada Única (Obrigatória)
- `{PLAN_FILE}`: nome do arquivo do plano, por ex.: `minha-tarefa_plan.md` (local: `plans/{PLAN_FILE}`)

## Proibições
- Não pedir nenhuma outra entrada humana.
- Não alterar conteúdo de @docs/ e @agents/.
- Não alterar o plano além de preencher as seções de execução (logs/links/evidências/changelog).

---

## Configuração
vars:
  PLAN_PATH: "plans/{PLAN_FILE}"
  PLAN_ID: "<derivar do meta-header plan.id>"
  WORK_DIR: "."
  ARTIFACTS_DIR: "artifacts/${PLAN_ID}"
  LOGS_DIR: "logs/${PLAN_ID}"
  REPORTS_DIR: "reports/${PLAN_ID}"
  TEMP_DIR: ".tmp/${PLAN_ID}"
  FINAL_DIR: "plans/fineshed"   # conforme solicitado
  GIT_BRANCH: "run/${PLAN_ID}"  # kebab-case
  DRY_RUN: false                # se true, apenas valida/“ensaia” sem efeitos colaterais
  MAX_PARALLEL: 3               # paralelismo seguro para passos independentes
  RETRY_LIMIT: 2                # tentativas por passo (backoff exponencial)
  TIMEOUT_PER_STEP_MIN: 30      # timeout por passo
  EVIDENCE_MODE: "strict"       # falha se faltar evidência mínima
  OBS_TAG: "${PLAN_ID}"

---

## Fase 0 — Leitura, Validação & Preparação
1) Carregar `PLAN_PATH`. Verificar meta-header YAML:
   - `plan.id`, `version`, `owner_agent`, `supporting_agents`, `success_metrics`, `risk_level`.
   - Falta algo? Criar hipótese **mínima**, registrar em Seção 13 (Riscos & Mitigações) com contingência.
2) Indexar Seções 1–16 do plano. Garantir presença da Seção 6 (DAG) e Seção 7 (Tabela de Passos).
3) Resolver agentes:
   - Mapear `owner_agent` e `supporting_agents` em @agents/**; validar capacidades (citar “Fonte: @agents/...#...”).
4) Preparar ambiente:
   - Criar diretórios `${ARTIFACTS_DIR}`, `${LOGS_DIR}`, `${REPORTS_DIR}`, `${TEMP_DIR}`.
   - Criar/checkout branch `${GIT_BRANCH}` se aplicável.
5) Validar dependências/tooling/credenciais conforme Seções 3, 8, 9, 10 do plano e @docs/**:
   - Segredos via mecanismo descrito em @docs (não logar valores).
   - Verificar versões de SDK/CLI/Tooling requeridas.
6) Construir grafo do DAG (Seção 6) + mapear Tabela de Passos (Seção 7).
   - Checar que cada passo do DAG existe na Tabela (id, agente, entradas, comandos, critérios de aceite).

---

## Fase 1 — Execução por DAG (com paralelismo seguro)
Para cada “nível” do DAG:
- Selecionar passos **sem dependências pendentes** (até `MAX_PARALLEL`), respeitar `agente` (RACI) e `ferramentas/comandos`.
- Para **cada passo Pk**:
  - Antes:
    - Verificar **entradas** existem e são válidas.
    - Se `DRY_RUN: true`, **não** executar comandos — apenas validar pré-condições.
  - Durante:
    - Executar `ferramentas/comandos` exatamente como no plano.
    - Redirecionar stdout/stderr para `${LOGS_DIR}/Pk.log`.
    - Timeout: `TIMEOUT_PER_STEP_MIN`.
  - Depois:
    - Validar **critérios de aceite** do passo.
    - Salvar **saídas/artefatos** em `${ARTIFACTS_DIR}/Pk/` (nomear claramente).
    - Capturar **evidências** mínimas (checksums/prints/links).
    - Atualizar **observabilidade** (Seção 10): métricas/logs/traces com tag `${OBS_TAG}`.
  - Falhas:
    - Aplicar **retries** (até `RETRY_LIMIT`, com backoff).
    - Persistir diagnóstico em `${REPORTS_DIR}/Pk.failure.json`.
    - Se ainda falhar:
      - Aplicar **mitigação/contingência** definida na Seção 13.
      - Se não houver, **pausar execução** e registrar “bloqueio crítico” com “Fonte” e hipótese.
      - Marcar o plano como **não-concluído** (pular Fase Final).

---

## Fase 2 — Gates de Qualidade, Segurança & Release
1) **Qualidade & Testes** (Seção 8):
   - Rodar testes unit/integration/e2e; respeitar thresholds.
   - Publicar relatórios em `${REPORTS_DIR}/qa/`.
   - Falhou threshold? Aplicar mitigação (Seção 13) ou marcar bloqueio.
2) **Segurança, Privacidade & Compliance** (Seção 9):
   - Scans de SAST/DAST/Dependências; checar PII/segredos.
   - Relatórios em `${REPORTS_DIR}/sec/`.
   - Falhas críticas → mitigação ou bloqueio.
3) **Observabilidade** (Seção 10):
   - Validar que métricas/logs/traces/alertas/painéis foram criados/atualizados.
4) **Release & Rollback** (Seção 11):
   - Executar estratégia definida (blue/green/canary).
   - Registrar go/no-go, incluindo critérios e evidências.
   - Preparar rollback automático e testá-lo se previsto.

---

## Fase 3 — Sucesso, Custos & Fechamento
1) **Métricas de Sucesso**:
   - Calcular/confirmar `success_metrics` (meta-header) + KPIs/OKRs (Seção 1).
   - Publicar resumo em `${REPORTS_DIR}/success.json`.
2) **Custos & Orçamento** (Seção 14):
   - Estimar/atualizar custos: compute/storage/APIs.
   - Salvar em `${REPORTS_DIR}/costs.json`.
3) **Changelog do Plano** (Seção 18):
   - Registrar tudo que foi **executado**, decisões (com “Fonte: ...”), evidências (paths/links), e ajustes (hipóteses/mitigações usadas).
4) **Commit & Move do Plano** (apenas se TUDO passou):
   - Se `DRY_RUN == false`:
     - `git add ${ARTIFACTS_DIR} ${LOGS_DIR} ${REPORTS_DIR}`
     - `git commit -m "run(${PLAN_ID}): artifacts+logs+reports"`
     - **Mover o plano executado**:
       - `mkdir -p ${FINAL_DIR}`
       - `git mv "${PLAN_PATH}" "${FINAL_DIR}/"`
       - `git commit -m "run(${PLAN_ID}): move plan to ${FINAL_DIR}"`
     - (Opcional) Tag: `git tag "run-${PLAN_ID}-$(date +%Y%m%d)"`
     - (Opcional) Push: `git push --follow-tags`
5) **Se Falhou**:
   - Não mover o plano. Persistir estado, relatórios e próximos passos sugeridos (Seção 17 com hipóteses executáveis).

---

## Regras de Execução & Evidências
- **Idempotência**: re-executar não deve corromper estado; scripts devem checar existência antes de criar/modificar.
- **Determinismo**: versões fixadas; seeds/dados sintéticos com RNG controlado (quando aplicável).
- **Evidências mínimas por passo**:
  - Logs (`${LOGS_DIR}/Pk.log`)
  - Artefatos (`${ARTIFACTS_DIR}/Pk/*`)
  - Checksums/URLs/IDs de release
  - Linhas “Fonte: @docs/... / @agents/... / ADR ...” no Changelog
- **Segredos**: nunca imprimir; usar mecanismo de vault conforme @docs (citar “Fonte”).

---

## Pseudocódigo do Orquestrador

```bash
set -euo pipefail

# 0) Carregar plano e meta-header
PLAN_PATH="plans/{PLAN_FILE}"
PLAN_ID=$(yq '.plan.id' "${PLAN_PATH}")
FINAL_DIR="plans/fineshed"

# 1) Preparar dirs
mkdir -p "artifacts/${PLAN_ID}" "logs/${PLAN_ID}" "reports/${PLAN_ID}" ".tmp/${PLAN_ID}"

# 2) Construir DAG e lista de passos (via parser markdown/yq)
#    Validar entradas, agentes e comandos por passo.

# 3) Executar por níveis do DAG (até MAX_PARALLEL)
#    Para cada passo:
#      - validar entradas
#      - executar comandos -> logs/${PLAN_ID}/P?.log
#      - verificar critérios de aceite
#      - salvar artefatos -> artifacts/${PLAN_ID}/P?/
#      - coletar evidências

# 4) Rodar gates QA/Sec/Release conforme plano

# 5) Se sucesso total: mover plano
git add "artifacts/${PLAN_ID}" "logs/${PLAN_ID}" "reports/${PLAN_ID}"
git commit -m "run(${PLAN_ID}): artifacts+logs+reports"
mkdir -p "${FINAL_DIR}"
git mv "${PLAN_PATH}" "${FINAL_DIR}/"
git commit -m "run(${PLAN_ID}): move plan to ${FINAL_DIR}"
