#!/bin/bash

# ECommerce Platform - Stop All Services

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║  🛑 ECommerce Platform - Stop All Services            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Stop Docker containers
echo -e "${YELLOW}🐳 Stopping Docker containers...${NC}"
if command -v docker-compose &> /dev/null; then
    cd "$PROJECT_DIR"
    docker-compose down
    echo -e "${GREEN}✓ Docker containers stopped${NC}"
else
    echo -e "${YELLOW}⚠️  Docker Compose not found${NC}"
fi

echo ""

# Stop Java processes
echo -e "${YELLOW}☕ Stopping Java processes...${NC}"

# Count Java processes
JAVA_COUNT=$(pgrep -f "java -jar" | wc -l)

if [ $JAVA_COUNT -gt 0 ]; then
    echo "Found $JAVA_COUNT Java process(es)"
    pkill -f "java -jar"
    sleep 2
    echo -e "${GREEN}✓ Java processes stopped${NC}"
else
    echo -e "${YELLOW}⚠️  No Java processes found${NC}"
fi

echo ""

# Stop background services
echo -e "${YELLOW}🔌 Stopping background services...${NC}"
pkill -f "nohup bash"
echo -e "${GREEN}✓ Background services stopped${NC}"

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ All services stopped!                              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}Verify services are stopped:${NC}"
echo "  • Check processes: ps aux | grep java"
echo "  • Check Docker: docker-compose ps"
echo ""
