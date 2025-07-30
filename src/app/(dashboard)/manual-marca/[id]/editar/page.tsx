'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Upload, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { useBrandManual } from '@/hooks/features/useBrandManual';
import { BrandManual, BrandManualChapter } from '@/lib/utils/brand-manual-types';
import { uploadBrandLogo, removeBrandLogo } from '@/lib/utils/brand-logo-upload';
import LogoUploadModal from '@/components/brand-manual/LogoUploadModal';
import LogoList from '@/components/brand-manual/LogoList';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ChapterEditorProps {
  params: {
    id: string;
  };
  searchParams: {
    chapter?: string;
  };
}

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

export default function ChapterEditor({ params, searchParams }: ChapterEditorProps) {
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
