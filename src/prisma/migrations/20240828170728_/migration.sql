/*
  Warnings:

  - Added the required column `chatId` to the `UserSchedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userschedules` ADD COLUMN `chatId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `UserSchedules` ADD CONSTRAINT `UserSchedules_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chats`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
