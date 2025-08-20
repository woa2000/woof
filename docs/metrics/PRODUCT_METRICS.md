# 📊 Métricas de Produto - Plataforma Woof Marketing

Este documento define as métricas de sucesso, KPIs e indicadores de performance para a Plataforma Woof Marketing.

## 📋 Índice

1. [Visão Geral das Métricas](#-visão-geral-das-métricas)
2. [OKRs (Objectives & Key Results)](#-okrs-objectives--key-results)
3. [Métricas de Aquisição](#-métricas-de-aquisição)
4. [Métricas de Ativação](#-métricas-de-ativação)
5. [Métricas de Retenção](#-métricas-de-retenção)
6. [Métricas de Revenue](#-métricas-de-revenue)
7. [Métricas de Experiência](#-métricas-de-experiência)
8. [Métricas Operacionais](#-métricas-operacionais)
9. [Dashboard de Métricas](#-dashboard-de-métricas)
10. [Análise e Insights](#-análise-e-insights)

---

## 🎯 Visão Geral das Métricas

### Framework AARRR (Pirate Metrics)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Acquisition │ ──►│ Activation  │ ──►│  Retention  │
│             │    │             │    │             │
│ • Traffic   │    │ • Signups   │    │ • MAU/DAU   │
│ • Leads     │    │ • Onboarding│    │ • Churn     │
│ • Cost      │    │ • First Use │    │ • Stickiness│
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
┌─────────────┐    ┌─────────────┐            │
│  Referral   │ ◄──│   Revenue   │ ◄──────────┘
│             │    │             │
│ • NPS       │    │ • MRR/ARR   │
│ • Viral K   │    │ • LTV       │
│ • Advocacy  │    │ • Pricing   │
└─────────────┘    └─────────────┘
```

### Métricas North Star

| Métrica | Target 2025 | Atual | Status |
|---------|-------------|-------|--------|
| **MRR (Monthly Recurring Revenue)** | R$ 100k | - | 🔄 |
| **Active Users (MAU)** | 500 | - | 🔄 |
| **Net Revenue Retention** | 110% | - | 🔄 |
| **Customer Satisfaction (CSAT)** | 85% | - | 🔄 |

---

## 🎯 OKRs (Objectives & Key Results)

### Q3 2025 - Estabelecer Product-Market Fit

**Objetivo 1: Validar o produto com early adopters**
- KR1: 50 usuários pagos ativos
- KR2: NPS ≥ 50
- KR3: 70% dos usuários criam pelo menos 1 manual da marca
- KR4: Tempo médio até primeiro valor < 15 minutos

**Objetivo 2: Construir base sólida de receita**
- KR1: MRR de R$ 15k
- KR2: Churn rate mensal < 5%
- KR3: LTV/CAC ratio ≥ 3:1
- KR4: 3 planos de pricing validados

**Objetivo 3: Otimizar a experiência do usuário**
- KR1: Onboarding completion rate > 80%
- KR2: Time to value < 10 minutos
- KR3: Support tickets < 10/semana
- KR4: App performance score > 90

### Q4 2025 - Escalar Crescimento

**Objetivo 1: Acelerar aquisição de usuários**
- KR1: 200 novos usuários/mês
- KR2: CAC < R$ 100
- KR3: 40% do crescimento via referral/organic
- KR4: 5 canais de aquisição validados

**Objetivo 2: Aumentar engajamento e retenção**
- KR1: DAU/MAU ratio > 25%
- KR2: Retention rate 3 meses > 70%
- KR3: Feature adoption rate > 60%
- KR4: Session duration > 15 minutos

---

## 📈 Métricas de Aquisição

### Traffic & Lead Generation

```typescript
// Estrutura das métricas de aquisição
export interface AcquisitionMetrics {
  // Traffic
  uniqueVisitors: number;
  pageViews: number;
  sessionDuration: number; // minutes
  bounceRate: number; // percentage
  
  // Sources
  trafficSources: {
    organic: number;
    paid: number;
    social: number;
    direct: number;
    referral: number;
  };
  
  // Conversion
  visitorsToLeads: number; // percentage
  leadsToSignups: number; // percentage
  signupsToActivated: number; // percentage
  
  // Costs
  totalMarketingSpend: number; // BRL
  costPerClick: number; // BRL
  costPerLead: number; // BRL
  customerAcquisitionCost: number; // BRL
}
```

### Metas de Aquisição

| Métrica | Q3 2025 | Q4 2025 | Q1 2026 |
|---------|---------|---------|---------|
| **Monthly Visitors** | 2,000 | 5,000 | 10,000 |
| **Leads/Month** | 100 | 300 | 600 |
| **Signup Rate** | 15% | 20% | 25% |
| **CAC** | R$ 150 | R$ 100 | R$ 80 |

### Canais de Aquisição

```typescript
export const ACQUISITION_CHANNELS = {
  ORGANIC_SEARCH: {
    name: 'Busca Orgânica',
    expectedShare: 30,
    cac: 0,
    quality: 'high',
  },
  GOOGLE_ADS: {
    name: 'Google Ads',
    expectedShare: 25,
    cac: 120,
    quality: 'medium',
  },
  SOCIAL_MEDIA: {
    name: 'Redes Sociais',
    expectedShare: 20,
    cac: 80,
    quality: 'medium',
  },
  CONTENT_MARKETING: {
    name: 'Marketing de Conteúdo',
    expectedShare: 15,
    cac: 40,
    quality: 'high',
  },
  REFERRALS: {
    name: 'Indicações',
    expectedShare: 10,
    cac: 20,
    quality: 'very_high',
  },
} as const;
```

---

## 🚀 Métricas de Ativação

### Onboarding Success

```typescript
export interface ActivationMetrics {
  // Onboarding funnel
  onboardingSteps: {
    accountCreation: number; // percentage completed
    profileSetup: number;
    firstManualCreation: number;
    logoUpload: number;
    firstChapterEdit: number;
  };
  
  // Time to value
  timeToFirstValue: number; // minutes
  timeToFirstManual: number; // minutes
  timeToFirstShare: number; // hours
  
  // Activation definition
  activatedUsers: number; // users who completed "aha moment"
  activationRate: number; // percentage of signups
  
  // Quality metrics
  activatedUsersRetained7d: number; // percentage
  activatedUsersRetained30d: number; // percentage
}
```

### Definição de Ativação

**"Aha Moment"**: Usuário cria seu primeiro manual da marca e visualiza pelo menos 3 capítulos.

```typescript
export const ACTIVATION_CRITERIA = {
  PRIMARY: 'Created first brand manual',
  SECONDARY: 'Viewed 3+ manual chapters',
  TERTIARY: 'Uploaded brand logo',
  TIMEFRAME: '7 days from signup',
} as const;

// Função para calcular ativação
export function calculateActivation(user: User): boolean {
  const hasCreatedManual = user.brandManuals.length > 0;
  const hasViewedChapters = user.chaptersViewed >= 3;
  const withinTimeframe = daysSinceSignup(user) <= 7;
  
  return hasCreatedManual && hasViewedChapters && withinTimeframe;
}
```

### Metas de Ativação

| Métrica | Target | Atual | Status |
|---------|--------|-------|--------|
| **Activation Rate** | 70% | - | 🔄 |
| **Time to First Value** | <15 min | - | 🔄 |
| **Onboarding Completion** | 80% | - | 🔄 |
| **7-day Activated Retention** | 85% | - | 🔄 |

---

## 🔄 Métricas de Retenção

### User Retention

```typescript
export interface RetentionMetrics {
  // Cohort retention
  day1Retention: number; // percentage
  day7Retention: number;
  day30Retention: number;
  day90Retention: number;
  
  // Activity metrics  
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  dauMauRatio: number; // stickiness
  
  // Engagement
  averageSessionsPerUser: number;
  averageSessionDuration: number; // minutes
  featuresUsedPerSession: number;
  
  // Churn
  monthlyChurnRate: number; // percentage
  reactivationRate: number; // percentage of churned users who return
  
  // Feature usage
  featureAdoption: Record<string, number>; // percentage of users using each feature
}
```

### Análise de Cohorts

```typescript
export interface CohortAnalysis {
  cohortMonth: string; // 'YYYY-MM'
  newUsers: number;
  retention: {
    month0: number; // 100% by definition
    month1: number;
    month2: number;
    month3: number;
    month6: number;
    month12: number;
  };
  revenue: {
    month0: number;
    month1: number;
    month2: number;
    month3: number;
    month6: number;
    month12: number;
  };
}
```

### Metas de Retenção

| Período | Target | Industry Benchmark |
|---------|--------|--------------------|
| **Day 1** | 85% | 75% (SaaS) |
| **Day 7** | 70% | 55% (SaaS) |
| **Day 30** | 55% | 35% (SaaS) |
| **Day 90** | 45% | 25% (SaaS) |

---

## 💰 Métricas de Revenue

### Revenue Metrics

```typescript
export interface RevenueMetrics {
  // Recurring revenue
  monthlyRecurringRevenue: number; // BRL
  annualRecurringRevenue: number; // BRL
  totalRevenue: number; // BRL
  
  // Growth
  mrrGrowthRate: number; // monthly percentage
  newMrr: number; // from new customers
  expansionMrr: number; // from upgrades
  contractionMrr: number; // from downgrades
  churnedMrr: number; // from cancelled subscriptions
  
  // Customer metrics
  averageRevenuePerUser: number; // BRL
  lifetimeValue: number; // BRL
  paybackPeriod: number; // months
  
  // Pricing
  planDistribution: Record<string, number>; // percentage of users per plan
  upgradeRate: number; // percentage
  downgradeRate: number; // percentage
  
  // Financial health
  grossMargin: number; // percentage
  netRevenueRetention: number; // percentage
  ltvcacRatio: number; // ratio
}
```

### Revenue Goals

| Métrica | Q3 2025 | Q4 2025 | Q1 2026 |
|---------|---------|---------|---------|
| **MRR** | R$ 15k | R$ 45k | R$ 100k |
| **ARPU** | R$ 300 | R$ 350 | R$ 400 |
| **LTV** | R$ 3,600 | R$ 7,200 | R$ 12,000 |
| **NRR** | 105% | 110% | 115% |

### Pricing Strategy Metrics

```typescript
export const PRICING_PLANS = {
  STARTER: {
    price: 297, // BRL
    targetSegment: 'Small pet shops',
    expectedAdoption: 60,
    conversionRate: 15,
  },
  PROFESSIONAL: {
    price: 597, // BRL
    targetSegment: 'Growing businesses',
    expectedAdoption: 35,
    conversionRate: 25,
  },
  ENTERPRISE: {
    price: 1197, // BRL
    targetSegment: 'Franchises & networks',
    expectedAdoption: 5,
    conversionRate: 40,
  },
} as const;
```

---

## 😊 Métricas de Experiência

### Customer Satisfaction

```typescript
export interface ExperienceMetrics {
  // Satisfaction scores
  nps: number; // Net Promoter Score (-100 to 100)
  csat: number; // Customer Satisfaction (1-5)
  ces: number; // Customer Effort Score (1-5)
  
  // Support metrics
  supportTickets: number; // per month
  averageResolutionTime: number; // hours
  firstResponseTime: number; // minutes
  supportSatisfaction: number; // 1-5
  
  // Product feedback
  featureRequests: number; // per month
  bugReports: number; // per month
  productReviews: {
    average: number; // 1-5
    distribution: Record<number, number>; // count per rating
  };
  
  // User sentiment
  appStoreRating: number; // if applicable
  socialSentiment: 'positive' | 'neutral' | 'negative';
  brandMentions: number; // per month
}
```

### Pesquisa NPS

```typescript
export const NPS_SURVEY = {
  question: 'Em uma escala de 0 a 10, o quanto você recomendaria a Plataforma Woof para um colega?',
  followUpQuestions: {
    promoters: 'O que você mais gosta na plataforma?',
    passives: 'O que podemos melhorar para ter sua recomendação?',
    detractors: 'O que precisa mudar para que você nos recomende?',
  },
  frequency: 'quarterly',
  targetResponse: 30, // percentage
};

// Cálculo do NPS
export function calculateNPS(responses: NPSResponse[]): number {
  const total = responses.length;
  const promoters = responses.filter(r => r.score >= 9).length;
  const detractors = responses.filter(r => r.score <= 6).length;
  
  return ((promoters - detractors) / total) * 100;
}
```

---

## ⚙️ Métricas Operacionais

### System Performance

```typescript
export interface OperationalMetrics {
  // Performance
  averageLoadTime: number; // seconds
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay  
    cls: number; // Cumulative Layout Shift
  };
  
  // Reliability
  uptime: number; // percentage
  errorRate: number; // percentage
  responseTime: number; // milliseconds
  
  // Usage patterns
  peakHours: string[]; // hours with highest usage
  featureUsage: Record<string, number>; // percentage of users
  mobileVsDesktop: {
    mobile: number;
    desktop: number;
  };
  
  // Infrastructure
  serverCosts: number; // BRL per month
  storageUsed: number; // GB
  bandwidthUsed: number; // GB
}
```

### Quality Metrics

| Métrica | Target | Atual | Status |
|---------|--------|-------|--------|
| **Uptime** | 99.9% | - | 🔄 |
| **Load Time** | <2s | - | 🔄 |
| **Error Rate** | <0.1% | - | 🔄 |
| **Core Web Vitals** | Good | - | 🔄 |

---

## 📊 Dashboard de Métricas

### Executive Dashboard

```typescript
export interface ExecutiveDashboard {
  // High-level KPIs
  mrr: {
    current: number;
    growth: number; // percentage
    target: number;
  };
  
  users: {
    total: number;
    active: number;
    churn: number; // percentage
  };
  
  satisfaction: {
    nps: number;
    csat: number;
    trend: 'up' | 'down' | 'stable';
  };
  
  health: {
    ltvcac: number;
    burnRate: number; // months of runway
    growthRate: number; // percentage
  };
}
```

### Product Dashboard

```typescript
export interface ProductDashboard {
  // Feature adoption
  features: Array<{
    name: string;
    adoption: number; // percentage
    trend: 'up' | 'down' | 'stable';
  }>;
  
  // User journey
  funnel: {
    visitors: number;
    signups: number;
    activated: number;
    retained: number;
    converted: number;
  };
  
  // Feedback summary
  feedback: {
    requests: number;
    bugs: number;
    satisfaction: number;
  };
}
```

### Real-time Monitoring

```typescript
// Sistema de alertas baseado em métricas
export const METRIC_ALERTS = {
  CHURN_SPIKE: {
    condition: 'churn_rate > 10%',
    severity: 'critical',
    notification: ['slack', 'email'],
  },
  
  CONVERSION_DROP: {
    condition: 'signup_rate < 10%',
    severity: 'warning',
    notification: ['slack'],
  },
  
  REVENUE_MILESTONE: {
    condition: 'mrr >= target_mrr',
    severity: 'info',
    notification: ['slack', 'celebration'],
  },
  
  PERFORMANCE_ISSUE: {
    condition: 'avg_load_time > 3s',
    severity: 'warning', 
    notification: ['slack', 'pagerduty'],
  },
};
```

---

## 🔍 Análise e Insights

### Segmentação de Usuários

```typescript
export const USER_SEGMENTS = {
  POWER_USERS: {
    definition: 'Users who create 3+ manuals and use 5+ features',
    metrics: ['retention', 'nps', 'ltv'],
    size: 15, // percentage
  },
  
  REGULAR_USERS: {
    definition: 'Users who create 1-2 manuals regularly',
    metrics: ['engagement', 'feature_adoption'],
    size: 60, // percentage
  },
  
  TRIAL_USERS: {
    definition: 'Users still in trial period',
    metrics: ['activation', 'conversion'],
    size: 20, // percentage
  },
  
  AT_RISK: {
    definition: 'Users with declining engagement',
    metrics: ['churn_risk', 'support_needs'],
    size: 5, // percentage
  },
};
```

### Análise de Correlações

```typescript
// Identificar fatores que influenciam sucesso
export const SUCCESS_FACTORS = {
  HIGH_RETENTION_INDICATORS: [
    'completed_onboarding_in_24h',
    'uploaded_logo_in_first_session',
    'viewed_5plus_chapters',
    'shared_manual_within_week',
  ],
  
  HIGH_LTV_INDICATORS: [
    'upgraded_within_30days',
    'created_multiple_manuals',
    'used_advanced_features',
    'high_session_frequency',
  ],
  
  CHURN_RISK_INDICATORS: [
    'no_login_14days',
    'support_ticket_unresolved',
    'feature_adoption_below_30percent',
    'never_completed_manual',
  ],
};
```

### Reporting Cadence

| Report | Frequency | Audience | Focus |
|--------|-----------|----------|-------|
| **Executive Summary** | Weekly | Leadership | KPIs, targets, issues |
| **Product Metrics** | Daily | Product Team | Usage, feedback, bugs |
| **Growth Report** | Monthly | Marketing | Acquisition, conversion |
| **Health Check** | Quarterly | All Teams | Comprehensive review |

---

## 📈 Metas e Benchmarks

### Industry Benchmarks (SaaS B2B)

| Métrica | Industry Avg | Best in Class | Woof Target |
|---------|--------------|---------------|-------------|
| **Activation Rate** | 35% | 70% | 70% |
| **Monthly Churn** | 5-7% | 2-3% | <5% |
| **NPS** | 31 | 70+ | 50+ |
| **CAC Payback** | 12-18m | 6m | 12m |
| **NRR** | 110% | 120%+ | 115% |

### Success Milestones

**Product-Market Fit Indicators:**
- [ ] NPS > 40
- [ ] Organic growth > 30%
- [ ] LTV/CAC > 3:1
- [ ] User retention > 40% (3 months)
- [ ] Revenue growing 20%+ MoM

**Scale Ready Indicators:**
- [ ] NPS > 50
- [ ] NRR > 110%
- [ ] CAC payback < 12 months
- [ ] Churn < 3% monthly
- [ ] 80%+ of growth repeatable

---

## 🛠️ Implementação de Tracking

### Analytics Stack

```typescript
// Configuração do analytics
export const ANALYTICS_CONFIG = {
  // Primary tracking
  googleAnalytics: 'GA4-XXXXX',
  posthog: 'phc_xxxxx',
  
  // Business metrics
  stripe: 'sk_xxxxx', // revenue data
  supabase: 'xxxxx', // user data
  
  // Performance
  vercel: 'team_xxxxx', // web vitals
  sentry: 'xxxxx', // error tracking
};

// Event tracking
export function trackEvent(event: string, properties?: Record<string, any>) {
  // Send to multiple providers
  analytics.track(event, properties);
  posthog.capture(event, properties);
  
  // Custom metrics
  if (event === 'manual_created') {
    incrementMetric('manuals_created_total');
  }
}
```

### Key Events to Track

```typescript
export const TRACKED_EVENTS = {
  // User journey
  'user_signed_up': ['source', 'plan'],
  'user_activated': ['days_to_activation'],
  'user_churned': ['reason', 'plan', 'tenure'],
  
  // Feature usage
  'manual_created': ['type', 'chapters_included'],
  'logo_uploaded': ['file_type', 'size'],
  'chapter_edited': ['chapter_id', 'time_spent'],
  'manual_shared': ['share_method'],
  
  // Business events
  'subscription_started': ['plan', 'billing_cycle'],
  'subscription_upgraded': ['from_plan', 'to_plan'],
  'subscription_cancelled': ['reason', 'tenure'],
  'support_ticket_created': ['category', 'urgency'],
};
```

---

**Última atualização:** 17 de agosto de 2025  
**Versão:** 2.0  
**Status:** ✅ Completo

As métricas definidas neste documento servem como base para medir o sucesso da Plataforma Woof Marketing e orientar decisões estratégicas de produto e negócio.
