'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Sparkles, Upload, Link2, Search, Filter, Clock, CheckCircle, AlertCircle, BookOpen, Users, Zap } from 'lucide-react';
import { useBrandManual } from '@/hooks/features/useBrandManual';
import { BrandManual } from '@/lib/utils/brand-manual-types';
import { ManualCard, StatsCard, CreateManualModal, LoadingGrid } from '@/components/brand-manual';

export default function ManualMarcaPage() {
  const {
    manuals,
    userStats,
    loading,
    error,
    fetchUserManuals,
    createManual,
    duplicateManual,
    deleteManual,
    generateShareLink,
    getUserStats,
    resetError
  } = useBrandManual();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  useEffect(() => {
    fetchUserManuals();
    getUserStats();
  }, [fetchUserManuals, getUserStats]);

  // Filtros
  const filteredManuals = manuals.filter(manual => {
    const matchesSearch = manual.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manual.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || manual.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateManual = async (method: 'manual' | 'ai_extraction', data: any) => {
    await createManual({
      brand_name: data.brand_name,
      description: data.description,
      creation_method: method,
      tags: data.tags || []
    });
  };

  const handleView = (id: string) => {
    window.open(`/manual-marca/${id}`, '_blank');
  };

  const handleEdit = (id: string) => {
    window.location.href = `/manual-marca/${id}/editar`;
  };

  const handleDuplicate = async (id: string) => {
    if (confirm('Deseja duplicar este manual?')) {
      await duplicateManual(id);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este manual? Esta ação não pode ser desfeita.')) {
      await deleteManual(id);
    }
  };

  const handleShare = async (id: string) => {
    const shareLink = await generateShareLink(id);
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      alert('Link de compartilhamento copiado!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-8 h-8 text-orange-500 mr-3" />
                Manual da Marca
              </h1>
              <p className="text-gray-600 mt-1">
                Crie e gerencie manuais de marca para padronizar sua identidade visual e comunicação digital
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Novo Manual
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Erro encontrado</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
                <button 
                  onClick={resetError}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas */}
        {userStats && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatsCard
                title="Total de Manuais"
                value={userStats.total_manuals}
                color="default"
                icon={<BookOpen className="w-6 h-6" />}
              />
              <StatsCard
                title="Publicados"
                value={userStats.published_count}
                color="green"
                icon={<CheckCircle className="w-6 h-6" />}
              />
              <StatsCard
                title="Rascunhos"
                value={userStats.draft_count}
                color="yellow"
                icon={<Clock className="w-6 h-6" />}
              />
              <StatsCard
                title="Gerados por IA"
                value={userStats.ai_generated_count}
                color="purple"
                icon={<Sparkles className="w-6 h-6" />}
              />
            </div>
          </div>
        )}

        {/* Search and Filters Card */}
        <div className="mb-8">
          <div className="bg-white shadow-lg border-0 rounded-xl">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Buscar Manuais</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por nome da marca ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>
                
                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white appearance-none"
                    >
                      <option value="all">Todos os Status</option>
                      <option value="draft">Rascunhos</option>
                      <option value="published">Publicados</option>
                      <option value="archived">Arquivados</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <span className="text-gray-600">Carregando manuais...</span>
              </div>
            </div>
          ) : filteredManuals.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Nenhum manual encontrado' : 'Ainda não há manuais'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca para encontrar o que procura.'
                    : 'Comece criando seu primeiro manual da marca para padronizar sua identidade visual.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 inline-flex items-center gap-2 shadow-lg font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Criar Primeiro Manual
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {filteredManuals.length === manuals.length 
                  ? `Todos os Manuais (${filteredManuals.length})`
                  : `Resultados da Busca (${filteredManuals.length})`
                }
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredManuals.map((manual) => (
                  <ManualCard
                    key={manual.id}
                    manual={manual}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                    onShare={handleShare}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Criação */}
        <CreateManualModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateManual={handleCreateManual}
        />
      </div>
    </div>
  );
}
