/*
  Warnings:

  - You are about to drop the column `lokation` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "lokation",
ADD COLUMN     "location" TEXT;
