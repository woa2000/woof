# 🚀 WOOF MARKETING - ARQUITETURA CLIENT+SERVER

## **🎉 MIGRAÇÃO COMPLETA - TODAS AS FASES IMPLEMENTADAS**

Este projeto foi migrado com sucesso de uma arquitetura monolítica Next.js para uma arquitetura moderna **Client + Server**.

---

## **📋 Como Executar o Projeto**

### **⚡ Execução Rápida (Recomendada)**

```bash
# 1. Instalar dependências do monorepo
npm install

# 2. Iniciar ambos os serviços em paralelo
npm run dev  # Inicia client + server simultaneamente
```

### **🔧 Execução Manual (Controle Granular)**

```bash
# Terminal 1 - Express Server (Backend)
npm run dev -w server
# Roda em: http://localhost:3002

# Terminal 2 - Next.js Client (Frontend)  
npm run dev -w client
# Roda em: http://localhost:3001
```

---

## **🌐 URLs de Acesso**

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | `http://localhost:3001` | Interface Next.js |
| **Backend** | `http://localhost:3002` | API Express |
| **API Calendário** | `http://localhost:3002/api/calendario` | Endpoints REST |

---

## **🏗️ Arquitetura Implementada**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js       │───▶│   Express.js     │───▶│   Supabase      │
│   Client        │    │   Server         │    │   Database      │  
│   (:3001)       │    │   (:3002)        │    │   (Cloud)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **🔄 Fluxo de Dados**
1. **UI Component** → React Hook
2. **Hook** → CalendarioApiService  
3. **Service** → ApiClient (HTTP)
4. **ApiClient** → Express Server
5. **Express** → Middleware + Routes
6. **Express** → Supabase Database
7. **Response** volta pelo mesmo caminho

---

## **🔧 Componentes Migrados**

### **✅ Frontend (Next.js Client)**
- **ApiClient**: HTTP client com auth automática
- **CalendarioApiService**: 12 métodos de integração
- **React Hooks**: useCalendarioEventos, useCalendarioMutations, etc.
- **Environment**: Configuração NEXT_PUBLIC_API_BASE_URL

### **✅ Backend (Express Server)**  
- **4 Rotas principais**: calendario, insights, sugestoes, presets
- **Middleware**: Autenticação Supabase, CORS, Compression
- **Error Handling**: Tratamento padronizado de erros
- **TypeScript**: Tipagem completa

---

## **📁 Estrutura do Projeto**

```
woof/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── lib/api-client.ts           # HTTP Client
│   │   ├── services/calendario-api.ts   # API Service  
│   │   └── hooks/calendario/           # React Hooks
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── routes/         # API Routes
│   │   ├── middleware/     # Auth, CORS, etc
│   │   └── utils/          # Helpers
│   └── package.json
│
├── package.json            # Monorepo Workspace
├── test-architecture.sh    # Script de Testes
└── MIGRATION_COMPLETE.md   # Documentação Completa
```

---

## **🧪 Testes e Validação**

### **📋 Script Automático**
```bash
# Executar bateria completa de testes
./test-architecture.sh
```

### **🔍 Testes Manuais**
```bash
# Testar API Express diretamente
curl http://localhost:3002/api/calendario

# Verificar status dos serviços
curl http://localhost:3001  # Frontend
curl http://localhost:3002  # Backend
```

---

## **🔑 Autenticação**

O sistema usa **Supabase Auth** integrado:

1. **Frontend**: Gerencia sessão do usuário
2. **ApiClient**: Adiciona token automaticamente nos headers
3. **Express Server**: Valida token via middleware
4. **Supabase**: Processa autenticação e autorização

---

## **🚀 Próximos Passos**

### **📈 Melhorias Técnicas**
- [ ] Implementar retry logic
- [ ] Adicionar rate limiting  
- [ ] Sistema de logs estruturados
- [ ] Cache distribuído (Redis)

### **🔧 Deploy & Produção**
- [ ] Containerização Docker
- [ ] CI/CD Pipeline
- [ ] Load Balancer (Nginx)
- [ ] SSL/TLS (Let's Encrypt)

### **📊 Monitoramento**
- [ ] Health checks
- [ ] Métricas de performance
- [ ] Alertas automáticos
- [ ] Dashboard de monitoring

---

## **❗ Troubleshooting**

### **🔧 Problemas Comuns**

**1. "EADDRINUSE" - Porta ocupada**
```bash
# Matar processos nas portas
lsof -ti:3001 | xargs kill -9  # Frontend
lsof -ti:3002 | xargs kill -9  # Backend
```

**2. "Token de acesso requerido"**
- ✅ Normal - APIs exigem autenticação
- Faça login no frontend primeiro

**3. "Connection refused"**
```bash
# Verificar se os serviços estão rodando
npm run dev -w server  # Terminal 1
npm run dev -w client  # Terminal 2
```

---

## **📞 Suporte**

- **Documentação**: `MIGRATION_COMPLETE.md`
- **Scripts**: `test-architecture.sh`, `monitor-status.sh`  
- **Logs**: Verifique output dos terminais server/client

---

## **🏆 Status da Migração**

### **✅ FASE 1: Monorepo Setup** - COMPLETA
- npm workspaces configurado
- Client/Server separados
- Dependências sincronizadas

### **✅ FASE 2: API Migration** - COMPLETA  
- 4 endpoints migrados para Express
- Middleware implementado
- Error handling padronizado

### **✅ FASE 3: Client Integration** - COMPLETA
- Hooks migrados para usar Express
- ApiClient implementado
- Integração end-to-end funcionando

---

**🎉 MIGRAÇÃO 100% CONCLUÍDA COM SUCESSO! 🎉**

*Arquitetura moderna, escalável e pronta para produção!*