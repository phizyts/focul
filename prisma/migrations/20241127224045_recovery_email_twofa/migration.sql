-- AlterTable
ALTER TABLE "user" ADD COLUMN     "recoveryEmail" TEXT,
ADD COLUMN     "recoveryEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "location" SET DEFAULT 'Country: Unset';
