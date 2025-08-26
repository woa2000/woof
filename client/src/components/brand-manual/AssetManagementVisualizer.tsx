'use client'

import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  FolderOpen, 
  Tag, 
  CheckCircle, 
  FileText,
  Download,
  Upload,
  Search
} from 'lucide-react'

// Badge component
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

interface AssetManagementData {
  folder_structure: any
  naming_convention: any
  quality_standards: any
  single_source_of_truth: any
  maintenance_schedule: any
}

interface AssetManagementVisualizerProps {
  data: AssetManagementData
}

export default function AssetManagementVisualizer({ data }: AssetManagementVisualizerProps) {
  const [activeTab, setActiveTab] = useState('structure')

  const tabs = [
    { id: 'structure', label: 'Estrutura', icon: FolderOpen },
    { id: 'naming', label: 'Nomenclatura', icon: Tag },
  ]

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <FolderOpen className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Estruturas</p>
              <p className="text-2xl font-bold">6</p>
            </div>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <Tag className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Padrões</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Qualidade</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Navegação por abas */}
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

        {/* Conteúdo das abas */}
        <div className="min-h-[400px]">
          {activeTab === 'structure' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Estrutura de Arquivos
                </h3>
                <p className="text-gray-600">{data.folder_structure?.overview}</p>
              </div>

              <div className="space-y-4">
                {data.folder_structure?.main_directories?.map((dir: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderOpen className="h-4 w-4 text-orange-500" />
                      <code className="bg-white px-2 py-1 rounded text-sm font-mono border">
                        {dir.path}
                      </code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{dir.description}</p>
                    
                    {dir.subdirectories && (
                      <div className="ml-4 space-y-3">
                        {dir.subdirectories.map((subdir: any, subIndex: number) => (
                          <div key={subIndex} className="border-l-2 border-orange-200 pl-4 bg-white p-3 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <FolderOpen className="h-3 w-3 text-blue-500" />
                              <code className="bg-blue-50 px-2 py-1 rounded text-xs font-mono">
                                {subdir.path}
                              </code>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{subdir.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {subdir.contents?.map((content: string, contentIndex: number) => (
                                <Badge key={contentIndex} variant="outline" className="text-xs">
                                  {content}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'naming' && (
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Sistema de Nomenclatura
                </h3>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <code className="text-sm font-mono">{data.naming_convention?.pattern}</code>
                </div>
              </div>

              {/* Componentes do padrão */}
              <div>
                <h4 className="font-semibold mb-3">Componentes do Padrão</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(data.naming_convention?.components || {}).map(([key, component]: [string, any]) => (
                    <div key={key} className="border rounded-lg p-4 bg-gray-50">
                      <h5 className="font-medium text-sm mb-1 capitalize text-orange-600">{key}</h5>
                      <p className="text-xs text-gray-600 mb-2">{component.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {component.examples?.map((example: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exemplos práticos */}
              <div>
                <h4 className="font-semibold mb-3">Exemplos Práticos</h4>
                <div className="space-y-3">
                  {Object.entries(data.naming_convention?.examples || {}).map(([category, examples]: [string, any]) => (
                    <div key={category} className="border rounded-lg p-4 bg-white">
                      <h5 className="font-medium text-sm mb-2 capitalize text-blue-600">
                        {category.replace('_', ' ')}
                      </h5>
                      <div className="space-y-1">
                        {examples?.map((example: string, index: number) => (
                          <code key={index} className="block bg-gray-100 px-3 py-2 rounded text-xs font-mono">
                            {example}
                          </code>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Padrões proibidos */}
              <div>
                <h4 className="font-semibold mb-3">❌ Padrões Proibidos</h4>
                <div className="flex flex-wrap gap-2">
                  {data.naming_convention?.forbidden_patterns?.map((pattern: string, index: number) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}          
        </div>
      </Card>

      {/* Ações rápidas */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Baixar Guidelines
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Asset
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar Assets
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </Card>
    </div>
  )
}
