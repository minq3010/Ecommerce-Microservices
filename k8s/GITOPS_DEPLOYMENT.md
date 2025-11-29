# GitOps Deployment với Argo CD

## 📝 Các thay đổi đã thực hiện

### 1. **Resource Limits & Health Probes**
- **Keycloak**: Memory 1Gi-2Gi, CPU 500m-1000m + health probes
- **MySQL**: Memory 512Mi-1Gi, CPU 250m-500m + mysqladmin ping probes
- **Kafka**: Memory 512Mi-1Gi, CPU 250m-500m + TCP probes
- **Zookeeper**: Memory 256Mi-512Mi, CPU 125m-250m + TCP probes
- **Discovery Server**: Memory 512Mi-1Gi, CPU 250m-500m + actuator health probes

### 2. **Persistent Volumes cho Data có sẵn**
```yaml
# MySQL Data
mysql-pv → /Users/quocnm/Java/workspace/microservice-ecommerce/data/mysql

# Keycloak MySQL Data
keycloak-mysql-pv → /Users/quocnm/Java/workspace/microservice-ecommerce/data/mysql_keycloak_data

# Redis Data
redis-pv → /Users/quocnm/Java/workspace/microservice-ecommerce/data/redis
```

## 🚀 Deployment Steps

### Bước 1: Commit và Push lên GitHub
```bash
./commit-and-push.sh
```

Hoặc thủ công:
```bash
git add k8s/
git commit -m "feat: Add resources, health probes and persistent volumes"
git push origin main
```

### Bước 2: Apply Argo CD Application
```bash
kubectl apply -f k8s/argocd/application.yaml
```

### Bước 3: Kiểm tra Argo CD Sync Status
```bash
# Xem trạng thái application
kubectl get applications -n argocd

# Xem chi tiết sync
kubectl describe application ecommerce-microservices -n argocd

# Hoặc mở Argo CD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Mở trình duyệt: https://localhost:8080
- Username: `admin`
- Password: `92iRRQvIksUnimrk`

### Bước 4: Force Sync (nếu cần)
```bash
# Sync manually từ CLI
kubectl patch application ecommerce-microservices -n argocd \
  --type merge \
  --patch '{"operation": {"initiatedBy": {"username": "admin"}, "sync": {"revision": "HEAD"}}}'

# Hoặc dùng argocd CLI
argocd app sync ecommerce-microservices
```

### Bước 5: Kiểm tra Pods
```bash
# Xem tất cả pods
kubectl get pods -o wide

# Xem pods theo restart count
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# Kiểm tra logs
kubectl logs -f <pod-name>

# Xem events
kubectl get events --sort-by='.lastTimestamp'
```

## 📊 Monitoring

### Check PersistentVolumes
```bash
kubectl get pv
kubectl get pvc
```

### Check Resource Usage
```bash
kubectl top nodes
kubectl top pods
```

### Check Service Endpoints
```bash
kubectl get endpoints
```

## 🔧 Troubleshooting

### Nếu pods không ready sau khi sync:
```bash
# Restart deployment
kubectl rollout restart deployment/<deployment-name>

# Delete pod để recreate
kubectl delete pod <pod-name>
```

### Nếu PV không bind:
```bash
# Check PV status
kubectl describe pv mysql-pv

# Check permissions trên host
ls -la /Users/quocnm/Java/workspace/microservice-ecommerce/data/mysql
```

### Xem Argo CD logs:
```bash
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller
```

## 🎯 Expected Results

Sau khi sync thành công:
- ✅ Tất cả pods running và ready (0 restarts)
- ✅ MySQL sử dụng data có sẵn với các bảng: users, products, orders, carts, payments...
- ✅ Keycloak sử dụng keycloak database có sẵn
- ✅ Redis load dump.rdb có sẵn
- ✅ Frontend access: http://ecommerce.local
- ✅ API Gateway access: http://ecommerce.local/api

## 📋 Notes

**Quan trọng về hostPath PersistentVolume:**
- hostPath chỉ hoạt động trên single-node cluster (minikube)
- Đường dẫn phải tồn tại trên node trước khi pod start
- Với production, nên dùng NFS, Ceph, hoặc cloud storage (EBS, GCE PD, Azure Disk)

**Auto-sync enabled:**
- Argo CD sẽ tự động sync khi có changes trên GitHub
- `prune: true` - tự động xóa resources không còn trong Git
- `selfHeal: true` - tự động sửa nếu có manual changes trên cluster
