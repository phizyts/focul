/*
  Warnings:

  - The values [google,github,discord] on the enum `linkedAccounts` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "linkedAccounts_new" AS ENUM ('Google', 'Github', 'Discord');
ALTER TABLE "user" ALTER COLUMN "linkedAccounts" TYPE "linkedAccounts_new"[] USING ("linkedAccounts"::text::"linkedAccounts_new"[]);
ALTER TYPE "linkedAccounts" RENAME TO "linkedAccounts_old";
ALTER TYPE "linkedAccounts_new" RENAME TO "linkedAccounts";
DROP TYPE "linkedAccounts_old";
COMMIT;
