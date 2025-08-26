-- DATABASE SCHEMA PARA FUNDAMENTOS & INSIGHTS - AGÊNCIA PET IA
-- Gerado por: Tech_Lead durante Sprint 1-2
-- Data: 2025-08-24
-- Fonte: @docs/architecture/DATABASE_SCHEMA.md + Plano Fundamentos Marketing

-- =====================================================
-- MÓDULO 1: FUNDAMENTOS & ONBOARDING
-- =====================================================

-- Pilares Editoriais (Sistema de temas-mãe configuráveis)
CREATE TABLE public.pilares_editoriais (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  temas_mae JSONB DEFAULT '[]', -- Array de temas principais
  jornada_mapping JSONB DEFAULT '{"tofu": [], "mofu": [], "bofu": []}',
  brand_voice_id UUID REFERENCES public.brand_manuals(id),
  status VARCHAR DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'arquivado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Metas e OKRs (Dashboard de KPIs por canal)
CREATE TABLE public.metas_okrs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('awareness', 'leads', 'vendas', 'retencao')),
  canal VARCHAR(50), -- instagram, facebook, whatsapp, email, etc.
  meta_numerica DECIMAL(15,2),
  unidade_medida VARCHAR(20), -- views, clicks, conversions, etc.
  prazo_conclusao DATE,
  kpis JSONB DEFAULT '[]', -- Array de KPIs específicos
  alertas_config JSONB DEFAULT '{"threshold": 0.8, "frequency": "daily"}',
  status VARCHAR DEFAULT 'ativo',
  progresso_atual DECIMAL(5,2) DEFAULT 0.00, -- Percentual
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendário de Sazonalidades (Eventos e datas-chave do setor pet)
CREATE TABLE public.calendario_sazonalidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  evento VARCHAR(150) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  categoria_pet VARCHAR(50), -- vacinacao, banho_tosa, nutricao, comportamento
  prioridade VARCHAR(10) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  campanhas_sugeridas JSONB DEFAULT '[]',
  notificacao_antecedencia INTEGER DEFAULT 7, -- dias
  tags JSONB DEFAULT '[]',
  status VARCHAR DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventário de Conteúdo (Mapeamento de lacunas automatizado)
CREATE TABLE public.inventario_conteudo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  pilar_editorial_id UUID REFERENCES public.pilares_editoriais(id),
  titulo VARCHAR(200) NOT NULL,
  tipo_conteudo VARCHAR(50), -- post, stories, reel, video, artigo
  canal_destino VARCHAR(50), -- instagram, facebook, blog, email
  categoria_pet VARCHAR(50),
  status_producao VARCHAR(20) DEFAULT 'planejado' CHECK (
    status_producao IN ('planejado', 'em_producao', 'em_revisao', 'aprovado', 'publicado')
  ),
  lacunas_identificadas JSONB DEFAULT '[]',
  sugestoes_ia JSONB DEFAULT '[]',
  data_planejada_publicacao DATE,
  prioridade INTEGER DEFAULT 5, -- 1 (baixa) a 10 (alta)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Repositório de Evidências (Base de conhecimento para compliance)
CREATE TABLE public.repositorio_evidencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  categoria VARCHAR(50), -- pesquisa_cientifica, guidelines_veterinarias, regulamentacao
  fonte_referencia VARCHAR(300),
  url_fonte VARCHAR(500),
  conteudo_evidencia TEXT NOT NULL,
  citacao_automatica TEXT, -- Formato APA/ABNT gerado
  validacao_veterinaria BOOLEAN DEFAULT FALSE,
  data_validacao DATE,
  tags JSONB DEFAULT '[]',
  aplicabilidade JSONB DEFAULT '[]', -- Em quais contextos pode ser usado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MÓDULO 2: PESQUISA & INSIGHTS
-- =====================================================

-- Social Listening (Monitoramento de hashtags e tendências)
CREATE TABLE public.social_listening (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  hashtag_monitorada VARCHAR(100),
  plataforma VARCHAR(20) CHECK (plataforma IN ('instagram', 'tiktok', 'facebook', 'twitter')),
  mencoes_coletadas JSONB DEFAULT '[]',
  sentimento_geral VARCHAR(20), -- positivo, neutro, negativo
  score_sentimento DECIMAL(3,2), -- -1.0 a 1.0
  tendencias_emergentes JSONB DEFAULT '[]',
  sons_virais JSONB DEFAULT '[]',
  periodo_monitoramento DATERANGE,
  insights_gerados JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Assistido por IA (Pesquisa de keywords automatizada)
CREATE TABLE public.seo_keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  keyword_principal VARCHAR(150) NOT NULL,
  categoria_pet VARCHAR(50),
  volume_busca INTEGER,
  dificuldade_seo DECIMAL(3,2), -- 0.0 a 1.0
  intencao_busca VARCHAR(30), -- informacional, comercial, navegacional, transacional
  cluster_topicos JSONB DEFAULT '[]',
  keywords_relacionadas JSONB DEFAULT '[]',
  competidores JSONB DEFAULT '[]',
  oportunidade_score DECIMAL(3,2), -- 0.0 a 1.0
  status VARCHAR DEFAULT 'descoberta',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Benchmark Competitivo (Análise de share of voice)
CREATE TABLE public.benchmark_competitivo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  competidor_nome VARCHAR(100) NOT NULL,
  competidor_handle VARCHAR(50),
  plataforma VARCHAR(20),
  share_of_voice DECIMAL(5,2), -- Percentual
  frequencia_posting INTEGER, -- Posts por semana
  formatos_preferidos JSONB DEFAULT '[]', -- carrossel, video, stories
  ganchos_vencedores JSONB DEFAULT '[]',
  engagement_medio DECIMAL(8,2),
  crescimento_followers DECIMAL(5,2), -- Percentual
  periodo_analise DATERANGE,
  insights_competitivos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ Mining (Extração de perguntas de comentários)
CREATE TABLE public.faq_mining (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  fonte_pergunta VARCHAR(50), -- comentarios, dm, busca_interna, crm
  pergunta_original TEXT NOT NULL,
  pergunta_processada TEXT, -- Normalizada pela IA
  categoria_pet VARCHAR(50),
  frequencia_pergunta INTEGER DEFAULT 1,
  resposta_sugerida TEXT,
  resposta_aprovada TEXT,
  validacao_veterinaria BOOLEAN DEFAULT FALSE,
  prioridade INTEGER DEFAULT 5,
  status VARCHAR DEFAULT 'nova' CHECK (
    status IN ('nova', 'processada', 'respondida', 'arquivada')
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Heatmap de Oportunidades (Análise de gap demanda vs oferta)
CREATE TABLE public.heatmap_oportunidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  topico VARCHAR(150) NOT NULL,
  categoria_pet VARCHAR(50),
  demanda_score DECIMAL(3,2), -- 0.0 a 1.0
  oferta_concorrencia_score DECIMAL(3,2), -- 0.0 a 1.0
  gap_oportunidade DECIMAL(3,2), -- demanda - oferta
  dificuldade_producao DECIMAL(3,2), -- 0.0 a 1.0
  potencial_roi DECIMAL(3,2), -- 0.0 a 1.0
  prioridade_ia INTEGER, -- 1-10, calculado automaticamente
  formato_recomendado VARCHAR(50), -- video, carrossel, artigo
  canal_recomendado VARCHAR(50),
  keywords_relacionadas JSONB DEFAULT '[]',
  concorrentes_diretos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MÓDULO 3: SISTEMA DE MOCKS (para demonstração)
-- =====================================================

-- Mock Data Configurations
CREATE TABLE public.mock_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  modulo VARCHAR(50) NOT NULL, -- fundamentos, insights, mocks
  componente VARCHAR(100) NOT NULL,
  mock_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  demo_scenario VARCHAR(100), -- veterinaria, petshop, banho_tosa
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para Pilares Editoriais
CREATE INDEX idx_pilares_editoriais_user_id ON public.pilares_editoriais(user_id);
CREATE INDEX idx_pilares_editoriais_status ON public.pilares_editoriais(status);

-- Índices para Metas e OKRs
CREATE INDEX idx_metas_okrs_user_id ON public.metas_okrs(user_id);
CREATE INDEX idx_metas_okrs_tipo_canal ON public.metas_okrs(tipo, canal);
CREATE INDEX idx_metas_okrs_prazo ON public.metas_okrs(prazo_conclusao);

-- Índices para Calendário
CREATE INDEX idx_calendario_user_data ON public.calendario_sazonalidades(user_id, data_inicio);
CREATE INDEX idx_calendario_categoria ON public.calendario_sazonalidades(categoria_pet);

-- Índices para Inventário
CREATE INDEX idx_inventario_user_pilar ON public.inventario_conteudo(user_id, pilar_editorial_id);
CREATE INDEX idx_inventario_status ON public.inventario_conteudo(status_producao);
CREATE INDEX idx_inventario_data_planejada ON public.inventario_conteudo(data_planejada_publicacao);

-- Índices para Social Listening
CREATE INDEX idx_social_listening_user_platform ON public.social_listening(user_id, plataforma);
CREATE INDEX idx_social_listening_hashtag ON public.social_listening(hashtag_monitorada);

-- Índices para SEO
CREATE INDEX idx_seo_keywords_user_categoria ON public.seo_keywords(user_id, categoria_pet);
CREATE INDEX idx_seo_keywords_oportunidade ON public.seo_keywords(oportunidade_score DESC);

-- Índices para FAQ Mining
CREATE INDEX idx_faq_mining_user_categoria ON public.faq_mining(user_id, categoria_pet);
CREATE INDEX idx_faq_mining_frequencia ON public.faq_mining(frequencia_pergunta DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- RLS para todos os módulos
ALTER TABLE public.pilares_editoriais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas_okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendario_sazonalidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_conteudo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositorio_evidencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_listening ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmark_competitivo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_mining ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heatmap_oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_configurations ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (usuários só veem seus próprios dados)
CREATE POLICY "Users can manage own pilares editoriais" 
ON public.pilares_editoriais FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own metas okrs" 
ON public.metas_okrs FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own calendario sazonalidades" 
ON public.calendario_sazonalidades FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own inventario conteudo" 
ON public.inventario_conteudo FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own repositorio evidencias" 
ON public.repositorio_evidencias FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own social listening" 
ON public.social_listening FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own seo keywords" 
ON public.seo_keywords FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own benchmark competitivo" 
ON public.benchmark_competitivo FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own faq mining" 
ON public.faq_mining FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own heatmap oportunidades" 
ON public.heatmap_oportunidades FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own mock configurations" 
ON public.mock_configurations FOR ALL 
USING (auth.uid() = user_id);

-- =====================================================
-- FUNÇÕES E TRIGGERS PARA AUTOMAÇÃO
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers para updated_at
CREATE TRIGGER set_timestamp_pilares_editoriais
  BEFORE UPDATE ON public.pilares_editoriais
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_metas_okrs
  BEFORE UPDATE ON public.metas_okrs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_inventario_conteudo
  BEFORE UPDATE ON public.inventario_conteudo
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_repositorio_evidencias
  BEFORE UPDATE ON public.repositorio_evidencias
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_social_listening
  BEFORE UPDATE ON public.social_listening
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_seo_keywords
  BEFORE UPDATE ON public.seo_keywords
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_benchmark_competitivo
  BEFORE UPDATE ON public.benchmark_competitivo
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_faq_mining
  BEFORE UPDATE ON public.faq_mining
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_timestamp_heatmap_oportunidades
  BEFORE UPDATE ON public.heatmap_oportunidades
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE public.pilares_editoriais IS 'Sistema de temas-mãe configuráveis para estratégia de conteúdo pet';
COMMENT ON TABLE public.metas_okrs IS 'Dashboard de KPIs e métricas por canal para agência pet';
COMMENT ON TABLE public.calendario_sazonalidades IS 'Eventos e datas-chave do setor pet com integração de campanhas';
COMMENT ON TABLE public.inventario_conteudo IS 'Mapeamento automatizado de lacunas de conteúdo com sugestões IA';
COMMENT ON TABLE public.repositorio_evidencias IS 'Base de conhecimento para compliance veterinário com citações automáticas';
COMMENT ON TABLE public.social_listening IS 'Monitoramento de hashtags e análise de sentimento para pets';
COMMENT ON TABLE public.seo_keywords IS 'Pesquisa e clustering inteligente de keywords do nicho pet';
COMMENT ON TABLE public.benchmark_competitivo IS 'Análise de share of voice e estratégias competitivas pet';
COMMENT ON TABLE public.faq_mining IS 'Extração e processamento automático de perguntas frequentes';
COMMENT ON TABLE public.heatmap_oportunidades IS 'Análise de gaps demanda vs oferta para oportunidades de conteúdo';
COMMENT ON TABLE public.mock_configurations IS 'Configurações de dados simulados para demonstrações';

-- Schema versioning
INSERT INTO public.schema_migrations (version, description, executed_at) VALUES 
('2025082401', 'Fundamentos Marketing & Insights - Módulos 1, 2 e 3', NOW())
ON CONFLICT (version) DO NOTHING;