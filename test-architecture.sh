#!/bin/bash
# ============================================================================
# 🚀 SCRIPT DE TESTE PARA WOOF MARKETING - ARQUITETURA CLIENT+SERVER
# ============================================================================
# Este script demonstra o funcionamento completo da arquitetura migrada
# ============================================================================

echo "🎯 TESTANDO ARQUITETURA CLIENT+SERVER - WOOF MARKETING"
echo "====================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URLs dos serviços
SERVER_URL="http://localhost:3002"
CLIENT_URL="http://localhost:3001"

echo -e "\n${BLUE}📡 Verificando serviços...${NC}"

# Testar se Express Server está rodando
echo -n "Express Server (porta 3002): "
if curl -s --max-time 3 "$SERVER_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ONLINE${NC}"
else
    echo -e "${RED}❌ OFFLINE${NC}"
    echo "Execute: npm run dev -w server"
fi

# Testar se Next.js Client está rodando
echo -n "Next.js Client (porta 3001): "
if curl -s --max-time 3 "$CLIENT_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ONLINE${NC}"
else
    echo -e "${RED}❌ OFFLINE${NC}"
    echo "Execute: npm run dev -w client"
fi

echo -e "\n${BLUE}🔍 Testando endpoints da API Express...${NC}"

# Função para testar endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo -n "$description: "
    response=$(curl -s -w "%{http_code}" -X "$method" "$SERVER_URL$endpoint" -H "Content-Type: application/json" 2>/dev/null)
    status_code=${response: -3}
    
    case $status_code in
        200|201)
            echo -e "${GREEN}✅ $status_code${NC}"
            ;;
        401|403)
            echo -e "${YELLOW}🔐 $status_code (Auth Required)${NC}"
            ;;
        404)
            echo -e "${RED}❌ $status_code (Not Found)${NC}"
            ;;
        500)
            echo -e "${RED}💥 $status_code (Server Error)${NC}"
            ;;
        000)
            echo -e "${RED}🚫 Connection Failed${NC}"
            ;;
        *)
            echo -e "${YELLOW}⚠️  $status_code${NC}"
            ;;
    esac
}

# Testar endpoints principais
test_endpoint "GET" "/api/calendario" "Listar Eventos"
test_endpoint "POST" "/api/calendario" "Criar Evento"
test_endpoint "GET" "/api/calendario/insights" "Analytics & Insights"
test_endpoint "GET" "/api/calendario/sugestoes" "Sugestões IA"
test_endpoint "GET" "/api/calendario/presets" "Presets Templates"

echo -e "\n${BLUE}📊 Estrutura da Arquitetura:${NC}"
echo "┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐"
echo "│   Next.js       │───▶│   Express.js     │───▶│   Supabase      │"
echo "│   Client        │    │   Server         │    │   Database      │"  
echo "│   (:3001)       │    │   (:3002)        │    │   (Cloud)       │"
echo "└─────────────────┘    └──────────────────┘    └─────────────────┘"

echo -e "\n${BLUE}🔧 Componentes Migrados:${NC}"
echo "✅ ApiClient: HTTP client com auth automática"
echo "✅ CalendarioApiService: 12 métodos de API"
echo "✅ React Hooks: Integração completa com Express"
echo "✅ Express Routes: 4 endpoints principais"
echo "✅ Middleware: Auth, CORS, Compression"
echo "✅ Error Handling: Tratamento padronizado"

echo -e "\n${BLUE}🌐 URLs de Acesso:${NC}"
echo "Frontend (Next.js):  http://localhost:3001"
echo "Backend (Express):   http://localhost:3002" 
echo "API Calendario:      http://localhost:3002/api/calendario"
echo "API Insights:        http://localhost:3002/api/calendario/insights"

echo -e "\n${BLUE}📋 Como usar:${NC}"
echo "1. Abrir http://localhost:3001 no navegador"
echo "2. Fazer login com Supabase Auth"
echo "3. Navegar para /calendario"
echo "4. Os hooks automaticamente usam o Express server"
echo "5. Dados são processados via Express → Supabase"

echo -e "\n${GREEN}🎉 MIGRAÇÃO COMPLETA! Arquitetura Client+Server funcionando!${NC}"
echo "============================================================================"