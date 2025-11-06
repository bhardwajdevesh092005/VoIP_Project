/*
  Warnings:

  - You are about to drop the column `profile` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isEmailAuth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isGoogleAuth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profile",
ADD COLUMN     "ceatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isEmailAuth" BOOLEAN NOT NULL,
ADD COLUMN     "isGoogleAuth" BOOLEAN NOT NULL,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "call" (
    "callId" SERIAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "call_pkey" PRIMARY KEY ("callId")
);

-- CreateTable
CREATE TABLE "_UserTocall" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserTocall_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserTocall_B_index" ON "_UserTocall"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "_UserTocall" ADD CONSTRAINT "_UserTocall_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserTocall" ADD CONSTRAINT "_UserTocall_B_fkey" FOREIGN KEY ("B") REFERENCES "call"("callId") ON DELETE CASCADE ON UPDATE CASCADE;
