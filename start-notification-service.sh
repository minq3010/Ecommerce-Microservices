#!/bin/bash

# ECommerce Notification Service Startup Script
# Port: 9005

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_DIR="$PROJECT_DIR/notification-service"

echo "=================================================="
echo "🔔 Starting Notification Service"
echo "=================================================="
echo ""
echo "📍 Service URL: http://localhost:9005"
echo "📍 API Docs: http://localhost:9005/swagger-ui.html"
echo "📍 Health Check: http://localhost:9005/actuator/health"
echo ""

if [ ! -d "$SERVICE_DIR" ]; then
    echo "❌ Directory not found: $SERVICE_DIR"
    exit 1
fi

cd "$SERVICE_DIR"

echo "🔨 Building Notification Service..."
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
