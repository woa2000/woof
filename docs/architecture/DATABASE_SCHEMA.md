# 🗄️ Database Schema - Agência Pet Operada por IA

Este documento descreve o esquema completo do banco de dados da **Plataforma Woof Marketing**, incluindo as entidades específicas para operação de agência pet com **80% automação por IA**.

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Entidades Core](#-entidades-core)
3. [Entidades Pet-Específicas](#-entidades-pet-específicas)
4. [Entidades de IA](#-entidades-de-ia)
5. [Row Level Security](#-row-level-security)
6. [Índices e Performance](#-índices-e-performance)
7. [Migrations](#-migrations)

---

## 🎯 Visão Geral

O banco de dados é estruturado para suportar:
- **Multi-tenancy** com RLS (Row Level Security)
- **Brand Voice JSON** para consistência de IA
- **Campanhas Pet** específicas por categoria
- **Jornadas automatizadas** de marketing
- **Compliance veterinário** integrado
- **Métricas pet** (agendamentos, recalls, etc.)

### Diagrama ER (Principais Entidades)

```
[users] 1-N [brands] 1-N [brand_manuals] 
   │           │            │
   │           │            └── [brand_assets]
   │           │
   │           ├── [anamneses_digitais]
   │           ├── [calendar_items] 1-N [content_variants]
   │           ├── [pet_campaign_kits] 1-N [campaign_instances]
   │           ├── [journeys] 1-N [journey_steps] 1-N [journey_logs]
   │           └── [ads_campaigns] 1-N [ad_creatives] 1-N [ad_metrics_daily]
```

---

## 👥 Entidades Core

### Users e Profiles

```sql
-- Estende auth.users do Supabase
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email VARCHAR NOT NULL,
  full_name VARCHAR,
  avatar_url VARCHAR,
  business_name VARCHAR,
  business_type pet_business_type DEFAULT 'pet_shop',
  phone VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum para tipos de negócio pet
CREATE TYPE pet_business_type AS ENUM (
  'pet_shop',
  'veterinary_clinic',
  'grooming_salon',
  'pet_hotel',
  'dog_training',
  'pet_franchise'
);
```

### Brands (Central Hub)

```sql
CREATE TABLE public.brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  name VARCHAR NOT NULL,
  business_type pet_business_type NOT NULL,
  logo_url VARCHAR,
  website_url VARCHAR,
  
  -- Brand Voice JSON para IA
  brand_voice JSONB DEFAULT '{
    "tone": "amigável, profissional, pet-friendly",
    "persona": "veterinário experiente que ama animais",
    "approved_terms": [],
    "blocked_terms": ["barato", "promoção", "oferta"],
    "compliance_rules": {
      "veterinary": true,
      "disclaimers": ["Consulte sempre um veterinário"]
    },
    "business_context": {}
  }',
  
  -- Configurações específicas
  primary_color VARCHAR(7), -- Hex color
  secondary_color VARCHAR(7),
  target_audience JSONB DEFAULT '{}',
  
  -- Compliance
  veterinary_license VARCHAR,
  responsible_veterinarian VARCHAR,
  
  -- Status
  status brand_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE brand_status AS ENUM ('active', 'inactive', 'suspended');
```

---

## 🐾 Entidades Pet-Específicas

### Pet Campaign Kits

```sql
-- Kits de campanha pré-prontos para negócios pet
CREATE TABLE public.pet_campaign_kits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  category pet_campaign_category NOT NULL,
  business_types pet_business_type[] NOT NULL,
  
  -- Templates de conteúdo
  templates JSONB DEFAULT '{
    "post_templates": [],
    "ad_templates": [],
    "email_templates": []
  }',
  
  -- Configurações da campanha
  default_goals JSONB DEFAULT '{
    "primary": "awareness",
    "metrics": ["impressions", "engagement", "appointments"]
  }',
  
  -- Segmentação recomendada
  target_audience JSONB DEFAULT '{}',
  recommended_budget_range JSONB DEFAULT '{"min": 200, "max": 1000}',
  
  -- Compliance específico
  compliance_requirements JSONB DEFAULT '{
    "veterinary_approval": false,
    "disclaimers": [],
    "prohibited_claims": []
  }',
  
  -- Meta dados
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE pet_campaign_category AS ENUM (
  'vaccination',
  'grooming',
  'checkup',
  'dental_care',
  'nutrition',
  'seasonal',
  'adoption',
  'emergency_care'
);
```

### Campaign Instances

```sql
-- Instâncias de campanhas específicas por marca
CREATE TABLE public.campaign_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brands(id) NOT NULL,
  kit_id UUID REFERENCES public.pet_campaign_kits(id) NOT NULL,
  
  name VARCHAR NOT NULL,
  status campaign_status DEFAULT 'draft',
  
  -- Customizações da campanha
  customizations JSONB DEFAULT '{}',
  target_metrics JSONB DEFAULT '{}',
  budget_allocated DECIMAL(10,2),
  
  -- Datas
  start_date DATE,
  end_date DATE,
  
  -- Resultados
  performance_metrics JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE campaign_status AS ENUM (
  'draft', 'active', 'paused', 'completed', 'cancelled'
);
```

### Anamneses Digitais Pet

```sql
CREATE TABLE public.anamneses_digitais (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brands(id) NOT NULL,
  
  -- Site analisado
  website_url VARCHAR NOT NULL,
  analysis_type anamnese_type DEFAULT 'complete',
  
  -- Dados da análise por IA
  website_data JSONB NOT NULL, -- Raw data coletado
  ai_analysis JSONB NOT NULL, -- Análise processada por IA
  
  -- Personas identificadas
  personas JSONB DEFAULT '[]',
  
  -- Recomendações específicas para pet
  pet_recommendations JSONB DEFAULT '{
    "quick_wins": [],
    "medium_term": [],
    "long_term": [],
    "compliance_issues": []
  }',
  
  -- Análise de concorrência pet
  competitors_analysis JSONB DEFAULT '{}',
  
  -- Score geral (1-10)
  overall_score INTEGER CHECK (overall_score >= 1 AND overall_score <= 10),
  
  -- Status
  status anamnese_status DEFAULT 'completed',
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE anamnese_type AS ENUM ('complete', 'quick', 'competitor');
CREATE TYPE anamnese_status AS ENUM ('processing', 'completed', 'failed');
```

---

## 🤖 Entidades de IA

### Content Variants (Geração de IA)

```sql
CREATE TABLE public.content_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_item_id UUID REFERENCES public.calendar_items(id) NOT NULL,
  
  -- Conteúdo gerado
  title VARCHAR(100),
  content TEXT NOT NULL,
  hashtags TEXT[],
  call_to_action VARCHAR(200),
  
  -- Metadados de IA
  ai_model VARCHAR DEFAULT 'gpt-4o',
  generation_prompt TEXT, -- Prompt usado para gerar
  ai_confidence DECIMAL(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  
  -- Scores de qualidade
  brand_alignment_score INTEGER CHECK (brand_alignment_score >= 1 AND brand_alignment_score <= 10),
  compliance_score INTEGER CHECK (compliance_score >= 1 AND compliance_score <= 10),
  engagement_prediction DECIMAL(3,2),
  
  -- Validações
  compliance_check JSONB DEFAULT '{
    "veterinary_approved": false,
    "blocked_terms_found": [],
    "disclaimers_included": false,
    "manual_review_required": false
  }',
  
  -- Status e aprovação (20% humano)
  status content_status DEFAULT 'generated',
  approved_by UUID REFERENCES auth.users,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE content_status AS ENUM (
  'generated', 'reviewing', 'approved', 'rejected', 'published'
);
```

### AI Operation Logs

```sql
-- Log de operações de IA para monitoring e custos
CREATE TABLE public.ai_operation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brands(id) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  
  -- Operação
  operation_type ai_operation_type NOT NULL,
  model_used VARCHAR NOT NULL,
  
  -- Contexto
  input_data JSONB,
  output_data JSONB,
  
  -- Métricas
  tokens_input INTEGER,
  tokens_output INTEGER,
  estimated_cost DECIMAL(8,4),
  processing_time_ms INTEGER,
  
  -- Status
  status operation_status DEFAULT 'completed',
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE ai_operation_type AS ENUM (
  'content_generation',
  'brand_analysis',
  'anamnese_analysis',
  'compliance_check',
  'performance_optimization'
);

CREATE TYPE operation_status AS ENUM (
  'processing', 'completed', 'failed', 'cancelled'
);
```

---

## 📧 Jornadas Automatizadas

### Journeys

```sql
CREATE TABLE public.journeys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brands(id) NOT NULL,
  
  name VARCHAR NOT NULL,
  description TEXT,
  journey_type pet_journey_type NOT NULL,
  
  -- Trigger da jornada
  trigger_event journey_trigger NOT NULL,
  trigger_conditions JSONB DEFAULT '{}',
  
  -- Configurações
  is_active BOOLEAN DEFAULT TRUE,
  max_participants INTEGER DEFAULT 1000,
  
  -- Métricas
  total_participants INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2),
  conversion_rate DECIMAL(5,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE pet_journey_type AS ENUM (
  'vaccination_reminder',
  'grooming_follow_up',
  'checkup_recall',
  'new_client_onboarding',
  'loyalty_program'
);

CREATE TYPE journey_trigger AS ENUM (
  'form_submission',
  'appointment_scheduled',
  'service_completed',
  'date_based',
  'behavior_based'
);
```

### Journey Steps

```sql
CREATE TABLE public.journey_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES public.journeys(id) NOT NULL,
  
  step_order INTEGER NOT NULL,
  step_type step_type NOT NULL,
  name VARCHAR NOT NULL,
  
  -- Timing
  delay_hours INTEGER DEFAULT 0,
  delay_days INTEGER DEFAULT 0,
  
  -- Conteúdo (gerado por IA)
  content_template JSONB DEFAULT '{}',
  
  -- Condições de execução
  conditions JSONB DEFAULT '{}',
  
  -- Métricas por step
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE step_type AS ENUM (
  'email',
  'whatsapp',
  'sms',
  'landing_page',
  'wait',
  'condition'
);
```

### Journey Logs

```sql
CREATE TABLE public.journey_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journey_id UUID REFERENCES public.journeys(id) NOT NULL,
  step_id UUID REFERENCES public.journey_steps(id),
  
  -- Participante
  participant_email VARCHAR,
  participant_phone VARCHAR,
  participant_data JSONB DEFAULT '{}',
  
  -- Execução
  action_taken log_action NOT NULL,
  status log_status DEFAULT 'success',
  
  -- Metadados
  external_id VARCHAR, -- ID de envio do provedor
  response_data JSONB,
  error_message TEXT,
  
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE log_action AS ENUM (
  'journey_started',
  'step_executed',
  'email_sent',
  'whatsapp_sent',
  'opened',
  'clicked',
  'opted_out',
  'journey_completed'
);

CREATE TYPE log_status AS ENUM ('success', 'failed', 'pending');
```

---

## 📊 Ads com Guardrails

### Ads Campaigns

```sql
CREATE TABLE public.ads_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brands(id) NOT NULL,
  campaign_instance_id UUID REFERENCES public.campaign_instances(id),
  
  name VARCHAR NOT NULL,
  platform ads_platform NOT NULL,
  objective campaign_objective NOT NULL,
  
  -- Budget e targeting
  daily_budget DECIMAL(10,2) NOT NULL,
  total_budget DECIMAL(10,2),
  target_audience JSONB DEFAULT '{}',
  
  -- Guardrails automáticos
  guardrails JSONB DEFAULT '{
    "max_cpa": null,
    "min_ctr": 0.01,
    "auto_pause_enabled": true,
    "performance_window_hours": 48
  }',
  
  -- Status e datas
  status ads_campaign_status DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  
  -- IDs externos
  external_campaign_id VARCHAR,
  external_account_id VARCHAR,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE ads_platform AS ENUM ('meta', 'google_ads', 'linkedin');
CREATE TYPE campaign_objective AS ENUM (
  'awareness', 'reach', 'traffic', 'engagement', 
  'leads', 'conversions', 'app_installs'
);
CREATE TYPE ads_campaign_status AS ENUM (
  'draft', 'active', 'paused', 'auto_paused', 'completed', 'cancelled'
);
```

### Ad Creatives

```sql
CREATE TABLE public.ad_creatives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.ads_campaigns(id) NOT NULL,
  content_variant_id UUID REFERENCES public.content_variants(id),
  
  -- Creative assets
  headline VARCHAR(100),
  description TEXT,
  call_to_action VARCHAR(50),
  image_url VARCHAR,
  video_url VARCHAR,
  
  -- Performance atual
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  
  -- Métricas calculadas
  ctr DECIMAL(5,4) DEFAULT 0,
  cpa DECIMAL(10,2) DEFAULT 0,
  cpc DECIMAL(10,2) DEFAULT 0,
  
  -- Guardrails status
  auto_paused_at TIMESTAMP WITH TIME ZONE,
  auto_pause_reason VARCHAR,
  
  -- Status
  status creative_status DEFAULT 'active',
  external_creative_id VARCHAR,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE creative_status AS ENUM (
  'active', 'paused', 'auto_paused', 'rejected', 'learning'
);
```

---

## 📈 Métricas Pet-Específicas

### Pet Metrics Daily

```sql
-- Métricas diárias específicas para negócios pet
CREATE TABLE public.pet_metrics_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES public.brands(id) NOT NULL,
  metric_date DATE NOT NULL,
  
  -- Métricas de agendamento (principais para pet)
  appointments_scheduled INTEGER DEFAULT 0,
  appointments_completed INTEGER DEFAULT 0,
  appointments_cancelled INTEGER DEFAULT 0,
  no_shows INTEGER DEFAULT 0,
  
  -- Recalls e follow-ups
  vaccination_recalls_sent INTEGER DEFAULT 0,
  grooming_reminders_sent INTEGER DEFAULT 0,
  checkup_recalls_sent INTEGER DEFAULT 0,
  recall_response_rate DECIMAL(5,2) DEFAULT 0,
  
  -- Métricas financeiras pet
  average_ticket DECIMAL(10,2) DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  service_revenue DECIMAL(12,2) DEFAULT 0,
  product_revenue DECIMAL(12,2) DEFAULT 0,
  
  -- Métricas de marketing
  leads_generated INTEGER DEFAULT 0,
  cost_per_lead DECIMAL(10,2) DEFAULT 0,
  cost_per_appointment DECIMAL(10,2) DEFAULT 0,
  
  -- Específico por tipo de serviço
  vaccination_bookings INTEGER DEFAULT 0,
  grooming_bookings INTEGER DEFAULT 0,
  consultation_bookings INTEGER DEFAULT 0,
  emergency_calls INTEGER DEFAULT 0,
  
  -- Engajamento de conteúdo
  pet_content_impressions INTEGER DEFAULT 0,
  pet_content_engagements INTEGER DEFAULT 0,
  educational_content_views INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(brand_id, metric_date)
);
```

---

## 🔒 Row Level Security (RLS)

### Políticas Principais

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anamneses_digitais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_campaigns ENABLE ROW LEVEL SECURITY;

-- Política para profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Política para brands (central)
CREATE POLICY "Users can manage own brands" 
ON public.brands FOR ALL 
USING (auth.uid() = user_id);

-- Política para brand_manuals
CREATE POLICY "Users can manage own brand manuals" 
ON public.brand_manuals FOR ALL 
USING (auth.uid() = (SELECT user_id FROM brands WHERE brands.id = brand_manuals.brand_id));

-- Política para content_variants (através de calendar_items)
CREATE POLICY "Users can manage own content variants" 
ON public.content_variants FOR ALL 
USING (
  auth.uid() = (
    SELECT b.user_id 
    FROM brands b 
    JOIN calendar_items ci ON b.id = ci.brand_id 
    WHERE ci.id = content_variants.calendar_item_id
  )
);

-- Política para AI logs (auditoria)
CREATE POLICY "Users can view own AI operations" 
ON public.ai_operation_logs FOR SELECT 
USING (auth.uid() = user_id);

-- Política para métricas pet
CREATE POLICY "Users can view own pet metrics" 
ON public.pet_metrics_daily FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM brands WHERE brands.id = pet_metrics_daily.brand_id));
```

---

## 🚀 Índices e Performance

### Índices Principais

```sql
-- Índices para consultas frequentes
CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_brands_business_type ON brands(business_type);
CREATE INDEX idx_brands_status ON brands(status) WHERE status = 'active';

-- Índices compostos para métricas
CREATE INDEX idx_pet_metrics_brand_date ON pet_metrics_daily(brand_id, metric_date DESC);
CREATE INDEX idx_ai_logs_brand_operation ON ai_operation_logs(brand_id, operation_type, created_at DESC);

-- Índices para campanhas
CREATE INDEX idx_campaigns_brand_status ON ads_campaigns(brand_id, status) WHERE status IN ('active', 'paused');
CREATE INDEX idx_content_variants_calendar ON content_variants(calendar_item_id, status);

-- Índices para jornadas
CREATE INDEX idx_journeys_brand_active ON journeys(brand_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_journey_logs_execution ON journey_logs(journey_id, executed_at DESC);

-- Índices GIN para JSONB (Brand Voice e análises)
CREATE INDEX idx_brands_brand_voice_gin ON brands USING GIN (brand_voice);
CREATE INDEX idx_anamnese_ai_analysis_gin ON anamneses_digitais USING GIN (ai_analysis);
CREATE INDEX idx_content_compliance_gin ON content_variants USING GIN (compliance_check);
```

---

## 📦 Migrations

### Migration Example - Pet Campaign Kits

```sql
-- Migration: 20250824_001_create_pet_campaign_kits.sql
BEGIN;

-- Criar enum types
CREATE TYPE pet_campaign_category AS ENUM (
  'vaccination',
  'grooming', 
  'checkup',
  'dental_care',
  'nutrition',
  'seasonal',
  'adoption',
  'emergency_care'
);

-- Criar tabela principal
CREATE TABLE public.pet_campaign_kits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  category pet_campaign_category NOT NULL,
  business_types pet_business_type[] NOT NULL,
  templates JSONB DEFAULT '{}',
  default_goals JSONB DEFAULT '{}',
  target_audience JSONB DEFAULT '{}',
  recommended_budget_range JSONB DEFAULT '{}',
  compliance_requirements JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.pet_campaign_kits ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler kits ativos (são templates globais)
CREATE POLICY "All authenticated users can read active campaign kits" 
ON public.pet_campaign_kits FOR SELECT 
TO authenticated
USING (is_active = TRUE);

-- Inserir kits iniciais
INSERT INTO public.pet_campaign_kits (name, category, business_types, templates) VALUES
('Campanha de Vacinação V1', 'vaccination', ARRAY['veterinary_clinic', 'pet_shop'], '{
  "post_templates": [
    {
      "title": "🐕 Hora da Vacinação!",
      "content": "Proteja seu melhor amigo com a vacinação em dia. Agende já sua consulta!",
      "hashtags": ["#VacinacaoPet", "#SaudePet", "#VeterinarioDeConfianca"]
    }
  ]
}'),
('Promoção Banho e Tosa', 'grooming', ARRAY['grooming_salon', 'pet_shop'], '{
  "post_templates": [
    {
      "title": "✨ Seu pet mais bonito!",
      "content": "Banho e tosa com produtos de qualidade. Seu pet merece o melhor cuidado!",
      "hashtags": ["#BanhoETosa", "#PetLindo", "#CuidadosPet"]
    }
  ]
}');

COMMIT;
```

---

## 🔧 Funções Auxiliares

### Função para Brand Voice Validation

```sql
-- Função para validar Brand Voice JSON
CREATE OR REPLACE FUNCTION validate_brand_voice(voice_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar campos obrigatórios
  IF NOT (voice_data ? 'tone' AND voice_data ? 'persona') THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar se arrays existem
  IF NOT (voice_data ? 'approved_terms' AND voice_data ? 'blocked_terms') THEN
    RETURN FALSE;
  END IF;
  
  -- Verificar compliance rules
  IF NOT (voice_data ? 'compliance_rules' AND voice_data->'compliance_rules' ? 'veterinary') THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Constraint usando a função
ALTER TABLE brands ADD CONSTRAINT valid_brand_voice 
CHECK (validate_brand_voice(brand_voice));
```

### View para Métricas Consolidadas

```sql
-- View para métricas mensais consolidadas
CREATE VIEW monthly_pet_metrics AS 
SELECT 
  brand_id,
  DATE_TRUNC('month', metric_date) as month,
  SUM(appointments_scheduled) as total_appointments,
  SUM(appointments_completed) as completed_appointments,
  ROUND(AVG(average_ticket), 2) as avg_ticket,
  SUM(total_revenue) as monthly_revenue,
  SUM(leads_generated) as total_leads,
  ROUND(AVG(cost_per_lead), 2) as avg_cost_per_lead
FROM pet_metrics_daily 
GROUP BY brand_id, DATE_TRUNC('month', metric_date)
ORDER BY brand_id, month DESC;
```

---

**Última atualização:** 24 de agosto de 2025  
**Versão:** 2.0  
**Status:** ✅ Completo - Schema para agência pet com IA