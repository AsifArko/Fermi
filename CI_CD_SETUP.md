# CI/CD Pipeline Setup Guide

## Overview

This document describes the CI/CD pipeline implementation for the Fermi project, including GitHub Actions, Docker configurations, monitoring, and deployment automation.

## Prerequisites

- Node.js 22.12.0+
- Docker and Docker Compose
- GitHub repository with Actions enabled
- Required environment variables and secrets

## Quick Start

### 1. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env.local
```

Configure the following environment variables:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

### 2. GitHub Secrets

Add the following secrets to your GitHub repository:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `SNYK_TOKEN` (for security scanning)

### 3. Docker Setup

Build the optimized Docker image:

```bash
npm run docker:build
```

## Pipeline Components

### GitHub Actions Workflow

The CI/CD pipeline includes:

1. **Quality Checks**: Linting, type checking, formatting, and tests
2. **Security Scanning**: Snyk vulnerability scanning
3. **Build**: Application building and Docker image creation
4. **Deployment**: Automated deployment to staging/production

### Docker Configuration

- **Multi-stage Dockerfile**: Optimized for production builds
- **Development Compose**: Includes monitoring services
- **Staging/Production**: Environment-specific configurations

### Monitoring

- **Prometheus**: Metrics collection
- **Grafana**: Visualization and dashboards
- **Health Checks**: Application health monitoring

## Usage

### Development

```bash
# Start development environment with monitoring
npm run docker:dev

# Access services:
# - Next.js: http://localhost:3000
# - Sanity: http://localhost:3333
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3001
```

### Staging Deployment

```bash
# Build and deploy to staging
npm run docker:build:staging
npm run docker:staging

# Or use the deployment script
npm run deploy:staging v1.0.0
```

### Production Deployment

```bash
# Build and deploy to production
npm run docker:build:production
npm run docker:production

# Or use the deployment script
npm run deploy:production v1.0.0
```

### Rollback

```bash
# Rollback to a specific version
npm run rollback:staging v1.0.0
npm run rollback:production v1.0.0
```

## Health Monitoring

### Health Check Endpoint

```
GET /api/health
```

Returns application health status including:

- Service status
- Version information
- Environment details
- Dependency health checks

### Metrics Endpoint

```
GET /api/metrics
```

Provides Prometheus-compatible metrics for:

- HTTP request counts
- Response times
- Memory usage
- CPU usage
- Process uptime

## Environment Management

### Development

- Hot reloading enabled
- Volume mounts for live code changes
- Local monitoring services

### Staging

- Production-like environment
- Health checks enabled
- Monitoring and alerting

### Production

- Multi-replica deployment
- Rolling updates
- Comprehensive monitoring
- Automated rollback capability

## Troubleshooting

### Common Issues

1. **Docker Build Failures**
   - Ensure all environment variables are set
   - Check Docker daemon is running

2. **Health Check Failures**
   - Verify service dependencies are running
   - Check network connectivity

3. **Deployment Issues**
   - Ensure target environment is accessible
   - Verify Docker images exist

### Logs

```bash
# View service logs
docker-compose -f docker-compose.dev.yml logs -f nextjs

# View specific service logs
docker logs <container_name>
```

## Security Considerations

- Environment variables are never committed to version control
- Docker images run as non-root users
- Security scanning is integrated into the pipeline
- Secrets are managed through GitHub Actions

## Performance Optimization

- Multi-stage Docker builds reduce image size
- Layer caching optimizes build times
- Health checks ensure service availability
- Monitoring provides performance insights

## Next Steps

1. Configure monitoring dashboards in Grafana
2. Set up alerting rules in Prometheus
3. Implement automated testing for critical paths
4. Add performance benchmarking to the pipeline
5. Set up log aggregation and analysis
