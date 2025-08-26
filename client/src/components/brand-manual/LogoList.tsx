'use client';

import { useState } from 'react';
import { Edit2, Trash2, Eye, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import { removeBrandLogo } from '@/lib/brand-logo-upload';

interface LogoListProps {
  logos: any[];
  onLogoUpdated: (logoIndex: number, updatedLogo: any) => void;
  onLogoRemoved: (logoIndex: number) => void;
}

export default function LogoList({ logos, onLogoUpdated, onLogoRemoved }: LogoListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const logoVersionLabels: Record<string, string> = {
    principal_colorida: 'Principal Colorida',
    monocromatica_preta: 'Monocromática Preta',
    monocromatica_branca: 'Monocromática Branca',
    escala_cinza: 'Escala de Cinza'
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const getFileTypeIcon = (format: string) => {
    const type = format?.toLowerCase();
    if (type === 'svg') return '🎨';
    if (type === 'png' || type === 'jpg' || type === 'jpeg') return '🖼️';
    if (type === 'pdf') return '📄';
    return '📁';
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingNotes(logos[index].application_notes || '');
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    
    const updatedLogo = {
      ...logos[editingIndex],
      application_notes: editingNotes
    };
    
    onLogoUpdated(editingIndex, updatedLogo);
    setEditingIndex(null);
    setEditingNotes('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingNotes('');
  };

  const handleRemove = async (index: number) => {
    if (!confirm('Tem certeza que deseja remover este logotipo?')) return;
    
    setRemovingIndex(index);
    
    try {
      const logo = logos[index];
      if (logo.storage_path) {
        const result = await removeBrandLogo(logo.storage_path);
        if (!result.success) {
          console.warn('Erro ao remover arquivo do storage:', result.error);
          // Continua removendo da lista mesmo se houver erro no storage
        }
      }
      
      onLogoRemoved(index);
    } catch (error) {
      console.error('Erro ao remover logo:', error);
      alert('Erro ao remover logotipo. Tente novamente.');
    } finally {
      setRemovingIndex(null);
    }
  };

  const handlePreview = (logo: any) => {
    if (logo.file_url) {
      window.open(logo.file_url, '_blank');
    }
  };

  const handleDownload = (logo: any) => {
    if (logo.file_url) {
      const link = document.createElement('a');
      link.href = logo.file_url;
      link.download = logo.file_name || 'logo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (logos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-4">📷</div>
        <p className="text-sm">Nenhum logotipo adicionado ainda.</p>
        <p className="text-xs mt-1">Clique em "Adicionar Logotipo" para começar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logos.map((logo, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            {/* Informações do Logo */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{getFileTypeIcon(logo.format)}</span>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {logoVersionLabels[logo.version] || logo.version}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{logo.file_name}</span>
                    <span>{formatFileSize(logo.size_bytes)}</span>
                    <span className="uppercase">{logo.format}</span>
                  </div>
                </div>
              </div>

              {/* Preview do Logo */}
              {logo.file_url && (
                <div className="mb-3">
                  <img
                    src={logo.file_url}
                    alt={`Logo ${logoVersionLabels[logo.version]}`}
                    className="h-16 w-auto border border-gray-200 rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Notas de Aplicação */}
              {editingIndex === index ? (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas de Aplicação
                  </label>
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Ex: Use apenas em fundos claros, mantenha proporção..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      onClick={handleSaveEdit}
                      className="text-xs px-3 py-1"
                    >
                      Salvar
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="secondary"
                      className="text-xs px-3 py-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                logo.application_notes && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 italic">
                      "{logo.application_notes}"
                    </p>
                  </div>
                )
              )}

              {/* Data de Upload */}
              {logo.uploaded_at && (
                <p className="text-xs text-gray-400">
                  Adicionado em {new Date(logo.uploaded_at).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-1 ml-4">
              {logo.file_url && (
                <>
                  <button
                    onClick={() => handlePreview(logo)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(logo)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                    title="Baixar"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </>
              )}
              
              <button
                onClick={() => handleEdit(index)}
                disabled={editingIndex === index}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                title="Editar notas"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleRemove(index)}
                disabled={removingIndex === index}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                title="Remover"
              >
                {removingIndex === index ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
