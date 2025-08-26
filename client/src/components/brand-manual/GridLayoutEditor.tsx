'use client';

import { GridLayoutContent } from '@/lib/brand-manual-types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useState, useEffect } from 'react';

interface GridLayoutEditorProps {
  content: GridLayoutContent;
  onChange: (content: GridLayoutContent) => void;
}

const DEVICE_ICONS = {
  desktop: '🖥️',
  tablet: '📱',
  mobile: '📱'
};

const BREAKPOINT_LABELS = {
  sm: 'Small (SM)',
  md: 'Medium (MD)', 
  lg: 'Large (LG)',
  xl: 'Extra Large (XL)'
};

export default function GridLayoutEditor({ content, onChange }: GridLayoutEditorProps) {
  const [localContent, setLocalContent] = useState<GridLayoutContent>(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const updateContent = (updates: Partial<GridLayoutContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onChange(newContent);
  };

  const updateGrids = (device: keyof GridLayoutContent['grids'], value: number) => {
    updateContent({
      grids: {
        ...localContent.grids,
        [device]: value
      }
    });
  };

  const updateBreakpoint = (breakpoint: keyof GridLayoutContent['breakpoints_px'], value: number) => {
    updateContent({
      breakpoints_px: {
        ...localContent.breakpoints_px,
        [breakpoint]: value
      }
    });
  };

  const addSpacingToken = () => {
    const newTokens = [...localContent.spacing_tokens_px, 0];
    updateContent({ spacing_tokens_px: newTokens });
  };

  const updateSpacingToken = (index: number, value: number) => {
    const newTokens = [...localContent.spacing_tokens_px];
    newTokens[index] = value;
    updateContent({ spacing_tokens_px: newTokens });
  };

  const removeSpacingToken = (index: number) => {
    const newTokens = localContent.spacing_tokens_px.filter((_, i) => i !== index);
    updateContent({ spacing_tokens_px: newTokens });
  };

  const sortSpacingTokens = () => {
    const sortedTokens = [...localContent.spacing_tokens_px].sort((a, b) => a - b);
    updateContent({ spacing_tokens_px: sortedTokens });
  };

  return (
    <div className="space-y-8">
      {/* Grid Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">🔲 Configuração de Grid</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(localContent.grids) as Array<keyof GridLayoutContent['grids']>).map((device) => (
            <div key={device} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>{DEVICE_ICONS[device]}</span>
                {device.charAt(0).toUpperCase() + device.slice(1)}
              </label>
              <Input
                type="number"
                min="1"
                max="24"
                value={localContent.grids[device]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateGrids(device, parseInt(e.target.value) || 1)}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{localContent.grids[device]} colunas</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Breakpoints */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">📐 Breakpoints Responsivos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(localContent.breakpoints_px) as Array<keyof GridLayoutContent['breakpoints_px']>).map((breakpoint) => (
            <div key={breakpoint} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {BREAKPOINT_LABELS[breakpoint]}
              </label>
              <Input
                type="number"
                min="320"
                max="2560"
                step="8"
                value={localContent.breakpoints_px[breakpoint]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateBreakpoint(breakpoint, parseInt(e.target.value) || 320)}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{localContent.breakpoints_px[breakpoint]}px</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Spacing Tokens */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">📏 Tokens de Espaçamento</h3>
          <div className="flex gap-2">
            <Button
              onClick={sortSpacingTokens}
              variant="secondary"
            >
              🔄 Ordenar
            </Button>
            <Button
              onClick={addSpacingToken}
              variant="secondary"
            >
              + Adicionar Token
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {localContent.spacing_tokens_px.map((token, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min="0"
                  max="200"
                  step="4"
                  value={token}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSpacingToken(index, parseInt(e.target.value) || 0)}
                  className="flex-1"
                />
                <Button
                  onClick={() => removeSpacingToken(index)}
                  variant="secondary"
                  className="px-2 text-red-600 hover:text-red-700"
                >
                  ×
                </Button>
              </div>
              <div className="text-xs text-gray-500 text-center">
                {token}px
                <br />
                {(token / 16).toFixed(2)}rem
              </div>
              {/* Visual representation */}
              <div className="flex justify-center">
                <div 
                  className="bg-blue-200 border border-blue-300"
                  style={{ 
                    width: Math.min(token, 48), 
                    height: Math.min(token / 4, 12) 
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {localContent.spacing_tokens_px.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum token de espaçamento configurado.
            <br />
            <Button onClick={addSpacingToken} className="mt-2">
              Adicionar Primeiro Token
            </Button>
          </div>
        )}
      </Card>

      {/* Preview Section */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">👁️ Preview do Sistema</h3>
        
        {/* Grid Preview */}
        <div className="space-y-4">
          <h4 className="font-medium">Grids por Dispositivo:</h4>
          {(Object.keys(localContent.grids) as Array<keyof GridLayoutContent['grids']>).map((device) => (
            <div key={device} className="space-y-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>{DEVICE_ICONS[device]}</span>
                {device.charAt(0).toUpperCase() + device.slice(1)} - {localContent.grids[device]} colunas
              </span>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${localContent.grids[device]}, 1fr)` }}>
                {Array.from({ length: localContent.grids[device] }).map((_, i) => (
                  <div key={i} className="bg-blue-100 border border-blue-200 h-8 flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Spacing Preview */}
        <div className="mt-6 space-y-4">
          <h4 className="font-medium">Tokens de Espaçamento:</h4>
          <div className="flex flex-wrap gap-4">
            {localContent.spacing_tokens_px.sort((a, b) => a - b).map((token, index) => (
              <div key={index} className="text-center">
                <div 
                  className="bg-green-200 border border-green-300 mb-1"
                  style={{ 
                    width: Math.max(token, 16), 
                    height: 16 
                  }}
                />
                <span className="text-xs">{token}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakpoints Preview */}
        <div className="mt-6 space-y-2">
          <h4 className="font-medium">Breakpoints:</h4>
          <div className="text-sm space-y-1">
            {(Object.keys(localContent.breakpoints_px) as Array<keyof GridLayoutContent['breakpoints_px']>).map((breakpoint) => (
              <div key={breakpoint} className="flex justify-between">
                <span>{BREAKPOINT_LABELS[breakpoint]}</span>
                <span className="font-mono">{localContent.breakpoints_px[breakpoint]}px+</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
