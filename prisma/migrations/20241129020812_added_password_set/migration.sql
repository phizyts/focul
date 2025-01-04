/*
  Warnings:

  - You are about to drop the column `recoveryEmail` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `recoveryEmailVerified` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "recoveryEmail",
DROP COLUMN "recoveryEmailVerified",
ADD COLUMN     "passwordSet" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "location" SET DEFAULT 'Location Not Set';
