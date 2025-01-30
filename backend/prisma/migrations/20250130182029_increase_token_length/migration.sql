/*
  Warnings:

  - You are about to drop the `ChargeliAccount` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `webhook_token` on table `MetaIntegration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `webhook_port` on table `MetaIntegration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `webhook_url` on table `MetaIntegration` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ChargeliAccount` DROP FOREIGN KEY `ChargeliAccount_store_id_fkey`;

-- AlterTable
ALTER TABLE `MetaIntegration` MODIFY `webhook_token` VARCHAR(191) NOT NULL,
    MODIFY `webhook_port` INTEGER NOT NULL,
    MODIFY `webhook_url` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `ChargeliAccount`;

-- CreateTable
CREATE TABLE `ChargiliAccount` (
    `id` VARCHAR(191) NOT NULL,
    `store_id` VARCHAR(191) NOT NULL,
    `SECRET_KEY` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ChargiliAccount_store_id_key`(`store_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChargiliAccount` ADD CONSTRAINT `ChargiliAccount_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
