/*
  Warnings:

  - You are about to drop the `assignments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assignments" DROP CONSTRAINT "assignments_courseId_fkey";

-- DropTable
DROP TABLE "assignments";

-- CreateTable
CREATE TABLE "assignment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "assignmentTypeId" INTEGER NOT NULL,
    "desciption" TEXT,
    "grade" DOUBLE PRECISION,
    "maxGrade" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignmentType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" DOUBLE PRECISION NOT NULL,
    "gradingPolicyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignmentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gradingPolicy" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scale" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gradingPolicy_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_assignmentTypeId_fkey" FOREIGN KEY ("assignmentTypeId") REFERENCES "assignmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignmentType" ADD CONSTRAINT "assignmentType_gradingPolicyId_fkey" FOREIGN KEY ("gradingPolicyId") REFERENCES "gradingPolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gradingPolicy" ADD CONSTRAINT "gradingPolicy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
