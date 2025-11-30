#!/bin/bash

set -e

echo "🔧 K8s Deployment Fix Script"
echo "============================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Fix Redis PV if in Released state
echo "${YELLOW}Step 1: Checking Redis PV status...${NC}"
PV_STATUS=$(kubectl get pv redis-pv -o jsonpath='{.status.phase}' 2>/dev/null || echo "NotFound")
if [ "$PV_STATUS" == "Released" ]; then
    echo "${YELLOW}Redis PV is Released, recreating...${NC}"
    kubectl delete pv redis-pv 2>/dev/null || true
    sleep 2
    kubectl apply -f k8s/base/redis-pv.yaml
    echo "${GREEN}✓ Redis PV recreated${NC}"
elif [ "$PV_STATUS" == "NotFound" ]; then
    echo "${YELLOW}Redis PV not found, creating...${NC}"
    kubectl apply -f k8s/base/redis-pv.yaml
    echo "${GREEN}✓ Redis PV created${NC}"
else
    echo "${GREEN}✓ Redis PV is ${PV_STATUS}${NC}"
fi
echo ""

# Step 2: Delete old pods with initContainers stuck
echo "${YELLOW}Step 2: Cleaning up stuck pods with initContainers...${NC}"
STUCK_PODS=$(kubectl get pods --field-selector=status.phase=Pending -o name 2>/dev/null || echo "")
if [ ! -z "$STUCK_PODS" ]; then
    echo "Found stuck pods:"
    echo "$STUCK_PODS"
    kubectl delete $STUCK_PODS --force --grace-period=0 2>/dev/null || true
    echo "${GREEN}✓ Stuck pods deleted${NC}"
else
    echo "${GREEN}✓ No stuck pods found${NC}"
fi
echo ""

# Step 3: Remove initContainers from running deployments (if they exist)
echo "${YELLOW}Step 3: Removing initContainers from deployments...${NC}"
DEPLOYMENTS="cart-service order-service payment-service product-service user-service api-gateway"
for dep in $DEPLOYMENTS; do
    HAS_INIT=$(kubectl get deployment $dep -o jsonpath='{.spec.template.spec.initContainers}' 2>/dev/null || echo "")
    if [ ! -z "$HAS_INIT" ] && [ "$HAS_INIT" != "[]" ]; then
        echo "  Removing initContainers from $dep..."
        kubectl patch deployment $dep --type json -p='[{"op": "remove", "path": "/spec/template/spec/initContainers"}]' 2>/dev/null || true
        echo "${GREEN}  ✓ $dep patched${NC}"
    fi
done
echo ""

# Step 4: Fix permissions on minikube /data directories
echo "${YELLOW}Step 4: Fixing permissions on minikube /data directories...${NC}"
minikube ssh "sudo chown -R 999:999 /data/mysql /data/redis 2>/dev/null || true"
echo "${GREEN}✓ Permissions fixed${NC}"
echo ""

# Step 5: Wait for pods to be ready
echo "${YELLOW}Step 5: Waiting for pods to be ready...${NC}"
echo "Waiting 30 seconds for pods to stabilize..."
sleep 30

# Check pod status
echo ""
echo "${YELLOW}Current Pod Status:${NC}"
kubectl get pods -o custom-columns='NAME:.metadata.name,READY:.status.conditions[?(@.type=="Ready")].status,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,AGE:.metadata.creationTimestamp' --sort-by='.metadata.creationTimestamp'
echo ""

# Step 6: Identify and restart CrashLoopBackOff pods
echo "${YELLOW}Step 6: Checking for CrashLoopBackOff pods...${NC}"
CRASH_PODS=$(kubectl get pods --field-selector=status.phase=Running -o json | jq -r '.items[] | select(.status.containerStatuses[]?.state.waiting.reason == "CrashLoopBackOff") | .metadata.name' 2>/dev/null || echo "")
if [ ! -z "$CRASH_PODS" ]; then
    echo "${RED}Found CrashLoopBackOff pods:${NC}"
    echo "$CRASH_PODS"
    echo ""
    echo "${YELLOW}Deleting crashed pods to trigger restart...${NC}"
    for pod in $CRASH_PODS; do
        echo "  Deleting $pod..."
        kubectl delete pod $pod --grace-period=10 2>/dev/null || true
    done
    echo "${GREEN}✓ Crashed pods deleted, they will be recreated${NC}"
else
    echo "${GREEN}✓ No CrashLoopBackOff pods found${NC}"
fi
echo ""

# Step 7: Summary
echo "${GREEN}============================${NC}"
echo "${GREEN}Fix script completed!${NC}"
echo "${GREEN}============================${NC}"
echo ""
echo "To check the current status, run:"
echo "  kubectl get pods"
echo ""
echo "To watch pods in real-time:"
echo "  kubectl get pods -w"
echo ""
echo "To check Argo CD sync status:"
echo "  kubectl get application ecommerce -n argocd"
