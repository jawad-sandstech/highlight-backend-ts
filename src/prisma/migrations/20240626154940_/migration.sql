/*
  Warnings:

  - You are about to drop the column `year` on the `athleteinfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `athleteinfo` DROP COLUMN `year`,
    ADD COLUMN `experience` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'ELITE', 'RECREATIONAL', 'SEMI_PROFESSIONAL', 'PROFESSIONAL') NULL,
    ADD COLUMN `universityName` VARCHAR(191) NULL;
