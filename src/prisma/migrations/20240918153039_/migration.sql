/*
  Warnings:

  - You are about to drop the column `sportSubCategoryId` on the `athleteinfo` table. All the data in the column will be lost.
  - You are about to drop the `sportsubcategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `athleteinfo` DROP FOREIGN KEY `AthleteInfo_sportSubCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `sportsubcategories` DROP FOREIGN KEY `SportSubCategories_sportId_fkey`;

-- AlterTable
ALTER TABLE `athleteinfo` DROP COLUMN `sportSubCategoryId`,
    ADD COLUMN `sportId` INTEGER NULL;

-- DropTable
DROP TABLE `sportsubcategories`;

-- AddForeignKey
ALTER TABLE `AthleteInfo` ADD CONSTRAINT `AthleteInfo_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `Sports`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
