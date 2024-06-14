/*
  Warnings:

  - You are about to drop the column `sourceId` on the `userwallet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `userwallet` DROP FOREIGN KEY `UserWallet_sourceId_fkey`;

-- AlterTable
ALTER TABLE `userwallet` DROP COLUMN `sourceId`,
    ADD COLUMN `source` JSON NULL;
