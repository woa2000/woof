'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Settings, Plus, Trash2 } from 'lucide-react';

interface ToolsEcosystemData {
  storage: Record<string, string>;
  design_tools: {
    preferred: string[];
    formats: string;
  };
  asset_management: Record<string, string>;
  single_source_of_truth: {
    primary_repository: string;
    access_control: string;
    sync_frequency: string;
    mirror_locations: string[];
  };
  maintenance_schedule: Record<string, string>;
}

interface ToolsEcosystemEditorProps {
  data: ToolsEcosystemData;
  onChange: (data: ToolsEcosystemData) => void;
}

export function ToolsEcosystemEditor({ data, onChange }: ToolsEcosystemEditorProps) {
  const handleSingleSourceChange = (field: string, value: any) => {
    onChange({
      ...data,
      single_source_of_truth: {
        ...data.single_source_of_truth,
        [field]: value
      }
    });
  };

  const addMirrorLocation = () => {
    const newLocations = [...data.single_source_of_truth.mirror_locations, 'Nova localização'];
    handleSingleSourceChange('mirror_locations', newLocations);
  };

  const removeMirrorLocation = (index: number) => {
    const newLocations = data.single_source_of_truth.mirror_locations.filter((_, i) => i !== index);
    handleSingleSourceChange('mirror_locations', newLocations);
  };

  const updateMirrorLocation = (index: number, value: string) => {
    const newLocations = [...data.single_source_of_truth.mirror_locations];
    newLocations[index] = value;
    handleSingleSourceChange('mirror_locations', newLocations);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Fonte Única da Verdade
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Repositório Principal:</label>
              <Input
                value={data.single_source_of_truth.primary_repository}
                onChange={(e) => handleSingleSourceChange('primary_repository', e.target.value)}
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Controle de Acesso:</label>
              <Input
                value={data.single_source_of_truth.access_control}
                onChange={(e) => handleSingleSourceChange('access_control', e.target.value)}
                placeholder="Permissões por nível hierárquico"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Frequência de Sincronização:</label>
              <Input
                value={data.single_source_of_truth.sync_frequency}
                onChange={(e) => handleSingleSourceChange('sync_frequency', e.target.value)}
                placeholder="Daily automated backup"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Localizações Espelho:</label>
                <Button onClick={addMirrorLocation} variant="secondary" className="text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {data.single_source_of_truth.mirror_locations.map((location, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={location}
                      onChange={(e) => updateMirrorLocation(index, e.target.value)}
                      className="flex-1"
                      placeholder="Localização espelho"
                    />
                    <Button
                      onClick={() => removeMirrorLocation(index)}
                      variant="secondary"
                      className="text-xs px-2 py-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
