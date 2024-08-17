-- CreateTable
CREATE TABLE `MessageStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `seen` BOOLEAN NOT NULL DEFAULT false,
    `seenAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MessageStatus` ADD CONSTRAINT `MessageStatus_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MessageStatus` ADD CONSTRAINT `MessageStatus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
