# 📊 Service Port Mapping & Architecture Overview

## ✅ Port Allocation Summary (NO CONFLICTS)
### Infrastructure Services
| Service | Pod Name | Container Port(s) | Service Port(s) | Type | Notes |
|---------|----------|-------------------:|----------------:|------:|-------|
| **MySQL** | `mysql-xxx` | 3306 | 3306 | ClusterIP | Database |
| **Redis** | `redis-xxx` | 6379 | 6379 | ClusterIP | Cache & session store |
| **Keycloak** | `keycloak-xxx` | 8080 | 8080 | ClusterIP | Authentication / IAM |
| **Zookeeper** | `zookeeper-xxx` | 2181 | 2181 | ClusterIP | Kafka coordinator |
| **Kafka** | `kafka-xxx` | 9092, 29092 | 9092 (external), 29092 (internal) | ClusterIP | Message broker |

### Application Services (Microservices)
| Service | Pod Name | HTTP Port | gRPC Port | Service Port(s) | Type | Notes |
|---------|----------|----------:|----------:|----------------:|------:|-------|
| **Discovery Server** | `discovery-server-xxx` | 8761 | - | 8761 | ClusterIP | Eureka service discovery |
| **API Gateway** | `api-gateway-xxx` | 8888 | - | 8888 | ClusterIP | Main gateway / routing |
| **Product Service** | `product-service-xxx` | 9001 | 50051 | 9001, 50051 | ClusterIP | Product management |
| **Cart Service** | `cart-service-xxx` | 9002 | 50052 | 9002, 50052 | ClusterIP | Shopping cart |
| **Order Service** | `order-service-xxx` | 9003 | 50053 | 9003, 50053 | ClusterIP | Order processing |
| **User Service** | `user-service-xxx` | 9004 | - | 9004 | ClusterIP | User management |
| **Notification Service** | `notification-service-xxx` | 9005 | - | 9005 | ClusterIP | Notification consumers |
| **Payment Service** | `payment-service-xxx` | 8006 | - | 8006 | ClusterIP | Payment processing |
| **Frontend** | `frontend-xxx` | 80 | - | 80 | ClusterIP | React UI (served via Nginx) |

## 🔀 Port Range Summary

### HTTP Ports (No Conflicts ✅)
- **80**: Frontend (Nginx)
- **2181**: Zookeeper
- **3306**: MySQL
- **6379**: Redis
- **8006**: Payment Service
- **8080**: Keycloak
- **8761**: Discovery Server (Eureka)
- **8888**: API Gateway
- **9001**: Product Service
- **9002**: Cart Service
- **9003**: Order Service
- **9004**: User Service
- **9005**: Notification Service
- **9092**: Kafka (external)
- **29092**: Kafka (internal)

### gRPC Ports (No Conflicts ✅)
- **50051**: Product Service gRPC
- **50052**: Cart Service gRPC
- **50053**: Order Service gRPC

## 🌐 Ingress Configuration

### External Access via Ingress (ecommerce.local)
| Path | Backend Service | Port | Description |
|------|----------------|------|-------------|
| `/` | frontend | 80 | Main UI |
| `/api` | api-gateway | 8888 | API endpoints |

### Internal Service Communication
All services communicate internally via Kubernetes DNS:
- `mysql:3306`
- `redis:6379`
- `keycloak:8080`
- `kafka:9092`
- `discovery-server:8761`
- `product-service:9001` (HTTP) or `product-service:50051` (gRPC)
- `cart-service:9002` (HTTP) or `cart-service:50052` (gRPC)
- `order-service:9003` (HTTP) or `order-service:50053` (gRPC)
- `user-service:9004`
- `payment-service:8006`
- `notification-service:9005`

## 🔗 Service Dependencies

### Product Service
- **Depends on**: MySQL, Discovery Server, Keycloak
- **Used by**: API Gateway, Cart Service, Order Service
- **Protocols**: HTTP (9001), gRPC (50051)

### Cart Service
- **Depends on**: Redis, Discovery Server, Keycloak, Product Service (gRPC)
- **Used by**: API Gateway, Order Service
- **Protocols**: HTTP (9002), gRPC (50052)

### Order Service
- **Depends on**: MySQL, Discovery Server, Keycloak, Product Service (gRPC), Cart Service (gRPC), Kafka
- **Used by**: API Gateway, Payment Service
- **Protocols**: HTTP (9003), gRPC (50053)

### User Service
- **Depends on**: MySQL, Discovery Server, Keycloak
- **Used by**: API Gateway
- **Protocols**: HTTP (9004)

### Payment Service
- **Depends on**: MySQL, Discovery Server, Keycloak, Order Service
- **Used by**: API Gateway
- **Protocols**: HTTP (8006)

### Notification Service
- **Depends on**: Kafka, Discovery Server
- **Used by**: Event-driven (Kafka consumers)
- **Protocols**: HTTP (9005)

### API Gateway
- **Depends on**: Discovery Server, Keycloak
- **Routes to**: All microservices
- **Protocols**: HTTP (8888)

### Frontend
- **Depends on**: API Gateway
- **Accessible via**: Ingress (http://ecommerce.local)
- **Protocols**: HTTP (80)

## 📋 Pod Naming Convention

Kubernetes generates pod names with format: `<deployment-name>-<replica-set-hash>-<pod-hash>`

Example pod names you'll see:
```
mysql-7b8c9d4f5-x6k2l
redis-6c7d8e9f-y7m3n
keycloak-5b6c7d8e-z8n4p
zookeeper-4a5b6c7d-a9p5q
kafka-3a4b5c6d-b0q6r
discovery-server-2a3b4c5d-c1r7s
api-gateway-1a2b3c4d-d2s8t
product-service-0a1b2c3d-e3t9u
cart-service-9a0b1c2d-f4u0v
order-service-8a9b0c1d-g5v1w
user-service-7a8b9c0d-h6w2x
payment-service-6a7b8c9d-i7x3y
notification-service-5a6b7c8d-j8y4z
frontend-4a5b6c7d-k9z5a
```

## 🔍 Verify Running Pods

```bash
# List all pods
kubectl get pods -o wide

# Check specific service
kubectl get pods -l app=product-service
kubectl get pods -l app=api-gateway

# Check pod logs
kubectl logs -f <pod-name>

# Get pod details
kubectl describe pod <pod-name>

# Check service endpoints
kubectl get endpoints

# List all services
kubectl get svc
```

## 🚀 Access Services (Development)

### Via Port Forward
```bash
# Frontend
kubectl port-forward svc/frontend 3000:80

# API Gateway
kubectl port-forward svc/api-gateway 8888:8888

# Discovery Server (Eureka Dashboard)
kubectl port-forward svc/discovery-server 8761:8761

# Keycloak Admin
kubectl port-forward svc/keycloak 8080:8080

# Any microservice
kubectl port-forward svc/product-service 9001:9001
kubectl port-forward svc/cart-service 9002:9002
kubectl port-forward svc/order-service 9003:9003
```

### Via Ingress (Recommended)
```bash
# Add to /etc/hosts
echo "$(minikube ip) ecommerce.local" | sudo tee -a /etc/hosts

# Access via browser
http://ecommerce.local          # Frontend
http://ecommerce.local/api      # API Gateway
```

## 📊 Resource Usage (Estimated)

| Service | Replicas | Memory Request | CPU Request | Notes |
|---------|----------|----------------|-------------|-------|
| MySQL | 1 | 512Mi | 250m | Consider PVC for persistence |
| Redis | 1 | 128Mi | 100m | Fast, in-memory |
| Keycloak | 1 | 512Mi | 250m | Can be heavy |
| Kafka | 1 | 512Mi | 250m | Message broker |
| Zookeeper | 1 | 256Mi | 100m | Kafka dependency |
| Discovery | 1 | 256Mi | 200m | Lightweight |
| API Gateway | 1-3 | 512Mi | 300m | Scale as needed |
| Product Service | 1-3 | 512Mi | 300m | Business logic |
| Cart Service | 1-3 | 512Mi | 300m | High traffic |
| Order Service | 1-3 | 512Mi | 300m | Business logic |
| User Service | 1-2 | 512Mi | 300m | Auth heavy |
| Payment Service | 1-2 | 512Mi | 300m | Critical |
| Notification | 1-2 | 256Mi | 200m | Event consumer |
| Frontend | 1-3 | 128Mi | 100m | Static files |

**Total Estimated**: ~6-8 GB RAM, 3-4 CPU cores for minimal deployment

## ⚠️ Important Notes

1. **All ports are conflict-free** ✅
2. **gRPC services** expose both HTTP and gRPC ports
3. **Internal communication** happens via Kubernetes DNS (service names)
4. **External access** is via Ingress or port-forward only
5. **No NodePort or LoadBalancer** services (ClusterIP only for security)
6. **Database credentials** in mysql-secret.yaml need to be replaced for production
7. **Image tags** use `:latest` - consider using specific versions for production
