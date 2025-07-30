const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carregar variáveis do arquivo .env.local
try {
  const envPath = path.join(__dirname, '../../.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
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

async function checkAuthAndStorage() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  console.log('🔐 Verificando estado da autenticação...');
  
  // Verificar usuário atual
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.log('❌ Erro de autenticação:', authError.message);
  }
  
  if (user) {
    console.log('✅ Usuário logado:', user.email);
  } else {
    console.log('⚠️  Nenhum usuário logado (usando chave anônima)');
  }
  
  console.log('\n📦 Verificando política do storage...');
  
  // Tentar verificar se conseguimos acessar storage policies
  const { data, error } = await supabase
    .from('storage.buckets')
    .select('*')
    .limit(1);
    
  if (error) {
    console.log('❌ Erro ao verificar políticas:', error.message);
    console.log('\n🔧 SOLUÇÕES POSSÍVEIS:');
    console.log('1. O bucket precisa ser criado MANUALMENTE no painel do Supabase');
    console.log('2. Execute o SQL do arquivo sql/storage_setup.sql no SQL Editor');
    console.log('3. Certifique-se de que as políticas RLS estão configuradas corretamente');
  } else {
    console.log('✅ Acesso às configurações de storage funcionando');
  }
  
  console.log('\n💡 RECOMENDAÇÃO IMEDIATA:');
  console.log('Entre no painel do Supabase e crie o bucket manualmente:');
  console.log('1. Acesse https://supabase.com/dashboard/project/' + supabaseUrl.split('.')[0].split('//')[1]);
  console.log('2. Vá em Storage > Buckets');
  console.log('3. Clique em "New bucket"');
  console.log('4. Nome: brand-assets');
  console.log('5. Marque como "Public bucket"');
  console.log('6. Confirme');
}

checkAuthAndStorage();
