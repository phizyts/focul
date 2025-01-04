/*
  Warnings:

  - You are about to drop the column `desciption` on the `assignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "assignment" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT;
