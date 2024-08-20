-- AlterTable
ALTER TABLE `messages` ADD COLUMN `messageType` ENUM('TEXT', 'SYSTEM') NOT NULL DEFAULT 'TEXT';

-- AlterTable
ALTER TABLE `participants` ADD COLUMN `exitedAt` DATETIME(3) NULL,
    ADD COLUMN `hasExit` BOOLEAN NOT NULL DEFAULT false;
