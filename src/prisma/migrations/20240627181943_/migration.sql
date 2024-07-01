/*
  Warnings:

  - You are about to drop the column `userId` on the `userschedules` table. All the data in the column will be lost.
  - Added the required column `attendeeId` to the `UserSchedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizerId` to the `UserSchedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `userschedules` DROP FOREIGN KEY `UserSchedules_userId_fkey`;

-- AlterTable
ALTER TABLE `userschedules` DROP COLUMN `userId`,
    ADD COLUMN `attendeeId` INTEGER NOT NULL,
    ADD COLUMN `organizerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `UserSchedules` ADD CONSTRAINT `UserSchedules_organizerId_fkey` FOREIGN KEY (`organizerId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSchedules` ADD CONSTRAINT `UserSchedules_attendeeId_fkey` FOREIGN KEY (`attendeeId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
