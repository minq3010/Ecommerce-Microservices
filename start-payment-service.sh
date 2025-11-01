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
# First try the usual *-SNAPSHOT.jar produced when finalName is default.
JAR_FILE=$(find target -name "*-SNAPSHOT.jar" -not -name "*sources.jar" | head -1)

# If not found, pick the first non-original jar in target/ (handles repackaged boot jars
# which often use the artifactId as the final name, e.g. payment-service.jar).
if [ -z "$JAR_FILE" ]; then
    # Use ls and filter out any .jar.original and sources jars. Suppress errors if no matches.
    JAR_FILE=$(ls target/*.jar 2>/dev/null | grep -v "\.jar\.original$" | grep -v "sources.jar" | head -1 || true)
fi

if [ -z "$JAR_FILE" ]; then
    echo "❌ No JAR file found in target/"
    exit 1
fi

echo "🚀 Starting: $JAR_FILE"
echo ""
echo "⏳ Waiting for Discovery Server to be available..."
sleep 5

java -jar "$JAR_FILE"
