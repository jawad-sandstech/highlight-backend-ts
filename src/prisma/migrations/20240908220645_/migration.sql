-- AddForeignKey
ALTER TABLE `UserNotifications` ADD CONSTRAINT `UserNotifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
