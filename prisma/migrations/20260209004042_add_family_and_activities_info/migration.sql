-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "activitiesInfo" JSONB,
ADD COLUMN     "familyInfo" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activitiesInfo" JSONB,
ADD COLUMN     "familyInfo" JSONB;
