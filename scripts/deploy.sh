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
