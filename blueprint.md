## Blueprint: Woof Marketing Platform

**Visão Geral:**

O projeto "Woof Marketing Platform" é uma aplicação web construída com Next.js (App Router) e Tailwind CSS. O objetivo é fornecer uma plataforma de dashboard para gerenciar leads e campanhas de marketing, com foco em uma interface amigável e alinhada com a identidade visual da marca Woof.

**Recursos Implementados (Inicial):**

*   Configuração inicial do projeto Next.js.
*   Configuração do Tailwind CSS com a paleta de cores e fontes da marca Woof.
*   Definição de tipos de dados para Leads, Campanhas e AnamneseReport.
*   Criação de dados mocados para demonstração.
*   Instalação da biblioteca `lucide-react` para ícones.

**Plano de Ação Atual:**

1.  **Configurar Tailwind CSS:**
    *   Modificar `tailwind.config.js` para incluir as cores e fontes personalizadas.
2.  **Configurar Fontes Globais:**
    *   Atualizar `app/layout.tsx` para importar e usar as fontes Montserrat e Lato via `next/font`.
3.  **Criar Arquivos de Dados:**
    *   Criar `/lib/types.ts` com as interfaces `Lead`, `Campaign` e `AnamneseReport`.
    *   Criar `/lib/mock-data.ts` com dados de exemplo para campanhas, leads e relatórios de anamnese.
4.  **Criar Componentes Reutilizáveis (`/components/ui`):**
    *   Criar `Button.tsx` com variantes `primary` e `secondary`, e suporte a ícones.
    *   Criar `Card.tsx` para contêineres de informações.
    *   Criar `Logo.tsx` para exibir o word-mark da marca.
5.  **Criar Layout Principal do Dashboard (`/components/layout`):**
    *   Criar `Sidebar.tsx` com navegação lateral, exibindo a `Logo` e os links do menu com ícones.
    *   Criar `Header.tsx` com título da página e espaço para avatar/dropdown.
    *   Criar um group route `(dashboard)` em `/app`.
    *   Criar `layout.tsx` dentro de `/app/(dashboard)` para integrar a `Sidebar` e o `Header`.
6.  **Criar Páginas do Dashboard (`/app/(dashboard)`):
    *   Criar `/dashboard/page.tsx` para a página principal do dashboard, exibindo métricas com componentes `Card` e dados mocados.
    *   Criar `/leads/page.tsx` para a página de gestão de leads, exibindo uma tabela com dados mocados e um botão de exportar.
    *   Criar `/campanhas/page.tsx` para a página de campanhas, exibindo campanhas com componentes `Card` e dados mocados, destacando campanhas ativas.
    *   Criar arquivos placeholder (`page.tsx`) para "Landing Pages", "Anamnese Digital" e "Configurações" dentro do group route `(dashboard)`.
7.  **Revisão e Refinamento:**
    *   Garantir que todas as cores, fontes e espaçamentos sigam o Guia de Identidade Visual Woof.
    *   Executar o linter e corrigir quaisquer problemas.
    *   Verificar no preview se o layout e as páginas estão sendo renderizados corretamente.