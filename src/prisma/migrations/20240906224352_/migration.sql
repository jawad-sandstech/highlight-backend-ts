-- AlterTable
ALTER TABLE `usernotifications` MODIFY `notificationType` ENUM('PRIVATE_CHAT', 'GROUP_CHAT', 'JOB_APPLICATION') NOT NULL;
