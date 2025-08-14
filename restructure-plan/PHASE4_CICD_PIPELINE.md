# Phase 4: CI/CD Pipeline Implementation

## Objectives

- Implement comprehensive CI/CD pipeline
- Automate testing, building, and deployment
- Add quality gates and security scanning
- Implement automated monitoring and rollback
- Create staging and production environments

## Current State

- Basic Docker configuration exists
- Vercel deployment configured
- No automated testing or quality gates
- Manual deployment process

## Implementation Plan

### Step 1: GitHub Actions CI/CD Pipeline

#### A. Create GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Quality Checks
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run formatting check
        run: npm run format:check

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  # Security Scanning
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  # Build and Test
  build:
    needs: [quality, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ secrets.NEXT_PUBLIC_SANITY_DATASET }}
          # Add other environment variables

      - name: Build Docker image
        run: docker build -t ${{ env.IMAGE_NAME }}:${{ github.sha }} .

  # Deploy to Staging
  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add staging deployment logic

  # Deploy to Production
  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add production deployment logic
```

### Step 2: Enhanced Docker Configuration

#### A. Multi-stage Dockerfile Optimization

```dockerfile
# Dockerfile.optimized
# -------- Base Stage --------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# -------- Dependencies Stage --------
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# -------- Builder Stage --------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG SANITY_API_TOKEN
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Create .env.local for build
RUN echo "NEXT_PUBLIC_SANITY_PROJECT_ID=$NEXT_PUBLIC_SANITY_PROJECT_ID" > .env.local && \
    echo "NEXT_PUBLIC_SANITY_DATASET=$NEXT_PUBLIC_SANITY_DATASET" >> .env.local && \
    echo "SANITY_API_TOKEN=$SANITY_API_TOKEN" >> .env.local && \
    echo "NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL" >> .env.local && \
    echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" >> .env.local && \
    echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" >> .env.local

RUN npm run build

# -------- Production Stage --------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### B. Docker Compose for Development

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  nextjs:
    build:
      context: .
      target: builder
      args:
        NEXT_PUBLIC_SANITY_PROJECT_ID: ${NEXT_PUBLIC_SANITY_PROJECT_ID}
        NEXT_PUBLIC_SANITY_DATASET: ${NEXT_PUBLIC_SANITY_DATASET}
        SANITY_API_TOKEN: ${SANITY_API_TOKEN}
        NEXT_PUBLIC_BASE_URL: ${NEXT_PUBLIC_BASE_URL}
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev

  sanity:
    build:
      context: .
      target: sanity-runner
    ports:
      - '3333:3333'
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    command: npx sanity start --port 3333

  # Add monitoring services
  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
```

### Step 3: Environment Management

#### A. Environment Configuration

```bash
# .env.example
# Application
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
SANITY_API_ADMIN_TOKEN=your_admin_token

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Monitoring
PROMETHEUS_ENDPOINT=http://localhost:9090
GRAFANA_ENDPOINT=http://localhost:3001
```

#### B. Environment-specific Configs

```typescript
// src/lib/config.ts
export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Fermi',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiToken: process.env.SANITY_API_TOKEN!,
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  },
  monitoring: {
    prometheus: process.env.PROMETHEUS_ENDPOINT,
    grafana: process.env.GRAFANA_ENDPOINT,
  },
} as const;
```

### Step 4: Deployment Scripts

#### A. Deployment Automation

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
  echo "Usage: ./deploy.sh <environment> <version>"
  echo "Example: ./deploy.sh staging v1.0.0"
  exit 1
fi

echo "Deploying version $VERSION to $ENVIRONMENT..."

# Build Docker image
docker build -t fermi:$VERSION .

# Deploy based on environment
case $ENVIRONMENT in
  "staging")
    docker-compose -f docker-compose.staging.yml up -d
    ;;
  "production")
    docker-compose -f docker-compose.production.yml up -d
    ;;
  *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

echo "Deployment completed successfully!"
```

### Step 5: Monitoring and Health Checks

#### A. Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: config.app.version,
    environment: config.app.environment,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    checks: {
      sanity: await checkSanityHealth(),
      stripe: await checkStripeHealth(),
      clerk: await checkClerkHealth(),
    },
  };

  const isHealthy = Object.values(health.checks).every(
    check => check.status === 'healthy'
  );

  return NextResponse.json(health, {
    status: isHealthy ? 200 : 503,
  });
}

async function checkSanityHealth() {
  try {
    // Add Sanity health check logic
    return { status: 'healthy', message: 'Sanity CMS is accessible' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

async function checkStripeHealth() {
  try {
    // Add Stripe health check logic
    return { status: 'healthy', message: 'Stripe is accessible' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

async function checkClerkHealth() {
  try {
    // Add Clerk health check logic
    return { status: 'healthy', message: 'Clerk is accessible' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}
```

## Expected Outcomes

- **Automation**: Fully automated CI/CD pipeline
- **Quality Gates**: Automated testing and security scanning
- **Deployment**: Zero-downtime deployments
- **Monitoring**: Real-time health monitoring
- **Rollback**: Automated rollback capabilities
- **Security**: Security scanning in pipeline

## Success Criteria

- [ ] GitHub Actions pipeline working
- [ ] Automated testing on every PR
- [ ] Automated deployment to staging/production
- [ ] Health monitoring implemented
- [ ] Security scanning integrated
- [ ] Rollback procedures established
- [ ] Environment management automated
