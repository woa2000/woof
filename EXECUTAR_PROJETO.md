# 🚀 Como Executar o Projeto Woof

## Comandos Disponíveis

### Executar Cliente + Servidor Juntos
```bash
npm run dev
# ou
npm run dev:both
```

**Resultado:**
- 🖥️ **Cliente Next.js**: http://localhost:3001
- 🔧 **Servidor Express**: http://localhost:3002

### Executar Separadamente

**Apenas o Servidor:**
```bash
npm run server:dev
```

**Apenas o Cliente:**
```bash
npm run client:dev
```

## 📁 Estrutura dos Serviços

### Cliente (Port 3001)
- **Tecnologia**: Next.js 15.4.2
- **Localização**: `client/`
- **URL**: http://localhost:3001
- **Features**: Interface web, componentes React, hooks

### Servidor (Port 3002)
- **Tecnologia**: Express.js 4.19.2
- **Localização**: `server/`
- **URL**: http://localhost:3002
- **Features**: APIs REST, middleware auth, integração Supabase

## 🔗 APIs Disponíveis

Com o servidor rodando em http://localhost:3002:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET/POST | `/api/calendario` | Gerenciar calendário |
| GET/PUT/DELETE | `/api/calendario/:id` | Operações específicas |
| GET | `/api/calendario/insights` | Insights do calendário |
| GET | `/api/calendario/sugestoes` | Sugestões automáticas |
| GET/POST | `/api/calendario/presets` | Presets de calendário |

## ⚙️ Outros Comandos Úteis

```bash
# Build dos projetos
npm run build

# Linting
npm run lint

# Type checking
npm run type-check

# Limpar builds
npm run clean

# Verificar autenticação
npm run check-auth

# Debug storage
npm run debug-storage
```

## 🏁 Quick Start

1. **Instalar dependências** (se ainda não fez):
   ```bash
   npm install
   ```

2. **Executar ambos os serviços**:
   ```bash
   npm run dev
   ```

3. **Acessar**:
   - Frontend: http://localhost:3001
   - Backend APIs: http://localhost:3002

## 📊 Status dos Serviços

Quando executar `npm run dev`, você verá logs coloridos:
- **[SERVER]** em azul ciano: logs do Express.js
- **[CLIENT]** em magenta: logs do Next.js

Ambos os serviços devem mostrar "✓ Ready" para confirmar que estão funcionando.

## 🔧 Troubleshooting

- **Porta ocupada**: Se alguma porta estiver em uso, mate o processo ou mude no package.json
- **Dependências**: Execute `npm install` na raiz para instalar workspaces
- **Build errors**: Execute `npm run clean` e depois `npm run dev`

---

💡 **Dica**: Use `Ctrl+C` para parar ambos os serviços simultaneamente quando executar `npm run dev`.