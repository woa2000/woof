'use client';

import { useState } from 'react';
import { MoreHorizontal, Eye, RefreshCw, Trash2, Share, Globe, ExternalLink, Clock, CheckCircle, Users, Target, AlertTriangle, Calendar, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { AnamneseDigital } from '@/lib/types/anamnese';

interface AnamneseCardProps {
  anamnese: AnamneseDigital;
  onView: (anamnese: AnamneseDigital) => void;
  onReprocess: (anamnese: AnamneseDigital) => void;
  onDelete: (id: string) => void;
  onShare?: (id: string) => void;
  isProcessing?: boolean;
}

function StatusBadge({ status }: { status: 'complete' | 'processing' | 'draft' }) {
  const styles = {
    complete: 'bg-green-100 text-green-800 border-green-200',
    processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    draft: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const icons = {
    complete: CheckCircle,
    processing: RefreshCw,
    draft: Clock
  };

  const Icon = icons[status];

  const labels = {
    complete: 'Completa',
    processing: 'Processando',
    draft: 'Rascunho'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${styles[status]}`}>
      <Icon className="w-3 h-3" />
      {labels[status]}
    </span>
  );
}

export default function AnamneseCard({
  anamnese,
  onView,
  onReprocess,
  onDelete,
  onShare,
  isProcessing = false
}: AnamneseCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  // Formatação de data mais elegante
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  // Calcular métricas de progresso
  const personasCount = anamnese.personas?.length || 0;
  const quickWinsCount = anamnese.plano_tratamento_e_evolucao?.quick_wins?.length || 0;
  const roadmapCount = anamnese.roadmap_terapeutico?.length || 0;
  const redesSociais = anamnese.redes_sociais || [];

  // Status baseado no processamento
  const status = isProcessing ? 'processing' : 'complete';

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-orange-200 transition-all duration-200 group relative">
      {/* Ribbon para status especial */}
      {status === 'complete' && personasCount > 0 && (
        <div className="absolute top-3 right-3 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-orange-500"></div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={status} />
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              title="Mais opções"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <>
                {/* Overlay para fechar menu */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={() => { onView(anamnese); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => { onReprocess(anamnese); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    disabled={isProcessing}
                  >
                    <RefreshCw className="w-4 h-4" />
                    {isProcessing ? 'Processando...' : 'Reprocessar'}
                  </button>
                  {onShare && anamnese.id && (
                    <button
                      onClick={() => { onShare(anamnese.id!); setShowMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Share className="w-4 h-4" />
                      Compartilhar
                    </button>
                  )}
                  <hr className="my-1" />
                  {anamnese.id && (
                    <button
                      onClick={() => { onDelete(anamnese.id!); setShowMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="cursor-pointer" onClick={() => onView(anamnese)}>
          {/* Título e URL */}
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors truncate">
              {getHostname(anamnese.url_analisada)}
            </h3>
            <a 
              href={anamnese.url_analisada} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-orange-500 transition-colors flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {anamnese.url_analisada}
          </p>

          {/* Métricas */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Análise digital</span>
              <span className="font-medium">{personasCount + quickWinsCount + roadmapCount} itens</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-orange-50 rounded-lg p-2 text-center">
                <div className="text-sm font-semibold text-orange-700">{personasCount}</div>
                <div className="text-xs text-orange-600">Personas</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-sm font-semibold text-blue-700">{quickWinsCount}</div>
                <div className="text-xs text-blue-600">Quick Wins</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <div className="text-sm font-semibold text-green-700">{roadmapCount}</div>
                <div className="text-xs text-green-600">Roadmap</div>
              </div>
            </div>
            
            {/* Barra de progresso visual */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
                style={{ width: `${Math.min(100, (personasCount + quickWinsCount + roadmapCount) * 10)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-orange-600 bg-orange-100">
            <Target className="w-3 h-3" />
            <span className="font-medium">Anamnese IA</span>
          </div>
          <span title={anamnese.created_at ? new Date(anamnese.created_at).toLocaleString('pt-BR') : undefined}>
            {formatDate(anamnese.created_at)}
          </span>
        </div>

        {/* Redes Sociais (como tags) */}
        {redesSociais.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {redesSociais.slice(0, 2).map((rede, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md hover:bg-blue-200 transition-colors"
              >
                {getHostname(rede)}
              </span>
            ))}
            {redesSociais.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{redesSociais.length - 2} mais
              </span>
            )}
          </div>
        )}
      </div>

      {/* Ações rápidas ao hover */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReprocess(anamnese);
            }}
            className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-lg"
            title="Reprocessar anamnese"
            disabled={isProcessing}
          >
            <RefreshCw className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(anamnese);
            }}
            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-lg"
            title="Visualizar anamnese"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
