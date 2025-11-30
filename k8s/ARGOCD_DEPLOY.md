# ArgoCD Deployment Guide

## Quick Deploy với ArgoCD

### 1. Tạo Application từ UI
```bash
# Login vào ArgoCD UI: http://localhost:8080
# Username: admin
# Password: (lấy từ kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)

# Tạo Application với thông tin:
# - Application Name: ecommerce-microservices  
# - Project: default
# - Repository URL: https://github.com/minq3010/Ecommerce-Microservices.git
# - Revision: main
# - Path: k8s/base
# - Destination Cluster URL: https://kubernetes.default.svc
# - Namespace: default
```

### 2. Tạo Application từ CLI
```bash
kubectl apply -f k8s/application.yaml
```

### 3. Tạo Application từ ArgoCD CLI
```bash
argocd app create ecommerce-microservices \
  --repo https://github.com/minq3010/Ecommerce-Microservices.git \
  --path k8s/base \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default \
  --sync-policy automated \
  --auto-prune \
  --self-heal
```

## Sync Order (Thứ tự deploy tự động)

| Wave | Components |
|------|------------|
| -2 | MySQL, Keycloak-MySQL, Redis, Keycloak |  
| -1 | Discovery Server |
| 0 | API Gateway |
| 1 | Product Service |
| 2 | Cart Service |
| 3 | Order Service |
| 4 | User Service |
| 5 | Payment Service |
| 6 | Frontend |

## Resources Allocated

**Total Resources Required:**
- Memory: ~4-5GB 
- CPU: ~2-3 cores
- Storage: ~15GB (PV)

**Per Service:**
- Microservices: 128Mi request, 256Mi limit
- Databases: 256Mi request, 512Mi limit  
- Infrastructure: 256Mi request, 1Gi limit

## Access Points

- **Frontend**: http://ecommerce.local (hoặc thông qua NodePort/LoadBalancer)
- **API Gateway**: http://ecommerce.local/api  
- **Keycloak**: http://keycloak-service:8080
- **Discovery Server**: http://discovery-server:8761

## Troubleshooting

```bash
# Kiểm tra tình trạng application
kubectl get applications -n argocd

# Xem sync status
argocd app get ecommerce-microservices

# Sync manual nếu cần
argocd app sync ecommerce-microservices

# Xem logs của pods
kubectl logs -l app=product-service

# Kiểm tra resource usage  
kubectl top pods
```

## Cleanup

```bash
# Xóa application (sẽ xóa toàn bộ resources)
kubectl delete application ecommerce-microservices -n argocd

# Hoặc từ CLI
argocd app delete ecommerce-microservices
```