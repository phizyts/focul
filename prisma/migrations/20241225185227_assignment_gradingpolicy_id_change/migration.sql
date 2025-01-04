/*
  Warnings:

  - The primary key for the `assignmentType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `gradingPolicy` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_assignmentTypeId_fkey";

-- DropForeignKey
ALTER TABLE "assignmentType" DROP CONSTRAINT "assignmentType_gradingPolicyId_fkey";

-- AlterTable
ALTER TABLE "assignment" ALTER COLUMN "assignmentTypeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "assignmentType" DROP CONSTRAINT "assignmentType_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "gradingPolicyId" SET DATA TYPE TEXT,
ADD CONSTRAINT "assignmentType_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "assignmentType_id_seq";

-- AlterTable
ALTER TABLE "gradingPolicy" DROP CONSTRAINT "gradingPolicy_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "gradingPolicy_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "gradingPolicy_id_seq";

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_assignmentTypeId_fkey" FOREIGN KEY ("assignmentTypeId") REFERENCES "assignmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignmentType" ADD CONSTRAINT "assignmentType_gradingPolicyId_fkey" FOREIGN KEY ("gradingPolicyId") REFERENCES "gradingPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
