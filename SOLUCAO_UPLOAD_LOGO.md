# 🔧 SOLUÇÃO: Erro de Upload de Logo

## ❌ Problema Identificado

```
Erro no upload: Error: Não foi possível configurar o storage
new row violates row-level security policy
```

## 🎯 Causa Raiz

O bucket `brand-assets` não existe no Supabase Storage e **NÃO PODE** ser criado automaticamente devido às políticas de segurança (RLS). 

**⚠️ IMPORTANTE:** O comando `npm run debug-storage` sempre mostrará este erro até que o bucket seja criado manualmente no painel do Supabase. Isso é **normal e esperado**.

## ✅ SOLUÇÃO MANUAL (2 minutos)

### Passo 1: Criar o Bucket MANUALMENTE

1. **Acesse o painel do Supabase:**
   - URL: https://supabase.com/dashboard/project/scbwseltwscuplhnmcyu
   - Faça login com suas credenciais

2. **Navegue para Storage:**
   - No menu lateral, clique em **"Storage"**
   - Depois em **"Buckets"**

3. **Criar novo bucket:**
   - Clique no botão **"New bucket"**
   - Configure conforme abaixo:

   ```
   Nome do bucket: brand-assets
   ✅ Public bucket: MARCAR OBRIGATORIAMENTE
   ✅ File size limit: 10 MB
   ✅ Allowed MIME types: 
       - image/png
       - image/jpeg  
       - image/svg+xml
       - application/pdf
   ```

4. **Confirmar:**
   - Clique em **"Create bucket"**

### Passo 2: Configurar Políticas de Segurança

1. **Acesse SQL Editor:**
   - No painel do Supabase, vá em **"SQL Editor"**

2. **Execute o SQL de configuração:**
   - Copie e cole o conteúdo do arquivo `sql/storage_setup.sql`
   - Ou execute manualmente:

   ```sql
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

   -- Política para permitir update/delete
   CREATE POLICY "Users can manage their own brand assets" 
   ON storage.objects FOR ALL 
   TO authenticated 
   USING (bucket_id = 'brand-assets');
   ```

3. **Executar:**
   - Clique em **"Run"**

## 🧪 Verificar se Funcionou

1. **Execute o teste:**
   ```bash
   npm run debug-storage
   ```

2. **ANTES da configuração (NORMAL):**
   ```
   ❌ Erro ao criar bucket: new row violates row-level security policy
   ```

3. **DEPOIS da configuração (ESPERADO):**
   ```
   ✅ Bucket brand-assets já existe!
   ✅ Bucket está funcionando corretamente
   🎉 Configuração do storage está pronta!
   ```

## 📝 Explicação do Erro

**O erro "new row violates row-level security policy" é NORMAL antes da configuração manual.**

**Por quê?**
- O Supabase Storage usa RLS (Row Level Security) 
- A chave anônima não tem permissão para criar buckets
- Por segurança, buckets devem ser criados no painel administrativo
- **Isso é um recurso de segurança, não um bug!**

## 🎯 Teste de Upload

1. **Faça login na aplicação**
2. **Vá para Manual da Marca > Editar**
3. **Tente fazer upload de um logo**
4. **Deve funcionar normalmente agora!**

## 🆘 Se Ainda Não Funcionar

### Verificação 1: Autenticação
- Certifique-se de estar **logado na aplicação**
- O upload só funciona com usuário autenticado

### Verificação 2: Permissões do Bucket
- Confirme que o bucket está marcado como **"public"**
- Verifique se as políticas SQL foram executadas

### Verificação 3: Tipo de Arquivo
- Use apenas: **SVG, PNG, JPG, JPEG, PDF**
- Tamanho máximo: **10MB**

## 📱 Resultado Final

Após a configuração, o upload deve:
- ✅ Aceitar arquivos de logo
- ✅ Mostrar progress durante upload  
- ✅ Exibir o logo na galeria
- ✅ Permitir download e copy link
- ✅ Salvar metadados corretamente

---

**🚀 A configuração é única - depois de feita uma vez, funcionará para sempre!**
