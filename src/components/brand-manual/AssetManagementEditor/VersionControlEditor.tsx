'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { GitBranch, Plus, Trash2, CheckCircle } from 'lucide-react';

interface VersionControlData {
  semantic_versioning: Record<string, {
    when: string;
    examples: string[];
  }>;
  approval_workflow: Record<string, string>;
  changelog: {
    track_changes: boolean;
    document_reasons: string;
    notify_team: string;
  };
}

interface VersionControlEditorProps {
  data: VersionControlData;
  onChange: (data: VersionControlData) => void;
}

export function VersionControlEditor({ data, onChange }: VersionControlEditorProps) {
  const handleSemanticVersionChange = (versionType: string, field: string, value: any) => {
    onChange({
      ...data,
      semantic_versioning: {
        ...data.semantic_versioning,
        [versionType]: {
          ...data.semantic_versioning[versionType],
          [field]: value
        }
      }
    });
  };

  const addVersionType = () => {
    const newType = `nova_versao_${Date.now()}`;
    onChange({
      ...data,
      semantic_versioning: {
        ...data.semantic_versioning,
        [newType]: {
          when: 'Quando usar esta versão',
          examples: []
        }
      }
    });
  };

  const removeVersionType = (versionType: string) => {
    const newVersioning = { ...data.semantic_versioning };
    delete newVersioning[versionType];
    onChange({ ...data, semantic_versioning: newVersioning });
  };

  const addVersionExample = (versionType: string) => {
    const currentExamples = data.semantic_versioning[versionType].examples;
    handleSemanticVersionChange(versionType, 'examples', [...currentExamples, 'Novo exemplo']);
  };

  const removeVersionExample = (versionType: string, exampleIndex: number) => {
    const currentExamples = data.semantic_versioning[versionType].examples;
    const newExamples = currentExamples.filter((_, i) => i !== exampleIndex);
    handleSemanticVersionChange(versionType, 'examples', newExamples);
  };

  const updateVersionExample = (versionType: string, exampleIndex: number, value: string) => {
    const currentExamples = [...data.semantic_versioning[versionType].examples];
    currentExamples[exampleIndex] = value;
    handleSemanticVersionChange(versionType, 'examples', currentExamples);
  };

  const handleWorkflowChange = (stage: string, description: string) => {
    onChange({
      ...data,
      approval_workflow: {
        ...data.approval_workflow,
        [stage]: description
      }
    });
  };

  const addWorkflowStage = () => {
    const newStage = `novo_estagio_${Date.now()}`;
    onChange({
      ...data,
      approval_workflow: {
        ...data.approval_workflow,
        [newStage]: 'Descrição do novo estágio'
      }
    });
  };

  const removeWorkflowStage = (stage: string) => {
    const newWorkflow = { ...data.approval_workflow };
    delete newWorkflow[stage];
    onChange({ ...data, approval_workflow: newWorkflow });
  };

  const handleChangelogChange = (field: string, value: any) => {
    onChange({
      ...data,
      changelog: {
        ...data.changelog,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Versionamento Semântico */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Versionamento Semântico
            </h3>
            <Button onClick={addVersionType} variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Tipo de Versão
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(data.semantic_versioning).map(([versionType, versionData]) => (
              <div key={versionType} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Tipo de Versão:</label>
                    <Input
                      value={versionType}
                      onChange={(e) => {
                        const newVersioning = { ...data.semantic_versioning };
                        const versionInfo = newVersioning[versionType];
                        delete newVersioning[versionType];
                        newVersioning[e.target.value] = versionInfo;
                        onChange({ ...data, semantic_versioning: newVersioning });
                      }}
                      placeholder="major, minor, patch"
                    />
                  </div>
                  <div className="flex-2">
                    <label className="block text-sm font-medium mb-1">Quando usar:</label>
                    <Input
                      value={versionData.when}
                      onChange={(e) => handleSemanticVersionChange(versionType, 'when', e.target.value)}
                      placeholder="Descrição de quando usar esta versão"
                    />
                  </div>
                  <Button
                    onClick={() => removeVersionType(versionType)}
                    variant="secondary"
                    className="mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Exemplos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Exemplos:</label>
                    <Button
                      onClick={() => addVersionExample(versionType)}
                      variant="secondary"
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Exemplo
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {versionData.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="flex items-center gap-2">
                        <Input
                          value={example}
                          onChange={(e) => updateVersionExample(versionType, exampleIndex, e.target.value)}
                          className="flex-1 text-sm"
                          placeholder="Exemplo de uso"
                        />
                        <Button
                          onClick={() => removeVersionExample(versionType, exampleIndex)}
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
            ))}
          </div>
        </div>
      </Card>

      {/* Fluxo de Aprovação */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Fluxo de Aprovação
            </h3>
            <Button onClick={addWorkflowStage} variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Novo Estágio
            </Button>
          </div>

          <div className="space-y-3">
            {Object.entries(data.approval_workflow).map(([stage, description]) => (
              <div key={stage} className="flex items-center gap-4 p-3 border rounded-lg bg-blue-50">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Estágio:</label>
                  <Input
                    value={stage}
                    onChange={(e) => {
                      const newWorkflow = { ...data.approval_workflow };
                      const stageDescription = newWorkflow[stage];
                      delete newWorkflow[stage];
                      newWorkflow[e.target.value] = stageDescription;
                      onChange({ ...data, approval_workflow: newWorkflow });
                    }}
                    placeholder="nome_do_estagio"
                  />
                </div>
                <div className="flex-2">
                  <label className="block text-sm font-medium mb-1">Descrição:</label>
                  <Input
                    value={description}
                    onChange={(e) => handleWorkflowChange(stage, e.target.value)}
                    placeholder="Descrição do estágio"
                  />
                </div>
                <Button
                  onClick={() => removeWorkflowStage(stage)}
                  variant="secondary"
                  className="mt-6"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Configurações de Changelog */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configurações de Changelog</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.changelog.track_changes}
                onChange={(e) => handleChangelogChange('track_changes', e.target.checked)}
                className="rounded"
              />
              <label className="text-sm font-medium">Rastrear mudanças automaticamente</label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Documentar razões:</label>
              <Input
                value={data.changelog.document_reasons}
                onChange={(e) => handleChangelogChange('document_reasons', e.target.value)}
                placeholder="Sempre documentar motivo da mudança"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notificar equipe:</label>
              <Input
                value={data.changelog.notify_team}
                onChange={(e) => handleChangelogChange('notify_team', e.target.value)}
                placeholder="Comunicar alterações para toda equipe"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
