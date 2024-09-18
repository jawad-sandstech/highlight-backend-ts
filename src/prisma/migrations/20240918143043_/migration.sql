/*
  Warnings:

  - You are about to drop the column `instagramFollowersCount` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `instagramUsername` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `instagramFollowersCount`,
    DROP COLUMN `instagramUsername`;
