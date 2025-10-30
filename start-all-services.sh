#!/bin/bash

# ECommerce Platform - Start All Services
# This script starts all microservices in separate processes

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "╔════════════════════════════════════════════════════════╗"
echo "║  🚀 ECommerce Platform - All Services Launcher         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Array of services
SERVICES=(
    "discovery-server:Discovery Server (Eureka):8761"
    "api-gateway:API Gateway:8888"
    "product-service:Product Service:9001"
    "cart-service:Cart Service:9002"
    "order-service:Order Service:9003"
    "user-service:User Service:9004"
    "notification-service:Notification Service:9005"
)

echo -e "${BLUE}📋 Services to start:${NC}"
echo ""
for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r dir name port <<< "$service_info"
    echo -e "  ${GREEN}✓${NC} $name (Port: $port)"
done
echo ""

# Check Docker Compose first
echo -e "${YELLOW}🐳 Checking Docker services...${NC}"
if command -v docker-compose &> /dev/null; then
    echo "Starting docker-compose (MySQL, Kafka, Keycloak, etc.)..."
    cd "$PROJECT_DIR"
    docker-compose up -d
    sleep 5
    echo -e "${GREEN}✅ Docker services started${NC}"
else
    echo -e "${YELLOW}⚠️  Docker Compose not found. Skipping infrastructure setup.${NC}"
fi

echo ""
echo -e "${YELLOW}⏳ Waiting 10 seconds before starting microservices...${NC}"
sleep 10

# Function to start service in background
start_service() {
    local service_script="$PROJECT_DIR/start-$1.sh"
    local service_name="$2"
    
    if [ ! -f "$service_script" ]; then
        echo -e "${RED}❌ Script not found: $service_script${NC}"
        return 1
    fi
    
    echo -e "${BLUE}→ Starting $service_name...${NC}"
    chmod +x "$service_script"
    
    # Start in background and redirect to log file
    LOG_FILE="$PROJECT_DIR/logs/${1}.log"
    mkdir -p "$PROJECT_DIR/logs"
    
    nohup bash "$service_script" > "$LOG_FILE" 2>&1 &
    
    sleep 3
    echo -e "${GREEN}✓ $service_name started (PID: $!, Log: $LOG_FILE)${NC}"
}

# Start all services
echo ""
echo -e "${BLUE}🚀 Starting microservices...${NC}"
echo ""

for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r service_name display_name port <<< "$service_info"
    start_service "$service_name" "$display_name"
done

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ All services started!                              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}📊 Service URLs:${NC}"
echo -e "  Discovery Server (Eureka): ${BLUE}http://localhost:8761${NC}"
echo -e "  API Gateway:               ${BLUE}http://localhost:8888${NC}"
echo -e "  Product Service:           ${BLUE}http://localhost:9001${NC}"
echo -e "  Cart Service:              ${BLUE}http://localhost:9002${NC}"
echo -e "  Order Service:             ${BLUE}http://localhost:9003${NC}"
echo -e "  User Service:              ${BLUE}http://localhost:9004${NC}"
echo -e "  Notification Service:      ${BLUE}http://localhost:9005${NC}"
echo ""
echo -e "${GREEN}📝 Logs:${NC}"
echo "  View logs: ${BLUE}tail -f logs/<service-name>.log${NC}"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "  • Stop services: docker-compose down && pkill -f 'java -jar'"
echo "  • View all services: docker-compose ps && ps aux | grep java"
echo "  • Check health: curl http://localhost:8761/eureka/apps"
echo ""
