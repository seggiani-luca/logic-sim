-- Progettazione Web
DROP DATABASE IF EXISTS seggiani_672343;
CREATE DATABASE seggiani_672343;
USE seggiani_672343;
-- MariaDB dump 10.19  Distrib 10.4.21-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: seggiani_672343
-- ------------------------------------------------------
-- Server version	10.4.21-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `circuits`
--

DROP TABLE IF EXISTS `circuits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `circuits` (
  `user` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `circuit` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`circuit`)),
  PRIMARY KEY (`user`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `circuits`
--

LOCK TABLES `circuits` WRITE;
/*!40000 ALTER TABLE `circuits` DISABLE KEYS */;
INSERT INTO `circuits` VALUES ('Luca','2 bit adder','{\"circuitName\": \"2 bit adder\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 10}, {\"pinIdx\": 0, \"componentIdx\": 12}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 7}, {\"pinIdx\": 0, \"componentIdx\": 5}]}], \"position\": {\"x\": 150, \"y\": 225}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 7}, {\"pinIdx\": 1, \"componentIdx\": 5}]}], \"position\": {\"x\": 150, \"y\": 465}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 10}, {\"pinIdx\": 1, \"componentIdx\": 12}]}], \"position\": {\"x\": 150, \"y\": 375}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 6}, {\"pinIdx\": 1, \"componentIdx\": 8}]}], \"position\": {\"x\": 150, \"y\": 615}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 8}, {\"pinIdx\": 0, \"componentIdx\": 6}]}], \"position\": {\"x\": 390, \"y\": 390}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 16}]}], \"position\": {\"x\": 510, \"y\": 420}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 9}]}], \"position\": {\"x\": 510, \"y\": 510}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 9}]}], \"position\": {\"x\": 510, \"y\": 570}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 11}, {\"pinIdx\": 1, \"componentIdx\": 13}]}], \"position\": {\"x\": 630, \"y\": 540}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 11}, {\"pinIdx\": 0, \"componentIdx\": 13}]}], \"position\": {\"x\": 690, \"y\": 150}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 15}]}], \"position\": {\"x\": 810, \"y\": 180}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 14}]}], \"position\": {\"x\": 810, \"y\": 270}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 14}]}], \"position\": {\"x\": 810, \"y\": 330}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 17}]}], \"position\": {\"x\": 930, \"y\": 300}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1170, \"y\": 165}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1170, \"y\": 255}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1170, \"y\": 405}}]}'),('Luca','2 bit comparator','{\"circuitName\": \"2 bit comparator\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 8}, {\"pinIdx\": 0, \"componentIdx\": 9}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 5}, {\"pinIdx\": 0, \"componentIdx\": 4}]}], \"position\": {\"x\": 150, \"y\": 225}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 11}, {\"pinIdx\": 0, \"componentIdx\": 15}, {\"pinIdx\": 0, \"componentIdx\": 14}]}], \"position\": {\"x\": 150, \"y\": 465}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 12}]}], \"position\": {\"x\": 150, \"y\": 375}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 6}]}], \"position\": {\"x\": 390, \"y\": 390}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 7}]}], \"position\": {\"x\": 510, \"y\": 510}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 7}]}], \"position\": {\"x\": 510, \"y\": 570}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 10}]}], \"position\": {\"x\": 630, \"y\": 540}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 10}]}], \"position\": {\"x\": 690, \"y\": 150}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 13}]}], \"position\": {\"x\": 810, \"y\": 270}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 13}]}], \"position\": {\"x\": 810, \"y\": 330}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 5}, {\"pinIdx\": 1, \"componentIdx\": 4}]}], \"position\": {\"x\": 225, \"y\": 495}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 9}, {\"pinIdx\": 1, \"componentIdx\": 8}]}], \"position\": {\"x\": 225, \"y\": 405}}, {\"type\": \"NOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 16}]}], \"position\": {\"x\": 930, \"y\": 300}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 6}]}], \"position\": {\"x\": 240, \"y\": 600}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 14}]}], \"position\": {\"x\": 165, \"y\": 645}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1080, \"y\": 285}}]}'),('Luca','2 bit decoder','{\"circuitName\": \"2 bit decoder\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 6}, {\"pinIdx\": 0, \"componentIdx\": 2}, {\"pinIdx\": 0, \"componentIdx\": 3}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 7}, {\"pinIdx\": 1, \"componentIdx\": 2}, {\"pinIdx\": 1, \"componentIdx\": 4}]}], \"position\": {\"x\": 150, \"y\": 315}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 8}]}], \"position\": {\"x\": 510, \"y\": 150}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 9}]}], \"position\": {\"x\": 510, \"y\": 240}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 10}]}], \"position\": {\"x\": 510, \"y\": 330}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 11}]}], \"position\": {\"x\": 510, \"y\": 420}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 5}, {\"pinIdx\": 0, \"componentIdx\": 4}]}], \"position\": {\"x\": 225, \"y\": 195}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 5}, {\"pinIdx\": 1, \"componentIdx\": 3}]}], \"position\": {\"x\": 225, \"y\": 375}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 660, \"y\": 135}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 660, \"y\": 225}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 660, \"y\": 315}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 660, \"y\": 405}}]}'),('Luca','2 bit subtractor','{\"circuitName\": \"2 bit subtractor\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 10}, {\"pinIdx\": 0, \"componentIdx\": 12}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 7}, {\"pinIdx\": 0, \"componentIdx\": 5}]}], \"position\": {\"x\": 150, \"y\": 225}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 15}]}], \"position\": {\"x\": 150, \"y\": 465}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 16}]}], \"position\": {\"x\": 150, \"y\": 375}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 14}]}], \"position\": {\"x\": 150, \"y\": 615}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 8}, {\"pinIdx\": 0, \"componentIdx\": 6}]}], \"position\": {\"x\": 390, \"y\": 390}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 19}]}], \"position\": {\"x\": 510, \"y\": 420}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 9}]}], \"position\": {\"x\": 510, \"y\": 510}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 9}]}], \"position\": {\"x\": 510, \"y\": 570}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 11}, {\"pinIdx\": 1, \"componentIdx\": 13}]}], \"position\": {\"x\": 630, \"y\": 540}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 11}, {\"pinIdx\": 0, \"componentIdx\": 13}]}], \"position\": {\"x\": 690, \"y\": 150}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 18}]}], \"position\": {\"x\": 810, \"y\": 180}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 17}]}], \"position\": {\"x\": 810, \"y\": 270}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 17}]}], \"position\": {\"x\": 810, \"y\": 330}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 8}, {\"pinIdx\": 1, \"componentIdx\": 6}]}], \"position\": {\"x\": 225, \"y\": 645}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 7}, {\"pinIdx\": 1, \"componentIdx\": 5}]}], \"position\": {\"x\": 225, \"y\": 495}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 12}, {\"pinIdx\": 1, \"componentIdx\": 10}]}], \"position\": {\"x\": 225, \"y\": 405}}, {\"type\": \"NOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 20}]}], \"position\": {\"x\": 930, \"y\": 300}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1170, \"y\": 165}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1170, \"y\": 255}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1170, \"y\": 405}}]}'),('Luca','3 bit decoder','{\"circuitName\": \"3 bit decoder\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 11}, {\"pinIdx\": 0, \"componentIdx\": 6}, {\"pinIdx\": 0, \"componentIdx\": 5}, {\"pinIdx\": 0, \"componentIdx\": 4}, {\"pinIdx\": 0, \"componentIdx\": 3}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 12}, {\"pinIdx\": 0, \"componentIdx\": 16}, {\"pinIdx\": 0, \"componentIdx\": 17}, {\"pinIdx\": 0, \"componentIdx\": 20}, {\"pinIdx\": 0, \"componentIdx\": 21}]}], \"position\": {\"x\": 150, \"y\": 315}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 13}, {\"pinIdx\": 1, \"componentIdx\": 15}, {\"pinIdx\": 1, \"componentIdx\": 19}, {\"pinIdx\": 1, \"componentIdx\": 17}, {\"pinIdx\": 1, \"componentIdx\": 21}]}], \"position\": {\"x\": 150, \"y\": 495}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 29}]}], \"position\": {\"x\": 750, \"y\": 150}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 28}]}], \"position\": {\"x\": 750, \"y\": 240}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 27}]}], \"position\": {\"x\": 750, \"y\": 330}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 26}]}], \"position\": {\"x\": 750, \"y\": 420}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 25}]}], \"position\": {\"x\": 750, \"y\": 510}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 24}]}], \"position\": {\"x\": 750, \"y\": 600}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 23}]}], \"position\": {\"x\": 750, \"y\": 690}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 22}]}], \"position\": {\"x\": 750, \"y\": 780}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 10}, {\"pinIdx\": 0, \"componentIdx\": 9}, {\"pinIdx\": 0, \"componentIdx\": 8}, {\"pinIdx\": 0, \"componentIdx\": 7}]}], \"position\": {\"x\": 225, \"y\": 195}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 14}, {\"pinIdx\": 0, \"componentIdx\": 15}, {\"pinIdx\": 0, \"componentIdx\": 18}, {\"pinIdx\": 0, \"componentIdx\": 19}]}], \"position\": {\"x\": 225, \"y\": 375}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 14}, {\"pinIdx\": 1, \"componentIdx\": 16}, {\"pinIdx\": 1, \"componentIdx\": 18}, {\"pinIdx\": 1, \"componentIdx\": 20}]}], \"position\": {\"x\": 225, \"y\": 555}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 10}]}], \"position\": {\"x\": 630, \"y\": 810}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 9}]}], \"position\": {\"x\": 630, \"y\": 720}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 8}]}], \"position\": {\"x\": 630, \"y\": 630}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 7}]}], \"position\": {\"x\": 630, \"y\": 540}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 6}]}], \"position\": {\"x\": 630, \"y\": 450}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 5}]}], \"position\": {\"x\": 630, \"y\": 360}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 4}]}], \"position\": {\"x\": 630, \"y\": 270}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 3}]}], \"position\": {\"x\": 630, \"y\": 180}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 765}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 675}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 585}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 495}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 405}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 315}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 225}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 135}}]}'),('Luca','4 bit adder','{\"circuitName\": \"4 bit adder\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 24}, {\"pinIdx\": 0, \"componentIdx\": 26}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 19}, {\"pinIdx\": 0, \"componentIdx\": 21}]}], \"position\": {\"x\": 150, \"y\": 225}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 14}, {\"pinIdx\": 1, \"componentIdx\": 16}]}], \"position\": {\"x\": 150, \"y\": 855}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 9}, {\"pinIdx\": 1, \"componentIdx\": 11}]}], \"position\": {\"x\": 150, \"y\": 945}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 12}, {\"pinIdx\": 1, \"componentIdx\": 10}]}], \"position\": {\"x\": 150, \"y\": 1095}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 19}, {\"pinIdx\": 1, \"componentIdx\": 21}]}], \"position\": {\"x\": 150, \"y\": 765}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 24}, {\"pinIdx\": 1, \"componentIdx\": 26}]}], \"position\": {\"x\": 150, \"y\": 675}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 14}, {\"pinIdx\": 0, \"componentIdx\": 16}]}], \"position\": {\"x\": 150, \"y\": 315}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 9}, {\"pinIdx\": 0, \"componentIdx\": 11}]}], \"position\": {\"x\": 150, \"y\": 405}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 12}, {\"pinIdx\": 0, \"componentIdx\": 10}]}], \"position\": {\"x\": 390, \"y\": 870}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 32}]}], \"position\": {\"x\": 510, \"y\": 900}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 13}]}], \"position\": {\"x\": 510, \"y\": 990}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 13}]}], \"position\": {\"x\": 510, \"y\": 1050}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 15}, {\"pinIdx\": 1, \"componentIdx\": 17}]}], \"position\": {\"x\": 630, \"y\": 1020}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 15}, {\"pinIdx\": 0, \"componentIdx\": 17}]}], \"position\": {\"x\": 690, \"y\": 630}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 31}]}], \"position\": {\"x\": 810, \"y\": 660}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 18}]}], \"position\": {\"x\": 810, \"y\": 750}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 18}]}], \"position\": {\"x\": 810, \"y\": 810}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 20}, {\"pinIdx\": 1, \"componentIdx\": 22}]}], \"position\": {\"x\": 930, \"y\": 780}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 20}, {\"pinIdx\": 0, \"componentIdx\": 22}]}], \"position\": {\"x\": 990, \"y\": 390}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 30}]}], \"position\": {\"x\": 1110, \"y\": 420}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 23}]}], \"position\": {\"x\": 1110, \"y\": 510}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 23}]}], \"position\": {\"x\": 1110, \"y\": 570}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 25}, {\"pinIdx\": 1, \"componentIdx\": 27}]}], \"position\": {\"x\": 1230, \"y\": 540}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 27}, {\"pinIdx\": 0, \"componentIdx\": 25}]}], \"position\": {\"x\": 1290, \"y\": 150}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 29}]}], \"position\": {\"x\": 1410, \"y\": 180}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 28}]}], \"position\": {\"x\": 1410, \"y\": 270}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 28}]}], \"position\": {\"x\": 1410, \"y\": 330}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 33}]}], \"position\": {\"x\": 1530, \"y\": 300}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1770, \"y\": 285}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1770, \"y\": 375}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1770, \"y\": 465}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1770, \"y\": 555}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1770, \"y\": 705}}]}'),('Luca','4 way demultiplexer','{\"circuitName\": \"4 way demultiplexer\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 7}, {\"pinIdx\": 0, \"componentIdx\": 4}, {\"pinIdx\": 0, \"componentIdx\": 3}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 8}, {\"pinIdx\": 1, \"componentIdx\": 5}, {\"pinIdx\": 1, \"componentIdx\": 3}]}], \"position\": {\"x\": 150, \"y\": 315}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 9}, {\"pinIdx\": 1, \"componentIdx\": 10}, {\"pinIdx\": 1, \"componentIdx\": 11}, {\"pinIdx\": 1, \"componentIdx\": 12}]}], \"position\": {\"x\": 510, \"y\": 495}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 9}]}], \"position\": {\"x\": 510, \"y\": 150}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 10}]}], \"position\": {\"x\": 510, \"y\": 240}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 11}]}], \"position\": {\"x\": 510, \"y\": 330}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 12}]}], \"position\": {\"x\": 510, \"y\": 420}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 6}, {\"pinIdx\": 0, \"componentIdx\": 5}]}], \"position\": {\"x\": 225, \"y\": 195}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 6}, {\"pinIdx\": 1, \"componentIdx\": 4}]}], \"position\": {\"x\": 225, \"y\": 375}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 13}]}], \"position\": {\"x\": 750, \"y\": 180}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 14}]}], \"position\": {\"x\": 750, \"y\": 270}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 15}]}], \"position\": {\"x\": 750, \"y\": 360}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 16}]}], \"position\": {\"x\": 750, \"y\": 450}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 165}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 255}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 345}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 435}}]}'),('Luca','4 way multiplexer','{\"circuitName\": \"4 way multiplexer\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 10}, {\"pinIdx\": 1, \"componentIdx\": 7}, {\"pinIdx\": 0, \"componentIdx\": 6}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 11}, {\"pinIdx\": 1, \"componentIdx\": 8}, {\"pinIdx\": 1, \"componentIdx\": 6}]}], \"position\": {\"x\": 150, \"y\": 315}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 12}]}], \"position\": {\"x\": 510, \"y\": 495}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 13}]}], \"position\": {\"x\": 510, \"y\": 555}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 14}]}], \"position\": {\"x\": 510, \"y\": 615}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 15}]}], \"position\": {\"x\": 510, \"y\": 675}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 12}]}], \"position\": {\"x\": 510, \"y\": 150}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 13}]}], \"position\": {\"x\": 510, \"y\": 240}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 14}]}], \"position\": {\"x\": 510, \"y\": 330}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 15}]}], \"position\": {\"x\": 510, \"y\": 420}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 9}, {\"pinIdx\": 0, \"componentIdx\": 8}]}], \"position\": {\"x\": 225, \"y\": 195}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 9}, {\"pinIdx\": 0, \"componentIdx\": 7}]}], \"position\": {\"x\": 225, \"y\": 375}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 16}]}], \"position\": {\"x\": 750, \"y\": 180}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 16}]}], \"position\": {\"x\": 750, \"y\": 270}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 17}]}], \"position\": {\"x\": 750, \"y\": 360}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 18}]}], \"position\": {\"x\": 750, \"y\": 450}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 17}]}], \"position\": {\"x\": 900, \"y\": 210}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 18}]}], \"position\": {\"x\": 1050, \"y\": 240}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 19}]}], \"position\": {\"x\": 1200, \"y\": 270}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 1350, \"y\": 255}}]}'),('Luca','D flip flop','{\"circuitName\":\"D flip flop\",\"componentInstances\":[{\"type\":\"IN\",\"position\":{\"x\":150,\"y\":135},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":2,\"pinIdx\":0},{\"componentIdx\":3,\"pinIdx\":0}]}]},{\"type\":\"IN\",\"position\":{\"x\":150,\"y\":375},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":9,\"pinIdx\":0},{\"componentIdx\":8,\"pinIdx\":1},{\"componentIdx\":7,\"pinIdx\":1}]}]},{\"type\":\"NOT\",\"position\":{\"x\":225,\"y\":195},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":4,\"pinIdx\":0}]}]},{\"type\":\"AND\",\"position\":{\"x\":360,\"y\":150},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":5,\"pinIdx\":0}]}]},{\"type\":\"AND\",\"position\":{\"x\":360,\"y\":240},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":6,\"pinIdx\":1}]}]},{\"type\":\"NOR\",\"position\":{\"x\":510,\"y\":150},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":6,\"pinIdx\":0},{\"componentIdx\":8,\"pinIdx\":0}]}]},{\"type\":\"NOR\",\"position\":{\"x\":510,\"y\":240},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":5,\"pinIdx\":1},{\"componentIdx\":7,\"pinIdx\":0}]}]},{\"type\":\"AND\",\"position\":{\"x\":750,\"y\":150},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":10,\"pinIdx\":0}]}]},{\"type\":\"AND\",\"position\":{\"x\":750,\"y\":240},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":11,\"pinIdx\":1}]}]},{\"type\":\"NOT\",\"position\":{\"x\":225,\"y\":315},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":4,\"pinIdx\":1},{\"componentIdx\":3,\"pinIdx\":1}]}]},{\"type\":\"NOR\",\"position\":{\"x\":900,\"y\":150},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":11,\"pinIdx\":0},{\"componentIdx\":13,\"pinIdx\":0}]}]},{\"type\":\"NOR\",\"position\":{\"x\":900,\"y\":240},\"outputs\":[{\"connectedPins\":[{\"componentIdx\":10,\"pinIdx\":1},{\"componentIdx\":12,\"pinIdx\":0}]}]},{\"type\":\"OUT\",\"position\":{\"x\":1050,\"y\":135},\"outputs\":[]},{\"type\":\"OUT\",\"position\":{\"x\":1050,\"y\":255},\"outputs\":[]}]}'),('Luca','D Latch','{\"circuitName\": \"D Latch\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 2}, {\"pinIdx\": 1, \"componentIdx\": 3}]}], \"position\": {\"x\": 150, \"y\": 285}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 4}, {\"pinIdx\": 0, \"componentIdx\": 2}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 5}]}], \"position\": {\"x\": 390, \"y\": 150}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 6}]}], \"position\": {\"x\": 390, \"y\": 270}}, {\"type\": \"NOT\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 3}]}], \"position\": {\"x\": 225, \"y\": 195}}, {\"type\": \"NOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 6}, {\"pinIdx\": 0, \"componentIdx\": 7}]}], \"position\": {\"x\": 630, \"y\": 150}}, {\"type\": \"NOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 5}, {\"pinIdx\": 0, \"componentIdx\": 8}]}], \"position\": {\"x\": 630, \"y\": 270}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 810, \"y\": 285}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 810, \"y\": 135}}]}'),('Luca','Full adder','{\"circuitName\": \"Full adder\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 3}, {\"pinIdx\": 0, \"componentIdx\": 6}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 3}, {\"pinIdx\": 1, \"componentIdx\": 6}]}], \"position\": {\"x\": 150, \"y\": 225}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 4}, {\"pinIdx\": 1, \"componentIdx\": 5}]}], \"position\": {\"x\": 150, \"y\": 315}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 4}, {\"pinIdx\": 0, \"componentIdx\": 5}]}], \"position\": {\"x\": 390, \"y\": 150}}, {\"type\": \"XOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 9}]}], \"position\": {\"x\": 600, \"y\": 210}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 7}]}], \"position\": {\"x\": 600, \"y\": 360}}, {\"type\": \"AND\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 7}]}], \"position\": {\"x\": 600, \"y\": 450}}, {\"type\": \"OR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 8}]}], \"position\": {\"x\": 750, \"y\": 390}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 375}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 900, \"y\": 285}}]}'),('Luca','SR Latch','{\"circuitName\": \"SR Latch\", \"componentInstances\": [{\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 2}]}], \"position\": {\"x\": 150, \"y\": 135}}, {\"type\": \"IN\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 3}]}], \"position\": {\"x\": 150, \"y\": 285}}, {\"type\": \"NOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 0, \"componentIdx\": 3}, {\"pinIdx\": 0, \"componentIdx\": 5}]}], \"position\": {\"x\": 330, \"y\": 150}}, {\"type\": \"NOR\", \"outputs\": [{\"connectedPins\": [{\"pinIdx\": 1, \"componentIdx\": 2}, {\"pinIdx\": 0, \"componentIdx\": 4}]}], \"position\": {\"x\": 330, \"y\": 270}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 510, \"y\": 135}}, {\"type\": \"OUT\", \"outputs\": [], \"position\": {\"x\": 510, \"y\": 285}}]}');
/*!40000 ALTER TABLE `circuits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Luca','$2y$10$lBIlRXYAHf96Ofv41oqSVOPUcZc43/3LPhLPKoDBz4vYc766OEj66'),('Utente1','$2y$10$D3dpNM2ebJALDwwLupgStONZhNf6lReaRzppXGRSI874qGY8izmWS'),('Utente2','$2y$10$zI4uQLE7ePxaglLXTYy2veMuZg9EpuUMzqEzLnDUsA7P6jI/9GkPq'),('Utente3','$2y$10$6QJ1mkgMRVavO.BKz5eGw.Yv2DQ6HYQcaC6hSgpJCA23pi3m1VYo.');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-06 12:52:19
