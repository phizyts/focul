-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('AP', 'IB', 'Honors', 'Regular');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "type" "CourseType" NOT NULL DEFAULT 'Regular';
