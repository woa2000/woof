const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carregar variáveis do arquivo .env.local
console.log('🔍 Verificando configuração do Supabase...\n');

try {
  const envPath = path.join(__dirname, '../../.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Parse das variáveis do arquivo .env.local
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && key.startsWith('NEXT_PUBLIC_')) {
      process.env[key] = value;
    }
  });
} catch (error) {
  console.log('⚠️  Não foi possível carregar .env.local:', error.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📋 Variáveis de ambiente:');
console.log('- SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Não configurada');
console.log('- SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada');

if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
  console.log('\n❌ PROBLEMA ENCONTRADO:');
  console.log('A URL do Supabase não está configurada ou está usando o valor placeholder.');
  console.log('\n💡 SOLUÇÃO:');
  console.log('1. Crie um arquivo .env.local na raiz do projeto');
  console.log('2. Adicione as seguintes variáveis:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=sua_url_real_aqui');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_real_aqui');
  console.log('\n📚 Para obter essas credenciais, acesse:');
  console.log('- app.supabase.com > Seu Projeto > Settings > API');
  process.exit(1);
}

if (!supabaseAnonKey || supabaseAnonKey === 'placeholder-key') {
  console.log('\n❌ PROBLEMA ENCONTRADO:');
  console.log('A chave anônima do Supabase não está configurada ou está usando o valor placeholder.');
  console.log('\n💡 SOLUÇÃO:');
  console.log('Configure a variável NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local');
  process.exit(1);
}

// Tentar conectar e testar o storage
async function testStorage() {
  try {
    console.log('\n🔗 Testando conexão com Supabase...');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Testar listagem de buckets
    console.log('📦 Verificando buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.log('❌ Erro ao listar buckets:', listError.message);
      return false;
    }
    
    console.log('✅ Buckets encontrados:', buckets?.length || 0);
    
    // Verificar se o bucket brand-assets existe
    const brandAssetsBucket = buckets?.find(bucket => bucket.id === 'brand-assets');
    
    if (!brandAssetsBucket) {
      console.log('⚠️  Bucket "brand-assets" não encontrado');
      console.log('🔧 Tentando criar bucket...');
      
      const { error: createError } = await supabase.storage.createBucket('brand-assets', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        console.log('❌ Erro ao criar bucket:', createError.message);
        console.log('\n💡 POSSÍVEIS SOLUÇÕES:');
        console.log('1. Verificar se você tem permissões de administrador no projeto');
        console.log('2. Criar o bucket manualmente no painel do Supabase:');
        console.log('   - Acesse Storage > Buckets');
        console.log('   - Clique em "New bucket"');
        console.log('   - Nome: brand-assets');
        console.log('   - Público: Sim');
        console.log('3. Executar o SQL de configuração do storage:');
        console.log('   - Acesse SQL Editor no Supabase');
        console.log('   - Execute o conteúdo de sql/storage_setup.sql');
        return false;
      } else {
        console.log('✅ Bucket "brand-assets" criado com sucesso!');
      }
    } else {
      console.log('✅ Bucket "brand-assets" já existe');
    }
    
    console.log('\n🎉 Configuração do storage está funcionando!');
    return true;
    
  } catch (error) {
    console.log('❌ Erro na conexão:', error.message);
    console.log('\n💡 VERIFICAÇÕES:');
    console.log('1. Verifique se as credenciais estão corretas');
    console.log('2. Confirme se o projeto Supabase está ativo');
    console.log('3. Teste a conectividade de rede');
    return false;
  }
}

// Executar teste
testStorage().then(success => {
  if (success) {
    console.log('\n✅ Diagnóstico concluído: Sistema pronto para upload!');
  } else {
    console.log('\n❌ Diagnóstico concluído: Problemas encontrados');
  }
  process.exit(success ? 0 : 1);
});
