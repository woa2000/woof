'use client';

import { useState } from 'react';
import { Plus, RotateCcw, Search, AlertCircle, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { useAnamneseDigital } from '@/hooks/features/useAnamneseDigital';
import { AnamneseDigital } from '@/lib/types/anamnese';
import AnamneseResults from '@/components/anamnese/AnamneseResults';
import AnamneseCard from '@/components/anamnese/AnamneseCard';
import AnalysisLoading from '@/components/anamnese/AnalysisLoading';

export default function AnamneseDigitalPage() {
  const {
    anamneses,
    loading,
    analyzing,
    error,
    processAnalysis,
    reprocessAnalysis,
    deleteAnalysis,
    findByUrl,
    setError
  } = useAnamneseDigital();

  const [url, setUrl] = useState('');
  const [redesSociais, setRedesSociais] = useState<string[]>(['']);
  const [selectedAnamnese, setSelectedAnamnese] = useState<AnamneseDigital | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [urlError, setUrlError] = useState('');

  // Validar URL
  const validateUrl = (urlToValidate: string): boolean => {
    try {
      new URL(urlToValidate);
      return true;
    } catch {
      return false;
    }
  };

  // Adicionar campo de rede social
  const addRedesSociaisField = () => {
    setRedesSociais([...redesSociais, '']);
  };

  // Remover campo de rede social
  const removeRedesSociaisField = (index: number) => {
    if (redesSociais.length > 1) {
      const newRedes = redesSociais.filter((_, i) => i !== index);
      setRedesSociais(newRedes);
    }
  };

  // Atualizar rede social
  const updateRedesSociais = (index: number, value: string) => {
    const newRedes = [...redesSociais];
    newRedes[index] = value;
    setRedesSociais(newRedes);
  };

  // Processar nova análise
  const handleProcessAnalysis = async () => {
    if (!url) {
      setUrlError('URL é obrigatória');
      return;
    }

    if (!validateUrl(url)) {
      setUrlError('URL inválida');
      return;
    }

    setUrlError('');

    // Verificar se já existe análise para esta URL
    const existingAnamnese = await findByUrl(url);
    if (existingAnamnese) {
      setSelectedAnamnese(existingAnamnese);
      setShowForm(false);
      return;
    }

    // Filtrar redes sociais não vazias
    const redesFiltradas = redesSociais.filter(rede => rede.trim() !== '');

    const result = await processAnalysis(url, redesFiltradas);
    if (result) {
      setSelectedAnamnese(result);
      setShowForm(false);
      setUrl('');
      setRedesSociais(['']);
    }
  };

  // Reprocessar análise
  const handleReprocessAnalysis = async (anamnese: AnamneseDigital) => {
    if (!anamnese.id) return;

    const result = await reprocessAnalysis(
      anamnese.id,
      anamnese.url_analisada,
      anamnese.redes_sociais || []
    );
    
    if (result) {
      setSelectedAnamnese(result);
    }
  };

  // Visualizar análise
  const handleViewAnalysis = (anamnese: AnamneseDigital) => {
    setSelectedAnamnese(anamnese);
    setShowForm(false);
  };

  // Deletar análise
  const handleDeleteAnalysis = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta análise?')) {
      const success = await deleteAnalysis(id);
      if (success && selectedAnamnese?.id === id) {
        setSelectedAnamnese(null);
        setShowForm(true);
      }
    }
  };

  // Voltar para formulário
  const handleBackToForm = () => {
    setSelectedAnamnese(null);
    setShowForm(true);
  };

  // Nova análise
  const handleNewAnalysis = () => {
    setSelectedAnamnese(null);
    setShowForm(true);
    setUrl('');
    setRedesSociais(['']);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!showForm && (
                <Button
                  variant="secondary"
                  icon={ArrowLeft}
                  onClick={handleBackToForm}
                  className="shrink-0"
                >
                  Voltar
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Sparkles className="w-8 h-8 text-orange-500 mr-3" />
                  Anamnese Digital
                </h1>
                <p className="text-gray-600 mt-1">
                  Analise sites e redes sociais para obter insights estratégicos detalhados
                </p>
              </div>
            </div>
            
            {!showForm && (
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  icon={Plus}
                  onClick={handleNewAnalysis}
                >
                  Nova Análise
                </Button>
                {selectedAnamnese && (
                  <Button
                    icon={RotateCcw}
                    onClick={() => handleReprocessAnalysis(selectedAnamnese)}
                    disabled={analyzing}
                  >
                    {analyzing ? 'Reprocessando...' : 'Refazer Análise'}
                  </Button>
                )}
              </div>
            )}
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
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="space-y-8">
            {/* New Analysis Form */}
            <Card className="bg-white shadow-lg border-0">
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Nova Análise</h2>
                </div>
                
                <div className="space-y-6">
                  {/* URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL do Site *
                    </label>
                    <Input
                      type="url"
                      placeholder="https://exemplo.com"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setUrlError('');
                      }}
                      className={`transition-all duration-200 ${
                        urlError 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'focus:border-orange-500 focus:ring-orange-500'
                      }`}
                    />
                    {urlError && (
                      <p className="text-red-600 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {urlError}
                      </p>
                    )}
                  </div>

                  {/* Social Networks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Redes Sociais (opcional)
                    </label>
                    <div className="space-y-3">
                      {redesSociais.map((rede, index) => (
                        <div key={index} className="flex space-x-3">
                          <Input
                            type="url"
                            placeholder="https://instagram.com/perfil ou https://facebook.com/pagina"
                            value={rede}
                            onChange={(e) => updateRedesSociais(index, e.target.value)}
                            className="flex-1 focus:border-orange-500 focus:ring-orange-500"
                          />
                          {redesSociais.length > 1 && (
                            <Button
                              variant="secondary"
                              onClick={() => removeRedesSociaisField(index)}
                              className="px-3 text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="secondary"
                        icon={Plus}
                        onClick={addRedesSociaisField}
                        className="w-full border-dashed"
                      >
                        Adicionar Rede Social
                      </Button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    icon={Search}
                    onClick={handleProcessAnalysis}
                    disabled={analyzing || !url}
                    className="w-full py-3 text-lg font-medium bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    {analyzing ? 'Processando Análise...' : 'Processar Análise'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Previous Analyses */}
            {anamneses.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Análises Anteriores</h2>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <span className="text-gray-600">Carregando análises...</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {anamneses.map((anamnese) => (
                      <AnamneseCard
                        key={anamnese.id}
                        anamnese={anamnese}
                        onView={handleViewAnalysis}
                        onReprocess={handleReprocessAnalysis}
                        onDelete={handleDeleteAnalysis}
                        isProcessing={analyzing}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {selectedAnamnese && !showForm && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle size={20} />
                <span className="font-medium">Análise concluída com sucesso</span>
              </div>
            </div>
            
            <AnamneseResults anamnese={selectedAnamnese} />
          </div>
        )}

        {/* Loading State */}
        {analyzing && !selectedAnamnese && (
          <AnalysisLoading isVisible={analyzing} />
        )}
      </div>
    </div>
  );
}
