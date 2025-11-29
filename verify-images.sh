#!/bin/bash

# Quick verification script to check if all Docker images exist on Docker Hub
# Usage: ./verify-images.sh

DOCKER_USERNAME="minq3010"
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

echo "🔍 Verifying Docker images on Docker Hub..."
echo ""

MISSING=0

for SERVICE in "${SERVICES[@]}"; do
  IMAGE="$DOCKER_USERNAME/$SERVICE:latest"
  
  if docker manifest inspect "$IMAGE" > /dev/null 2>&1; then
    echo "✅ $IMAGE - EXISTS"
  else
    echo "❌ $IMAGE - NOT FOUND"
    MISSING=$((MISSING + 1))
  fi
done

echo ""
if [ $MISSING -eq 0 ]; then
  echo "✅ All images verified successfully!"
  exit 0
else
  echo "❌ $MISSING image(s) missing. Please run ./build-and-push-all.sh"
  exit 1
fi
