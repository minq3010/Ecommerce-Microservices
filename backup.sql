-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: app_db
-- ------------------------------------------------------
-- Server version	8.0.44

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

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories`
(
    `id`          varchar(255) NOT NULL,
    `created_at`  datetime(6) DEFAULT NULL,
    `description` text,
    `image_url`   varchar(500) DEFAULT NULL,
    `name`        varchar(100) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK
TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories`
VALUES ('0fe81c8f-bc09-4b0b-b21e-c320fc01cfce', '2025-10-31 00:48:49.399457', 'Laptop desc', NULL, 'Laptop'),
       ('2ea1ff04-b9fa-4d89-8b92-289fd8989e4f', '2025-10-31 00:51:26.356332', 'Mobile desc', NULL, 'Mobile'),
       ('be9637f2-87f4-4e67-9448-826b55d7f05c', '2025-10-31 01:18:06.767136', 'SmartWatch desc', NULL, 'SmartWatch');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items`
(
    `id`           varchar(255)   NOT NULL,
    `price`        decimal(10, 2) NOT NULL,
    `product_id`   varchar(255)   NOT NULL,
    `product_name` varchar(255)   NOT NULL,
    `quantity`     int            NOT NULL,
    `subtotal`     decimal(10, 2) NOT NULL,
    `order_id`     varchar(255)   NOT NULL,
    PRIMARY KEY (`id`),
    KEY            `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
    CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK
TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders`
(
    `id`               varchar(255)   NOT NULL,
    `created_at`       datetime(6) DEFAULT NULL,
    `item_count`       int            NOT NULL,
    `notes`            varchar(255) DEFAULT NULL,
    `payment_id`       varchar(255) DEFAULT NULL,
    `payment_status`   varchar(50)  DEFAULT NULL,
    `phone_number`     varchar(20)  DEFAULT NULL,
    `shipping_address` varchar(255) DEFAULT NULL,
    `shipping_cost`    decimal(10, 2) NOT NULL,
    `status`           varchar(50)  DEFAULT NULL,
    `tax_amount`       decimal(10, 2) NOT NULL,
    `total_price`      decimal(10, 2) NOT NULL,
    `updated_at`       datetime(6) DEFAULT NULL,
    `user_id`          varchar(255)   NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK
TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products`
(
    `id`             varchar(255)   NOT NULL,
    `created_at`     datetime(6) NOT NULL,
    `description`    text,
    `image_url`      varchar(500) DEFAULT NULL,
    `name`           varchar(255)   NOT NULL,
    `original_price` decimal(10, 2) NOT NULL,
    `price`          decimal(10, 2) NOT NULL,
    `rating` double NOT NULL,
    `review_count`   int            NOT NULL,
    `sku`            varchar(50)  DEFAULT NULL,
    `status`         varchar(50)  DEFAULT NULL,
    `stock`          int            NOT NULL,
    `updated_at`     datetime(6) NOT NULL,
    `category_id`    varchar(255)   NOT NULL,
    PRIMARY KEY (`id`),
    KEY              `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`),
    CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK
TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products`
VALUES ('90f0b556-816e-4d8e-8f89-d0f410167557', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167558', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167559', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167556', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167555', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167554', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167553', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167552', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167551', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167537', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167547', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167257', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167157', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167657', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167757', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410167857', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410162557', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410163557', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410164557', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410165557', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
        ('90f0b556-816e-4d8e-8f89-d0f410166557', '2025-10-31 01:04:30.769953', 'Iphone 15 promax',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/342679/iphone-17-pro-max-cam-7-638947383167025902-750x500.jpg',
        'Iphone 15 promax', 21431.00, 21431.00, 0, 0, NULL, 'ACTIVE', 14123, '2025-10-31 01:04:58.796823',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce'),
       ('911dba6a-e9f1-47c4-84b6-24aa805a8899', '2025-10-31 00:49:10.482250', 'Macbook desc',
        'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/327098/hp-15-fc0085au-r5-a6vv8pa-glr-13-638624254918298255-750x500.jpg',
        'Macbook', 100.00, 100.00, 0, 0, NULL, 'ACTIVE', 10, '2025-10-31 01:01:15.609536',
        '0fe81c8f-bc09-4b0b-b21e-c320fc01cfce');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK
TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users`
(
    `id`               binary(16) NOT NULL,
    `avatar_public_id` varchar(255) DEFAULT NULL,
    `avatar_url`       varchar(255) DEFAULT NULL,
    `email`            varchar(255) NOT NULL,
    `firstname`        varchar(255) DEFAULT NULL,
    `keycloak_id`      varchar(255) DEFAULT NULL,
    `lastname`         varchar(255) DEFAULT NULL,
    `password`         varchar(255) NOT NULL,
    `phone`            varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK
TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users`
VALUES (_binary 'dD�_~CEf��\�ǀZ�', NULL, NULL, 'root2@nnson128.io.vn', 'Ngoc', NULL, 'Son',
        '$2a$10$gma92vozILipzf2u8JqD2.TZVpQGPcQAlcKLMbrFFX824leY0jRvC', '0799198125'),
       (_binary '�ˎQ��G��\�)s9}d', NULL, NULL, 'root@nnson128.io.vn', 'Ngoc', 'a8cb8e51-a8a2-4785-8ce2-042973397d64',
        'Son', '$2a$10$a5GT1jHedLMm.Tjl6tQlNOdssn0MpaFjdPVE46Vuc3KFPTszcfs06', '0799198925'),
       (_binary '\�\�\�\�D\�{\�@܍\�', NULL, NULL, 'root1@nnson128.io.vn', 'Ngoc',
        'd2c51b0c-dbcd-44ed-bf7b-f040dc8df09c', 'Son', '$2a$10$FYfvqzFFcxcRKELt66aQBOSMqCM4whLeEi8ITG.YrXDIQHTEIGZ8u',
        '0799198924');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK
TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-31  1:54:31
