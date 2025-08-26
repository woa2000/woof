'use client';

import { useState } from 'react';
import { FileText, Sparkles, Upload, Link2 } from 'lucide-react';

interface CreateManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateManual: (method: 'manual' | 'ai_extraction', data: any) => void;
}

export default function CreateManualModal({ 
  isOpen, 
  onClose, 
  onCreateManual 
}: CreateManualModalProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim() && !urls.includes(urlInput.trim())) {
      setUrls([...urls, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleSubmit = () => {
    if (!brandName.trim()) return;

    const data = {
      brand_name: brandName,
      description,
      tags,
      ...(activeTab === 'ai' && { files, urls })
    };

    onCreateManual(activeTab === 'ai' ? 'ai_extraction' : 'manual', data);
    
    // Reset form
    setBrandName('');
    setDescription('');
    setTags([]);
    setTagInput('');
    setFiles([]);
    setUrls([]);
    setUrlInput('');
    setActiveTab('manual');
    
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setBrandName('');
    setDescription('');
    setTags([]);
    setTagInput('');
    setFiles([]);
    setUrls([]);
    setUrlInput('');
    setActiveTab('manual');
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Criar Novo Manual da Marca</h2>
          <p className="text-gray-600 mt-1">
            Escolha como deseja criar seu manual da marca
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'manual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Criação Manual
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'ai'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Extração por IA
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Marca *
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Minha Empresa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Breve descrição do manual..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adicionar tag..."
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Adicionar
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {tag}
                      <button
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        className="hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {activeTab === 'ai' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload de Arquivos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Arraste arquivos aqui ou{' '}
                      <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                        clique para selecionar
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              setFiles(Array.from(e.target.files));
                            }
                          }}
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, imagens, documentos (máx. 10MB cada)
                    </p>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm text-gray-600 p-2 bg-gray-50 rounded">
                          <span className="truncate">{file.name}</span>
                          <button
                            onClick={() => setFiles(files.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URLs de Referência
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://exemplo.com"
                    />
                    <button
                      onClick={handleAddUrl}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>
                  {urls.length > 0 && (
                    <div className="space-y-1">
                      {urls.map((url, index) => (
                        <div key={index} className="flex items-center justify-between text-sm text-gray-600 p-2 bg-gray-50 rounded">
                          <span className="truncate">{url}</span>
                          <button
                            onClick={() => setUrls(urls.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!brandName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeTab === 'ai' ? 'Processar com IA' : 'Criar Manual'}
          </button>
        </div>
      </div>
    </div>
  );
}
