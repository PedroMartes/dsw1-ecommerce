/*
  Warnings:

  - Added the required column `userId` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- Delete existing cart items since they are global and not associated with users
DELETE FROM `cartitem`;

-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `cartItems_userId_fkey` ON `CartItem`(`userId`);

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
