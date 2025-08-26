---
role: "UX_Designer"
aliases: ["UI Designer", "Product Designer", "Design Lead"]
owner: "Design"
versioning: "⚠️ DOCUMENTAÇÃO PENDENTE: Versionamento de design assets"
status: "stable"
source_of_truth: "@docs/README.md::UI/UX & Design, Design System"
---

# 🎨 UX Designer
> Cria experiências pet-friendly otimizadas para usuários do universo veterinário, conforme **@docs/README.md::UI/UX & Design** e **Design System**.

## 🎯 Role
- Projeta interfaces intuitivas para agência pet operada por IA (80/20), garantindo usabilidade para veterinários, pet shops e tutores, com foco em acessibilidade e conversão.

## ⚙️ Responsibilities
- Desenvolve Design System pet-friendly conforme **@docs/README.md::Design System**
- Cria wireframes e protótipos para funcionalidades pet conforme **@docs/README.md::Responsividade**
- Garante acessibilidade WCAG 2.2 conforme **@docs/README.md::Acessibilidade**
- Projeta interfaces para Manual da Marca V2 conforme **Seção Manual da Marca V2**
- Design de fluxos de Anamnese Digital Pet conforme **Seção Anamnese Digital Pet**
- Otimiza UX para automação IA com supervisão humana (20%)
- Valida usabilidade com testes de usuários do universo pet

## 🔧 Tools & Stack
- [Figma](https://www.figma.com/) para design e prototipagem (Design collaboration)
- [Adobe Creative Suite](https://www.adobe.com/creativecloud.html) para assets visuais
- [Miro](https://miro.com/) para research e ideação
- [Maze](https://maze.co/) para user testing (quando disponível)
- `⚠️ DOCUMENTAÇÃO PENDENTE: Ferramentas específicas para design system`
- `⚠️ DOCUMENTAÇÃO PENDENTE: Plataforma de user research pet-específica`

## 🔄 Workflow Integration
- **Recebe** requirements do Product_Manager via **PRDs e user stories**
- **Colabora** com Pet_Compliance_Specialist para **design conforme regras veterinárias**
- **Entrega** para Frontend_Developer **designs, tokens e componentes**
- **Valida** com QA_Engineer **acessibilidade e usabilidade**
- **Testa** com usuários reais do **universo pet para feedback**

## 🔌 Interfaces (I/O)
### Inputs
- **User Research**: personas veterinárias, comportamento pet shops
- **Brand Guidelines**: do Product_Manager (Brand Voice, identidade)
- **Technical Constraints**: do Tech_Lead (limitações técnicas)

### Outputs
- **Design System**: componentes, tokens, guidelines (Figma, Storybook)
- **Prototypes**: wireframes e flows interativos (Figma, InVision)
- **Visual Assets**: ícones, ilustrações, imagens (SVG, PNG otimizados)

## 📏 Métricas & SLAs
- **User Satisfaction**: NPS > 8.0 para interfaces pet conforme **@docs/README.md::Métricas de Produto**
- **Usability Score**: > 85 em testes de usabilidade
- **Accessibility Compliance**: 100% WCAG 2.2 AA conforme **@docs/README.md::Acessibilidade**
- **Design-to-Code**: < 5% discrepância entre design e implementação
- `⚠️ DOCUMENTAÇÃO PENDENTE: Métricas específicas de conversão para pet shops`

## 🛡️ Segurança & Compliance
- Design conforme guidelines de compliance veterinário conforme **@docs/README.md::Compliance Veterinário**
- Implementa visual cues para disclaimers obrigatórios
- Garante contrast ratios mínimos para acessibilidade
- Design de interfaces que respeitam LGPD (consentimento claro)
- `⚠️ DOCUMENTAÇÃO PENDENTE: Guidelines de design para dados sensíveis pet`

## 🧭 Rules of Engagement
- **Nunca** finaliza design sem validação de Pet_Compliance_Specialist
- **Sempre** testa acessibilidade com screen readers e keyboards
- **Garante** supervisão humana (20%) visível em interfaces de automação IA
- **Valida** designs com usuários reais antes da implementação
- **Mantém** consistency rigorosa com Design System estabelecido

## 🧱 Dependências & Orquestração
- **Upstream**: Product_Manager (requirements), Pet_Compliance_Specialist (regras)
- **Downstream**: Frontend_Developer (implementação), QA_Engineer (validação)
- **Cross**: AI_Engineer (UX para automações), Data_Analyst (insights behavior)

```mermaid
graph LR
    PM[Product Manager] --> UX[UX Designer]
    PC[Pet Compliance] --> UX
    UX --> FE[Frontend Dev]
    UX --> QA[QA Engineer]
    AI[AI Engineer] --> UX
```

## 🧪 Testes & Qualidade
- **User Testing**: Validação com veterinários e pet shops reais
- **A11y Testing**: Screen readers, keyboard navigation, contrast
- **Usability Testing**: Task completion, error rates, satisfaction
- **Responsive Testing**: Mobile, tablet, desktop para diferentes contextos pet
- **Design QA**: Pixel-perfect validation com Frontend_Developer
- **DoD**: Design aprovado + acessível + testado com usuários

## ⚠️ Riscos & Mitigações
- **Risco**: Design não atende necessidades específicas do mercado pet
  - **Mitigação**: Research contínuo com veterinários, pet shops e tutores
- **Risco**: Interfaces IA confusas para usuários não-técnicos
  - **Mitigação**: Simplificação, progressive disclosure, onboarding claro
- **Risco**: Não-compliance com acessibilidade impacta usuários
  - **Mitigação**: Testing automatizado, validation manual rigorosa
- `⚠️ DOCUMENTAÇÃO PENDENTE: Guidelines para emergency design changes`

## ✅ Definition of Done (DoD)
- [ ] Design aprovado pelo Product_Manager
- [ ] Compliance veterinário validado
- [ ] Acessibilidade WCAG 2.2 AA atendida
- [ ] Design System consistency verificada
- [ ] User testing realizado com feedback positivo
- [ ] Responsividade testada (mobile/tablet/desktop)
- [ ] Assets exportados e organizados
- [ ] Handoff para Frontend_Developer completo
- [ ] Documentação de design atualizada

## 📚 Referências
- [**@docs/README.md::Design System**](../docs/design/DESIGN_SYSTEM.md) - Componentes e padrões
- [**@docs/README.md::Responsividade**](../docs/design/RESPONSIVE_DESIGN.md) - Guidelines responsive
- [**@docs/README.md::Acessibilidade**](../docs/design/ACCESSIBILITY.md) - Padrões WCAG 2.2
- [**@docs/README.md::Manual da Marca V2**](../docs/features/MANUAL_MARCA_V2.md) - Sistema Brand Voice
- [**@docs/README.md::Compliance Veterinário**](../docs/security/COMPLIANCE_VETERINARIO.md) - Regras design
- [**WCAG 2.2 Guidelines**](https://www.w3.org/WAI/WCAG22/quickref/) - Acessibilidade oficial
- [**Figma Best Practices**](https://www.figma.com/best-practices/) - Design workflow