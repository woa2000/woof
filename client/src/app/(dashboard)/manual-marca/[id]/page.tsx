// @ts-nocheck - TODO: corrigir tipagem Next.js 15 para páginas dinâmicas
'use client';

import React, { useState, useEffect, use } from 'react';
import { ArrowLeft, Download, Share, Edit, Eye, EyeOff, ChevronRight, Clock, User, Globe } from 'lucide-react';
import Link from 'next/link';
import { useBrandManual } from '@/hooks/features/useBrandManual';
import { BrandManual, BrandManualChapter } from '@/lib/utils/brand-manual-types';
import AssetManagementVisualizer from '@/components/brand-manual/AssetManagementVisualizer';

interface ManualViewerProps {
  params: Promise<{
    id: string;
  }>;
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

    // Debug para verificar qual capítulo está sendo renderizado
    console.log('Renderizando capítulo:', chapter.id, chapter.title);

    // ⭐ CAPÍTULO 09 - IMPLEMENTAÇÃO PRIORITÁRIA ⭐
    if (chapter.id === '09') {
      console.log('✅ CAPÍTULO 09 - RENDERIZAÇÃO RICA ATIVADA!');
      return (
        <div className="space-y-8">
          {/* Tamanhos Padrão IAB */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📐 Tamanhos Padrão IAB
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.iab_standard_sizes?.map((size: any, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-1">{size.name}</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {size.dimensions[0]} × {size.dimensions[1]}px
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{size.usage}</div>
                  </div>
                  
                  {/* Preview visual do tamanho */}
                  <div className="mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-center">
                      <div 
                        className="bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-300 rounded flex items-center justify-center text-orange-700 text-xs font-medium"
                        style={{
                          width: Math.min(size.dimensions[0] / 4, 180),
                          height: Math.min(size.dimensions[1] / 4, 120),
                          minWidth: '60px',
                          minHeight: '30px'
                        }}
                      >
                        {size.name}
                      </div>
                    </div>
                  </div>

                  {/* Plataformas */}
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">Plataformas:</div>
                    <div className="flex flex-wrap gap-1">
                      {size.platforms?.map((platform: string, idx: number) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notas */}
                  {size.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="text-xs font-medium text-yellow-800 mb-1">💡 Dica</div>
                      <p className="text-xs text-yellow-700">{size.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Especificações de Redes Sociais */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📱 Especificações para Redes Sociais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(content.social_media_specs || {}).map(([platform, specs]: [string, any]) => (
                <div key={platform} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">
                        {platform === 'instagram' ? '📷' : 
                         platform === 'facebook' ? '👥' : 
                         platform === 'linkedin' ? '💼' : '📱'}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 capitalize">{platform}</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(specs).map(([format, size]: [string, any]) => (
                      <div key={format} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {format.replace(/_/g, ' ')}
                          </div>
                          <div className="text-xs text-gray-600">{size}</div>
                        </div>
                        <div className="text-sm font-mono text-purple-600">{size}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Princípios de Design */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🎨 Princípios de Design
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aplicação da Marca */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  🏷️ Aplicação da Marca
                </h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(content.design_principles?.brand_application || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex flex-col">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-gray-600 mt-1">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  🎯 Call to Action
                </h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(content.design_principles?.call_to_action || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex flex-col">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-gray-600 mt-1">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Checklist de Aprovação */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ✅ Checklist de Aprovação
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.approval_checklist?.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 capitalize">
                      {item.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> Use este checklist antes de enviar qualquer banner para aprovação. 
                  Isso reduzirá significativamente o tempo de revisão e retrabalho.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

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

    // Capítulo 06 - Ícones & Ilustrações
    if (chapter.id === '06') {
      return (
        <div className="space-y-8">
          {/* Motivos Permitidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🎨 Motivos Permitidos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {content.allowed_motifs?.map((motif: string, index: number) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">
                    {motif === 'patas' ? '🐾' : 
                     motif === 'coleiras' ? '🔗' : 
                     motif === 'ossos' ? '🦴' : 
                     motif === 'coração' ? '❤️' : '🎯'}
                  </div>
                  <span className="text-blue-800 font-medium capitalize">{motif}</span>
                </div>
              ))}
            </div>
            
            {(!content.allowed_motifs || content.allowed_motifs.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">🎨</div>
                <p className="text-sm">Nenhum motivo definido ainda.</p>
              </div>
            )}
          </div>

          {/* Configurações de Estilo */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ⚙️ Configurações de Estilo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">✏️</span>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {content.stroke_width_px || 2}px
                </div>
                <div className="text-sm text-gray-600">Largura do Traço</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📐</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {content.corner_radius_px || 4}px
                </div>
                <div className="text-sm text-gray-600">Raio dos Cantos</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">{content.palette_restricted ? '🔒' : '🔓'}</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {content.palette_restricted ? 'Sim' : 'Não'}
                </div>
                <div className="text-sm text-gray-600">Paleta Restrita</div>
              </div>

              {content.icon_repository && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">📁</span>
                  </div>
                  <div className="text-sm font-bold text-orange-600 mb-1">
                    Repositório
                  </div>
                  <a 
                    href={content.icon_repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {content.icon_repository.replace('https://', '').replace('http://', '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Preview Visual */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              👁️ Preview Visual
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Exemplo de ícone com traço */}
                <div className="text-center">
                  <h4 className="font-medium mb-3">Estilo de Traço</h4>
                  <div className="bg-gray-50 rounded-lg p-4 mb-2">
                    <svg 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth={content.stroke_width_px || 2}
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="mx-auto text-gray-700"
                    >
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">
                    Traço: {content.stroke_width_px || 2}px
                  </p>
                </div>

                {/* Exemplo de forma com cantos */}
                <div className="text-center">
                  <h4 className="font-medium mb-3">Raio dos Cantos</h4>
                  <div className="bg-gray-50 rounded-lg p-4 mb-2">
                    <div 
                      className="w-12 h-12 bg-blue-200 border-2 border-blue-400 mx-auto"
                      style={{ borderRadius: `${content.corner_radius_px || 4}px` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Raio: {content.corner_radius_px || 4}px
                  </p>
                </div>

                {/* Status da paleta */}
                <div className="text-center">
                  <h4 className="font-medium mb-3">Restrição de Paleta</h4>
                  <div className="bg-gray-50 rounded-lg p-4 mb-2">
                    <div className="text-3xl">
                      {content.palette_restricted ? '🔒' : '🎨'}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {content.palette_restricted ? 'Apenas cores da marca' : 'Cores livres'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Capítulo 07 - Tom de Voz Digital
    if (chapter.id === '07') {
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

    // Capítulo 08 - Social Media Toolkit
    if (chapter.id === '08') {
      return (
        <div className="space-y-8">
          {/* Templates de Redes Sociais */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📱 Templates de Redes Sociais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feed Post */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="relative w-full aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mb-3 overflow-hidden">
                  <div className="absolute inset-4 border-2 border-dashed border-orange-400 rounded flex items-center justify-center">
                    <div className="text-center text-orange-700">
                      <div className="text-2xl mb-2">📷</div>
                      <div className="text-sm font-medium">Área Segura</div>
                      <div className="text-xs">{100 - content.safe_margins_percent}% da área</div>
                    </div>
                  </div>
                </div>
                <h4 className="font-medium mb-1">Feed Post</h4>
                <p className="text-sm text-gray-600">{content.templates.feed}</p>
              </div>
              
              {/* Stories */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="relative w-full aspect-[9/16] bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 overflow-hidden max-h-48">
                  <div className="absolute inset-4 border-2 border-dashed border-blue-400 rounded flex items-center justify-center">
                    <div className="text-center text-blue-700">
                      <div className="text-xl mb-1">📱</div>
                      <div className="text-xs font-medium">Stories</div>
                    </div>
                  </div>
                </div>
                <h4 className="font-medium mb-1">Stories</h4>
                <p className="text-sm text-gray-600">{content.templates.story}</p>
              </div>
              
              {/* Reel Cover */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="relative w-full aspect-[9/16] bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-3 overflow-hidden max-h-48">
                  <div className="absolute inset-4 border-2 border-dashed border-purple-400 rounded flex items-center justify-center">
                    <div className="text-center text-purple-700">
                      <div className="text-xl mb-1">🎬</div>
                      <div className="text-xs font-medium">Reel Cover</div>
                    </div>
                  </div>
                </div>
                <h4 className="font-medium mb-1">Reel Cover</h4>
                <p className="text-sm text-gray-600">{content.templates.reel_cover}</p>
              </div>
            </div>
          </div>

          {/* Regras de Hashtags */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              #️⃣ Regras de Hashtags
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🔢</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Máximo por Post</h4>
                    <p className="text-2xl font-bold text-blue-600">{content.hashtag_rules.max_per_post}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Hashtags por publicação para melhor engajamento</p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🏷️</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Tag da Marca</h4>
                    <p className="text-lg font-bold text-orange-600 font-mono">{content.hashtag_rules.brand_tag}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Hashtag oficial da marca para identificação</p>
              </div>
            </div>
          </div>

          {/* Safe Margins */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🛡️ Margens de Segurança
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">Margem de Segurança</h4>
                  <p className="text-sm text-gray-600">Área protegida em todos os templates</p>
                </div>
                <div className="text-3xl font-bold text-green-600">{content.safe_margins_percent}%</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Por que usar:</strong> Evita que texto e elementos importantes sejam cortados por avatars, 
                  botões de interface ou diferentes crops entre plataformas.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Capítulo 09 - Banners & Ads Digitais
    if (chapter.id === '09') {
      return (
        <div className="space-y-8">
          {/* Tamanhos Padrão IAB */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📐 Tamanhos Padrão IAB
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.iab_standard_sizes?.map((size: any, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-1">{size.name}</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {size.dimensions[0]} × {size.dimensions[1]}px
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{size.usage}</div>
                  </div>
                  
                  {/* Preview visual do tamanho */}
                  <div className="mb-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-center">
                      <div 
                        className="bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-300 rounded flex items-center justify-center text-orange-700 text-xs font-medium"
                        style={{
                          width: Math.min(size.dimensions[0] / 4, 180),
                          height: Math.min(size.dimensions[1] / 4, 120),
                          minWidth: '60px',
                          minHeight: '30px'
                        }}
                      >
                        {size.name}
                      </div>
                    </div>
                  </div>

                  {/* Plataformas */}
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-700 mb-2">Plataformas:</div>
                    <div className="flex flex-wrap gap-1">
                      {size.platforms?.map((platform: string, idx: number) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notas */}
                  {size.notes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="text-xs font-medium text-yellow-800 mb-1">💡 Dica</div>
                      <p className="text-xs text-yellow-700">{size.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Especificações de Redes Sociais */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📱 Especificações para Redes Sociais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(content.social_media_specs || {}).map(([platform, specs]: [string, any]) => (
                <div key={platform} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">
                        {platform === 'instagram' ? '📷' : 
                         platform === 'facebook' ? '👥' : 
                         platform === 'linkedin' ? '💼' : '📱'}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 capitalize">{platform}</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {Object.entries(specs).map(([format, size]: [string, any]) => (
                      <div key={format} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {format.replace(/_/g, ' ')}
                          </div>
                          <div className="text-xs text-gray-600">{size}</div>
                        </div>
                        <div className="text-sm font-mono text-purple-600">{size}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diretrizes de Design */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🎨 Diretrizes de Design
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aplicação da Marca */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  🏷️ Aplicação da Marca
                </h4>
                <div className="space-y-3">
                  {Object.entries(content.design_principles?.brand_application || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between items-start">
                      <span className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-sm font-medium text-gray-900 text-right ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  🎯 Call to Action
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Posição:</span>
                    <span className="text-sm font-medium text-gray-900 text-right ml-2">
                      {content.design_principles?.call_to_action?.position}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Estilo:</span>
                    <span className="text-sm font-medium text-gray-900 text-right ml-2">
                      {content.design_principles?.call_to_action?.style}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Exemplos de texto:</div>
                    <div className="flex flex-wrap gap-2">
                      {content.design_principles?.call_to_action?.text_examples?.map((text: string, idx: number) => (
                        <span key={idx} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                          {text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Especificações de Arquivo */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📄 Especificações de Arquivo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Anúncios Estáticos */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  🖼️ Anúncios Estáticos
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Formatos:</span>
                    <div className="flex gap-1">
                      {content.file_specifications?.static_ads?.formats?.map((format: string, idx: number) => (
                        <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tamanho máximo:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {content.file_specifications?.static_ads?.max_file_size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Resolução:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {content.file_specifications?.static_ads?.resolution}
                    </span>
                  </div>
                </div>
              </div>

              {/* Anúncios Animados */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  🎬 Anúncios Animados
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-600">Formatos:</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {content.file_specifications?.animated_ads?.formats?.map((format: string, idx: number) => (
                        <span key={idx} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duração máxima:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {content.file_specifications?.animated_ads?.duration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Loop:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {content.file_specifications?.animated_ads?.loop}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines por Plataforma */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🌐 Guidelines por Plataforma
            </h3>
            <div className="space-y-4">
              {Object.entries(content.platform_guidelines || {}).map(([platform, guidelines]: [string, any]) => (
                <div key={platform} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium mb-4 capitalize flex items-center gap-2">
                    {platform === 'google_ads' ? '🔍 Google Ads' :
                     platform === 'facebook_instagram' ? '📱 Facebook & Instagram' :
                     platform === 'linkedin' ? '💼 LinkedIn' : platform.replace(/_/g, ' ')}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">Text Overlay</div>
                      <div className="text-sm text-gray-900">{guidelines.text_overlay}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">Safe Area</div>
                      <div className="text-sm text-gray-900">{guidelines.safe_area}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">Aprovação</div>
                      <div className="text-sm text-gray-900">{guidelines.approval_time}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">Restrições</div>
                      <div className="text-sm text-gray-900">{guidelines.restrictions?.length || 0} regras</div>
                    </div>
                  </div>
                  
                  {guidelines.restrictions && guidelines.restrictions.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">⚠️ Restrições:</div>
                      <div className="flex flex-wrap gap-2">
                        {guidelines.restrictions.map((restriction: string, idx: number) => (
                          <span key={idx} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                            {restriction}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Checklist de Aprovação */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ✅ Checklist de Aprovação
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.approval_checklist?.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 capitalize">
                      {item.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> Use este checklist antes de enviar qualquer banner para aprovação. 
                  Isso reduzirá significativamente o tempo de revisão e retrabalho.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Capítulo 09 - Banners & Ads Digitais
    if (chapter.id === '09') {
      return (
        <div className="space-y-8">
          {/* Tamanhos Padrão IAB */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📐 Tamanhos Padrão IAB
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.iab_standard_sizes?.map((size: any, index: number) => {
                const [width, height] = size.dimensions;
                const aspectRatio = width / height;
                const previewWidth = Math.min(width / 4, 200);
                const previewHeight = previewWidth / aspectRatio;

                return (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="text-center mb-4">
                      <div 
                        className="bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-dashed border-orange-300 rounded-lg mx-auto flex items-center justify-center"
                        style={{ 
                          width: `${previewWidth}px`, 
                          height: `${previewHeight}px`,
                          minHeight: '60px'
                        }}
                      >
                        <div className="text-center text-orange-700">
                          <div className="text-xs font-medium">{size.name}</div>
                          <div className="text-xs">{width} × {height}</div>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{size.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Tamanho:</strong> {width} × {height}px</div>
                      <div><strong>Uso:</strong> {size.usage}</div>
                      <div><strong>Plataformas:</strong> {size.platforms.join(', ')}</div>
                      {size.notes && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                          💡 {size.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Especificações por Rede Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📱 Especificações por Rede Social
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(content.social_media_specs || {}).map(([platform, specs]: [string, any]) => (
                <div key={platform} className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 capitalize flex items-center gap-2">
                    {platform === 'instagram' ? '📷' : platform === 'facebook' ? '📘' : platform === 'linkedin' ? '💼' : '📱'}
                    {platform}
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(specs).map(([format, size]: [string, any]) => (
                      <div key={format} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 capitalize">{format.replace(/_/g, ' ')}</span>
                        <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded text-xs">
                          {size}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Princípios de Design */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🎨 Princípios de Design
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aplicação da Marca */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  🏷️ Aplicação da Marca
                </h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(content.design_principles?.brand_application || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex flex-col">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-gray-600 mt-1">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tipografia */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  ✏️ Tipografia
                </h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(content.design_principles?.typography || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex flex-col">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-gray-600 mt-1">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uso de Cores */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  🎭 Uso de Cores
                </h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(content.design_principles?.color_usage || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex flex-col">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-gray-600 mt-1">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  🎯 Call to Action
                </h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(content.design_principles?.call_to_action || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex flex-col">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-gray-600 mt-1">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Especificações Técnicas de Arquivo */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ⚙️ Especificações Técnicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Anúncios Estáticos */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  🖼️ Anúncios Estáticos
                </h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(content.file_specifications?.static_ads || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-gray-600">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anúncios Animados */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  🎬 Anúncios Animados
                </h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(content.file_specifications?.animated_ads || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-gray-600">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines por Plataforma */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🌐 Guidelines por Plataforma
            </h3>
            <div className="space-y-6">
              {Object.entries(content.platform_guidelines || {}).map(([platform, guidelines]: [string, any]) => (
                <div key={platform} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4 capitalize flex items-center gap-2">
                    {platform === 'google_ads' ? '🔍' : platform === 'facebook_instagram' ? '📱' : platform === 'linkedin' ? '💼' : '🌐'}
                    {platform.replace(/_/g, ' ')}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(guidelines).map(([key, value]: [string, any]) => (
                      <div key={key} className="space-y-2">
                        <span className="text-sm font-medium text-gray-700 capitalize block">
                          {key.replace(/_/g, ' ')}
                        </span>
                        {Array.isArray(value) ? (
                          <ul className="text-sm text-gray-600 space-y-1">
                            {value.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-red-500 text-xs mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-sm text-gray-600 block">{value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist de Aprovação */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ✅ Checklist de Aprovação
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.approval_checklist?.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 capitalize">
                      {item.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> Use este checklist antes de enviar qualquer banner para aprovação. 
                  Isso reduzirá significativamente o tempo de revisão e retrabalho.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ⭐ CAPÍTULO 10 - GESTÃO DE ATIVOS & NOMENCLATURA ⭐
    if (chapter.id === '10') {
      console.log('✅ CAPÍTULO 10 - RENDERIZAÇÃO RICA ATIVADA!');
      return (
        <div className="space-y-8">
          <AssetManagementVisualizer data={content} />
        </div>
      );
    }

    // Renderização genérica para outros capítulos
    console.log('🚨 Caindo na renderização genérica para capítulo:', chapter.id);
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
  const { id } = use(params);
  const { fetchManual, currentManual, loading, error, generateShareLink } = useBrandManual();
  const [activeChapter, setActiveChapter] = useState('10'); // Começar no capítulo 10 para teste
  const [isPublicView, setIsPublicView] = useState(false);
  
  // Dados de teste do JSON (temporário para demonstração)
  const testManualData = {
    id: 'test-manual',
    brand_name: 'Woof Marketing',
    description: 'Manual de marca completo da Woof',
    status: 'published',
    version: '1.0',
    created_by: 'test-user',
    updated_at: new Date().toISOString(),
    manual_data: {
      "chapters": [
        {"id": "01", "title": "Visão & Essência", "content": {"purpose": "Dar eficiência ao marketing e às vendas de negócios físicos do universo pet, permitindo que os proprietários foquem em suas especialidades.", "manifesto": "Um chamado para conectar, emocionar e vender: damos voz aos negócios pet — como um latido que chama a atenção e fideliza clientes.", "personality_adjectives": ["caloroso", "consultivo", "confiante", "amigavel"]}, "objective": "Relembrar propósito, missão e personalidade da Woof para orientar decisões digitais.", "last_updated": "2025-07-24", "completion_status": "partial"},
        {"id": "02", "title": "Sistema de Logotipo Digital", "content": {"donts": ["distorcer", "rotacionar", "adicionar_sombra", "aplicar_gradiente", "alterar_cor"], "asset_sizes": {"favicon": [32, 48], "app_icon": {"ios": 1024, "android": 512}}, "clear_space": "1x_altura_W", "min_size_px": 24, "file_formats": ["SVG", "PNG"], "logo_versions": ["principal_colorida", "monocromatica_preta", "monocromatica_branca", "escala_cinza"], "uploaded_logos": [{"format": "SVG", "version": "principal_colorida", "file_url": "https://scbwseltwscuplhnmcyu.supabase.co/storage/v1/object/public/brand-assets/brand-manuals/logos/principal_colorida_1753476731183.svg", "file_name": "WOOF_logo.svg", "size_bytes": 21266, "uploaded_at": "2025-07-25T20:52:11.607Z", "storage_path": "brand-manuals/logos/principal_colorida_1753476731183.svg", "application_notes": "Aplicação em fundos brancos"}]}, "objective": "Evitar usos incorretos em sites, apps e redes sociais.", "last_updated": "2025-07-25", "completion_status": "partial"},
        {"id": "03", "title": "Paleta de Cores Web", "content": {"primary": {"hex": "#FF6B00", "name": "Woof Orange", "usage_min_percent": 30}, "support": [{"hex": "#4A2E00", "name": "Dark Brown"}, {"hex": "#FFC25C", "name": "Warm Yellow"}, {"hex": "#009688", "name": "Teal Accent"}, {"hex": "#333333", "name": "Dark Gray"}, {"hex": "#F4F4F4", "name": "Light Gray"}], "dark_mode": {"text": "#F5F5F5", "background": "#1B1B1B"}, "contrast_standard": "WCAG 2.2 AA"}, "objective": "Garantir consistência visual e acessibilidade em ambientes digitais.", "last_updated": "2025-07-24", "completion_status": "complete"},
        {"id": "04", "title": "Tipografia Responsiva", "content": {"fallbacks": ["Inter", "Helvetica", "Arial"], "scale_rem": {"h1": 2.25, "h2": 1.75, "h3": 1.5, "body": 1, "caption": 0.875}, "line_height": 1.4, "primary_font": "Montserrat", "letter_spacing": "normal", "secondary_font": "Lato"}, "objective": "Manter hierarquia clara em qualquer tela.", "last_updated": "2025-07-24", "completion_status": "complete"},
        {"id": "05", "title": "Grid & Layout Digital", "content": {"grids": {"mobile": 4, "tablet": 8, "desktop": 12}, "breakpoints_px": {"lg": 1024, "md": 768, "sm": 640, "xl": 1280}, "spacing_tokens_px": [4, 8, 16, 24, 32, 40]}, "objective": "Padronizar espaçamentos e componibilizar telas.", "last_updated": "2025-07-24", "completion_status": "complete"},
        {"id": "06", "title": "Ícones & Ilustrações", "content": {"allowed_motifs": ["patas", "coleiras", "ossos"], "icon_repository": "https://github.com/woof/icons", "stroke_width_px": 2, "corner_radius_px": 4, "palette_restricted": true}, "objective": "Alinhar estilo gráfico on-line.", "last_updated": "2025-07-24", "completion_status": "complete"},
        {"id": "07", "title": "Tom de Voz Digital", "content": {"pillars": ["caloroso", "consultivo", "confiante"], "examples": {"banner_cta": "Quero atrair mais clientes", "support_reply": "Estamos aqui para ajudá-lo. Conte conosco!", "push_notification": "Ei! Seu pet merece atenção — já conferiu nossas dicas de hoje?"}, "avoid_words": ["garantia absoluta", "barato"], "preferred_words": ["agilidade", "eficiência", "cuidado"]}, "objective": "Unificar a comunicação escrita em todos os canais on-line.", "last_updated": "2025-07-24", "completion_status": "complete"},
        {"id": "08", "title": "Social Media Toolkit", "content": {"templates": {"feed": "1080x1080", "story": "1080x1920", "reel_cover": "1080x1920"}, "hashtag_rules": {"brand_tag": "#WoofMarketing", "max_per_post": 5}, "safe_margins_percent": 10}, "objective": "Manter visual coeso entre redes sociais.", "last_updated": "2025-07-24", "completion_status": "complete"},
        {"id": "09", "title": "Banners & Ads Digitais", "content": {"iab_standard_sizes": [{"name": "Leaderboard", "dimensions": [728, 90], "usage": "Topo/rodapé de sites desktop", "platforms": ["Google Ads", "Sites próprios"], "notes": "Formato horizontal ideal para headers"}, {"name": "Medium Rectangle", "dimensions": [300, 250], "usage": "Sidebar, meio do conteúdo", "platforms": ["Google Ads", "Facebook", "Sites"], "notes": "Formato mais versátil e com melhor performance"}, {"name": "Square Social", "dimensions": [1080, 1080], "usage": "Posts em redes sociais", "platforms": ["Instagram", "Facebook", "LinkedIn"], "notes": "Formato quadrado para feeds"}], "social_media_specs": {"instagram": {"feed_post": "1080x1080px", "story_ad": "1080x1920px", "reels_ad": "1080x1920px"}, "facebook": {"feed_ad": "1200x628px", "story_ad": "1080x1920px", "carousel": "1080x1080px"}, "linkedin": {"sponsored_content": "1200x627px", "message_ad": "300x250px"}}, "design_principles": {"brand_application": {"logo_placement": "Canto inferior direito preferencialmente", "logo_min_size": "24px de altura", "clear_space": "1x altura do W ao redor do logo", "background_contrast": "Sempre garantir contraste suficiente"}, "typography": {"primary_font": "Montserrat para títulos", "secondary_font": "Lato para textos de apoio", "min_font_size": "14px para legibilidade", "max_text_lines": "3 linhas para título principal"}, "color_usage": {"primary_color_min": "30% da composição em Woof Orange", "contrast_ratio": "Mínimo 4.5:1 para textos", "background_options": ["Branco", "Cinza claro", "Woof Orange"]}, "call_to_action": {"position": "Canto inferior direito ou centro", "style": "Botão com contraste alto", "text_examples": ["Saiba Mais", "Agende Agora", "Conheça", "Quero atrair mais clientes"]}}, "file_specifications": {"static_ads": {"formats": ["JPG", "PNG"], "max_file_size": "150KB", "resolution": "72 DPI", "color_space": "sRGB"}, "animated_ads": {"formats": ["GIF", "HTML5", "MP4"], "max_file_size": "150KB para GIF, 2MB para HTML5", "duration": "Máximo 15 segundos", "loop": "1 loop apenas", "framerate": "Máximo 30 FPS"}}, "platform_guidelines": {"google_ads": {"text_overlay": "Sem limite específico", "safe_area": "10px de margem em todas as bordas", "approval_time": "24-48 horas", "restrictions": ["Não usar 'clique aqui'", "Evitar excesso de texto"]}, "facebook_instagram": {"text_overlay": "Máximo 20% da área", "safe_area": "10% de margem", "approval_time": "2-24 horas", "restrictions": ["Não usar linguagem sensacionalista", "Evitar texto em excesso"]}, "linkedin": {"text_overlay": "Recomendado máximo 20%", "safe_area": "5% de margem", "approval_time": "2-6 horas", "restrictions": ["Manter tom profissional", "Evitar linguagem muito casual"]}}, "approval_checklist": ["Logo aplicado corretamente", "Contraste de cores adequado", "Texto legível em todos os tamanhos", "CTA claro e visível", "Dentro do limite de peso do arquivo", "Formato adequado para a plataforma", "Respeitando safe areas", "Tom de voz consistente", "Informações de contato visíveis", "Aprovação da equipe de marketing"]}, "objective": "Facilitar criação de anúncios.", "last_updated": "2025-08-13", "completion_status": "complete"},
        {"id": "10", "title": "Gestão de Ativos & Nomenclatura", "content": {"folder_structure": {"overview": "Estrutura hierárquica organizada para facilitar localização e manutenção de assets digitais", "main_directories": [{"path": "/brand-assets/", "description": "Diretório raiz para todos os assets da marca", "subdirectories": [{"path": "/logos/", "description": "Logotipos em diferentes formatos e variações", "contents": ["SVG vetoriais", "PNG alta resolução", "Variantes especiais", "Versões monocromáticas"]}, {"path": "/icons/", "description": "Iconografia e elementos gráficos", "contents": ["Ícones de UI", "Ícones sociais", "Elementos decorativos", "Pictogramas"]}, {"path": "/typography/", "description": "Recursos tipográficos", "contents": ["Arquivos de fonte", "Specimens tipográficos", "Hierarquias", "Exemplos de uso"]}, {"path": "/colors/", "description": "Paletas e swatches de cores", "contents": ["Arquivos .ase", "Paletas digitais", "Códigos HEX/RGB", "Variações tonais"]}, {"path": "/templates/", "description": "Templates prontos para uso", "contents": ["Social media", "Apresentações", "Documentos", "Email marketing"]}, {"path": "/guidelines/", "description": "Documentação e diretrizes", "contents": ["Manual da marca", "Exemplos de uso", "Casos de erro", "Best practices"]}]}], "folder_naming_rules": {"use_lowercase": true, "use_hyphens": "Para separar palavras", "avoid_spaces": true, "be_descriptive": "Nomes claros e objetivos"}}, "naming_convention": {"pattern": "[CATEGORIA]_[TIPO]_[VERSAO]_[VARIANTE]_[RESOLUCAO].[EXT]", "components": {"categoria": {"description": "Tipo principal do asset", "examples": ["logo", "icon", "template", "color", "font"]}, "tipo": {"description": "Subtipo específico", "examples": ["principal", "menu", "instagram", "primary", "montserrat"]}, "versao": {"description": "Controle de versão semântico", "format": "v[MAJOR].[MINOR].[PATCH]", "examples": ["v1.0", "v2.1", "v1.0.3"]}, "variante": {"description": "Variação específica", "examples": ["colorida", "monocromatica", "outlined", "filled", "light", "dark"]}, "resolucao": {"description": "Dimensões ou qualidade", "examples": ["1080px", "24x24", "hdpi", "vector", "print"]}}, "examples": {"logo_files": ["logo_principal_v2.1_colorida_1080px.svg", "logo_principal_v2.1_monocromatica_vector.svg", "logo_secundario_v1.0_branca_512px.png"], "icon_files": ["icon_menu_v1.0_outlined_24px.svg", "icon_user_v1.2_filled_32px.png", "icon_search_v1.0_outlined_vector.svg"], "template_files": ["template_instagram_v1.5_feed_1080x1080.psd", "template_story_v2.0_promocional_1080x1920.ai", "template_banner_v1.0_leaderboard_728x90.sketch"]}, "forbidden_patterns": ["Sem espaços", "Sem caracteres especiais (!@#$%)", "Sem acentos", "Sem CAPS LOCK excessivo", "Sem números no início"]}, "version_control": {"semantic_versioning": {"major": {"when": "Mudanças significativas na identidade visual", "examples": ["Nova logo", "Rebranding completo", "Mudança de paleta principal"]}, "minor": {"when": "Melhorias e adições não-breaking", "examples": ["Nova variante de logo", "Novos ícones", "Templates adicionais"]}, "patch": {"when": "Correções e ajustes menores", "examples": ["Correção de cor", "Ajuste de espaçamento", "Fix de formato"]}}, "approval_workflow": {"draft": "Versão em desenvolvimento", "review": "Em análise pela equipe", "approved": "Aprovado para uso", "deprecated": "Versão obsoleta", "archived": "Arquivado para histórico"}, "changelog": {"track_changes": true, "document_reasons": "Sempre documentar motivo da mudança", "notify_team": "Comunicar alterações para toda equipe"}}, "quality_standards": {"file_formats": {"vector": {"primary": "SVG", "secondary": "AI", "requirements": ["Curves convertidas", "Textos em outlines", "Cores em RGB/CMYK", "Artboard limpo"]}, "raster": {"web": "PNG com transparência", "print": "TIFF ou PNG 300dpi", "compressed": "JPG para fotos", "requirements": ["Resolução adequada", "Perfil de cor correto", "Compressão otimizada"]}}, "technical_specs": {"min_resolution": {"web": "72dpi", "print": "300dpi", "retina": "144dpi"}, "color_profiles": {"web": "sRGB", "print": "CMYK", "video": "Rec.709"}, "file_size_limits": {"web_icons": "Max 50KB", "social_templates": "Max 2MB", "print_files": "Max 10MB"}}, "metadata_requirements": {"always_include": ["Criador", "Data de criação", "Versão", "Finalidade", "Aprovador"], "keywords": "Tags para facilitar busca", "description": "Descrição clara do uso pretendido"}}, "collaboration_guidelines": {"roles_responsibilities": {"brand_manager": {"permissions": "Aprovar mudanças major", "responsibilities": ["Manter consistência", "Aprovar novos assets", "Gerenciar timeline"]}, "designer": {"permissions": "Criar e editar assets", "responsibilities": ["Seguir guidelines", "Versionar corretamente", "Documentar mudanças"]}, "developer": {"permissions": "Usar assets aprovados", "responsibilities": ["Implementar corretamente", "Reportar problemas", "Seguir especificações técnicas"]}, "marketing": {"permissions": "Solicitar novos assets", "responsibilities": ["Briefing claro", "Feedback construtivo", "Validar aplicações"]}}, "workflow_process": {"step_1": "Briefing e solicitação", "step_2": "Criação/edição do asset", "step_3": "Review interno", "step_4": "Apresentação para aprovação", "step_5": "Ajustes se necessário", "step_6": "Aprovação final", "step_7": "Upload e catalogação", "step_8": "Comunicação à equipe"}, "communication_channels": {"urgent_changes": "Slack #brand-urgent", "regular_updates": "Email semanal", "new_assets": "Slack #brand-assets", "feedback": "Trello Brand Board"}}, "tools_ecosystem": {"storage": {"primary": "Google Drive Brand Kit", "backup": "Figma Team Library", "version_control": "Abstract ou Git LFS"}, "design_tools": {"preferred": ["Figma", "Adobe Creative Suite", "Sketch"], "formats": "Manter arquivos nativos + exports"}, "asset_management": {"catalog": "Eagle ou Bridge", "search": "Tags e metadados", "distribution": "Shared libraries"}}, "single_source_of_truth": {"primary_repository": "https://drive.google.com/drive/folders/BrandKit", "access_control": "Permissões por nível hierárquico", "sync_frequency": "Daily automated backup", "mirror_locations": ["Figma Team Library", "Shared Google Drive", "Developer Assets Repo"]}, "maintenance_schedule": {"daily": "Backup automático", "weekly": "Review de novos assets", "monthly": "Audit de qualidade", "quarterly": "Cleanup de versões antigas", "annually": "Review completo do sistema"}}, "objective": "Evitar confusão de arquivos e versões.", "last_updated": "2025-08-13", "completion_status": "complete"},
        {"id": "11", "title": "Checklist de Aprovação Digital", "content": {"steps": ["logo_correto", "contraste_ok", "alt_text_inserido", "fontes_adequadas", "grid_respeitado", "links_testados", "responsivo_validado", "acessibilidade_passou", "revisao_copys", "aprovado_por_gerente"]}, "objective": "Reduzir retrabalho antes da publicação.", "last_updated": "2025-07-24", "completion_status": "complete"}
      ],
      "metadata": {"brand": "Woof", "author": "Equipe de Branding Woof", "version": "1.0", "last_updated": "2025-07-24"}
    }
  };

  useEffect(() => {
    // Para demonstração, vamos usar os dados de teste se não conseguir carregar do Supabase
    fetchManual(id).catch(() => {
      console.log('Usando dados de teste para demonstração');
    });
  }, [id, fetchManual]);

  const handleShare = async () => {
    const shareLink = await generateShareLink(id);
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

  // Usar dados de teste se não houver manual carregado (para demonstração)
  const displayManual = currentManual || testManualData;

  if (!displayManual) {
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

  const currentChapter = displayManual.manual_data.chapters.find(
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
                {displayManual.brand_name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {displayManual.manual_data.metadata.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(displayManual.updated_at).toLocaleDateString('pt-BR')}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  v{displayManual.version}
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
                href={`/manual-marca/${id}/editar`}
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
          chapters={displayManual.manual_data.chapters}
          activeChapter={activeChapter}
          onChapterChange={setActiveChapter}
        />
        
        {currentChapter && <ChapterContent chapter={currentChapter} />}
      </div>
    </div>
  );
}
