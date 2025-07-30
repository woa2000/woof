-- Tabela para armazenar os manuais de marca
CREATE TABLE IF NOT EXISTS brand_manuals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Metadados do manual
  brand_name TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  creation_method TEXT DEFAULT 'manual' CHECK (creation_method IN ('manual', 'ai_extraction', 'hybrid')),
  
  -- Dados do manual (estrutura JSON baseada no brand-model.json)
  manual_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Arquivos source utilizados (quando criado via IA)
  source_files JSONB DEFAULT '[]'::jsonb,
  source_urls TEXT[],
  
  -- Controle de versão
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadados adicionais
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  is_template BOOLEAN DEFAULT FALSE,
  
  -- Configurações de compartilhamento
  is_public BOOLEAN DEFAULT FALSE,
  share_token UUID DEFAULT gen_random_uuid()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_brand_manuals_user_id ON brand_manuals(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_manuals_brand_name ON brand_manuals(brand_name);
CREATE INDEX IF NOT EXISTS idx_brand_manuals_status ON brand_manuals(status);
CREATE INDEX IF NOT EXISTS idx_brand_manuals_created_at ON brand_manuals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_brand_manuals_tags ON brand_manuals USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_brand_manuals_manual_data ON brand_manuals USING GIN(manual_data);

-- RLS (Row Level Security)
ALTER TABLE brand_manuals ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados verem apenas seus próprios manuais
CREATE POLICY "Users can only see their own brand manuals" ON brand_manuals
  FOR ALL USING (auth.uid() = user_id);

-- Política para manuais públicos (compartilhados)
CREATE POLICY "Public brand manuals are viewable by anyone" ON brand_manuals
  FOR SELECT USING (is_public = true);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_brand_manuals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_brand_manuals_updated_at 
  BEFORE UPDATE ON brand_manuals
  FOR EACH ROW 
  EXECUTE FUNCTION update_brand_manuals_updated_at();

-- Função para marcar como publicado
CREATE OR REPLACE FUNCTION publish_brand_manual(manual_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE brand_manuals 
  SET 
    status = 'published',
    published_at = NOW()
  WHERE id = manual_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para duplicar manual (template)
CREATE OR REPLACE FUNCTION duplicate_brand_manual(
  source_manual_id UUID,
  new_brand_name TEXT
) RETURNS UUID AS $$
DECLARE
  new_manual_id UUID;
  source_manual RECORD;
BEGIN
  -- Buscar manual source
  SELECT * INTO source_manual FROM brand_manuals 
  WHERE id = source_manual_id 
  AND (user_id = auth.uid() OR is_public = true OR is_template = true);
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Manual não encontrado ou sem permissão';
  END IF;
  
  -- Criar novo manual
  INSERT INTO brand_manuals (
    user_id,
    brand_name,
    manual_data,
    description,
    creation_method
  ) VALUES (
    auth.uid(),
    new_brand_name,
    source_manual.manual_data,
    'Duplicado de: ' || source_manual.brand_name,
    'manual'
  ) RETURNING id INTO new_manual_id;
  
  RETURN new_manual_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View para estatísticas dos manuais por usuário
CREATE OR REPLACE VIEW user_brand_manual_stats AS
SELECT 
  user_id,
  COUNT(*) as total_manuals,
  COUNT(*) FILTER (WHERE status = 'published') as published_count,
  COUNT(*) FILTER (WHERE status = 'draft') as draft_count,
  COUNT(*) FILTER (WHERE creation_method = 'ai_extraction') as ai_generated_count,
  MAX(updated_at) as last_activity
FROM brand_manuals 
GROUP BY user_id;
