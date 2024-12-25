/*
  Warnings:

  - You are about to drop the column `desciption` on the `notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT;
