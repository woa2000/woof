/**
 * Sistema de Demonstração - Compliance Pet
 * 
 * Página de demonstração completa do sistema de compliance
 * Integração com todos os providers mock para demonstração
 */

import React from 'react';
import { ComplianceDashboard } from '@/components/compliance/ComplianceDashboard';

export default function ComplianceDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header da Demo */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🐕 Woof Marketing Platform - Compliance Demo
              </h1>
              <p className="text-gray-600">
                Sistema completo de validação de compliance para conteúdo pet
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Mock Data Enabled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">AI Provider Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Compliance System Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Demo</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Pet Compliance System</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Informações da Demo */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Demonstração do Sistema de Compliance
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Esta é uma demonstração completa do sistema de compliance para conteúdo pet da Woof Marketing Platform. 
                  Todos os dados são simulados (mock) para fins de demonstração.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>✅ Validação automática de compliance veterinário</li>
                  <li>🤖 Integração com IA para geração de conteúdo compliant</li>
                  <li>📊 Analytics e relatórios de compliance</li>
                  <li>🔄 Workflows automatizados de validação e correção</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Principal */}
        <ComplianceDashboard />
        
        {/* Footer da Demo */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="text-center text-gray-500 space-y-2">
            <p className="text-sm">
              🐕 Woof Marketing Platform - Pet Industry Compliance System
            </p>
            <p className="text-xs">
              Sistema desenvolvido seguindo as melhores práticas de compliance veterinário e marketing pet
            </p>
            <div className="flex justify-center space-x-6 text-xs">
              <span>✅ CFMV Compliant</span>
              <span>🛡️ LGPD Ready</span>
              <span>🔒 Security First</span>
              <span>🎯 AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}