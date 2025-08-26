// INTERFACE DE CONFIGURAÇÃO DOS PILARES EDITORIAIS
// Implementado por: Frontend_Developer durante Sprint 3-5
// Integração com sistema de temas-mãe e IA Generator

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Lightbulb, 
  Target, 
  TrendingUp,
  Wand2,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// =====================================================
// INTERFACES E TIPOS
// =====================================================

interface TemaMae {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'saude' | 'comportamento' | 'nutricao' | 'cuidados' | 'lazer';
  jornada: 'tofu' | 'mofu' | 'bofu';
  keywords: string[];
  compliance_status: 'aprovado' | 'pendente' | 'bloqueado';
  formatos_sugeridos: string[];
}

interface PilarEditorial {
  id?: string;
  nome: string;
  descricao: string;
  business_type: string;
  target_audience: string;
  location: string;
  temas_mae: TemaMae[];
  status: 'ativo' | 'inativo' | 'em_configuracao';
  compliance_score: number;
  created_at?: string;
}

interface AnalyticsPilar {
  pilar_id: string;
  distribuicao_jornada: {
    tofu: number;
    mofu: number;
    bofu: number;
    total: number;
  };
  cobertura_categorias: {
    distribuicao: Array<{
      categoria: string;
      temas_count: number;
      percentual: number;
    }>;
    categorias_cobertas: number;
    total_categorias: number;
  };
  score_qualidade: number;
  lacunas_identificadas: string[];
  recomendacoes: string[];
}

// =====================================================
// COMPONENT PRINCIPAL - CONFIGURADOR DE PILARES
// =====================================================

export default function PilarConfigurationInterface() {
  // Estados principais
  const [pilares, setPilares] = useState<PilarEditorial[]>([]);
  const [pilarAtivo, setPilarAtivo] = useState<PilarEditorial | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsPilar | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('configuracao');

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    business_type: 'clinica_veterinaria',
    target_audience: '',
    location: 'Brasil'
  });

  // Estados de geração IA
  const [gerandoIA, setGerandoIA] = useState(false);
  const [resultadoIA, setResultadoIA] = useState<any>(null);

  // =====================================================
  // EFFECTS E CARREGAMENTO DE DADOS
  // =====================================================

  useEffect(() => {
    carregarPilares();
  }, []);

  useEffect(() => {
    if (pilarAtivo?.id) {
      carregarAnalytics(pilarAtivo.id);
    }
  }, [pilarAtivo]);

  // =====================================================
  // FUNÇÕES DE CARREGAMENTO
  // =====================================================

  const carregarPilares = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pilares-editoriais');
      if (response.ok) {
        const data = await response.json();
        setPilares(data);
        if (data.length > 0 && !pilarAtivo) {
          setPilarAtivo(data[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar pilares:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarAnalytics = async (pilarId: string) => {
    try {
      const response = await fetch(`/api/pilares-editoriais/${pilarId}/analytics`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    }
  };

  // =====================================================
  // GERAÇÃO COM IA
  // =====================================================

  const gerarPilarComIA = async () => {
    if (!formData.nome || !formData.target_audience) {
      alert('Preencha pelo menos o nome do pilar e público-alvo');
      return;
    }

    setGerandoIA(true);
    try {
      const response = await fetch('/api/pilares-editoriais/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const resultado = await response.json();
        setResultadoIA(resultado);
        setTab('preview');
      } else {
        const error = await response.json();
        alert(`Erro na geração: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao gerar pilar:', error);
      alert('Erro de conexão. Tente novamente.');
    } finally {
      setGerandoIA(false);
    }
  };

  const salvarPilarGerado = async () => {
    if (!resultadoIA) return;

    setLoading(true);
    try {
      const response = await fetch('/api/pilares-editoriais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          temas_mae: resultadoIA.temas_mae,
          status: resultadoIA.compliance_check === 'aprovado' ? 'ativo' : 'em_configuracao'
        })
      });

      if (response.ok) {
        await carregarPilares();
        setResultadoIA(null);
        setTab('configuracao');
        alert('Pilar salvo com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar pilar:', error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER DO COMPONENTE
  // =====================================================

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pilares Editoriais</h1>
          <p className="text-gray-600 mt-2">Configure e gerencie os pilares de conteúdo para sua agência pet</p>
        </div>
        <Button onClick={() => setTab('configuracao')} className="bg-blue-600 hover:bg-blue-700">
          <Wand2 className="w-4 h-4 mr-2" />
          Novo Pilar com IA
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configuracao" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuração
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Preview IA
          </TabsTrigger>
          <TabsTrigger value="gerenciamento" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Gerenciar
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CONFIGURAÇÃO */}
        <TabsContent value="configuracao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Gerador de Pilares com IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Pilar *
                  </label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Saúde Preventiva, Nutrição Canina..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Negócio *
                  </label>
                  <select 
                    value={formData.business_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, business_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="clinica_veterinaria">Clínica Veterinária</option>
                    <option value="pet_shop">Pet Shop</option>
                    <option value="banho_tosa">Banho e Tosa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Público-Alvo *
                </label>
                <Input
                  value={formData.target_audience}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                  placeholder="Ex: Tutores de cães adultos em São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Pilar
                </label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva o objetivo e foco deste pilar editorial..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={gerarPilarComIA}
                disabled={gerandoIA || !formData.nome || !formData.target_audience}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {gerandoIA ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Gerando com IA...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Gerar Pilar com IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: PREVIEW DA GERAÇÃO IA */}
        <TabsContent value="preview" className="space-y-6">
          {resultadoIA ? (
            <div className="space-y-6">
              {/* Status de Compliance */}
              <Alert className={resultadoIA.compliance_check === 'aprovado' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
                {resultadoIA.compliance_check === 'aprovado' ? 
                  <CheckCircle className="h-4 w-4 text-green-600" /> : 
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                }
                <AlertDescription className={resultadoIA.compliance_check === 'aprovado' ? 'text-green-800' : 'text-yellow-800'}>
                  Compliance: {resultadoIA.compliance_check === 'aprovado' ? 'Aprovado' : 'Pendente'} - 
                  {resultadoIA.compliance_check === 'aprovado' ? ' Pilar pronto para uso' : ' Requer revisão'}
                </AlertDescription>
              </Alert>

              {/* Informações do Pilar */}
              <Card>
                <CardHeader>
                  <CardTitle>{resultadoIA.nome_pilar}</CardTitle>
                  <p className="text-gray-600">{resultadoIA.descricao}</p>
                </CardHeader>
                <CardContent>
                  {/* Distribuição da Jornada */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Distribuição da Jornada do Cliente</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(resultadoIA.jornada_mapping || {}).map(([fase, temas]) => (
                        <div key={fase} className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{(temas as any[])?.length || 0}</div>
                          <div className="text-sm text-gray-600 uppercase">{fase}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Temas-Mãe */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Temas-Mãe Gerados ({resultadoIA.temas_mae?.length || 0})</h4>
                    <div className="grid gap-3">
                      {resultadoIA.temas_mae?.map((tema: TemaMae, index: number) => (
                        <Card key={tema.id} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{tema.nome}</h5>
                            <div className="flex gap-2">
                              <Badge variant={tema.jornada === 'tofu' ? 'default' : tema.jornada === 'mofu' ? 'secondary' : 'outline'}>
                                {tema.jornada.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {tema.categoria}
                              </Badge>
                              {tema.compliance_status === 'aprovado' ? 
                                <CheckCircle className="w-4 h-4 text-green-600" /> : 
                                <Clock className="w-4 h-4 text-yellow-600" />
                              }
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{tema.descricao}</p>
                          <div className="flex flex-wrap gap-1">
                            {tema.keywords.map(keyword => (
                              <Badge key={keyword} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimers */}
                  {resultadoIA.disclaimers_necessarios?.length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="font-semibold text-yellow-800 mb-2">Disclaimers Necessários:</h5>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {resultadoIA.disclaimers_necessarios.map((disclaimer: string, index: number) => (
                          <li key={index}>• {disclaimer}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <Button onClick={salvarPilarGerado} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Salvar Pilar
                    </Button>
                    <Button variant="outline" onClick={() => setResultadoIA(null)}>
                      Gerar Novamente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Lightbulb className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhum pilar foi gerado ainda. Configure um novo pilar na aba "Configuração".</p>
            </Card>
          )}
        </TabsContent>

        {/* TAB 3: GERENCIAMENTO */}
        <TabsContent value="gerenciamento" className="space-y-6">
          <div className="grid gap-4">
            {pilares.map(pilar => (
              <Card key={pilar.id} className={`cursor-pointer transition-all ${pilarAtivo?.id === pilar.id ? 'ring-2 ring-blue-500' : ''}`} 
                    onClick={() => setPilarAtivo(pilar)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{pilar.nome}</h3>
                      <p className="text-gray-600 text-sm mt-1">{pilar.descricao}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="capitalize">
                          {pilar.business_type.replace('_', ' ')}
                        </Badge>
                        <Badge variant={pilar.status === 'ativo' ? 'default' : 'secondary'}>
                          {pilar.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{pilar.temas_mae?.length || 0}</div>
                      <div className="text-xs text-gray-500">temas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 4: ANALYTICS */}
        <TabsContent value="analytics" className="space-y-6">
          {analytics && pilarAtivo ? (
            <div className="space-y-6">
              {/* Score de Qualidade */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Score de Qualidade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Progress value={analytics.score_qualidade} className="h-3" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{analytics.score_qualidade}/100</div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {analytics.score_qualidade >= 80 ? 'Excelente!' : 
                     analytics.score_qualidade >= 60 ? 'Bom, mas pode melhorar' : 
                     'Precisa de otimização'}
                  </p>
                </CardContent>
              </Card>

              {/* Distribuição da Jornada */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Fase da Jornada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{analytics.distribuicao_jornada.tofu}%</div>
                      <div className="text-sm text-gray-600">TOFU (Consciência)</div>
                      <div className="text-xs text-gray-500">{analytics.distribuicao_jornada.tofu}% do total</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">{analytics.distribuicao_jornada.mofu}%</div>
                      <div className="text-sm text-gray-600">MOFU (Consideração)</div>
                      <div className="text-xs text-gray-500">{analytics.distribuicao_jornada.mofu}% do total</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">{analytics.distribuicao_jornada.bofu}%</div>
                      <div className="text-sm text-gray-600">BOFU (Conversão)</div>
                      <div className="text-xs text-gray-500">{analytics.distribuicao_jornada.bofu}% do total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cobertura de Categorias */}
              <Card>
                <CardHeader>
                  <CardTitle>Cobertura de Categorias Pet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.cobertura_categorias.distribuicao.map(categoria => (
                      <div key={categoria.categoria} className="flex justify-between items-center">
                        <span className="capitalize font-medium">{categoria.categoria}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={categoria.percentual} className="w-20 h-2" />
                          <span className="text-sm text-gray-600 min-w-[3rem]">{categoria.percentual}%</span>
                          <Badge variant="outline">{categoria.temas_count} temas</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lacunas e Recomendações */}
              {analytics.lacunas_identificadas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-700">
                      <AlertCircle className="w-5 h-5" />
                      Lacunas Identificadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analytics.lacunas_identificadas.map((lacuna, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{lacuna}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {analytics.recomendacoes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Lightbulb className="w-5 h-5" />
                      Recomendações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analytics.recomendacoes.map((recomendacao, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{recomendacao}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : pilarAtivo ? (
            <Card className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Carregando analytics do pilar...</p>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Selecione um pilar para ver suas métricas</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}