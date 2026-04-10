-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 10, 2026 at 05:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_astute_corp`
--

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `home_slider` varchar(255) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`id`, `name`, `type`, `home_slider`, `banner_image`, `created_at`, `updated_at`) VALUES
(14, 'For Top Banner', 'top_banner', NULL, 'uploads/banner/thumb_1762004608.jpg', '2025-11-01 07:43:28', '2025-11-01 07:43:28'),
(21, 'For Slider', 'slider', 'uploads/banner/thumb_1768797060.jpg', NULL, '2026-01-18 22:31:00', '2026-01-18 22:31:00'),
(22, 'For Slider', 'slider', 'uploads/banner/thumb_1768983630.jpg', NULL, '2026-01-21 02:20:30', '2026-01-21 02:20:30'),
(23, 'For Slider', 'slider', 'uploads/banner/thumb_1768984127.jpg', NULL, '2026-01-21 02:28:47', '2026-01-21 02:28:47'),
(29, 'For Slider', 'slider', 'uploads/banner/thumb_1768990408.jpg', NULL, '2026-01-21 04:13:28', '2026-01-21 04:13:28');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-spatie.permission.cache', 'a:3:{s:5:\"alias\";a:6:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"d\";s:9:\"role_type\";s:1:\"e\";s:9:\"parent_id\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:63:{i:0;a:6:{s:1:\"a\";i:1;s:1:\"b\";s:10:\"view posts\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:27;s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:1;a:6:{s:1:\"a\";i:2;s:1:\"b\";s:12:\"create posts\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:27;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:2;a:6:{s:1:\"a\";i:3;s:1:\"b\";s:10:\"edit posts\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:27;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:3;a:5:{s:1:\"a\";i:4;s:1:\"b\";s:12:\"delete posts\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:27;}i:4;a:6:{s:1:\"a\";i:5;s:1:\"b\";s:10:\"view users\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:28;s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:5;a:6:{s:1:\"a\";i:6;s:1:\"b\";s:12:\"create users\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:28;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:6;a:6:{s:1:\"a\";i:7;s:1:\"b\";s:10:\"edit users\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:28;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:7;a:5:{s:1:\"a\";i:8;s:1:\"b\";s:12:\"delete users\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:28;}i:8;a:6:{s:1:\"a\";i:9;s:1:\"b\";s:13:\"view products\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:29;s:1:\"r\";a:3:{i:0;i:1;i:1;i:2;i:2;i:3;}}i:9;a:6:{s:1:\"a\";i:10;s:1:\"b\";s:15:\"create products\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:29;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:10;a:6:{s:1:\"a\";i:11;s:1:\"b\";s:13:\"edit products\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:29;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:11;a:5:{s:1:\"a\";i:12;s:1:\"b\";s:15:\"delete products\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:29;}i:12;a:6:{s:1:\"a\";i:14;s:1:\"b\";s:19:\"view posts category\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:30;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:13;a:6:{s:1:\"a\";i:15;s:1:\"b\";s:21:\"create posts category\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:30;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:14;a:6:{s:1:\"a\";i:16;s:1:\"b\";s:19:\"edit posts category\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:30;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:15;a:5:{s:1:\"a\";i:17;s:1:\"b\";s:21:\"delete posts category\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:30;}i:16;a:6:{s:1:\"a\";i:22;s:1:\"b\";s:9:\"view role\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:31;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:17;a:6:{s:1:\"a\";i:23;s:1:\"b\";s:11:\"create role\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:31;s:1:\"r\";a:1:{i:0;i:2;}}i:18;a:6:{s:1:\"a\";i:24;s:1:\"b\";s:9:\"edit role\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:31;s:1:\"r\";a:2:{i:0;i:1;i:1;i:2;}}i:19;a:5:{s:1:\"a\";i:25;s:1:\"b\";s:11:\"delete role\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:31;}i:20;a:5:{s:1:\"a\";i:26;s:1:\"b\";s:22:\"Update website setting\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:21;a:5:{s:1:\"a\";i:27;s:1:\"b\";s:15:\"Post Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:22;a:5:{s:1:\"a\";i:28;s:1:\"b\";s:15:\"User Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:23;a:5:{s:1:\"a\";i:29;s:1:\"b\";s:19:\"Products Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:24;a:5:{s:1:\"a\";i:30;s:1:\"b\";s:24:\"Post Category Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:25;a:5:{s:1:\"a\";i:31;s:1:\"b\";s:15:\"Role Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:26;a:5:{s:1:\"a\";i:32;s:1:\"b\";s:21:\"Permission Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:27;a:6:{s:1:\"a\";i:33;s:1:\"b\";s:15:\"view permission\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:32;s:1:\"r\";a:1:{i:0;i:1;}}i:28;a:6:{s:1:\"a\";i:34;s:1:\"b\";s:17:\"create permission\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:32;s:1:\"r\";a:1:{i:0;i:1;}}i:29;a:6:{s:1:\"a\";i:35;s:1:\"b\";s:15:\"edit permission\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:32;s:1:\"r\";a:1:{i:0;i:1;}}i:30;a:5:{s:1:\"a\";i:36;s:1:\"b\";s:17:\"delete permission\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:32;}i:31;a:5:{s:1:\"a\";i:37;s:1:\"b\";s:28:\"Products Category Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:32;a:6:{s:1:\"a\";i:38;s:1:\"b\";s:21:\"view product category\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:37;s:1:\"r\";a:1:{i:0;i:1;}}i:33;a:6:{s:1:\"a\";i:39;s:1:\"b\";s:23:\"create product category\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:37;s:1:\"r\";a:1:{i:0;i:1;}}i:34;a:6:{s:1:\"a\";i:40;s:1:\"b\";s:21:\"edit product category\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:37;s:1:\"r\";a:1:{i:0;i:1;}}i:35;a:5:{s:1:\"a\";i:41;s:1:\"b\";s:23:\"delete product category\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:37;}i:36;a:5:{s:1:\"a\";i:42;s:1:\"b\";s:17:\"Banner Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:37;a:6:{s:1:\"a\";i:43;s:1:\"b\";s:11:\"view banner\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:42;s:1:\"r\";a:1:{i:0;i:1;}}i:38;a:6:{s:1:\"a\";i:44;s:1:\"b\";s:13:\"create banner\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:42;s:1:\"r\";a:1:{i:0;i:1;}}i:39;a:6:{s:1:\"a\";i:45;s:1:\"b\";s:11:\"edit banner\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:42;s:1:\"r\";a:1:{i:0;i:1;}}i:40;a:6:{s:1:\"a\";i:46;s:1:\"b\";s:13:\"delete banner\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:42;s:1:\"r\";a:1:{i:0;i:1;}}i:41;a:5:{s:1:\"a\";i:47;s:1:\"b\";s:19:\"Supplier Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:42;a:6:{s:1:\"a\";i:48;s:1:\"b\";s:13:\"view supplier\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:47;s:1:\"r\";a:1:{i:0;i:1;}}i:43;a:6:{s:1:\"a\";i:49;s:1:\"b\";s:15:\"create supplier\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:47;s:1:\"r\";a:1:{i:0;i:1;}}i:44;a:6:{s:1:\"a\";i:50;s:1:\"b\";s:13:\"edit supplier\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:47;s:1:\"r\";a:1:{i:0;i:1;}}i:45;a:5:{s:1:\"a\";i:51;s:1:\"b\";s:15:\"delete supplier\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:47;}i:46;a:5:{s:1:\"a\";i:52;s:1:\"b\";s:25:\"Purchase Order Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:47;a:6:{s:1:\"a\";i:53;s:1:\"b\";s:19:\"view purchase order\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:52;s:1:\"r\";a:1:{i:0;i:1;}}i:48;a:6:{s:1:\"a\";i:54;s:1:\"b\";s:21:\"create purchase order\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:52;s:1:\"r\";a:1:{i:0;i:1;}}i:49;a:6:{s:1:\"a\";i:55;s:1:\"b\";s:19:\"edit purchase order\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:52;s:1:\"r\";a:1:{i:0;i:1;}}i:50;a:5:{s:1:\"a\";i:56;s:1:\"b\";s:21:\"delete purchase order\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:52;}i:51;a:5:{s:1:\"a\";i:57;s:1:\"b\";s:18:\"Product Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:52;a:6:{s:1:\"a\";i:58;s:1:\"b\";s:12:\"view product\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:57;s:1:\"r\";a:1:{i:0;i:1;}}i:53;a:6:{s:1:\"a\";i:59;s:1:\"b\";s:14:\"create product\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:57;s:1:\"r\";a:1:{i:0;i:1;}}i:54;a:6:{s:1:\"a\";i:60;s:1:\"b\";s:12:\"edit product\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:57;s:1:\"r\";a:1:{i:0;i:1;}}i:55;a:5:{s:1:\"a\";i:61;s:1:\"b\";s:14:\"delete product\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:57;}i:56;a:5:{s:1:\"a\";i:62;s:1:\"b\";s:16:\"Order Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:57;a:6:{s:1:\"a\";i:63;s:1:\"b\";s:10:\"view order\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:62;s:1:\"r\";a:1:{i:0;i:1;}}i:58;a:6:{s:1:\"a\";i:64;s:1:\"b\";s:12:\"create order\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:62;s:1:\"r\";a:1:{i:0;i:1;}}i:59;a:6:{s:1:\"a\";i:65;s:1:\"b\";s:10:\"edit order\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:62;s:1:\"r\";a:1:{i:0;i:1;}}i:60;a:5:{s:1:\"a\";i:66;s:1:\"b\";s:12:\"delete order\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:62;}i:61;a:5:{s:1:\"a\";i:67;s:1:\"b\";s:19:\"Customer Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:62;a:6:{s:1:\"a\";i:68;s:1:\"b\";s:13:\"view Customer\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:67;s:1:\"r\";a:1:{i:0;i:1;}}}s:5:\"roles\";a:3:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:5:\"admin\";s:1:\"c\";s:3:\"api\";s:1:\"d\";i:1;}i:1;a:4:{s:1:\"a\";i:2;s:1:\"b\";s:6:\"editor\";s:1:\"c\";s:3:\"api\";s:1:\"d\";i:2;}i:2;a:4:{s:1:\"a\";i:3;s:1:\"b\";s:6:\"viewer\";s:1:\"c\";s:3:\"api\";s:1:\"d\";i:3;}}}', 1775839291);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categorys`
--

CREATE TABLE `categorys` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `sorting` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT 0,
  `parent_child_id` int(11) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `category_image_inside_page` varchar(255) DEFAULT NULL,
  `banner_sub_cat_image` varchar(255) DEFAULT NULL,
  `insubCategoryImage` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `tabs_status` int(11) NOT NULL DEFAULT 1 COMMENT '1=category, subcategory 2=insubcategory',
  `thumbnail_image` varchar(255) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categorys`
--

INSERT INTO `categorys` (`id`, `name`, `slug`, `sorting`, `parent_id`, `parent_child_id`, `sort_order`, `category_image_inside_page`, `banner_sub_cat_image`, `insubCategoryImage`, `status`, `tabs_status`, `thumbnail_image`, `banner_image`, `created_at`, `updated_at`) VALUES
(1, 'Home', 'home', NULL, 0, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:43:34', '2026-04-09 22:43:34'),
(2, 'About', 'about', NULL, 0, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:43:42', '2026-04-09 22:43:42'),
(3, 'Service', 'service', NULL, 0, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:43:49', '2026-04-09 22:43:49'),
(4, 'Trainings', 'trainings', NULL, 0, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:43:57', '2026-04-09 22:43:57'),
(5, 'Blog', 'blog', NULL, 0, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:44:02', '2026-04-09 22:44:02'),
(6, 'SAP® Security Services', 'sap-security-services', NULL, 3, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:47:33', '2026-04-09 22:47:33'),
(7, 'SAP® GRC Services', 'sap-grc-services', NULL, 3, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:47:41', '2026-04-09 22:47:41'),
(8, 'SAP Core ABAP', 'sap-core-abap', NULL, 4, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:49:51', '2026-04-09 22:49:51'),
(9, 'Authorization Concept for SAP S/4HANA', 'authorization-concept-for-sap-s4hana', NULL, 4, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:49:57', '2026-04-09 22:49:57'),
(10, 'SAP Access Control Implementation and Configuration', 'sap-access-control-implementation-and-configuration', NULL, 4, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:50:04', '2026-04-09 22:50:04'),
(11, 'System Administration I of SAP S/4HANA', 'system-administration-i-of-sap-s4hana', NULL, 4, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:50:09', '2026-04-09 22:50:09'),
(12, 'SAP Analytics Cloud (SAC)', 'sap-analytics-cloud-sac', NULL, 4, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-09 22:50:14', '2026-04-09 22:50:14'),
(13, 'SAP® Security Assessment', 'sap-security-assessment', NULL, 0, 6, 0, NULL, NULL, NULL, 1, 2, NULL, NULL, '2026-04-09 22:54:45', '2026-04-09 16:54:53'),
(14, 'Role Model Design', 'role-model-design', NULL, 0, 6, 0, NULL, NULL, NULL, 1, 2, NULL, NULL, '2026-04-09 22:55:09', '2026-04-09 22:55:09'),
(15, 'UI Masking', 'ui-masking', NULL, 0, 6, 0, NULL, NULL, NULL, 1, 2, NULL, NULL, '2026-04-09 22:55:18', '2026-04-09 22:55:18'),
(16, 'SAP Analytics Cloud', 'sap-analytics-cloud', NULL, 0, 6, 0, NULL, NULL, NULL, 1, 2, NULL, NULL, '2026-04-09 22:55:28', '2026-04-09 22:55:28'),
(17, 'BTP (Business Technology Platform)', 'btp-business-technology-platform', NULL, 0, 6, 0, NULL, NULL, NULL, 1, 2, NULL, NULL, '2026-04-09 22:55:35', '2026-04-09 22:55:35'),
(18, 'SAP® Security Assessments', 'sap-security-assessments', NULL, 0, 7, 0, NULL, NULL, NULL, 1, 2, NULL, NULL, '2026-04-09 22:58:59', '2026-04-09 22:58:59'),
(19, 'Process Control', 'process-control', NULL, 0, 7, 0, NULL, NULL, NULL, 1, 2, NULL, NULL, '2026-04-09 22:59:20', '2026-04-09 22:59:20'),
(20, 'Access Control', 'access-control', NULL, 0, 7, 0, NULL, NULL, NULL, 1, 2, NULL, NULL, '2026-04-09 22:59:27', '2026-04-09 22:59:27'),
(21, 'Risk Management', 'risk-management', NULL, 0, 7, 0, NULL, NULL, NULL, 1, 2, NULL, NULL, '2026-04-09 22:59:38', '2026-04-09 22:59:38'),
(22, 'SAP@ Cloud IAG', 'sap-at-cloud-iag', NULL, 0, 7, 0, NULL, NULL, NULL, 1, 2, NULL, NULL, '2026-04-09 22:59:45', '2026-04-09 22:59:45'),
(23, 'SAP Process Control 12.0 Implementation and Business Process', 'sap-process-control-120-implementation-and-business-process', NULL, 4, NULL, 0, NULL, NULL, NULL, 1, 1, NULL, NULL, '2026-04-10 10:49:35', '2026-04-10 10:49:35');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_10_09_160506_create_permission_tables', 2);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(1, 'App\\Models\\User', 12),
(2, 'App\\Models\\User', 2),
(3, 'App\\Models\\User', 4);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `orderId` varchar(255) NOT NULL,
  `pathao_consignment_id` varchar(255) DEFAULT NULL,
  `pathao_merchant_order_id` varchar(255) DEFAULT NULL,
  `pathao_order_status` varchar(100) DEFAULT NULL,
  `pathao_delivery_fee` varchar(50) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL COMMENT 'ref users table role_id=2',
  `shipping_phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `coupons` text DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL COMMENT '%',
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `grand_total` decimal(10,2) DEFAULT NULL,
  `advance` decimal(10,2) DEFAULT NULL,
  `due` decimal(10,2) DEFAULT NULL,
  `order_status` int(11) NOT NULL DEFAULT 1 COMMENT '1=Pending\r\n2=Order Received\r\n3=Shipped\r\n4=Out for Delivery\r\n5=Delivered\r\n6=Cancelled\r\n7=Returned\r\n8=Refunded\r\n9=Return complete\r\n',
  `bkash_number` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `paymentMethod` varchar(255) DEFAULT NULL,
  `devliery_charge` decimal(10,2) DEFAULT NULL,
  `order_type` int(1) NOT NULL COMMENT '1=online\r\n2=instant_order',
  `coupon_code` varchar(255) DEFAULT NULL,
  `coupon_offer_status` int(11) DEFAULT NULL,
  `orderUpdateDate` date DEFAULT NULL,
  `orderUpdateby` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `orderId`, `pathao_consignment_id`, `pathao_merchant_order_id`, `pathao_order_status`, `pathao_delivery_fee`, `customer_id`, `shipping_phone`, `address`, `coupons`, `order_date`, `payment_type`, `subtotal`, `amount`, `discount`, `discount_amount`, `grand_total`, `advance`, `due`, `order_status`, `bkash_number`, `transaction_id`, `paymentMethod`, `devliery_charge`, `order_type`, `coupon_code`, `coupon_offer_status`, `orderUpdateDate`, `orderUpdateby`, `created_at`, `updated_at`) VALUES
(1, '00000001', NULL, NULL, NULL, NULL, 27, '01875758578', 'Austria', '', '2026-01-17', NULL, 100.00, NULL, 0, 0.00, 160.00, NULL, NULL, 1, NULL, NULL, 'cash', 60.00, 1, NULL, NULL, NULL, NULL, '2026-01-17 00:09:42', '2026-01-17 06:09:42');

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

CREATE TABLE `order_history` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `attribue_id` int(11) DEFAULT NULL,
  `variation_value` varchar(255) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_history`
--

INSERT INTO `order_history` (`id`, `order_id`, `product_id`, `attribue_id`, `variation_value`, `qty`, `price`, `total_price`, `created_at`, `updated_at`) VALUES
(1, 1, 229, NULL, '', 1, 100.00, 100.00, '2026-01-17 00:09:42', '2026-01-17 00:09:42');

-- --------------------------------------------------------

--
-- Table structure for table `order_status`
--

CREATE TABLE `order_status` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_status`
--

INSERT INTO `order_status` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Pending', 'The order has been placed but not yet confirmed or paid.', 1, '2023-12-04 11:15:23', '2023-12-04 05:55:06'),
(2, 'Order Received', 'Payment has been received (for prepaid), and the order is being prepared.', 1, '2023-12-04 11:15:23', '2023-12-04 05:55:48'),
(3, 'Shipped', 'The order has been dispatched from the warehouse and is in transit.', 1, '2023-12-04 11:15:23', '2023-12-04 05:56:14'),
(4, 'Out for Delivery', 'The order is with the delivery agent and will reach the customer soon.', 1, '2023-12-04 11:15:23', '2023-12-04 05:56:45'),
(5, 'Delivered', 'The order has successfully reached the customer.', 1, '2023-12-04 11:15:23', '2023-12-04 05:57:14'),
(6, 'Cancelled', 'The order has been cancelled either by the user or the system (e.g., due to payment failure or stock issues).', 1, '2023-12-04 11:15:23', '2023-12-04 05:57:42'),
(7, 'Returned', 'The customer has returned the product after delivery.', 1, '2023-12-04 11:15:23', '2023-12-04 05:58:19'),
(8, 'Refunded', 'Returning', 1, '2023-12-04 11:15:23', '2023-12-04 05:58:53'),
(9, 'Return complete', 'A refund has been initiated and processed for the customer.', 1, '2023-12-04 11:15:23', '2023-12-04 05:59:17'),
(10, 'Order Received & Send to Pathao', 'Send to Pathao', 1, '2023-12-04 11:15:23', '2023-12-04 05:59:17');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pathao_tokens`
--

CREATE TABLE `pathao_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `access_token` text NOT NULL,
  `refresh_token` text NOT NULL,
  `expires_in` int(11) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pathao_tokens`
--

INSERT INTO `pathao_tokens` (`id`, `access_token`, `refresh_token`, `expires_in`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNTIiLCJhdWQiOlsiMjY3Il0sImV4cCI6MTc3MjEwOTI3NCwibmJmIjoxNzY0MzMzMjc0LCJpYXQiOjE3NjQzMzMyNzQsImp0aSI6IjY1NjU4YzY1ZjU5NzRjZDZhNGE3OGE3MTIwZWIyZjVjNGQxOTYzOGM3MjBiYWYwOTQyOWMyOWVjNzk0MzgyYmIiLCJtZXJjaGFudF9pZCI6Iks0b2VFOWtlMEIiLCJzY29wZXMiOltdfQ.HdpzFl10Ul7lDW9x2lsDt73FGDnCD8JNYfmIjVKviSp0lyJ_E4YV9b_3XLcLzvkXk8wuCWcR3QM4K3Lp4e3gpQ114g5BLXNYxZGIkA6nRs23inWUv43oM8g73LYwPMMDyZo6nTpL6HMKbQaeilSfl7n8f-yf5h-e2U21uEoeHdE-u2NyXxLvkvW0kIhsnO-uhXyYmoCCEZXHv31Z_xFRTAEgGDb4NsifWgOcCNbzAU6tiZXymCGmSuKE1Kod0Xnw7znqWGULNVofSrogYwc0kuLFRnUvagBp6jvydhPxUJfAgSKu4561xC7HI3mmwsnfOZ-UeGVSgblkNAcFnvGy4xCx3OhU8of63BbFY9eGbmP1lVp8UvvoKLn03A7MZWP8qNOr4Cn9clhuVYc0ZdER3QprIqhVsknPvPRs-eodnKsCuxR-gNr3NCaLYZSKxpY7y_RcxtbIBdJOr04nj3s0HgnaZ_gbuI5aGfdqGdqTD7AtJDqUvZg7w1ukazHQJL-fScbvAGmbzIBN8wV5IsYp8QswGzfqFCJh6uYLBSCJ5ZajwViNVX10bXUFyrefrZ_8-uxG53ozyWjThtvyR7UoRJSNA9Hx2U76yvdXlZi4PxwsPgCw5EGVXmPi-n3hNM6McMP5bffey-PnSVsDhbu1CYRMVw417NdOPtdT7WWq0oI', 'def502006775528b6f041dbeb1e89312605e2aa5d92fc7daf9eaad2fabccfa35e54f4cba0474e063cf12770d72be55b346a7cfda987df6dca6159bdbee1a20ec686326b705e7cc90a062f52167901f4145fe19165d3882a57920cab75f8e3c42d388ed0e7bc7d3b6abd608700e4b36fdcf2f8b7a461611f1850e1aa4f46ceceed2344f15785ab03b3fa44572b2830206e2d35942c3f827e89b1fd20220db48b725857f9bba5d0442748e5f102c7f03eccd903572edb8c713ed251026d6a45838b10279a3ce092c0cb2f92ce93ccea8145191b6e48f38b5193ad3b10c2a2fd67b0da5eedc1a9834a01e7d1d4b50e4ecb0e8d599f2e6dd4128faa5ecc3aec51c086f04980d9f30165d3cf6fd652b6b134542c7dfc6e3aa48be5b38ba09c62f9994d9e770b1cd2c52a5385ed7d0f15f74fb13e518f1d5304473e2f91587ff5ae614a00dd1dbdf09fcf176d945520ff67acdbb72ecc088caf08514', 7776000, '2026-02-26 06:34:36', '2025-11-28 06:34:36', '2025-11-28 06:34:36');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `role_type` varchar(255) DEFAULT NULL COMMENT '1=admin, 2=Editor, 3=Viewer, 4=General Post 5=Product Manage 6=User Manage ',
  `parent_id` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `role_type`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'view posts', 'api', '1,2,3', 27, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(2, 'create posts', 'api', '1,2', 27, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(3, 'edit posts', 'api', '1,2', 27, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(4, 'delete posts', 'api', '1,2,3', 27, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(5, 'view users', 'api', '1,2,3', 28, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(6, 'create users', 'api', '1,2', 28, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(7, 'edit users', 'api', '1,2', 28, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(8, 'delete users', 'api', '1,2,3', 28, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(9, 'view products', 'api', '1,2,3', 29, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(10, 'create products', 'api', '1,2', 29, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(11, 'edit products', 'api', '1,2', 29, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(12, 'delete products', 'api', '1,2,3', 29, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(14, 'view posts category', 'api', '1,2,3', 30, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(15, 'create posts category', 'api', '1,2', 30, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(16, 'edit posts category', 'api', '1,2', 30, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(17, 'delete posts category', 'api', '1,2,3', 30, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(22, 'view role', 'api', '1,2,3', 31, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(23, 'create role', 'api', '1,2', 31, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(24, 'edit role', 'api', '1,2', 31, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(25, 'delete role', 'api', '1,2,3', 31, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(26, 'Update website setting', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(27, 'Post Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(28, 'User Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(29, 'Products Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(30, 'Post Category Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(31, 'Role Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(32, 'Permission Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(33, 'view permission', 'api', '1', 32, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(34, 'create permission', 'api', '1', 32, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(35, 'edit permission', 'api', '1', 32, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(36, 'delete permission', 'api', '1', 32, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(37, 'Products Category Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(38, 'view product category', 'api', '1', 37, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(39, 'create product category', 'api', '1', 37, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(40, 'edit product category', 'api', '1', 37, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(41, 'delete product category', 'api', '1', 37, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(42, 'Banner Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(43, 'view banner', 'api', '1', 42, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(44, 'create banner', 'api', '1', 42, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(45, 'edit banner', 'api', '1', 42, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(46, 'delete banner', 'api', '1', 42, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(47, 'Supplier Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(48, 'view supplier', 'api', '1', 47, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(49, 'create supplier', 'api', '1', 47, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(50, 'edit supplier', 'api', '1', 47, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(51, 'delete supplier', 'api', '1', 47, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(52, 'Purchase Order Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(53, 'view purchase order', 'api', '1', 52, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(54, 'create purchase order', 'api', '1', 52, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(55, 'edit purchase order', 'api', '1', 52, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(56, 'delete purchase order', 'api', '1', 52, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(57, 'Product Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(58, 'view product', 'api', '1', 57, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(59, 'create product', 'api', '1', 57, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(60, 'edit product', 'api', '1', 57, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(61, 'delete product', 'api', '1', 57, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(62, 'Order Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(63, 'view order', 'api', '1', 62, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(64, 'create order', 'api', '1', 62, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(65, 'edit order', 'api', '1', 62, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(66, 'delete order', 'api', '1', 62, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(67, 'Customer Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(68, 'view Customer', 'api', '1', 67, '2025-10-09 10:09:35', '2025-10-09 10:09:35');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description_short` text DEFAULT NULL,
  `description_full` text DEFAULT NULL,
  `meta_title` text DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `question` text DEFAULT NULL,
  `answer` text DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL COMMENT '\r\n2=torrent',
  `entry_by` int(11) DEFAULT NULL,
  `thumnail_img` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `name`, `slug`, `description_short`, `description_full`, `meta_title`, `meta_description`, `meta_keyword`, `question`, `answer`, `categoryId`, `entry_by`, `thumnail_img`, `status`, `created_at`, `updated_at`) VALUES
(1, 'SAP Security Notes August 2025', 'sap-security-notes-august-2025', '', '<p><strong>A Proactive Stance on Digital Supply Chain Risks</strong></p><p>Another month, another set of patches. While the total number of notes might seem manageable, the focus for August 2025 is unmistakably on quality over quantity, with a critical emphasis on securing the complex digital supply chains that modern SAP systems rely on.</p><p>This month, SAP has released 21 new and updated Security Notes, including 2 HotNews and 3 High-Priority corrections. Let’s break down what your team needs to prioritize.<br>The Headliners: HotNews Notes</p><p>This month’s HotNews notes are a powerful reminder that an organization’s attack surface extends far beyond its custom code and core configuration.</p><p><strong>#XXXXXX (CVSS: 9.8) – [Component] Remote Code Execution</strong></p><p>What it is: A critical vulnerability in a widely used foundational component that could allow an unauthenticated attacker to execute arbitrary code on the affected system.</p><p>Why it’s critical: The impacted component is present in a vast number of SAP landscapes and can be exploited over the network without any user credentials. This makes it a prime candidate for widespread, automated attacks.</p><p>Action: This is your top priority. Immediate patching is non-negotiable. Use the patch provided by SAP and consider temporary network-level controls if patching cannot be applied immediately.</p><p><strong>#XXXXXX (CVSS: 8.7) – [Third-Party Library] Code Injection</strong></p><p>What it is: A high-severity vulnerability stemming from an outdated open-source library embedded within multiple SAP products.</p><p>The Bigger Picture: This note is a classic example of a digital supply chain risk. Your SAP system’s security is only as strong as the weakest library it includes. This note affects multiple products, so you must check each one.</p><p>Action: Apply the relevant patches to all affected systems. This note underscores the importance of having an inventory of all third-party components used within your SAP ecosystem.</p><p>High Priority Notes to Address</p><p>Beyond the HotNews, three High-priority notes demand your attention.</p><p>#XXXXXX – Escalation of Privileges in [Common Module]: This vulnerability could allow a low-privileged user to gain elevated authorizations, potentially accessing sensitive data or performing unauthorized actions.</p><p>#XXXXXX – Cross-Site Scripting (XSS) in [UI Component]: While often considered less severe, this XSS vulnerability could be used to hijack user sessions or deface applications, impacting confidentiality and integrity.</p><p>#XXXXXX – Denial of Service (DoS) in [Networking Component]: This flaw could allow an attacker to crash a core service, leading to system unavailability and business disruption.</p><p>Thematic Takeaway: It’s Not Just SAP Code Anymore</p><p>The standout theme for August 2025 is the focus on third-party and foundational components. The second HotNews note is a clear signal from SAP that they are increasingly vigilant about the open-source and commercial libraries bundled with their software. As attackers shift their focus to the software supply chain, so must our defenses.</p><p><strong>This means your vulnerability management process must evolve:</strong></p><p>Inventory: Do you know all the components your critical SAP systems rely on?</p><p>&nbsp;Monitor: Are you subscribed to vulnerability feeds for these third-party libraries, not just SAP-specific notes?</p><p>Patch: Do you have a process for rapidly testing and deploying patches that address these underlying dependencies?</p><p>Recommendations and Next Steps</p><p>Prioritize Immediately: Focus all efforts on the two HotNews notes. Their widespread impact and ease of exploitation make them urgent.</p><p>Schedule the Highs: Plan to address the three High-priority notes within your next standard patch cycle. Do not let them linger.</p><p>Review Your Landscape: Use this month as a catalyst. Audit your systems for outdated third-party components and ensure your monitoring strategies cover the entire software stack, not just the SAP-branded layer.</p><p>Leverage SAP Resources: Remember to use the SAP Solution Manager or Focused Run for system recommendations and the SAP Security Patch Day Dashboard for an overview.</p><p>Staying ahead of threats requires diligence and a proactive mindset. By addressing this month’s critical patches and refining your approach to supply chain security, you can significantly strengthen the resilience of your SAP environment.</p>', 'SAP Security Notes August 2025', 'SAP Security Notes August 2025', 'SAP Security Notes August 2025', NULL, NULL, 7, 1, '/backend/files/e6DzMP5BEcDfD9vJ5huP.jpg', 1, '2026-04-10 05:03:28', '2026-04-10 04:19:15'),
(2, 'GRC Security in the SAP World: Challenges and Trends', 'grc-security-in-the-sap-world-challenges-and-trends', '', '<p><strong>GRC Security in the SAP World: Navigating Modern Challenges and Trends</strong></p><p>In the digital economy, the SAP landscape is no longer a static back-office system. It’s a dynamic, interconnected core of enterprise resource planning (ERP), often extending into the cloud, integrating with countless applications, and processing immense volumes of sensitive data. This evolution has made Governance, Risk, and Compliance (GRC) more critical—and more complex—than ever before.</p><p>While SAP GRC solutions provide powerful tools for access control, process monitoring, and risk management, the environment they operate within is constantly shifting. Organizations face a new set of challenges and must adapt to emerging trends to maintain a robust security posture.<br>The Persistent Challenges: Why SAP Security Remains a Battle<br><br><strong>1. The Expanding Attack Surface</strong></p><p>The modern SAP environment is a hybrid ecosystem. It’s no longer just ECC on-premise. It includes:</p><p>Cloud Deployments: SAP S/4HANA Cloud, SAP SuccessFactors, SAP Ariba, and others.</p><p>Hybrid Landscapes: Integrations between on-premise systems and cloud platforms.</p><p>APIs and Integrations: Connections to third-party applications, IoT platforms, and custom code.</p><p>The Challenge: Each new component, cloud service, and API endpoint is a potential vulnerability. Securing this interconnected web is far more complex than protecting a single, isolated system.<br><br><strong>2. The Cybersecurity Skills Gap</strong></p><p>SAP security is a highly specialized field. Understanding the intricacies of authorization objects, GRC configuration, and the SAP-specific attack vectors requires deep expertise.</p><p>The Challenge: There is a significant shortage of skilled professionals who can design, implement, and monitor a mature SAP GRC program. This leaves many organizations vulnerable, as their teams are stretched thin and may lack the specific knowledge to combat sophisticated threats.<br><br><strong>3. The Rise of Sophisticated Cyber Threats</strong></p><p>SAP systems are high-value targets for cybercriminals and state-sponsored actors. Threats have moved beyond simple password guessing to advanced, persistent attacks:</p><p>SAP-Specific Malware: Trojans like FIN7 have developed malware specifically designed to exploit SAP vulnerabilities.</p><p>Business Process Compromise (BPC): Attackers don’t just want to steal data; they want to manipulate business processes for financial gain (e.g., altering bank details in vendor master records).</p><p>Supply Chain Attacks: Targeting weaker links in a supply chain to gain access to a larger organization’s SAP environment.</p><p>The Challenge: Traditional security measures are insufficient. Organizations need continuous threat monitoring and analytics designed specifically for SAP business logic.<br><br><strong>4. The Complexity of Compliance</strong></p><p>Businesses must adhere to a growing number of regulatory frameworks: GDPR, SOX, CCPA, industry-specific standards like HIPAA, and others. Each has its own requirements for data protection, access controls, and audit trails.</p><p>The Challenge: Manually mapping SAP controls and user access to each regulation is time-consuming, prone to error, and difficult to demonstrate during an audit.<br>The Emerging Trends: The Future of SAP GRC Security</p><p>To combat these challenges, the industry is shifting towards more intelligent, automated, and proactive strategies.<br><br><strong>1. Shift from Periodic to Continuous Controls Monitoring (CCM)</strong></p><p>The traditional approach of running compliance checks quarterly or annually is no longer enough. The trend is toward Continuous Controls Monitoring (CCM), where controls are automatically tested in near real-time.</p><p>How it works: Tools within SAP Process Control can constantly monitor configurations, segregation of duties (SoD) conflicts, and critical transactions, alerting security teams the moment a violation occurs.</p><p>Benefit: Drastically reduces the window of risk and allows for immediate remediation.</p><p><strong>2. The Integration of Artificial Intelligence and Machine Learning</strong></p><p>AI and ML are becoming force multipliers in GRC security:</p><p>User Behavior Analytics (UBA): ML algorithms learn normal user behavior patterns (e.g., when a user typically logs in, what transactions they run) and flag significant anomalies that could indicate a compromised account.</p><p>Intelligent SoD Analysis: AI can go beyond static rules to analyze the context and intent behind access combinations, identifying risky permissions that might not be caught by a standard rule set.</p><p>Automated Risk Remediation: Suggesting and even automating remediation actions, like revoking temporary access that is no longer needed.</p><p><strong>3. Identity and Access Governance as a Core Strategy</strong></p><p>The focus is moving from simply managing access to governing identities. This involves:</p><p>Centralized Identity Management: Using tools like SAP Cloud Identity Access Governance (IAG) to have a single view of user access across both on-premise and cloud SAP systems.</p><p>Business-Driven Access Requests: Integrating access requests directly into business workflows (e.g., a hiring manager requests standard access for a new employee based on their job role), making the process more intuitive and compliant by design.</p><p>&nbsp;Automated User Lifecycle Management: Automatically provisioning and de-provisioning access based on HR events (e.g., a hire, transfer, or termination).</p><p><strong>4. Focus on Application Security</strong></p><p>There is a growing recognition that authorizations alone are not enough. Organizations are now prioritizing:</p><p>Secure Code Practices: Scanning custom ABAP code for vulnerabilities (e.g., using the Code Vulnerability Analysis tool in SAP).</p><p>Hardening SAP Systems: Ensuring systems are configured securely from the outset, following guidelines from the SAP Security Baseline Template and the SAP EarlyWatch Alert service.</p><p>Conclusion: A Proactive and Integrated Approach is Key</p><p>The era of treating SAP GRC as a periodic, audit-driven exercise is over. The modern threat landscape demands a proactive, continuous, and intelligent approach.</p><p><strong>The future of SAP GRC security lies in:</strong></p><p>Automation to reduce manual effort and human error.</p><p>Integration to provide a unified view of risk across a hybrid landscape.</p><p>Intelligence to predict and prevent threats before they cause damage.</p><p>By embracing these trends, organizations can transform their GRC programs from a defensive cost center into a strategic enabler that protects the heart of their business operations and fosters trust.</p>', 'GRC Security in the SAP World: Challenges and Trends', 'GRC Security in the SAP World: Challenges and Trends', 'GRC Security in the SAP World: Challenges and Trends', NULL, NULL, 7, 1, '/backend/files/O5OQLgxGD75YUTp2En3F.png', 1, '2026-04-10 05:06:03', '2026-04-10 06:16:13'),
(3, 'Mitigation Controls in SAP® GRC', 'mitigation-controls-in-sap-grc', '', '<p><strong>Mitigation Controls in SAP® GRC</strong><br><br>Managing Unavoidable Risks</p><p>In an ideal world, every Segregation of Duties (SoD) conflict or critical access risk would be eliminated by redesigning roles and removing access. However, business reality often requires that certain users retain risky access to perform their jobs effectively.</p><p>This is where Mitigation Controls within SAP® Governance, Risk, and Compliance (GRC) become essential. They are the cornerstone of a pragmatic and balanced risk management strategy.<br>What Are Mitigation Controls?</p><p>A mitigation control is a detective or preventive procedure that reduces the risk associated with a user’s access to an acceptable level. Instead of removing the access (the risk itself), you implement a safeguard that monitors or prevents the misuse of that access.</p><p>Think of it like this:</p><p>Removing access: Taking away the keys to a secure room.</p><p>Mitigation control: Installing a surveillance camera in the room and requiring a logbook for entry while allowing the person to keep the keys.</p><p>How They Work in the SAP GRC Framework</p><p>Mitigation controls are a core function of the SAP GRC Access Control module. The process is integrated and streamlined:</p><p>Risk Identification: The system identifies a SoD conflict or critical access risk for a user during a access review or role assignment.</p><p>Decision Point: The business owner decides the risk cannot be removed for operational reasons.</p><p>Control Assignment: One or more mitigation controls are assigned to the specific risk-violating access combination for that user.</p><p>Risk Reduction: The GRC system recalculates the user’s risk score. A effectively designed and tested control can reduce the risk of a “High” severity conflict down to “Low” or even “No Risk.”</p><p>Ongoing Monitoring: The control itself must be tested periodically (e.g., quarterly, annually) to ensure it is operating effectively. This is a key function of the SAP GRC Process Control module.</p><p>Types of Mitigation Controls</p><p><strong>Mitigation controls generally fall into two categories:</strong></p><p><strong>1. Detective Controls</strong></p><p>Purpose: To discover a malicious or erroneous action after it has occurred.</p><p>Examples: Regular review of transaction logs, automated reconciliation reports, manager approval of specific journal entries, periodic audits of sensitive transactions.</p><p><strong>2. Preventive Controls</strong></p><p>Purpose: To stop an inappropriate action before it is completed.</p><p>Examples: Dual approval workflows for payment runs, system-based validations that block posting to a closed fiscal period, physical supervision for certain activities.</p><p>Best Practices for Effective Mitigation</p><p>&nbsp;</p><p><strong>The true power is realized when SAP GRC Access Control and Process Control work together:</strong></p><p>Access Control identifies the risk and assigns the mitigation control.</p><p>Process Control manages the entire lifecycle of that control: documenting its procedure, scheduling tests, collecting evidence, and reporting on its effectiveness to management and auditors.<br>&nbsp;</p>', 'Mitigation Controls in SAP® GRC', 'Mitigation Controls in SAP® GRC', 'Mitigation Controls in SAP® GRC', NULL, NULL, 7, 1, '/backend/files/EStxQlccTqiC5Xyp4gF8.png', 1, '2026-04-10 05:08:19', '2026-04-10 06:17:04'),
(4, 'Web Services Status Integration in SAP GRC Uses and Applications', 'web-services-status-integration-in-sap-grc-uses-and-applications', '', '<p><strong>Web Services Status Integration in SAP GRC: The Key to Real-Time Compliance</strong></p><p>In the complex world of SAP Governance, Risk, and Compliance (GRC), information silos are the enemy. For access risk analysis to be accurate and for emergency access management to be truly secure, the GRC system needs a real-time, holistic view of what is happening across your entire IT landscape.</p><p>This is where Web Services Status Integration comes in. It’s a powerful feature that moves GRC from being a periodic compliance checker to a real-time governance nerve center. This post explores what it is, how it works, and its critical applications.<br>What is Web Services Status Integration?</p><p>At its core, Web Services Status Integration is a mechanism that allows SAP GRC Access Control to communicate directly with other SAP and non-SAP systems via standardized SOAP-based web services.</p><p>Its primary purpose is to check the real-time status of a user or system directly at the source before allowing a potentially risky action to proceed within GRC. It closes the loop between provisioning, risk analysis, and emergency access by ensuring decisions are based on live data, not stale, replicated information.<br>How It Works: The Technical Flow</p><p><strong>The integration operates on a call-and-response model:</strong></p><p>Trigger: An action is initiated within the GRC system. The most common triggers are:</p><p>A user is submitted for an access request.</p><p>A user requests firefighter access in Emergency Access Management (EAM).</p><p>A risk analysis is run.</p><p>Call: Instead of relying on its own stored data, the GRC system makes a real-time call (via a web service) to the target system (e.g., SAP ECC, S/4HANA, or a non-SAP system like Active Directory) to check the current status of the user in question.</p><p>Response: The target system processes the query and sends back a immediate response with the requested status information.</p><p>Decision: The GRC system uses this live feedback to automatically enforce security policies. For example, it can block a request if the web service reports the user is inactive.</p><p><strong>Key Uses and Applications</strong></p><p>This real-time check capability unlocks several powerful and essential applications:<br><strong>1. Preventing Access for Inactive Users (The Killer App)</strong></p><p>This is the most common and critical use case.</p><p>The Problem: When an employee leaves the company, their HR status is set to “inactive,” but their user ID in various systems might not be deleted immediately due to audit requirements. If an access request is submitted for this “inactive” user ID days or weeks later, a GRC system without status integration would see a valid user and potentially approve the request, creating an orphaned and risky account.</p><p>The Solution: With status integration enabled, when a request for user JDOE is submitted, GRC immediately calls the HR system (e.g., SAP SuccessFactors or SAP HCM) via a web service. The web service responds that JDOE is “inactive.” GRC then automatically blocks the request, preventing a critical security violation.</p><p><strong>2. Enhancing Emergency Access Management (EAM / Firefighter)</strong></p><p>Status integration adds a crucial layer of security to the sensitive firefighter process.</p><p>The Problem: A user requests to use a firefighter ID to perform emergency tasks. The GRC system needs to ensure the user is currently authorized to do so.</p><p>The Solution: Before granting firefighter access, GRC can use a web service to:</p><p>Verify the user’s employment is still active.</p><p>Check if the user is currently locked out of their regular account (which might indicate a problem).</p><p>Confirm the user is assigned to the correct group that is allowed to use that specific firefighter ID.<br>This ensures emergency access is granted only under the correct, current conditions.</p><p><strong>3. Real-Time Risk Analysis During Provisioning</strong></p><p>The Problem: Traditional risk analysis is run against a static snapshot of user master data. If that data is outdated, the risk analysis is inaccurate.</p><p>The Solution: When status integration is configured for risk analysis, GRC pulls the absolute latest user attributes (e.g., cost center, position, department) directly from the source system at the moment the request is made. This results in a far more accurate and reliable risk assessment, ensuring new access is compliant from the second it’s granted.</p><p><strong>4. Integrating Non-SAP Systems</strong></p><p>The power of web services is their standardization. While often used with SAP HR systems, the integration can be extended to virtually any system that can expose a SOAP web service.</p><p>&nbsp;Application: You can configure GRC to call a web service from:</p><p>Microsoft Active Directory to check if a user account is disabled.</p><p>Workday or Oracle HCM to check employment status.</p><p>ServiceNow to check if an access request has a valid ticket number.<br>This allows you to create a centralized, holistic governance platform centered on SAP GRC.</p><p><strong>Why It’s a Best Practice</strong></p><p>Implementing Web Services Status Integration is considered a hallmark of a mature GRC program because it:</p><p>Eliminates Manual Errors: Automates checks that would otherwise require manual review.</p><p>Enforces Real-Time Compliance: Makes access control decisions based on the current state of the business, not yesterday’s data.</p><p>Strengthens Security: Prevents the most common pathway for orphaned and rogue accounts.</p><p>Improves Auditability: Provides a clear, automated audit trail showing that checks were performed against authoritative systems at the time of access granting.</p><p><strong>Conclusion</strong></p><p>Web Services Status Integration transforms SAP GRC from a powerful but static compliance tool into a dynamic, intelligent, and proactive security gateway. By ensuring that every access decision is informed by real-time data from source systems, it closes critical security gaps and lays the foundation for a truly integrated and automated governance model.</p><p>For any organization serious about SAP security, configuring this integration is not just an option—it’s an essential step towards robust and reliable access control.</p>', 'Web Services Status Integration in SAP GRC Uses and Applications', 'Web Services Status Integration in SAP GRC Uses and Applications', 'Web Services Status Integration in SAP GRC Uses and Applications', NULL, NULL, 7, 1, '/backend/files/pLcRZCNzeQ3y9XmhajFl.webp', 1, '2026-04-10 05:12:36', '2026-04-10 06:18:26'),
(5, 'Custom Notification in SAP® GRC', 'custom-notification-in-sap-grc', '', '<p><strong>Custom Notification in SAP® GRC</strong><br>Unlock Granular Control: A Guide to Custom Notifications in SAP® GRC</p><p>In the world of SAP Governance, Risk, and Compliance (GRC), communication is everything. Timely, accurate, and actionable notifications are the lifeline that ensures compliance processes run smoothly. Out-of-the-box, SAP GRC provides a solid foundation of standard alerts. But what happens when your unique business process requires more? What if you need to notify a specific group of managers when a risk is triggered, or alert an external auditor when a critical access request is approved?</p><p>This is where the power of Custom Notifications comes in. Moving beyond the standard templates allows you to tailor communication flows to your organization’s exact needs, enhancing efficiency, clarity, and control.<br>Why Go Custom? Beyond Standard Alerts</p><p><strong>While standard notifications handle common scenarios, custom notifications are essential when you need to:</strong></p><p>Notify Additional Stakeholders: Inform line-of-business managers, external auditors, or compliance officers who aren’t part of the standard workflow.</p><p>Trigger Based on Specific Conditions: Send an alert only when a risk is deemed “High” severity or when a request exceeds a certain financial threshold.</p><p>Enhance Message Content: Include custom fields, specific instructions, or links to internal wikis that aren’t available in the standard template.</p><p>Automate Escalations: Create rules to automatically escalate notifications if a task is not completed within a defined timeframe.</p><p>Integrate with External Systems: Format a message to be parsed by a downstream ticketing system like ServiceNow or Jira.</p><p><strong>How It Works: The Building Blocks of Custom Notifications</strong></p><p>Creating a custom notification typically involves a few key components within the GRC platform, particularly in Access Control (AC) and Process Control (PC):</p><p>Defining the Event: First, you identify the precise trigger event in the GRC workflow. This could be:</p><p>Access Request Status Change (e.g., Approved, Rejected, Submitted for Review)</p><p>Risk Mitigation Completed</p><p>Control Failure in Process Control</p><p>User Provisioning/De-provisioning Action</p><p>Configuring the Rule (BRF+): SAP GRC often uses the Business Rule Framework plus (BRF+) as the engine for defining notification logic. Here, you build a rule that states: “IF [this event occurs] AND [these conditions are met], THEN send &nbsp; [this notification] to [these recipients].”</p><p>Crafting the Message Template: This is where you design the content of the email or workflow inbox alert. You can use placeholders (e.g., &amp;USER_ID&amp;, &amp;ROLE_NAME&amp;, &amp;RISK_DESCRIPTION&amp;) that the system will dynamically replace with real data when the notification is sent.</p><p>Assigning Recipients: You can define recipients statically (a specific email address), dynamically (based on a value like “Risk Owner”), or by role (all users with a specific GRC role).</p><p><strong>A Practical Example: Custom Alert for High-Risk Role Assignments</strong></p><p>Scenario: You want to automatically notify the Chief Information Security Officer (CISO) whenever a high-risk role is approved for any user.</p><p><strong>Steps to Implement:</strong></p><p>Event: Access Request Approved</p><p>Condition (BRF+ Rule): IF Approved_Risk_Level = \"HIGH\"</p><p>Recipient: CISO_Email_Address (or a distribution list)</p><p>Message Template:</p><p>Subject: Alert: High-Risk Role Approved – Action May Be Required</p><p>Body:</p><p>Dear CISO Team,</p><p>A high-risk role has been approved for a user.</p><p>User: &amp;USER_ID&amp;<br>Role: &amp;ROLE_NAME&amp;<br>Approver: &amp;APPROVER_ID&amp;<br>Justification: &amp;JUSTIFICATION&amp;</p><p>Please review this assignment in transaction GRACSPROXY for further action.</p><p>This is an automated message from the SAP GRC System.</p><p><strong>Best Practices for Implementation</strong></p><p>Start with a Clear Requirement: Document the business need before touching the system. What problem are you solving?</p><p>Leverage BRF+ Expertise: This powerful tool is key to flexibility. Ensure your team or consultant is proficient in it.</p><p>Avoid Notification Fatigue: Be selective. Too many alerts can lead to important ones being ignored. Use conditions wisely.</p><p>Test Thoroughly: Rigorously test custom rules in a development environment to ensure they trigger correctly and that the message content is accurate and clear.</p><p>Maintain Documentation: Keep a log of all custom notifications, their purpose, and their configuration. This is crucial for future upgrades and troubleshooting.</p><p><strong>Conclusion</strong></p><p>Custom notifications transform SAP GRC from a monolithic compliance tool into a dynamic and integrated control center. By investing in this capability, you move from simply running processes to actively managing your compliance environment with precision and foresight. It’s a powerful step towards a more automated, transparent, and efficient governance model.</p>', 'Custom Notification in SAP® GRC', 'Custom Notification in SAP® GRC', 'Custom Notification in SAP® GRC', NULL, NULL, 7, 1, '/backend/files/0QWEMXccHXEwBD1rqUw8.jfif', 1, '2026-04-10 05:14:29', '2026-04-10 06:19:38'),
(6, 'What’s the Holding Back the It Solution Industry?', 'what-s-the-holding-back-the-it-solution-industry-', '', '<p><br><strong>What’s Holding Back the IT Solution Industry? It’s Not What You Think.</strong></p><p>The IT industry is the engine of the modern world. It’s the force behind global connectivity, unprecedented data analysis, and automation that was pure science fiction a generation ago. From sprawling cloud infrastructures to the AI on our phones, the pace of innovation is staggering.</p><p>So why do so many businesses still feel a sense of frustration when dealing with IT solution providers? Why do projects still overrun, systems remain insecure, and promised “transformations” feel more like expensive, clunky upgrades?</p><p>The problem isn’t a lack of technology. The market is flooded with brilliant tools, platforms, and services. The real roadblocks holding back the IT solution industry are more human, more strategic, and frankly, more fixable.<br><br><strong>1. The Communication Chasm</strong></p><p>This is the granddaddy of all problems. IT providers often speak in a language of acronyms, technical specs, and jargon (SLA, API, IaaS, latency, etc.). Clients speak the language of business: ROI, customer satisfaction, efficiency, and growth.</p><p>When these two worlds collide without a translator, the results are disastrous. The client doesn’t understand the proposal’s value, and the provider doesn’t grasp the client’s core business pain points. The solution becomes a technically sound but misaligned product that fails to deliver real-world value. The industry needs more translators—consultants and account managers who can bridge this gap and ensure everyone is building toward the same business outcome.<br><br><strong>2. The “One-Size-Fits-All” Trap</strong></p><p>Many providers, especially larger ones, fall into the trap of offering cookie-cutter solutions. They have a hammer, so every client problem looks like a nail. They push their preferred vendor’s product or their standard service package without taking the time to diagnose the unique challenges of the business.</p><p>True IT solutions are not products you buy off a shelf; they are strategic plans that are built. They require deep discovery, customization, and a willingness to say, “Our standard offering isn’t the right fit for you, but here’s what would be.” This consultative approach is rare but desperately needed.<br><br><strong>3. Reactive, Not Proactive, Mindset</strong></p><p>Too many IT relationships are built on a break-fix model. Something breaks, the client calls, the provider fixes it. This reactive cycle is exhausting for the client and unsustainable for the provider. It treats IT as a cost center—a necessary evil—rather than a strategic asset.</p><p>The future belongs to providers who are proactive. They use monitoring tools to predict failures before they happen. They analyze security trends to patch vulnerabilities before they are exploited. They schedule upgrades during low-traffic periods. They act as a strategic partner, guiding the client’s technology roadmap to support future business goals, not just putting out today’s fires.<br><br><strong>4. The Security Afterthought</strong></p><p>In an era of sophisticated ransomware attacks and constant threats, cybersecurity cannot be an add-on or a line item to be negotiated down. Yet, many providers still treat it that way. They propose a solution and then mention, “Oh, and we can add security features for an extra cost.”</p><p>This is fundamentally broken. Security must be baked into every solution from the very first line of code, the first server provisioned, and the first user account created. Providers who lead with a “security-first” mindset don’t just protect data; they build trust and become indispensable partners.<br><br><strong>5. Resistance to True Innovation (The “If It Ain’t Broke” Syndrome)</strong></p><p>This one cuts both ways. Sometimes the provider is hesitant to recommend a new, more efficient technology because they are more comfortable with the legacy systems they know. Other times, the client resists moving away from a decades-old server because “it still works.”</p><p>True innovation requires both parties to be brave. Providers must continuously learn and certify themselves on emerging technologies like AI, edge computing, and automation. Clients must be open to modernizing outdated systems that are actually holding them back with high maintenance costs, security risks, and inefficiency.<br>The Way Forward: A Partnership Mindset</p><p>The IT solution industry isn’t being held back by a lack of technology, but by a lack of empathy, strategy, and partnership.</p><p>For clients, the lesson is to choose partners, not vendors. Look for providers who ask about your business goals first and your software version second. Seek out those who communicate clearly and propose tailored solutions.</p><p>For providers, the opportunity is immense. Differentiate yourself by:</p><p>Becoming a translator: Ditch the jargon and speak in terms of business value.</p><p>Listening deeply: Understand the client’s industry, challenges, and ambitions.</p><p>Being proactive: Offer insights and solutions before problems arise.</p><p>Baking in security: Make it a default, non-negotiable part of your offering.</p><p>Embracing innovation: Continuously learn and guide your clients into the future.</p><p>The technology is the easy part. The real solution is human.</p>', 'What’s the Holding Back the It Solution Industry?', 'What’s the Holding Back the It Solution Industry?', 'What’s the Holding Back the It Solution Industry?', NULL, NULL, 7, 1, '/backend/files/qGIy94Gr9NcPxHL0crkM.jpg', 1, '2026-04-10 05:17:09', '2026-04-10 06:20:02'),
(7, 'Meet Smashing Book Frontiers Web For Better.', 'meet-smashing-book-frontiers-web-for-better-', '', '<p><strong>Meet The New Frontier: Designing a Web For Better</strong></p><p>For years, the driving force behind web design and development could be summarized in one word: more. More features, more pages, more animations, more frameworks. We were explorers charting a new digital territory, and our primary goal was to see how far we could go.</p><p>But a shift is happening. The frontier is no longer about expansion; it’s about improvement. The most exciting conversations in our industry are no longer about what’s new, but about what’s better.</p><p>This is the core philosophy behind the new frontier of web design—a movement towards creating a web that is more inclusive, resilient, and meaningful. It’s about building a Web For Better.</p><p>So, what does this new frontier look like? It’s built on three fundamental pillars.<br><br><strong>1. Better for the User: Where Empathy Meets Engineering</strong></p><p>The user is no longer a abstract metric; they are the central focus. Building for them means going beyond a “mobile-first” approach to a “human-first” one.</p><p>Performance as a Priority: A slow website is a broken website. In a world of limited data plans and uneven connectivity, performance is a core feature of accessibility and respect. It means optimizing every image, leveraging modern compression, and writing clean, efficient code. It’s understanding that every second saved is a gift of time and data back to the user.</p><p>Inclusive by Default: Accessibility (a11y) has moved from a nice-to-have to a non-negotiable. This new frontier demands we build experiences everyone can use. This means semantic HTML, robust keyboard navigation, proper color contrast, and clear content structure. It’s not just about compliance; it’s about building a web without barriers.</p><p>Ethical and Transparent Design: A better web is an honest web. It means rejecting “dark patterns” that trick users, being crystal clear about data use, and designing for well-being, not just engagement. It’s about building trust, which has become the most valuable currency online.</p><p><strong>2. Better for the Planet: The Sustainable Web</strong></p><p>Our digital world has a very real physical cost. The internet is a massive consumer of energy, and every byte we transfer contributes to its carbon footprint. The new frontier requires us to be environmentally conscious developers and designers.</p><p>Sustainable web design is now a critical skill. This includes:</p><p>Optimizing Everything: Using modern image formats (like WebP and AVIF), efficient video, and minified code.</p><p>Pruning the Bloat: Questioning the necessity of every library, script, and tracking pixel. Less code means less energy consumed.</p><p>Choosing Green Hosting: Partnering with providers committed to renewable energy.</p><p>Building a lighter, more efficient website isn’t just good for performance—it’s good for the planet.<br><br><strong>3. Better for Developers: Thriving in the Complexity</strong></p><p>A web that is better for users and the planet must also be better for the people who build it. Burnout and complexity are real challenges. The new frontier is about sustainable practices for developers, too.</p><p>Focus on Maintainability: Writing clean, well-documented code that your future self (and your team) will thank you for.</p><p>Choosing the Right Tool, Not the Trendy One: Evaluating technologies based on project needs and team health, not just hype.</p><p>Embracing Core Principles: A strong foundation in HTML, CSS, and vanilla JavaScript provides the resilience to weather the constant storm of new frameworks.</p><p><strong>Welcome to the Frontier</strong></p><p>This movement towards a Web For Better isn’t a passing trend. It’s a maturation of our industry. It’s a commitment to using our skills not just to push boundaries, but to raise standards.</p><p>It asks us a simple but profound question: Are we making the web better?</p><p>The challenge is immense, but so is the opportunity. By focusing on the user, the planet, and our own well-being, we can stop building more of the web and start building a better one.</p>', 'Meet Smashing Book Frontiers Web For Better.', 'Meet Smashing Book Frontiers Web For Better.', 'Meet Smashing Book Frontiers Web For Better.', NULL, NULL, 7, 1, '/backend/files/LAvymKQHLRzbfduHtZmH.jpg', 1, '2026-04-10 05:19:05', '2026-04-10 06:20:52'),
(8, 'What is SAP Analytics Cloud?', 'what-is-sap-analytics-cloud-', '', '<p><strong>What is SAP Analytics Cloud?</strong><br>Beyond Dashboards: What is SAP Analytics Cloud and Why Does It Matter?</p><p>In today’s fast-paced business world, data isn’t just king—it’s the entire kingdom. But many organizations are drowning in data from countless sources: ERP systems, CRM platforms, spreadsheets, and more. The real challenge isn’t collecting data; it’s making sense of it, finding the story it tells, and using that story to make confident, forward-looking decisions.</p><p>This is where SAP Analytics Cloud (SAC) comes in. It’s not just another business intelligence (BI) tool. It’s a comprehensive, cloud-native platform that brings together analytics and planning into a single, powerful solution. Let’s break down what that actually means.<br>What Exactly is SAP Analytics Cloud (SAC)?</p><p>At its core, SAP Analytics Cloud is a Software-as-a-Service (SaaS) application that combines Business Intelligence, Enterprise Planning, and Predictive Analytics. It’s built on SAP’s robust cloud platform and is designed to be the one-stop-shop for all your analytics needs.</p><p>Think of it as the central nervous system for your company’s data. It connects to your various data sources, harmonizes the information, and presents it through beautiful, interactive dashboards. But it goes much further, allowing you to not just see what has happened, but to plan for what will happen.<br>The Three Pillars of SAP Analytics Cloud</p><p>SAC’s power comes from its integrated approach. It’s built on three fundamental pillars:</p><p><strong>1. Business Intelligence (BI) &amp; Visualization</strong><br>This is the “what happened” part. SAC is a top-tier BI tool that allows you to:</p><p>Connect to Data: Pull in data from a huge variety of sources. This includes live connections to SAP ERP (like S/4HANA, BW/4HANA) and non-SAP sources (like Google Drive, SQL databases, and Salesforce).</p><p>Create Stories: In SAC, a “Story” is an interactive dashboard where you blend visualizations (charts, graphs, tables, maps) with text and images to tell a compelling data story.</p><p>Explore with Self-Service: Empower business users to explore data themselves with intuitive drag-and-drop interfaces. They can ask questions in natural language (“show me sales by region last quarter”) and get instant answers without needing IT.</p><p><strong>2. Enterprise Planning</strong><br>This is the “what can we do” part. This is where SAC truly differentiates itself. It integrates financial and operational planning directly with your analytics.</p><p>Unified Process: Break down the silos between finance and operations. Create plans that are directly informed by actual data and predictive forecasts.</p><p>Driver-Based Planning: Model complex business scenarios. For example, see how a change in marketing spend or raw material costs might impact your revenue and profitability.</p><p>Collaboration: Add comments, annotations, and tasks directly within the planning workflow, making the budgeting process a collaborative effort across departments.</p><p><strong>3. Predictive Analytics &amp; Machine Learning</strong><br>This is the “what’s likely to happen” part. SAC brings the power of AI to every user, not just data scientists.</p><p>Smart Assist: Features like “Smart Predict” allow you to run sophisticated forecasting and classification scenarios (e.g., predict customer churn or forecast demand) with a simple point-and-click interface.</p><p>Automated Insights: The built-in AI, called “Search to Insight,” can automatically find anomalies, trends, and key influencers in your data. Just ask, “why did sales decrease in June?” and SAC will analyze all related data points to provide an answer.</p><p>Scenario Simulation: Use predictive models to simulate “what-if” scenarios, giving you a data-driven crystal ball to test decisions before you make them.</p><p>Key Features That Make SAC Powerful</p><p>All-in-One Platform: The seamless integration of BI, Planning, and Predictive capabilities eliminates the need to switch between disjointed tools, ensuring a single source of truth.</p><p>Cloud-Native &amp; Scalable: As a SaaS solution, there’s no hardware to maintain. SAP handles all updates, security, and maintenance, and the platform scales effortlessly with your business.</p><p>SAP Integration: For SAP customers, this is a huge advantage. SAC offers pre-built content and live connectivity to SAP applications, allowing for rapid deployment and real-time insights from core business data.</p><p>Collaborative: Decision-making is a team sport. SAC’s digital boardroom feature allows for immersive, presentation-ready meetings where executives can interact with live data and plan collaboratively.</p><p>Mobile-First: Access dashboards, reports, and plans from anywhere, on any device, ensuring decision-makers have critical insights at their fingertips.</p><p>Who Should Use SAP Analytics Cloud?</p><p>SAP Customers: Organizations running SAP ERP (S/4HANA, ECC, BW) will get the most value due to the deep, native integration.</p><p>Finance &amp; Planning Teams: For their budgeting, forecasting, and financial consolidation needs.</p><p>Business Analysts &amp; Data Scientists: To build advanced models and uncover deep insights without heavy coding.</p><p>Executives &amp; Decision-Makers: To get a holistic, real-time view of business performance through intuitive dashboards and the digital boardroom.</p><p>Departmental Users (in Sales, Marketing, HR, etc.): To create their own reports and analyze their operational data.</p><p>How is it Different from Tools like Tableau or Power BI?</p><p>This is a common question. While Tableau and Power BI are excellent at data visualization and exploration, SAC’s unique value is its native integration of planning and predictive capabilities. It’s not just about looking backward; it’s about planning forward within the same environment. For companies deeply invested in the SAP ecosystem, this integrated approach is a significant competitive advantage.<br>The Bottom Line</p><p>SAP Analytics Cloud is more than a tool; it’s a strategic platform designed to transform how your organization uses data. It moves you from passive reporting to active planning and predictive decision-making. By unifying your analytics landscape, it breaks down silos, fosters collaboration, and ultimately empowers everyone in your company to make smarter, faster, and more confident decisions based on a complete picture of the truth.</p><p>Ready to see it in action? SAP offers demos and trial versions that can help you experience its capabilities firsthand. The future of analytics isn’t just about seeing your data—it’s about engaging with it. And that future is in the cloud.</p>', 'What is SAP Analytics Cloud?', 'What is SAP Analytics Cloud?', 'What is SAP Analytics Cloud?', NULL, NULL, 7, 1, '/backend/files/y6cshVREAJfVV4euP8Q4.jpg', 1, '2026-04-10 05:21:14', '2026-04-10 06:21:47');
INSERT INTO `posts` (`id`, `name`, `slug`, `description_short`, `description_full`, `meta_title`, `meta_description`, `meta_keyword`, `question`, `answer`, `categoryId`, `entry_by`, `thumnail_img`, `status`, `created_at`, `updated_at`) VALUES
(9, 'Basic Concepts of SAP Authorizations', 'basic-concepts-of-sap-authorizations', '', '<p><strong>Basic Concepts of SAP Authorizations</strong></p><p>Basic Concepts of SAP Authorizations: The Foundation of Security</p><p>In the vast and complex world of SAP, security is paramount. At the heart of this security model lies a sophisticated and granular authorization system. For anyone involved in SAP security, support, or even end-user management, understanding these core concepts is essential.</p><p>This guide breaks down the fundamental building blocks of SAP authorizations, explaining how they work together to ensure users have the precise access they need—and nothing more.</p><p>The Core Principle: The Need for Control</p><p>Imagine a new accounts payable clerk joins your company. They need to create vendor invoices but should not be able to approve them or view employee salaries. The SAP authorization system is designed to enforce this exact need-to-know and need-to-do principle, a concept often called&nbsp;Least Privilege.</p><p>The Building Blocks: A Hierarchical Structure</p><p>SAP authorizations are built like a pyramid, with small pieces combining to create powerful and precise access.</p><p><strong>1. The Transaction Code (T-Code)</strong></p><p>This is the most recognizable element for end-users. A&nbsp;Transaction Code&nbsp;is a shortcut that executes a specific program or task in SAP.</p><p>Example:&nbsp;ME21N&nbsp;is the t-code to create a purchase order.&nbsp;PA30&nbsp;is used to maintain HR master data.</p><p>Why it matters:&nbsp;Controlling which t-codes a user can execute is the primary way to control what they can&nbsp;do&nbsp;in the system.</p><p><strong>2. The Authorization Object</strong></p><p>This is the true heart of the system. An&nbsp;Authorization Object&nbsp;is a structured grouping of related permissions that guard a specific activity or set of data. Think of it as a locked door that requires multiple keys to open.</p><p>Each authorization object contains&nbsp;Authorization Fields.</p><p>Example:&nbsp;The object&nbsp;S_TCODE&nbsp;is used to authorize transaction codes. Its most important field is&nbsp;TCD&nbsp;(Transaction Code), where you specify which t-code it controls.</p><p>Another Example:&nbsp;The object&nbsp;F_BKPF_BES&nbsp;authorizes “Posting to Accounting Document”. It contains fields like:</p><p>ACTVT&nbsp;(Activity): What can they do? e.g., ’01’ for Create, ’02’ for Change.</p><p>BUKRS&nbsp;(Company Code): Which company code can they post to?</p><p>SAKNR&nbsp;(G/L Account): Which specific accounts are they allowed to use?</p><p><strong>3. The Authorization</strong></p><p>An&nbsp;Authorization&nbsp;is a specific instance of an Authorization Object where the fields have been given allowed values.</p><p>Example:&nbsp;An authorization for the object&nbsp;S_TCODE&nbsp;would have its&nbsp;TCD&nbsp;field populated with&nbsp;ME21N. This authorization, by itself, would allow a user to run transaction&nbsp;ME21N.</p><p>Wildcards:&nbsp;The asterisk&nbsp;*&nbsp;is a wildcard meaning “all.” An authorization with&nbsp;ACTVT = \'*\'&nbsp;would allow all activities, which is often too broad and violates the principle of least privilege.</p><p><strong>4. The Authorization Profile</strong></p><p>An&nbsp;Authorization Profile&nbsp;is a collection of multiple authorizations (and therefore, multiple authorization objects) bundled together. This is the unit that is directly assigned to a user.</p><p>Analogy:&nbsp;If an authorization is a single key, a profile is a keychain holding all the keys a user needs to perform their job.</p><p>Example:&nbsp;A “Procurement Clerk” profile might include:</p><p>Authorizations for t-codes&nbsp;ME21N&nbsp;(Create PO),&nbsp;ME22N&nbsp;(Change PO),&nbsp;ME23N&nbsp;(Display PO).</p><p>Authorizations for the relevant purchasing objects that restrict them to their specific purchasing group and plant.</p><p><strong>5. The Role (The Practical Container)</strong></p><p>While profiles are technical,&nbsp;Roles&nbsp;are the business-friendly way to manage authorizations. A role (often called a PFCG role, after the transaction&nbsp;PFCG&nbsp;used to maintain them) is a container for which you add the required t-codes and menu paths.</p><p>The Magic of PFCG:&nbsp;When you generate a role, the PFCG tool automatically creates the necessary authorization objects and profiles behind the scenes. You work with business terms (t-codes), and SAP translates them into technical authorizations.</p><p>Benefits:&nbsp;Roles make it much easier to manage and audit access based on job functions like “Financial Accountant” or “Sales Order Processor.”</p><p>How It All Works Together: The Access Check</p><p>When a user tries to perform an action in SAP, the system performs a real-time&nbsp;authorization check. Here’s the process:</p><p>A user attempts to execute transaction&nbsp;ME21N&nbsp;(Create Purchase Order).</p><p>The system checks if the user’s master record has a profile containing an authorization for object&nbsp;S_TCODE&nbsp;with the value&nbsp;ME21N&nbsp;in the&nbsp;TCD&nbsp;field.</p><p>Once in the transaction, the user tries to save a PO for company code&nbsp;US01.</p><p>The system performs another check against a different object (e.g.,&nbsp;M_BEST_EKG), verifying that the user has the&nbsp;ACTVT&nbsp;’01’ (Create) for company code&nbsp;US01.</p><p>If&nbsp;all&nbsp;required authorization checks pass, the action is allowed. If&nbsp;any single check&nbsp;fails, the action is denied, and the user sees an authorization error.</p><p>Key Takeaway</p><p>SAP authorizations are not a single switch but a complex, interlocking system designed for precision. Understanding the relationship between&nbsp;Transaction Codes,&nbsp;Authorization Objects,&nbsp;Profiles, and&nbsp;Roles&nbsp;is the first step toward building a secure, efficient, and compliant SAP environment. It ensures that every user has the keys only to the doors they need to open.</p>', 'Basic Concepts of SAP Authorizations', 'Basic Concepts of SAP Authorizations', 'Basic Concepts of SAP Authorizations', NULL, NULL, 7, 1, '/backend/files/ljyN61if7TuSJoqWQ7Vz.png', 1, '2026-04-10 05:24:25', '2026-04-10 04:34:04'),
(10, 'This Week’s Top Stories About It Solution', 'this-week-s-top-stories-about-it-solution', '', '<p><br><strong>This Week’s Top Stories About IT Solution: Beyond the Hype</strong></p><p>The world of IT solutions moves fast. Every week, a new headline promises a revolutionary tool, a devastating cyber threat, or a paradigm shift in how we work. It’s easy to get lost in the noise.</p><p>This week was no different, but if you cut through the hype, a few key themes emerged that are crucial for any business leader to understand. The top stories weren’t just about new technology; they were about strategy, risk, and the evolving role of IT as a business partner.</p><p>Here’s our breakdown of this week’s top stories and what they really mean for you.<br><strong>1. The Major Cloud Outage: A Stark Reminder of Resilience</strong></p><p>The Headline: A leading cloud provider experienced a significant multi-hour outage, taking down countless websites, apps, and services that depend on it.</p><p>Beyond the Hype: This story isn’t really about the specific provider. It’s a universal reminder that no platform is infallible. The conversation quickly shifted from “Who’s to blame?” to “How can we build resilience?”</p><p>The Takeaway for Your Business: Putting all your eggs in one basket is a high-risk strategy. The top IT solution this story promotes isn’t a new product, but a strategy: multi-cloud or hybrid-cloud architectures. Designing for failure ensures that a single point of failure doesn’t bring your entire operation to a halt.</p><p><strong>2. AI Integration Moves from “Cool Feature” to “Core Requirement”</strong></p><p>The Headline: Major business software platforms (from CRM to accounting) announced deep new AI integrations for automating tasks, predicting trends, and generating insights.</p><p>Beyond the Hype: AI is no longer a separate, futuristic project. It’s being baked into the tools we use every day. The story here is about operational efficiency. These integrations aren’t just for tech giants; they’re becoming standard features accessible to mid-sized businesses.</p><p>The Takeaway for Your Business: If you’re not evaluating how AI can streamline your workflows, you’re already falling behind. The question is no longer if you should use AI, but where it will have the most immediate impact on your productivity and cost savings. Talk to your IT solution provider about an AI readiness assessment.</p><p><strong>3. The “Deepfake” Phishing Attack on a Major Corporation</strong></p><p>The Headline: A sophisticated cyberattack used AI-generated audio (deepfake) to impersonate a CEO and successfully trick an employee into transferring funds.</p><p>Beyond the Hype: This story is a terrifying leap forward in social engineering. It moves beyond poorly written emails to highly personalized, technologically advanced scams. It proves that cybersecurity awareness training needs a massive update.</p><p>The Takeaway for Your Business: Your firewall and antivirus software are not enough. Your last line of defense is a trained, skeptical employee. This story underscores the critical need for continuous security training that includes simulations of these new, sophisticated threats. Verifying requests through a secondary, pre-established channel must become non-negotiable protocol.</p><p><strong>4. The Rise of “Product-Led Growth” in B2B IT Solutions</strong></p><p>The Headline: A new report highlights the surge of product-led growth (PLG) strategies, where the software itself is the primary driver of customer acquisition and expansion.</p><p>Beyond the Hype: This is a story about a shift in power. Users now expect a consumer-grade experience from their business software. They want to try it, use it, and see its value with minimal friction or sales calls.</p><p>The Takeaway for Your Business: This is good news! It means you can evaluate IT solutions based on their actual merit and user experience, not just a slick sales pitch. When choosing new tools, look for those with intuitive interfaces, self-service onboarding, and transparent pricing. The best IT solution is one your team will actually want to use.</p><p><strong>The Common Thread: Strategy Over Speed</strong></p><p>The unifying theme of this week’s top stories is that the most valuable IT solution is a strategic, resilient, and human-centric approach. It’s not about chasing the shiniest new tool; it’s about building a robust, adaptable, and secure foundation that leverages technology to drive real business value.</p>', 'This Week’s Top Stories About It Solution', 'This Week’s Top Stories About It Solution', 'This Week’s Top Stories About It Solution', NULL, NULL, 7, 1, '/backend/files/cOYFMd7UnEoaaJtSDZ01.jpg', 1, '2026-04-10 09:54:18', '2026-04-10 06:22:16'),
(11, 'How to Choose the Right Managed IT Services', 'how-to-choose-the-right-managed-it-services', '', '<p><strong>How to Choose the Right Managed IT Services Provider: A Step-by-Step Guide</strong></p><p>In today’s digital landscape, your business’s technology isn’t just a support tool; it’s the central nervous system of your operations. When it works well, you barely think about it. When it fails, everything grinds to a halt.</p><p>This is why so many businesses are turning to Managed IT Services Providers (MSPs). They offer a proactive, strategic partnership to handle your technology, so you can focus on your business. But with so many providers out there, how do you choose the right one? Picking the wrong partner can be more costly than having no partner at all.</p><p>Follow this step-by-step guide to make an informed decision that will protect and power your business for years to come.</p><p><strong>Step 1: Look Inward &amp; Define Your Needs</strong></p><p>Before you look at any MSP websites, you need to understand your own business. What are your pain points? What are your goals?</p><p>Identify Pain Points: Are you constantly fighting viruses? Is your server outdated? Are employees frustrated with slow systems? Do you have concerns about data security?</p><p>Define Your Goals: Are you planning for rapid growth? Do you need to ensure compliance (like HIPAA or CMMC)? Do you want to move to the cloud?</p><p>Consider Your Industry: Do you have specialized software or unique regulatory requirements?</p><p>Knowing what you need will help you filter out MSPs that aren’t a good fit from the very beginning.</p><p><br><strong>Step 2: Understand Their Core Service Offerings</strong></p><p>A reputable MSP should offer a clear, comprehensive stack of services. Look for these essential components:</p><p>Proactive Monitoring and Maintenance: This is the core of managed services. They should be watching your systems 24/7 to prevent problems before they happen.</p><p>Help Desk and Support: What are their hours? Is support 24/7? What is their average response time? Is it unlimited? This is your team’s lifeline.</p><p>Cybersecurity Strategy: This is non-negotiable. Look for offerings like managed firewall, antivirus, endpoint detection and response (EDR), security awareness training, and email filtering.</p><p>Data Backup and Disaster Recovery (BDR): How do they protect your data? How often are backups tested? What is their guaranteed Recovery Time Objective (RTO)?</p><p>Cloud Services: Expertise in managing cloud platforms like Microsoft 365 or Google Workspace is essential.</p><p>Strategic IT Planning (vCIO): Do they offer virtual Chief Information Officer (vCIO) services? This means they will work with you to align your technology with your business goals and plan for the future.</p><p><strong>Step 3: Evaluate Their Expertise and Culture</strong></p><p>Technology is delivered by people. The right fit is crucial.</p><p>Certifications and Partnerships: Look for partnerships with major tech companies like Microsoft, Cisco, or Dell. These indicate a level of expertise and commitment.</p><p>Industry Experience: Have they worked with businesses like yours? Ask for case studies or client references.</p><p>Culture Fit: Are they responsive and easy to talk to? Do they explain technical concepts in plain English? You’re entering a long-term partnership, so you need to feel comfortable with them.</p><p><strong>Step 4: Scrutinize the Service Level Agreement (SLA)</strong></p><p>The SLA is the contract that defines the terms of your service. Read it carefully. Pay close attention to:</p><p>Guaranteed Response Times: How quickly will they respond to a critical issue versus a low-priority ticket?</p><p>Uptime Guarantees: What level of system availability do they promise?</p><p>Security Provisions: What are their responsibilities versus yours?</p><p>Exit Clause: How can you end the agreement if you’re unhappy? What is the process for getting your data and passwords back? A trustworthy MSP will have a clear and fair offboarding process.</p><p><strong>Step 5: Ask the Tough Questions</strong></p><p>During your sales consultations, don’t be shy. Ask pointed questions:</p><p>“How will you secure our data and network?”</p><p>“Can you walk me through your process for handling a security breach?”</p><p>“How do you price your services? Is it all-inclusive, or are there hidden fees?”</p><p>“Who will be our main point of contact?”</p><p>“What happens if we have an issue outside of business hours?”</p><p><strong>Step 6: Trust Your Gut</strong></p><p>After evaluating all the facts, consider how you feel. Did the MSP listen to your needs, or did they just try to sell you a package? Do you feel confident in their ability? Do they feel like a true partner?</p><p>Choosing a Managed IT Services Provider is one of the most important business decisions you can make. By taking a structured, thoughtful approach, you can find a partner who will not only keep your lights on but will help you innovate, grow, and secure your future.</p>', 'How to Choose the Right Managed IT Services', 'How to Choose the Right Managed IT Services', 'How to Choose the Right Managed IT Services', NULL, NULL, 7, 1, '/backend/files/RrNu7WT14XRpE0b23XEv.jpg', 1, '2026-04-10 09:56:00', '2026-04-10 06:23:11'),
(12, 'How to be prepared for a Role Design Project in SAP', 'how-to-be-prepared-for-a-role-design-project-in-sap', '', '<p><br><strong>Blueprint for Success: How to Be Prepared for a Role Design Project in SAP</strong></p><p>A role design project is one of the most critical initiatives an organization can undertake in its SAP landscape. Done correctly, it streamlines user access, strengthens security, ensures compliance, and simplifies maintenance. Done poorly, it can lead to business disruption, excessive firefighting, and significant audit findings.</p><p>Preparation is everything. A successful project is won or lost long before the first role is built in transaction PFCG. Here’s your strategic blueprint to ensure your role design project is set up for success from day one.<br><br><strong>Phase 1: Foundation &amp; Strategy (The “Why” and “What”)</strong></p><p>This initial planning phase is about aligning the technical project with business objectives.<br><br><strong>1. Define Clear Business Goals and Drivers</strong></p><p>Why are you doing this? The answer cannot be “because our auditor said so.” While compliance is a key driver, anchor the project in business benefits.</p><p>Common Drivers: Improve operational efficiency, enhance security posture, simplify user onboarding, support a migration (e.g., to S/4HANA), or pass a specific compliance audit (SOX, GDPR).</p><p>&nbsp;Action: Document these goals and get stakeholder sign-off. They will guide every decision you make.</p><p><strong>2. Secure Executive Sponsorship</strong></p><p>A role design project requires cross-functional collaboration and will impact every SAP user. Without a visible, committed executive sponsor, the project will stall when conflicts arise.</p><p>Action: Identify a sponsor from the business (e.g., CFO, COO) or IT leadership who understands the strategic value and can champion the project, secure budget, and resolve high-level issues.</p><p><strong>3. Assemble the Right Project Team</strong></p><p>This is not a one-person job. You need a blended team with both technical and business knowledge.</p><p>Key Roles:</p><p>Project Lead/Manager: Drives the plan and timeline.</p><p>SAP Security/GRC Consultant(s): The technical experts who will build the roles.</p><p>Business Process Owners: Key users from each functional area (Finance, SD, MM, HR) who understand the day-to-day tasks and requirements.</p><p>Internal Audit/Compliance Representative: Ensures the design meets internal and external control requirements.</p><p>Action: Define roles, responsibilities, and time commitments for each team member.</p><p>Phase 2: Analysis &amp; Design (The “How”)</p><p>This is the core discovery phase where you move from strategy to execution design.<br><br><strong>4. Conduct a Current State Analysis</strong></p><p>You can’t design the future without understanding the present.</p><p>Action: Use tools like SAP’s Access Control or Access Risk Analysis (ARA) to analyze existing roles and user assignments.</p><p>Identify and document “toxic” combinations and Segregation of Duties (SoD) risks.</p><p>Analyze existing role structure: Are they single, composite, or derived? Are they overly broad (“firefighter” roles)?</p><p>Create an inventory of all critical T-Codes and transactions used in the business.</p><p><strong>5. Establish a Role Design Philosophy</strong></p><p>This is a critical set of principles that the entire team will follow. Debate and agree on these upfront to avoid inconsistency later.</p><p>Key Decisions:</p><p>Single vs. Composite Roles: Will you create single, granular roles (e.g., “Create Sales Order”) and combine them into composite roles for a job function? This is the modern best practice.</p><p>Derived Roles: Will you use derived roles to manage common authorizations across multiple roles? (Often used for organizational level values).</p><p>Naming Conventions: Establish a clear, descriptive naming convention for roles (e.g., Z_MM_BUYER_PLANT_XXXX).</p><p>Organizational Level Strategy: How will you handle restrictions for Company Code, Plant, Sales Org, etc.? Will you use structural authorizations or build them directly into the role?</p><p>Action: Document these decisions in a Role Design Guide. This living document will be the rulebook for your developers.</p><p><strong>6. Define a Target Set of Job Roles</strong></p><p>This is where business process owners provide the most value.</p><p>Action: For each business function, define a catalog of job roles (e.g., “Accounts Payable Clerk,” “Materials Buyer,” “Sales Order Processor”).</p><p>For each job role, list the specific transactions (T-Codes) and activities (Create, Change, Display, etc.) required to perform the job.</p><p>This becomes your “shopping list” for building roles.</p><p><strong>7. Integrate Risk and Compliance from the Start</strong></p><p>Baking compliance into the design is far more efficient than trying to fix it later.</p><p>Action:</p><p>Work with audit to define a risk rule set (e.g., “A user cannot create a vendor and also post an invoice”).</p><p>Use this rule set during the design phase to validate that your proposed job roles are inherently compliant (SoD-by-Design).</p><p>Phase 3: Preparation &amp; Readiness (The “With What”)</p><p>Gather your tools and prepare your environment.<br><br><strong>8. Prepare the Technical Environment</strong></p><p>Ensure your systems are ready for development and testing.</p><p>Action:</p><p>Set up a dedicated development/client system for role building.</p><p>Establish a clear transport path (DEV &gt; QAS &gt; PRD) for moving roles.</p><p>Ensure your GRC Access Control system (if you have one) is configured and integrated with your project client for risk analysis.</p><p><strong>9. Develop a Robust Testing and UAT Plan</strong></p><p>Testing is not an afterthought. It is a primary activity.</p><p>Action:</p><p>Plan for Unit Testing: The security team tests each new role for correct authorization checks.</p><p>Plan for User Acceptance Testing (UAT): Business users must test the roles in a QA system to confirm they can perform all their job duties—and nothing more. Create detailed test scripts for this.</p><p>Plan for a Pilot: Select a small, controlled group of users to go-live first. This allows you to iron out kinks before a full-scale rollout.</p><p><strong>10. Develop a Change Management &amp; Communication Plan</strong></p><p>A new security model can be disruptive and confusing for end-users.</p><p>Action:</p><p>Communicate early and often about the project’s benefits and timeline.</p><p>Train users and helpdesk staff on what to expect, how to request new access, and how to report issues.</p><p>Prepare for a temporary increase in access requests post-go-live as users discover what they need.</p><p><strong>Conclusion: Preparation is Your Greatest Asset</strong></p><p>A role design project is a marathon, not a sprint. Rushing the preparation phase is the single biggest cause of failure. By investing time in defining your strategy, engaging the right people, making deliberate design choices, and preparing your environment, you build a solid foundation for a sustainable, secure, and compliant SAP authorization environment that will serve your business for years to come.</p><p>Your first step? Secure that executive sponsor and start the conversation about business goals. Everything else flows from there.</p>', 'How to be prepared for a Role Design Project in SAP', 'How to be prepared for a Role Design Project in SAP', 'How to be prepared for a Role Design Project in SAP', NULL, NULL, 7, 1, '/backend/files/2wi3g6u8Jn2TDvBufyQY.webp', 1, '2026-04-10 09:57:55', '2026-04-10 06:24:50'),
(13, 'Small Business Disaster Recovery Planning', 'small-business-disaster-recovery-planning', '', '<p><strong>Small Business Disaster Recovery Planning: Your “Get Back to Business” Guide</strong></p><p>Imagine this: You arrive at your office to find a server has failed. Or you get a notification that your company’s data has been encrypted by ransomware. Perhaps a burst pipe has flooded your supply room and your main workstation.</p><p>What’s your first move? If your answer is, “I’m not sure,” you’re not alone. But that uncertainty is a massive risk. According to FEMA, 40% of small businesses never reopen after a disaster. For those that do, prolonged downtime can be a death sentence.</p><p>The good news? This isn’t a problem reserved for giant corporations. With a clear, practical disaster recovery (DR) plan, your small business can survive—and quickly recover from—almost any disruption.<br>Why “It Won’t Happen to Me” is a Risky Business Strategy</p><p>Disasters aren’t always dramatic hurricanes or fires. For a small business, a “disaster” is anything that halts your operations:</p><p>Tech Failure: Hard drive crash, server failure, network outage.</p><p>Cyberattack: Ransomware, data breach, or phishing attack.</p><p>Human Error: Accidentally deleted files, misconfigured settings.</p><p>Localized Events: Power outage, water leak, or internet service disruption.</p><p>The goal of a DR plan isn’t to predict the apocalypse; it’s to ensure a spilled cup of coffee doesn’t spill your profits for the month.<br>Building Your Simple, Effective Disaster Recovery Plan</p><p>You don’t need a 100-page document. You need a clear, actionable plan that everyone can follow. Here’s how to build it.<br><br><strong>Step 1: Identify Your “Crown Jewels”</strong></p><p>You can’t protect everything at once. Start by identifying your most critical assets—the things your business needs to function within the first 24 hours of a disaster.</p><p>Data: Customer lists, financial records, active project files.</p><p>Hardware: The one server that runs your key software, your main point-of-sale computer.</p><p>Software: Your accounting platform, CRM, or custom application.</p><p>People: Who are the key personnel needed to execute the recovery?</p><p><strong>Step 2: Implement the 3-2-1 Backup Rule</strong></p><p>This is the single most important part of your plan. Your data is your business. Protect it like the crown jewel it is.</p><p>3 copies of your data (1 primary copy and 2 backups).</p><p>2 different types of media (e.g., one on a local external hard drive or NAS device, and one in the cloud).</p><p>1 copy stored off-site (this is where cloud backup services shine).</p><p>Pro Tip: Simply copying files to an external drive isn’t enough. Use a dedicated backup solution that automatically runs and creates versioned backups. This allows you to go back to a file before it was corrupted or encrypted by ransomware.<br><br><strong>Step 3: Define Your Recovery Goals</strong></p><p>Get specific about what you need to get back online. Two metrics will guide your entire plan:</p><p>Recovery Time Objective (RTO): How much downtime can you afford? Is it 4 hours? 24 hours? This determines how quickly you need to restore systems.</p><p>Recovery Point Objective (RPO): How much data can you afford to lose? Is losing an hour of sales data acceptable? Or a full day? This determines how often you need to back up your data.</p><p>For most small businesses, an RTO of one business day and an RPO of 24 hours is a practical starting point.<br><br><strong>Step 4: Create Your Communication Plan</strong></p><p>When systems are down, chaos reigns. A clear communication plan is a lifesaver.</p><p>Employee Communication: How will you notify your team? (e.g., Mass text, phone tree, email from a personal account).</p><p>Customer Communication: How will you update customers on delays? Prepare a few email templates in advance.</p><p>Vendor/Partner Communication: Who needs to be notified if you can’t receive shipments or fulfill orders?</p><p><strong>Step 5: Document, Assign, and Practice</strong></p><p>A plan is useless if it’s stuck in a drawer.</p><p>Document It: Write it down! Keep it simple—a Google Doc or a shared Word document is fine. Include contact info, step-by-step recovery procedures, and login information for key services (stored securely in a password manager!).</p><p>Assign Roles: Who is responsible for contacting employees? Who starts the data restoration process? Who talks to clients?</p><p>Practice Once a Year: Run a drill. Simulate a server failure and practice restoring a file from a backup. This tests your plan and your team’s readiness.</p><p>Your Next Step: Start Today</p><p>You don’t have to do this all at once. Your action plan for this week:</p><p>Identify your single most critical piece of data or software.</p><p>Verify that it is being backed up automatically. Check that the backup worked by restoring a test file.</p><p>Document the first three people you would call in an emergency.</p><p>A disaster recovery plan isn’t about fear; it’s about confidence. It’s the insurance policy that ensures your hard work and livelihood are protected, no matter what comes your way.</p>', 'Small Business Disaster Recovery Planning', 'Small Business Disaster Recovery Planning', 'Small Business Disaster Recovery Planning', NULL, NULL, 7, 1, '/backend/files/DYQADb71AezavdgulfyA.jpg', 1, '2026-04-10 09:59:34', '2026-04-10 06:25:52'),
(14, 'How to Integrate Active Directory as a User Data Source in SAP® GRC', 'how-to-integrate-active-directory-as-a-user-data-source-in-sap-grc', '', '<p><strong>Streamline Your Governance: How to Integrate Active Directory as a User Data Source in SAP® GRC</strong></p><p>In any organization, user identities are the cornerstone of access and governance. For companies using Microsoft Active Directory (AD) as their central identity hub, manually recreating and maintaining these users in SAP Governance, Risk, and Compliance (GRC) is a redundant, error-prone, and unsustainable task.</p><p>The solution? Direct integration. By connecting SAP GRC directly to Active Directory, you can automate user provisioning, ensure consistency, and create a single source of truth for user identities across your SAP and Microsoft landscapes.</p><p>This guide walks through the key concepts and steps to integrate AD as a user data source in SAP GRC.<br>Why Integrate? The Benefits of Automation</p><p>Pulling users directly from AD into GRC isn’t just a technical exercise; it’s a major efficiency win.</p><p>Eliminate Manual Entry: Automatically create, update, and deactivate users in GRC based on their status in AD.</p><p>Ensure Consistency: User IDs, first names, last names, and email addresses will always match between AD and GRC.</p><p>Automate De-provisioning: When an employee leaves and their AD account is disabled, you can automatically trigger a de-provisioning workflow in GRC, instantly mitigating access risks.</p><p>Maintain Data Integrity: Reduces the risk of typos and outdated information, leading to more accurate access requests and risk analysis.</p><p>The Core Concept: Understanding the GRC Connector Framework</p><p>SAP GRC uses a flexible Connector Framework to communicate with external systems like Active Directory. This framework uses a standard protocol called HTTP(S) with SOAP to exchange data. The key components are:</p><p>GRC System: The consumer of the user data.</p><p>Connector: A piece of software that acts as a translator between GRC and the external system. For Active Directory, this is the Microsoft Active Directory Connector.</p><p>External System: In this case, your Microsoft Active Directory domain.</p><p>The connector is installed on a server that has network line-of-sight to both your GRC system and your Active Directory Domain Controller.<br>Step-by-Step: The Integration Process</p><p><strong>Here’s a high-level overview of the steps involved in setting up the integration.</strong></p><p><strong>Phase 1: Prerequisites and Planning</strong></p><p>&nbsp;Identify a Server: Provision a Windows server (physical or virtual) to host the GRC Active Directory Connector. This is often called the “Connector Server.”</p><p>&nbsp;Service Account: Create a dedicated service account in AD with read-only permissions. This account should have the minimum privileges needed to query user objects (e.g., read access to the relevant Organizational Units – OUs).</p><p>&nbsp;Network Access: Ensure the Connector Server can communicate with:</p><p>&nbsp;The GRC application server over HTTPS (usually port 443).</p><p>&nbsp;An Active Directory Domain Controller over LDAP (port 389) or secure LDAP (LDAPS, port 636).</p><p>&nbsp;Download Software: Obtain the latest GRC Access Control Content package from the SAP Support Portal. This contains the installer for the Active Directory Connector.</p><p><strong>Phase 2: Install and Configure the Connector</strong></p><p>&nbsp;Run the Installer: On the Connector Server, run the setup.exe from the downloaded package and choose to install the Microsoft Active Directory Connector.</p><p>&nbsp;Configure Connection to AD: The installer will prompt you for the AD connection details:</p><p>&nbsp;Domain Controller name or IP.</p><p>&nbsp;Port (389 for LDAP, 636 for LDAPS).</p><p>&nbsp;The service account credentials you created.</p><p>&nbsp;The base Distinguished Name (DN) for the search (e.g., OU=Users,DC=mycompany,DC=com). This defines where in the AD tree the connector will look for users.</p><p>&nbsp;Configure Connection to GRC: You will also provide the details of your GRC system:</p><p>&nbsp;GRC hostname and port.</p><p>SOAP service endpoint.</p><p>A technical communication user in GRC with the required permissions (like GRACCONNECTOR).</p><p><strong>Phase 3: Configure the Data Source in GRC Web UI</strong></p><p>With the connector installed, you now tell GRC how to use it.</p><p>Log in to the GRC NWBC or Fiori launchpad with an administrator account.</p><p>&nbsp;Navigate to: Common Setup Components &gt; Data Sources &gt; Data Source Management (Transaction GRCSPROXY).</p><p>&nbsp;Create a New Data Source:</p><p>&nbsp; Data Source Type: Select Active Directory.</p><p>&nbsp; Technical Name: Give it a meaningful name (e.g., AD_CORP).</p><p>&nbsp; System Type: Non-SAP.</p><p>&nbsp; Connection Details: Provide the hostname and port of your Connector Server (not the AD server itself).</p><p>&nbsp; Test the Connection: Use the built-in test function to verify that GRC can communicate successfully with the connector and that the connector can talk to AD.</p><p><strong>Phase 4: Define and Schedule a Job to Import Users</strong></p><p>The final step is to create a job that pulls the user data.</p><p>&nbsp;Navigate to: Access Control &gt; Administration &gt; Import Users from Data Source (Transaction GRACI_IMPORT_USER).</p><p>&nbsp;<strong>Create a New Job:</strong></p><p>Select your newly created AD data source.</p><p>Mapping: This is a critical step. You must map the fields from Active Directory to the corresponding user fields in GRC.</p><p>Map sAMAccountName to User ID.</p><p>Map givenName to First Name.</p><p>Map sn to Last Name.</p><p>Map mail to Email Address.</p><p>Filter (Optional): You can add filters to only import users from a specific AD OU or with certain attributes (e.g., (&amp;(objectCategory=person)(objectClass=user))).</p><p>Schedule the Job: Set the job to run on a regular schedule (e.g., nightly). This ensures GRC user master data is always synchronized with AD.</p><p>Key Considerations and Best Practices</p><p>LDAPS is Non-Negotiable: Always use Secure LDAP (LDAPS) to encrypt the communication between the connector and your Domain Controller. This protects sensitive user information in transit.</p><p>Start with a Pilot OU: For your initial import, filter the job to a small, test Organizational Unit. Verify the data is correct before importing all users.</p><p>Handle “Display Name”: AD’s displayName field is often a single string (e.g., “Doe, John”). You may need to use a custom script or a separate mapping logic to split this into GRC’s separate First Name and Last Name fields if those core attributes are not populated.</p><p>Plan for Deletions/Deactivations: Decide on a strategy for handling users deleted in AD. Often, it’s better to deactivate them in GRC rather than delete them to maintain an audit trail.</p><p><strong>Conclusion</strong></p><p>Integrating Active Directory as a user source is a foundational step towards a modern, automated, and secure GRC implementation. It closes a critical gap in your identity governance process, ensuring that the users who request and hold access in your SAP environment are always reflective of the real-world employees in your organization. By eliminating manual syncs, you not only save time but also significantly strengthen your security posture.</p>', 'How to Integrate Active Directory as a User Data Source in SAP® GRC', 'How to Integrate Active Directory as a User Data Source in SAP® GRC', 'How to Integrate Active Directory as a User Data Source in SAP® GRC', NULL, NULL, 7, 1, '/backend/files/cyh6IdVgdQDBHIPaj3pK.jpg', 1, '2026-04-10 10:05:20', '2026-04-10 04:39:57'),
(15, 'Data Backup and Recovery Best Practices Small', 'data-backup-and-recovery-best-practices-small', '', '<p><strong>Data Backup and Recovery Best Practices: A Small Business Owner’s Guide</strong></p><p>Your data is the lifeblood of your business. Customer lists, financial records, project files, and emails—it all lives as ones and zeros on a drive. Now imagine it’s gone. A ransomware attack locks it away. A hardware failure corrupts it. A simple human error deletes a critical folder.</p><p>For a small business, this isn’t just an inconvenience; it’s an existential threat. The good news? With a solid backup and recovery strategy, you can protect your business from disaster.</p><p>This isn’t about complex IT jargon. It’s about practical, actionable best practices that any small business can implement.<br>The Golden Rule: The 3-2-1 Backup Strategy</p><p>This is the cornerstone of all data protection. If you remember nothing else, remember this rule.</p><p>3 Copies of Your Data: Maintain one primary copy and two backup copies. Never rely on a single copy of anything important.</p><p>2 Different Media Types: Store your backups on two different types of storage. This protects you against failures specific to one medium. For example, have one copy on an external hard drive (device failure risk) and one copy in the cloud (risk of internet dependency).</p><p>1 Copy Off-Site: Keep at least one backup copy in a separate physical location. This is your insurance against fire, flood, theft, or other local disasters. Cloud backup automatically satisfies this rule.</p><p><strong>Best Practice #1: Automate Everything</strong></p><p>Manual backups are unreliable. You will forget. Set it and forget it.</p><p>Use built-in tools like File History on Windows or Time Machine on Mac for simple local backups.</p><p>Invest in a dedicated cloud backup service like Backblaze, Carbonite, or IDrive. These services run silently in the background, automatically backing up your files to a secure off-site location. This is the easiest way to achieve the 3-2-1 rule.</p><p><strong>Best Practice #2: Go Beyond Files – Image Your Systems</strong></p><p>Backing up files is crucial, but what about your operating system, applications, and settings? Reinstalling everything from scratch after a crash can take days.</p><p>Use System Image Backups: Tools like Macrium Reflect or Acronis True Image create a complete “image” of your entire hard drive—a single file that contains your OS, programs, settings, and all your data.</p><p>The Benefit: If your hard drive fails, you can restore this image to a new drive and be back to work exactly as you were in hours, not days.</p><p><strong>Best Practice #3: Test Your Backups (The Most Skipped Step!)</strong></p><p>A backup you haven’t tested is not a backup. It’s a hope. Corrupted backup files or failed processes are sadly common.</p><p>Schedule Quarterly Tests: Every few months, pick a file—or better yet, a system image—and perform a test restore. Can you retrieve the data? Does it open correctly?</p><p>This is the only way to have true confidence in your disaster recovery plan.</p><p><strong>Best Practice #4: Protect Against Ransomware with Versioning</strong></p><p>Simple file sync (like Dropbox or OneDrive sync) is not a true backup. If a ransomware attack encrypts your files, it will often encrypt the synced versions in the cloud too.</p><p>Ensure your backup solution offers versioning. This means it keeps multiple historical versions of your files. If the latest version is encrypted, you can simply roll back to a clean version from yesterday or last week.</p><p><strong>Best Practice #5: Make a Simple Recovery Plan</strong></p><p>Knowing you have a backup is one thing. Knowing how to use it in a panic is another.</p><p>Document the Steps: Write down simple instructions: “1. Contact [IT Person/MSP]. 2. To restore a single file, go to [URL] and log in. 3. To restore a full system, use the recovery USB drive located [here].”</p><p>Keep Critical Info Accessible: Ensure the login details for your backup service are stored securely in a password manager, not on a sticky note on the computer that just failed.</p><p><strong>Your Action Plan: Get Started This Week</strong></p><p>Audit: Identify your most critical data. Where is it stored? Is it currently being backed up?</p><p>Implement: Choose a cloud backup service and install it on all key machines. Set up a local external drive for a second copy.</p><p>Test: Immediately perform a test restore of one important file to confirm it works.</p><p>Document: Write down the basic recovery steps and share them with your team.</p><p>Data loss doesn’t discriminate by company size. By implementing these best practices, you’re not just backing up files—you’re building a resilient foundation that allows your small business to withstand a crisis and thrive.</p>', 'Data Backup and Recovery Best Practices Small', 'Data Backup and Recovery Best Practices Small', 'Data Backup and Recovery Best Practices Small', NULL, NULL, 7, 1, '/backend/files/7xPDsBwgzxkEGif3vl3U.jpg', 1, '2026-04-10 10:10:47', '2026-04-10 04:40:52'),
(16, 'Your Business Safe Ensure High Availability.', 'your-business-safe-ensure-high-availability-', '', '<p><strong>Keep Your Business Safe: How to Ensure High Availability and Avoid Costly Downtime</strong></p><p>In today’s always-on digital economy, your website is your storefront. Your line-of-business applications are your assembly line. Your data is your most valuable asset. When any of these systems go down, your business isn’t just inconvenienced—it’s bleeding money.</p><p>The question isn’t if a technical failure will happen; it’s when. Hardware fails. Software bugs appear. Human errors occur. The goal isn’t to prevent every single failure—that’s impossible. The goal is to build a resilient infrastructure where these failures don’t lead to catastrophic downtime.</p><p>This concept is known as High Availability (HA), and it’s the key to keeping your business safe and operational, no matter what happens.<br>What is High Availability, Really?</p><p>High Availability is a design approach that ensures your critical systems and applications are operational and accessible for a very high percentage of the time—aiming for 99.99% (“four nines”) uptime or better. This translates to just minutes of unplanned downtime per year.</p><p>Think of it not as a single product you buy, but as a strategy you build. It’s about eliminating single points of failure.<br>The Pillars of a Highly Available Infrastructure</p><p>Building a resilient business doesn’t require a Fortune 500 IT budget. It requires a smart, layered approach based on these key pillars:<br><br><strong>1. Redundancy: The “No Single Point of Failure” Rule</strong></p><p>If one component fails, another must immediately take its place.</p><p>Hardware: Use redundant power supplies, network switches, and storage drives (RAID configurations).</p><p>Servers: For critical applications, use a cluster of servers. If the primary server fails, a secondary server automatically takes over with no interruption (this is called failover).</p><p>&nbsp; &nbsp;Internet Connection: A single internet line is a major risk. A failover internet connection (even a lower-cost business cable line or 5G backup) can keep you online if your primary fiber line is cut.</p><p><strong>2. Reliable Backups and a Robust Disaster Recovery (DR) Plan</strong></p><p>High Availability handles small, common failures. But you also need a plan for major disasters (ransomware, fire, natural disaster).</p><p>Follow the 3-2-1 Rule: Keep 3 copies of your data, on 2 different media, with 1 copy off-site.</p><p>Know Your RTO and RPO:</p><p>Recovery Time Objective (RTO): How quickly must you be back online? (e.g., 2 hours)</p><p>Recovery Point Objective (RPO): How much data can you afford to lose? (e.g., 15 minutes of data)</p><p>Test Your Restores: A backup is useless if you can’t restore from it. Test the process regularly.</p><p><strong>3. Proactive Monitoring and Maintenance</strong></p><p>You can’t fix a problem you don’t know about. High Availability requires a proactive, not reactive, approach.</p><p>24/7 Monitoring: Use tools to continuously monitor server health, network performance, and storage capacity. Get alerts for issues before they cause an outage (e.g., a drive starting to fail, memory usage spiking).</p><p>Patch Management: Regularly update and patch operating systems and applications to fix security vulnerabilities and stability bugs that could cause a crash.</p><p><strong>4. Leveraging the Cloud for Resilience</strong></p><p>For most small and mid-sized businesses, the cloud is the most practical and cost-effective path to high availability.</p><p>Cloud Hosting: Providers like AWS, Azure, and Google Cloud operate massive data centers built with immense redundancy across power, cooling, and networking. By hosting your website or applications there, you leverage their infrastructure.</p><p>Built-in HA Services: Cloud platforms offer easy-to-configure load balancers (to distribute traffic across multiple servers) and multi-zone deployments (to run your systems in physically separate data centers for protection against a local outage).</p><p>How to Get Started: Your High Availability Checklist</p><p>You don’t have to implement everything at once. Start with your most critical systems.</p><p>Identify Critical Assets: What system would hurt the most if it went down? Your e-commerce site? Your CRM? Start there.</p><p>Assess Single Points of Failure: Does your server have one power supply? One internet connection? One hard drive?</p><p>Implement a Backup Internet Line: This is often one of the easiest and most effective first steps.</p><p>Migrate a Critical Application to a Cloud HA Setup: Work with your IT team or managed service provider (MSP) to design a cloud-hosted solution with built-in failover.</p><p>Talk to an Expert: A trusted MSP can conduct a vulnerability assessment and help you build a phased plan to achieve your availability goals.</p><p><strong>Conclusion: Availability is Safety</strong></p><p>Investing in High Availability is not an IT expense; it’s an investment in business continuity, customer trust, and brand reputation. It’s the ultimate insurance policy for your digital operations.</p><p>By building layers of redundancy, leveraging modern cloud tools, and adopting a proactive mindset, you can ensure that when the inevitable failure occurs, your customers won’t even notice. And that is how you keep your business truly safe.</p>', 'Your Business Safe Ensure High Availability.', 'Your Business Safe Ensure High Availability.', 'Your Business Safe Ensure High Availability.', NULL, NULL, 7, 1, '/backend/files/oD7gdXUckNsY3S2pCK6a.jpg', 1, '2026-04-10 10:14:01', '2026-04-10 04:43:41');

-- --------------------------------------------------------

--
-- Table structure for table `post_category`
--

CREATE TABLE `post_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_category`
--

INSERT INTO `post_category` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'About Us', 1, '2025-10-11 19:01:22', '2025-10-11 13:01:35'),
(2, 'Terms & Conditions', 1, '2025-10-11 19:01:22', '2025-10-11 19:01:22'),
(4, 'Privacy Policy', 1, '2025-10-11 19:01:22', '2025-10-11 19:01:22'),
(5, 'Return Policy', 1, '2025-10-11 19:01:22', '2025-10-11 19:01:22'),
(6, 'FAQ', 1, '2025-11-16 05:09:19', '2025-11-16 05:09:19'),
(7, 'Blog', 1, '2026-01-08 16:32:30', '2026-01-08 16:32:30');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description_full` text DEFAULT NULL,
  `purchase_order_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL,
  `subcategoryId` int(11) DEFAULT NULL,
  `inSubcategoryId` int(11) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` varchar(255) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `cash_dev_status` int(11) DEFAULT NULL,
  `price` double(10,2) DEFAULT NULL COMMENT 'regular_price',
  `discount_price` decimal(10,2) DEFAULT NULL COMMENT 'discount_price',
  `unit` varchar(255) DEFAULT NULL,
  `stock_qty` int(11) DEFAULT NULL,
  `stock_mini_qty` int(11) DEFAULT NULL,
  `shipping_days` int(11) DEFAULT NULL,
  `thumnail_img` varchar(255) DEFAULT NULL,
  `first_update` int(11) NOT NULL DEFAULT 0 COMMENT '1=first update\r\n0=no update',
  `status` int(11) DEFAULT 1,
  `entry_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `slug`, `description_full`, `purchase_order_id`, `supplier_id`, `categoryId`, `subcategoryId`, `inSubcategoryId`, `meta_title`, `meta_description`, `meta_keyword`, `sku`, `cash_dev_status`, `price`, `discount_price`, `unit`, `stock_qty`, `stock_mini_qty`, `shipping_days`, `thumnail_img`, `first_update`, `status`, `entry_by`, `created_at`, `updated_at`) VALUES
(1, 'We provide perfect IT solutions & technology for any startups.', 'we-provide-perfect-it-solutions-technology-for-any-startups', '<p>Founded in 2019, managed by professionals who are from IT background having years of industry experience, We have technology consulting and staff augmentation services having office in the US. Our ability is to cater to a diversified IT domains and that has made us a preferred choice among several of our U.S based clients..</p>', NULL, NULL, 1, NULL, NULL, 'We provide perfect IT solutions & technology for any startups.', 'We provide perfect IT solutions & technology for any startups.', 'We provide perfect IT solutions & technology for any startups.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, '2026-04-09 23:25:40', '2026-04-09 23:25:40'),
(2, 'Quality & Experience IT Solution Company', 'quality-experience-it-solution-company', '<p>In 2019, Astute360corp set out with a goal – to help customers realize the true potential of their IT organization. We accomplish this through a unique and transparent business model. Our accomplished team, in-house technical expertise, and collective curiosity to hear YOUR story lays the foundation for a fruitful consulting engagement time and time again.</p>', NULL, NULL, 2, NULL, NULL, 'Quality & Experience IT Solution Company', 'Quality & Experience IT Solution Company', 'Quality & Experience IT Solution Company', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, '2026-04-09 23:39:58', '2026-04-09 23:39:58'),
(3, 'SAP® Security Assesment', 'sap-security-assesment', '<p><strong>Know the security level of you SAP® systems</strong><br>SAP® Security Assessment is a comprehensive service from Astute360corp that provides customers with real-time insights into critical risks and vulnerable configuration settings within their SAP® systems. How secure are your SAP® systems?</p><p><strong>Risk &amp; Role Model Analysis</strong><br>Analyze SAP® access against the standard risk matrix to identify Segregation of Duties (SoD) and critical access risks. Then, benchmark the role model against best practices to generate recommendations for reducing risk and simplifying access management.</p><p><strong>Professional &amp; Clear:</strong><br>This process involves identifying users with Segregation of Duties (SoD) conflicts and critical access by analyzing SAP® systems with the standard risk matrix. It also includes benchmarking the current role model against a best-practice framework to provide recommendations for reducing risks and streamlining access control.</p><p><strong>Security Analysis</strong><br>This service delivers a comprehensive security assessment of your SAP® landscape. Our analysis includes a review of user authorizations and password policies, a technical evaluation of system vulnerabilities and security parameters, an assessment of system health and performance, and an audit of your security policies and procedures.<br>Our SAP® security analysis assesses your systems’ protection level by examining users, passwords, vulnerabilities, security settings, system status, and governance protocols to identify critical risks.</p><p>&nbsp;</p>', NULL, NULL, 3, 7, NULL, 'SAP® Security Assesment', 'SAP® Security Assesment', 'SAP® Security Assesment', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/products/1775757092_sap-security-assesment.jpg', 1, 1, NULL, '2026-04-09 23:43:49', '2026-04-09 17:51:32'),
(4, 'Role Model Design', 'role-model-design', '<p><strong>Reduces SAP® user accesses that may pose risks or conflicts</strong></p><p>SAP® role model redesign aligns user access with best practices by replacing outdated roles. This modernization reduces Segregation of Duties (SoD) conflicts to meet compliance requirements like Sarbanes-Oxley (SOx) and simplifies access management, lowering long-term maintenance effort and cost.</p><p>Redesigning the SAP® role model involves implementing a best-practice framework by overhauling current user access and replacing legacy roles. The primary goal is to mitigate Segregation of Duties (SoD) risks for compliance with regulations such as Sarbanes-Oxley (SOx). A secondary benefit is the significant simplification of access management, which reduces ongoing administrative overhead and associated costs.</p><p>&nbsp;</p><p><strong>Benefits of our solution</strong></p><p>&nbsp; &nbsp;Easily sustainable role model.<br>&nbsp; &nbsp;Minimises SoD risks, helping you to comply with regulations such as SOx.<br>&nbsp; &nbsp;Reduce the cost and time to maintain your SAP® systems.<br>&nbsp; &nbsp;Involve the business in decision making.<br>&nbsp; &nbsp;Best practice role model increases organisational capacity.</p><p>&nbsp;</p>', NULL, NULL, 3, 7, 22, 'Role Model Design', 'Role Model Design', 'Role Model Design', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/products/1775759035_role-model-design.jpeg', 1, 1, NULL, '2026-04-10 00:07:31', '2026-04-09 18:23:55'),
(5, 'UI Masking', 'ui-masking', '<p><strong>Restricts unauthorized users from accessing sensitive information.</strong></p><p>UI Masking is a solution that hides sensitive fields from users who are not specifically authorized to view them. It enhances compliance with privacy, data protection, regulatory, and internal policies by controlling access to confidential information.</p><p><strong>What do we solve?</strong></p><p>&nbsp; &nbsp;Non-compliance with data protection regulations in SAP® systems caused by exposure of critical data.</p><p>&nbsp; &nbsp;Insufficient control over the display of sensitive fields, resulting in inefficiencies and limited flexibility in sharing information.</p><p>&nbsp; &nbsp;High support team workload, reduced through streamlined access management.</p><p>&nbsp;</p><p><strong>Benefits of UI Masking</strong></p><p>&nbsp; &nbsp;Enhances data security and safeguards confidentiality across your organization’s network.</p><p>&nbsp; &nbsp;Simplifies compliance with data protection regulations.</p><p>&nbsp; &nbsp;Delivers a better, more streamlined user experience.</p><p>&nbsp;</p>', NULL, NULL, 3, 6, 15, 'UI Masking', 'UI Masking', 'UI Masking', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/products/1775759001_ui-masking.png', 1, 1, NULL, '2026-04-10 00:15:38', '2026-04-09 18:23:21'),
(6, 'SAP Analytics Cloud', 'sap-analytics-cloud', '<p><strong>Comprehensive Intelligent Technologies with SAP Analytics Cloud</strong></p><p>Unlock 360° insights with SAP Analytics Cloud—a unified analytics platform that delivers real-time data visualization, predictive intelligence, and collaborative decision-making.</p><p>SAP Analytics Cloud is an all-in-one analytics and planning solution designed to maximize the value of your business applications and most critical data sources.</p><p><br><strong>Infuse Trusted AI</strong><br>Leverage generative AI with Joule copilot to automate reporting, reveal hidden insights, and streamline planning.</p><p><strong>Deliver Mission-Critical Analytics</strong><br>Enhance business intelligence with pre-built, industry-specific analytics content that drives sharper insights and faster decision-making.</p><p><strong>Transform Enterprise Planning</strong><br>Bring financial, supply chain, and operational planning together in a single platform to enable seamless, collaborative planning.</p><p>&nbsp;</p>', NULL, NULL, 3, 6, 16, 'SAP Analytics Cloud', 'SAP Analytics Cloud', 'SAP Analytics Cloud', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/products/1775758959_sap-analytics-cloud.jpg', 1, 1, NULL, '2026-04-10 00:17:56', '2026-04-09 18:22:39'),
(7, 'BTP (Business Technology Platform)', 'btp-business-technology-platform', '<p><strong>SAP Cloud Integrations (BTP Integration Suite)</strong></p><p>Our solutions enable seamless data flow across your enterprise, tackling challenges such as siloed data, inefficient processes, and integration bottlenecks.</p><p><strong>We help you achieve efficient, connected systems and applications through:</strong></p><p>&nbsp; &nbsp;Seamless Integration: Connect all your applications, on-premise or cloud, effortlessly.</p><p>&nbsp; &nbsp;Pre-Built Connectors: Accelerate integration with ready-to-use connectors for SAP and third-party systems.</p><p>&nbsp; &nbsp;Data Management: Ensure accurate, consistent, and governed data across the enterprise.</p><p>&nbsp; &nbsp;API Management: Simplify API creation, monitoring, and security for scalable integration.</p><p>&nbsp; &nbsp;Extension &amp; Customization: Tailor SAP solutions to meet your unique business requirements.</p><p>&nbsp; &nbsp;Real-Time Insights: Drive smarter decisions by integrating and analyzing data across systems instantly.</p><p>&nbsp; &nbsp;Scalable Architecture: Future-proof your enterprise with flexible, scalable integration solutions.<br>&nbsp;</p>', NULL, NULL, 3, 6, 17, 'BTP (Business Technology Platform)', 'BTP (Business Technology Platform)', 'BTP (Business Technology Platform)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/products/1775758943_btp-business-technology-platform.png', 1, 1, NULL, '2026-04-10 00:21:42', '2026-04-09 18:22:23'),
(8, 'Process Control', 'process-control', '<p><br><strong>Optimises the functioning of established control processes and policies</strong></p><p>SAP® GRC Process Control manages the complete lifecycle of mitigating controls and executes automated controls via Continuous Control Monitoring (CCM). This ensures processes function correctly and comply with policies, preventing increased organizational risk.</p><p>SAP® GRC Process Control is a governance tool that oversees the entire lifecycle of risk-mitigating controls. It automates control monitoring to validate process effectiveness and policy compliance, thereby reducing organizational risk.</p><p>&nbsp;</p><p><strong>Benefit-Oriented</strong></p><p>To prevent increased risk, SAP® GRC Process Control automates and manages control lifecycles. By ensuring the proper functioning of key processes and adherence to policies through Continuous Control Monitoring (CCM), it strengthens compliance and operational integrity.</p>', NULL, NULL, 3, 7, 19, 'Process Control', 'Process Control', 'Process Control', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/products/1775794203_process-control.jpg', 1, 1, NULL, '2026-04-10 10:09:48', '2026-04-10 04:10:03'),
(9, 'Access Control', 'access-control', '<p><br><strong>Monitor and control access to your SAP® systems</strong></p><p>SAP® GRC Access Control ensures secure, compliant access by monitoring and managing user authorizations, guaranteeing that individuals only have the appropriate access to critical data.</p><p>SAP® GRC Access Control is a governance, risk, and compliance (GRC) solution that monitors, analyzes, and governs user access. It ensures compliance and security by guaranteeing that only authorized users have appropriate access to sensitive data.</p><p>&nbsp;</p><p><br><strong>Why these are improved:</strong></p><p>&nbsp; &nbsp;Stronger Verbs: Uses “governs,” “manages,” and “restricts” instead of the more passive “controls.”</p><p>&nbsp; &nbsp;Adds Context: Mentions benefits like “compliance,” “risk mitigation,” and “principle of least privilege.”</p><p>&nbsp; &nbsp;Improves Flow: Creates a more logical connection between the tool’s actions and its ultimate goal.</p><p>&nbsp; &nbsp;Professional Tone: Incorporates standard industry terminology like “oversight,” “authorized users,” and “sensitive data.”</p><p>&nbsp;</p>', NULL, NULL, 3, 7, 20, 'Access Control', 'Access Control', 'Access Control', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/products/1775794750_access-control.jpg', 1, 1, NULL, '2026-04-10 10:18:55', '2026-04-10 04:19:10'),
(10, 'Risk Management', 'risk-management', '<p><strong>Detects, analyzes, and proactively addresses business risks in real time.</strong></p><p>SAP® Risk Management enables organizations to proactively identify, analyze, and respond to business risks in real time. It allows organizations to anticipate potential threats, streamline decision-making, and navigate an increasingly volatile and complex business environment</p><p><br><strong>What do we solve?</strong></p><p>&nbsp; &nbsp;Manual management of corporate risk matrices is slow and inefficient.</p><p>&nbsp; &nbsp;Performing risk analysis manually across the organization consumes significant time and resources.</p><p>&nbsp; &nbsp;The absence of a central information repository hinders organizational efficiency.</p><p>&nbsp;</p><p><strong>Benefits of Risk Management</strong></p><p>&nbsp; &nbsp;Provides a centralized repository of risks across your organization.</p><p>&nbsp; &nbsp;Automates processes, minimizing manual tasks in daily operations.</p><p>&nbsp; &nbsp;Integrates with Process Control to support effective risk mitigation.</p><p>&nbsp; &nbsp;Enables real-time monitoring and proactive risk response.</p><p>&nbsp; &nbsp;Improves decision-making with data-driven risk insights.</p><p>&nbsp; &nbsp;Enhances compliance with regulatory and internal policies.</p><p>&nbsp;</p>', NULL, NULL, 3, 7, 21, 'Risk Management', 'Risk Management', 'Risk Management', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/products/1775794846_risk-management.jpg', 1, 1, NULL, '2026-04-10 10:20:35', '2026-04-10 04:20:46'),
(11, 'SAP® Cloud Identity Access Governance', 'sap-cloud-identity-access-governance', '<p><br><strong>Enhances and streamlines identity and access management in cloud environments.</strong></p><p>SAP® Cloud Identity Access Governance (IAG) is a cloud-based solution for managing access to SAP® systems. With SAP IAG, organizations can enhance system security, automate user and access management processes, reduce the risk of unauthorized access, and strengthen overall security and compliance strategies.</p><p>&nbsp;</p><p><strong>Key SAP IAG modules include:</strong></p><p>&nbsp; &nbsp;Access Analysis Service (AAS)</p><p>&nbsp; &nbsp;Access Certification Service (ACS)</p><p>&nbsp; &nbsp;Access Request Service (ARS)</p><p>&nbsp; &nbsp;Privileged Access Management (PAM)</p><p>&nbsp; &nbsp;Role Design Service (RDS)</p><p>&nbsp;</p><p><strong>Benefits of SAP® Cloud Identity Access Governance</strong></p><p>&nbsp; &nbsp;Identify and Remediate Risks: Detect potential access risks and take corrective actions proactively.</p><p>&nbsp; &nbsp;Ensure Compliance and Traceability: Maintain regulatory compliance with full audit trails and reporting.</p><p>&nbsp; &nbsp;Increase Efficiency: Streamline and automate access management across SAP® systems.</p><p>&nbsp; &nbsp;Strengthen Security: Reduce the risk of unauthorized access and protect critical data.</p><p>&nbsp;</p><p>&nbsp;</p>', NULL, NULL, 3, 7, 18, 'SAP® Cloud Identity Access Governance', 'SAP® Cloud Identity Access Governance', 'SAP® Cloud Identity Access Governance', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/products/1775794960_sap-cloud-identity-access-governance.jpg', 1, 1, NULL, '2026-04-10 10:22:16', '2026-04-10 04:22:40'),
(12, 'SAP Advanced Business Application Programming', 'sap-advanced-business-application-programming', '<p><strong>1. SAP GUI Introduction</strong><br>• SAP GUI Concept, Use<br>• SAP System Access Options<br>• SAP Logon<br>• Starting SAP Logon<br>• Logon to SAP System<br>• Logoff from SAP System<br>• SAP GUI Window<br>• Themes of SAP GUI Window<br>• Elements of SAP GUI Window</p><p>• Menu Bar and Details<br>• Standard Tool Bar and Details<br>• Tile Bar and Details<br>• Screen Area and Elements<br>• Status Bar and Details</p><p>• SAP Easy Access<br>• Working with Sessions<br>• Demo on SAP System Logon and Logoff<br>• Demo on SAP GUI Window Components<br>• Demo on working with sessions<br>• Demo on elements of SAP GUI window screen area<br>• Demo on User Default Settings<br>• Demo on adding Favorites<br>• Assessment on SAP GUI Introduction<br><br><strong>2. ABAP Programming Development Environment and Tools</strong><br>• SAP System Architecture<br>• System Landscape<br>• SAP NetWeaver Application Server for ABAP<br>• ABAP language and Features<br>• ABAP Development Environment<br>• ABAP Workbench<br>• ABAP Workbench Tools<br>• Object Navigator-Use and Demo on Navigation<br>• Development Objects<br>• Package</p><p>• Transport Organizer<br>• Assessment on Introduction to ABAP Programming Language<br><br><strong>3. ABAP Dictionary (SE11)</strong><br>• Data Model Concept<br>• Data Model of Flight Booking system application<br>• Database Concept<br>• ABAP Dictionary and features<br>• ABAP Dictionary Objects<br>• ABAP Dictionary-Built-In Data Types<br>• Domains Concept, Use, Exploration, Demo and Exercise<br>• ABAP Dictionary Data Types<br>• Data Elements Concept, Use, Exploration, Demo and exercise<br>• Tables- Concept, Use, Exploration, Demo and exercise<br>• Views Concept, Use, Exploration, Demo and exercise<br>• Structures Concept, Use, Exploration, Demo and exercise<br>• Table Types Concept, Use, Exploration, Demo and exercise<br>• Search Helps Concept, Use, Exploration, Demo and exercise<br>• Lock Objects Concept, Use, Exploration, Demo and exercise<br><br><br><strong>4.Basic ABAP Programming Concepts</strong><br>• Introduction to ABAP Editor (SE38)<br>• Program and Memory Allocation<br>• Data Types-Concept, Use, Types, Built-in data types<br>• Data Objects-Concept, Use, Types, Built-in data objects<br>• TYPES Statement-Use, Syntax, Examples, Demo and Exercise<br>• DATA statement-Use, Syntax, Examples, Demo and Exercise<br>• CONSTANTS statement-Use, Syntax, Examples, Demo and Exercise<br>• REPORT Statement-Use, Syntax, Examples, Demo and Exercise<br>• Assignment Operator (=)-Use, Syntax, Examples, Demo and Exercise<br>• WRITE statement-Use, Syntax, Examples, Demo and Exercise<br>• Filling Data Objects-Concept<br>• APPEND statement-Use, Syntax, Examples, Demo and Exercise<br>• LOOP AT statement-Use, Syntax, Examples, Demo and Exercise<br>• READ TABLE statement-Use, Syntax, Examples, Demo and Exercise<br>• SORT statement-Use, Syntax, Examples, Demo and Exercise<br>• CLEAR, REFRESH, FREE statements-Use, Syntax, Examples, Demo and Exercise<br>• INSERT statement-Use, Syntax, Examples, Demo and Exercise<br>• MODIFY statement-Use, Syntax, Examples, Demo and Exercise<br>• DELETE Statement-Use, Syntax, Examples, Demo and Exercise<br>• DELETE ADJACENT DUPLICATES statement-Use, Syntax, Examples, Demo and Exercise<br>• IF..ENDIF Statement-Use, Syntax, Examples, Demo and Exercise<br>• CASE..ENDCASE statement–Use, Syntax, Examples, Demo and Exercise<br>• CONCATENATE, CONDENSE, SPLIT statements-Use, Syntax, Examples, Demo and Exercise<br>• Off-Set Statement-Use, Syntax, Example, Demo and Exercise<br>• FIELD-SYMBOLS-Use, Syntax, Examples, Demo and Exercise<br>• SY-TABIX, SY-INDEX, SY-SUBRC- Use, example, Demo and Exercise<br>• WHERE condition- Use, Syntax, example, demo and Exercise<br>• Demo and Exercise on joining internal tables into one internal table<br>• Assessment on Basic ABAP Programming concepts<br><br><strong>5.ABAP Programs and Messages</strong><br>• Messages concept, use and types<br>• Message Class Introduction<br>• Demo on Creating messages in message class<br>• Exercise on creating messages in message class<br>• Demo on using messages in message class in a program<br>• Exercise on using messages in message class in a program</p><p><strong>6. ABAP Programs and Text Symbols</strong><br>• Text Symbols Concept and Use<br>• Demo on creating text symbols and usage in a program<br>• Exercise on creating text symbols and usage in a program</p><p><strong>7.ABAP Programs and Events</strong><br>• Events concept and use<br>• Events for Selection Screen<br>• Events for Executable Program<br>• Events for Module Pool Programming</p><p><strong>8.ABAP Programs and Selection Screen</strong><br>• Introduction to Selection Screen and use<br>• Building blocks of selection screen elements<br>• Designing the selection screen<br>• Demo on selection screen design<br>• Exercise on selection screen design</p><p><strong>9.ABAP Programming and Database Queries</strong><br>• Database Concept and Use<br>• Introduction to data model<br>• Relation data model concept<br>• Example of a table relations in SD, MM module<br>• Joins<br>• OPEN SQL Introduction<br>• Difference between OPEN SQL and NATIVE SQL<br>• SELECT Statement<br>• MODIFY statement<br>• INSERT statement<br>• DELETE statement</p><p><strong>10.Subroutines</strong><br>• Subroutines Concept, Use and Syntax<br>• Building blocks of subroutines<br>• Exploring subroutines in an existing program<br>• Demo on Defining and Calling subroutines in a program<br>• Exercise on defining and calling subroutines in a program<br>• Assessment on subroutines<br><br><strong>11.Function Groups and Function Modules</strong><br>• Introduction to Function Builder and Features<br>• Function Groups concept and use<br>• Components of Function Group<br>• Function Module concept and use<br>• Exploring function groups and function modules<br>• Demo on Creating Function Groups<br>• Demo Creating Function Modules<br>• Demo Calling Function modules in a program<br>• Calling Existing function modules in a program<br>• Exercise on creating function groups and function modules<br>• Assessment on Function Groups and Function Modules</p><p><strong>12.Classes and Interfaces</strong><br>• ABAP Objects Concept<br>• Introduction to Class Builder (SE24)<br>• Exploring Standard Global Classes and Interfaces<br>• Exploring components of Classes<br>• Demo on Calling methods of a standard classes in a program<br>• Exercise on Calling methods of a standard class in a program<br>• Assessment on Classes and Interfaces</p><p><strong>13.Include Program</strong><br>• Include Programs concept and use<br>• Exploring include program in a standard program<br>• Demo on Creating include programs<br>• Exercise on Creating include programs<br>• Assessment on Include Programs</p><p><strong>14.ABAP Programming Tools</strong><br>• ABAP Debugger-Use, Features<br>• ABAP Debugger Demo and Exercise<br>• ABAP Runtime Analysis (ST22)</p><p><strong>15.RICEF Development Concept</strong></p><p><strong>16.Reports development building blocks</strong><br>• Concept of Reports and use case<br>• Building blocks of Report program<br>• Introduction to ABAP List Viewer (ALV) Concept, use and Types of ALV<br>• Flow Diagram/Structure of a Report Program<br>• Demo on Creating a Report using ALV Function Modules<br>• Exercise on Creating a Report using ALV Function Modules<br>• Demo on Creating a Report program using Classes<br>• Exercise Demo on Creating a Report program using Classes<br>• Assessment on Reports<br><br><strong>17.Module Pool program development building blocks</strong><br>• Concept of Module Pool Programming and use<br>• Building blocks of module pool programs<br>• Introduction to Screen Painter<br>• Demo on creating a screen<br>• Exercise on creating a screen<br>• Introduction to Menu painter<br>• Demo on creating a GUI Status<br>• Exercise on creating a GUI Status<br>• Demo Creating Module Pool Program<br>• Exercise on creating a Module Pool Program<br>• Creating a custom table and inserting entries in that table<br>• Demo-Selecting records from a custom table<br>• Demo-Creating a lock objects and use in a program<br>• Demo-Modifying records in custom table<br>• Demo-Deleting records from a custom table<br>• Why database tables are updated through a application<br>• Assessment on Module Pool programming</p><p><strong>18. Interfaces development building blocks</strong><br>• Concept of Interfaces, use and types<br>• Building blocks of File Interfaces, types and use<br>• Demo on outbound file interface<br>• Exercise on outbound file interface<br>• Demo on inbound file interface<br>• Exercise on inbound file interface<br>• Concept of ALE-IDOC, use, tools<br>• Building blocks of ALE-IDOC<br>• Demo Outbound ALE-IDOC Interface<br>• Exercise on Outbound ALE-IDOC Interface<br>• Demo Inbound ALE-IDOC Interface<br>• Exercise on Inbound ALE-IDOC Interface<br>• Assessment on Interfaces<br><br><strong>19.Conversions development building blocks</strong><br>• Concept of Conversions, use and types<br>• Structure of conversions/flow<br>• Building blocks of Session Method<br>• Demo on session method<br>• Exercise on session method<br>• Building blocks of Call Transaction Method<br>• Demo on call transaction method<br>• Exercise on call transaction method<br>• Assessment on Conversions</p><p><strong>20.Enhancements development building blocks</strong><br>• Concept of Enhancements, use and types<br>• Enhancement vs Modifications<br>• Structure/flow on enhancement developments<br>• User Exit- Concept, use<br>• Building blocks of user exits<br>• Demo on user exits<br>• Exercise on user exists<br>• Customer Exit-Concept, use<br>• Building blocks of customer exits<br>• Demo in customer exits<br>• Exercise on customer exits<br>• Screen Exit- Concept, use<br>• Building blocks of screen exit<br>• Demo on Screen exit<br>• Exercise on screen exit<br>• Business-Addin (BADI)-Concept, use, types<br>• Building blocks of BADI<br>• Demo on BADI<br>• Exercise on BADI<br>• Concept of Enhancement Spot, use<br>• Concept of Enhancement-Points, use, types<br>• Demo on implicit enhancement point<br>• Exercise on implicit enhancement point<br>• Assessment on Enhancements<br><br><strong>21.Forms development building blocks</strong><br>• Forms Concept, use and types<br>• Building blocks of SAP Scripts<br>• Smartforms-Concept, use<br>• Building blocks of Smartforms<br>• Demo on Creating Smartforms<br>• Exercise on creating Smartforms<br>• Demo on calling Smartforms from a custom program<br>• Exercise on calling a smartform from a custom program<br>• Demo on calling a smartform from a standard transaction<br>• Exercise on calling a smartform from a standard transaction<br>• Assessment on Forms</p><p><strong>22.Other Topics</strong><br>• Variants of a Program<br>• Background Process in ABAP<br><br>&nbsp;</p>', NULL, NULL, 4, 8, NULL, 'SAP Advanced Business Application Programming', 'SAP Advanced Business Application Programming', 'SAP Advanced Business Application Programming', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, '2026-04-10 10:32:13', '2026-04-10 10:32:13'),
(13, 'Authorization Concept for SAP S/4HANA and SAP Business Suite', 'authorization-concept-for-sap-s4hana-and-sap-business-suite', '<p><strong>Authorizations in General</strong></p><p>&nbsp; &nbsp;What Are Authorizations<br>&nbsp; &nbsp;Creating and Implementing an Authorization Concept</p><p><strong>Basic Terminology of Authorizations</strong></p><p>&nbsp; &nbsp;Elements and Terminology of the Authorization Concept (AS ABAP)<br>&nbsp; &nbsp;Authorization Checks in the SAP System</p><p><strong>User Maintenance</strong></p><p>&nbsp; &nbsp;Maintaining and Evaluating User Data<br>&nbsp; &nbsp;Business User Concept</p><p><strong>Working with the Role Maintenance</strong></p><p>&nbsp; &nbsp;Role Maintenance and Standard Roles<br>&nbsp; &nbsp;Special ABAP Roles<br>&nbsp; &nbsp;Subtleties of Authorization Maintenance</p><p><strong>Basic Settings</strong></p><p>&nbsp; &nbsp;Role Maintenance: Installation and Upgrade<br>&nbsp; &nbsp;Access Control and User Administration</p><p><strong>Using Traces</strong></p><p>&nbsp; &nbsp;Troubleshooting and Administration Aids<br>&nbsp; &nbsp;Using Trace Evaluation to maintain Menus and Authorizations</p><p><strong>Transporting Authorizations</strong></p><p>&nbsp; &nbsp;Transporting Authorization Components</p><p><strong>Integration into the Company Landscape</strong></p><p>&nbsp; &nbsp;Central User Administration (CUA)</p>', NULL, NULL, 4, 9, NULL, 'Authorization Concept for SAP S/4HANA and SAP Business Suite', 'Authorization Concept for SAP S/4HANA and SAP Business Suite', 'Authorization Concept for SAP S/4HANA and SAP Business Suite', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, '2026-04-10 10:34:06', '2026-04-10 10:34:06'),
(14, 'SAP Access Control Implementation and Configuration', 'sap-access-control-implementation-and-configuration', '<p><strong>Introduction to Access Governance using SAP Access Control</strong></p><p>&nbsp; &nbsp;Business Challenges and Solutions<br>&nbsp; &nbsp;SAP Access Control Functionality and Integration Scenarios</p><p><strong>Identification and Management of Access Risk</strong></p><p>&nbsp; &nbsp;Identifying Access Risks<br>&nbsp; &nbsp;The Access Risk Management Process</p><p><strong>User Experience, Security Concepts and System Architecture</strong></p><p>&nbsp; &nbsp;User Access and the User Experience<br>&nbsp; &nbsp;User Access using the SAP Business Client<br>&nbsp; &nbsp;User Access using SAP Fiori Launchpad<br>&nbsp; &nbsp;SAP Access Control System Architecture</p><p><strong>Configuration Overview</strong></p><p>&nbsp; &nbsp;Shared SAP GRC Settings<br>&nbsp; &nbsp;SAP Access Control Specific Settings<br>&nbsp; &nbsp;SAP Access Control Business Configuration (BC) Set Overview<br>&nbsp; &nbsp;Managing the Access Control Repository</p><p><strong>Risk Analysis</strong></p><p>&nbsp; &nbsp;Maintaining Master Data and Access Control Owners<br>&nbsp; &nbsp;Risk Recognition<br>&nbsp; &nbsp;Rule Building and Validation<br>&nbsp; &nbsp;Access Risk Analysis<br>&nbsp; &nbsp;Risk Remediation<br>&nbsp; &nbsp;Risk Mitigation<br>&nbsp; &nbsp;Continuous Compliance<br>&nbsp; &nbsp;Appendix: (Optional) Access Risk Analysis Parameter Configuration</p><p><strong>SAP Business Rule Framework (BRFplus)</strong></p><p>&nbsp; &nbsp;Introduction to Business Rules and Business Rule Management Systems<br>&nbsp; &nbsp;Defining MSMP Workflow-Related Rules using SAP Business Rule Framework BRFplus<br>&nbsp; &nbsp;Configuration and Maintenance of MSMP Workflow-Related Rules</p><p><strong>Multi-Stage, Multi-Path (MSMP) Workflow</strong></p><p>&nbsp; &nbsp;Introducing Multi-Stage, Multi-Path (MSMP) Workflow<br>&nbsp; &nbsp;Implementing Multi-Stage, Multi-Path (MSMP) Workflow</p><p><strong>User Provisioning</strong></p><p>&nbsp; &nbsp;Configuring User Provisioning Settings<br>&nbsp; &nbsp;Configuring Access Request Forms<br>&nbsp; &nbsp;Preparing Roles and Owner Data for MSMP Workflow<br>&nbsp; &nbsp;Requesting Access<br>&nbsp; &nbsp;Reviewing Search Request Results<br>&nbsp; &nbsp;Appendix: (Optional) User Provisioning Parameter Settings</p><p><strong>Role Design and Management</strong></p><p>&nbsp; &nbsp;Configuring Role Management<br>&nbsp; &nbsp;Configuring Role Methodology<br>&nbsp; &nbsp;Configuring Role Search Attributes<br>&nbsp; &nbsp;Planning for Technical Role Definition<br>&nbsp; &nbsp;Planning for Business Role Definition<br>&nbsp; &nbsp;Consolidating Roles Through Role Mining<br>&nbsp; &nbsp;Performing Role Mass Maintenance Operations<br>&nbsp; &nbsp;Appendix (Optional) Evaluate Parameters for Role Management</p><p><strong>Emergency Access Management</strong></p><p>&nbsp; &nbsp;Describing Emergency Access Management<br>&nbsp; &nbsp;Planning for Emergency Access Management<br>&nbsp; &nbsp;Monitoring Emergency Access<br>&nbsp; &nbsp;Appendix (Optional) Evaluate Parameters for Emergency Access Management</p><p><strong>Periodic Access Review Process</strong></p><p>&nbsp; &nbsp;Planning Periodic Review<br>&nbsp; &nbsp;Monitoring Periodic Review<br>&nbsp; &nbsp;Appendix (Optional) Evaluate Parameters for Periodic Access Review</p><p><strong>Appendix (Optional) Maintaining Custom Fields</strong></p><p>&nbsp; &nbsp;Maintaining Custom Fields</p>', NULL, NULL, 4, 10, NULL, 'SAP Access Control Implementation and Configuration', 'SAP Access Control Implementation and Configuration', 'SAP Access Control Implementation and Configuration', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, '2026-04-10 10:35:52', '2026-04-10 10:35:52'),
(15, 'System Administration I of SAP S/4HANA and SAP Business Suite', 'system-administration-i-of-sap-s4hana-and-sap-business-suite', '<p><strong>Fundamentals of Application Server ABAP</strong><br><br><strong>Starting and Stopping Application Server ABAP</strong></p><p>&nbsp; &nbsp;Concept and tools</p><p><strong>System Configuration</strong></p><p>&nbsp; &nbsp;Profile parameters, operation modes, task lists</p><p><strong>Introduction to Database Administration</strong></p><p>&nbsp; &nbsp;Basic database administration tasks</p><p><strong>Users and Authorizations</strong></p><p>&nbsp; &nbsp;AS ABAP user administration and authorization concept</p><p><strong>RFC Communication</strong></p><p>&nbsp; &nbsp;RFC connections</p><p><strong>Maintaining SAP Software</strong></p><p>&nbsp; &nbsp;SAP Notes and SAP Support Packages</p><p><strong>Printing</strong></p><p>&nbsp; &nbsp;AS ABAP printing concept<br>&nbsp; &nbsp;Configuration, monitoring and housekeeping</p><p><strong>Background Processing</strong></p><p>&nbsp; &nbsp;Configuration and monitoring</p><p><strong>System Monitoring and Troubleshooting</strong></p><p>&nbsp; &nbsp;Local monitoring architecture<br>&nbsp; &nbsp;Monitoring concept with SAP Solution Manager</p>', NULL, NULL, 4, 11, NULL, 'System Administration I of SAP S/4HANA and SAP Business Suite', 'System Administration I of SAP S/4HANA and SAP Business Suite', 'System Administration I of SAP S/4HANA and SAP Business Suite', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, '2026-04-10 10:44:31', '2026-04-10 10:44:31'),
(16, 'SAP Analytics Cloud (SAC)', 'sap-analytics-cloud-sac', '<p><strong>UNIT-1: Overview and Positioning</strong></p><p>&nbsp; &nbsp;Analytics Cloud Architecture Overview<br>&nbsp; &nbsp;SAC vs other BI tools<br>&nbsp; &nbsp;Benefits and core functionalities of SAC<br>&nbsp; &nbsp;Cloud vs On-Premise vs Hybrid<br>&nbsp; &nbsp;Analytics Cloud Client tools and Importance</p><p><strong>UNIT-2: Modelling</strong></p><p>&nbsp; &nbsp;What is MODEL<br>&nbsp; &nbsp;Components of MODEL<br>&nbsp; &nbsp;Working with Dimension and Classification<br>&nbsp; &nbsp;Configuring Geo-Dimension<br>&nbsp; &nbsp;Working with Measures<br>&nbsp; &nbsp;Working with Transformations<br>&nbsp; &nbsp;Working with Variables<br>&nbsp; &nbsp;Data Blending</p><p><strong>UNIT-3: Business Intelligence</strong></p><p>&nbsp; &nbsp;Designing SAC Stories<br>&nbsp; &nbsp;Working with Custom Templates<br>&nbsp; &nbsp;Working with Standard Templates<br>&nbsp; &nbsp;Working with Canvas-Responsive and Grid modes<br>&nbsp; &nbsp;Working with Designer (Builder panel, Styling Panel)<br>&nbsp; &nbsp;Filters in SAC<br>&nbsp; &nbsp;Query level filters<br>&nbsp; &nbsp;Story level filters<br>&nbsp; &nbsp;Page-level filters<br>&nbsp; &nbsp;Widget level filters<br>&nbsp; &nbsp;Advanced Filters<br>&nbsp; &nbsp;Linked Analysis<br>&nbsp; &nbsp;Hyperlinking<br>&nbsp; &nbsp;Conditional Formatting<br>&nbsp; &nbsp;Customizing Measures<br>&nbsp; &nbsp;Customizing Dimensions<br>&nbsp; &nbsp;Data blending<br>&nbsp; &nbsp;Working with Chart widget<br>&nbsp; &nbsp;Working with a Table widget<br>&nbsp; &nbsp;Working with Geo Map widget<br>&nbsp; &nbsp;R language basics<br>&nbsp; &nbsp;Generating R based Stories<br>&nbsp; &nbsp;Import data connection from Google drive</p><p><strong>UNIT-4 Augmented Analytics</strong></p><p>&nbsp; &nbsp;What is Augmented Analytics<br>&nbsp; &nbsp;Smart Search<br>&nbsp; &nbsp;Smart Discovery<br>&nbsp; &nbsp;Smart Insights</p><p><strong>UNIT-5: Planning with SAC</strong></p><p>&nbsp; &nbsp;How to develop planning data models in SAC<br>&nbsp; &nbsp;Understand measures, accounts, hierarchies, currency conversion<br>&nbsp; &nbsp;Manage versions of planning<br>&nbsp; &nbsp;Create planning stories<br>&nbsp; &nbsp;Planning functions – variance, forecast, version management<br>&nbsp; &nbsp;What if analysis<br>&nbsp; &nbsp;Allocations<br>&nbsp; &nbsp;Spreading and Distributions<br>&nbsp; &nbsp;Value Driver Tree- VDT<br>&nbsp; &nbsp;Data actions and insights<br>&nbsp; &nbsp;Live Data connection to BPC system<br>&nbsp; &nbsp;Collaboration</p><p><strong>UNIT-6: Analytics Designer</strong></p><p>&nbsp; &nbsp;What is Analytics Designer<br>&nbsp; &nbsp;Difference between SAC Stories vs Analytics Designer<br>&nbsp; &nbsp;Analytics Designer overview and walkthrough<br>&nbsp; &nbsp;Outline, Designer, Error, and reference panels<br>&nbsp; &nbsp;Design mode vs Run mode vs View mode<br>&nbsp; &nbsp;Designing basic Analytic application<br>&nbsp; &nbsp;Working with Container widgets<br>&nbsp; &nbsp;Implementing filters<br>&nbsp; &nbsp;Working with Drop-down, Radio button, Checkbox components<br>&nbsp; &nbsp;Working with script variables<br>&nbsp; &nbsp;Working with script objects<br>&nbsp; &nbsp;Configuring and implementing Dynamic Visibility<br>&nbsp; &nbsp;Implementing Hyperlinking and Explorer option<br>&nbsp; &nbsp;Using APIs to integration with Smart discovery, smart insights<br>&nbsp; &nbsp;Embedding the webpages inside the Analytic designer<br>&nbsp; &nbsp;Embedding SAC app inside other webpages<br>&nbsp; &nbsp;Live Data connection to Application Program ON HDB for integration<br>&nbsp; &nbsp;Close loop scenarios with OData Integration</p><p><strong>UNIT-7: Predictive Scenario</strong></p><p>&nbsp; &nbsp;Predictive scenario overview<br>&nbsp; &nbsp;SAC Stories vs SAC Applications vs SAC Predictive<br>&nbsp; &nbsp;Working with Datasets, Variables<br>&nbsp; &nbsp;Understand Regression<br>&nbsp; &nbsp;Understand Logistic Regression, RoC Curves, AUC Curve<br>&nbsp; &nbsp;Model performance and Confusion Matrix<br>&nbsp; &nbsp;Profit Simulation for Classification<br>&nbsp; &nbsp;Implementing Classification Precative Model<br>&nbsp; &nbsp;Implementing Regression Predictive Model<br>&nbsp; &nbsp;Residual and MAPE Concept in Regression<br>&nbsp; &nbsp;Trend, Cycle, Residual and Variations concepts<br>&nbsp; &nbsp;Implementing a Time series Predictive Model<br>&nbsp; &nbsp;Generating predictive stories</p><p><strong>UNIT-8: Administration</strong></p><p>&nbsp; &nbsp;SAC Administration Overview<br>&nbsp; &nbsp;Roles (Standard vs Custom)<br>&nbsp; &nbsp;Team<br>&nbsp; &nbsp;Users<br>&nbsp; &nbsp;Working with data loading and scheduling<br>&nbsp; &nbsp;Cloud connector<br>&nbsp; &nbsp;Analytics Cloud Agent</p><p><strong>UNIT-9: SAC Roadmap and Certification</strong></p>', NULL, NULL, 4, 12, NULL, 'SAP Analytics Cloud (SAC)', 'SAP Analytics Cloud (SAC)', 'SAP Analytics Cloud (SAC)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, '2026-04-10 10:48:25', '2026-04-10 10:48:25'),
(17, 'SAP Access Control Implementation and Configuration', 'sap-access-control-implementation-and-configuration', '<p><strong>Introduction to Access Governance using SAP Access Control</strong></p><p>&nbsp; &nbsp;Business Challenges and Solutions<br>&nbsp; &nbsp;SAP Access Control Functionality and Integration Scenarios</p><p><strong>Identification and Management of Access Risk</strong></p><p>&nbsp; &nbsp;Identifying Access Risks<br>&nbsp; &nbsp;The Access Risk Management Process</p><p><strong>User Experience, Security Concepts and System Architecture</strong></p><p>&nbsp; &nbsp;User Access and the User Experience<br>&nbsp; &nbsp;User Access using the SAP Business Client<br>&nbsp; &nbsp;User Access using SAP Fiori Launchpad<br>&nbsp; &nbsp;SAP Access Control System Architecture</p><p><strong>Configuration Overview</strong></p><p>&nbsp; &nbsp;Shared SAP GRC Settings<br>&nbsp; &nbsp;SAP Access Control Specific Settings<br>&nbsp; &nbsp;SAP Access Control Business Configuration (BC) Set Overview<br>&nbsp; &nbsp;Managing the Access Control Repository</p><p><strong>Risk Analysis</strong></p><p>&nbsp; &nbsp;Maintaining Master Data and Access Control Owners<br>&nbsp; &nbsp;Risk Recognition<br>&nbsp; &nbsp;Rule Building and Validation<br>&nbsp; &nbsp;Access Risk Analysis<br>&nbsp; &nbsp;Risk Remediation<br>&nbsp; &nbsp;Risk Mitigation<br>&nbsp; &nbsp;Continuous Compliance<br>&nbsp; &nbsp;Appendix: (Optional) Access Risk Analysis Parameter Configuration</p><p><strong>SAP Business Rule Framework (BRFplus)</strong></p><p>&nbsp; &nbsp;Introduction to Business Rules and Business Rule Management Systems<br>&nbsp; &nbsp;Defining MSMP Workflow-Related Rules using SAP Business Rule Framework BRFplus<br>&nbsp; &nbsp;Configuration and Maintenance of MSMP Workflow-Related Rules</p><p><strong>Multi-Stage, Multi-Path (MSMP) Workflow</strong></p><p>&nbsp; &nbsp;Introducing Multi-Stage, Multi-Path (MSMP) Workflow<br>&nbsp; &nbsp;Implementing Multi-Stage, Multi-Path (MSMP) Workflow</p><p><strong>User Provisioning</strong></p><p>&nbsp; &nbsp;Configuring User Provisioning Settings<br>&nbsp; &nbsp;Configuring Access Request Forms<br>&nbsp; &nbsp;Preparing Roles and Owner Data for MSMP Workflow<br>&nbsp; &nbsp;Requesting Access<br>&nbsp; &nbsp;Reviewing Search Request Results<br>&nbsp; &nbsp;Appendix: (Optional) User Provisioning Parameter Settings</p><p><strong>Role Design and Management</strong></p><p>&nbsp; &nbsp;Configuring Role Management<br>&nbsp; &nbsp;Configuring Role Methodology<br>&nbsp; &nbsp;Configuring Role Search Attributes<br>&nbsp; &nbsp;Planning for Technical Role Definition<br>&nbsp; &nbsp;Planning for Business Role Definition<br>&nbsp; &nbsp;Consolidating Roles Through Role Mining<br>&nbsp; &nbsp;Performing Role Mass Maintenance Operations<br>&nbsp; &nbsp;Appendix (Optional) Evaluate Parameters for Role Management</p><p><strong>Emergency Access Management</strong></p><p>&nbsp; &nbsp;Describing Emergency Access Management<br>&nbsp; &nbsp;Planning for Emergency Access Management<br>&nbsp; &nbsp;Monitoring Emergency Access<br>&nbsp; &nbsp;Appendix (Optional) Evaluate Parameters for Emergency Access Management</p><p><strong>Periodic Access Review Process</strong></p><p>&nbsp; &nbsp;Planning Periodic Review<br>&nbsp; &nbsp;Monitoring Periodic Review<br>&nbsp; &nbsp;Appendix (Optional) Evaluate Parameters for Periodic Access Review</p><p><strong>Appendix (Optional) Maintaining Custom Fields</strong></p><p>&nbsp; &nbsp;Maintaining Custom Fields</p>', NULL, NULL, 4, 23, NULL, 'SAP Access Control Implementation and Configuration', 'SAP Access Control Implementation and Configuration', 'SAP Access Control Implementation and Configuration', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, '2026-04-10 10:51:03', '2026-04-10 10:51:03');

-- --------------------------------------------------------

--
-- Table structure for table `product_attribue`
--

CREATE TABLE `product_attribue` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `attributeName` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `sellingPrice` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_img_history`
--

CREATE TABLE `product_img_history` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `gallery_image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_inventory`
--

CREATE TABLE `product_inventory` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `attribute_variation` varchar(255) DEFAULT NULL,
  `qty_in` int(11) NOT NULL,
  `stock_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_inventory`
--

INSERT INTO `product_inventory` (`id`, `user_id`, `product_id`, `attribute_variation`, `qty_in`, `stock_date`, `created_at`, `updated_at`) VALUES
(1, 1, 3, NULL, 0, '2026-04-09', '2026-04-09 11:49:38', '2026-04-09 11:49:38'),
(2, 1, 4, NULL, 0, '2026-04-09', '2026-04-09 12:11:17', '2026-04-09 12:11:17'),
(3, 1, 7, NULL, 0, '2026-04-09', '2026-04-09 12:22:23', '2026-04-09 12:22:23'),
(4, 1, 6, NULL, 0, '2026-04-09', '2026-04-09 12:22:39', '2026-04-09 12:22:39'),
(5, 1, 5, NULL, 0, '2026-04-09', '2026-04-09 12:23:21', '2026-04-09 12:23:21'),
(6, 1, 8, NULL, 0, '2026-04-10', '2026-04-09 22:10:03', '2026-04-09 22:10:03'),
(7, 1, 9, NULL, 0, '2026-04-10', '2026-04-09 22:19:10', '2026-04-09 22:19:10'),
(8, 1, 10, NULL, 0, '2026-04-10', '2026-04-09 22:20:46', '2026-04-09 22:20:46'),
(9, 1, 11, NULL, 0, '2026-04-10', '2026-04-09 22:22:40', '2026-04-09 22:22:40');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_invoice`
--

CREATE TABLE `purchase_order_invoice` (
  `purchase_order_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `attribute` text DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_particular`
--

CREATE TABLE `purchase_order_particular` (
  `id` int(11) NOT NULL,
  `supplier_id` varchar(255) NOT NULL,
  `invNumber` varchar(255) DEFAULT NULL,
  `orderDate` date NOT NULL,
  `grandTotal` decimal(10,2) NOT NULL,
  `transfer_status` int(10) NOT NULL DEFAULT 0 COMMENT '1=Transfer\r\n0=Not transfer',
  `billingAddress` varchar(255) DEFAULT NULL,
  `shippingAddress` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `role_type` int(11) NOT NULL COMMENT '1=admin,\r\n2=Editor,\r\n3=Viewer,\r\n4=General Post\r\n5=Product Manage\r\n6=User Manage\r\n\r\n\r\n',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `role_type`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'api', 1, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(2, 'editor', 'api', 2, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(3, 'viewer', 'api', 3, '2025-10-09 10:09:35', '2025-10-09 10:09:35');

-- --------------------------------------------------------

--
-- Table structure for table `roles_type`
--

CREATE TABLE `roles_type` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `roles_type`
--

INSERT INTO `roles_type` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'api', '2023-01-08 12:10:18', '2023-01-08 12:10:18'),
(2, 'Editor', 'api', '2023-01-23 14:58:53', '2023-01-23 14:58:53'),
(3, 'Viewer', 'api', '2023-01-23 15:01:22', '2023-01-23 15:01:22'),
(4, 'Customer', 'api', '2023-01-23 15:01:22', '2023-01-23 15:01:22');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(3, 1),
(3, 2),
(5, 1),
(5, 2),
(5, 3),
(6, 1),
(6, 2),
(7, 1),
(7, 2),
(9, 1),
(9, 2),
(9, 3),
(10, 1),
(10, 2),
(11, 1),
(11, 2),
(14, 1),
(14, 2),
(15, 1),
(15, 2),
(16, 1),
(16, 2),
(22, 1),
(22, 2),
(23, 2),
(24, 1),
(24, 2),
(33, 1),
(34, 1),
(35, 1),
(38, 1),
(39, 1),
(40, 1),
(43, 1),
(44, 1),
(45, 1),
(46, 1),
(48, 1),
(49, 1),
(50, 1),
(53, 1),
(54, 1),
(55, 1),
(58, 1),
(59, 1),
(60, 1),
(63, 1),
(64, 1),
(65, 1),
(68, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('7gLI2NsTYyrItp6jrcPZ7INlkuWggKGruhWQOnQe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV0lUYkVIMjhSQjNtQ0twdGd1UUxseHFITGlYU2FHbDBDcHFIRHIzOCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775820575),
('9Cpwce3ti1QKJIbzG3sQso7sCvy7VhUnzgeNPThY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicGdPTXgwNDVLYVBEOVJFelVmZXFNSHZNQjVYQWdqSXJkRkd6WnlpOSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775820766),
('IcVlHXMN1dPOZ3GFY1pOjW2dMND1db7SgZmZVvu7', NULL, '134.122.85.182', 'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ05TanVBQUNPbUdOSFZWNFNKSDRYWUcwMjh3YWY1Nk91NmtZM3lCTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzk6Imh0dHBzOi8vd3d3LmFwaWJpcmdyb3VwLmZ1dHVyZWdlbml0LmNvbSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1768997359),
('L70t18Lk30ffJZAiNNurCgfRuLmV8eMNQn9yGJJe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibG5iSVJzTHlqaFdYU3RBSXFZbmdXRjRQYXg5RDQ1WXFpc2gwT0RiQyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1775820643),
('MzTCD7DLPdWWrcaUHlPtZyY1uDNsQCrUVoItU0tE', NULL, '45.250.23.12', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVnJlQXRJOFF4ZUhJRXpTbzNtT1RoTFc3aHdUbnR6SXpNaDRDQVQ4SiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJuZXciO2E6MDp7fXM6Mzoib2xkIjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHBzOi8vYXBpYmlyZ3JvdXAuZnV0dXJlZ2VuaXQuY29tIjt9fQ==', 1768999565);

-- --------------------------------------------------------

--
-- Table structure for table `setting`
--

CREATE TABLE `setting` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` mediumtext NOT NULL,
  `whatsApp` varchar(255) NOT NULL,
  `bkash_number` varchar(255) DEFAULT NULL,
  `emergency` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `description` mediumtext NOT NULL,
  `copyright` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `admin_photo` varchar(244) NOT NULL,
  `admin_name` varchar(255) NOT NULL,
  `admin_email` varchar(255) NOT NULL,
  `admin_phone` varchar(255) NOT NULL,
  `meta_keywords` mediumtext DEFAULT NULL,
  `meta_description` mediumtext DEFAULT NULL,
  `pphoto` varchar(255) NOT NULL,
  `bg_color` varchar(255) DEFAULT NULL,
  `currency` varchar(150) DEFAULT NULL,
  `reffer_bonus` int(11) DEFAULT NULL,
  `fblink` varchar(255) DEFAULT NULL,
  `twitterlink` varchar(255) DEFAULT NULL,
  `linkdinlink` varchar(255) DEFAULT NULL,
  `instragramlink` varchar(255) DEFAULT NULL,
  `store_policy` longtext DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `telegram` varchar(255) DEFAULT NULL,
  `devliery_charge_inside_dhk` int(10) DEFAULT NULL,
  `devliery_charge_outside_dhk` int(10) DEFAULT NULL,
  `register_bonus` int(11) DEFAULT NULL,
  `promotional_banner` int(5) DEFAULT NULL COMMENT '1=show,0=hide',
  `level_1_bonus` int(11) DEFAULT NULL,
  `level_2_bonus` int(11) DEFAULT NULL,
  `level_3_bonus` int(11) DEFAULT NULL,
  `update_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `setting`
--

INSERT INTO `setting` (`id`, `name`, `tel`, `email`, `address`, `whatsApp`, `bkash_number`, `emergency`, `photo`, `description`, `copyright`, `status`, `admin_photo`, `admin_name`, `admin_email`, `admin_phone`, `meta_keywords`, `meta_description`, `pphoto`, `bg_color`, `currency`, `reffer_bonus`, `fblink`, `twitterlink`, `linkdinlink`, `instragramlink`, `store_policy`, `website`, `telegram`, `devliery_charge_inside_dhk`, `devliery_charge_outside_dhk`, `register_bonus`, `promotional_banner`, `level_1_bonus`, `level_2_bonus`, `level_3_bonus`, `update_by`, `created_at`, `updated_at`) VALUES
(1, 'Astute360corp', '+880 1301-047166', 'info@astute360corp.com', '6065 Hillcroft St, Suite 511, Houston, TX 77081.', '+1 (346) 328-3273', '01740586574', '+880 1301-047166', 'pic/2tAjiUpJ0X8GziIrKJJJ.png', 'Trusted IT Partner for Startups & Enterprises\nFounded in 2019, managed by professionals from an IT background with years of industry experience.\nWe offer technology consulting and staff augmentation services, with an operational presence in the United States. Our expertise spans across diverse IT domains, making us a preferred choice among several U.S.-based clients.', 'Copyright © 2026 astute360corp . All Rights Reserved', 1, 'pic/ZOdc8nsWAMY1YELkp9zH.jpg', 'admin', 'info@admin.com', '+44245454545', NULL, NULL, '', '#ffffff', '', 5, '#', 'https://www.facebook.com', 'https://web.whatsapp.com/', '#', '', '#', '#', 0, 0, 5, 1, 0, 0, 0, NULL, '2024-05-12 05:32:50', '2026-04-10 09:40:39');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'BMI', 1, '2025-11-03 00:09:06', '2025-12-10 08:03:01'),
(2, 'KGI HARDWARE ACCESSORIES LTD.', 1, '2025-11-03 00:09:16', '2025-11-03 00:09:16'),
(3, 'Bir Tools', 1, '2025-11-03 00:09:30', '2025-12-07 08:58:04'),
(4, 'Bir Consumer', 1, '2025-11-03 00:09:49', '2025-12-10 07:46:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role_type` int(11) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role_type`, `email_verified_at`, `password`, `phone_number`, `address`, `facebook`, `website`, `github`, `twitter`, `instagram`, `status`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'bijon', 'mdbijon@gmail.com', NULL, NULL, '$2y$10$EkK.1bkHaG/kyXr6rUURPO5WJMzk10iLXQnHuxWqiu6CzurydqyMG', '01915728982', 'DHK', 'https://www.facebook.com/watch/?ref=tab', '', '', '', '', 1, NULL, '2025-10-09 10:28:23', '2025-10-10 10:36:15'),
(2, 'editor', 'editor@gmail.com', NULL, NULL, '$2y$12$kcRYrErMlXw1PxXC/B3wd.5WCf0Nwbo1fLFWmhsxM/mOfLCdJvI3q', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-10-09 11:02:48', '2025-10-09 11:02:48'),
(3, 'admin2', 'admin2@gmail.com', NULL, NULL, '$2y$12$z.nUwSbaASsmm3h2W3BJW.nw17cCDk6wd2F4Et9hIpomsg54NX/u2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-10-09 11:08:24', '2025-10-09 11:08:24'),
(4, 'Viewer', 'viewer@gmail.com', NULL, NULL, '$2y$12$wXWrf0u9FvaM.6x12P7FbuN0JYbVeR7/j1psZenKQWbx5HlOl6M5G', '000564578788', 'DHK', '', '', '', '', '', 1, NULL, '2025-10-09 14:39:31', '2025-10-11 09:20:17'),
(22, 'Joynal', 'joynal@gmail.com', 4, NULL, '$2y$12$nQ5CIq1SHCYlH9XHcRBM0.say.Rg3IWsnOxGGM.dRwKEoMeDsj.I2', '06569899898', 'Dhaka', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-11-30 09:35:12', '2025-11-30 09:35:12'),
(23, 'Jannat', 'jannat@gmail.com', 4, NULL, '$2y$12$0rxFFHOG/L3HnzgkYWCmO.TCCak29MclFJi4xl14U.X/Z7wVvssOK', '01915728983', 'Mirpur-1,Dhaka, Bangladesh,', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-12-05 00:11:08', '2025-12-05 00:11:08'),
(24, 'Bijon ahmed', 'bijonahmed@gmail.com', 4, NULL, '$2y$12$bKQRaAnr1NYjDLPg4p3Y4eecuzRRiNK220gldASqjP/qa9wEFKxhO', '01915728988', 'Mirpur, Dhaka-1203', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-12-05 05:33:06', '2025-12-05 05:33:06'),
(25, 'Ebim123', 'ebim123@gmail.com', 4, NULL, '$2y$12$j/koKPbPOR2vsyUn7hyfou9/n3DDTf9BJezCiIcZufKQLBj4VyNhi', '4556748578', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-12-12 07:38:25', '2025-12-12 07:38:25'),
(26, 'ayesha', 'ayesha@gmail.com', 4, NULL, '$2y$12$D.QBuqD.eMI55WyVe9c8Pu6UWvbbnA89tCV3G3AWUi8ryZQE8uGoy', '018748975454', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2025-12-12 07:40:05', '2025-12-12 07:40:05'),
(27, 'Max Miller', 'max@gmal.com', 4, NULL, '$2y$12$Ub.yx1VdKgecl.oZNmHlxuZNIECCpbJ7T7tFXykCkooaahoqfqUmy', '01875758578', 'Austria', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-01-17 00:09:42', '2026-01-17 00:09:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categorys`
--
ALTER TABLE `categorys`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderId` (`orderId`);

--
-- Indexes for table `order_history`
--
ALTER TABLE `order_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pathao_tokens`
--
ALTER TABLE `pathao_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post_category`
--
ALTER TABLE `post_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`);

--
-- Indexes for table `product_attribue`
--
ALTER TABLE `product_attribue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_img_history`
--
ALTER TABLE `product_img_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_inventory`
--
ALTER TABLE `product_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchase_order_invoice`
--
ALTER TABLE `purchase_order_invoice`
  ADD KEY `order_id` (`purchase_order_id`);

--
-- Indexes for table `purchase_order_particular`
--
ALTER TABLE `purchase_order_particular`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `roles_type`
--
ALTER TABLE `roles_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `setting`
--
ALTER TABLE `setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `categorys`
--
ALTER TABLE `categorys`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_history`
--
ALTER TABLE `order_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_status`
--
ALTER TABLE `order_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pathao_tokens`
--
ALTER TABLE `pathao_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `post_category`
--
ALTER TABLE `post_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `product_attribue`
--
ALTER TABLE `product_attribue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_img_history`
--
ALTER TABLE `product_img_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_inventory`
--
ALTER TABLE `product_inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `purchase_order_particular`
--
ALTER TABLE `purchase_order_particular`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles_type`
--
ALTER TABLE `roles_type`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `setting`
--
ALTER TABLE `setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_order_invoice`
--
ALTER TABLE `purchase_order_invoice`
  ADD CONSTRAINT `purchase_order_invoice_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_order_particular` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
