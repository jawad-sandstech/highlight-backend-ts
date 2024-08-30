/*
  Warnings:

  - Added the required column `agenda` to the `UserSchedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userschedules` ADD COLUMN `agenda` VARCHAR(191) NOT NULL;
