'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CheckCircle, Folder, Plus, Trash2, FolderOpen, Tag } from 'lucide-react';

interface AssetManagementEditorProps {
  content: any;
  onChange: (data: any) => void;
  isEditing?: boolean;
}

// Definição de tipos para os dados
interface Directory {
  name: string;
  description: string;
  subdirectories?: {
    [key: string]: {
      description: string;
      naming_pattern?: string;
    };
  };
}

interface NamingConventionData {
  pattern: string;
  components: {
    [key: string]: {
      description: string;
      examples: string[];
    };
  };
  examples: {
    [category: string]: string[];
  };
  forbidden_patterns: string[];
}

// Badge component reutilizado do Visualizer
const Badge = ({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode, 
  variant?: 'default' | 'outline' | 'secondary' | 'destructive',
  className?: string 
}) => {
  const variants = {
    default: 'bg-orange-100 text-orange-800',
    outline: 'border border-gray-300 text-gray-700 bg-white',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

interface FolderStructureData {
  overview: {
    structure_description: string;
    organization_principles: string[];
  };
  main_directories: {
    [key: string]: Directory;
  };
  folder_naming_rules: {
    general_rules: string[];
    specific_patterns: {
      [key: string]: string;
    };
  };
}

// Componente FolderStructureTab
const FolderStructureTab: React.FC<{ 
  data: FolderStructureData; 
  onChange: (data: FolderStructureData) => void; 
}> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<FolderStructureData>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const updateData = (newData: Partial<FolderStructureData>) => {
    const updated = { ...localData, ...newData };
    setLocalData(updated);
    onChange(updated);
  };

  const addDirectory = () => {
    const newName = prompt('Nome do novo diretório:');
    if (newName && !localData.main_directories[newName]) {
      updateData({
        main_directories: {
          ...localData.main_directories,
          [newName]: {
            name: newName,
            description: '',
            subdirectories: {}
          }
        }
      });
    }
  };

  const removeDirectory = (dirName: string) => {
    if (confirm(`Remover diretório "${dirName}"?`)) {
      const { [dirName]: removed, ...rest } = localData.main_directories;
      updateData({ main_directories: rest });
    }
  };

  const addSubdirectory = (parentDir: string) => {
    const newName = prompt('Nome do novo subdiretório:');
    if (newName) {
      const updatedDirs = { ...localData.main_directories };
      if (!updatedDirs[parentDir].subdirectories) {
        updatedDirs[parentDir].subdirectories = {};
      }
      updatedDirs[parentDir].subdirectories![newName] = {
        description: '',
        naming_pattern: ''
      };
      updateData({ main_directories: updatedDirs });
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Visão Geral da Estrutura</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição da Estrutura
            </label>
            <textarea
              value={localData.overview.structure_description}
              onChange={(e) => updateData({
                overview: {
                  ...localData.overview,
                  structure_description: e.target.value
                }
              })}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Descreva como a estrutura de pastas está organizada..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Princípios de Organização
            </label>
            {localData.overview.organization_principles.map((principle, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={principle}
                  onChange={(e) => {
                    const newPrinciples = [...localData.overview.organization_principles];
                    newPrinciples[index] = e.target.value;
                    updateData({
                      overview: {
                        ...localData.overview,
                        organization_principles: newPrinciples
                      }
                    });
                  }}
                  placeholder="Princípio de organização..."
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const newPrinciples = localData.overview.organization_principles.filter((_, i) => i !== index);
                    updateData({
                      overview: {
                        ...localData.overview,
                        organization_principles: newPrinciples
                      }
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() => updateData({
                overview: {
                  ...localData.overview,
                  organization_principles: [...localData.overview.organization_principles, '']
                }
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Princípio
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Directories Section */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Diretórios Principais</h3>
          <Button variant="secondary" onClick={addDirectory}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Diretório
          </Button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(localData.main_directories).map(([dirName, directory]) => (
            <div key={dirName} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <Folder className="h-5 w-5 text-blue-500 mr-2" />
                  <h4 className="font-medium text-gray-900">/{dirName}</h4>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => removeDirectory(dirName)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <Input
                  value={directory.description}
                  onChange={(e) => {
                    const updatedDirs = { ...localData.main_directories };
                    updatedDirs[dirName].description = e.target.value;
                    updateData({ main_directories: updatedDirs });
                  }}
                  placeholder="Descrição do diretório..."
                />
              </div>

              {/* Subdirectories */}
              {directory.subdirectories && Object.keys(directory.subdirectories).length > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-gray-700">Subdiretórios</h5>
                    <Button
                      variant="secondary"
                      onClick={() => addSubdirectory(dirName)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="space-y-2 ml-4">
                    {Object.entries(directory.subdirectories).map(([subName, subDir]) => (
                      <div key={subName} className="flex gap-2 items-center">
                        <span className="text-sm text-gray-600">/{subName}</span>
                        <Input
                          value={subDir.description}
                          onChange={(e) => {
                            const updatedDirs = { ...localData.main_directories };
                            updatedDirs[dirName].subdirectories![subName].description = e.target.value;
                            updateData({ main_directories: updatedDirs });
                          }}
                          placeholder="Descrição..."
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(!directory.subdirectories || Object.keys(directory.subdirectories).length === 0) && (
                <Button
                  variant="secondary"
                  onClick={() => addSubdirectory(dirName)}
                  className="mt-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar Subdiretório
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Naming Rules Section */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Regras de Nomenclatura de Pastas</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regras Gerais
            </label>
            {localData.folder_naming_rules.general_rules.map((rule, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={rule}
                  onChange={(e) => {
                    const newRules = [...localData.folder_naming_rules.general_rules];
                    newRules[index] = e.target.value;
                    updateData({
                      folder_naming_rules: {
                        ...localData.folder_naming_rules,
                        general_rules: newRules
                      }
                    });
                  }}
                  placeholder="Regra de nomenclatura..."
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const newRules = localData.folder_naming_rules.general_rules.filter((_, i) => i !== index);
                    updateData({
                      folder_naming_rules: {
                        ...localData.folder_naming_rules,
                        general_rules: newRules
                      }
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() => updateData({
                folder_naming_rules: {
                  ...localData.folder_naming_rules,
                  general_rules: [...localData.folder_naming_rules.general_rules, '']
                }
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Regra
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padrões Específicos
            </label>
            {Object.entries(localData.folder_naming_rules.specific_patterns).map(([key, pattern]) => (
              <div key={key} className="flex gap-2 mb-2">
                <Input
                  value={key}
                  onChange={(e) => {
                    const newPatterns = { ...localData.folder_naming_rules.specific_patterns };
                    delete newPatterns[key];
                    newPatterns[e.target.value] = pattern;
                    updateData({
                      folder_naming_rules: {
                        ...localData.folder_naming_rules,
                        specific_patterns: newPatterns
                      }
                    });
                  }}
                  placeholder="Tipo/Contexto..."
                  className="w-1/3"
                />
                <Input
                  value={pattern}
                  onChange={(e) => {
                    const newPatterns = { ...localData.folder_naming_rules.specific_patterns };
                    newPatterns[key] = e.target.value;
                    updateData({
                      folder_naming_rules: {
                        ...localData.folder_naming_rules,
                        specific_patterns: newPatterns
                      }
                    });
                  }}
                  placeholder="Padrão de nomenclatura..."
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    const newPatterns = { ...localData.folder_naming_rules.specific_patterns };
                    delete newPatterns[key];
                    updateData({
                      folder_naming_rules: {
                        ...localData.folder_naming_rules,
                        specific_patterns: newPatterns
                      }
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() => {
                const newKey = prompt('Tipo/Contexto:');
                if (newKey) {
                  updateData({
                    folder_naming_rules: {
                      ...localData.folder_naming_rules,
                      specific_patterns: {
                        ...localData.folder_naming_rules.specific_patterns,
                        [newKey]: ''
                      }
                    }
                  });
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Padrão
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Componentes de placeholder para as outras abas
const NamingConventionTab: React.FC<{ 
  data: NamingConventionData; 
  onChange: (data: NamingConventionData) => void; 
}> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<NamingConventionData>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const updateData = (newData: Partial<NamingConventionData>) => {
    const updated = { ...localData, ...newData };
    setLocalData(updated);
    onChange(updated);
  };

  const addComponent = () => {
    const componentName = prompt('Nome do componente (ex: brand, category, version):');
    if (componentName && !localData.components[componentName]) {
      updateData({
        components: {
          ...localData.components,
          [componentName]: {
            description: '',
            examples: []
          }
        }
      });
    }
  };

  const removeComponent = (componentName: string) => {
    if (confirm(`Remover componente "${componentName}"?`)) {
      const { [componentName]: removed, ...rest } = localData.components;
      updateData({ components: rest });
    }
  };

  const addComponentExample = (componentName: string) => {
    const example = prompt(`Exemplo para "${componentName}":`);
    if (example) {
      const updatedComponents = { ...localData.components };
      updatedComponents[componentName].examples.push(example);
      updateData({ components: updatedComponents });
    }
  };

  const removeComponentExample = (componentName: string, exampleIndex: number) => {
    const updatedComponents = { ...localData.components };
    updatedComponents[componentName].examples.splice(exampleIndex, 1);
    updateData({ components: updatedComponents });
  };

  const addExampleCategory = () => {
    const categoryName = prompt('Nome da categoria (ex: logos, documentos, assets):');
    if (categoryName && !localData.examples[categoryName]) {
      updateData({
        examples: {
          ...localData.examples,
          [categoryName]: []
        }
      });
    }
  };

  const removeExampleCategory = (categoryName: string) => {
    if (confirm(`Remover categoria "${categoryName}" e todos seus exemplos?`)) {
      const { [categoryName]: removed, ...rest } = localData.examples;
      updateData({ examples: rest });
    }
  };

  const addCategoryExample = (categoryName: string) => {
    const example = prompt(`Exemplo para categoria "${categoryName}":`);
    if (example) {
      const updatedExamples = { ...localData.examples };
      updatedExamples[categoryName].push(example);
      updateData({ examples: updatedExamples });
    }
  };

  const removeCategoryExample = (categoryName: string, exampleIndex: number) => {
    const updatedExamples = { ...localData.examples };
    updatedExamples[categoryName].splice(exampleIndex, 1);
    updateData({ examples: updatedExamples });
  };

  const addForbiddenPattern = () => {
    const pattern = prompt('Padrão proibido:');
    if (pattern && !localData.forbidden_patterns.includes(pattern)) {
      updateData({
        forbidden_patterns: [...localData.forbidden_patterns, pattern]
      });
    }
  };

  const removeForbiddenPattern = (patternIndex: number) => {
    const updatedPatterns = localData.forbidden_patterns.filter((_, i) => i !== patternIndex);
    updateData({ forbidden_patterns: updatedPatterns });
  };

  return (
    <div className="space-y-6">
      {/* Padrão Principal */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Padrão Principal de Nomenclatura
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padrão de Nomenclatura
            </label>
            <Input
              value={localData.pattern}
              onChange={(e) => updateData({ pattern: e.target.value })}
              placeholder="Ex: {brand}_{category}_{version}_{format}"
              className="font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use chaves para definir componentes variáveis: {'{brand}'}, {'{category}'}, etc.
            </p>
          </div>
          
          {localData.pattern && (
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
              <code className="text-sm font-mono text-orange-600">{localData.pattern}</code>
            </div>
          )}
        </div>
      </Card>

      {/* Componentes do Padrão */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Componentes do Padrão</h3>
          <Button variant="secondary" onClick={addComponent}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Componente
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(localData.components).map(([componentName, component]) => (
            <div key={componentName} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-sm capitalize text-orange-600">{componentName}</h4>
                <Button
                  variant="secondary"
                  onClick={() => removeComponent(componentName)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <Input
                  value={component.description}
                  onChange={(e) => {
                    const updatedComponents = { ...localData.components };
                    updatedComponents[componentName].description = e.target.value;
                    updateData({ components: updatedComponents });
                  }}
                  placeholder="Descrição do componente..."
                  className="text-xs"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Exemplos
                  </label>
                  <Button
                    variant="secondary"
                    onClick={() => addComponentExample(componentName)}
                    className="text-xs py-1 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {component.examples.map((example, index) => (
                    <div key={index} className="flex items-center">
                      <Badge variant="secondary" className="text-xs">
                        {example}
                      </Badge>
                      <button
                        onClick={() => removeComponentExample(componentName, index)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Exemplos Práticos por Categoria */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Exemplos Práticos</h3>
          <Button variant="secondary" onClick={addExampleCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Categoria
          </Button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(localData.examples).map(([categoryName, examples]) => (
            <div key={categoryName} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm capitalize text-blue-600">
                  {categoryName.replace('_', ' ')}
                </h4>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => addCategoryExample(categoryName)}
                    className="text-xs py-1 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Exemplo
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => removeExampleCategory(categoryName)}
                    className="text-red-600 hover:text-red-800 text-xs py-1 px-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                {examples.map((example, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-xs font-mono">
                      {example}
                    </code>
                    <button
                      onClick={() => removeCategoryExample(categoryName, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Padrões Proibidos */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">❌ Padrões Proibidos</h3>
          <Button variant="secondary" onClick={addForbiddenPattern}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Padrão Proibido
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {localData.forbidden_patterns.map((pattern, index) => (
            <div key={index} className="flex items-center">
              <Badge variant="destructive" className="text-xs">
                {pattern}
              </Badge>
              <button
                onClick={() => removeForbiddenPattern(index)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const QualityStandardsTab: React.FC<{ data: any; onChange: (data: any) => void }> = ({ data, onChange }) => {
  return (
    <Card>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Padrões de Qualidade</h3>
      <p className="text-gray-600">Esta seção será implementada em breve.</p>
    </Card>
  );
};

// Componente principal do editor
export const AssetManagementEditor: React.FC<AssetManagementEditorProps> = ({ content, onChange }) => {
  const [formData, setFormData] = useState(content);
  const [activeTab, setActiveTab] = useState('folder-structure');

  useEffect(() => {
    setFormData(content);
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    onChange(updatedData);
  };

  const tabs = [
    { id: 'folder-structure', label: 'Estrutura de Pastas', icon: FolderOpen },
    { id: 'naming-convention', label: 'Nomenclatura', icon: Tag },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'folder-structure':
        // Adapter para garantir que os dados estão no formato correto
        const folderData: FolderStructureData = {
          overview: typeof formData.folder_structure?.overview === 'string' 
            ? { structure_description: formData.folder_structure.overview, organization_principles: [] }
            : formData.folder_structure?.overview || { structure_description: '', organization_principles: [] },
          main_directories: Array.isArray(formData.folder_structure?.main_directories)
            ? formData.folder_structure.main_directories.reduce((acc: any, dir: any) => {
                acc[dir.path || dir.name] = {
                  name: dir.path || dir.name,
                  description: dir.description,
                  subdirectories: dir.subdirectories?.reduce((subAcc: any, sub: any) => {
                    subAcc[sub.path || sub.name] = {
                      description: sub.description,
                      naming_pattern: sub.naming_pattern || ''
                    };
                    return subAcc;
                  }, {}) || {}
                };
                return acc;
              }, {})
            : formData.folder_structure?.main_directories || {},
          folder_naming_rules: {
            general_rules: formData.folder_structure?.folder_naming_rules?.general_rules || [
              'Usar letras minúsculas',
              'Usar hífens para separar palavras',
              'Evitar espaços',
              'Ser descritivo'
            ],
            specific_patterns: formData.folder_structure?.folder_naming_rules?.specific_patterns || {}
          }
        };
        return <FolderStructureTab data={folderData} onChange={(data) => handleChange('folder_structure', data)} />;
      case 'naming-convention':
        // Adapter para garantir que os dados estão no formato correto
        const namingData: NamingConventionData = {
          pattern: formData.naming_convention?.pattern || '',
          components: formData.naming_convention?.components || {},
          examples: formData.naming_convention?.examples || {},
          forbidden_patterns: formData.naming_convention?.forbidden_patterns || []
        };
        return <NamingConventionTab data={namingData} onChange={(data) => handleChange('naming_convention', data)} />;
      case 'quality-standards':
        return <QualityStandardsTab data={formData.quality_standards} onChange={(data) => handleChange('quality_standards', data)} />;
      default:
        return <div>Selecione uma aba</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Gestão de Ativos & Nomenclatura
        </h2>
      </div>

      {/* Tab Navigation */}
      <Card>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
};

export default AssetManagementEditor;
