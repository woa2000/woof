# 🚀 Processo de Deploy - Plataforma Woof Marketing

Este documento detalha todos os procedimentos para deploy da aplicação, desde desenvolvimento até produção.

## 📋 Índice

1. [Visão Geral do Pipeline](#-visão-geral-do-pipeline)
2. [Ambientes de Deploy](#-ambientes-de-deploy)
3. [Processo de Deploy](#-processo-de-deploy)
4. [Pipeline CI/CD](#-pipeline-cicd)
5. [Configuração de Ambientes](#-configuração-de-ambientes)
6. [Monitoramento e Rollback](#-monitoramento-e-rollback)
7. [Checklist de Deploy](#-checklist-de-deploy)
8. [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral do Pipeline

### Estratégia de Deploy

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Development │───►│   Staging   │───►│    QA       │───►│ Production  │
│             │    │             │    │             │    │             │
│ • Feature   │    │ • Integration│    │ • Testing   │    │ • Live      │
│ • Testing   │    │ • Preview    │    │ • Approval  │    │ • Monitoring│
│ • Iteration │    │ • Validation │    │ • Sign-off  │    │ • Analytics │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Deploy Philosophy

```typescript
export const DEPLOY_PRINCIPLES = {
  // Continuous deployment with safety
  AUTOMATION: 'Minimize manual steps and human error',
  SAFETY: 'Always be able to rollback quickly',
  OBSERVABILITY: 'Monitor every deployment',
  INCREMENTAL: 'Small, frequent releases',
  TESTING: 'Comprehensive testing before production',
} as const;
```

---

## 🌍 Ambientes de Deploy

### Environment Configuration

```typescript
export interface EnvironmentConfig {
  name: string;
  url: string;
  branch: string;
  autoDeployOn: string[];
  requiresApproval: boolean;
  monitoring: boolean;
  backups: boolean;
  scaling: {
    min: number;
    max: number;
    auto: boolean;
  };
}

export const ENVIRONMENTS: Record<string, EnvironmentConfig> = {
  development: {
    name: 'Development',
    url: 'https://dev-woof.vercel.app',
    branch: 'develop',
    autoDeployOn: ['push', 'pr'],
    requiresApproval: false,
    monitoring: false,
    backups: false,
    scaling: { min: 1, max: 1, auto: false },
  },
  
  staging: {
    name: 'Staging',
    url: 'https://staging-woof.vercel.app', 
    branch: 'staging',
    autoDeployOn: ['push'],
    requiresApproval: false,
    monitoring: true,
    backups: true,
    scaling: { min: 1, max: 2, auto: false },
  },
  
  production: {
    name: 'Production',
    url: 'https://app.woofmarketing.com.br',
    branch: 'main',
    autoDeployOn: ['release'],
    requiresApproval: true,
    monitoring: true,
    backups: true,
    scaling: { min: 2, max: 10, auto: true },
  },
};
```

### Environment Variables

```bash
# Development
NEXT_PUBLIC_SUPABASE_URL="https://dev-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
NEXT_PUBLIC_ENVIRONMENT="development"
NEXT_PUBLIC_API_URL="https://dev-api.woofmarketing.com.br"

# Staging  
NEXT_PUBLIC_SUPABASE_URL="https://staging-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
NEXT_PUBLIC_ENVIRONMENT="staging"
NEXT_PUBLIC_API_URL="https://staging-api.woofmarketing.com.br"

# Production
NEXT_PUBLIC_SUPABASE_URL="https://prod-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
NEXT_PUBLIC_ENVIRONMENT="production"
NEXT_PUBLIC_API_URL="https://api.woofmarketing.com.br"
```

---

## 🚀 Processo de Deploy

### 1. Pre-Deploy Preparation

```bash
#!/bin/bash
# scripts/deploy/pre-deploy.sh

echo "🔄 Starting pre-deploy checks..."

# 1. Verify branch is up to date
git fetch origin
if [ $(git rev-parse HEAD) != $(git rev-parse @{u}) ]; then
  echo "❌ Branch is not up to date with remote"
  exit 1
fi

# 2. Run tests
echo "🧪 Running tests..."
npm run test
npm run test:e2e

# 3. Build check
echo "🏗️ Checking build..."
npm run build

# 4. Type checking
echo "🔍 Type checking..."
npm run type-check

# 5. Linting
echo "✨ Linting..."
npm run lint

# 6. Security audit
echo "🔒 Security audit..."
npm audit --audit-level high

echo "✅ Pre-deploy checks completed successfully"
```

### 2. Deployment Steps

```typescript
// Deploy workflow
export const DEPLOY_WORKFLOW = {
  steps: [
    {
      name: 'pre_deploy_checks',
      required: true,
      timeout: 300, // 5 minutes
      actions: ['test', 'build', 'lint', 'audit'],
    },
    {
      name: 'database_migration',
      required: true,
      timeout: 600, // 10 minutes
      actions: ['backup', 'migrate', 'verify'],
    },
    {
      name: 'application_deploy',
      required: true,
      timeout: 900, // 15 minutes
      actions: ['build', 'deploy', 'verify'],
    },
    {
      name: 'post_deploy_verification',
      required: true,
      timeout: 300, // 5 minutes
      actions: ['health_check', 'smoke_test', 'monitoring'],
    },
    {
      name: 'rollback_if_failed',
      required: false,
      timeout: 300, // 5 minutes
      condition: 'on_failure',
      actions: ['rollback', 'notify'],
    },
  ],
} as const;
```

### 3. Database Migration

```typescript
// Migration strategy
export const MIGRATION_STRATEGY = {
  // Always backup before migration
  preBackup: true,
  
  // Migration types
  types: {
    SAFE: 'Additive changes only (new tables/columns)',
    RISKY: 'Changes existing structure',
    BREAKING: 'Removes or changes existing data',
  },
  
  // Rollback strategy
  rollback: {
    automatic: 'For safe migrations',
    manual: 'For risky/breaking changes',
    dataLoss: 'Warn before rollback if data loss possible',
  },
} as const;

// Migration commands
export const MIGRATION_COMMANDS = {
  backup: 'supabase db dump --file backup_$(date +%Y%m%d_%H%M%S).sql',
  migrate: 'supabase db push',
  verify: 'supabase db diff --check',
  rollback: 'supabase db reset --file backup_latest.sql',
};
```

---

## 🔄 Pipeline CI/CD

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Pipeline

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging]
  release:
    types: [published]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

  deploy-staging:
    needs: [test, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    environment: staging
    steps:
      - name: Deploy to Staging
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: staging

  deploy-production:
    needs: [test, build]
    runs-on: ubuntu-latest
    if: github.event_name == 'release'
    environment: 
      name: production
      url: https://app.woofmarketing.com.br
    steps:
      - name: Deploy to Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  e2e-tests:
    needs: deploy-staging
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    steps:
      - uses: actions/checkout@v4
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: https://staging-woof.vercel.app

  notify-slack:
    needs: [deploy-staging, deploy-production]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Branch Strategy

```typescript
export const BRANCH_STRATEGY = {
  main: {
    description: 'Production-ready code',
    protection: {
      requiresPR: true,
      requiredReviews: 2,
      requiresStatusChecks: true,
      requiresUpToDate: true,
    },
    deployTo: 'production',
    triggerOn: ['release'],
  },
  
  staging: {
    description: 'Integration testing',
    protection: {
      requiresPR: true,
      requiredReviews: 1,
      requiresStatusChecks: true,
    },
    deployTo: 'staging',
    triggerOn: ['push'],
  },
  
  develop: {
    description: 'Development integration',
    protection: {
      requiresStatusChecks: true,
    },
    deployTo: 'development',
    triggerOn: ['push', 'pr'],
  },
  
  'feature/*': {
    description: 'Feature development',
    deployTo: 'preview',
    triggerOn: ['pr'],
  },
} as const;
```

---

## ⚙️ Configuração de Ambientes

### Vercel Configuration

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "next.config.ts",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_ENVIRONMENT": "@environment",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key"
  },
  "regions": ["gru1"],
  "framework": "nextjs",
  "installCommand": "npm ci",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs20.x",
      "regions": ["gru1"]
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Supabase Configuration

```sql
-- Database setup for different environments
-- staging_setup.sql
CREATE DATABASE staging_woof;

-- Configure Row Level Security
ALTER DATABASE staging_woof SET row_security = on;

-- Create environment-specific schemas
CREATE SCHEMA IF NOT EXISTS staging;
CREATE SCHEMA IF NOT EXISTS logs;

-- Setup environment variables
INSERT INTO vault.secrets (name, secret) VALUES
('environment', 'staging'),
('frontend_url', 'https://staging-woof.vercel.app'),
('webhook_url', 'https://staging-api.woofmarketing.com.br/webhooks');
```

### Environment Health Checks

```typescript
// Health check endpoints for each environment
export const HEALTH_CHECKS = {
  '/api/health': {
    method: 'GET',
    expectedStatus: 200,
    timeout: 5000,
    checks: ['database', 'auth', 'storage', 'external_apis'],
  },
  
  '/api/health/database': {
    method: 'GET', 
    expectedStatus: 200,
    query: 'SELECT 1 as health_check',
  },
  
  '/api/health/auth': {
    method: 'GET',
    expectedStatus: 200,
    checks: ['supabase_auth', 'jwt_validation'],
  },
  
  '/api/health/storage': {
    method: 'GET',
    expectedStatus: 200,
    checks: ['supabase_storage', 'file_upload'],
  },
} as const;

// Health check implementation
export async function performHealthCheck(environment: string): Promise<HealthStatus> {
  const baseUrl = ENVIRONMENTS[environment].url;
  const results: HealthCheckResult[] = [];
  
  for (const [endpoint, config] of Object.entries(HEALTH_CHECKS)) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: config.method,
        timeout: config.timeout,
      });
      
      results.push({
        endpoint,
        status: response.status === config.expectedStatus ? 'healthy' : 'unhealthy',
        responseTime: Date.now() - startTime,
      });
    } catch (error) {
      results.push({
        endpoint,
        status: 'error',
        error: error.message,
      });
    }
  }
  
  return {
    environment,
    timestamp: new Date().toISOString(),
    overall: results.every(r => r.status === 'healthy') ? 'healthy' : 'unhealthy',
    checks: results,
  };
}
```

---

## 📊 Monitoramento e Rollback

### Deployment Monitoring

```typescript
export const DEPLOYMENT_MONITORING = {
  // Metrics to watch during/after deployment
  metrics: [
    'response_time_p95',
    'error_rate',
    'success_rate', 
    'active_users',
    'database_connections',
    'memory_usage',
    'cpu_usage',
  ],
  
  // Thresholds that trigger alerts
  thresholds: {
    error_rate: 5, // percentage
    response_time_p95: 2000, // milliseconds
    success_rate: 95, // percentage minimum
  },
  
  // Monitoring duration after deployment
  monitoringWindow: 30, // minutes
  
  // Auto-rollback conditions
  autoRollback: {
    enabled: true,
    conditions: [
      'error_rate > 10%',
      'response_time_p95 > 5000ms',
      'success_rate < 90%',
    ],
  },
} as const;
```

### Rollback Strategy

```bash
#!/bin/bash
# scripts/deploy/rollback.sh

PREVIOUS_VERSION=${1:-"previous"}
ENVIRONMENT=${2:-"production"}

echo "🔄 Starting rollback to $PREVIOUS_VERSION in $ENVIRONMENT..."

# 1. Get previous version info
PREVIOUS_DEPLOYMENT=$(vercel deployments list --meta env=$ENVIRONMENT | grep -A1 Ready | tail -1 | awk '{print $1}')

if [ -z "$PREVIOUS_DEPLOYMENT" ]; then
  echo "❌ No previous deployment found"
  exit 1
fi

# 2. Create rollback deployment
echo "📦 Creating rollback deployment..."
vercel alias $PREVIOUS_DEPLOYMENT $(vercel domains list | grep $ENVIRONMENT | awk '{print $1}')

# 3. Verify rollback
echo "🔍 Verifying rollback..."
HEALTH_CHECK_URL="https://$(vercel domains list | grep $ENVIRONMENT | awk '{print $1}')/api/health"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_CHECK_URL)

if [ $HTTP_STATUS -eq 200 ]; then
  echo "✅ Rollback successful"
  # Notify team
  curl -X POST $SLACK_WEBHOOK -H 'Content-type: application/json' \
    --data "{\"text\":\"🔄 Rollback completed for $ENVIRONMENT environment\"}"
else
  echo "❌ Rollback failed - health check returned $HTTP_STATUS"
  exit 1
fi

# 4. Update monitoring
echo "📊 Updating monitoring dashboard..."
curl -X POST $MONITORING_WEBHOOK \
  -H 'Content-type: application/json' \
  --data "{
    \"event\": \"rollback_completed\",
    \"environment\": \"$ENVIRONMENT\",
    \"previous_version\": \"$PREVIOUS_DEPLOYMENT\",
    \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  }"

echo "🎉 Rollback process completed"
```

### Canary Deployments

```typescript
// For future implementation - gradual rollout strategy
export const CANARY_STRATEGY = {
  enabled: false, // Not implemented yet
  
  stages: [
    { traffic: 5, duration: 300 }, // 5% for 5 minutes
    { traffic: 25, duration: 600 }, // 25% for 10 minutes  
    { traffic: 50, duration: 900 }, // 50% for 15 minutes
    { traffic: 100, duration: 0 }, // Full rollout
  ],
  
  successCriteria: {
    errorRate: '<2%',
    responseTime: '<1500ms',
    userSatisfaction: '>4.0',
  },
  
  rollbackTriggers: [
    'error_rate > 5%',
    'response_time_p95 > 3000ms',
    'user_complaints > 10',
  ],
} as const;
```

---

## ✅ Checklist de Deploy

### Pre-Deploy Checklist

```typescript
export const PRE_DEPLOY_CHECKLIST = [
  // Code quality
  { item: 'All tests passing', required: true, automated: true },
  { item: 'Code reviewed and approved', required: true, automated: false },
  { item: 'No linting errors', required: true, automated: true },
  { item: 'Build successful', required: true, automated: true },
  { item: 'Type checking passed', required: true, automated: true },
  
  // Database
  { item: 'Database migrations tested', required: true, automated: false },
  { item: 'Database backup created', required: true, automated: true },
  { item: 'Migration rollback plan ready', required: true, automated: false },
  
  // Environment
  { item: 'Environment variables updated', required: true, automated: false },
  { item: 'Feature flags configured', required: false, automated: false },
  { item: 'Third-party services notified', required: false, automated: false },
  
  // Documentation
  { item: 'Changelog updated', required: true, automated: false },
  { item: 'Release notes prepared', required: true, automated: false },
  { item: 'Monitoring alerts configured', required: true, automated: false },
  
  // Communication
  { item: 'Team notified of deployment window', required: true, automated: false },
  { item: 'Customer communication sent (if needed)', required: false, automated: false },
  { item: 'Support team briefed on changes', required: true, automated: false },
] as const;
```

### Post-Deploy Checklist

```typescript
export const POST_DEPLOY_CHECKLIST = [
  // Verification
  { item: 'Health checks passing', required: true, automated: true, timeout: 300 },
  { item: 'Critical user journeys tested', required: true, automated: true, timeout: 600 },
  { item: 'API endpoints responding', required: true, automated: true, timeout: 180 },
  { item: 'Database migrations applied', required: true, automated: true, timeout: 60 },
  
  // Monitoring
  { item: 'Error rates normal', required: true, automated: true, timeout: 900 },
  { item: 'Response times acceptable', required: true, automated: true, timeout: 900 },
  { item: 'No alerts triggered', required: true, automated: true, timeout: 1200 },
  { item: 'User activity normal', required: true, automated: false, timeout: 1800 },
  
  // Business
  { item: 'Key features working', required: true, automated: false, timeout: 900 },
  { item: 'Payment processing normal', required: true, automated: true, timeout: 300 },
  { item: 'Email notifications sending', required: true, automated: true, timeout: 300 },
  
  // Communication
  { item: 'Team notified of successful deployment', required: true, automated: true, timeout: 60 },
  { item: 'Stakeholders updated', required: false, automated: false, timeout: 300 },
  { item: 'Documentation updated', required: true, automated: false, timeout: 600 },
] as const;
```

### Emergency Rollback Checklist

```typescript
export const EMERGENCY_ROLLBACK_CHECKLIST = [
  // Immediate actions (< 5 minutes)
  { item: 'Identify rollback target version', priority: 'critical', maxTime: 60 },
  { item: 'Initiate rollback procedure', priority: 'critical', maxTime: 180 },
  { item: 'Verify rollback completion', priority: 'critical', maxTime: 120 },
  
  // Short-term actions (< 15 minutes)
  { item: 'Confirm services are healthy', priority: 'high', maxTime: 300 },
  { item: 'Notify relevant teams', priority: 'high', maxTime: 180 },
  { item: 'Document incident details', priority: 'medium', maxTime: 600 },
  
  // Follow-up actions (< 60 minutes) 
  { item: 'Conduct root cause analysis', priority: 'medium', maxTime: 3600 },
  { item: 'Update incident report', priority: 'low', maxTime: 1800 },
  { item: 'Plan fix and re-deployment', priority: 'medium', maxTime: 3600 },
] as const;
```

---

## 🔧 Troubleshooting

### Common Deploy Issues

```typescript
export const DEPLOY_TROUBLESHOOTING = {
  'BUILD_FAILED': {
    description: 'Build process failed',
    commonCauses: [
      'TypeScript compilation errors',
      'Missing environment variables',
      'Dependency conflicts',
      'Memory issues',
    ],
    solutions: [
      'Check build logs for specific errors',
      'Verify all environment variables are set',
      'Clear node_modules and reinstall',
      'Check for memory limits in CI/CD',
    ],
  },
  
  'MIGRATION_FAILED': {
    description: 'Database migration failed',
    commonCauses: [
      'Schema conflicts',
      'Data integrity issues',
      'Permission problems',
      'Connection timeout',
    ],
    solutions: [
      'Review migration script for conflicts',
      'Check database permissions',
      'Verify data meets constraints',
      'Rollback and retry',
    ],
  },
  
  'HEALTH_CHECK_FAILED': {
    description: 'Post-deploy health checks failing',
    commonCauses: [
      'Database connection issues',
      'External API problems',
      'Configuration errors',
      'Performance degradation',
    ],
    solutions: [
      'Check database connectivity',
      'Verify external service status',
      'Review configuration changes',
      'Monitor resource usage',
    ],
  },
  
  'ROLLBACK_FAILED': {
    description: 'Rollback process failed',
    commonCauses: [
      'No previous version available',
      'Database schema incompatibility',
      'Configuration conflicts',
      'External dependencies',
    ],
    solutions: [
      'Manual version restoration',
      'Database restore from backup',
      'Emergency configuration reset',
      'Contact infrastructure team',
    ],
  },
} as const;
```

### Debug Commands

```bash
# Check deployment status
vercel deployments list --meta env=production

# View deployment logs  
vercel logs <deployment-url>

# Check build status
vercel inspect <deployment-url>

# Database connection test
npm run db:test-connection

# Health check
curl -f https://app.woofmarketing.com.br/api/health || echo "Health check failed"

# Check environment variables
vercel env ls

# Rollback to previous deployment
vercel alias set <previous-deployment-url> app.woofmarketing.com.br
```

### Monitoring Commands

```bash
# Real-time error monitoring
curl -s https://app.woofmarketing.com.br/api/health | jq '.checks[] | select(.status != "healthy")'

# Performance check
curl -w "@curl-format.txt" -o /dev/null -s https://app.woofmarketing.com.br

# Database performance
psql -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Check recent deployments
gh api repos/woof-marketing/woof/deployments --jq '.[] | {id: .id, environment: .environment, created_at: .created_at}' | head -10
```

---

## 📝 Deployment Runbook

### Standard Production Deploy

1. **Pre-Deploy (Day Before)**
   - [ ] Review changes in staging
   - [ ] Schedule deployment window
   - [ ] Prepare rollback plan
   - [ ] Notify stakeholders

2. **Deploy Day**
   - [ ] Final code review
   - [ ] Run pre-deploy checklist
   - [ ] Execute deployment
   - [ ] Monitor metrics
   - [ ] Verify functionality
   - [ ] Update documentation

3. **Post-Deploy**
   - [ ] Monitor for 2 hours
   - [ ] Run post-deploy checklist
   - [ ] Send completion notification
   - [ ] Update release notes

### Emergency Deploy

1. **Assessment (< 5 min)**
   - [ ] Identify critical issue
   - [ ] Determine fix urgency
   - [ ] Get necessary approvals

2. **Execution (< 15 min)**
   - [ ] Skip non-critical checks
   - [ ] Deploy fix rapidly
   - [ ] Monitor immediately

3. **Follow-up (< 1 hour)**
   - [ ] Verify issue resolution
   - [ ] Document incident
   - [ ] Plan process improvements

---

**Última atualização:** 17 de agosto de 2025  
**Versão:** 2.0  
**Status:** ✅ Completo

Este documento serve como guia completo para todos os aspectos de deployment da Plataforma Woof Marketing, garantindo deploys seguros e confiáveis.
