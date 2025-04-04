/*
  Warnings:

  - Added the required column `updatedAt` to the `ClaimForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ExpertAndAdministrationAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TravellingAndSubsistence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClaimForm" DROP CONSTRAINT "ClaimForm_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExpertAndAdministrationAllowance" DROP CONSTRAINT "ExpertAndAdministrationAllowance_claimId_fkey";

-- DropIndex
DROP INDEX "ClaimForm_userId_key";

-- AlterTable
ALTER TABLE "ClaimForm" ADD COLUMN     "acquittalStatus" TEXT,
ADD COLUMN     "acquittedAmount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "extraClaimAmount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "refundAmount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "checkedBy" DROP NOT NULL,
ALTER COLUMN "approvedBy" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL,
ALTER COLUMN "advanceAmount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ExpertAndAdministrationAllowance" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "total" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "claimId" DROP NOT NULL,
ALTER COLUMN "designation" DROP NOT NULL,
ALTER COLUMN "activity" DROP NOT NULL,
ALTER COLUMN "allowance" DROP NOT NULL,
ALTER COLUMN "units" DROP NOT NULL,
ALTER COLUMN "rate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TravellingAndSubsistence" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "total" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "fromPlace" DROP NOT NULL,
ALTER COLUMN "toPlace" DROP NOT NULL,
ALTER COLUMN "dateDeparture" DROP NOT NULL,
ALTER COLUMN "dateArrived" DROP NOT NULL,
ALTER COLUMN "board" DROP NOT NULL,
ALTER COLUMN "breakfast" DROP NOT NULL,
ALTER COLUMN "lunch" DROP NOT NULL,
ALTER COLUMN "dinner" DROP NOT NULL,
ALTER COLUMN "fares" DROP NOT NULL,
ALTER COLUMN "supper" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "ecno" DROP NOT NULL,
ALTER COLUMN "idno" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "bankname" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "branch" DROP NOT NULL,
ALTER COLUMN "accountNumber" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ClaimForm" ADD CONSTRAINT "ClaimForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpertAndAdministrationAllowance" ADD CONSTRAINT "ExpertAndAdministrationAllowance_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "ClaimForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
