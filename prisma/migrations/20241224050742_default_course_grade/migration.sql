/*
  Warnings:

  - The `grade` column on the `courses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "grade",
ADD COLUMN     "grade" DOUBLE PRECISION DEFAULT -1;
