import React from 'react';
import { AnamneseDigital } from '@/lib/types/anamnese';
import { TrendingUp, Users, Target, Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react';

interface AnamneseStatsProps {
  anamnese: AnamneseDigital;
}

const AnamneseStats: React.FC<AnamneseStatsProps> = ({ anamnese }) => {
  const stats = [
    {
      label: 'Personas Identificadas',
      value: anamnese.personas?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Perfis de usuário mapeados'
    },
    {
      label: 'Quick Wins',
      value: anamnese.plano_tratamento_e_evolucao?.quick_wins?.length || 0,
      icon: Lightbulb,
      color: 'bg-yellow-500',
      description: 'Melhorias rápidas identificadas'
    },
    {
      label: 'Itens do Roadmap',
      value: anamnese.roadmap_terapeutico?.length || 0,
      icon: Target,
      color: 'bg-green-500',
      description: 'Ações estratégicas planejadas'
    },
    {
      label: 'Inspirações',
      value: anamnese.analise_ecossistema_inspiracoes?.length || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'Referências do mercado'
    }
  ];

  const priorityStats = anamnese.roadmap_terapeutico?.reduce((acc, item) => {
    acc[item.prioridade] = (acc[item.prioridade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Priority Breakdown */}
      {Object.keys(priorityStats).length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Prioridade</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900">Alta Prioridade</span>
                <p className="text-2xl font-bold text-red-600">{priorityStats['Alta'] || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900">Média Prioridade</span>
                <p className="text-2xl font-bold text-yellow-600">{priorityStats['Média'] || 0}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <span className="text-sm font-medium text-gray-900">Baixa Prioridade</span>
                <p className="text-2xl font-bold text-green-600">{priorityStats['Baixa'] || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Score */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pontuação de Saúde Digital</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            {/* Progress bar */}
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: '75%' }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Crítico</span>
              <span>Bom</span>
              <span>Excelente</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-600">75</div>
            <div className="text-sm text-gray-500">de 100</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">Personas bem definidas</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">UX precisa melhorar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnamneseStats;
