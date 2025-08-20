import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestManual() {
  try {
    // Ler o arquivo JSON com os dados do manual
    const jsonPath = join(process.cwd(), 'docs', 'manual-marca.json');
    const manualData = JSON.parse(readFileSync(jsonPath, 'utf8'));

    // Criar o manual no Supabase
    const { data, error } = await supabase
      .from('brand_manuals')
      .insert({
        brand_name: 'Woof Marketing',
        description: 'Manual de marca completo da Woof com capítulo 09 implementado',
        manual_data: manualData,
        status: 'published',
        created_by: 'test-user',
        version: '1.0',
        tags: ['teste', 'completo', 'banners']
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar manual:', error);
      return;
    }

    console.log('Manual criado com sucesso!');
    console.log('ID:', data.id);
    console.log('URL:', `http://localhost:3001/manual-marca/${data.id}`);
    
    return data;
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  createTestManual();
}

export default createTestManual;
