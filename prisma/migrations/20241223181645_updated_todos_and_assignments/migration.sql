/*
  Warnings:

  - The values [english,chinese,spanish,french] on the enum `Lang` will be removed. If these variants are still used in the database, this will fail.
  - The values [user,admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `assignments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `assignments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `reminder` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('Pending', 'Completed', 'Overdue', 'Graded');

-- CreateEnum
CREATE TYPE "TodoStatus" AS ENUM ('Pending', 'Completed', 'Overdue');

-- AlterEnum
BEGIN;
CREATE TYPE "Lang_new" AS ENUM ('English', 'Chinese', 'Spanish', 'French');
ALTER TABLE "user" ALTER COLUMN "language" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "language" TYPE "Lang_new" USING ("language"::text::"Lang_new");
ALTER TYPE "Lang" RENAME TO "Lang_old";
ALTER TYPE "Lang_new" RENAME TO "Lang";
DROP TYPE "Lang_old";
ALTER TABLE "user" ALTER COLUMN "language" SET DEFAULT 'English';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('User', 'Admin');
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;

-- DropForeignKey
ALTER TABLE "reminder" DROP CONSTRAINT "reminder_userId_fkey";

-- AlterTable
ALTER TABLE "assignments" DROP COLUMN "status",
ADD COLUMN     "status" "AssignmentStatus" NOT NULL DEFAULT 'Pending',
DROP COLUMN "type",
ADD COLUMN     "type" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'User',
ALTER COLUMN "language" SET DEFAULT 'English';

-- DropTable
DROP TABLE "reminder";

-- DropEnum
DROP TYPE "AssignmentType";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "todos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desciption" TEXT,
    "status" "TodoStatus" NOT NULL DEFAULT 'Pending',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
