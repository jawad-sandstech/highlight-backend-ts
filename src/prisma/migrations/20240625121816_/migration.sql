-- AlterTable
ALTER TABLE `users` ADD COLUMN `hasUpdatedAthleteInfo` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasUpdatedBusinessInfo` BOOLEAN NOT NULL DEFAULT false;
