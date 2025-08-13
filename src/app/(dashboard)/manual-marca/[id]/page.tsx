// @ts-nocheck - TODO: corrigir tipagem Next.js 15 para páginas dinâmicas
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Share, Edit, Eye, EyeOff, ChevronRight, Clock, User, Globe } from 'lucide-react';
import Link from 'next/link';
import { useBrandManual } from '@/hooks/features/useBrandManual';
import { BrandManual, BrandManualChapter } from '@/lib/utils/brand-manual-types';

interface ManualViewerProps {
  params: {
    id: string;
  };
}

function ChapterNavigation({ chapters, activeChapter, onChapterChange }: {
  chapters: BrandManualChapter[];
  activeChapter: string;
  onChapterChange: (chapterId: string) => void;
}) {
  return (
    <nav className="w-80 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Capítulos</h3>
        <div className="space-y-1">
          {chapters.map((chapter) => {
            const isActive = activeChapter === chapter.id;
            const completionColor = {
              empty: 'text-gray-400',
              partial: 'text-yellow-500',
              complete: 'text-green-500'
            };

            return (
              <button
                key={chapter.id}
                onClick={() => onChapterChange(chapter.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      chapter.completion_status === 'complete' ? 'bg-green-500' :
                      chapter.completion_status === 'partial' ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <div className="text-sm font-medium">
                        {chapter.id}. {chapter.title}
                      </div>
                      <div className={`text-xs ${completionColor[chapter.completion_status || 'empty']}`}>
                        {chapter.completion_status === 'complete' ? 'Completo' :
                         chapter.completion_status === 'partial' ? 'Parcial' : 'Vazio'}
                      </div>
                    </div>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function ChapterContent({ chapter }: { chapter: BrandManualChapter }) {
  // Função para formatar tamanho de arquivo
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderContent = () => {
    if (chapter.completion_status === 'empty') {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Capítulo em Branco</h3>
          <p className="text-gray-600 mb-4">
            Este capítulo ainda não foi preenchido com informações.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Editar Capítulo
          </button>
        </div>
      );
    }

    const content = chapter.content as any;

    // Capítulo 01 - Visão & Essência
    if (chapter.id === '01') {
      return (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Propósito da Marca</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-900">
                {content.purpose}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Manifesto</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-gray-800 italic">
                "{content.manifesto}"
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Adjetivos da Personalidade</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {content.personality_adjectives?.map((adj: string, index: number) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <span className="text-orange-800 font-medium capitalize">{adj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Capítulo 02 - Sistema de Logotipo
    if (chapter.id === '02') {
      return (
        <div className="space-y-8">
          {/* Logos Carregados */}
          {content.uploaded_logos && content.uploaded_logos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📁 Logotipos Disponíveis
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {content.uploaded_logos.length}
                </span>
              </h3>
              
              {/* Lista de Logos estilo edição */}
              <div className="space-y-4">
                {content.uploaded_logos.map((logo: any, index: number) => {
                  const logoVersionLabels: Record<string, string> = {
                    principal_colorida: 'Principal Colorida',
                    monocromatica_preta: 'Monocromática Preta',
                    monocromatica_branca: 'Monocromática Branca',
                    escala_cinza: 'Escala de Cinza'
                  };

                  const getFileTypeIcon = (format: string) => {
                    const type = format?.toLowerCase();
                    if (type === 'svg') return '🎨';
                    if (type === 'png' || type === 'jpg' || type === 'jpeg') return '🖼️';
                    if (type === 'pdf') return '📄';
                    return '📁';
                  };

                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        {/* Informações do Logo */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{getFileTypeIcon(logo.format)}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {logoVersionLabels[logo.version] || logo.version.replace(/_/g, ' ')}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{logo.file_name}</span>
                                <span>{formatFileSize(logo.size_bytes)}</span>
                                <span className="uppercase bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {logo.format}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Preview do Logo */}
                          {logo.file_url && (
                            <div className="mb-3">
                              <div className="relative w-full max-w-xs">
                                {logo.format === 'SVG' || logo.format === 'PNG' || logo.format === 'JPG' || logo.format === 'JPEG' ? (
                                  <img
                                    src={logo.file_url}
                                    alt={`Logo ${logoVersionLabels[logo.version] || logo.version}`}
                                    className="h-20 w-auto max-w-full border border-gray-200 rounded-lg object-contain bg-gray-50 p-2"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <div className="h-20 w-32 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                                    <div className="text-center text-gray-400">
                                      <div className="text-lg mb-1">📄</div>
                                      <div className="text-xs">Preview não disponível</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Notas de Aplicação */}
                          {logo.application_notes && (
                            <div className="mb-3">
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="text-sm font-medium text-yellow-800 mb-1">
                                  📝 Notas de Aplicação
                                </div>
                                <p className="text-sm text-yellow-700">
                                  {logo.application_notes}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Data de Upload */}
                          {logo.uploaded_at && (
                            <p className="text-xs text-gray-400">
                              📅 Adicionado em {new Date(logo.uploaded_at).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>

                        {/* Ações de Visualização */}
                        <div className="flex flex-col gap-2 ml-4">
                          {logo.file_url && (
                            <>
                              <button 
                                onClick={() => window.open(logo.file_url, '_blank')}
                                className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                                title="Baixar arquivo"
                              >
                                ⬇️ Download
                              </button>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(logo.file_url);
                                  // Feedback visual simples
                                  const btn = event?.target as HTMLButtonElement;
                                  const originalText = btn.innerHTML;
                                  btn.innerHTML = '✓ Copiado!';
                                  setTimeout(() => btn.innerHTML = originalText, 2000);
                                }}
                                className="px-3 py-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors flex items-center gap-1"
                                title="Copiar link"
                              >
                                📋 Copiar
                              </button>
                              <button 
                                onClick={() => window.open(logo.file_url, '_blank')}
                                className="px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                                title="Visualizar em nova aba"
                              >
                                👁️ Ver
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Estatísticas dos Logos - Design aprimorado */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  📊 Resumo dos Assets
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl">📁</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{content.uploaded_logos.length}</div>
                    <div className="text-sm text-gray-600">Total de Logos</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl">🎨</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {new Set(content.uploaded_logos.map((logo: any) => logo.format)).size}
                    </div>
                    <div className="text-sm text-gray-600">Formatos</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl">🔄</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(content.uploaded_logos.map((logo: any) => logo.version)).size}
                    </div>
                    <div className="text-sm text-gray-600">Versões</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl">💾</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatFileSize(content.uploaded_logos.reduce((total: number, logo: any) => total + logo.size_bytes, 0))}
                    </div>
                    <div className="text-sm text-gray-600">Tamanho Total</div>
                  </div>
                </div>
                
                {/* Informações adicionais */}
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Array.from(new Set(content.uploaded_logos.map((logo: any) => logo.format))).map((format: any) => (
                      <span key={format} className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs border border-gray-200">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ⚠️ O que NÃO fazer
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.donts?.map((dont: string, index: number) => {
                const dontIcons: Record<string, string> = {
                  'distorcer': '🚫',
                  'rotacionar': '🔄',
                  'alterar_cores': '🎨',
                  'sobrepor_elementos': '📄',
                  'redimensionar_incorretamente': '📏',
                  'usar_fundo_inadequado': '🎭'
                };
                
                const dontLabels: Record<string, string> = {
                  'distorcer': 'Distorcer proporções',
                  'rotacionar': 'Rotacionar ou inclinar',
                  'alterar_cores': 'Alterar cores',
                  'sobrepor_elementos': 'Sobrepor elementos',
                  'redimensionar_incorretamente': 'Redimensionar incorretamente',
                  'usar_fundo_inadequado': 'Usar fundo inadequado'
                };
                
                const icon = dontIcons[dont] || '❌';
                const label = dontLabels[dont] || dont.replace(/_/g, ' ');
                
                return (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 text-center hover:bg-red-100 transition-colors">
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="text-red-800 text-sm font-medium capitalize">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {(!content.donts || content.donts.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">✅</div>
                <p className="text-sm">Nenhuma restrição definida ainda.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Capítulo 03 - Paleta de Cores
    if (chapter.id === '03') {
      return (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Cor Primária</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-lg border border-gray-300"
                  style={{ backgroundColor: content.primary?.hex }}
                ></div>
                <div>
                  <div className="font-medium">{content.primary?.name}</div>
                  <div className="text-gray-600">{content.primary?.hex}</div>
                  <div className="text-sm text-gray-500">Uso mínimo: {content.primary?.usage_min_percent}%</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Cores de Suporte</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {content.support?.map((color: any, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <div 
                    className="w-full h-12 rounded-lg border border-gray-300 mb-2"
                    style={{ backgroundColor: color.hex }}
                  ></div>
                  <div className="font-medium text-sm">{color.name}</div>
                  <div className="text-xs text-gray-600">{color.hex}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Modo Escuro</h3>
            <div className="bg-gray-900 rounded-lg p-4 text-white">
              <div className="flex gap-4">
                <div>
                  <span className="text-sm opacity-75">Background:</span>
                  <div className="font-mono">{content.dark_mode?.background}</div>
                </div>
                <div>
                  <span className="text-sm opacity-75">Text:</span>
                  <div className="font-mono">{content.dark_mode?.text}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Capítulo 04 - Tipografia
    if (chapter.id === '04') {
      return (
        <div className="space-y-8">
          {/* Demonstração das fontes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Fonte Primária: {content.primary_font}</h3>
              <div style={{ 
                fontFamily: `${content.primary_font}, ${content.fallbacks?.join(', ') || 'sans-serif'}`,
                lineHeight: content.line_height || 1.4,
                letterSpacing: content.letter_spacing || 'normal'
              }}>
                <div style={{ fontSize: `${content.scale_rem?.h1 || 2.25}rem`, fontWeight: 'bold' }} className="mb-3">
                  Título Principal
                </div>
                <div style={{ fontSize: `${content.scale_rem?.h2 || 1.75}rem`, fontWeight: '600' }} className="mb-3">
                  Subtítulo
                </div>
                <div style={{ fontSize: `${content.scale_rem?.h3 || 1.5}rem`, fontWeight: '500' }}>
                  Seção
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Fonte Secundária: {content.secondary_font}</h3>
              <div style={{ 
                fontFamily: `${content.secondary_font}, ${content.fallbacks?.join(', ') || 'sans-serif'}`,
                lineHeight: content.line_height || 1.4,
                letterSpacing: content.letter_spacing || 'normal'
              }}>
                <div style={{ fontSize: `${content.scale_rem?.body || 1}rem` }} className="mb-3">
                  Este é um parágrafo de exemplo usando a fonte secundária. 
                  Ideal para textos corridos e conteúdo de leitura.
                </div>
                <div style={{ fontSize: `${content.scale_rem?.caption || 0.875}rem`, color: '#666' }}>
                  Texto de legenda ou informações secundárias
                </div>
              </div>
            </div>
          </div>

          {/* Hierarquia Tipográfica Completa */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hierarquia Tipográfica Completa</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="space-y-4" style={{ 
                lineHeight: content.line_height || 1.4,
                letterSpacing: content.letter_spacing || 'normal'
              }}>
                <div style={{ 
                  fontSize: `${content.scale_rem?.h1 || 2.25}rem`, 
                  fontWeight: 'bold',
                  fontFamily: `${content.primary_font}, ${content.fallbacks?.join(', ') || 'sans-serif'}`
                }}>
                  H1 - Título Principal ({content.scale_rem?.h1 || 2.25}rem / {((content.scale_rem?.h1 || 2.25) * 16).toFixed(0)}px)
                </div>
                <div style={{ 
                  fontSize: `${content.scale_rem?.h2 || 1.75}rem`, 
                  fontWeight: '600',
                  fontFamily: `${content.primary_font}, ${content.fallbacks?.join(', ') || 'sans-serif'}`
                }}>
                  H2 - Título Secundário ({content.scale_rem?.h2 || 1.75}rem / {((content.scale_rem?.h2 || 1.75) * 16).toFixed(0)}px)
                </div>
                <div style={{ 
                  fontSize: `${content.scale_rem?.h3 || 1.5}rem`, 
                  fontWeight: '500',
                  fontFamily: `${content.primary_font}, ${content.fallbacks?.join(', ') || 'sans-serif'}`
                }}>
                  H3 - Título de Seção ({content.scale_rem?.h3 || 1.5}rem / {((content.scale_rem?.h3 || 1.5) * 16).toFixed(0)}px)
                </div>
                <div style={{ 
                  fontSize: `${content.scale_rem?.body || 1}rem`,
                  fontFamily: `${content.secondary_font}, ${content.fallbacks?.join(', ') || 'sans-serif'}`
                }}>
                  Body - Texto do corpo principal. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  ({content.scale_rem?.body || 1}rem / {((content.scale_rem?.body || 1) * 16).toFixed(0)}px)
                </div>
                <div style={{ 
                  fontSize: `${content.scale_rem?.caption || 0.875}rem`, 
                  color: '#666',
                  fontFamily: `${content.secondary_font}, ${content.fallbacks?.join(', ') || 'sans-serif'}`
                }}>
                  Caption - Legendas e informações secundárias ({content.scale_rem?.caption || 0.875}rem / {((content.scale_rem?.caption || 0.875) * 16).toFixed(0)}px)
                </div>
              </div>

              {/* Informações sobre fallbacks */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Cadeia de Fallbacks:</strong> {content.primary_font} → {content.secondary_font} → {content.fallbacks?.join(' → ') || 'sans-serif'} → sans-serif
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Linha de altura: {content.line_height || 1.4} | Espaçamento: {content.letter_spacing || 'normal'}
                </p>
              </div>
            </div>
          </div>

          {/* Especificações Técnicas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Especificações Técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="font-medium mb-3 text-gray-900">Fontes Principais</div>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Primária:</span>
                    <div style={{ fontFamily: content.primary_font }} className="text-gray-600 mt-1">
                      {content.primary_font}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Secundária:</span>
                    <div style={{ fontFamily: content.secondary_font }} className="text-gray-600 mt-1">
                      {content.secondary_font}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="font-medium mb-3 text-gray-900">Fontes de Fallback</div>
                <div className="text-sm space-y-1">
                  {content.fallbacks?.map((fallback: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-blue-100 text-blue-600 text-xs rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </span>
                      <span style={{ fontFamily: fallback }} className="text-gray-600">
                        {fallback}
                      </span>
                    </div>
                  )) || <span className="text-gray-500">Nenhuma fonte de fallback definida</span>}
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="font-medium mb-3 text-gray-900">Configurações</div>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Altura da Linha:</span>
                    <div className="text-gray-600">{content.line_height || 1.4}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Espaçamento:</span>
                    <div className="text-gray-600">{content.letter_spacing || 'normal'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Capítulo 05 - Grid & Layout Digital
    if (chapter.id === '05') {
      return (
        <div className="space-y-8">
          {/* Grid Configuration */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🔲 Sistema de Grid</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  🖥️ Desktop
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{content.grids?.desktop || 12}</div>
                  <div className="text-sm text-gray-600">colunas</div>
                  <div className="mt-3">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${content.grids?.desktop || 12}, 1fr)` }}>
                      {Array.from({ length: content.grids?.desktop || 12 }).map((_, i) => (
                        <div key={i} className="bg-blue-100 border border-blue-200 h-4 rounded-sm"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  📱 Tablet
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">{content.grids?.tablet || 8}</div>
                  <div className="text-sm text-gray-600">colunas</div>
                  <div className="mt-3">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${content.grids?.tablet || 8}, 1fr)` }}>
                      {Array.from({ length: content.grids?.tablet || 8 }).map((_, i) => (
                        <div key={i} className="bg-green-100 border border-green-200 h-4 rounded-sm"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  📱 Mobile
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{content.grids?.mobile || 4}</div>
                  <div className="text-sm text-gray-600">colunas</div>
                  <div className="mt-3">
                    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${content.grids?.mobile || 4}, 1fr)` }}>
                      {Array.from({ length: content.grids?.mobile || 4 }).map((_, i) => (
                        <div key={i} className="bg-orange-100 border border-orange-200 h-4 rounded-sm"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakpoints */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📐 Breakpoints Responsivos</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(content.breakpoints_px || { sm: 640, md: 768, lg: 1024, xl: 1280 }).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 uppercase">{key}</div>
                    <div className="text-2xl font-bold text-blue-600">{value as number}px</div>
                    <div className="text-sm text-gray-600">e acima</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Escala Visual:</h4>
                <div className="space-y-2">
                  {Object.entries(content.breakpoints_px || { sm: 640, md: 768, lg: 1024, xl: 1280 }).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="w-8 text-sm font-medium uppercase">{key}</span>
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${Math.min((value as number) / 1280 * 100, 100)}%` }}
                      >
                        {value as number}px
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Spacing Tokens */}
          <div>
            <h3 className="text-lg font-semibold mb-4">📏 Tokens de Espaçamento</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {(content.spacing_tokens_px || [4, 8, 16, 24, 32, 40]).sort((a: number, b: number) => a - b).map((token: number, index: number) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{token}px</div>
                    <div className="text-sm text-gray-600">{(token / 16).toFixed(2)}rem</div>
                    <div className="mt-3 flex justify-center">
                      <div 
                        className="bg-purple-200 border border-purple-300 rounded"
                        style={{ 
                          width: Math.min(token, 60), 
                          height: Math.max(token / 8, 4)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Aplicação Prática:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium w-20">Micro:</span>
                    <div className="flex gap-1">
                      {(content.spacing_tokens_px || [4, 8, 16, 24, 32, 40]).filter((t: number) => t <= 8).map((token: number, i: number) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">{token}px</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">Bordas, ícones pequenos</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium w-20">Pequeno:</span>
                    <div className="flex gap-1">
                      {(content.spacing_tokens_px || [4, 8, 16, 24, 32, 40]).filter((t: number) => t > 8 && t <= 16).map((token: number, i: number) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">{token}px</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">Entre elementos próximos</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium w-20">Médio:</span>
                    <div className="flex gap-1">
                      {(content.spacing_tokens_px || [4, 8, 16, 24, 32, 40]).filter((t: number) => t > 16 && t <= 32).map((token: number, i: number) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">{token}px</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">Entre seções de componentes</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium w-20">Grande:</span>
                    <div className="flex gap-1">
                      {(content.spacing_tokens_px || [4, 8, 16, 24, 32, 40]).filter((t: number) => t > 32).map((token: number, i: number) => (
                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">{token}px</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">Entre seções de página</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Examples */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🎨 Exemplos de Layout</h3>
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-3">Layout Desktop ({content.grids?.desktop || 12} colunas)</h4>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${content.grids?.desktop || 12}, 1fr)` }}>
                  <div className="col-span-3 bg-blue-100 border border-blue-200 p-3 rounded text-center text-sm">
                    Sidebar
                    <div className="text-xs text-gray-600">3 colunas</div>
                  </div>
                  <div className="col-span-9 bg-green-100 border border-green-200 p-3 rounded text-center text-sm">
                    Conteúdo Principal
                    <div className="text-xs text-gray-600">9 colunas</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-3">Layout Tablet ({content.grids?.tablet || 8} colunas)</h4>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${content.grids?.tablet || 8}, 1fr)` }}>
                  <div className="col-span-2 bg-blue-100 border border-blue-200 p-3 rounded text-center text-sm">
                    Nav
                    <div className="text-xs text-gray-600">2 cols</div>
                  </div>
                  <div className="col-span-6 bg-green-100 border border-green-200 p-3 rounded text-center text-sm">
                    Conteúdo
                    <div className="text-xs text-gray-600">6 cols</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-3">Layout Mobile ({content.grids?.mobile || 4} colunas)</h4>
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${content.grids?.mobile || 4}, 1fr)` }}>
                  <div className="col-span-4 bg-green-100 border border-green-200 p-3 rounded text-center text-sm">
                    Conteúdo Full Width
                    <div className="text-xs text-gray-600">4 colunas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Capítulo 10 - Tom de Voz
    if (chapter.id === '10') {
      return (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Pilares da Comunicação</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {content.pillars?.map((pilar: string, index: number) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <span className="text-orange-800 font-medium capitalize">{pilar}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Exemplos de Aplicação</h3>
            <div className="space-y-4">
              {Object.entries(content.examples || {}).map(([type, example]) => (
                <div key={type} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="font-medium mb-2 capitalize">{type.replace(/_/g, ' ')}</div>
                  <div className="text-gray-700 italic">"{String(example)}"</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-700">Palavras Preferidas</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {content.preferred_words?.map((word: string, index: number) => (
                    <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-700">Palavras a Evitar</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {content.avoid_words?.map((word: string, index: number) => (
                    <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Renderização genérica para outros capítulos
    return (
      <div className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{chapter.title}</h3>
          <p className="text-gray-600 mb-6">{chapter.objective}</p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header do capítulo */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Capítulo {chapter.id}</span>
              <span>•</span>
              <span>{chapter.completion_status === 'complete' ? 'Completo' :
                     chapter.completion_status === 'partial' ? 'Parcial' : 'Vazio'}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{chapter.title}</h1>
            <p className="text-lg text-gray-600">{chapter.objective}</p>
          </div>

          {/* Conteúdo */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function ManualViewer({ params }: ManualViewerProps) {
  const { fetchManual, currentManual, loading, error, generateShareLink } = useBrandManual();
  const [activeChapter, setActiveChapter] = useState('01');
  const [isPublicView, setIsPublicView] = useState(false);

  useEffect(() => {
    fetchManual(params.id);
  }, [params.id, fetchManual]);

  const handleShare = async () => {
    const shareLink = await generateShareLink(params.id);
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      alert('Link de compartilhamento copiado!');
    }
  };

  const handleDownload = () => {
    // Implementar download do PDF
    alert('Download do PDF será implementado em breve!');
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
            O manual solicitado não foi encontrado ou você não tem permissão para visualizá-lo.
          </p>
          <Link href="/manual-marca" className="text-blue-600 hover:text-blue-700">
            ← Voltar aos manuais
          </Link>
        </div>
      </div>
    );
  }

  const currentChapter = currentManual.manual_data.chapters.find(
    chapter => chapter.id === activeChapter
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/manual-marca" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentManual.brand_name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {currentManual.manual_data.metadata.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(currentManual.updated_at).toLocaleDateString('pt-BR')}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  v{currentManual.version}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPublicView(!isPublicView)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              {isPublicView ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPublicView ? 'Visão Privada' : 'Visão Pública'}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Share className="w-4 h-4" />
              Compartilhar
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>

            {!isPublicView && (
              <Link
                href={`/manual-marca/${params.id}/editar`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex">
        <ChapterNavigation
          chapters={currentManual.manual_data.chapters}
          activeChapter={activeChapter}
          onChapterChange={setActiveChapter}
        />
        
        {currentChapter && <ChapterContent chapter={currentChapter} />}
      </div>
    </div>
  );
}
