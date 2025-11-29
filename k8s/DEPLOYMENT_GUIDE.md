# Kubernetes Deployment Guide with Argo CD

## 📋 Prerequisites

- Minikube or Kubernetes cluster running
- kubectl configured
- Argo CD installed in the cluster
- Docker Hub account (username: minq3010)
- Docker logged in: `docker login`

## 🚀 Quick Start

### 1. Build and Push Docker Images

```bash
# Make the script executable
chmod +x build-and-push-all.sh

# Build and push all services to Docker Hub
./build-and-push-all.sh
```

This will build and push all 9 microservices:
- discovery-server
- api-gateway
- product-service
- cart-service
- order-service
- user-service
- payment-service
- notification-service
- frontend

### 2. Start Minikube (if using local cluster)

```bash
minikube start --driver=docker --memory=8192 --cpus=4
minikube addons enable ingress
```

### 3. Install Argo CD

```bash
# Create namespace
kubectl create namespace argocd

# Install Argo CD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
```

### 4. Access Argo CD UI

```bash
# Port forward (in a separate terminal)
kubectl -n argocd port-forward svc/argocd-server 8080:443

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo

# Access UI at: http://localhost:8080
# Username: admin
# Password: (from command above)
```

### 5. Deploy Application with Argo CD

```bash
# Apply the Argo CD Application
kubectl apply -f k8s/argocd/application.yaml

# Check application status
kubectl get applications -n argocd

# Or use Argo CD CLI
argocd app list
argocd app get ecommerce
argocd app sync ecommerce
```

### 6. Access the Application

```bash
# Add to /etc/hosts (for local development)
echo "$(minikube ip) ecommerce.local" | sudo tee -a /etc/hosts

# Access application
# Frontend: http://ecommerce.local
# API Gateway: http://ecommerce.local/api
```

## 📦 Services Architecture

### Infrastructure Services
- **MySQL** (port 3306) - Database
- **Redis** (port 6379) - Cache & session
- **Keycloak** (port 8080) - Authentication
- **Kafka** (port 9092) - Message queue
- **Zookeeper** (port 2181) - Kafka coordinator

### Application Services
- **Discovery Server** (port 8761) - Eureka service discovery
- **API Gateway** (port 8888) - Main gateway
- **Product Service** (port 9001, gRPC 50051) - Product management
- **Cart Service** (port 9002, gRPC 50052) - Shopping cart
- **Order Service** (port 9003, gRPC 50053) - Order processing
- **User Service** (port 9004) - User management
- **Payment Service** (port 9005) - Payment processing
- **Notification Service** (port 9006) - Notifications
- **Frontend** (port 80) - React UI

## 🔐 Security Notes

### Current Configuration
- MySQL credentials are stored in `mysql-secret.yaml` (plaintext in Git)
- Keycloak admin password is hardcoded
- All services use `imagePullPolicy: Always` for development

### Production Recommendations
1. **Use Sealed Secrets or External Secrets Operator**
   ```bash
   # Install Sealed Secrets
   kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.20.0/controller.yaml
   
   # Create sealed secret
   kubectl create secret generic mysql-secret \
     --from-literal=mysql-root-password=STRONG_PASSWORD \
     --from-literal=mysql-user=ecommerce_user \
     --from-literal=mysql-password=STRONG_PASSWORD \
     --dry-run=client -o yaml | \
     kubeseal --format yaml > k8s/base/mysql-sealedsecret.yaml
   ```

2. **Change default passwords**
   - MySQL root password
   - MySQL user password
   - Keycloak admin password

3. **Use specific image tags instead of :latest**
   - Tag images with version or git commit SHA
   - Update k8s manifests accordingly

4. **Enable TLS/HTTPS**
   - Add cert-manager for automatic TLS certificates
   - Update Ingress with TLS configuration

5. **Add resource limits**
   ```yaml
   resources:
     requests:
       memory: "256Mi"
       cpu: "250m"
     limits:
       memory: "512Mi"
       cpu: "500m"
   ```

## 🔍 Monitoring & Debugging

### Check Pod Status
```bash
kubectl get pods -o wide
kubectl describe pod <pod-name>
kubectl logs <pod-name> -f
```

### Check Services
```bash
kubectl get svc
kubectl get ingress
```

### Argo CD Troubleshooting
```bash
# Check application sync status
argocd app get ecommerce

# View application logs
argocd app logs ecommerce

# Force sync
argocd app sync ecommerce --force

# Refresh application
argocd app refresh ecommerce
```

### Access Services Directly (for debugging)
```bash
# Port forward to any service
kubectl port-forward svc/product-service 9001:9001
kubectl port-forward svc/api-gateway 8888:8888
kubectl port-forward svc/keycloak 8080:8080
```

## 🔄 Update Workflow

### Option 1: Update via Docker Images
1. Make code changes
2. Build and push new images: `./build-and-push-all.sh`
3. Restart deployments: `kubectl rollout restart deployment/<service-name>`
4. Or use Argo CD sync: `argocd app sync ecommerce`

### Option 2: Update via Git (GitOps)
1. Update k8s manifests in Git
2. Commit and push to GitHub
3. Argo CD will automatically sync (if auto-sync enabled)
4. Or manually sync: `argocd app sync ecommerce`

## 🧹 Cleanup

```bash
# Delete Argo CD application
kubectl delete -f k8s/argocd/application.yaml

# Delete all resources
kubectl delete -k k8s/base

# Delete Argo CD
kubectl delete namespace argocd

# Stop minikube
minikube stop

# Delete minikube cluster
minikube delete
```

## 📝 TODO for Production

- [ ] Replace plaintext secrets with Sealed Secrets
- [ ] Add persistent volumes for MySQL, Redis, Kafka
- [ ] Configure resource requests and limits
- [ ] Set up horizontal pod autoscaling (HPA)
- [ ] Add health checks and readiness probes
- [ ] Configure proper logging (ELK/Loki)
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Enable HTTPS with cert-manager
- [ ] Configure network policies
- [ ] Set up backup and disaster recovery
- [ ] Add proper RBAC configurations
- [ ] Use specific image tags (semver or git SHA)
- [ ] Configure pod disruption budgets
- [ ] Set up service mesh (Istio/Linkerd) if needed
