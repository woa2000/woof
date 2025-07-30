-- Configuração do Supabase Storage para Brand Manual

-- Criar o bucket para assets da marca se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de arquivos autenticados
CREATE POLICY "Authenticated users can upload brand assets" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'brand-assets');

-- Política para permitir leitura pública
CREATE POLICY "Public can view brand assets" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'brand-assets');

-- Política para permitir update de arquivos do próprio usuário
CREATE POLICY "Users can update their own brand assets" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para permitir delete de arquivos do próprio usuário
CREATE POLICY "Users can delete their own brand assets" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
