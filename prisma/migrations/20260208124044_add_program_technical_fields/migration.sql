-- DropForeignKey
ALTER TABLE "AffiliateProfile" DROP CONSTRAINT "AffiliateProfile_universityId_fkey";

-- AlterTable
ALTER TABLE "AffiliateProfile" ADD COLUMN     "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
ALTER COLUMN "universityId" DROP NOT NULL,
ALTER COLUMN "rewardType" SET DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "academicInfo" JSONB,
ADD COLUMN     "personalInfo" JSONB;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "intake" TEXT,
ADD COLUMN     "level" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "tuition" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "academicInfo" JSONB,
ADD COLUMN     "documents" JSONB,
ADD COLUMN     "personalInfo" JSONB,
ADD COLUMN     "profilePhoto" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AffiliateProfile" ADD CONSTRAINT "AffiliateProfile_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
