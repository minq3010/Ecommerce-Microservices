#!/bin/bash

# ECommerce Discovery Server (Eureka) Startup Script
# Port: 8761

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_DIR="$PROJECT_DIR/discovery-server"

echo "=================================================="
echo "🔍 Starting Discovery Server (Eureka)"
echo "=================================================="
echo ""
echo "📍 Service URL: http://localhost:8761"
echo "📍 Eureka Dashboard: http://localhost:8761/eureka/apps"
echo ""

if [ ! -d "$SERVICE_DIR" ]; then
    echo "❌ Directory not found: $SERVICE_DIR"
    exit 1
fi

cd "$SERVICE_DIR"

echo "🔨 Building Discovery Server..."
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
