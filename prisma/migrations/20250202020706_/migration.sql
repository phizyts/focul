/*
  Warnings:

  - You are about to drop the column `desciption` on the `tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "desciption",
ADD COLUMN     "description" TEXT;
