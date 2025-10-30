#!/bin/bash

# ECommerce Frontend - Start React Dev Server
# Port: 5173

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_DIR/frontend"

echo "=================================================="
echo "⚛️  Starting React Frontend"
echo "=================================================="
echo ""
echo "📍 Frontend URL: http://localhost:5173"
echo "📍 Hot Module Reload: Enabled"
echo ""

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

cd "$FRONTEND_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

echo "🚀 Starting development server..."
echo ""

npm run dev
