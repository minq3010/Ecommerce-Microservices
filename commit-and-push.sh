#!/bin/bash

echo "🔍 Checking git status..."
git status

echo ""
echo "📦 Adding all changes..."
git add k8s/

echo ""
echo "📝 Creating commit..."
git commit -m "feat: Add resources, health probes and persistent volumes

- Added memory limits and CPU resources for Keycloak, MySQL, Kafka, Discovery Server, Zookeeper
- Added readiness and liveness probes for all infrastructure services
- Created PersistentVolumes to mount existing data directories:
  * mysql-pv: /Users/quocnm/Java/workspace/microservice-ecommerce/data/mysql
  * keycloak-mysql-pv: /Users/quocnm/Java/workspace/microservice-ecommerce/data/mysql_keycloak_data
  * redis-pv: /Users/quocnm/Java/workspace/microservice-ecommerce/data/redis
- Updated deployments to use PVCs instead of emptyDir for data persistence
- Configured health checks to prevent premature restarts

This ensures:
✅ Services use existing database data
✅ No OOM kills for Keycloak
✅ Proper startup sequencing with health probes
✅ Resource limits prevent node resource exhaustion"

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! ArgoCD will sync automatically."
