/*
  Warnings:

  - Added the required column `notificationType` to the `UserNotifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usernotifications` ADD COLUMN `hasSeen` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `metadata` JSON NULL,
    ADD COLUMN `notificationType` ENUM('PRIVATE_CHAT', 'GROUP_CHAT') NOT NULL;
