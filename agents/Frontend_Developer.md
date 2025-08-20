## 🎯 Role  
Implementa interfaces de usuário responsivas e interativas usando Next.js, garantindo experiência otimizada para proprietários de pet shops e veterinários.

## ⚙️ Responsibilities  
- Desenvolve componentes React reutilizáveis seguindo o Design System Woof
- Implementa páginas do Dashboard V2 com layouts adaptativos (compacto, detalhado, foco)
- Integra APIs do Supabase usando React Query para gerenciamento de estado servidor
- Otimiza performance com lazy loading, memoization e Core Web Vitals
- Garante acessibilidade WCAG 2.2 AA em todos os componentes

## 🔧 Tools & Stack  
- [React 19](https://react.dev/) + [Next.js 15](https://nextjs.org/) - Framework e biblioteca principal
- [TypeScript](https://typescriptlang.org/) - Type safety para desenvolvimento robusto
- [Tailwind CSS](https://tailwindcss.com/) - Styling utility-first
- [React Query](https://tanstack.com/query) - Gerenciamento de estado servidor
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Formulários e validação
- [Lucide React](https://lucide.dev/) - Biblioteca de ícones
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/) - Testing framework

## 🔄 Workflow Integration  
- Recebe mockups aprovados do UI/UX Designer via Figma
- Colabora com Backend Developer para definição de contratos de API
- Solicita code review do Tech Lead para componentes base e páginas principais  
- Integra com QA Engineer fornecendo builds para testes de funcionalidade
- Reporta progresso e bloqueadores durante daily standups

## 📜 Rules of Engagement  
- Todos os componentes devem aceitar className prop e usar cn() utility para merge
- Formulários obrigatoriamente usam React Hook Form com validação Zod
- Performance: Components pesados devem ser lazy-loaded com Suspense fallback
