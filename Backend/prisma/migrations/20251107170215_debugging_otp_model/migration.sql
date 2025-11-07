/*
  Warnings:

  - Changed the type of `otp` on the `otp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "otp" DROP COLUMN "otp",
ADD COLUMN     "otp" INTEGER NOT NULL;
