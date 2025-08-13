# 🎨 **Migração de Paleta de Cores - Woof Digital**

## 📋 **Nova Paleta Oficial**

### **Cores Principais**
- `woof-blue: #a4c2dc` - Azul claro principal da marca
- `woof-dark-gray: #5a6872` - Cinza escuro para fundos
- `woof-white: #ffffff` - Branco para textos e logos

### **Cores Legadas (Mantidas para Compatibilidade)**
- `woof-orange: #FF6B00` - Cor primária (gradualmente sendo substituída)
- `dark-brown: #4A2E00` - Para títulos (gradualmente sendo substituída)
- `warm-yellow: #FFC25C` - Destaque
- `teal-accent: #009688` - Destaque
- `dark-gray: #333333` - Texto corrido
- `light-gray: #F4F4F4` - Fundos

## 🔄 **Estratégia de Migração**

### **Fase 1: Elementos Estruturais (CONCLUÍDA)**
- ✅ Sidebar: `bg-woof-dark-gray`, `text-woof-white`
- ✅ Navegação ativa: `bg-woof-blue`, `text-woof-dark-gray`
- ✅ Avatar: `bg-woof-blue`
- ✅ Logout button: `bg-woof-blue`, `text-woof-dark-gray`

### **Fase 2: Títulos e Textos Principais**
- 🔄 `text-dark-brown` → `text-woof-dark-gray`
- 🔄 Títulos principais mantém legibilidade

### **Fase 3: Elementos de Destaque**
- 🔄 Gradientes com azul da marca
- 🔄 Hover states com `woof-blue`
- 🔄 Estados ativos e focus com `woof-blue`

### **Fase 4: Elementos Decorativos**
- 🔄 Cards e bordas com tons da nova paleta
- 🔄 Ícones e elementos gráficos

## 📁 **Arquivos Atualizados**

### **Concluído ✅**
- `tailwind.config.mjs` - Nova paleta adicionada
- `src/components/layout/Sidebar.tsx` - Totalmente migrado

### **Pendente 🔄**
- Componentes de UI (StatCard, ActivityCard, etc.)
- Páginas de dashboard (V1 e V2)
- Componentes de formulário
- Elementos de alerta e notificação

## 🎯 **Regras de Aplicação**

### **Elementos de Fundo**
- **Principal**: `bg-woof-dark-gray` (sidebar, headers)
- **Secundário**: `bg-gray-50` ou `bg-white` (cards, modais)
- **Destaque**: `bg-woof-blue` (botões primários, elementos ativos)

### **Texto**
- **Principal**: `text-woof-dark-gray` (títulos, labels importantes)
- **Corpo**: `text-gray-600` ou `text-gray-700` (texto corrido)
- **Contraste**: `text-woof-white` (sobre fundos escuros)

### **Interações**
- **Hover**: `hover:bg-woof-blue hover:bg-opacity-20`
- **Active**: `bg-woof-blue text-woof-dark-gray`
- **Focus**: `focus:ring-woof-blue focus:border-woof-blue`

### **Gradientes (Quando Necessário)**
- **Suave**: `from-woof-blue to-blue-300`
- **Contraste**: `from-woof-dark-gray to-gray-600`

## 🚀 **Próximos Passos**

1. **Atualizar títulos principais** nos dashboards
2. **Migrar botões primários** para `woof-blue`
3. **Ajustar hover states** nos componentes de UI
4. **Revisar contrastes** para acessibilidade
5. **Testar em diferentes telas** para garantir legibilidade

## ⚠️ **Considerações de Acessibilidade**

- **Contraste mínimo**: 4.5:1 para texto normal
- **Contraste recomendado**: 7:1 para texto pequeno
- **Teste com daltonismo**: Verificar legibilidade para todos os tipos
- **Estados de foco**: Sempre visíveis e contrastantes

## 📊 **Status da Migração**

**Progresso Geral**: 15% concluído

- ✅ **Estrutural** (Sidebar): 100%
- 🔄 **Componentes UI**: 0%
- 🔄 **Dashboards**: 0%
- 🔄 **Formulários**: 0%
- 🔄 **Alertas/Notificações**: 0%

---

*Atualizado: 12 de agosto de 2025*
