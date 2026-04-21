/*
  Warnings:

  - You are about to drop the column `schoolId` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `managedSchoolId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SavedSchool` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `School` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UniversityStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DRAFT');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "SavedSchool" DROP CONSTRAINT "SavedSchool_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "SavedSchool" DROP CONSTRAINT "SavedSchool_userId_fkey";

-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_universityId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_managedSchoolId_fkey";

-- AlterTable
ALTER TABLE "AffiliateProfile" ADD COLUMN     "countryId" TEXT;

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "acceptanceLetterUrl" TEXT,
ADD COLUMN     "enrollmentDetailsUrl" TEXT,
ADD COLUMN     "reviewData" JSONB;

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "schoolId",
ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "majors" TEXT[];

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "applicationRequirements" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "settings" JSONB,
ADD COLUMN     "status" "UniversityStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tuition" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "managedSchoolId",
ADD COLUMN     "managedUniversityId" TEXT,
ADD COLUMN     "residenceCountryId" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "SavedSchool";

-- DropTable
DROP TABLE "School";

-- CreateTable
CREATE TABLE "QuestionnaireQuestion" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'select',
    "category" TEXT NOT NULL DEFAULT 'PROSPECT',
    "placeholder" TEXT,
    "options" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionnaireQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedUniversity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedUniversity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionnaireQuestion_key_key" ON "QuestionnaireQuestion"("key");

-- CreateIndex
CREATE UNIQUE INDEX "SavedUniversity_userId_universityId_key" ON "SavedUniversity"("userId", "universityId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "AffiliateProfile_countryId_status_idx" ON "AffiliateProfile"("countryId", "status");

-- CreateIndex
CREATE INDEX "Application_prospectId_status_idx" ON "Application"("prospectId", "status");

-- CreateIndex
CREATE INDEX "Program_universityId_level_idx" ON "Program"("universityId", "level");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_residenceCountryId_fkey" FOREIGN KEY ("residenceCountryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managedUniversityId_fkey" FOREIGN KEY ("managedUniversityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateProfile" ADD CONSTRAINT "AffiliateProfile_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedUniversity" ADD CONSTRAINT "SavedUniversity_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedUniversity" ADD CONSTRAINT "SavedUniversity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
