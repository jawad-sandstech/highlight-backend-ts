/*
  Warnings:

  - You are about to drop the column `messageId` on the `files` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `Files_messageId_fkey`;

-- AlterTable
ALTER TABLE `files` DROP COLUMN `messageId`;

-- AlterTable
ALTER TABLE `messages` ADD COLUMN `fileId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `AthleteInfo` ADD CONSTRAINT `AthleteInfo_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `Sports`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `Files`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
