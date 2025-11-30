# Deployment Instructions - Kubernetes với Argo CD

## 📋 Prerequisites

1. Minikube đang chạy
2. Argo CD đã cài đặt trong namespace `argocd`
3. Ingress controller đã enable
4. Docker images đã build và push lên Docker Hub (minq3010/*)

## 🚀 Deployment Steps

### 1. Commit và Push Changes

```bash
git add k8s/
git commit -m "Update K8s manifests"
git push origin main
```

### 2. Apply Argo CD Application

```bash
kubectl apply -f k8s/argocd/application.yaml
```

### 3. Trigger Manual Sync (nếu auto-sync chậm)

```bash
# Option 1: Patch để trigger sync
kubectl patch application ecommerce -n argocd \
  --type merge \
  -p '{"operation":{"initiatedBy":{"username":"admin"},"sync":{"revision":"HEAD"}}}'

# Option 2: Dùng Argo CD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Mở https://localhost:8080, login: admin / 92iRRQvIksUnimrk
# Click "Sync" button
```

### 4. Run Fix Script (nếu có issues)

```bash
./fix-k8s-deployment.sh
```

Script sẽ tự động:
- ✅ Recreate Redis PV nếu bị Released
- ✅ Xóa pods stuck với initContainers  
- ✅ Remove initContainers khỏi deployments
- ✅ Fix permissions trên minikube /data
- ✅ Restart CrashLoopBackOff pods

### 5. Verify Deployment

```bash
# Xem tất cả pods
kubectl get pods

# Xem pods theo restart count
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Xem logs của pod cụ thể
kubectl logs <pod-name> --tail=50

# Watch pods real-time
kubectl get pods -w
```

## 🎯 Expected Service Ports

Sau khi deploy thành công, services sẽ accessible qua:

| Service | Internal Port | External Access |
|---------|--------------|-----------------|
| Discovery Server | 8761 | http://ecommerce.local/eureka |
| API Gateway | 8888 | http://ecommerce.local/api |
| Product Service | 9001 | via API Gateway |
| Cart Service | 9002 | via API Gateway |
| Order Service | 9003 | via API Gateway |
| User Service | 9004 | via API Gateway |
| Payment Service | 9005 | via API Gateway |
| Frontend | 80 | http://ecommerce.local |
| Keycloak | 8080 | http://ecommerce.local/auth |

## 🔧 Common Issues & Solutions

### Issue 1: Redis PV ở trạng thái "Released"

**Symptom:** Redis pod Pending, PVC không bind

**Solution:**
```bash
kubectl delete pv redis-pv
kubectl apply -f k8s/base/redis-pv.yaml
```

### Issue 2: Pods stuck với InitContainers

**Symptom:** Pods ở trạng thái Init:1/3, không bao giờ ready

**Solution:** Run fix script hoặc:
```bash
kubectl patch deployment <deployment-name> --type json \
  -p='[{"op": "remove", "path": "/spec/template/spec/initContainers"}]'
```

### Issue 3: Keycloak CrashLoopBackOff

**Symptom:** Keycloak restart liên tục, logs show "Killed"

**Reasons:**
- OOM (out of memory)
- Liveness probe timeout

**Solution:** Đã thêm memory limits 2Gi và tăng probe timeouts

### Issue 4: Services không kết nối MySQL

**Symptom:** Hibernate error "Unable to determine Dialect"

**Solution:** Đã thêm SPRING_DATASOURCE_URL env vars vào tất cả deployments

### Issue 5: Old pods không bị xóa sau sync

**Solution:**
```bash
kubectl delete pod <old-pod-name> --force --grace-period=0
```

## 📊 Health Check Commands

```bash
# Check Argo CD sync status
kubectl get application ecommerce -n argocd

# Check all services
kubectl get svc

# Check endpoints
kubectl get endpoints

# Check PV/PVC status
kubectl get pv,pvc

# Check resource usage
kubectl top pods
kubectl top nodes

# Check events
kubectl get events --sort-by='.lastTimestamp' | tail -20
```

## 🔄 Re-deploy from Scratch

Nếu muốn deploy lại từ đầu:

```bash
# 1. Xóa tất cả resources
kubectl delete all --all
kubectl delete pvc --all
kubectl delete configmap keycloak-realm-config
kubectl delete pv redis-pv

# 2. Xóa Argo CD application
kubectl delete application ecommerce -n argocd

# 3. Apply lại
kubectl apply -f k8s/argocd/application.yaml

# 4. Run fix script
./fix-k8s-deployment.sh
```

## 📝 Notes

### Về PersistentVolumes

- **MySQL**: Dùng emptyDir (fresh start mỗi lần deploy)
- **Keycloak**: Có MySQL riêng với emptyDir
- **Redis**: Dùng hostPath mount `/data/redis` từ minikube

### Về InitContainers

InitContainers đã bị remove vì:
- Busybox `nc -z` không hoạt động đúng
- Spring Boot có built-in retry mechanism
- Gây chậm startup không cần thiết

### Về Resource Limits

Đã thêm resource requests/limits cho:
- API Gateway: 512Mi-1Gi RAM
- Keycloak: 1Gi-2Gi RAM  
- MySQL: 512Mi-1Gi RAM
- Kafka, Zookeeper, Redis: 256Mi-512Mi RAM

## 🎉 Success Criteria

Deployment thành công khi:
- ✅ Tất cả pods ở trạng thái Running
- ✅ READY column hiển thị 1/1
- ✅ RESTARTS = 0 hoặc rất thấp (<3)
- ✅ Frontend accessible tại http://ecommerce.local
- ✅ API Gateway routing đúng
- ✅ Keycloak ready với MySQL backend
