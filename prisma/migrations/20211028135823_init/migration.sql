/*
  Warnings:

  - You are about to drop the column `comments_count` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `likes_count` on the `post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_ibfk_1`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_ibfk_2`;

-- AlterTable
ALTER TABLE `comment` MODIFY `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

-- AlterTable
ALTER TABLE `post` DROP COLUMN `comments_count`,
    DROP COLUMN `likes_count`,
    MODIFY `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `img_url` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `img_url` VARCHAR(255) NULL DEFAULT 'http://localhost:3000/images/default.jpg';

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `comment` RENAME INDEX `comment_author_id_index` TO `author_id`;

-- RenameIndex
ALTER TABLE `comment` RENAME INDEX `comment_post_id_index` TO `post_id`;

-- RenameIndex
ALTER TABLE `like` RENAME INDEX `like_author_id_index` TO `author_id`;

-- RenameIndex
ALTER TABLE `like` RENAME INDEX `like_target_id_index` TO `target_id`;

-- RenameIndex
ALTER TABLE `post` RENAME INDEX `post_author_id_index` TO `author_id`;
