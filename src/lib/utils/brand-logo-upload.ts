import { supabase } from '@/lib/auth/supabase';

// Função para garantir que o bucket existe
export async function ensureBrandAssetsBucket() {
  try {
    // Verificar se o bucket existe tentando listar arquivos
    const { data, error: testError } = await supabase.storage
      .from('brand-assets')
      .list('', { limit: 1 });
    
    if (!testError) {
      // Bucket existe e está acessível
      console.log('✅ Bucket brand-assets está disponível');
      return true;
    }

    // Se chegou aqui, o bucket não existe ou não está acessível
    console.log('⚠️  Bucket brand-assets não encontrado');
    
    // Tentar listar todos os buckets para confirmar
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Erro ao acessar storage:', listError.message);
      throw new Error(`Erro de acesso ao storage: ${listError.message}`);
    }

    const bucketExists = buckets?.some(bucket => bucket.id === 'brand-assets');
    
    if (!bucketExists) {
      // Tentar criar o bucket
      console.log('🔧 Tentando criar bucket brand-assets...');
      const { error: createError } = await supabase.storage.createBucket('brand-assets', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      });

      if (createError) {
        console.error('❌ Erro ao criar bucket:', createError.message);
        throw new Error(`Bucket não existe e não foi possível criar automaticamente. 
        
🔧 SOLUÇÃO MANUAL:
1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Vá em Storage > Buckets
3. Clique em "New bucket"
4. Nome: brand-assets
5. Marque como "Public bucket"
6. Confirme e tente novamente

Erro técnico: ${createError.message}`);
      }

      console.log('✅ Bucket brand-assets criado com sucesso');
    }

    return true;
  } catch (error) {
    console.error('❌ Erro na configuração do bucket:', error);
    throw error instanceof Error ? error : new Error('Erro desconhecido na configuração do storage');
  }
}

// Função para fazer upload de logo com verificações
export async function uploadBrandLogo(file: File, version: string) {
  try {
    console.log('🚀 Iniciando upload do logo...', { fileName: file.name, version });
    
    // Garantir que o bucket existe
    console.log('📦 Verificando bucket...');
    await ensureBrandAssetsBucket();

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${version}_${timestamp}.${fileExtension}`;
    const filePath = `brand-manuals/logos/${fileName}`;

    console.log('⬆️  Fazendo upload...', { filePath });

    // Upload do arquivo
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('brand-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError);
      
      // Tratar erros específicos
      if (uploadError.message.includes('new row violates row-level security policy')) {
        throw new Error(`Erro de permissão no storage. 
        
🔧 POSSÍVEIS SOLUÇÕES:
1. Faça login no sistema antes de fazer upload
2. Verifique se o bucket está configurado corretamente
3. Execute o SQL de configuração: sql/storage_setup.sql

Erro técnico: ${uploadError.message}`);
      }
      
      if (uploadError.message.includes('The bucket does not exist')) {
        throw new Error(`Bucket de storage não existe.
        
🔧 SOLUÇÃO:
1. Acesse https://supabase.com/dashboard
2. Vá em Storage > Buckets  
3. Crie um bucket chamado "brand-assets"
4. Marque como público
5. Tente novamente

Erro técnico: ${uploadError.message}`);
      }
      
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    console.log('✅ Upload concluído!', uploadData);

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('brand-assets')
      .getPublicUrl(filePath);

    const result = {
      success: true,
      data: {
        file_url: urlData.publicUrl,
        storage_path: filePath,
        file_name: file.name,
        format: fileExtension?.toUpperCase() || 'UNKNOWN',
        size_bytes: file.size
      }
    };

    console.log('🎉 Upload finalizado com sucesso!', result);
    return result;

  } catch (error) {
    console.error('💥 Erro no upload:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido no upload'
    };
  }
}

// Função para remover logo do storage
export async function removeBrandLogo(storagePath: string) {
  try {
    const { error } = await supabase.storage
      .from('brand-assets')
      .remove([storagePath]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao remover arquivo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}
