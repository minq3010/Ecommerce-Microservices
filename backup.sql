-- MySQL dump 10.13  Distrib 9.5.0, for Linux (x86_64)
--
-- Host: localhost    Database: app_db
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` bigint DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `price` decimal(19,2) DEFAULT NULL,
  `product_id` varchar(255) NOT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfo8ym9koys22r8r1lgthfos5o` (`user_id`),
  CONSTRAINT `FKfo8ym9koys22r8r1lgthfos5o` FOREIGN KEY (`user_id`) REFERENCES `carts` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (1,1761964391000,'https://via.placeholder.com/300?text=iPhone15',1199.99,'PROD_001','iPhone 15 Pro Max',1,1761964391000,'7758456557f548bd84be8cdc51d18562'),(2,1761964391000,'https://via.placeholder.com/300?text=MacBookPro',3499.99,'PROD_002','MacBook Pro 16 M3 Max',1,1761964391000,'7758456557f548bd84be8cdc51d18562'),(3,1761964391000,'https://via.placeholder.com/300?text=AirPodsPro',249.99,'PROD_003','AirPods Pro',2,1761964391000,'7758456557f548bd84be8cdc51d18562'),(4,1761964391000,'https://via.placeholder.com/300?text=GalaxyS24',1299.99,'PROD_004','Samsung Galaxy S24 Ultra',1,1761964391000,'8497bf87dea44171970ba7aaa2f4fbd5'),(5,1761964391000,'https://via.placeholder.com/300?text=iPadPro',1099.99,'PROD_005','iPad Pro 12.9',1,1761964391000,'8497bf87dea44171970ba7aaa2f4fbd5'),(6,1761964391000,'https://via.placeholder.com/300?text=ApplePencil',129.99,'PROD_006','Apple Pencil Pro',1,1761964391000,'8497bf87dea44171970ba7aaa2f4fbd5'),(7,1761964391000,'https://via.placeholder.com/300?text=SonyHeadphones',399.99,'PROD_007','Sony WH-1000XM5',1,1761964391000,'22da969be9bf47429a2e189dc2fdb738'),(8,1761964391000,'https://via.placeholder.com/300?text=AppleWatchS9',429.99,'PROD_008','Apple Watch Series 9',1,1761964391000,'22da969be9bf47429a2e189dc2fdb738'),(9,1761964391000,'https://via.placeholder.com/300?text=MagicKeyboard',349.99,'PROD_009','Magic Keyboard',1,1761964391000,'22da969be9bf47429a2e189dc2fdb738'),(28,1761969634743,'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/340560/dell-inspiron-15-3530-i5-71070372-638900114510203065-600x600.jpg',13290000.00,'21d57409-17d8-4fee-b0f7-7ad8c1f16609','Laptop Dell Inspiron 15 3530 - 71070372 (i5 1334U, 16GB, 512GB, Full HD 120Hz, OfficeH24+365, Win11)',2,1761969634743,'8497bf87-dea4-4171-970b-a7aaa2f4fbd5'),(29,1761976199692,'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/340560/dell-inspiron-15-3530-i5-71070372-638900114510203065-600x600.jpg',13290000.00,'21d57409-17d8-4fee-b0f7-7ad8c1f16609','Laptop Dell Inspiron 15 3530 - 71070372 (i5 1334U, 16GB, 512GB, Full HD 120Hz, OfficeH24+365, Win11)',4,1761976200796,'923838c2-436a-4e80-8892-e646e6e5184b'),(30,1761976231394,'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/340560/dell-inspiron-15-3530-i5-71070372-638900114510203065-600x600.jpg',13290000.00,'21d57409-17d8-4fee-b0f7-7ad8c1f16609','Laptop Dell Inspiron 15 3530 - 71070372 (i5 1334U, 16GB, 512GB, Full HD 120Hz, OfficeH24+365, Win11)',2,1761976231394,'22da969b-e9bf-4742-9a2e-189dc2fdb738');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `user_id` varchar(36) NOT NULL,
  `created_at` bigint DEFAULT NULL,
  `total_price` decimal(19,2) DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES ('22da969b-e9bf-4742-9a2e-189dc2fdb738',1761976231382,26580000.00,1761976231402),('22da969be9bf47429a2e189dc2fdb738',1761964391000,1179.97,1761964391000),('7758456557f548bd84be8cdc51d18562',1761964391000,5199.96,1761964391000),('8497bf87-dea4-4171-970b-a7aaa2f4fbd5',1761969634731,26580000.00,1761969634752),('8497bf87dea44171970ba7aaa2f4fbd5',1761964391000,2529.97,1761964391000),('923838c2-436a-4e80-8892-e646e6e5184b',1761976199664,53160000.00,1761976200796);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('0fe81c8f-bc09-4b0b-b21e-c320fc01cfce','2025-10-31 00:48:49.399457','Laptop desc',NULL,'Laptop'),('2ea1ff04-b9fa-4d89-8b92-289fd8989e4f','2025-10-31 00:51:26.356332','Mobile desc',NULL,'Mobile'),('be9637f2-87f4-4e67-9448-826b55d7f05c','2025-10-31 01:18:06.767136','SmartWatch desc',NULL,'SmartWatch');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `order_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES ('6642268c-b6e5-11f0-b4b2-9a0b91e66ba1',13290000.00,'prod-1','Laptop Dell Inspiron 15',1,13290000.00,'650e8400-e29b-41d4-a716-446655440001'),('6dc126d4-b6e5-11f0-b4b2-9a0b91e66ba1',1500000.00,'prod-2','Mouse Logitech MX Master',2,3000000.00,'650e8400-e29b-41d4-a716-446655440002'),('6dc12d64-b6e5-11f0-b4b2-9a0b91e66ba1',2300000.00,'prod-3','Keyboard Mechanical RGB',1,2300000.00,'650e8400-e29b-41d4-a716-446655440002'),('70b7672d-b6e5-11f0-b4b2-9a0b91e66ba1',7500000.00,'prod-4','Monitor LG 27 inch 4K',1,7500000.00,'650e8400-e29b-41d4-a716-446655440003'),('736facc4-b6e5-11f0-b4b2-9a0b91e66ba1',1200000.00,'prod-5','USB-C Hub Multi-port',1,1200000.00,'650e8400-e29b-41d4-a716-446655440004');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `item_count` int NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `payment_id` varchar(255) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `shipping_cost` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `tax_amount` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('650e8400-e29b-41d4-a716-446655440001','2024-10-15 10:30:00.000000',1,'Delivered on time','750e8400-e29b-41d4-a716-446655440001','COMPLETED','0912345678','123 Nguyen Hue Street, District 1, HCMC',25000.00,'CONFIRMED',265800.00,2658000.00,'2025-11-01 12:00:50.688847','8497bf87-dea4-4171-970b-a7aaa2f4fbd5'),('650e8400-e29b-41d4-a716-446655440002','2024-10-20 14:15:00.000000',2,'Customer very satisfied','750e8400-e29b-41d4-a716-446655440002','COMPLETED','0912345678','123 Nguyen Hue Street, District 1, HCMC',30000.00,'DELIVERED',530000.00,5300000.00,'2025-11-01 12:43:29.128531','8497bf87-dea4-4171-970b-a7aaa2f4fbd5'),('650e8400-e29b-41d4-a716-446655440003','2024-11-01 08:00:00.000000',3,'In transit','750e8400-e29b-41d4-a716-446655440003','COMPLETED','0912345678','123 Nguyen Hue Street, District 1, HCMC',35000.00,'DELIVERED',750000.00,7500000.00,'2025-11-01 12:01:05.482875','8497bf87-dea4-4171-970b-a7aaa2f4fbd5'),('650e8400-e29b-41d4-a716-446655440004','2024-11-01 15:45:00.000000',1,'Waiting for payment confirmation',NULL,'PENDING','0912345678','123 Nguyen Hue Street, District 1, HCMC',20000.00,'SHIPPED',120000.00,1200000.00,'2025-11-01 12:43:26.781547','8497bf87-dea4-4171-970b-a7aaa2f4fbd5');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `order_id` varchar(255) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES ('c6fe72df-b6e5-11f0-b4b2-9a0b91e66ba1',2658000.00,'2025-11-01 05:44:05.000000','Payment for Order #650e8400','650e8400-e29b-41d4-a716-446655440001','VNPAY','COMPLETED','TXN20241015103001','2025-11-01 05:44:05.000000','8497bf87-dea4-4171-970b-a7aaa2f4fbd5'),('cb0afe9a-b6e5-11f0-b4b2-9a0b91e66ba1',5300000.00,'2025-11-01 05:44:11.000000','Payment for Order #650e8400-2','650e8400-e29b-41d4-a716-446655440002','CREDIT_CARD','COMPLETED','TXN20241020141501','2025-11-01 05:44:11.000000','8497bf87-dea4-4171-970b-a7aaa2f4fbd5'),('cead40cd-b6e5-11f0-b4b2-9a0b91e66ba1',7500000.00,'2025-11-01 05:44:17.000000','Payment for Order #650e8400-3','650e8400-e29b-41d4-a716-446655440003','DEBIT_CARD','COMPLETED','TXN20241101080001','2025-11-01 05:44:17.000000','8497bf87-dea4-4171-970b-a7aaa2f4fbd5'),('d25e0c7d-b6e5-11f0-b4b2-9a0b91e66ba1',1200000.00,'2025-11-01 05:44:24.000000','Payment pending for Order #650e8400-4','650e8400-e29b-41d4-a716-446655440004','VNPAY','PENDING',NULL,'2025-11-01 05:44:24.000000','8497bf87-dea4-4171-970b-a7aaa2f4fbd5');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `original_price` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `rating` double NOT NULL,
  `review_count` int NOT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `stock` int NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
  CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('21d57409-17d8-4fee-b0f7-7ad8c1f16609','2025-10-31 23:41:39.255942','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/340560/dell-inspiron-15-3530-i5-71070372-638900114510203065-600x600.jpg','Laptop Dell Inspiron 15 3530 - 71070372 (i5 1334U, 16GB, 512GB, Full HD 120Hz, OfficeH24+365, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:39.255942','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('24f02997-ed0d-47ba-a7f8-8193254b7385','2025-10-31 23:41:43.653057','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/340560/dell-inspiron-15-3530-i5-71070372-638900114510203065-600x600.jpg','Laptop Dell Inspiron 15 3530 - 71070372 (i5 1334U, 16GB, 512GB, Full HD 120Hz, OfficeH24+365, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:43.653057','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('39978036-a69d-4178-bebe-423fe7a816ea','2025-10-31 23:41:31.299338','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/340560/dell-inspiron-15-3530-i5-71070372-638900114510203065-600x600.jpg','Laptop Dell Inspiron 15 3530 - 71070372 (i5 1334U, 16GB, 512GB, Full HD 120Hz, OfficeH24+365, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:31.299338','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('3b1370d3-d500-47b0-9512-29e6e425ece5','2025-10-31 23:41:43.649869','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/334803/dell-inspiron-15-3530-i5-n5i5530w1-2-638762533281473713-750x500.jpg','Laptop Dell Inspiron 15 3530 - N5I5530W1 (i5 1334U, 16GB, 512GB, Full HD 120Hz, OfficeH24+365, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:43.649869','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('68754de5-b319-46df-9c9d-55c29b540053','2025-10-31 23:41:39.251522','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/335362/macbook-air-13-inch-m4-16gb-256gb-tgdd-1-638768909105991664-750x500.jpg','Laptop MacBook Air 13 inch M4 16GB/256GB',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:39.251522','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('6ff9c6e3-fb43-4936-8084-03f5d48a0fea','2025-10-31 23:41:43.645125','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/327098/hp-15-fc0085au-r5-a6vv8pa-170225-110652-878-600x600.jpg','Laptop HP 15 fc0085AU - A6VV8PA (R5 7430U, 16GB, 512GB, Full HD, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:43.645125','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('71b63b1c-67ad-47b5-a10d-d80bee1e113a','2025-10-31 23:41:31.291924','Product description here','https://cdn.tgdd.vn/Products/Images/44/311178/asus-vivobook-go-15-e1504fa-r5-nj776w-glr-2-750x500.jpg','Laptop HP 15 fc0085AU - A6VV8PA (R5 7430U, 16GB, 512GB, Full HD, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:31.291924','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('7a6683ba-f896-4114-ad1c-8db277855e38','2025-10-31 23:41:43.646174','Product description here','https://cdn.tgdd.vn/Products/Images/44/311178/asus-vivobook-go-15-e1504fa-r5-nj776w-glr-2-750x500.jpg','Laptop HP 15 fc0085AU - A6VV8PA (R5 7430U, 16GB, 512GB, Full HD, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:43.646174','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('8ea4c4cd-c216-4ce5-8ce8-5bf5e99880a0','2025-10-31 23:41:39.254784','Product description here','https://cdn.tgdd.vn/Products/Images/44/325500/lenovo-ideapad-slim-3-15amn8-r5-82xq00j0vn-2-750x500.jpg','Laptop Lenovo Ideapad Slim 3 15AMN8 - 82XQ00J0VN (R5 7520U, 16GB, 512GB, Full HD, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:39.254784','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('9c86ec20-d121-4a7f-8b48-1f3004841242','2025-10-31 23:41:39.249868','Product description here','https://cdn.tgdd.vn/Products/Images/44/311178/asus-vivobook-go-15-e1504fa-r5-nj776w-glr-2-750x500.jpg','Laptop HP 15 fc0085AU - A6VV8PA (R5 7430U, 16GB, 512GB, Full HD, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:39.249868','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('ad173450-3ad2-46f9-953e-b852a8c2caa4','2025-10-31 23:41:43.647735','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/335362/macbook-air-13-inch-m4-16gb-256gb-tgdd-1-638768909105991664-750x500.jpg','Laptop MacBook Air 13 inch M4 16GB/256GB',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:43.647735','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('b35690c5-bc98-447a-ac54-6fda898df9b0','2025-10-31 23:41:39.247238','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/327098/hp-15-fc0085au-r5-a6vv8pa-170225-110652-878-600x600.jpg','Laptop HP 15 fc0085AU - A6VV8PA (R5 7430U, 16GB, 512GB, Full HD, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:39.247238','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('bd4848c9-6baa-4b1d-91da-333e442a69f2','2025-10-31 23:41:31.297241','Product description here','https://cdn.tgdd.vn/Products/Images/44/325500/lenovo-ideapad-slim-3-15amn8-r5-82xq00j0vn-2-750x500.jpg','Laptop Lenovo Ideapad Slim 3 15AMN8 - 82XQ00J0VN (R5 7520U, 16GB, 512GB, Full HD, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:31.297241','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('c92a4abc-b218-4a0a-95c5-5dd8ee75b2af','2025-10-31 23:41:31.294058','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/335362/macbook-air-13-inch-m4-16gb-256gb-tgdd-1-638768909105991664-750x500.jpg','Laptop MacBook Air 13 inch M4 16GB/256GB',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:31.294058','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('c931b8af-ec5f-47b0-b4ec-3a67dec0399f','2025-10-31 23:41:43.651472','Product description here','https://cdn.tgdd.vn/Products/Images/44/325500/lenovo-ideapad-slim-3-15amn8-r5-82xq00j0vn-2-750x500.jpg','Laptop Lenovo Ideapad Slim 3 15AMN8 - 82XQ00J0VN (R5 7520U, 16GB, 512GB, Full HD, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:43.651472','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('d7b0bf34-3134-41fe-856c-02a4dc4b200a','2025-10-31 23:41:31.295676','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/334803/dell-inspiron-15-3530-i5-n5i5530w1-2-638762533281473713-750x500.jpg','Laptop Dell Inspiron 15 3530 - N5I5530W1 (i5 1334U, 16GB, 512GB, Full HD 120Hz, OfficeH24+365, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:31.295676','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('e8667bb2-794a-4331-bf65-ca836ece7301','2025-10-31 23:41:31.284465','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/327098/hp-15-fc0085au-r5-a6vv8pa-170225-110652-878-600x600.jpg','Laptop HP 15 fc0085AU - A6VV8PA (R5 7430U, 16GB, 512GB, Full HD, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:31.284465','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),('f1012996-fe25-4f30-adae-fa3262dbd395','2025-10-31 23:41:39.253086','Product description here','https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/334803/dell-inspiron-15-3530-i5-n5i5530w1-2-638762533281473713-750x500.jpg','Laptop Dell Inspiron 15 3530 - N5I5530W1 (i5 1334U, 16GB, 512GB, Full HD 120Hz, OfficeH24+365, Win11)',150000.00,13290000.00,0,0,'SKU001','ACTIVE',50,'2025-10-31 23:41:39.253086','0fe81c8f-bc09-4b0b-b21e-c320fc01cfce');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` binary(16) NOT NULL,
  `avatar_public_id` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `keycloak_id` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (_binary '\"ږ�\�GB�.�\���8',NULL,NULL,'username@gmail.com','John','22da969b-e9bf-4742-9a2e-189dc2fdb738','Doe','$2a$10$Mj8Cpz9Q.VZasS5vQ56lduodKn.fMHn3oEt4Fke20d55d52ERlyc6','0799199916','ADMIN'),(_binary '����ޤAq����\��\�',NULL,NULL,'root@nnson128.io.vn','Ngoc','8497bf87-dea4-4171-970b-a7aaa2f4fbd5','Son','$2a$10$vwd3gfer6l59bpkdTONmbOP4R639hDz7QcWX6.7g3/QfzcRkMM9/O','0799199915','ADMIN'),(_binary '�88\�CjN���\�F\�\�K',NULL,NULL,'user1@gmail.com','Nguyen ','923838c2-436a-4e80-8892-e646e6e5184b','Son','$2a$10$DHL/lL.HrJNzxB8iCxQj2u0zestBZGnzw0RVkL6a2aBN/dg6.EXk.','0799199918','USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vouchers`
--

DROP TABLE IF EXISTS `vouchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vouchers` (
  `id` varchar(255) NOT NULL,
  `code` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_type` varchar(20) NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `end_date` datetime(6) NOT NULL,
  `max_discount` decimal(10,2) DEFAULT NULL,
  `min_purchase` decimal(10,2) DEFAULT NULL,
  `start_date` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `updated_by` varchar(100) DEFAULT NULL,
  `usage_count` int NOT NULL,
  `usage_limit` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK30ftp2biebbvpik8e49wlmady` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vouchers`
--

LOCK TABLES `vouchers` WRITE;
/*!40000 ALTER TABLE `vouchers` DISABLE KEYS */;
INSERT INTO `vouchers` VALUES ('8fc630e1-bd34-40d8-931c-4ffb347b966e','Summer2025','2025-11-01 11:21:32.565916',NULL,'Summer 2026','PERCENTAGE',25.00,'2025-11-30 00:00:00.000000',NULL,1.00,'2025-11-29 00:00:00.000000','ACTIVE','2025-11-01 11:21:44.393944',NULL,0,1),('94127ad7-4334-4515-ab56-7b604c5ac4b5','Voucher 1','2025-11-01 11:37:33.193409',NULL,'Voucher 1','FIXED',200000.00,'2025-11-28 00:00:00.000000',NULL,32.00,'2025-11-08 00:00:00.000000','ACTIVE','2025-11-01 11:37:33.193409',NULL,0,3232),('f9b2f0ad-993f-4375-bb84-b211c5c59bf0','ELECTRONIC_1/11','2025-11-01 11:38:11.958512',NULL,'ELECTRONIC_1/11','PERCENTAGE',12.00,'2025-11-19 00:00:00.000000',NULL,12.00,'2025-11-05 00:00:00.000000','ACTIVE','2025-11-01 11:38:11.958512',NULL,0,121);
/*!40000 ALTER TABLE `vouchers` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-01  6:03:13
