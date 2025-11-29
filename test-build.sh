#!/bin/bash

# Test build script - builds one image of each service to verify Dockerfiles
# Usage: ./test-build.sh

set -e

echo "🧪 Testing Docker builds for ARM64 (Apple Silicon M4) compatibility"
echo "This will build one image from each service to verify Dockerfiles work"
echo ""

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

FAILED=0
SUCCESS=0

for SERVICE in "${SERVICES[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔨 Testing build: $SERVICE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if [ -d "./$SERVICE" ]; then
    if docker build -t "test-$SERVICE:latest" "./$SERVICE" --no-cache; then
      echo "✅ $SERVICE - BUILD SUCCESS"
      SUCCESS=$((SUCCESS + 1))
      
      # Clean up test image
      docker rmi "test-$SERVICE:latest" > /dev/null 2>&1 || true
    else
      echo "❌ $SERVICE - BUILD FAILED"
      FAILED=$((FAILED + 1))
    fi
    echo ""
  else
    echo "⚠️  Directory ./$SERVICE not found, skipping..."
    echo ""
  fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Build Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Successful: $SUCCESS"
echo "❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All builds passed! Ready to push to Docker Hub"
  echo ""
  echo "Next steps:"
  echo "  ./build-and-push-all.sh    # Build and push all images"
  exit 0
else
  echo "❌ Some builds failed. Please fix the errors above."
  exit 1
fi
