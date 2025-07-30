'use client';

import { useState } from 'react';
import { MoreHorizontal, Eye, Edit, Copy, Trash2, Share, Clock, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { BrandManual } from '@/lib/brand-manual-types';

interface ManualCardProps {
  manual: BrandManual;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

function StatusBadge({ status }: { status: 'draft' | 'published' | 'archived' }) {
  const styles = {
    draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    published: 'bg-green-100 text-green-800 border-green-200',
    archived: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const icons = {
    draft: AlertCircle,
    published: CheckCircle,
    archived: Clock
  };

  const Icon = icons[status];

  const labels = {
    draft: 'Rascunho',
    published: 'Publicado',
    archived: 'Arquivado'
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${styles[status]}`}>
      <Icon className="w-3 h-3" />
      {labels[status]}
    </span>
  );
}

export default function ManualCard({
  manual,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onShare
}: ManualCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const completedChapters = manual.manual_data.chapters.filter(
    chapter => chapter.completion_status === 'complete'
  ).length;
  const totalChapters = manual.manual_data.chapters.length;
  const completionPercentage = Math.round((completedChapters / totalChapters) * 100);

  // Formatação de data mais elegante
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  // Método de criação com ícones e cores
  const getCreationMethodInfo = (method: string) => {
    switch (method) {
      case 'ai_extraction':
        return {
          icon: Sparkles,
          label: 'IA',
          color: 'text-purple-600 bg-purple-100'
        };
      case 'manual':
        return {
          icon: Edit,
          label: 'Manual',
          color: 'text-blue-600 bg-blue-100'
        };
      case 'hybrid':
        return {
          icon: Copy,
          label: 'Híbrido',
          color: 'text-green-600 bg-green-100'
        };
      default:
        return {
          icon: Edit,
          label: 'Manual',
          color: 'text-gray-600 bg-gray-100'
        };
    }
  };

  const creationMethod = getCreationMethodInfo(manual.creation_method);
  const CreationIcon = creationMethod.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group relative">
      {/* Ribbon para status especial */}
      {manual.status === 'published' && (
        <div className="absolute top-3 right-3 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-green-500"></div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={manual.status} />
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
                    onClick={() => { onView(manual.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => { onEdit(manual.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => { onDuplicate(manual.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicar
                  </button>
                  <button
                    onClick={() => { onShare(manual.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Share className="w-4 h-4" />
                    Compartilhar
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => { onDelete(manual.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="cursor-pointer" onClick={() => onView(manual.id)}>
          {/* Título e Descrição */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {manual.brand_name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {manual.description || 'Manual da marca criado para padronizar a identidade visual e comunicação digital.'}
          </p>

          {/* Progresso */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progresso dos capítulos</span>
              <span className="font-medium">{completedChapters}/{totalChapters}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  completionPercentage === 100 ? 'bg-green-500' :
                  completionPercentage >= 75 ? 'bg-blue-500' :
                  completionPercentage >= 50 ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
              {completionPercentage}% completo
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md ${creationMethod.color}`}>
            <CreationIcon className="w-3 h-3" />
            <span className="font-medium">{creationMethod.label}</span>
          </div>
          <span title={new Date(manual.updated_at).toLocaleString('pt-BR')}>
            {formatDate(manual.updated_at)}
          </span>
        </div>

        {/* Tags */}
        {manual.tags && manual.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {manual.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
            {manual.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{manual.tags.length - 2} mais
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
              onEdit(manual.id);
            }}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
            title="Editar manual"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(manual.id);
            }}
            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-lg"
            title="Visualizar manual"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
