/*
  Warnings:

  - You are about to drop the column `text` on the `feedback` table. All the data in the column will be lost.
  - Added the required column `description` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `feedback` DROP COLUMN `text`,
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `subject` TEXT NOT NULL;
