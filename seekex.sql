-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 16, 2022 at 03:29 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `seekex`
--

-- --------------------------------------------------------

--
-- Table structure for table `inbounds`
--

CREATE TABLE `inbounds` (
  `id` int(11) NOT NULL,
  `challan_no` varchar(200) NOT NULL,
  `stock` int(11) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '''0''=>''Inactive'', ''1''=>''Active''',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0' COMMENT '''0'' => ''Not Deleted'', ''1'' => ''Deleted''',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inbounds`
--

INSERT INTO `inbounds` (`id`, `challan_no`, `stock`, `status`, `is_deleted`, `createdAt`, `updateAt`) VALUES
(1, 'WR-809', 21, '1', '0', '2022-01-15 18:17:54', '2022-01-16 14:29:03');

-- --------------------------------------------------------

--
-- Table structure for table `inbound_products`
--

CREATE TABLE `inbound_products` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `inbound_id` int(11) DEFAULT NULL,
  `rack_id` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `is_rack` enum('0','1') NOT NULL DEFAULT '0' COMMENT '''0''=>''No'', ''1''=>''Yes''',
  `suggested_rack` varchar(100) NOT NULL,
  `rack_completed` enum('0','1') NOT NULL DEFAULT '0' COMMENT '	''0''=>''No'', ''1''=>''Yes''',
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '''0''=>''Inactive'', ''1''=>''Active''',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0' COMMENT '''0'' => ''Not Deleted'', ''1'' => ''Deleted''',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inbound_products`
--

INSERT INTO `inbound_products` (`id`, `product_id`, `inbound_id`, `rack_id`, `stock`, `is_rack`, `suggested_rack`, `rack_completed`, `status`, `is_deleted`, `createdAt`, `updateAt`) VALUES
(1, 1, 1, 0, 5, '0', '', '0', '1', '0', '2022-01-16 13:46:56', '2022-01-16 14:28:34'),
(2, 2, 1, 3, 6, '0', '', '1', '1', '0', '2022-01-16 13:47:04', '2022-01-16 13:47:11'),
(3, 2, 1, 4, 4, '0', '', '1', '1', '0', '2022-01-16 13:47:15', '2022-01-16 13:47:20'),
(4, 5, 1, 0, 1, '0', '', '0', '1', '0', '2022-01-16 14:29:03', '2022-01-16 14:29:03');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `sku` varchar(100) NOT NULL,
  `size` float DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `stock_status` enum('0','1') NOT NULL DEFAULT '0' COMMENT '''0'' => ''Out of stock'', ''1'' => ''In stock''	',
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '''0''=>''Inactive'', ''1''=>''Active''',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0' COMMENT '''0'' => ''Not Deleted'', ''1'' => ''Deleted''',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `sku`, `size`, `details`, `stock`, `stock_status`, `status`, `is_deleted`, `createdAt`, `updateAt`) VALUES
(1, 'Product 1', 'A', 1, NULL, 6, '1', '1', '0', '2022-01-13 17:03:35', '2022-01-16 14:28:34'),
(2, 'Product 2', 'B', 2, NULL, 14, '1', '1', '0', '2022-01-13 17:04:28', '2022-01-16 13:47:17'),
(3, 'Product 3', 'C', 0.5, NULL, 0, '1', '1', '0', '2022-01-13 17:04:54', '2022-01-15 18:15:23'),
(4, 'Product 4', 'D', 0.8, NULL, 0, '1', '1', '0', '2022-01-13 17:04:54', '2022-01-16 13:24:10'),
(5, 'Product 5', 'E', 2.5, NULL, 1, '1', '1', '0', '2022-01-13 17:04:54', '2022-01-16 14:29:03');

-- --------------------------------------------------------

--
-- Table structure for table `racks`
--

CREATE TABLE `racks` (
  `id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `capacity` float DEFAULT NULL,
  `order_no` int(11) DEFAULT NULL,
  `coefficient` float DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '''0''=>''Inactive'', ''1''=>''Active''',
  `is_deleted` enum('0','1') NOT NULL DEFAULT '0' COMMENT '''0'' => ''Not Deleted'', ''1'' => ''Deleted''',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updateAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `racks`
--

INSERT INTO `racks` (`id`, `name`, `details`, `capacity`, `order_no`, `coefficient`, `status`, `is_deleted`, `createdAt`, `updateAt`) VALUES
(1, 'R1', NULL, 10, 3, 3, '1', '0', '2022-01-15 09:20:45', '2022-01-15 09:20:45'),
(2, 'R2', NULL, 20, 4, 3.1, '1', '0', '2022-01-15 09:23:31', '2022-01-15 14:35:42'),
(3, 'R3', NULL, 12, 1, 1.3, '1', '0', '2022-01-15 09:24:07', '2022-01-15 14:35:42'),
(4, 'R4', NULL, 8, 2, 2.6, '1', '0', '2022-01-15 09:24:45', '2022-01-15 14:37:09'),
(5, 'R5', NULL, 20, 5, 3.8, '1', '0', '2022-01-15 09:31:02', '2022-01-15 14:37:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inbounds`
--
ALTER TABLE `inbounds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `is_deleted` (`is_deleted`);

--
-- Indexes for table `inbound_products`
--
ALTER TABLE `inbound_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `is_deleted` (`is_deleted`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `is_deleted` (`is_deleted`);

--
-- Indexes for table `racks`
--
ALTER TABLE `racks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `status` (`status`),
  ADD KEY `is_deleted` (`is_deleted`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inbounds`
--
ALTER TABLE `inbounds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `inbound_products`
--
ALTER TABLE `inbound_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `racks`
--
ALTER TABLE `racks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
