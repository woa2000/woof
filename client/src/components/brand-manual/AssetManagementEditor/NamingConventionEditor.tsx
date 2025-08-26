'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Tag, Plus, Trash2, AlertTriangle } from 'lucide-react';

interface NamingConventionData {
  pattern: string;
  components: Record<string, {
    description: string;
    examples?: string[];
    format?: string;
  }>;
  examples: Record<string, string[]>;
  forbidden_patterns: string[];
}

interface NamingConventionEditorProps {
  data: NamingConventionData;
  onChange: (data: NamingConventionData) => void;
}

export function NamingConventionEditor({ data, onChange }: NamingConventionEditorProps) {
  const handlePatternChange = (pattern: string) => {
    onChange({ ...data, pattern });
  };

  const handleComponentChange = (componentKey: string, field: string, value: any) => {
    onChange({
      ...data,
      components: {
        ...data.components,
        [componentKey]: {
          ...data.components[componentKey],
          [field]: value
        }
      }
    });
  };

  const addComponent = () => {
    const newKey = `novo_componente_${Date.now()}`;
    onChange({
      ...data,
      components: {
        ...data.components,
        [newKey]: {
          description: 'Descrição do novo componente',
          examples: []
        }
      }
    });
  };

  const removeComponent = (componentKey: string) => {
    const newComponents = { ...data.components };
    delete newComponents[componentKey];
    onChange({ ...data, components: newComponents });
  };

  const addComponentExample = (componentKey: string) => {
    const component = data.components[componentKey];
    const newExamples = [...(component.examples || []), 'novo_exemplo'];
    handleComponentChange(componentKey, 'examples', newExamples);
  };

  const removeComponentExample = (componentKey: string, exampleIndex: number) => {
    const component = data.components[componentKey];
    const newExamples = component.examples?.filter((_, i) => i !== exampleIndex) || [];
    handleComponentChange(componentKey, 'examples', newExamples);
  };

  const updateComponentExample = (componentKey: string, exampleIndex: number, value: string) => {
    const component = data.components[componentKey];
    const newExamples = [...(component.examples || [])];
    newExamples[exampleIndex] = value;
    handleComponentChange(componentKey, 'examples', newExamples);
  };

  const addExampleCategory = () => {
    const newKey = `nova_categoria_${Date.now()}`;
    onChange({
      ...data,
      examples: {
        ...data.examples,
        [newKey]: []
      }
    });
  };

  const removeExampleCategory = (categoryKey: string) => {
    const newExamples = { ...data.examples };
    delete newExamples[categoryKey];
    onChange({ ...data, examples: newExamples });
  };

  const addCategoryExample = (categoryKey: string) => {
    const newExamples = [...data.examples[categoryKey], 'novo_exemplo_arquivo.ext'];
    onChange({
      ...data,
      examples: {
        ...data.examples,
        [categoryKey]: newExamples
      }
    });
  };

  const removeCategoryExample = (categoryKey: string, exampleIndex: number) => {
    const newExamples = data.examples[categoryKey].filter((_, i) => i !== exampleIndex);
    onChange({
      ...data,
      examples: {
        ...data.examples,
        [categoryKey]: newExamples
      }
    });
  };

  const updateCategoryExample = (categoryKey: string, exampleIndex: number, value: string) => {
    const newExamples = [...data.examples[categoryKey]];
    newExamples[exampleIndex] = value;
    onChange({
      ...data,
      examples: {
        ...data.examples,
        [categoryKey]: newExamples
      }
    });
  };

  const addForbiddenPattern = () => {
    onChange({
      ...data,
      forbidden_patterns: [...data.forbidden_patterns, 'Novo padrão proibido']
    });
  };

  const removeForbiddenPattern = (index: number) => {
    const newPatterns = data.forbidden_patterns.filter((_, i) => i !== index);
    onChange({ ...data, forbidden_patterns: newPatterns });
  };

  const updateForbiddenPattern = (index: number, value: string) => {
    const newPatterns = [...data.forbidden_patterns];
    newPatterns[index] = value;
    onChange({ ...data, forbidden_patterns: newPatterns });
  };

  return (
    <div className="space-y-6">
      {/* Padrão Principal */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Padrão de Nomenclatura
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <label className="block text-sm font-medium mb-2">Padrão:</label>
            <Input
              value={data.pattern}
              onChange={(e) => handlePatternChange(e.target.value)}
              placeholder="[CATEGORIA]_[TIPO]_[VERSAO]_[VARIANTE]_[RESOLUCAO].[EXT]"
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-600 mt-2">
              Use colchetes [] para indicar componentes variáveis
            </p>
          </div>
        </div>
      </Card>

      {/* Componentes do Padrão */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Componentes do Padrão</h3>
            <Button onClick={addComponent} variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Componente
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(data.components).map(([componentKey, component]) => (
              <div key={componentKey} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Nome do Componente:</label>
                    <Input
                      value={componentKey}
                      onChange={(e) => {
                        const newComponents = { ...data.components };
                        const componentData = newComponents[componentKey];
                        delete newComponents[componentKey];
                        newComponents[e.target.value] = componentData;
                        onChange({ ...data, components: newComponents });
                      }}
                      placeholder="nome_do_componente"
                    />
                  </div>
                  <div className="flex-2">
                    <label className="block text-sm font-medium mb-1">Descrição:</label>
                    <Input
                      value={component.description}
                      onChange={(e) => handleComponentChange(componentKey, 'description', e.target.value)}
                      placeholder="Descrição do componente"
                    />
                  </div>
                  <Button
                    onClick={() => removeComponent(componentKey)}
                    variant="secondary"
                    className="mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Formato (opcional) */}
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Formato (opcional):</label>
                  <Input
                    value={component.format || ''}
                    onChange={(e) => handleComponentChange(componentKey, 'format', e.target.value)}
                    placeholder="v[MAJOR].[MINOR].[PATCH]"
                  />
                </div>

                {/* Exemplos */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Exemplos:</label>
                    <Button
                      onClick={() => addComponentExample(componentKey)}
                      variant="secondary"
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Exemplo
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {component.examples?.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="flex items-center gap-2">
                        <Input
                          value={example}
                          onChange={(e) => updateComponentExample(componentKey, exampleIndex, e.target.value)}
                          className="flex-1 text-sm"
                          placeholder="exemplo_valor"
                        />
                        <Button
                          onClick={() => removeComponentExample(componentKey, exampleIndex)}
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

      {/* Exemplos de Arquivo */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Exemplos de Arquivos</h3>
            <Button onClick={addExampleCategory} variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(data.examples).map(([categoryKey, examples]) => (
              <div key={categoryKey} className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Categoria:</label>
                    <Input
                      value={categoryKey}
                      onChange={(e) => {
                        const newExamples = { ...data.examples };
                        const categoryData = newExamples[categoryKey];
                        delete newExamples[categoryKey];
                        newExamples[e.target.value] = categoryData;
                        onChange({ ...data, examples: newExamples });
                      }}
                      placeholder="categoria_de_arquivos"
                    />
                  </div>
                  <Button
                    onClick={() => removeExampleCategory(categoryKey)}
                    variant="secondary"
                    className="mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Exemplos de arquivos:</label>
                    <Button
                      onClick={() => addCategoryExample(categoryKey)}
                      variant="secondary"
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Arquivo
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="flex items-center gap-2">
                        <Input
                          value={example}
                          onChange={(e) => updateCategoryExample(categoryKey, exampleIndex, e.target.value)}
                          className="flex-1 text-sm font-mono"
                          placeholder="arquivo_exemplo_v1.0.svg"
                        />
                        <Button
                          onClick={() => removeCategoryExample(categoryKey, exampleIndex)}
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

      {/* Padrões Proibidos */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Padrões Proibidos
            </h3>
            <Button onClick={addForbiddenPattern} variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Restrição
            </Button>
          </div>

          <div className="space-y-2">
            {data.forbidden_patterns.map((pattern, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={pattern}
                  onChange={(e) => updateForbiddenPattern(index, e.target.value)}
                  className="flex-1"
                  placeholder="Padrão não permitido"
                />
                <Button
                  onClick={() => removeForbiddenPattern(index)}
                  variant="secondary"
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
