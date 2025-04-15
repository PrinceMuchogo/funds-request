-- CreateTable
CREATE TABLE "SupportingDocument" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "claimId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportingDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SupportingDocument" ADD CONSTRAINT "SupportingDocument_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "ClaimForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
