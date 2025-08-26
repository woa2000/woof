'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import LogoUploadModal from '@/components/brand-manual/LogoUploadModal';
import LogoList from '@/components/brand-manual/LogoList';

export default function TestLogoSystem() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logos, setLogos] = useState<any[]>([]);

  const handleLogoAdded = (newLogo: any) => {
    setLogos([...logos, newLogo]);
  };

  const handleLogoUpdated = (logoIndex: number, updatedLogo: any) => {
    const updatedLogos = [...logos];
    updatedLogos[logoIndex] = updatedLogo;
    setLogos(updatedLogos);
  };

  const handleLogoRemoved = (logoIndex: number) => {
    const updatedLogos = logos.filter((_, i) => i !== logoIndex);
    setLogos(updatedLogos);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teste - Sistema de Upload de Logotipos</h1>
      
      {/* Upload de Logotipos - Seção Principal */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📁 Logotipos</h3>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Logotipo
          </Button>
        </div>
        
        {/* Lista de Logotipos */}
        <LogoList
          logos={logos}
          onLogoUpdated={handleLogoUpdated}
          onLogoRemoved={handleLogoRemoved}
        />
      </div>

      {/* Modal de Upload */}
      <LogoUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogoAdded={handleLogoAdded}
      />

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h4 className="font-semibold mb-2">Debug - Logos Carregados:</h4>
        <pre className="text-xs">{JSON.stringify(logos, null, 2)}</pre>
      </div>
    </div>
  );
}
