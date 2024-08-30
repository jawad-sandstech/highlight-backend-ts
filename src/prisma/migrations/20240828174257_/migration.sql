/*
  Warnings:

  - You are about to drop the column `jobId` on the `userschedules` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `userschedules` DROP FOREIGN KEY `UserSchedules_jobId_fkey`;

-- AlterTable
ALTER TABLE `userschedules` DROP COLUMN `jobId`;
