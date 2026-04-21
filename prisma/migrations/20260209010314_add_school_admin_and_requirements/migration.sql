-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SCHOOL_ADMIN';

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "applicationRequirements" JSONB,
ADD COLUMN     "settings" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "managedSchoolId" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managedSchoolId_fkey" FOREIGN KEY ("managedSchoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;
