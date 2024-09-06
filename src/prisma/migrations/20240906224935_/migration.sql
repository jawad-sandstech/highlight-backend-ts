/*
  Warnings:

  - The values [JOB_SELECTION] on the enum `UserNotifications_notificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `usernotifications` MODIFY `notificationType` ENUM('PRIVATE_CHAT', 'GROUP_CHAT', 'JOB_APPLICATION', 'APPLICATION_WAIT_LISTED', 'APPLICATION_REJECTED', 'APPLICATION_SELECTED', 'JOB_COMPLETED') NOT NULL;
