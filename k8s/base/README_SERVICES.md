This folder contains minimal Deployment and Service manifests for several components used by the
microservice-ecommerce project. These are scaffolds — update images, resource requests, persistence
and other settings before using in production.

Included manifests:
- `mysql-*` : MySQL secret, deployment (ephemeral volume) and service
- `redis-*` : Redis deployment and service
- `keycloak-*` : Keycloak (dev mode) deployment and service
- `discovery-*` : Discovery server deployment and service (image placeholder)
- `api-gateway-*` : API Gateway deployment and service (image placeholder)
- `product-*` : Product service deployment and service (image placeholder)

Important notes:
- Replace `yourregistry/<service>:latest` with the registry where you push built images.
- For MySQL persistence, replace `emptyDir` with a `PersistentVolumeClaim`.
- The `argocd` Application manifest at `k8s/argocd/application.yaml` points to this path.
