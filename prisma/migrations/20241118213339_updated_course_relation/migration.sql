/*
  Warnings:

  - You are about to drop the column `course_id` on the `assignments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `reminder` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reminder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_course_id_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_userId_fkey";

-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reminder" DROP CONSTRAINT "reminder_user_id_fkey";

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "course_id",
ADD COLUMN     "courseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reminder" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder" ADD CONSTRAINT "reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
