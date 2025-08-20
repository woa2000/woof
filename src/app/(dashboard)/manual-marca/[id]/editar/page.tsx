'use client';
// @ts-nocheck  // TODO: Tipar corretamente PageProps (Next.js 15) sem bloquear o build

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Upload, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { useBrandManual } from '@/hooks/features/useBrandManual';
import { BrandManual, BrandManualChapter } from '@/lib/utils/brand-manual-types';
import { uploadBrandLogo, removeBrandLogo } from '@/lib/utils/brand-logo-upload';
import LogoUploadModal from '@/components/brand-manual/LogoUploadModal';
import LogoList from '@/components/brand-manual/LogoList';
import { AssetManagementEditor } from '@/components/brand-manual/AssetManagementEditor';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Tipagem será reintroduzida depois com types adequados de PageProps

// Componente para editar Capítulo 01 - Visão & Essência
function VisionEssenceEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [formData, setFormData] = useState({
    purpose: content?.purpose || '',
    manifesto: content?.manifesto || '',
    personality_adjectives: content?.personality_adjectives || []
  });

  const [newAdjective, setNewAdjective] = useState('');

  // Sincronizar com o conteúdo quando ele mudar
  useEffect(() => {
    setFormData({
      purpose: content?.purpose || '',
      manifesto: content?.manifesto || '',
      personality_adjectives: content?.personality_adjectives || []
    });
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const addAdjective = () => {
    if (newAdjective.trim() && !formData.personality_adjectives.includes(newAdjective.trim())) {
      handleChange('personality_adjectives', [...formData.personality_adjectives, newAdjective.trim()]);
      setNewAdjective('');
    }
  };

  const removeAdjective = (index: number) => {
    handleChange('personality_adjectives', formData.personality_adjectives.filter((_: string, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Propósito da Marca *
        </label>
        <textarea
          value={formData.purpose}
          onChange={(e) => handleChange('purpose', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descreva o propósito fundamental da marca..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Manifesto da Marca *
        </label>
        <textarea
          value={formData.manifesto}
          onChange={(e) => handleChange('manifesto', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Escreva o manifesto que define a essência da marca..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adjetivos da Personalidade
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newAdjective}
            onChange={(e) => setNewAdjective(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAdjective())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Adicionar adjetivo..."
          />
          <button
            onClick={addAdjective}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
        
        {formData.personality_adjectives.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.personality_adjectives.map((adj: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
              >
                {adj}
                <button
                  onClick={() => removeAdjective(index)}
                  className="hover:text-orange-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para editar Capítulo 02 - Sistema de Logotipo
function LogoSystemEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [formData, setFormData] = useState({
    logo_versions: content?.logo_versions || [],
    file_formats: content?.file_formats || ['SVG', 'PNG'],
    asset_sizes: content?.asset_sizes || {
      favicon: [32, 48],
      app_icon: { android: 512, ios: 1024 }
    },
    clear_space: content?.clear_space || '',
    min_size_px: content?.min_size_px || 24,
    donts: content?.donts || [],
    uploaded_logos: content?.uploaded_logos || []
  });

  const [newVersion, setNewVersion] = useState('');
  const [newFormat, setNewFormat] = useState('');
  const [newDont, setNewDont] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sincronizar com o conteúdo quando ele mudar
  useEffect(() => {
    setFormData({
      logo_versions: content?.logo_versions || [],
      file_formats: content?.file_formats || ['SVG', 'PNG'],
      asset_sizes: content?.asset_sizes || {
        favicon: [32, 48],
        app_icon: { android: 512, ios: 1024 }
      },
      clear_space: content?.clear_space || '',
      min_size_px: content?.min_size_px || 24,
      donts: content?.donts || [],
      uploaded_logos: content?.uploaded_logos || []
    });
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const addLogoVersion = () => {
    if (newVersion.trim() && !formData.logo_versions.includes(newVersion.trim())) {
      handleChange('logo_versions', [...formData.logo_versions, newVersion.trim()]);
      setNewVersion('');
    }
  };

  const removeLogoVersion = (index: number) => {
    handleChange('logo_versions', formData.logo_versions.filter((_: string, i: number) => i !== index));
  };

  const addFileFormat = () => {
    if (newFormat.trim() && !formData.file_formats.includes(newFormat.trim())) {
      handleChange('file_formats', [...formData.file_formats, newFormat.trim()]);
      setNewFormat('');
    }
  };

  const removeFileFormat = (index: number) => {
    handleChange('file_formats', formData.file_formats.filter((_: string, i: number) => i !== index));
  };

  const addDont = () => {
    if (newDont.trim() && !formData.donts.includes(newDont.trim())) {
      handleChange('donts', [...formData.donts, newDont.trim()]);
      setNewDont('');
    }
  };

  const removeDont = (index: number) => {
    handleChange('donts', formData.donts.filter((_: string, i: number) => i !== index));
  };

  // Funções para gerenciar logos
  const handleLogoAdded = (newLogo: any) => {
    const updatedLogos = [...formData.uploaded_logos, newLogo];
    handleChange('uploaded_logos', updatedLogos);
  };

  const handleLogoUpdated = (logoIndex: number, updatedLogo: any) => {
    const updatedLogos = [...formData.uploaded_logos];
    updatedLogos[logoIndex] = updatedLogo;
    handleChange('uploaded_logos', updatedLogos);
  };

  const handleLogoRemoved = (logoIndex: number) => {
    const updatedLogos = formData.uploaded_logos.filter((_: any, i: number) => i !== logoIndex);
    handleChange('uploaded_logos', updatedLogos);
  };

  return (
    <div className="space-y-6">
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
          logos={formData.uploaded_logos}
          onLogoUpdated={handleLogoUpdated}
          onLogoRemoved={handleLogoRemoved}
        />
      </div>
     
      {/* O que NÃO fazer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          O que NÃO fazer com o logo
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newDont}
            onChange={(e) => setNewDont(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDont())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: distorcer, rotacionar"
          />
          <button
            onClick={addDont}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {formData.donts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {formData.donts.map((dont: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                <span className="text-sm text-red-800">{dont}</span>
                <button
                  onClick={() => removeDont(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Upload */}
      <LogoUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogoAdded={handleLogoAdded}
      />
    </div>
  );
}

function TypographyEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [formData, setFormData] = useState({
    primary_font: content?.primary_font || 'Montserrat',
    secondary_font: content?.secondary_font || 'Lato',
    fallbacks: content?.fallbacks || ['Inter', 'Helvetica', 'Arial'],
    scale_rem: content?.scale_rem || {
      h1: 2.25,
      h2: 1.75,
      h3: 1.5,
      body: 1,
      caption: 0.875
    },
    line_height: content?.line_height || 1.4,
    letter_spacing: content?.letter_spacing || 'normal'
  });

  const [newFallback, setNewFallback] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Sincronizar com o conteúdo quando ele mudar
  useEffect(() => {
    setFormData({
      primary_font: content?.primary_font || 'Montserrat',
      secondary_font: content?.secondary_font || 'Lato',
      fallbacks: content?.fallbacks || ['Inter', 'Helvetica', 'Arial'],
      scale_rem: content?.scale_rem || {
        h1: 2.25,
        h2: 1.75,
        h3: 1.5,
        body: 1,
        caption: 0.875
      },
      line_height: content?.line_height || 1.4,
      letter_spacing: content?.letter_spacing || 'normal'
    });
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const addFallback = () => {
    if (newFallback.trim() && !formData.fallbacks.includes(newFallback.trim())) {
      handleChange('fallbacks', [...formData.fallbacks, newFallback.trim()]);
      setNewFallback('');
      setIsOpen(false);
    }
  };

  const removeFallback = (index: number) => {
    handleChange('fallbacks', formData.fallbacks.filter((_: string, i: number) => i !== index));
  };

  const updateScale = (size: string, value: number) => {
    const updatedScale = { ...formData.scale_rem, [size]: value };
    handleChange('scale_rem', updatedScale);
  };

  const letterSpacingOptions = [
    { value: 'normal', label: 'Normal' },
    { value: '-0.025em', label: 'Tight (-0.025em)' },
    { value: '0.025em', label: 'Wide (0.025em)' },
    { value: '0.05em', label: 'Wider (0.05em)' },
    { value: '0.1em', label: 'Widest (0.1em)' }
  ];

  const popularFonts = [
    { name: 'Montserrat', category: 'Sans-serif', description: 'Geométrica e moderna' },
    { name: 'Lato', category: 'Sans-serif', description: 'Humanista e legível' },
    { name: 'Open Sans', category: 'Sans-serif', description: 'Neutra e versátil' },
    { name: 'Roboto', category: 'Sans-serif', description: 'Mecânica e amigável' },
    { name: 'Poppins', category: 'Sans-serif', description: 'Circular e amigável' },
    { name: 'Inter', category: 'Sans-serif', description: 'Para interfaces digitais' },
    { name: 'Source Sans Pro', category: 'Sans-serif', description: 'Limpa e profissional' },
    { name: 'Nunito', category: 'Sans-serif', description: 'Arredondada e suave' },
    { name: 'Raleway', category: 'Sans-serif', description: 'Elegante e sofisticada' },
    { name: 'Work Sans', category: 'Sans-serif', description: 'Otimizada para telas' },
    { name: 'Playfair Display', category: 'Serif', description: 'Elegante e editorial' },
    { name: 'Merriweather', category: 'Serif', description: 'Ideal para leitura' },
    { name: 'Lora', category: 'Serif', description: 'Contemporânea e calorosa' },
    { name: 'PT Serif', category: 'Serif', description: 'Tradicional e confiável' },
    { name: 'Crimson Text', category: 'Serif', description: 'Para textos longos' },
    { name: 'JetBrains Mono', category: 'Monospace', description: 'Para código e dados' },
    { name: 'Fira Code', category: 'Monospace', description: 'Com ligaduras para código' },
    { name: 'Source Code Pro', category: 'Monospace', description: 'Limpa para código' }
  ];

  const FontSelector = ({ value, onChange, label, placeholder, id }: {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder: string;
    id: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customFont, setCustomFont] = useState('');
    
    const handleFontSelect = (fontName: string) => {
      onChange(fontName);
      setIsOpen(false);
    };

    const handleCustomFont = () => {
      if (customFont.trim()) {
        onChange(customFont.trim());
        setCustomFont('');
        setIsOpen(false);
      }
    };

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
            style={{ fontFamily: value || 'inherit' }}
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {/* Campo para fonte customizada */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFont}
                  onChange={(e) => setCustomFont(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomFont()}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="Digite uma fonte personalizada..."
                />
                <button
                  onClick={handleCustomFont}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Usar
                </button>
              </div>
            </div>

            {/* Separar por categoria */}
            {['Sans-serif', 'Serif', 'Monospace'].map(category => (
              <div key={category}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100 border-b border-gray-200">
                  {category}
                </div>
                {popularFonts
                  .filter(font => font.category === category)
                  .map(font => (
                    <button
                      key={font.name}
                      onClick={() => handleFontSelect(font.name)}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div style={{ fontFamily: font.name }} className="font-medium text-gray-900">
                        {font.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {font.description}
                      </div>
                    </button>
                  ))
                }
              </div>
            ))}
          </div>
        )}

        {/* Clique fora para fechar */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Fontes Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FontSelector
            value={formData.primary_font}
            onChange={(value) => handleChange('primary_font', value)}
            label="Fonte Primária *"
            placeholder="Ex: Montserrat"
            id="primary-font"
          />
          <p className="text-xs text-gray-500 mt-1">
            Fonte para títulos e elementos de destaque
          </p>
        </div>

        <div>
          <FontSelector
            value={formData.secondary_font}
            onChange={(value) => handleChange('secondary_font', value)}
            label="Fonte Secundária *"
            placeholder="Ex: Lato"
            id="secondary-font"
          />
          <p className="text-xs text-gray-500 mt-1">
            Fonte para textos corridos e parágrafos
          </p>
        </div>
      </div>

      {/* Fontes de Fallback */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fontes de Fallback
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Fontes alternativas caso as principais não estejam disponíveis
        </p>
        
        {/* Seletor de nova fonte de fallback */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={newFallback}
              onChange={(e) => setNewFallback(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFallback())}
              onFocus={() => setIsOpen(true)}
              className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Selecionar ou digitar fonte de fallback..."
              style={{ fontFamily: newFallback || 'inherit' }}
            />
            <div className="absolute inset-y-0 right-0 flex">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 flex items-center text-gray-400 hover:text-gray-600 border-l border-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={addFallback}
                disabled={!newFallback.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dropdown para fallbacks */}
          {isOpen && (
            <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {/* Fontes recomendadas para fallback */}
              <div className="p-2 border-b border-gray-200 bg-gray-50">
                <div className="text-xs font-medium text-gray-600 mb-2">Fallbacks Recomendados</div>
                {['Inter', 'Helvetica', 'Arial', 'system-ui', '-apple-system', 'sans-serif'].map(font => (
                  <button
                    key={font}
                    onClick={() => {
                      setNewFallback(font);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-blue-50 rounded"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>

              {/* Todas as fontes disponíveis */}
              {['Sans-serif', 'Serif', 'Monospace'].map(category => (
                <div key={category}>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100 border-b border-gray-200">
                    {category}
                  </div>
                  {popularFonts
                    .filter(font => font.category === category && !formData.fallbacks.includes(font.name))
                    .map(font => (
                      <button
                        key={font.name}
                        onClick={() => {
                          setNewFallback(font.name);
                          setIsOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div style={{ fontFamily: font.name }} className="font-medium text-gray-900 text-sm">
                          {font.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {font.description}
                        </div>
                      </button>
                    ))
                  }
                </div>
              ))}
            </div>
          )}

          {/* Clique fora para fechar */}
          {isOpen && (
            <div 
              className="fixed inset-0 z-0" 
              onClick={() => setIsOpen(false)}
            />
          )}
        </div>
        
        {/* Lista de fallbacks selecionados */}
        {formData.fallbacks.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Ordem de Fallback:</div>
            <div className="space-y-2">
              {formData.fallbacks.map((fallback: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                      {index + 1}
                    </span>
                    <div>
                      <div style={{ fontFamily: fallback }} className="font-medium text-gray-900">
                        {fallback}
                      </div>
                      <div className="text-xs text-gray-500">
                        {index === 0 ? 'Primeira alternativa' : 
                         index === formData.fallbacks.length - 1 ? 'Última alternativa' : 
                         `${index + 1}ª alternativa`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Botões para reordenar */}
                    {index > 0 && (
                      <button
                        onClick={() => {
                          const newFallbacks = [...formData.fallbacks];
                          [newFallbacks[index], newFallbacks[index - 1]] = [newFallbacks[index - 1], newFallbacks[index]];
                          handleChange('fallbacks', newFallbacks);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Mover para cima"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                    )}
                    {index < formData.fallbacks.length - 1 && (
                      <button
                        onClick={() => {
                          const newFallbacks = [...formData.fallbacks];
                          [newFallbacks[index], newFallbacks[index + 1]] = [newFallbacks[index + 1], newFallbacks[index]];
                          handleChange('fallbacks', newFallbacks);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Mover para baixo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => removeFallback(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Remover"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Informação sobre a cadeia de fallback */}
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Cadeia completa:</strong> {formData.primary_font} → {formData.secondary_font} → {formData.fallbacks.join(' → ')} → sans-serif
              </div>
              <div className="text-xs text-blue-600 mt-1">
                O navegador tentará carregar as fontes nesta ordem até encontrar uma disponível
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Escala Tipográfica */}
      <div>
        <h4 className="text-lg font-medium mb-4 text-gray-900">Escala Tipográfica (REM)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(formData.scale_rem).map(([size, value]) => (
            <div key={size}>
              <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                {size}
              </label>
              <input
                type="number"
                step="0.125"
                value={Number(value)}
                onChange={(e) => updateScale(size, parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-xs text-gray-400 mt-1">
                {(Number(value) * 16).toFixed(0)}px
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configurações de Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Altura da Linha
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.line_height}
            onChange={(e) => handleChange('line_height', parseFloat(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Multiplicador da altura da linha (ex: 1.4)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Espaçamento de Letras
          </label>
          <select
            value={formData.letter_spacing}
            onChange={(e) => handleChange('letter_spacing', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {letterSpacingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview da Tipografia */}
      <div className="bg-white p-6 border rounded-lg">
        <h4 className="text-lg font-medium mb-4 text-gray-900">Preview Tipográfico</h4>
        
        {/* Demonstração das fontes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-600 mb-3">Fonte Primária: {formData.primary_font}</h5>
            <div style={{ 
              fontFamily: `${formData.primary_font}, ${formData.fallbacks.join(', ')}`,
              lineHeight: formData.line_height,
              letterSpacing: formData.letter_spacing
            }}>
              <div style={{ fontSize: `${formData.scale_rem.h1}rem`, fontWeight: 'bold' }} className="mb-2">
                Título Principal
              </div>
              <div style={{ fontSize: `${formData.scale_rem.h2}rem`, fontWeight: '600' }} className="mb-2">
                Subtítulo
              </div>
              <div style={{ fontSize: `${formData.scale_rem.h3}rem`, fontWeight: '500' }}>
                Seção
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-600 mb-3">Fonte Secundária: {formData.secondary_font}</h5>
            <div style={{ 
              fontFamily: `${formData.secondary_font}, ${formData.fallbacks.join(', ')}`,
              lineHeight: formData.line_height,
              letterSpacing: formData.letter_spacing
            }}>
              <div style={{ fontSize: `${formData.scale_rem.body}rem` }} className="mb-2">
                Este é um parágrafo de exemplo usando a fonte secundária. 
                Ideal para textos corridos e conteúdo de leitura.
              </div>
              <div style={{ fontSize: `${formData.scale_rem.caption}rem`, color: '#666' }}>
                Texto de legenda ou informações secundárias
              </div>
            </div>
          </div>
        </div>

        {/* Preview da hierarquia completa */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h5 className="text-sm font-medium text-gray-600 mb-4">Hierarquia Tipográfica Completa</h5>
          <div className="space-y-3" style={{ 
            lineHeight: formData.line_height,
            letterSpacing: formData.letter_spacing
          }}>
            <div style={{ 
              fontSize: `${formData.scale_rem.h1}rem`, 
              fontWeight: 'bold',
              fontFamily: `${formData.primary_font}, ${formData.fallbacks.join(', ')}`
            }}>
              H1 - Título Principal ({formData.scale_rem.h1}rem / {(formData.scale_rem.h1 * 16).toFixed(0)}px)
            </div>
            <div style={{ 
              fontSize: `${formData.scale_rem.h2}rem`, 
              fontWeight: '600',
              fontFamily: `${formData.primary_font}, ${formData.fallbacks.join(', ')}`
            }}>
              H2 - Título Secundário ({formData.scale_rem.h2}rem / {(formData.scale_rem.h2 * 16).toFixed(0)}px)
            </div>
            <div style={{ 
              fontSize: `${formData.scale_rem.h3}rem`, 
              fontWeight: '500',
              fontFamily: `${formData.primary_font}, ${formData.fallbacks.join(', ')}`
            }}>
              H3 - Título de Seção ({formData.scale_rem.h3}rem / {(formData.scale_rem.h3 * 16).toFixed(0)}px)
            </div>
            <div style={{ 
              fontSize: `${formData.scale_rem.body}rem`,
              fontFamily: `${formData.secondary_font}, ${formData.fallbacks.join(', ')}`
            }}>
              Body - Texto do corpo principal. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              ({formData.scale_rem.body}rem / {(formData.scale_rem.body * 16).toFixed(0)}px)
            </div>
            <div style={{ 
              fontSize: `${formData.scale_rem.caption}rem`, 
              color: '#666',
              fontFamily: `${formData.secondary_font}, ${formData.fallbacks.join(', ')}`
            }}>
              Caption - Legendas e informações secundárias ({formData.scale_rem.caption}rem / {(formData.scale_rem.caption * 16).toFixed(0)}px)
            </div>
          </div>

          {/* Informações sobre fallbacks */}
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Fallbacks:</strong> {formData.fallbacks.join(' → ')} → sans-serif
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Linha de altura: {formData.line_height} | Espaçamento: {formData.letter_spacing}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorPaletteEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [formData, setFormData] = useState({
    primary: content?.primary || { name: '', hex: '', usage_min_percent: 30 },
    support: content?.support || [],
    dark_mode: content?.dark_mode || { background: '', text: '' },
    contrast_standard: content?.contrast_standard || 'WCAG 2.2 AA'
  });

  const [newSupportColor, setNewSupportColor] = useState({ name: '', hex: '' });

  // Sincronizar com o conteúdo quando ele mudar
  useEffect(() => {
    setFormData({
      primary: content?.primary || { name: '', hex: '', usage_min_percent: 30 },
      support: content?.support || [],
      dark_mode: content?.dark_mode || { background: '', text: '' },
      contrast_standard: content?.contrast_standard || 'WCAG 2.2 AA'
    });
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const addSupportColor = () => {
    if (newSupportColor.name.trim() && newSupportColor.hex.trim()) {
      handleChange('support', [...formData.support, newSupportColor]);
      setNewSupportColor({ name: '', hex: '' });
    }
  };

  const removeSupportColor = (index: number) => {
    handleChange('support', formData.support.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium mb-4">Cor Primária</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Cor</label>
            <input
              type="text"
              value={formData.primary.name}
              onChange={(e) => handleChange('primary', { ...formData.primary, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Woof Orange"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hex Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.primary.hex}
                onChange={(e) => handleChange('primary', { ...formData.primary, hex: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.primary.hex}
                onChange={(e) => handleChange('primary', { ...formData.primary, hex: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#FF6B00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Uso Mínimo (%)</label>
            <input
              type="number"
              value={formData.primary.usage_min_percent}
              onChange={(e) => handleChange('primary', { ...formData.primary, usage_min_percent: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-4">Cores de Suporte</h4>
        <div className="space-y-4">
          {formData.support.map((color: any, index: number) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: color.hex }}
              ></div>
              <div className="flex-1">
                <div className="font-medium text-sm">{color.name}</div>
                <div className="text-xs text-gray-600">{color.hex}</div>
              </div>
              <button
                onClick={() => removeSupportColor(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newSupportColor.name}
              onChange={(e) => setNewSupportColor({ ...newSupportColor, name: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome da cor..."
            />
            <div className="flex gap-2">
              <input
                type="color"
                value={newSupportColor.hex}
                onChange={(e) => setNewSupportColor({ ...newSupportColor, hex: e.target.value })}
                className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={newSupportColor.hex}
                onChange={(e) => setNewSupportColor({ ...newSupportColor, hex: e.target.value })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#000000"
              />
            </div>
            <button
              onClick={addSupportColor}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-4">Modo Escuro</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
            <input
              type="text"
              value={formData.dark_mode.background}
              onChange={(e) => handleChange('dark_mode', { ...formData.dark_mode, background: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#1B1B1B"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input
              type="text"
              value={formData.dark_mode.text}
              onChange={(e) => handleChange('dark_mode', { ...formData.dark_mode, text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#F5F5F5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Editor para Capítulo 06 - Ícones & Ilustrações
function IconsIllustrationsEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [formData, setFormData] = useState({
    allowed_motifs: content?.allowed_motifs || [],
    icon_repository: content?.icon_repository || '',
    stroke_width_px: content?.stroke_width_px || 2,
    corner_radius_px: content?.corner_radius_px || 4,
    palette_restricted: content?.palette_restricted || true
  });

  const [newMotif, setNewMotif] = useState('');

  // Sincronizar com o conteúdo quando ele mudar
  useEffect(() => {
    setFormData({
      allowed_motifs: content?.allowed_motifs || [],
      icon_repository: content?.icon_repository || '',
      stroke_width_px: content?.stroke_width_px || 2,
      corner_radius_px: content?.corner_radius_px || 4,
      palette_restricted: content?.palette_restricted || true
    });
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const addMotif = () => {
    if (newMotif.trim() && !formData.allowed_motifs.includes(newMotif.trim())) {
      handleChange('allowed_motifs', [...formData.allowed_motifs, newMotif.trim()]);
      setNewMotif('');
    }
  };

  const removeMotif = (index: number) => {
    handleChange('allowed_motifs', formData.allowed_motifs.filter((_: string, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Motivos Permitidos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Motivos Permitidos
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Elementos visuais que podem ser usados nos ícones e ilustrações
        </p>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newMotif}
            onChange={(e) => setNewMotif(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMotif())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: patas, coleiras, ossos"
          />
          <button
            onClick={addMotif}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
        
        {formData.allowed_motifs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.allowed_motifs.map((motif: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {motif}
                <button
                  onClick={() => removeMotif(index)}
                  className="hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Repositório de Ícones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Repositório de Ícones
        </label>
        <input
          type="url"
          value={formData.icon_repository}
          onChange={(e) => handleChange('icon_repository', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://github.com/woof/icons"
        />
        <p className="text-xs text-gray-500 mt-1">
          URL do repositório onde os ícones estão armazenados
        </p>
      </div>

      {/* Configurações de Estilo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Largura do Traço (px)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.stroke_width_px}
            onChange={(e) => handleChange('stroke_width_px', parseInt(e.target.value) || 2)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Espessura padrão dos traços nos ícones
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Raio dos Cantos (px)
          </label>
          <input
            type="number"
            min="0"
            max="20"
            value={formData.corner_radius_px}
            onChange={(e) => handleChange('corner_radius_px', parseInt(e.target.value) || 4)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Arredondamento dos cantos dos ícones
          </p>
        </div>
      </div>

      {/* Paleta Restrita */}
      <div>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.palette_restricted}
            onChange={(e) => handleChange('palette_restricted', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Paleta Restrita</span>
            <p className="text-xs text-gray-500">
              Usar apenas as cores definidas na paleta da marca
            </p>
          </div>
        </label>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium mb-3">Preview das Configurações</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded border">
            <div className="text-lg mb-2">🎨</div>
            <div className="text-sm font-medium">Largura do Traço</div>
            <div className="text-xs text-gray-600">{formData.stroke_width_px}px</div>
          </div>
          <div className="text-center p-3 bg-white rounded border">
            <div className="text-lg mb-2">📐</div>
            <div className="text-sm font-medium">Raio dos Cantos</div>
            <div className="text-xs text-gray-600">{formData.corner_radius_px}px</div>
          </div>
          <div className="text-center p-3 bg-white rounded border">
            <div className="text-lg mb-2">{formData.palette_restricted ? '🔒' : '🔓'}</div>
            <div className="text-sm font-medium">Paleta</div>
            <div className="text-xs text-gray-600">
              {formData.palette_restricted ? 'Restrita' : 'Livre'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Editor para Capítulo 07 - Tom de Voz Digital
function VoiceToneEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [formData, setFormData] = useState({
    pillars: content?.pillars || [],
    examples: content?.examples || {},
    avoid_words: content?.avoid_words || [],
    preferred_words: content?.preferred_words || []
  });

  const [newPillar, setNewPillar] = useState('');
  const [newExample, setNewExample] = useState({ type: '', text: '' });
  const [newAvoidWord, setNewAvoidWord] = useState('');
  const [newPreferredWord, setNewPreferredWord] = useState('');

  // Sincronizar com o conteúdo quando ele mudar
  useEffect(() => {
    setFormData({
      pillars: content?.pillars || [],
      examples: content?.examples || {},
      avoid_words: content?.avoid_words || [],
      preferred_words: content?.preferred_words || []
    });
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const addPillar = () => {
    if (newPillar.trim() && !formData.pillars.includes(newPillar.trim())) {
      handleChange('pillars', [...formData.pillars, newPillar.trim()]);
      setNewPillar('');
    }
  };

  const removePillar = (index: number) => {
    handleChange('pillars', formData.pillars.filter((_: string, i: number) => i !== index));
  };

  const addExample = () => {
    if (newExample.type.trim() && newExample.text.trim()) {
      handleChange('examples', { ...formData.examples, [newExample.type]: newExample.text });
      setNewExample({ type: '', text: '' });
    }
  };

  const removeExample = (type: string) => {
    const updatedExamples = { ...formData.examples };
    delete updatedExamples[type];
    handleChange('examples', updatedExamples);
  };

  const addAvoidWord = () => {
    if (newAvoidWord.trim() && !formData.avoid_words.includes(newAvoidWord.trim())) {
      handleChange('avoid_words', [...formData.avoid_words, newAvoidWord.trim()]);
      setNewAvoidWord('');
    }
  };

  const removeAvoidWord = (index: number) => {
    handleChange('avoid_words', formData.avoid_words.filter((_: string, i: number) => i !== index));
  };

  const addPreferredWord = () => {
    if (newPreferredWord.trim() && !formData.preferred_words.includes(newPreferredWord.trim())) {
      handleChange('preferred_words', [...formData.preferred_words, newPreferredWord.trim()]);
      setNewPreferredWord('');
    }
  };

  const removePreferredWord = (index: number) => {
    handleChange('preferred_words', formData.preferred_words.filter((_: string, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Pilares da Comunicação */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilares da Comunicação
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Adjetivos que definem a personalidade da marca na comunicação
        </p>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newPillar}
            onChange={(e) => setNewPillar(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPillar())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: caloroso, consultivo, confiante"
          />
          <button
            onClick={addPillar}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
        
        {formData.pillars.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.pillars.map((pillar: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
              >
                {pillar}
                <button
                  onClick={() => removePillar(index)}
                  className="hover:text-orange-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Exemplos de Aplicação */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exemplos de Aplicação
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Exemplos práticos de como aplicar o tom de voz em diferentes contextos
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newExample.type}
              onChange={(e) => setNewExample({ ...newExample, type: e.target.value })}
              className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: banner_cta"
            />
            <input
              type="text"
              value={newExample.text}
              onChange={(e) => setNewExample({ ...newExample, text: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Quero atrair mais clientes"
            />
            <button
              onClick={addExample}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {Object.keys(formData.examples).length > 0 && (
          <div className="space-y-2">
            {Object.entries(formData.examples).map(([type, example]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-sm capitalize">{type.replace(/_/g, ' ')}</div>
                  <div className="text-gray-700 italic">"{String(example)}"</div>
                </div>
                <button
                  onClick={() => removeExample(type)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Palavras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Palavras Preferidas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Palavras Preferidas
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Palavras que devem ser priorizadas na comunicação
          </p>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPreferredWord}
              onChange={(e) => setNewPreferredWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredWord())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: agilidade"
            />
            <button
              onClick={addPreferredWord}
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {formData.preferred_words.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.preferred_words.map((word: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                >
                  {word}
                  <button
                    onClick={() => removePreferredWord(index)}
                    className="hover:text-green-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Palavras a Evitar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Palavras a Evitar
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Palavras que devem ser evitadas na comunicação
          </p>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newAvoidWord}
              onChange={(e) => setNewAvoidWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAvoidWord())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: barato"
            />
            <button
              onClick={addAvoidWord}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {formData.avoid_words.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.avoid_words.map((word: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
                >
                  {word}
                  <button
                    onClick={() => removeAvoidWord(index)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Editor para Capítulo 08 - Social Media Toolkit
function SocialMediaEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [formData, setFormData] = useState({
    templates: {
      feed: '1080x1080',
      story: '1080x1920',
      reel_cover: '1080x1920'
    },
    hashtag_rules: {
      brand_tag: '#WoofMarketing',
      max_per_post: 5
    },
    safe_margins_percent: 10,
    ...content
  });

  // Sincronizar com o conteúdo quando ele mudar
  useEffect(() => {
    setFormData({
      templates: {
        feed: '1080x1080',
        story: '1080x1920',
        reel_cover: '1080x1920'
      },
      hashtag_rules: {
        brand_tag: '#WoofMarketing',
        max_per_post: 5
      },
      safe_margins_percent: 10,
      ...content
    });
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const handleTemplateChange = (platform: string, dimensions: string) => {
    handleChange('templates', {
      ...formData.templates,
      [platform]: dimensions
    });
  };

  const handleHashtagRuleChange = (field: string, value: any) => {
    handleChange('hashtag_rules', {
      ...formData.hashtag_rules,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Templates Configuration */}
      <div>
        <h3 className="text-lg font-semibold mb-4">📱 Configuração de Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Feed Post</label>
            <input
              type="text"
              value={formData.templates.feed}
              onChange={(e) => handleTemplateChange('feed', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1080x1080"
            />
            <p className="text-xs text-gray-500 mt-1">Dimensões para posts do feed</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stories</label>
            <input
              type="text"
              value={formData.templates.story}
              onChange={(e) => handleTemplateChange('story', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1080x1920"
            />
            <p className="text-xs text-gray-500 mt-1">Dimensões para stories</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reel Cover</label>
            <input
              type="text"
              value={formData.templates.reel_cover}
              onChange={(e) => handleTemplateChange('reel_cover', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1080x1920"
            />
            <p className="text-xs text-gray-500 mt-1">Dimensões para capas de reels</p>
          </div>
        </div>
      </div>

      {/* Hashtag Rules */}
      <div>
        <h3 className="text-lg font-semibold mb-4">#️⃣ Regras de Hashtags</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tag da Marca</label>
            <input
              type="text"
              value={formData.hashtag_rules.brand_tag}
              onChange={(e) => handleHashtagRuleChange('brand_tag', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#SuaMarca"
            />
            <p className="text-xs text-gray-500 mt-1">Hashtag oficial da marca</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Máximo por Post</label>
            <input
              type="number"
              value={formData.hashtag_rules.max_per_post}
              onChange={(e) => handleHashtagRuleChange('max_per_post', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="30"
            />
            <p className="text-xs text-gray-500 mt-1">Número recomendado de hashtags</p>
          </div>
        </div>
      </div>

      {/* Safe Margins */}
      <div>
        <h3 className="text-lg font-semibold mb-4">🛡️ Margens de Segurança</h3>
        <div>
          <label className="block text-sm font-medium mb-2">
            Margem de Segurança ({formData.safe_margins_percent}%)
          </label>
          <input
            type="range"
            min="5"
            max="25"
            value={formData.safe_margins_percent}
            onChange={(e) => handleChange('safe_margins_percent', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5%</span>
            <span>15%</span>
            <span>25%</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Área protegida para evitar cortes em diferentes plataformas
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium mb-3">👁️ Preview das Configurações</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded border">
            <div className="text-lg mb-2">📱</div>
            <div className="text-sm font-medium">Feed</div>
            <div className="text-xs text-gray-600">{formData.templates.feed}</div>
          </div>
          <div className="text-center p-3 bg-white rounded border">
            <div className="text-lg mb-2">📖</div>
            <div className="text-sm font-medium">Stories</div>
            <div className="text-xs text-gray-600">{formData.templates.story}</div>
          </div>
          <div className="text-center p-3 bg-white rounded border">
            <div className="text-lg mb-2">🎬</div>
            <div className="text-sm font-medium">Reel Cover</div>
            <div className="text-xs text-gray-600">{formData.templates.reel_cover}</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded border">
            <div className="text-lg mb-2">#️⃣</div>
            <div className="text-sm font-medium">Hashtags</div>
            <div className="text-xs text-gray-600">Máx. {formData.hashtag_rules.max_per_post} por post</div>
          </div>
          <div className="text-center p-3 bg-white rounded border">
            <div className="text-lg mb-2">🛡️</div>
            <div className="text-sm font-medium">Margem Segura</div>
            <div className="text-xs text-gray-600">{formData.safe_margins_percent}% protegido</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// GridLayoutEditor para capítulo 05
function GridLayoutEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [formData, setFormData] = useState({
    grids: content?.grids || { desktop: 12, tablet: 8, mobile: 4 },
    spacing_tokens_px: content?.spacing_tokens_px || [4, 8, 16, 24, 32, 40],
    breakpoints_px: content?.breakpoints_px || { sm: 640, md: 768, lg: 1024, xl: 1280 }
  });

  const [newSpacingToken, setNewSpacingToken] = useState('');

  // Sincronizar com o conteúdo quando ele mudar
  useEffect(() => {
    setFormData({
      grids: content?.grids || { desktop: 12, tablet: 8, mobile: 4 },
      spacing_tokens_px: content?.spacing_tokens_px || [4, 8, 16, 24, 32, 40],
      breakpoints_px: content?.breakpoints_px || { sm: 640, md: 768, lg: 1024, xl: 1280 }
    });
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  const updateGrid = (device: 'desktop' | 'tablet' | 'mobile', value: number) => {
    handleChange('grids', { ...formData.grids, [device]: value });
  };

  const updateBreakpoint = (breakpoint: 'sm' | 'md' | 'lg' | 'xl', value: number) => {
    handleChange('breakpoints_px', { ...formData.breakpoints_px, [breakpoint]: value });
  };

  const addSpacingToken = () => {
    const value = parseInt(newSpacingToken);
    if (!isNaN(value) && value > 0) {
      const newTokens = [...formData.spacing_tokens_px, value].sort((a, b) => a - b);
      handleChange('spacing_tokens_px', newTokens);
      setNewSpacingToken('');
    }
  };

  const removeSpacingToken = (index: number) => {
    const newTokens = formData.spacing_tokens_px.filter((_: number, i: number) => i !== index);
    handleChange('spacing_tokens_px', newTokens);
  };

  return (
    <div className="space-y-6">
      {/* Grid Configuration */}
      <div>
        <h4 className="text-lg font-medium mb-4">🔲 Configuração de Grid</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desktop (colunas)</label>
            <input
              type="number"
              min="1"
              max="24"
              value={formData.grids.desktop}
              onChange={(e) => updateGrid('desktop', parseInt(e.target.value) || 12)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tablet (colunas)</label>
            <input
              type="number"
              min="1"
              max="24"
              value={formData.grids.tablet}
              onChange={(e) => updateGrid('tablet', parseInt(e.target.value) || 8)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile (colunas)</label>
            <input
              type="number"
              min="1"
              max="24"
              value={formData.grids.mobile}
              onChange={(e) => updateGrid('mobile', parseInt(e.target.value) || 4)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Breakpoints */}
      <div>
        <h4 className="text-lg font-medium mb-4">📐 Breakpoints Responsivos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Small (SM)</label>
            <input
              type="number"
              min="320"
              max="2560"
              value={formData.breakpoints_px.sm}
              onChange={(e) => updateBreakpoint('sm', parseInt(e.target.value) || 640)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-500">{formData.breakpoints_px.sm}px</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medium (MD)</label>
            <input
              type="number"
              min="320"
              max="2560"
              value={formData.breakpoints_px.md}
              onChange={(e) => updateBreakpoint('md', parseInt(e.target.value) || 768)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-500">{formData.breakpoints_px.md}px</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Large (LG)</label>
            <input
              type="number"
              min="320"
              max="2560"
              value={formData.breakpoints_px.lg}
              onChange={(e) => updateBreakpoint('lg', parseInt(e.target.value) || 1024)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-500">{formData.breakpoints_px.lg}px</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Extra Large (XL)</label>
            <input
              type="number"
              min="320"
              max="2560"
              value={formData.breakpoints_px.xl}
              onChange={(e) => updateBreakpoint('xl', parseInt(e.target.value) || 1280)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-xs text-gray-500">{formData.breakpoints_px.xl}px</span>
          </div>
        </div>
      </div>

      {/* Spacing Tokens */}
      <div>
        <h4 className="text-lg font-medium mb-4">📏 Tokens de Espaçamento</h4>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="4"
              value={newSpacingToken}
              onChange={(e) => setNewSpacingToken(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 48"
            />
            <button
              onClick={addSpacingToken}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {formData.spacing_tokens_px.sort((a: number, b: number) => a - b).map((token: number, index: number) => (
              <div key={index} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg">
                <div 
                  className="bg-blue-200 border border-blue-300 mb-2"
                  style={{ 
                    width: Math.min(token, 40), 
                    height: Math.min(token / 4, 10) 
                  }}
                />
                <span className="text-sm font-medium">{token}px</span>
                <span className="text-xs text-gray-500">{(token / 16).toFixed(2)}rem</span>
                <button
                  onClick={() => removeSpacingToken(index)}
                  className="mt-2 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-medium mb-4">👁️ Preview do Sistema</h4>
        
        {/* Grid Preview */}
        <div className="space-y-4">
          <h5 className="font-medium">Grids por Dispositivo:</h5>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Desktop - {formData.grids.desktop} colunas</span>
              <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: `repeat(${formData.grids.desktop}, 1fr)` }}>
                {Array.from({ length: formData.grids.desktop }).map((_, i) => (
                  <div key={i} className="bg-blue-100 border border-blue-200 h-6 flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Tablet - {formData.grids.tablet} colunas</span>
              <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: `repeat(${formData.grids.tablet}, 1fr)` }}>
                {Array.from({ length: formData.grids.tablet }).map((_, i) => (
                  <div key={i} className="bg-green-100 border border-green-200 h-6 flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Mobile - {formData.grids.mobile} colunas</span>
              <div className="grid gap-1 mt-1" style={{ gridTemplateColumns: `repeat(${formData.grids.mobile}, 1fr)` }}>
                {Array.from({ length: formData.grids.mobile }).map((_, i) => (
                  <div key={i} className="bg-orange-100 border border-orange-200 h-6 flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para editar Capítulo 09 - Banners & Ads Digitais
function BannersAdsEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [formData, setFormData] = useState({
    iab_standard_sizes: content?.iab_standard_sizes || [],
    social_media_specs: content?.social_media_specs || {},
    design_principles: content?.design_principles || {},
    file_specifications: content?.file_specifications || {},
    platform_guidelines: content?.platform_guidelines || {},
    approval_checklist: content?.approval_checklist || []
  });

  useEffect(() => {
    setFormData({
      iab_standard_sizes: content?.iab_standard_sizes || [],
      social_media_specs: content?.social_media_specs || {},
      design_principles: content?.design_principles || {},
      file_specifications: content?.file_specifications || {},
      platform_guidelines: content?.platform_guidelines || {},
      approval_checklist: content?.approval_checklist || []
    });
  }, [content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange(updated);
  };

  // Funções para gerenciar tamanhos IAB
  const addIABSize = () => {
    const newSize = {
      name: 'Novo Formato',
      dimensions: [300, 250],
      usage: 'Descrição do uso',
      platforms: ['Google Ads'],
      notes: ''
    };
    handleChange('iab_standard_sizes', [...formData.iab_standard_sizes, newSize]);
  };

  const updateIABSize = (index: number, field: string, value: any) => {
    const updated = formData.iab_standard_sizes.map((size: any, i: number) => 
      i === index ? { ...size, [field]: value } : size
    );
    handleChange('iab_standard_sizes', updated);
  };

  const removeIABSize = (index: number) => {
    handleChange('iab_standard_sizes', formData.iab_standard_sizes.filter((_: any, i: number) => i !== index));
  };

  // Funções para checklist
  const addChecklistItem = (item: string) => {
    if (item.trim() && !formData.approval_checklist.includes(item.trim())) {
      handleChange('approval_checklist', [...formData.approval_checklist, item.trim()]);
    }
  };

  const removeChecklistItem = (index: number) => {
    handleChange('approval_checklist', formData.approval_checklist.filter((_: string, i: number) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Tamanhos Padrão IAB */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            📐 Tamanhos Padrão IAB
          </h3>
          <Button onClick={addIABSize}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Tamanho
          </Button>
        </div>

        <div className="space-y-4">
          {formData.iab_standard_sizes.map((size: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Formato {index + 1}</h4>
                <Button 
                  onClick={() => removeIABSize(index)}
                  className="text-red-600 hover:text-red-700 text-sm px-2 py-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Formato *
                  </label>
                  <Input
                    value={size.name || ''}
                    onChange={(e) => updateIABSize(index, 'name', e.target.value)}
                    placeholder="Ex: Leaderboard"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Largura (px) *
                  </label>
                  <Input
                    type="number"
                    value={size.dimensions?.[0] || ''}
                    onChange={(e) => {
                      const width = parseInt(e.target.value) || 0;
                      const height = size.dimensions?.[1] || 0;
                      updateIABSize(index, 'dimensions', [width, height]);
                    }}
                    placeholder="728"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Altura (px) *
                  </label>
                  <Input
                    type="number"
                    value={size.dimensions?.[1] || ''}
                    onChange={(e) => {
                      const width = size.dimensions?.[0] || 0;
                      const height = parseInt(e.target.value) || 0;
                      updateIABSize(index, 'dimensions', [width, height]);
                    }}
                    placeholder="90"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uso Recomendado *
                  </label>
                  <Input
                    value={size.usage || ''}
                    onChange={(e) => updateIABSize(index, 'usage', e.target.value)}
                    placeholder="Ex: Topo/rodapé de sites desktop"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plataformas (separadas por vírgula)
                  </label>
                  <Input
                    value={size.platforms?.join(', ') || ''}
                    onChange={(e) => {
                      const platforms = e.target.value.split(',').map(p => p.trim()).filter(p => p);
                      updateIABSize(index, 'platforms', platforms);
                    }}
                    placeholder="Ex: Google Ads, Facebook, Sites"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas Adicionais
                  </label>
                  <Input
                    value={size.notes || ''}
                    onChange={(e) => updateIABSize(index, 'notes', e.target.value)}
                    placeholder="Ex: Formato horizontal ideal para headers"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {formData.iab_standard_sizes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📐</div>
              <p className="text-sm">Nenhum tamanho definido ainda. Clique em "Adicionar Tamanho" para começar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Especificações de Arquivo */}
      <div>
        <h3 className="text-lg font-semibold mb-4">📄 Especificações de Arquivo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Anúncios Estáticos */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-3">🖼️ Anúncios Estáticos</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formatos Permitidos (separados por vírgula)
                </label>
                <Input
                  value={formData.file_specifications?.static_ads?.formats?.join(', ') || ''}
                  onChange={(e) => {
                    const formats = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                    const updated = {
                      ...formData.file_specifications,
                      static_ads: {
                        ...formData.file_specifications?.static_ads,
                        formats
                      }
                    };
                    handleChange('file_specifications', updated);
                  }}
                  placeholder="Ex: JPG, PNG"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamanho Máximo do Arquivo
                </label>
                <Input
                  value={formData.file_specifications?.static_ads?.max_file_size || ''}
                  onChange={(e) => {
                    const updated = {
                      ...formData.file_specifications,
                      static_ads: {
                        ...formData.file_specifications?.static_ads,
                        max_file_size: e.target.value
                      }
                    };
                    handleChange('file_specifications', updated);
                  }}
                  placeholder="Ex: 150KB"
                />
              </div>
            </div>
          </div>

          {/* Anúncios Animados */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-3">🎬 Anúncios Animados</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formatos Permitidos (separados por vírgula)
                </label>
                <Input
                  value={formData.file_specifications?.animated_ads?.formats?.join(', ') || ''}
                  onChange={(e) => {
                    const formats = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                    const updated = {
                      ...formData.file_specifications,
                      animated_ads: {
                        ...formData.file_specifications?.animated_ads,
                        formats
                      }
                    };
                    handleChange('file_specifications', updated);
                  }}
                  placeholder="Ex: GIF, HTML5, MP4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração Máxima
                </label>
                <Input
                  value={formData.file_specifications?.animated_ads?.duration || ''}
                  onChange={(e) => {
                    const updated = {
                      ...formData.file_specifications,
                      animated_ads: {
                        ...formData.file_specifications?.animated_ads,
                        duration: e.target.value
                      }
                    };
                    handleChange('file_specifications', updated);
                  }}
                  placeholder="Ex: Máximo 15 segundos"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist de Aprovação */}
      <div>
        <h3 className="text-lg font-semibold mb-4">✅ Checklist de Aprovação</h3>
        
        <div className="space-y-3">
          {formData.approval_checklist.map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="flex-1 text-sm text-gray-700">{item}</span>
              <Button
                onClick={() => removeChecklistItem(index)}
                className="text-red-600 hover:text-red-700 text-sm px-2 py-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar novo item do checklist..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  addChecklistItem(input.value);
                  input.value = '';
                }
              }}
            />
            <Button
              onClick={(e) => {
                const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                if (input) {
                  addChecklistItem(input.value);
                  input.value = '';
                }
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-medium mb-4">👁️ Preview do Guia</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formData.iab_standard_sizes.slice(0, 3).map((size: any, index: number) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium mb-2">{size.name}</h5>
              <div className="text-sm text-blue-600 mb-2">
                {size.dimensions?.[0]} × {size.dimensions?.[1]}px
              </div>
              <div className="text-xs text-gray-600">{size.usage}</div>
            </div>
          ))}
        </div>
        
        {formData.iab_standard_sizes.length > 3 && (
          <p className="text-sm text-gray-600 mt-4">
            E mais {formData.iab_standard_sizes.length - 3} formato(s)...
          </p>
        )}
      </div>
    </div>
  );
}

// Editor genérico para outros capítulos
function GenericEditor({ content, onChange }: { 
  content: any; 
  onChange: (newContent: any) => void; 
}) {
  const [jsonContent, setJsonContent] = useState(JSON.stringify(content || {}, null, 2));
  const [isValid, setIsValid] = useState(true);

  const handleChange = (value: string) => {
    setJsonContent(value);
    try {
      const parsed = JSON.parse(value);
      setIsValid(true);
      onChange(parsed);
    } catch (e) {
      setIsValid(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Conteúdo do Capítulo (JSON)
      </label>
      <textarea
        value={jsonContent}
        onChange={(e) => handleChange(e.target.value)}
        rows={20}
        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:border-transparent font-mono text-sm ${
          isValid 
            ? 'border-gray-300 focus:ring-blue-500' 
            : 'border-red-300 focus:ring-red-500'
        }`}
        placeholder="Insira o conteúdo em formato JSON..."
      />
      {!isValid && (
        <p className="text-red-600 text-sm mt-1">
          JSON inválido. Verifique a sintaxe.
        </p>
      )}
    </div>
  );
}

export default function ChapterEditor({ params, searchParams }: any) {
  const { fetchManual, currentManual, updateChapterContent, loading, error } = useBrandManual();
  const [activeChapter, setActiveChapter] = useState(searchParams.chapter || '01');
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [chapterContent, setChapterContent] = useState<any>({});

  useEffect(() => {
    fetchManual(params.id);
  }, [params.id, fetchManual]);

  useEffect(() => {
    if (currentManual) {
      const chapter = currentManual.manual_data.chapters.find(ch => ch.id === activeChapter);
      setChapterContent(chapter?.content || {});
      setHasChanges(false);
    }
  }, [currentManual, activeChapter]);

  const handleContentChange = (newContent: any) => {
    setChapterContent(newContent);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!currentManual) return;
    
    setSaving(true);
    const chapterIndex = currentManual.manual_data.chapters.findIndex(ch => ch.id === activeChapter);
    
    if (chapterIndex !== -1) {
      const success = await updateChapterContent(currentManual.id, chapterIndex, chapterContent);
      if (success) {
        setHasChanges(false);
      }
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !currentManual) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manual não encontrado</h1>
          <p className="text-gray-600 mb-4">
            O manual solicitado não foi encontrado ou você não tem permissão para editá-lo.
          </p>
          <Link href="/manual-marca" className="text-blue-600 hover:text-blue-700">
            ← Voltar aos manuais
          </Link>
        </div>
      </div>
    );
  }

  const currentChapter = currentManual.manual_data.chapters.find(ch => ch.id === activeChapter);

  const renderEditor = () => {
    if (!currentChapter) return null;

    switch (activeChapter) {
      case '01':
        return <VisionEssenceEditor content={chapterContent} onChange={handleContentChange} />;
      case '02':
        return <LogoSystemEditor content={chapterContent} onChange={handleContentChange} />;
      case '03':
        return <ColorPaletteEditor content={chapterContent} onChange={handleContentChange} />;
      case '04':
        return <TypographyEditor content={chapterContent} onChange={handleContentChange} />;
      case '05':
        return <GridLayoutEditor content={chapterContent} onChange={handleContentChange} />;
      case '06':
        return <IconsIllustrationsEditor content={chapterContent} onChange={handleContentChange} />;
      case '07':
        return <VoiceToneEditor content={chapterContent} onChange={handleContentChange} />;
      case '08':
        return <SocialMediaEditor content={chapterContent} onChange={handleContentChange} />;
      case '09':
        return <BannersAdsEditor content={chapterContent} onChange={handleContentChange} />;
      case '10':
        return <AssetManagementEditor content={chapterContent} onChange={handleContentChange} />;
      default:
        return <GenericEditor content={chapterContent} onChange={handleContentChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/manual-marca/${params.id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Editando: {currentManual.brand_name}
              </h1>
              <p className="text-sm text-gray-500">
                Capítulo {activeChapter} - {currentChapter?.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/manual-marca/${params.id}`}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Eye className="w-4 h-4" />
              Visualizar
            </Link>

            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Lista de Capítulos */}
        <nav className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Capítulos</h3>
            <div className="space-y-1">
              {currentManual.manual_data.chapters.map((chapter) => {
                const isActive = activeChapter === chapter.id;
                const hasContent = chapter.completion_status !== 'empty';

                return (
                  <button
                    key={chapter.id}
                    onClick={() => setActiveChapter(chapter.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          hasContent ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div>
                          <div className="text-sm font-medium">
                            {chapter.id}. {chapter.title}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {chapter.objective}
                          </div>
                        </div>
                      </div>
                      {isActive && hasChanges && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header do Capítulo */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {currentChapter?.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {currentChapter?.objective}
                </p>
              </div>

              {/* Editor */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {renderEditor()}
              </div>

              {/* Status de mudanças */}
              {hasChanges && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Você tem alterações não salvas neste capítulo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
