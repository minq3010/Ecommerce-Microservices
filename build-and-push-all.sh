#!/bin/bash

# Build and push all microservices to Docker Hub with multi-platform support
# Usage: ./build-and-push-all.sh

set -e

DOCKER_USERNAME="minq3010"
PLATFORM="linux/amd64,linux/arm64"
SERVICES=(
  "discovery-server"
  "api-gateway"
  "product-service"
  "cart-service"
  "order-service"
  "user-service"
  "payment-service"
  "frontend"
)

echo "🚀 Starting multi-platform build and push process..."
echo "Docker Hub username: $DOCKER_USERNAME"
echo "Platform: $PLATFORM"
echo ""

# Setup buildx
echo "📦 Setting up Docker buildx..."
docker buildx create --use --name multiarch 2>/dev/null || docker buildx use multiarch
echo ""

for SERVICE in "${SERVICES[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 Building $SERVICE for $PLATFORM..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if [ -d "./$SERVICE" ]; then
    # Build multi-platform image and push
    docker buildx build --platform $PLATFORM \
      -t "$DOCKER_USERNAME/$SERVICE:latest" \
      --push \
      "./$SERVICE"
    
    echo "✅ $SERVICE completed successfully!"
    echo ""
  else
    echo "⚠️  Directory ./$SERVICE not found, skipping..."
    echo ""
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All services built and pushed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "1. Commit and push k8s manifests to GitHub"
echo "2. Apply Argo CD application: kubectl apply -f k8s/argocd/application.yaml"
echo "3. Check Argo CD UI to verify deployment"
