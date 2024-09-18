/*
  Warnings:

  - You are about to drop the column `userId` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SharedFolder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- DropForeignKey
ALTER TABLE "SharedFolder" DROP CONSTRAINT "SharedFolder_userId_fkey";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "SharedFolder" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "SharedFile" (
    "id" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "shareLink" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SharedFile" ADD CONSTRAINT "SharedFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
