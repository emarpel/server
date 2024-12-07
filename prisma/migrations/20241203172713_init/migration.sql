-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `userCellphone` VARCHAR(191) NOT NULL,
    `userLogin` VARCHAR(191) NOT NULL,
    `userPassword` VARCHAR(191) NOT NULL,
    `userPermission` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_userEmail_key`(`userEmail`),
    UNIQUE INDEX `User_userLogin_key`(`userLogin`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
