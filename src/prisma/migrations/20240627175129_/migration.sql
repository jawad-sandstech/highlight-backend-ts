/*
  Warnings:

  - You are about to drop the column `fileId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `Messages_fileId_fkey`;

-- AlterTable
ALTER TABLE `messages` DROP COLUMN `fileId`,
    ADD COLUMN `attachment` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `files`;
