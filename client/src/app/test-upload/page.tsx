'use client';

import React, { useState } from 'react';
import LogoUploadModal from '@/components/brand-manual/LogoUploadModal';

export default function TestLogoUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logos, setLogos] = useState<any[]>([]);

  const handleLogoAdded = (newLogo: any) => {
    console.log('🎯 Logo recebido no componente pai:', newLogo);
    setLogos(prev => {
      const updated = [...prev, newLogo];
      console.log('📋 Lista atualizada:', updated);
      return updated;
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Teste do Sistema de Upload Manual</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">🔄 Novo Fluxo de Upload:</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Selecione a versão do logo</li>
            <li>2. Escolha o arquivo (clique ou arraste)</li>
            <li>3. Adicione notas de aplicação (opcional)</li>
            <li>4. <strong>Clique em "Fazer Upload"</strong></li>
            <li>5. Logo é adicionado à lista automaticamente</li>
          </ol>
        </div>
        
        {/* Botão para abrir modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-6"
        >
          Abrir Modal de Upload
        </button>
        
        {/* Lista de logos */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Logos Carregados ({logos.length})</h2>
          
          {logos.length === 0 ? (
            <p className="text-gray-500">Nenhum logo carregado ainda</p>
          ) : (
            <div className="space-y-4">
              {logos.map((logo, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    {/* Preview da imagem (se aplicável) */}
                    {logo.file_url && logo.format !== 'PDF' && (
                      <img 
                        src={logo.file_url} 
                        alt={logo.file_name}
                        className="w-16 h-16 object-contain border border-gray-200 rounded"
                      />
                    )}
                    
                    {/* Informações do logo */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{logo.version?.replace('_', ' ').toUpperCase()}</h3>
                      <p className="text-sm text-gray-600">{logo.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {logo.format} • {Math.round(logo.size_bytes / 1024)}KB
                      </p>
                      {logo.application_notes && (
                        <p className="text-sm text-gray-700 mt-2">{logo.application_notes}</p>
                      )}
                    </div>
                    
                    {/* URL para verificação */}
                    <div className="text-xs text-gray-500 max-w-xs">
                      <a 
                        href={logo.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ver arquivo
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Modal */}
        <LogoUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLogoAdded={handleLogoAdded}
        />
      </div>
    </div>
  );
}
