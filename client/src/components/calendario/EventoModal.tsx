'use client';

import { useState, useEffect } from 'react';
import { 
  SazonalidadeResponse, 
  CreateSazonalidadeRequest, 
  UpdateSazonalidadeRequest 
} from '@/lib/calendario/calendario-types';

interface EventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  evento?: SazonalidadeResponse | null;
  selectedDate: Date;
  onCreate: (data: CreateSazonalidadeRequest) => Promise<void>;
  onUpdate: (id: string, data: UpdateSazonalidadeRequest) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
}

export function EventoModal({
  isOpen,
  onClose,
  evento,
  selectedDate,
  onCreate,
  onUpdate,
  isCreating,
  isUpdating,
}: EventoModalProps) {
  // Estados do formulário
  const [formData, setFormData] = useState({
    evento: '',
    categoria_pet: 'geral' as 'cachorro' | 'gato' | 'pet_exotico' | 'geral',
    data_inicio: '',
    data_fim: '',
    prioridade: 'media' as 'alta' | 'media' | 'baixa',
    tags: [] as string[],
    observacoes_veterinarias: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  // =====================================================
  // EFFECTS
  // =====================================================

  // Reset do formulário quando modal abre/fecha
  useEffect(() => {
    if (isOpen) {
      if (evento) {
        // Modo edição
        setFormData({
          evento: evento.evento,
          categoria_pet: evento.categoria_pet as 'cachorro' | 'gato' | 'pet_exotico' | 'geral',
          data_inicio: new Date(evento.data_inicio).toISOString().split('T')[0],
          data_fim: evento.data_fim ? new Date(evento.data_fim).toISOString().split('T')[0] : '',
          prioridade: evento.prioridade,
          tags: Array.isArray(evento.tags) ? evento.tags : [],
          observacoes_veterinarias: '', // Será usado no futuro quando o campo existir na interface
        });
      } else {
        // Modo criação
        const dateStr = selectedDate.toISOString().split('T')[0];
        setFormData({
          evento: '',
          categoria_pet: 'geral',
          data_inicio: dateStr,
          data_fim: '',
          prioridade: 'media',
          tags: [],
          observacoes_veterinarias: '',
        });
      }
      setErrors({});
      setTagInput('');
    }
  }, [isOpen, evento, selectedDate]);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpar erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // =====================================================
  // VALIDAÇÃO
  // =====================================================

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.evento.trim()) {
      newErrors.evento = 'Nome do evento é obrigatório';
    }

    if (!formData.data_inicio) {
      newErrors.data_inicio = 'Data de início é obrigatória';
    }

    if (formData.data_fim && formData.data_inicio) {
      const inicio = new Date(formData.data_inicio);
      const fim = new Date(formData.data_fim);
      if (fim < inicio) {
        newErrors.data_fim = 'Data de fim deve ser posterior à data de início';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const dataToSubmit = {
        evento: formData.evento.trim(),
        categoria_pet: formData.categoria_pet,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim || undefined,
        prioridade: formData.prioridade,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        observacoes_veterinarias: formData.observacoes_veterinarias.trim() || undefined,
      };

      if (evento) {
        await onUpdate(evento.id, dataToSubmit);
      } else {
        await onCreate(dataToSubmit);
      }
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  if (!isOpen) return null;

  const isLoading = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {evento ? 'Editar Evento' : 'Novo Evento de Sazonalidade'}
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Nome do Evento */}
            <div>
              <label htmlFor="evento" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Evento *
              </label>
              <input
                id="evento"
                type="text"
                value={formData.evento}
                onChange={(e) => handleInputChange('evento', e.target.value)}
                placeholder="ex: Campanha de Vermifugação de Outono"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.evento ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.evento && (
                <p className="mt-1 text-sm text-red-600">{errors.evento}</p>
              )}
            </div>

            {/* Categoria Pet + Prioridade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria Pet *
                </label>
                <select
                  id="categoria"
                  value={formData.categoria_pet}
                  onChange={(e) => handleInputChange('categoria_pet', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="geral">Geral</option>
                  <option value="cachorro">Cachorro</option>
                  <option value="gato">Gato</option>
                  <option value="pet_exotico">Pet Exótico</option>
                </select>
              </div>

              <div>
                <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade *
                </label>
                <select
                  id="prioridade"
                  value={formData.prioridade}
                  onChange={(e) => handleInputChange('prioridade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="data_inicio" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => handleInputChange('data_inicio', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.data_inicio ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.data_inicio && (
                  <p className="mt-1 text-sm text-red-600">{errors.data_inicio}</p>
                )}
              </div>

              <div>
                <label htmlFor="data_fim" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim (opcional)
                </label>
                <input
                  id="data_fim"
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => handleInputChange('data_fim', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.data_fim ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.data_fim && (
                  <p className="mt-1 text-sm text-red-600">{errors.data_fim}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="ex: vermifugacao, vacinacao"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || isLoading}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar
                </button>
              </div>
              
              {/* Tags List */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isLoading}
                        className="ml-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Observações Veterinárias */}
            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                Observações Veterinárias
              </label>
              <textarea
                id="observacoes"
                rows={4}
                value={formData.observacoes_veterinarias}
                onChange={(e) => handleInputChange('observacoes_veterinarias', e.target.value)}
                placeholder="Informações adicionais sobre o evento, protocolos recomendados, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {evento ? 'Atualizar Evento' : 'Criar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}