/*
  Warnings:

  - Made the column `exitedAt` on table `participants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `participants` MODIFY `exitedAt` DATETIME(3) NOT NULL;
