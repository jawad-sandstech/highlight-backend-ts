/*
  Warnings:

  - You are about to drop the column `sportId` on the `athleteinfo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `athleteinfo` DROP FOREIGN KEY `AthleteInfo_sportId_fkey`;

-- AlterTable
ALTER TABLE `athleteinfo` DROP COLUMN `sportId`,
    ADD COLUMN `sportSubCategoryId` INTEGER NULL;

-- CreateTable
CREATE TABLE `SportSubCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sportId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AthleteInfo` ADD CONSTRAINT `AthleteInfo_sportSubCategoryId_fkey` FOREIGN KEY (`sportSubCategoryId`) REFERENCES `SportSubCategories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SportSubCategories` ADD CONSTRAINT `SportSubCategories_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `Sports`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
