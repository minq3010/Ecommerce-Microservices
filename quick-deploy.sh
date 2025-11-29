#!/bin/bash

# Quick deployment script for local testing
# Usage: ./quick-deploy.sh

set -e

echo "🚀 Quick Deployment Script"
echo ""

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found. Please install kubectl first."
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster."
    echo "Please ensure your cluster is running (minikube start)"
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"
echo ""

# Check if Argo CD is installed
if kubectl get namespace argocd &> /dev/null; then
    echo "✅ Argo CD namespace found"
else
    echo "❌ Argo CD not installed. Installing now..."
    kubectl create namespace argocd
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    echo "⏳ Waiting for Argo CD to be ready..."
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
    echo "✅ Argo CD installed successfully"
fi

echo ""
echo "📦 Applying Argo CD Application..."
kubectl apply -f k8s/argocd/application.yaml

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Get Argo CD admin password:"
echo "   kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=\"{.data.password}\" | base64 -d && echo"
echo ""
echo "2. Port-forward to Argo CD UI:"
echo "   kubectl -n argocd port-forward svc/argocd-server 8080:443"
echo ""
echo "3. Access Argo CD UI at: http://localhost:8080"
echo "   Username: admin"
echo "   Password: (from step 1)"
echo ""
echo "4. Check application status:"
echo "   kubectl get applications -n argocd"
echo ""
echo "5. Add to /etc/hosts for Ingress (if using minikube):"
echo "   echo \"\$(minikube ip) ecommerce.local\" | sudo tee -a /etc/hosts"
echo ""
echo "6. Access application:"
echo "   Frontend: http://ecommerce.local"
echo "   API: http://ecommerce.local/api"
