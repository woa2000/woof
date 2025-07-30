-- Tabela para armazenar as anamneses digitais
CREATE TABLE IF NOT EXISTS anamneses_digitais (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url_analisada TEXT NOT NULL,
  redes_sociais TEXT[],
  
  -- Diagnóstico de Identidade e Propósito
  dna_marca TEXT,
  hipotese_negocio TEXT,
  metrica_chave_sucesso TEXT,
  
  -- Personas (JSON array)
  personas JSONB DEFAULT '[]'::jsonb,
  
  -- Auditoria de Percepção e Experiência
  jornada_paciente_zero TEXT[],
  johari_arena TEXT[],
  johari_ponto_cego JSONB,
  johari_fachada TEXT[],
  johari_desconhecido TEXT[],
  
  -- Análise do Ecossistema (JSON array)
  analise_ecossistema_inspiracoes JSONB DEFAULT '[]'::jsonb,
  
  -- Plano de Tratamento e Evolução
  quick_wins TEXT[],
  reestruturacao_arquitetura TEXT[],
  evolucao_identidade_visual TEXT[],
  otimizacao_narrativa TEXT[],
  saude_tecnica TEXT[],
  
  -- Roadmap Terapêutico (JSON array)
  roadmap_terapeutico JSONB DEFAULT '[]'::jsonb,
  
  -- Nova Anatomia da Home (JSON)
  nova_anatomia_home JSONB,
  
  -- Perguntas de Aprofundamento
  perguntas_aprofundamento TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_anamneses_digitais_user_id ON anamneses_digitais(user_id);
CREATE INDEX IF NOT EXISTS idx_anamneses_digitais_url ON anamneses_digitais(url_analisada);
CREATE INDEX IF NOT EXISTS idx_anamneses_digitais_created_at ON anamneses_digitais(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE anamneses_digitais ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados apenas verem seus próprios dados
CREATE POLICY "Users can only see their own anamneses" ON anamneses_digitais
  FOR ALL USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_anamneses_digitais_updated_at 
  BEFORE UPDATE ON anamneses_digitais
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Função para converter dados complexos para JSON antes de inserir
CREATE OR REPLACE FUNCTION insert_anamnese_digital(
  p_user_id UUID,
  p_url_analisada TEXT,
  p_redes_sociais TEXT[] DEFAULT NULL,
  p_anamnese_data JSONB DEFAULT '{}'::jsonb
) RETURNS UUID AS $$
DECLARE
  v_anamnese_id UUID;
BEGIN
  INSERT INTO anamneses_digitais (
    user_id,
    url_analisada,
    redes_sociais,
    dna_marca,
    hipotese_negocio,
    metrica_chave_sucesso,
    personas,
    jornada_paciente_zero,
    johari_arena,
    johari_ponto_cego,
    johari_fachada,
    johari_desconhecido,
    analise_ecossistema_inspiracoes,
    quick_wins,
    reestruturacao_arquitetura,
    evolucao_identidade_visual,
    otimizacao_narrativa,
    saude_tecnica,
    roadmap_terapeutico,
    nova_anatomia_home,
    perguntas_aprofundamento
  ) VALUES (
    p_user_id,
    p_url_analisada,
    p_redes_sociais,
    (p_anamnese_data->>'dna_marca'),
    (p_anamnese_data->>'hipotese_negocio'),
    (p_anamnese_data->>'metrica_chave_sucesso'),
    (p_anamnese_data->'personas'),
    ARRAY(SELECT jsonb_array_elements_text(p_anamnese_data->'jornada_paciente_zero')),
    ARRAY(SELECT jsonb_array_elements_text(p_anamnese_data->'johari_arena')),
    (p_anamnese_data->'johari_ponto_cego'),
    ARRAY(SELECT jsonb_array_elements_text(p_anamnese_data->'johari_fachada')),
    ARRAY(SELECT jsonb_array_elements_text(p_anamnese_data->'johari_desconhecido')),
    (p_anamnese_data->'analise_ecossistema_inspiracoes'),
    ARRAY(SELECT jsonb_array_elements_text(p_anamnese_data->'quick_wins')),
    ARRAY(SELECT jsonb_array_elements_text(p_anamnese_data->'reestruturacao_arquitetura')),
    ARRAY(SELECT jsonb_array_elements_text(p_anamnese_data->'evolucao_identidade_visual')),
    ARRAY(SELECT jsonb_array_elements_text(p_anamnese_data->'otimizacao_narrativa')),
    ARRAY(SELECT jsonb_array_elements_text(p_anamnese_data->'saude_tecnica')),
    (p_anamnese_data->'roadmap_terapeutico'),
    (p_anamnese_data->'nova_anatomia_home'),
    ARRAY(SELECT jsonb_array_elements_text(p_anamnese_data->'perguntas_aprofundamento'))
  ) RETURNING id INTO v_anamnese_id;
  
  RETURN v_anamnese_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
