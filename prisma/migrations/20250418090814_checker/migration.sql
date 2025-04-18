-- AddForeignKey
ALTER TABLE "ClaimForm" ADD CONSTRAINT "ClaimForm_checkedBy_fkey" FOREIGN KEY ("checkedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
