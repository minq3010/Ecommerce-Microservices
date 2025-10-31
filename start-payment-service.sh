#!/bin/bash

# ECommerce API Gateway Startup Script
# Port: 8888

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_DIR="$PROJECT_DIR/payment-service"

echo "=================================================="
echo "🌐 Starting Payment service"
echo "=================================================="
echo ""
echo "📍 Gateway URL: http://localhost:8888"
echo "📍 Health Check: http://localhost:8888/actuator/health"
echo ""

if [ ! -d "$SERVICE_DIR" ]; then
    echo "❌ Directory not found: $SERVICE_DIR"
    exit 1
fi

cd "$SERVICE_DIR"

echo "🔨 Building API Gateway..."
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
echo "⏳ Waiting for Discovery Server to be available..."
sleep 5

java -jar "$JAR_FILE"
