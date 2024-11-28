/*
  Warnings:

  - Made the column `recoveryEmail` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "recoveryEmail" SET NOT NULL,
ALTER COLUMN "recoveryEmail" SET DEFAULT 'Unlinked';
