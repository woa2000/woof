#!/bin/bash
# Monitor de status dos serviços

echo "🔍 STATUS DOS SERVIÇOS - WOOF MARKETING"
echo "======================================"

while true; do
    clear
    echo "🔍 STATUS DOS SERVIÇOS - WOOF MARKETING"
    echo "======================================"
    echo "$(date)"
    echo ""
    
    # Verificar Express Server
    if curl -s --max-time 2 http://localhost:3002 > /dev/null 2>&1; then
        echo "✅ Express Server (3002): ONLINE"
    else
        echo "❌ Express Server (3002): OFFLINE"
    fi
    
    # Verificar Next.js Client
    if curl -s --max-time 2 http://localhost:3001 > /dev/null 2>&1; then
        echo "✅ Next.js Client (3001): ONLINE"
    else
        echo "❌ Next.js Client (3001): OFFLINE"
    fi
    
    echo ""
    echo "URLs:"
    echo "Frontend: http://localhost:3001"
    echo "Backend:  http://localhost:3002/api/calendario"
    echo ""
    echo "Pressione Ctrl+C para parar..."
    
    sleep 5
done