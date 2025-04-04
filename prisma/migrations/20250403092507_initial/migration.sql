-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ecno" TEXT NOT NULL,
    "idno" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bankname" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimForm" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "station" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "checkedBy" TEXT NOT NULL,
    "approvedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "advanceAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ClaimForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravellingAndSubsistence" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "fromPlace" TEXT NOT NULL,
    "toPlace" TEXT NOT NULL,
    "dateDeparture" TIMESTAMP(3) NOT NULL,
    "dateArrived" TIMESTAMP(3) NOT NULL,
    "board" DOUBLE PRECISION NOT NULL,
    "breakfast" DOUBLE PRECISION NOT NULL,
    "lunch" DOUBLE PRECISION NOT NULL,
    "dinner" DOUBLE PRECISION NOT NULL,
    "fares" DOUBLE PRECISION NOT NULL,
    "supper" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TravellingAndSubsistence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpertAndAdministrationAllowance" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "allowance" DOUBLE PRECISION NOT NULL,
    "units" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ExpertAndAdministrationAllowance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ecno_key" ON "User"("ecno");

-- CreateIndex
CREATE UNIQUE INDEX "User_idno_key" ON "User"("idno");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimForm_userId_key" ON "ClaimForm"("userId");

-- AddForeignKey
ALTER TABLE "ClaimForm" ADD CONSTRAINT "ClaimForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravellingAndSubsistence" ADD CONSTRAINT "TravellingAndSubsistence_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "ClaimForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpertAndAdministrationAllowance" ADD CONSTRAINT "ExpertAndAdministrationAllowance_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "ClaimForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
