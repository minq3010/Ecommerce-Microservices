# Service Ports và Deployment Order

## 📊 Service Ports Mapping

### Infrastructure Services
| Service | Internal Port | Service Name | Type |
|---------|--------------|--------------|------|
| MySQL | 3306 | mysql | ClusterIP |
| Redis | 6379 | redis | ClusterIP |
| Zookeeper | 2181 | zookeeper | ClusterIP |
| Kafka | 9092, 29092 | kafka | ClusterIP |
| Keycloak | 8080 | keycloak | ClusterIP |

### Discovery & Gateway
| Service | Internal Port | Service Name | External Access |
|---------|--------------|--------------|-----------------|
| Discovery Server | 8761 | discovery-server | N/A |
| API Gateway | 8888 | api-gateway | http://ecommerce.local/api |

### Microservices
| Service | Internal Port | Service Name | gRPC Port |
|---------|--------------|--------------|-----------|
| Product Service | 9001 | product-service | 50051 |
| Cart Service | 9002 | cart-service | 50052 |
| Order Service | 9003 | order-service | 50053 |
| User Service | 9004 | user-service | - |
| Payment Service | 9005 | payment-service | - |

### Frontend
| Service | Internal Port | Service Name | External Access |
|---------|--------------|--------------|-----------------|
| Frontend (Nginx) | 80 | frontend | http://ecommerce.local |

## 🚀 Deployment Order (với initContainers)

### Phase 1: Infrastructure (Deploy đầu tiên)
```bash
1. MySQL (với PersistentVolume - data có sẵn)
2. Redis (với PersistentVolume - data có sẵn)
3. Zookeeper
4. Kafka (depends on: Zookeeper)
5. Keycloak (với ConfigMap realm import)
```

### Phase 2: Service Discovery
```bash
6. Discovery Server (Eureka) - port 8761
   - Có readiness probe: /actuator/health
   - InitialDelaySeconds: 60s
```

### Phase 3: Microservices (với initContainers)
```bash
7. Product Service (port 9001)
   - initContainers: wait-for-mysql, wait-for-discovery
   
8. Cart Service (port 9002)
   - initContainers: wait-for-mysql, wait-for-redis, wait-for-discovery
   
9. Order Service (port 9003)
   - initContainers: wait-for-mysql, wait-for-kafka, wait-for-discovery
   
10. User Service (port 9004)
    - initContainers: wait-for-mysql, wait-for-keycloak, wait-for-discovery
    
11. Payment Service (port 9005)
    - initContainers: wait-for-mysql, wait-for-kafka, wait-for-discovery
```

### Phase 4: Gateway & Frontend
```bash
12. API Gateway (port 8888)
    - initContainers: wait-for-discovery
    - Routes requests to microservices
    
13. Frontend (port 80)
    - Static React app served by Nginx
```

## 🔄 Auto-Deployment với Argo CD

Argo CD sẽ tự động deploy theo thứ tự này vì:
1. **initContainers** đảm bảo dependencies ready
2. **readinessProbe** đảm bảo service sẵn sàng nhận traffic
3. **livenessProbe** tự động restart nếu unhealthy

## 🌐 Access URLs

### Trong K8s Cluster
```
Discovery Server:  http://discovery-server:8761
API Gateway:       http://api-gateway:8888
Product Service:   http://product-service:9001
Cart Service:      http://cart-service:9002
Order Service:     http://order-service:9003
User Service:      http://user-service:9004
Payment Service:   http://payment-service:9005
```

### Từ bên ngoài (qua Ingress)
```
Frontend:          http://ecommerce.local
API Gateway:       http://ecommerce.local/api
Discovery Console: Port-forward: kubectl port-forward svc/discovery-server 8761:8761
```

## ✅ Readiness & Liveness Probes

### Infrastructure
- **MySQL**: mysqladmin ping (initial: 30s, period: 10s)
- **Redis**: TCP check port 6379
- **Kafka**: TCP check port 9092 (initial: 30s)
- **Zookeeper**: TCP check port 2181 (initial: 20s)
- **Keycloak**: HTTP /health/ready, /health/live (initial: 60s/120s)

### Discovery & Microservices
- **Discovery Server**: HTTP /actuator/health (initial: 60s)
- Microservices kế thừa Spring Boot actuator health checks

## 🔧 Resource Limits

| Service | Memory Request | Memory Limit | CPU Request | CPU Limit |
|---------|----------------|--------------|-------------|-----------|
| Keycloak | 1Gi | 2Gi | 500m | 1000m |
| MySQL | 512Mi | 1Gi | 250m | 500m |
| Kafka | 512Mi | 1Gi | 250m | 500m |
| Zookeeper | 256Mi | 512Mi | 125m | 250m |
| Discovery | 512Mi | 1Gi | 250m | 500m |
| Microservices | - | - | - | - |

## 📝 Notes

1. **PersistentVolumes** mount từ minikube `/data/*` directory
2. **initContainers** sử dụng `busybox:1.35` với `nc` command
3. **Argo CD auto-sync** enabled với prune và selfHeal
4. Tất cả services đều có `imagePullPolicy: Always` để pull latest images
