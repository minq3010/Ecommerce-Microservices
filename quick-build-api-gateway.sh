#!/bin/bash
set -e

echo "🔨 Building API Gateway..."
cd api-gateway
mvn clean package -DskipTests

echo "🐳 Building Docker image..."
docker build -t minq3010/api-gateway:latest .

echo "📤 Pushing to Docker Hub..."
docker push minq3010/api-gateway:latest

echo "✅ Done! Now restart pod on GCP:"
echo "   kubectl delete pod -l app=api-gateway"
