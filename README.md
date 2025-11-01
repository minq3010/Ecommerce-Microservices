### backup cmd
```
# docker exec -it 356f38018197 /opt/keycloak/bin/kc.sh export --dir /opt/keycloak/data/export --realm app-realms
# docker exec -it ecommerce-microservice-keycloak-1 /opt/keycloak/bin/kc.sh export --dir /opt/keycloak/data/export --realm app-realms --users same_file
# docker exec -it 246f28feb7ba mysqldump -u root -proot app_db > backup.sql

```
### auth
```
Phân quyền theo group
```

```
Service URLs khi chạy:
🔍 Discovery: http://localhost:8761
🌐 1. Gateway: http://localhost:8888
📦 2. Products: http://localhost:9001
🛒 3. Cart: http://localhost:9002
📋 4. Order-service: http://localhost:9003
👤 5. User-service: http://localhost:9004
🔔 6. payment-service: http://localhost:9005
🔔 7. Notification-service: http://localhost:9005
⚛️ Frontend: http://localhost:5173
```
