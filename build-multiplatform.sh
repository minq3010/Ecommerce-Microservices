#!/bin/bash

# Build and push multi-platform Docker images
# Usage: ./build-multiplatform.sh

set -e

DOCKER_USERNAME="minq3010"
PLATFORM="linux/amd64,linux/arm64"

# Define all available services
ALL_SERVICES=(
  "discovery-server"
  "api-gateway"
  "product-service"
  "cart-service"
  "order-service"
  "user-service"
  "payment-service"
  "frontend"
)

echo "=========================================="
echo "🐳 Multi-Platform Docker Build Tool"
echo "=========================================="
echo "Docker Hub: $DOCKER_USERNAME"
echo "Platforms: $PLATFORM"
echo ""

# Function to build and push a service
build_service() {
  local service=$1
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 Building $service..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if [ ! -d "./$service" ]; then
    echo "⚠️  Directory ./$service not found, skipping..."
    return 1
  fi
  
  # Build multi-platform image and push
  docker buildx build --platform $PLATFORM \
    -t "$DOCKER_USERNAME/$service:latest" \
    --push \
    "./$service"
  
  if [ $? -eq 0 ]; then
    echo "✅ $service completed successfully!"
    return 0
  else
    echo "❌ $service build failed!"
    return 1
  fi
}

# Setup buildx
echo "📦 Setting up Docker buildx..."
docker buildx create --use --name multiarch 2>/dev/null || docker buildx use multiarch
echo ""

# Show menu
echo "Select services to build:"
echo "  0) All services"
for i in "${!ALL_SERVICES[@]}"; do
  echo "  $((i+1))) ${ALL_SERVICES[$i]}"
done
echo "  99) Exit"
echo ""

# Read user input
read -p "Enter your choice (comma-separated for multiple, e.g., 1,3,5): " choice

# Parse choice
if [[ "$choice" == "99" ]]; then
  echo "👋 Exiting..."
  exit 0
elif [[ "$choice" == "0" ]]; then
  # Build all services
  SERVICES_TO_BUILD=("${ALL_SERVICES[@]}")
else
  # Parse comma-separated choices
  IFS=',' read -ra CHOICES <<< "$choice"
  SERVICES_TO_BUILD=()
  
  for c in "${CHOICES[@]}"; do
    c=$(echo "$c" | xargs) # Trim whitespace
    if [[ "$c" =~ ^[0-9]+$ ]] && [ "$c" -ge 1 ] && [ "$c" -le "${#ALL_SERVICES[@]}" ]; then
      SERVICES_TO_BUILD+=("${ALL_SERVICES[$((c-1))]}")
    else
      echo "⚠️  Invalid choice: $c"
    fi
  done
fi

# Check if any services selected
if [ ${#SERVICES_TO_BUILD[@]} -eq 0 ]; then
  echo "❌ No valid services selected!"
  exit 1
fi

echo ""
echo "Services to build: ${SERVICES_TO_BUILD[*]}"
echo ""
read -p "Continue? (y/n): " confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "👋 Cancelled."
  exit 0
fi

echo ""

# Track results
SUCCESS_COUNT=0
FAILED_SERVICES=()

# Build selected services
for service in "${SERVICES_TO_BUILD[@]}"; do
  if build_service "$service"; then
    ((SUCCESS_COUNT++))
  else
    FAILED_SERVICES+=("$service")
  fi
  echo ""
done

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Build Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Successful: $SUCCESS_COUNT"
echo "❌ Failed: ${#FAILED_SERVICES[@]}"

if [ ${#FAILED_SERVICES[@]} -gt 0 ]; then
  echo ""
  echo "Failed services:"
  for service in "${FAILED_SERVICES[@]}"; do
    echo "  - $service"
  done
  exit 1
fi

echo ""
echo "✅ All builds completed successfully!"
echo ""
echo "Next steps:"
echo "  1. Commit changes: git add . && git commit -m 'Update services'"
echo "  2. Push to GitHub: git push origin main"
echo "  3. Restart pods on GCP: kubectl delete pod -l app=<service-name>"
