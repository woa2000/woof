'use client';

import { useState } from 'react';
import { X, Upload, FileText, Image } from 'lucide-react';
import Button from '@/components/ui/Button';
import { uploadBrandLogo } from '@/lib/brand-logo-upload';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoAdded: (logo: any) => void;
}

export default function LogoUploadModal({ isOpen, onClose, onLogoAdded }: LogoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [applicationNotes, setApplicationNotes] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const logoVersions = [
    { value: 'principal_colorida', label: 'Principal Colorida' },
    { value: 'monocromatica_preta', label: 'Monocromática Preta' },
    { value: 'monocromatica_branca', label: 'Monocromática Branca' },
    { value: 'escala_cinza', label: 'Escala de Cinza' }
  ];

  // Estados computados
  const canSelectFile = selectedVersion && !uploadingLogo;
  const canUpload = selectedFile && selectedVersion && !uploadingLogo;

  // Função para lidar com seleção de arquivo (não upload ainda)
  const handleFileSelection = (file: File) => {
    // Validações do arquivo
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Use SVG, PNG, JPG ou PDF.');
      return;
    }

    if (file.size > maxSize) {
      alert('Arquivo muito grande. O tamanho máximo é 10MB.');
      return;
    }

    console.log('📁 Arquivo selecionado:', file.name);
    setSelectedFile(file);
  };

  // Função para confirmar e fazer upload
  const handleUploadConfirm = async () => {
    if (!selectedFile || !selectedVersion) return;

    setUploadingLogo(true);
    
    try {
      console.log('🚀 Iniciando upload...', { file: selectedFile.name, version: selectedVersion });
      
      const result = await uploadBrandLogo(selectedFile, selectedVersion);
      
      if (!result.success) {
        // Tratamento de erros específicos
        const errorMessage = 'error' in result ? result.error : 'Dados inválidos';
        
        if (errorMessage.includes('Bucket não existe')) {
          alert(`❌ Erro de configuração do storage!\n\n🔧 SOLUÇÃO:\n1. O bucket precisa ser criado no painel do Supabase\n2. Consulte o arquivo SOLUCAO_UPLOAD_LOGO.md\n3. Ou execute: npm run setup-storage\n\nErro: ${errorMessage}`);
        } else if (errorMessage.includes('permissão') || errorMessage.includes('row-level security')) {
          alert(`❌ Erro de permissão!\n\n🔧 POSSÍVEIS CAUSAS:\n1. Você precisa estar logado na aplicação\n2. O storage não está configurado corretamente\n3. Políticas de segurança não foram aplicadas\n\nConsulte SOLUCAO_UPLOAD_LOGO.md para detalhes.\n\nErro: ${errorMessage}`);
        } else {
          alert(`❌ Erro no upload: ${errorMessage}\n\n💡 Se o problema persistir, consulte SOLUCAO_UPLOAD_LOGO.md`);
        }
        return;
      }

      // Type guard para garantir que temos os dados
      if (!('data' in result) || !result.data) {
        alert('❌ Erro: Dados de upload inválidos');
        return;
      }

      console.log('✅ Upload concluído com sucesso!', result.data);

      // Criar objeto do logo com dados do upload
      const newLogo = {
        version: selectedVersion,
        file_url: result.data.file_url,
        file_name: result.data.file_name,
        format: result.data.format,
        uploaded_at: new Date().toISOString(),
        size_bytes: result.data.size_bytes,
        application_notes: applicationNotes || undefined,
        storage_path: result.data.storage_path
      };

      console.log('🎉 Adicionando logo à lista...', newLogo);
      
      // Adicionar à lista
      onLogoAdded(newLogo);
      
      // Reset form e fechar modal
      setSelectedFile(null);
      setSelectedVersion('');
      setApplicationNotes('');
      onClose();
      
    } catch (error) {
      console.error('💥 Erro inesperado no upload:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`❌ Erro inesperado durante o upload.\n\nDetalhes: ${errorMessage}\n\n💡 Verifique:\n1. Se você está logado na aplicação\n2. Se o storage está configurado (SOLUCAO_UPLOAD_LOGO.md)\n3. Se o arquivo é válido\n\nTente novamente ou consulte a documentação.`);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (!canSelectFile) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return FileText;
    return Image;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Adicionar Logotipo</h2>
          <button
            onClick={onClose}
            disabled={uploadingLogo}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Seleção de Versão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versão do Logo *
            </label>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              disabled={uploadingLogo}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">Selecione uma versão...</option>
              {logoVersions.map((version) => (
                <option key={version.value} value={version.value}>
                  {version.label}
                </option>
              ))}
            </select>
          </div>

          {/* Área de Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo do Logo *
            </label>
            
            {selectedFile ? (
              /* Preview do arquivo selecionado */
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const IconComponent = getFileIcon(selectedFile.name);
                    return <IconComponent className="w-8 h-8 text-blue-500" />;
                  })()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={resetSelection}
                    disabled={uploadingLogo}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => document.getElementById('file-input')?.click()}
                  disabled={uploadingLogo}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  Selecionar outro arquivo
                </button>
              </div>
            ) : (
              /* Área de drop/seleção */
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : canSelectFile 
                      ? 'border-gray-300 hover:border-gray-400' 
                      : 'border-gray-200 bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className={`w-8 h-8 mx-auto mb-3 ${canSelectFile ? 'text-gray-400' : 'text-gray-300'}`} />
                <p className={`text-sm ${canSelectFile ? 'text-gray-600' : 'text-gray-400'}`}>
                  {canSelectFile ? (
                    <>
                      <span className="font-medium">Clique para selecionar</span> ou arraste o arquivo aqui
                    </>
                  ) : (
                    'Selecione uma versão primeiro'
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  SVG, PNG, JPG ou PDF até 10MB
                </p>
                <input
                  id="file-input"
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.pdf"
                  onChange={handleFileInput}
                  disabled={!canSelectFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            )}
          </div>

          {/* Notas de Aplicação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas de Aplicação (opcional)
            </label>
            <textarea
              value={applicationNotes}
              onChange={(e) => setApplicationNotes(e.target.value)}
              disabled={uploadingLogo}
              placeholder="Ex: Use apenas em fundos claros, mantenha proporção..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={uploadingLogo}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUploadConfirm}
            disabled={!canUpload}
          >
            {uploadingLogo ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Fazendo Upload...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Fazer Upload
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
