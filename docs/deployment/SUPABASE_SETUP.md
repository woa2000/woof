# 🚀 Configuração do Supabase para Autenticação - Woof Marketing Platform

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto Woof configurado localmente

## 🔧 Configuração do Projeto Supabase

### 1. Criar Projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Clique em **"New Project"**
3. Configure:
   - **Name**: `woof-marketing-platform`
   - **Database Password**: Use uma senha forte
   - **Region**: Escolha a região mais próxima (ex: São Paulo)
4. Clique em **"Create new project"**

### 2. Obter Credenciais do Projeto

Após a criação, acesse **Settings > API**:

```bash
# URL do projeto
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co

# Chave pública (anon key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
# Copie as credenciais do Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

## 🔐 Configuração de Autenticação

### 1. Configurar Provedores de Login

#### Email/Senha (Já configurado)
No painel Supabase, vá em **Authentication > Settings**:
- ✅ **Enable email confirmations**: Habilitado
- ✅ **Enable email change confirmations**: Habilitado

#### Google OAuth
1. Acesse **Authentication > Providers**
2. Habilite **Google**
3. Configure:
   ```
   Client ID: seu_google_client_id
   Client Secret: seu_google_client_secret
   ```
4. Adicione URLs de redirect:
   ```
   http://localhost:3000/auth/callback
   https://seu-dominio.com/auth/callback
   ```

#### Facebook OAuth
1. Acesse **Authentication > Providers**
2. Habilite **Facebook**
3. Configure:
   ```
   Client ID: seu_facebook_app_id
   Client Secret: seu_facebook_app_secret
   ```

### 2. Configurar URLs de Redirecionamento

Em **Authentication > URL Configuration**:

```bash
# URLs de desenvolvimento
Site URL: http://localhost:3000
Redirect URLs: 
- http://localhost:3000/auth/callback
- http://localhost:3000/dashboard

# URLs de produção (adicionar quando fazer deploy)
Redirect URLs:
- https://seu-dominio.com/auth/callback
- https://seu-dominio.com/dashboard
```

## 📊 Configuração do Banco de Dados

### 1. Tabelas Necessárias

O Supabase já cria automaticamente as tabelas de autenticação. Para dados adicionais do usuário, você pode criar:

```sql
-- Tabela para perfis de usuário (opcional)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  clinic_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários só acessarem seus próprios dados
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Configurar RLS (Row Level Security)

No SQL Editor do Supabase, execute:

```sql
-- Habilitar RLS para segurança
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando usuário se cadastra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## ✅ Testando a Configuração

### 1. Verificar Conexão

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

### 2. Testar Autenticação

1. Acesse `http://localhost:3000`
2. Será redirecionado para `/login`
3. Tente fazer login/cadastro
4. Verifique se o redirecionamento funciona

### 3. Verificar no Painel Supabase

- Vá em **Authentication > Users**
- Verifique se os usuários aparecem após cadastro
- Teste as funcionalidades de login/logout

## 🔒 Configurações de Segurança

### 1. RLS (Row Level Security)
```sql
-- Sempre habilite RLS para tabelas públicas
ALTER TABLE public.sua_tabela ENABLE ROW LEVEL SECURITY;
```

### 2. Políticas de Acesso
```sql
-- Exemplo: usuário só acessa seus próprios dados
CREATE POLICY "Users access own data" ON public.sua_tabela
  FOR ALL USING (auth.uid() = user_id);
```

### 3. Configurações de Email

Em **Authentication > Settings**:
- Configure SMTP customizado (opcional)
- Personalize templates de email
- Configure domínio de email personalizado

## 🚀 Deploy e Produção

### 1. Variáveis de Ambiente

No Vercel/sua plataforma de deploy:
```bash
NEXT_PUBLIC_SUPABASE_URL=sua_url_producao
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_producao
```

### 2. URLs de Produção

Atualize no Supabase:
- Site URL: `https://seu-dominio.com`
- Redirect URLs: Adicione URLs de produção

## 📝 Próximos Passos

1. ✅ Configurar projeto Supabase
2. ✅ Adicionar variáveis de ambiente
3. ✅ Testar login/logout
4. ⏳ Configurar provedores OAuth (Google/Facebook)
5. ⏳ Personalizar emails de confirmação
6. ⏳ Implementar recuperação de senha
7. ⏳ Configurar perfis de usuário

## 🆘 Troubleshooting

### Erro: "Invalid API key"
- Verifique se as variáveis de ambiente estão corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Invalid redirect URL"
- Adicione todas as URLs no painel do Supabase
- Verifique se não há typos nas URLs

### Login social não funciona
- Verifique configuração do provedor
- Confirme Client ID e Secret
- Teste URLs de callback

---

A configuração do Supabase está pronta! O sistema de autenticação da Woof agora está totalmente funcional com as melhores práticas de segurança. 🐶✨
