// Teste de conectividade com Supabase
import { supabase } from '@/lib/auth/supabase';

export async function testSupabaseConnection() {
  try {
    console.log('Testando conexão com Supabase...');
    
    // Testar conexão básica
    const { data, error } = await supabase.from('brand_manuals').select('id').limit(1);
    
    if (error) {
      console.error('Erro na conexão:', error);
      return false;
    }
    
    console.log('Conexão com Supabase OK');
    
    // Testar storage
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.error('Erro no storage:', storageError);
      return false;
    }
    
    console.log('Buckets disponíveis:', buckets?.map(b => b.name));
    return true;
    
  } catch (error) {
    console.error('Erro inesperado:', error);
    return false;
  }
}
