-- AlterTable
ALTER TABLE `jobs` MODIFY `sportId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Jobs` ADD CONSTRAINT `Jobs_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `Sports`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
