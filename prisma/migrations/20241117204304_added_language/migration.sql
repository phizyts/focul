-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('english', 'chinese', 'spanish', 'french');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "language" "Lang" NOT NULL DEFAULT 'english';
