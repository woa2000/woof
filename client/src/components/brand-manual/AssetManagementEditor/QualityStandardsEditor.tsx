'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Award, Plus, Trash2 } from 'lucide-react';

interface QualityStandardsData {
  file_formats: Record<string, any>;
  technical_specs: Record<string, any>;
  metadata_requirements: {
    always_include: string[];
    keywords: string;
    description: string;
  };
}

interface QualityStandardsEditorProps {
  data: QualityStandardsData;
  onChange: (data: QualityStandardsData) => void;
}

export function QualityStandardsEditor({ data, onChange }: QualityStandardsEditorProps) {
  const handleMetadataChange = (field: string, value: any) => {
    onChange({
      ...data,
      metadata_requirements: {
        ...data.metadata_requirements,
        [field]: value
      }
    });
  };

  const addMetadataRequirement = () => {
    const newRequirements = [...data.metadata_requirements.always_include, 'Nova informação obrigatória'];
    handleMetadataChange('always_include', newRequirements);
  };

  const removeMetadataRequirement = (index: number) => {
    const newRequirements = data.metadata_requirements.always_include.filter((_, i) => i !== index);
    handleMetadataChange('always_include', newRequirements);
  };

  const updateMetadataRequirement = (index: number, value: string) => {
    const newRequirements = [...data.metadata_requirements.always_include];
    newRequirements[index] = value;
    handleMetadataChange('always_include', newRequirements);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Padrões de Qualidade
          </h3>
          
          <div className="space-y-6">
            {/* Metadados Obrigatórios */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Metadados Obrigatórios</h4>
                <Button onClick={addMetadataRequirement} variant="secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              
              <div className="space-y-2">
                {data.metadata_requirements.always_include.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={requirement}
                      onChange={(e) => updateMetadataRequirement(index, e.target.value)}
                      className="flex-1"
                      placeholder="Metadado obrigatório"
                    />
                    <Button
                      onClick={() => removeMetadataRequirement(index)}
                      variant="secondary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium mb-1">Configuração de Keywords:</label>
              <Input
                value={data.metadata_requirements.keywords}
                onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                placeholder="Tags para facilitar busca"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium mb-1">Descrição:</label>
              <Input
                value={data.metadata_requirements.description}
                onChange={(e) => handleMetadataChange('description', e.target.value)}
                placeholder="Descrição clara do uso pretendido"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
