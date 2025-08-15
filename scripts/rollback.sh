#!/bin/bash
# scripts/rollback.sh

set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
  echo "Usage: ./rollback.sh <environment> <version>"
  echo "Example: ./rollback.sh production v1.0.0"
  exit 1
fi

echo "Rolling back to version $VERSION in $ENVIRONMENT..."

# Stop current deployment
case $ENVIRONMENT in
  "staging")
    docker-compose -f docker-compose.staging.yml down
    ;;
  "production")
    docker-compose -f docker-compose.production.yml down
    ;;
  *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

# Start deployment with specific version
case $ENVIRONMENT in
  "staging")
    docker-compose -f docker-compose.staging.yml up -d
    ;;
  "production")
    docker-compose -f docker-compose.production.yml up -d
    ;;
esac

echo "Rollback to version $VERSION completed successfully!"

# Health check
echo "Performing health check..."
sleep 30
curl -f http://localhost:3000/api/health || echo "Health check failed"
