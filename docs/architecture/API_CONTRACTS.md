# 🔗 API Contracts - Agência Pet Operada por IA

Documentação completa dos contratos de API da **Plataforma Woof Marketing**, incluindo endpoints específicos para **80% automação por IA** e funcionalidades pet.

## 📋 Índice

1. [Convenções Gerais](#-convenções-gerais)
2. [Autenticação](#-autenticação)
3. [APIs de IA](#-apis-de-ia)
4. [APIs Pet-Específicas](#-apis-pet-específicas)
5. [APIs de Campanhas](#-apis-de-campanhas)
6. [APIs de Jornadas](#-apis-de-jornadas)
7. [APIs de Métricas Pet](#-apis-de-métricas-pet)
8. [Error Handling](#-error-handling)

---

## 🎯 Convenções Gerais

### Base URL
```
Production: https://app.woofmarketing.com.br/api
Staging: https://staging.woofmarketing.com.br/api
```

### Headers Padrão
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
X-API-Version: v2.0
```

### Formato de Resposta
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: PaginationMeta;
    ai_usage?: AIUsageMeta;
  };
}

interface AIUsageMeta {
  model_used: string;
  tokens_consumed: number;
  estimated_cost: number;
  processing_time_ms: number;
}
```

---

## 🔐 Autenticação

### Login com Brand Context
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@petshop.com",
  "password": "password",
  "brand_context": true // Retorna info da marca ativa
}
```

**Response:**
```typescript
interface LoginResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    business_type: PetBusinessType;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
  };
  active_brand?: {
    id: string;
    name: string;
    business_type: PetBusinessType;
    brand_voice: BrandVoiceJSON;
  };
}
```

---

## 🤖 APIs de IA

### Brand Voice Analysis
Analisa materiais existentes e gera Brand Voice JSON para IA.

```http
POST /ai/brand-voice/analyze
Content-Type: application/json

{
  "brand_id": "uuid",
  "materials": [
    {
      "type": "website",
      "url": "https://petshop.com"
    },
    {
      "type": "social_media", 
      "platform": "instagram",
      "profile": "@petshopexemplo"
    },
    {
      "type": "document",
      "content": "Nossa missão é cuidar com amor..."
    }
  ],
  "business_context": {
    "type": "pet_shop",
    "target_audience": "donos de pets classe média",
    "location": "São Paulo, SP"
  }
}
```

**Response:**
```typescript
interface BrandVoiceAnalysisResponse {
  brand_voice: {
    tone: string; // "amigável, profissional, pet-friendly"
    persona: string; // "veterinário experiente que ama animais"
    approved_terms: string[];
    blocked_terms: string[];
    compliance_rules: {
      veterinary: boolean;
      disclaimers: string[];
      prohibited_claims: string[];
    };
    business_context: {
      specialties: string[];
      unique_selling_points: string[];
      competitor_differentiation: string;
    };
  };
  confidence_score: number; // 0-1
  recommendations: string[];
  ai_usage: AIUsageMeta;
}
```

### Content Generation
Gera variações de conteúdo usando Brand Voice JSON.

```http
POST /ai/content/generate
Content-Type: application/json

{
  "brand_id": "uuid",
  "campaign_type": "vaccination",
  "channel": "instagram",
  "context": {
    "target_pet": "cães",
    "season": "inverno",
    "promotion": false,
    "cta_type": "appointment"
  },
  "variants": 3,
  "custom_instructions": "Foque em prevenção, não em medo"
}
```

**Response:**
```typescript
interface ContentGenerationResponse {
  variants: Array<{
    id: string;
    title: string;
    content: string;
    hashtags: string[];
    call_to_action: string;
    scores: {
      brand_alignment: number; // 1-10
      compliance: number; // 1-10
      engagement_prediction: number; // 0-1
    };
    compliance_check: {
      veterinary_approved: boolean;
      blocked_terms_found: string[];
      disclaimers_included: boolean;
      manual_review_required: boolean;
    };
  }>;
  ai_usage: AIUsageMeta;
}
```

### Compliance Validation
Valida conteúdo contra regras veterinárias e da marca.

```http
POST /ai/compliance/validate
Content-Type: application/json

{
  "content": "Este produto cura todas as doenças do seu pet",
  "brand_id": "uuid",
  "content_type": "social_post",
  "strict_mode": true
}
```

**Response:**
```typescript
interface ComplianceValidationResponse {
  is_valid: boolean;
  violations: Array<{
    type: 'MEDICAL_CLAIM' | 'BLOCKED_TERM' | 'MISSING_DISCLAIMER';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    suggested_fix?: string;
  }>;
  required_disclaimers: string[];
  score: number; // 1-10
  ai_usage: AIUsageMeta;
}
```

---

## 🐾 APIs Pet-Específicas

### Pet Campaign Kits
Lista kits de campanha pré-prontos para negócios pet.

```http
GET /pet/campaign-kits
Query Parameters:
- business_type: pet_shop | veterinary_clinic | grooming_salon
- category: vaccination | grooming | checkup | seasonal
- page: number
- limit: number
```

**Response:**
```typescript
interface PetCampaignKitsResponse {
  kits: Array<{
    id: string;
    name: string;
    category: PetCampaignCategory;
    description: string;
    business_types: PetBusinessType[];
    templates: {
      post_templates: ContentTemplate[];
      ad_templates: AdTemplate[];
      email_templates: EmailTemplate[];
    };
    default_goals: {
      primary: string;
      metrics: string[];
    };
    estimated_performance: {
      avg_ctr: number;
      avg_cpa: number;
      success_rate: number;
    };
  }>;
  total: number;
  page: number;
  limit: number;
}
```

### Anamnese Digital Pet
Executa análise de IA específica para negócios pet.

```http
POST /pet/anamnese-digital
Content-Type: application/json

{
  "website_url": "https://clinicaveterinariaexemplo.com",
  "business_type": "veterinary_clinic",
  "analysis_depth": "complete",
  "include_competitors": true,
  "location": {
    "city": "São Paulo",
    "state": "SP",
    "neighborhood": "Vila Madalena"
  }
}
```

**Response:**
```typescript
interface AnamneseDigitalResponse {
  analysis_id: string;
  status: 'processing' | 'completed';
  results?: {
    overall_score: number; // 1-10
    website_analysis: {
      seo_score: number;
      ux_score: number;
      content_quality: number;
      mobile_friendliness: number;
      loading_speed: number;
    };
    pet_specific_analysis: {
      services_clarity: number;
      pricing_transparency: number;
      appointment_ease: number;
      trust_signals: number;
      emergency_info: number;
    };
    personas_identified: Array<{
      name: string;
      description: string;
      pain_points: string[];
      goals: string[];
      pet_types: string[];
    }>;
    competitors_analysis: Array<{
      name: string;
      website: string;
      strengths: string[];
      weaknesses: string[];
      differentiation_opportunities: string[];
    }>;
    recommendations: {
      quick_wins: Array<{
        title: string;
        description: string;
        impact: 'low' | 'medium' | 'high';
        effort: 'low' | 'medium' | 'high';
      }>;
      medium_term: Array<{
        title: string;
        description: string;
        timeline: string;
        resources_needed: string[];
      }>;
      compliance_issues: Array<{
        issue: string;
        severity: string;
        solution: string;
      }>;
    };
  };
  ai_usage: AIUsageMeta;
}
```

---

## 📱 APIs de Campanhas

### Campaign Instances
Cria instância de campanha baseada em kit pet.

```http
POST /campaigns/instances
Content-Type: application/json

{
  "brand_id": "uuid",
  "kit_id": "uuid",
  "name": "Campanha Vacinação Inverno 2025",
  "customizations": {
    "target_pets": ["cães", "gatos"],
    "age_focus": "filhotes",
    "custom_message": "Proteja seu filhote no inverno"
  },
  "budget": {
    "total": 1500.00,
    "daily": 50.00
  },
  "duration": {
    "start_date": "2025-06-01",
    "end_date": "2025-06-30"
  }
}
```

### Generate Campaign Content
Gera todo conteúdo da campanha usando IA.

```http
POST /campaigns/{campaign_id}/generate-content
Content-Type: application/json

{
  "channels": ["instagram", "facebook", "google_ads"],
  "content_mix": {
    "educational": 40,
    "promotional": 40,
    "engagement": 20
  },
  "posting_frequency": {
    "posts_per_week": 3,
    "ads_per_platform": 2
  }
}
```

---

## 🔄 APIs de Jornadas

### Create Pet Journey
Cria jornada automatizada específica para pets.

```http
POST /journeys
Content-Type: application/json

{
  "brand_id": "uuid",
  "name": "Lembrete Vacinação Anual",
  "type": "vaccination_reminder",
  "trigger": {
    "event": "date_based",
    "conditions": {
      "days_before_due": 30,
      "vaccine_type": "anual"
    }
  },
  "steps": [
    {
      "type": "email",
      "delay_days": 0,
      "content_template": {
        "subject": "🐕 Hora da vacina do {{pet_name}}!",
        "generate_with_ai": true,
        "tone": "friendly_reminder"
      }
    },
    {
      "type": "wait",
      "delay_days": 7
    },
    {
      "type": "whatsapp",
      "delay_days": 0,
      "content_template": {
        "message": "Olá! A vacina do {{pet_name}} vence em breve. Que tal agendar?",
        "generate_with_ai": true,
        "include_appointment_link": true
      }
    }
  ],
  "target_audience": {
    "pet_types": ["cães", "gatos"],
    "last_visit_days": 330
  }
}
```

### Execute Journey Step
Executa step de jornada com conteúdo gerado por IA.

```http
POST /journeys/{journey_id}/steps/{step_id}/execute
Content-Type: application/json

{
  "participant": {
    "email": "cliente@email.com",
    "phone": "+5511999999999",
    "data": {
      "pet_name": "Rex",
      "pet_type": "cão",
      "owner_name": "Maria Silva",
      "last_vaccine_date": "2024-06-15"
    }
  },
  "generate_personalized_content": true
}
```

---

## 📊 APIs de Métricas Pet

### Pet Metrics Dashboard
Retorna métricas específicas para negócios pet.

```http
GET /metrics/pet-dashboard
Query Parameters:
- brand_id: string (required)
- date_range: string (last_7_days | last_30_days | last_90_days | custom)
- start_date: string (YYYY-MM-DD, if custom)
- end_date: string (YYYY-MM-DD, if custom)
- group_by: string (day | week | month)
```

**Response:**
```typescript
interface PetMetricsDashboardResponse {
  overview: {
    period: string;
    total_appointments: number;
    completed_appointments: number;
    cancellation_rate: number;
    average_ticket: number;
    total_revenue: number;
    cost_per_appointment: number;
  };
  appointments: {
    by_service: Array<{
      service: string;
      count: number;
      revenue: number;
      growth: number; // % vs previous period
    }>;
    by_time: Array<{
      date: string;
      scheduled: number;
      completed: number;
      cancelled: number;
      no_shows: number;
    }>;
  };
  recalls_and_reminders: {
    vaccination_recalls: {
      sent: number;
      responded: number;
      response_rate: number;
    };
    grooming_reminders: {
      sent: number;
      booked: number;
      conversion_rate: number;
    };
    checkup_recalls: {
      sent: number;
      scheduled: number;
      conversion_rate: number;
    };
  };
  marketing_performance: {
    leads_generated: number;
    cost_per_lead: number;
    lead_to_appointment_rate: number;
    top_performing_campaigns: Array<{
      name: string;
      appointments: number;
      cost: number;
      roi: number;
    }>;
  };
  ai_performance: {
    content_generated: number;
    approval_rate: number; // % aprovado na primeira tentativa
    avg_generation_time: number; // segundos
    cost_savings_estimated: number; // R$ economizado vs criação manual
  };
}
```

### AI Usage Analytics
Métricas de uso e performance da IA.

```http
GET /metrics/ai-usage
Query Parameters:
- brand_id: string
- operation_type: content_generation | brand_analysis | compliance_check
- date_range: string
```

**Response:**
```typescript
interface AIUsageAnalyticsResponse {
  total_operations: number;
  total_tokens_consumed: number;
  total_cost: number;
  average_processing_time: number;
  
  by_operation: Array<{
    operation_type: string;
    count: number;
    success_rate: number;
    avg_tokens: number;
    avg_cost: number;
    avg_processing_time: number;
  }>;
  
  content_quality: {
    avg_brand_alignment_score: number;
    avg_compliance_score: number;
    human_approval_rate: number;
    rejection_reasons: Array<{
      reason: string;
      count: number;
    }>;
  };
  
  cost_optimization: {
    monthly_trend: Array<{
      month: string;
      cost: number;
      operations: number;
      cost_per_operation: number;
    }>;
    recommendations: string[];
  };
}
```

---

## ⚠️ Error Handling

### Error Codes Específicos para IA

```typescript
enum AIErrorCode {
  // IA Errors
  AI_MODEL_UNAVAILABLE = 'AI_MODEL_UNAVAILABLE',
  AI_TOKEN_LIMIT_EXCEEDED = 'AI_TOKEN_LIMIT_EXCEEDED',
  AI_RATE_LIMIT_EXCEEDED = 'AI_RATE_LIMIT_EXCEEDED',
  AI_INAPPROPRIATE_CONTENT = 'AI_INAPPROPRIATE_CONTENT',
  AI_COMPLIANCE_VIOLATION = 'AI_COMPLIANCE_VIOLATION',
  AI_BRAND_VOICE_MISSING = 'AI_BRAND_VOICE_MISSING',
  
  // Pet Business Errors  
  PET_INVALID_BUSINESS_TYPE = 'PET_INVALID_BUSINESS_TYPE',
  PET_CAMPAIGN_NOT_APPLICABLE = 'PET_CAMPAIGN_NOT_APPLICABLE',
  PET_COMPLIANCE_REQUIRED = 'PET_COMPLIANCE_REQUIRED',
  
  // Journey Errors
  JOURNEY_TRIGGER_INVALID = 'JOURNEY_TRIGGER_INVALID',
  JOURNEY_PARTICIPANT_OPTED_OUT = 'JOURNEY_PARTICIPANT_OPTED_OUT',
  
  // Campaign Errors
  CAMPAIGN_BUDGET_INSUFFICIENT = 'CAMPAIGN_BUDGET_INSUFFICIENT',
  CAMPAIGN_GUARDRAIL_TRIGGERED = 'CAMPAIGN_GUARDRAIL_TRIGGERED'
}
```

### Exemplo de Response de Erro

```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "AI_COMPLIANCE_VIOLATION",
    "message": "Conteúdo gerado viola regras de compliance veterinário",
    "details": {
      "violations": [
        {
          "type": "MEDICAL_CLAIM",
          "text": "cura todas as doenças",
          "suggestion": "ajuda na prevenção de doenças"
        }
      ],
      "required_disclaimers": ["Consulte sempre um veterinário"]
    }
  },
  "meta": {
    "ai_usage": {
      "model_used": "gpt-4o",
      "tokens_consumed": 245,
      "estimated_cost": 0.012,
      "processing_time_ms": 1847
    }
  }
}
```

### Rate Limiting Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
X-AI-Tokens-Limit: 50000
X-AI-Tokens-Used: 12350
X-AI-Cost-Monthly: 45.67
```

---

## 🧪 Testing

### Endpoints de Test/Sandbox

```http
# Validar prompt sem consumir tokens
POST /ai/content/validate-prompt
{
  "prompt": "test prompt",
  "expected_output_type": "social_post"
}

# Testar compliance sem IA
POST /compliance/dry-run
{
  "content": "test content",
  "rules": ["veterinary", "brand_guidelines"]
}

# Simular execução de jornada
POST /journeys/{id}/simulate
{
  "participant_sample": {...},
  "dry_run": true
}
```

### Webhooks para Monitoramento

```http
# Configurar webhook para eventos de IA
POST /webhooks
{
  "url": "https://yourapp.com/webhook",
  "events": [
    "ai.content.generated",
    "ai.compliance.violation", 
    "ai.cost.threshold_exceeded"
  ]
}
```

---

**Última atualização:** 24 de agosto de 2025  
**Versão:** 2.0  
**Status:** ✅ Completo - Contratos API para agência pet com IA