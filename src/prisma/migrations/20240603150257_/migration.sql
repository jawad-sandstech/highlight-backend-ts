/*
  Warnings:

  - The values [PHOTOSHOOTS] on the enum `Jobs_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `jobs` MODIFY `type` ENUM('SOCIAL_MEDIA', 'MEET_AND_GREET', 'AUTOGRAPHS', 'PHOTO_SHOOTS', 'OTHER') NOT NULL;
