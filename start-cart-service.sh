#!/bin/bash

# ECommerce Cart Service Startup Script
# Port: 9002
# gRPC Port: 50052

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_DIR="$PROJECT_DIR/cart-service"

echo "=================================================="
echo "🛒 Starting Cart Service"
echo "=================================================="
echo ""
echo "📍 Service URL: http://localhost:9002"
echo "📍 API Docs: http://localhost:9002/swagger-ui.html"
echo "📍 gRPC Port: 50052"
echo "📍 Health Check: http://localhost:9002/actuator/health"
echo ""

if [ ! -d "$SERVICE_DIR" ]; then
    echo "❌ Directory not found: $SERVICE_DIR"
    exit 1
fi

cd "$SERVICE_DIR"

echo "🔨 Building Cart Service..."
mvn clean install -DskipTests
echo "✅ Build complete"
echo ""

# Find JAR file
JAR_FILE=$(find target -name "*-SNAPSHOT.jar" -not -name "*sources.jar" | head -1)

if [ -z "$JAR_FILE" ]; then
    echo "❌ No JAR file found in target/"
    exit 1
fi

echo "🚀 Starting: $JAR_FILE"
echo ""

java -jar "$JAR_FILE"
