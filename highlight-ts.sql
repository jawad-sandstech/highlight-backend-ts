-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 07, 2024 at 03:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `highlight-ts`
--

-- --------------------------------------------------------

--
-- Table structure for table `athleteinfo`
--

CREATE TABLE `athleteinfo` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `instagramUsername` varchar(191) DEFAULT NULL,
  `experience` enum('BEGINNER','INTERMEDIATE','ADVANCED','EXPERT','ELITE','RECREATIONAL','SEMI_PROFESSIONAL','PROFESSIONAL') DEFAULT NULL,
  `schoolName` varchar(191) DEFAULT NULL,
  `universityName` varchar(191) DEFAULT NULL,
  `sportId` int(11) DEFAULT NULL,
  `position` varchar(191) DEFAULT NULL,
  `attachment` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `athleteinfo`
--

INSERT INTO `athleteinfo` (`id`, `userId`, `instagramUsername`, `experience`, `schoolName`, `universityName`, `sportId`, `position`, `attachment`, `bio`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'xyz', 'ADVANCED', 'yfuq', 'fyuqy', 1, 'ddddddd', NULL, 'xyzuahd', '2024-09-05 12:49:38.081', '2024-09-05 12:51:19.677'),
(2, 3, 'test', 'BEGINNER', 'test', 'etst', 1, 'front', NULL, 'bio my bio', '2024-09-05 15:52:49.224', '2024-09-05 15:55:21.782'),
(3, 4, 'xyz', 'BEGINNER', 'zydyw', 'dijwoj', 1, 'dsdsdsds', NULL, 'xyz', '2024-09-05 16:09:31.472', '2024-09-05 16:12:36.372');

-- --------------------------------------------------------

--
-- Table structure for table `businessinfo`
--

CREATE TABLE `businessinfo` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `organizationName` varchar(191) DEFAULT NULL,
  `industryType` varchar(191) DEFAULT NULL,
  `founded` varchar(191) DEFAULT NULL,
  `overview` text DEFAULT NULL,
  `phoneNumber` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `website` varchar(191) DEFAULT NULL,
  `address` varchar(191) DEFAULT NULL,
  `zoomId` varchar(191) DEFAULT NULL,
  `isPremium` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `businessinfo`
--

INSERT INTO `businessinfo` (`id`, `userId`, `organizationName`, `industryType`, `founded`, `overview`, `phoneNumber`, `email`, `website`, `address`, `zoomId`, `isPremium`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'ttqwt', 'Industry 3', '2019', 'test', '7837489379', 'xyz@gmail.com', 'ds', NULL, NULL, 0, '2024-09-05 12:58:10.857', '2024-09-06 17:24:42.396'),
(2, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '2024-09-06 17:04:40.163', '2024-09-06 17:04:40.163');

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int(11) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `type` enum('PRIVATE','GROUP') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `name`, `type`) VALUES
(1, NULL, 'PRIVATE'),
(2, NULL, 'PRIVATE'),
(3, NULL, 'PRIVATE'),
(4, NULL, 'PRIVATE'),
(5, NULL, 'PRIVATE'),
(6, 'Tetsd', 'GROUP'),
(7, 'second group', 'GROUP'),
(8, 'third group', 'GROUP'),
(9, 'dddd', 'GROUP'),
(10, 'dddd', 'GROUP'),
(11, 'ddd', 'GROUP'),
(12, 'fff', 'GROUP'),
(13, 'cccc', 'GROUP'),
(14, 'ccc', 'GROUP'),
(15, NULL, 'PRIVATE'),
(16, NULL, 'PRIVATE');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `subject` text NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `userId`, `subject`, `description`, `createdAt`) VALUES
(1, 1, 'd', 'dd', '2024-09-05 12:56:55.795');

-- --------------------------------------------------------

--
-- Table structure for table `feedbackimages`
--

CREATE TABLE `feedbackimages` (
  `id` int(11) NOT NULL,
  `feedbackId` int(11) NOT NULL,
  `path` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feedbackimages`
--

INSERT INTO `feedbackimages` (`id`, `feedbackId`, `path`, `createdAt`) VALUES
(1, 1, 'feedback-images/a2e2f7aad09dafa8e5648f4e7f987663c1a8d47022cc4f9837708948da91e8a8', '2024-09-05 12:56:55.795');

-- --------------------------------------------------------

--
-- Table structure for table `jobapplications`
--

CREATE TABLE `jobapplications` (
  `id` int(11) NOT NULL,
  `jobId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` enum('APPLIED','WAIT_LISTED','REJECTED','HIRED','COMPLETED') NOT NULL DEFAULT 'APPLIED',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobrequiredqualifications`
--

CREATE TABLE `jobrequiredqualifications` (
  `id` int(11) NOT NULL,
  `jobId` int(11) NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobrequiredqualifications`
--

INSERT INTO `jobrequiredqualifications` (`id`, `jobId`, `description`, `createdAt`, `updatedAt`) VALUES
(11, 2, 'yef', '2024-09-05 16:41:08.892', '2024-09-05 16:41:08.892'),
(12, 2, 'yef', '2024-09-05 16:41:08.892', '2024-09-05 16:41:08.892'),
(13, 3, 'test', '2024-09-05 19:19:16.293', '2024-09-05 19:19:16.293'),
(14, 3, 'test', '2024-09-05 19:19:16.293', '2024-09-05 19:19:16.293'),
(15, 4, 'test', '2024-09-05 19:25:18.965', '2024-09-05 19:25:18.965'),
(16, 4, 'test', '2024-09-05 19:25:18.965', '2024-09-05 19:25:18.965'),
(17, 5, 'skd', '2024-09-06 23:44:43.219', '2024-09-06 23:44:43.219'),
(18, 5, 'skd', '2024-09-06 23:44:43.219', '2024-09-06 23:44:43.219');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `sportId` int(11) DEFAULT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `bannerImage` text NOT NULL,
  `salary` int(11) NOT NULL,
  `type` enum('SOCIAL_MEDIA','MEET_AND_GREET','AUTOGRAPHS','PHOTO_SHOOTS','OTHER') NOT NULL,
  `status` enum('OPEN','FILLED','COMPLETED') NOT NULL DEFAULT 'OPEN',
  `hasCompletedByAthlete` tinyint(1) NOT NULL DEFAULT 0,
  `hasPaid` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `userId`, `sportId`, `title`, `description`, `bannerImage`, `salary`, `type`, `status`, `hasCompletedByAthlete`, `hasPaid`, `createdAt`, `updatedAt`) VALUES
(2, 2, 1, 'b2 new hiring', 'yesy', 'job-banner/1e1f95fad99771a914293ba2f85efc12b62815bc31aef05c002871c2d88a070e', 100, 'MEET_AND_GREET', 'OPEN', 0, 1, '2024-09-05 16:41:08.892', '2024-09-05 16:41:08.907'),
(3, 2, 1, 'new jon', 'test', 'job-banner/a2cba19db5f65efd5ccd4989f63b84a68dcf9fadf9421d39cd495863f01116c7', 100, 'SOCIAL_MEDIA', 'OPEN', 0, 1, '2024-09-05 19:19:16.293', '2024-09-05 19:19:16.306'),
(4, 2, 1, 'test', 'test', 'job-banner/bff3546c5918d9a64c65255539d57962a76a40befc6e7aea0b6dd8d2e9d2b6bd', 560, 'SOCIAL_MEDIA', 'FILLED', 0, 1, '2024-09-05 19:25:18.965', '2024-09-06 23:16:58.153'),
(5, 2, 1, 'quicl', 'cd', 'job-banner/fbf6a5da2b3e357c797ef811018788a5126b7ba7274500eed00a025f36e99aba', 100, 'SOCIAL_MEDIA', 'OPEN', 0, 1, '2024-09-06 23:44:43.219', '2024-09-06 23:44:43.234');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `chatId` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `attachment` varchar(191) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `messageType` enum('TEXT','SYSTEM') NOT NULL DEFAULT 'TEXT',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `chatId`, `senderId`, `attachment`, `content`, `messageType`, `createdAt`) VALUES
(1, 1, 2, NULL, 'Let\'s make this collaboration epic!', 'TEXT', '2024-09-05 15:51:14.474'),
(2, 2, 2, NULL, 'Let\'s make this collaboration epic!', 'TEXT', '2024-09-05 16:06:26.852'),
(3, 3, 2, NULL, 'Let\'s make this collaboration epic!', 'TEXT', '2024-09-05 16:14:48.002'),
(4, 4, 2, NULL, 'Let\'s make this collaboration epic!', 'TEXT', '2024-09-05 17:20:31.074'),
(5, 5, 2, NULL, 'Let\'s make this collaboration epic!', 'TEXT', '2024-09-05 19:22:05.609'),
(6, 6, 2, NULL, 'hello everyone!', 'TEXT', '2024-09-06 17:27:59.603'),
(7, 7, 2, NULL, 'hello everyone!', 'TEXT', '2024-09-06 20:14:50.339'),
(8, 8, 2, NULL, 'hello everyone!', 'TEXT', '2024-09-06 20:15:34.586'),
(9, 9, 2, NULL, 'hello everyone!', 'TEXT', '2024-09-06 20:28:57.476'),
(10, 10, 2, NULL, 'hello everyone!', 'TEXT', '2024-09-06 20:32:49.571'),
(11, 11, 2, NULL, 'hello everyone!', 'TEXT', '2024-09-06 20:33:30.297'),
(12, 12, 2, NULL, 'hello everyone!', 'TEXT', '2024-09-06 20:48:06.526'),
(13, 13, 2, NULL, 'hello everyone!', 'TEXT', '2024-09-06 20:49:09.593'),
(14, 14, 2, NULL, 'hello everyone!', 'TEXT', '2024-09-06 20:49:58.352'),
(15, 1, 2, NULL, 'hello', 'TEXT', '2024-09-06 22:01:01.345'),
(16, 1, 1, NULL, 'yess', 'TEXT', '2024-09-06 22:01:35.603'),
(17, 1, 1, NULL, 'drds', 'TEXT', '2024-09-06 22:02:00.323'),
(18, 1, 2, NULL, 'jjjjj', 'TEXT', '2024-09-06 22:02:28.388'),
(19, 1, 2, NULL, 'jj', 'TEXT', '2024-09-06 22:03:11.431'),
(20, 1, 2, NULL, 'ss', 'TEXT', '2024-09-06 22:05:31.188'),
(21, 1, 2, NULL, 'haaaaaan', 'TEXT', '2024-09-06 22:06:55.910'),
(22, 1, 2, NULL, 'xxx', 'TEXT', '2024-09-06 22:09:10.319'),
(23, 1, 2, NULL, 'ssss', 'TEXT', '2024-09-06 22:09:26.715'),
(24, 1, 2, NULL, 'ssss', 'TEXT', '2024-09-06 22:09:46.944'),
(25, 1, 2, NULL, 'saa', 'TEXT', '2024-09-06 22:10:18.543'),
(26, 1, 2, NULL, 'dsds', 'TEXT', '2024-09-06 22:11:41.057'),
(27, 1, 2, NULL, 'ss', 'TEXT', '2024-09-06 22:38:40.533'),
(28, 15, 2, NULL, 'Let\'s make this collaboration epic!', 'TEXT', '2024-09-06 23:09:20.404'),
(29, 16, 2, NULL, 'Let\'s make this collaboration epic!', 'TEXT', '2024-09-06 23:16:58.494');

-- --------------------------------------------------------

--
-- Table structure for table `messagestatus`
--

CREATE TABLE `messagestatus` (
  `id` int(11) NOT NULL,
  `messageId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `seen` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messagestatus`
--

INSERT INTO `messagestatus` (`id`, `messageId`, `userId`, `seen`) VALUES
(1, 1, 1, 1),
(2, 2, 3, 0),
(3, 3, 4, 0),
(4, 4, 1, 1),
(5, 5, 3, 0),
(6, 6, 1, 1),
(7, 6, 3, 0),
(8, 7, 1, 1),
(9, 8, 1, 1),
(10, 8, 3, 0),
(11, 9, 1, 1),
(12, 9, 3, 0),
(13, 9, 4, 0),
(14, 10, 1, 1),
(15, 10, 3, 0),
(16, 10, 4, 0),
(17, 11, 1, 1),
(18, 11, 3, 0),
(19, 11, 4, 0),
(20, 12, 1, 1),
(21, 13, 1, 1),
(22, 14, 1, 1),
(23, 15, 1, 1),
(24, 17, 2, 1),
(25, 18, 1, 0),
(26, 19, 1, 0),
(27, 20, 1, 0),
(28, 21, 1, 0),
(29, 22, 1, 0),
(30, 23, 1, 0),
(31, 24, 1, 0),
(32, 25, 1, 0),
(33, 26, 1, 0),
(34, 27, 1, 0),
(35, 28, 1, 0),
(36, 29, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `participants`
--

CREATE TABLE `participants` (
  `id` int(11) NOT NULL,
  `chatId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `exitedAt` datetime(3) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `participants`
--

INSERT INTO `participants` (`id`, `chatId`, `userId`, `exitedAt`, `isAdmin`) VALUES
(1, 1, 2, NULL, 0),
(2, 1, 1, NULL, 0),
(3, 2, 2, NULL, 0),
(4, 2, 3, NULL, 0),
(5, 3, 2, NULL, 0),
(6, 3, 4, NULL, 0),
(7, 4, 2, NULL, 0),
(8, 4, 1, NULL, 0),
(9, 5, 2, NULL, 0),
(10, 5, 3, NULL, 0),
(11, 6, 2, NULL, 1),
(12, 6, 1, NULL, 0),
(13, 6, 3, NULL, 0),
(14, 7, 2, NULL, 1),
(15, 7, 1, NULL, 0),
(16, 8, 2, NULL, 1),
(17, 8, 1, NULL, 0),
(18, 8, 3, NULL, 0),
(19, 9, 2, NULL, 1),
(20, 9, 1, NULL, 0),
(21, 9, 3, NULL, 0),
(22, 9, 4, NULL, 0),
(23, 10, 2, NULL, 1),
(24, 10, 1, NULL, 0),
(25, 10, 3, NULL, 0),
(26, 10, 4, NULL, 0),
(27, 11, 2, NULL, 1),
(28, 11, 1, NULL, 0),
(29, 11, 3, NULL, 0),
(30, 11, 4, NULL, 0),
(31, 12, 2, NULL, 1),
(32, 12, 1, NULL, 0),
(33, 13, 2, NULL, 1),
(34, 13, 1, NULL, 0),
(35, 14, 2, NULL, 1),
(36, 14, 1, NULL, 0),
(37, 15, 2, NULL, 0),
(38, 15, 1, NULL, 0),
(39, 16, 2, NULL, 0),
(40, 16, 1, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `reportedjobs`
--

CREATE TABLE `reportedjobs` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `jobId` int(11) NOT NULL,
  `reason` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sports`
--

CREATE TABLE `sports` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sports`
--

INSERT INTO `sports` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'abc', '2024-09-05 17:48:37.000', '2024-09-05 17:48:37.000');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `transactionType` enum('DEPOSIT','FEE','HOLD','PAYMENT','WITHDRAWAL') NOT NULL,
  `source` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`source`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `userId`, `amount`, `transactionType`, `source`, `createdAt`, `updatedAt`) VALUES
(1, 2, 10000, 'DEPOSIT', NULL, '2024-09-05 15:04:44.548', '2024-09-05 15:04:44.548'),
(2, 2, 1000, 'HOLD', '{\"event\":\"JOB_CREATE\",\"recourseId\":1}', '2024-09-05 15:05:26.644', '2024-09-05 15:05:26.644'),
(3, 2, 200, 'FEE', '{\"event\":\"JOB_CREATE\",\"recourseId\":1}', '2024-09-05 15:05:26.646', '2024-09-05 15:05:26.646'),
(4, 2, 100, 'HOLD', '{\"event\":\"JOB_CREATE\",\"recourseId\":2}', '2024-09-05 16:41:08.903', '2024-09-05 16:41:08.903'),
(5, 2, 20, 'FEE', '{\"event\":\"JOB_CREATE\",\"recourseId\":2}', '2024-09-05 16:41:08.905', '2024-09-05 16:41:08.905'),
(6, 2, 1000, 'DEPOSIT', '{\"event\":\"JOB_DELETE\",\"recourseId\":1}', '2024-09-05 19:16:00.041', '2024-09-05 19:16:00.041'),
(7, 2, 100, 'HOLD', '{\"event\":\"JOB_CREATE\",\"recourseId\":3}', '2024-09-05 19:19:16.302', '2024-09-05 19:19:16.302'),
(8, 2, 20, 'FEE', '{\"event\":\"JOB_CREATE\",\"recourseId\":3}', '2024-09-05 19:19:16.304', '2024-09-05 19:19:16.304'),
(9, 2, 560, 'HOLD', '{\"event\":\"JOB_CREATE\",\"recourseId\":4}', '2024-09-05 19:25:18.977', '2024-09-05 19:25:18.977'),
(10, 2, 112, 'FEE', '{\"event\":\"JOB_CREATE\",\"recourseId\":4}', '2024-09-05 19:25:18.980', '2024-09-05 19:25:18.980'),
(11, 2, 100, 'HOLD', '{\"event\":\"JOB_CREATE\",\"recourseId\":5}', '2024-09-06 23:44:43.231', '2024-09-06 23:44:43.231'),
(12, 2, 20, 'FEE', '{\"event\":\"JOB_CREATE\",\"recourseId\":5}', '2024-09-06 23:44:43.232', '2024-09-06 23:44:43.232');

-- --------------------------------------------------------

--
-- Table structure for table `userathleticachievements`
--

CREATE TABLE `userathleticachievements` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `gameName` varchar(191) NOT NULL,
  `medalCount` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userathleticachievements`
--

INSERT INTO `userathleticachievements` (`id`, `userId`, `gameName`, `medalCount`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'dd', 5, '2024-09-05 12:51:07.082', '2024-09-05 12:51:07.082'),
(2, 3, 'test', 4, '2024-09-05 15:55:04.290', '2024-09-05 15:55:04.290'),
(3, 4, 'test', 4, '2024-09-05 16:12:18.831', '2024-09-05 16:12:18.831'),
(4, 4, 'd', 5, '2024-09-05 16:12:18.831', '2024-09-05 16:12:18.831');

-- --------------------------------------------------------

--
-- Table structure for table `userfavoritebusinesses`
--

CREATE TABLE `userfavoritebusinesses` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `businessId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usergallery`
--

CREATE TABLE `usergallery` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `path` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usergallery`
--

INSERT INTO `usergallery` (`id`, `userId`, `path`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'user-gallery/6ca2ef75d8f57c85ed99d6a47dc0086dd7a16b30436511459a7b176674953d7a', '2024-09-05 12:51:19.679', '2024-09-05 12:51:19.679'),
(2, 3, 'user-gallery/ae98292007fa8008a4fffe58c7e1cc0d9125362b07c04abff88210711c15db77', '2024-09-05 15:55:21.783', '2024-09-05 15:55:21.783'),
(3, 3, 'user-gallery/ebad140a624a86bef0b9145085814e0410ebecd3a58d9c32d79f13829e97a0a2', '2024-09-05 15:55:21.783', '2024-09-05 15:55:21.783'),
(4, 4, 'user-gallery/eb80396dcc3c0e95c781302990581d2ad0b84eb666d143d5205ed2ea3fb1c40f', '2024-09-05 16:12:36.375', '2024-09-05 16:12:36.375'),
(5, 4, 'user-gallery/db624188553d4de889bc451a8e848cb0682e12d4f6a96aa4bb2fb6519dec429f', '2024-09-05 16:12:36.375', '2024-09-05 16:12:36.375'),
(6, 4, 'user-gallery/235bdf838f544dbac4837a2126ceacc0d4de9c20fec78743c4d7aabdd0c5169f', '2024-09-05 16:12:36.375', '2024-09-05 16:12:36.375');

-- --------------------------------------------------------

--
-- Table structure for table `userhiddenjobs`
--

CREATE TABLE `userhiddenjobs` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `jobId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usernotifications`
--

CREATE TABLE `usernotifications` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `hasSeen` tinyint(1) NOT NULL DEFAULT 0,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `notificationType` enum('PRIVATE_CHAT','GROUP_CHAT','JOB_APPLICATION','APPLICATION_WAIT_LISTED','APPLICATION_REJECTED','APPLICATION_SELECTED','JOB_COMPLETED') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usernotifications`
--

INSERT INTO `usernotifications` (`id`, `userId`, `title`, `description`, `createdAt`, `updatedAt`, `hasSeen`, `metadata`, `notificationType`) VALUES
(1, 1, 'New Message From B2', 'hello', '2024-09-06 22:01:01.412', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(2, 2, 'New Message From bussiness1', 'drds', '2024-09-06 22:02:00.334', '2024-09-06 23:01:48.404', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(3, 1, 'New Message From B2', 'jjjjj', '2024-09-06 22:02:28.401', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(4, 1, 'New Message From B2', 'jj', '2024-09-06 22:03:11.443', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(5, 1, 'New Message From B2', 'ss', '2024-09-06 22:05:31.200', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(6, 1, 'New Message From B2', 'haaaaaan', '2024-09-06 22:06:55.920', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(7, 1, 'New Message From B2', 'xxx', '2024-09-06 22:09:10.331', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(8, 1, 'New Message From B2', 'ssss', '2024-09-06 22:09:26.727', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(9, 1, 'New Message From B2', 'ssss', '2024-09-06 22:09:46.953', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(10, 1, 'New Message From B2', 'saa', '2024-09-06 22:10:18.551', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(11, 1, 'New Message From B2', 'dsds', '2024-09-06 22:11:41.069', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(12, 1, 'New Message From B2', 'ss', '2024-09-06 22:38:40.542', '2024-09-06 23:14:09.207', 1, '{\"chatId\":1}', 'PRIVATE_CHAT'),
(13, 2, 'New Application', 'New application on \"new jon\"', '2024-09-06 22:51:48.351', '2024-09-06 23:01:48.404', 1, '{\"jobId\":3,\"applicationId\":6}', 'JOB_APPLICATION'),
(14, 1, 'Application update', 'Your Application got selected on \"new jon\"', '2024-09-06 23:09:19.516', '2024-09-06 23:14:09.207', 1, '{\"jobId\":3,\"applicationId\":6}', 'APPLICATION_SELECTED'),
(15, 2, 'New Application', 'New application on \"test\"', '2024-09-06 23:16:47.391', '2024-09-06 23:16:47.391', 0, '{\"jobId\":4,\"applicationId\":7}', 'JOB_APPLICATION'),
(16, 1, 'Application update', 'Your Application got selected on \"test\"', '2024-09-06 23:16:58.159', '2024-09-06 23:16:58.159', 0, '{\"jobId\":4,\"applicationId\":7}', 'APPLICATION_SELECTED'),
(17, 2, 'New Application', 'New application on \"quicl\"', '2024-09-06 23:45:32.941', '2024-09-06 23:45:32.941', 0, '{\"jobId\":5,\"applicationId\":8}', 'JOB_APPLICATION');

-- --------------------------------------------------------

--
-- Table structure for table `userotp`
--

CREATE TABLE `userotp` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `otp` varchar(191) NOT NULL,
  `isExpired` tinyint(1) NOT NULL DEFAULT 0,
  `expirationDateTime` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userotp`
--

INSERT INTO `userotp` (`id`, `userId`, `otp`, `isExpired`, `expirationDateTime`, `createdAt`) VALUES
(1, 1, '549462', 1, '2024-09-05 12:54:38.084', '2024-09-05 12:49:38.087'),
(2, 2, '882218', 1, '2024-09-05 13:03:10.858', '2024-09-05 12:58:10.860'),
(3, 3, '772775', 1, '2024-09-05 15:57:49.226', '2024-09-05 15:52:49.230'),
(4, 4, '406929', 1, '2024-09-05 16:14:31.473', '2024-09-05 16:09:31.477'),
(5, 5, '538734', 1, '2024-09-06 17:09:40.163', '2024-09-06 17:04:40.166');

-- --------------------------------------------------------

--
-- Table structure for table `userpasswords`
--

CREATE TABLE `userpasswords` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `password` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userpasswords`
--

INSERT INTO `userpasswords` (`id`, `userId`, `password`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 1, '12345678', 1, '2024-09-05 12:49:38.070', '2024-09-05 12:49:38.070'),
(2, 2, '12345678', 1, '2024-09-05 12:58:10.845', '2024-09-05 12:58:10.845'),
(3, 3, '12345678', 1, '2024-09-05 15:52:49.211', '2024-09-05 15:52:49.211'),
(4, 4, '12345678', 1, '2024-09-05 16:09:31.459', '2024-09-05 16:09:31.459'),
(5, 5, '12345678', 1, '2024-09-06 17:04:40.106', '2024-09-06 17:04:40.106');

-- --------------------------------------------------------

--
-- Table structure for table `userpreference`
--

CREATE TABLE `userpreference` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `receivePushNotifications` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userpreference`
--

INSERT INTO `userpreference` (`id`, `userId`, `receivePushNotifications`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1);

-- --------------------------------------------------------

--
-- Table structure for table `userrating`
--

CREATE TABLE `userrating` (
  `id` int(11) NOT NULL,
  `jobId` int(11) NOT NULL,
  `athleteId` int(11) NOT NULL,
  `businessId` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(191) DEFAULT NULL,
  `profilePicture` text DEFAULT NULL,
  `dateOfBirth` datetime(3) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phoneNumber` varchar(191) DEFAULT NULL,
  `instagramUsername` varchar(191) DEFAULT NULL,
  `instagramFollowersCount` int(11) DEFAULT NULL,
  `zoomId` varchar(191) DEFAULT NULL,
  `role` enum('ATHLETE','BUSINESS','ADMIN') NOT NULL,
  `loginMethod` enum('EMAIL','GOOGLE','FACEBOOK','APPLE') NOT NULL,
  `socialToken` varchar(191) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `stripeCustomerId` varchar(191) NOT NULL,
  `stripeAccountId` varchar(191) DEFAULT NULL,
  `isEmailVerified` tinyint(1) NOT NULL DEFAULT 0,
  `isStripeVerified` tinyint(1) NOT NULL DEFAULT 0,
  `isProfileComplete` tinyint(1) NOT NULL DEFAULT 0,
  `hasUpdatedAthleteInfo` tinyint(1) NOT NULL DEFAULT 0,
  `hasUpdatedBusinessInfo` tinyint(1) NOT NULL DEFAULT 0,
  `fcmToken` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `profilePicture`, `dateOfBirth`, `gender`, `address`, `phoneNumber`, `instagramUsername`, `instagramFollowersCount`, `zoomId`, `role`, `loginMethod`, `socialToken`, `email`, `stripeCustomerId`, `stripeAccountId`, `isEmailVerified`, `isStripeVerified`, `isProfileComplete`, `hasUpdatedAthleteInfo`, `hasUpdatedBusinessInfo`, `fcmToken`, `createdAt`, `updatedAt`) VALUES
(1, 'B2', 'user-profiles/a7047849cf974ea82c9a35a5abd21b6b8e7aefa3205e58d3dfafe7ee66da6713', '2023-12-31 19:00:00.000', 'MALE', 'hdfwif', '+1 6537614916', NULL, NULL, '65365627653', 'ATHLETE', 'EMAIL', NULL, 'b1@yopmail.com', 'cus_QnFdyAnagRVNSA', 'acct_1Pvf80CcTfrXw3IY', 1, 0, 1, 1, 0, 'eek3RHmmT1WAXAI_8w3iSW:APA91bH73StssIHWgw5OJtdn-gy9d0FvumRYvjeqbIO4Zyu4iqap4XCaJk8Zm0oSyRJd0wkImqZZEefDG_LVedil8Jz0jMp2QSotp1zDvpzEK2df8KQZppFY2zMeKWPI2eqYzW9cYzfL', '2024-09-05 12:49:38.070', '2024-09-05 12:51:19.673'),
(2, 'bussiness1', 'user-profiles/edbe5813d8622c4dbbe00cbf649c1496ccee4f3a55860e801f9ada3d2366556e', '2023-12-31 19:00:00.000', NULL, 'xyz', '+1 6573269265', NULL, NULL, NULL, 'BUSINESS', 'EMAIL', NULL, 'b2@yopmail.com', 'cus_QnFlHOYZ1jrD24', NULL, 1, 0, 1, 0, 1, 'cAVcEcb2Rl2pa0JzytY4h6:APA91bF0_n6g3nnKyA4P7iT7N_gCKj7_nm9jINAnRlTsw-eGpiPMYm9gBNScwYBYA0mmYu6KPxmxNDoXJPrYTUjT87yFKhIai-HYitfcctO19lfLxdV33wJeeTXN9WV1AkAqW0D6TAXE', '2024-09-05 12:58:10.845', '2024-09-06 17:24:43.581'),
(3, 'a2', 'user-profiles/7b37e552f93261eab90eb7399ce47f5eacaaeb36150dd5f18b2acabbd001daec', '2023-12-31 19:00:00.000', 'MALE', 'a2@yopmail.com', '+1 0212784827', NULL, NULL, '56372893053', 'ATHLETE', 'EMAIL', NULL, 'a2@yopmail.com', 'cus_QnIao8EEoXHn2h', 'acct_1PvhzICVqbvor0iq', 1, 0, 1, 1, 0, NULL, '2024-09-05 15:52:49.211', '2024-09-05 15:55:21.776'),
(4, 'a3', 'user-profiles/8466793b66b7bac7e28198d53a2ea2668206f253c557f8de8323c8c41194e6c0', '2003-09-30 19:00:00.000', 'MALE', 'd', '+1 4343434343', NULL, NULL, '43434343434', 'ATHLETE', 'EMAIL', NULL, 'a3@yopmail.com', 'cus_QnIrouYQmRBDvu', 'acct_1PviFTEQcBdgOf7K', 1, 0, 1, 1, 0, NULL, '2024-09-05 16:09:31.459', '2024-09-05 16:12:36.367'),
(5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'BUSINESS', 'EMAIL', NULL, 'b3@yopmail.com', 'cus_Qngye08I69JroX', NULL, 1, 0, 0, 0, 0, NULL, '2024-09-06 17:04:40.106', '2024-09-06 17:04:51.390');

-- --------------------------------------------------------

--
-- Table structure for table `usersavedjobs`
--

CREATE TABLE `usersavedjobs` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `jobId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userschedules`
--

CREATE TABLE `userschedules` (
  `id` int(11) NOT NULL,
  `chatId` int(11) NOT NULL,
  `organizerId` int(11) NOT NULL,
  `attendeeId` int(11) NOT NULL,
  `agenda` varchar(191) NOT NULL,
  `meetingDateTime` datetime(3) NOT NULL,
  `zoomMeetingLink` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userschedules`
--

INSERT INTO `userschedules` (`id`, `chatId`, `organizerId`, `attendeeId`, `agenda`, `meetingDateTime`, `zoomMeetingLink`, `createdAt`) VALUES
(1, 1, 2, 1, 'tes', '2024-01-01 01:07:00.000', 'rr', '2024-09-05 16:41:46.933'),
(2, 1, 2, 1, 'second', '2024-09-03 00:05:00.000', 'tesat', '2024-09-05 23:12:43.946'),
(3, 1, 2, 1, 'again', '2024-09-05 13:04:00.000', 'ttt', '2024-09-05 23:15:33.105'),
(4, 1, 2, 1, 'ddd', '2024-01-01 01:06:00.000', 'https://us05web.zoom.us/j/86811368400?pwd=AWJtXuPshYn3D4UGyNl9oipxhl8sbB.1', '2024-09-06 19:58:33.981');

-- --------------------------------------------------------

--
-- Table structure for table `usertax`
--

CREATE TABLE `usertax` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `firstName` varchar(191) NOT NULL,
  `lastName` varchar(191) NOT NULL,
  `dateOfBirth` datetime(3) NOT NULL,
  `address` varchar(191) NOT NULL,
  `SSN` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usertax`
--

INSERT INTO `usertax` (`id`, `userId`, `firstName`, `lastName`, `dateOfBirth`, `address`, `SSN`, `createdAt`, `updatedAt`) VALUES
(2, 1, 'dsd', 'dsds', '2024-01-02 00:00:00.000', 'dsds', '222', '2024-09-07 00:54:15.796', '2024-09-07 00:54:15.796');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('0f659fa8-ec56-446f-83b1-b1a2961a8cdd', 'aeff64d143e5cdb8b81aea116252708643d2d18248a08a5bd1261440590996cb', '2024-09-06 22:43:52.567', '20240906224352_', NULL, NULL, '2024-09-06 22:43:52.559', 1),
('65c7d936-edba-4a19-88e3-de524ca37f9b', '5749216409786df928b4879c884143b96f6af212246c899c0b256379de7bd649', '2024-09-06 21:06:41.361', '20240906210641_', NULL, NULL, '2024-09-06 21:06:41.355', 1),
('6e6f1b62-95fd-4b04-93b0-b6cfffa5182e', 'cc5b1ebe233717ac4080fd14447346b8c1acd8318d21b80d66835d2bc502eec1', '2024-09-06 22:49:35.092', '20240906224935_', NULL, NULL, '2024-09-06 22:49:35.063', 1),
('e44e4468-d612-4e48-be56-298972db796a', '4227554286e291be940fe879eea503508f941695ee16c1f4da5cde9c5ea26240', '2024-09-06 23:05:44.032', '20240906230543_', NULL, NULL, '2024-09-06 23:05:43.994', 1),
('fd11021c-c1ca-4bff-a9ee-efbc58b3ca0a', '0479e492721cb892be6cb0af52792d11e66b9047171d173717ace34abd910eac', '2024-09-05 12:48:08.746', '20240905124807_', NULL, NULL, '2024-09-05 12:48:07.752', 1),
('fdbd97b2-927d-401e-9bd7-1141db609675', 'dd89e1baaec32b78f939872484bc700a8d48f5fc0062db39c42b1e7d90491493', '2024-09-06 22:45:09.794', '20240906224509_', NULL, NULL, '2024-09-06 22:45:09.787', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `athleteinfo`
--
ALTER TABLE `athleteinfo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `AthleteInfo_userId_key` (`userId`),
  ADD KEY `AthleteInfo_sportId_fkey` (`sportId`);

--
-- Indexes for table `businessinfo`
--
ALTER TABLE `businessinfo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `BusinessInfo_userId_key` (`userId`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Feedback_userId_fkey` (`userId`);

--
-- Indexes for table `feedbackimages`
--
ALTER TABLE `feedbackimages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FeedbackImages_feedbackId_fkey` (`feedbackId`);

--
-- Indexes for table `jobapplications`
--
ALTER TABLE `jobapplications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `JobApplications_jobId_fkey` (`jobId`),
  ADD KEY `JobApplications_userId_fkey` (`userId`);

--
-- Indexes for table `jobrequiredqualifications`
--
ALTER TABLE `jobrequiredqualifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `JobRequiredQualifications_jobId_fkey` (`jobId`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Jobs_userId_fkey` (`userId`),
  ADD KEY `Jobs_sportId_fkey` (`sportId`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Messages_chatId_fkey` (`chatId`),
  ADD KEY `Messages_senderId_fkey` (`senderId`);

--
-- Indexes for table `messagestatus`
--
ALTER TABLE `messagestatus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MessageStatus_messageId_fkey` (`messageId`),
  ADD KEY `MessageStatus_userId_fkey` (`userId`);

--
-- Indexes for table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Participants_chatId_fkey` (`chatId`),
  ADD KEY `Participants_userId_fkey` (`userId`);

--
-- Indexes for table `reportedjobs`
--
ALTER TABLE `reportedjobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ReportedJobs_userId_fkey` (`userId`),
  ADD KEY `ReportedJobs_jobId_fkey` (`jobId`);

--
-- Indexes for table `sports`
--
ALTER TABLE `sports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Transactions_userId_fkey` (`userId`);

--
-- Indexes for table `userathleticachievements`
--
ALTER TABLE `userathleticachievements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserAthleticAchievements_userId_fkey` (`userId`);

--
-- Indexes for table `userfavoritebusinesses`
--
ALTER TABLE `userfavoritebusinesses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserFavoriteBusinesses_userId_fkey` (`userId`),
  ADD KEY `UserFavoriteBusinesses_businessId_fkey` (`businessId`);

--
-- Indexes for table `usergallery`
--
ALTER TABLE `usergallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserGallery_userId_fkey` (`userId`);

--
-- Indexes for table `userhiddenjobs`
--
ALTER TABLE `userhiddenjobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserHiddenJobs_userId_fkey` (`userId`),
  ADD KEY `UserHiddenJobs_jobId_fkey` (`jobId`);

--
-- Indexes for table `usernotifications`
--
ALTER TABLE `usernotifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userotp`
--
ALTER TABLE `userotp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserOTP_userId_fkey` (`userId`);

--
-- Indexes for table `userpasswords`
--
ALTER TABLE `userpasswords`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserPasswords_userId_fkey` (`userId`);

--
-- Indexes for table `userpreference`
--
ALTER TABLE `userpreference`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UserPreference_userId_key` (`userId`);

--
-- Indexes for table `userrating`
--
ALTER TABLE `userrating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserRating_jobId_fkey` (`jobId`),
  ADD KEY `UserRating_athleteId_fkey` (`athleteId`),
  ADD KEY `UserRating_businessId_fkey` (`businessId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Users_email_key` (`email`),
  ADD UNIQUE KEY `Users_stripeCustomerId_key` (`stripeCustomerId`);

--
-- Indexes for table `usersavedjobs`
--
ALTER TABLE `usersavedjobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserSavedJobs_userId_fkey` (`userId`),
  ADD KEY `UserSavedJobs_jobId_fkey` (`jobId`);

--
-- Indexes for table `userschedules`
--
ALTER TABLE `userschedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserSchedules_organizerId_fkey` (`organizerId`),
  ADD KEY `UserSchedules_attendeeId_fkey` (`attendeeId`),
  ADD KEY `UserSchedules_chatId_fkey` (`chatId`);

--
-- Indexes for table `usertax`
--
ALTER TABLE `usertax`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UserTax_userId_key` (`userId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `athleteinfo`
--
ALTER TABLE `athleteinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `businessinfo`
--
ALTER TABLE `businessinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feedbackimages`
--
ALTER TABLE `feedbackimages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `jobapplications`
--
ALTER TABLE `jobapplications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `jobrequiredqualifications`
--
ALTER TABLE `jobrequiredqualifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `messagestatus`
--
ALTER TABLE `messagestatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `participants`
--
ALTER TABLE `participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `reportedjobs`
--
ALTER TABLE `reportedjobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sports`
--
ALTER TABLE `sports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `userathleticachievements`
--
ALTER TABLE `userathleticachievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `userfavoritebusinesses`
--
ALTER TABLE `userfavoritebusinesses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usergallery`
--
ALTER TABLE `usergallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `userhiddenjobs`
--
ALTER TABLE `userhiddenjobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usernotifications`
--
ALTER TABLE `usernotifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `userotp`
--
ALTER TABLE `userotp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `userpasswords`
--
ALTER TABLE `userpasswords`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `userpreference`
--
ALTER TABLE `userpreference`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `userrating`
--
ALTER TABLE `userrating`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `usersavedjobs`
--
ALTER TABLE `usersavedjobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `userschedules`
--
ALTER TABLE `userschedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `usertax`
--
ALTER TABLE `usertax`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `athleteinfo`
--
ALTER TABLE `athleteinfo`
  ADD CONSTRAINT `AthleteInfo_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `AthleteInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `businessinfo`
--
ALTER TABLE `businessinfo`
  ADD CONSTRAINT `BusinessInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `feedbackimages`
--
ALTER TABLE `feedbackimages`
  ADD CONSTRAINT `FeedbackImages_feedbackId_fkey` FOREIGN KEY (`feedbackId`) REFERENCES `feedback` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jobapplications`
--
ALTER TABLE `jobapplications`
  ADD CONSTRAINT `JobApplications_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `JobApplications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jobrequiredqualifications`
--
ALTER TABLE `jobrequiredqualifications`
  ADD CONSTRAINT `JobRequiredQualifications_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `Jobs_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `sports` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Jobs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `Messages_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `chats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `messagestatus`
--
ALTER TABLE `messagestatus`
  ADD CONSTRAINT `MessageStatus_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `messages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `MessageStatus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `Participants_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `chats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Participants_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reportedjobs`
--
ALTER TABLE `reportedjobs`
  ADD CONSTRAINT `ReportedJobs_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ReportedJobs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `Transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userathleticachievements`
--
ALTER TABLE `userathleticachievements`
  ADD CONSTRAINT `UserAthleticAchievements_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userfavoritebusinesses`
--
ALTER TABLE `userfavoritebusinesses`
  ADD CONSTRAINT `UserFavoriteBusinesses_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserFavoriteBusinesses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usergallery`
--
ALTER TABLE `usergallery`
  ADD CONSTRAINT `UserGallery_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userhiddenjobs`
--
ALTER TABLE `userhiddenjobs`
  ADD CONSTRAINT `UserHiddenJobs_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserHiddenJobs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userotp`
--
ALTER TABLE `userotp`
  ADD CONSTRAINT `UserOTP_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userpasswords`
--
ALTER TABLE `userpasswords`
  ADD CONSTRAINT `UserPasswords_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userpreference`
--
ALTER TABLE `userpreference`
  ADD CONSTRAINT `UserPreference_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userrating`
--
ALTER TABLE `userrating`
  ADD CONSTRAINT `UserRating_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserRating_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `UserRating_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `usersavedjobs`
--
ALTER TABLE `usersavedjobs`
  ADD CONSTRAINT `UserSavedJobs_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserSavedJobs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `userschedules`
--
ALTER TABLE `userschedules`
  ADD CONSTRAINT `UserSchedules_attendeeId_fkey` FOREIGN KEY (`attendeeId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserSchedules_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `chats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `UserSchedules_organizerId_fkey` FOREIGN KEY (`organizerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usertax`
--
ALTER TABLE `usertax`
  ADD CONSTRAINT `UserTax_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
