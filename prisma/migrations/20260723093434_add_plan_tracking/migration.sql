/*
  Warnings:

  - You are about to drop the column `whatsappPhoneId` on the `GlobalSettings` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappToken` on the `GlobalSettings` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappVerifyToken` on the `GlobalSettings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthToken" DROP CONSTRAINT "AuthToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "GlobalSettings" DROP COLUMN "whatsappPhoneId",
DROP COLUMN "whatsappToken",
DROP COLUMN "whatsappVerifyToken",
ADD COLUMN     "weeklyNaira" DOUBLE PRECISION NOT NULL DEFAULT 59000,
ADD COLUMN     "weeklyUsd" DOUBLE PRECISION NOT NULL DEFAULT 49.3,
ALTER COLUMN "singleNaira" SET DEFAULT 20000,
ALTER COLUMN "monthlyUsd" SET DEFAULT 100;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "responderMode" TEXT NOT NULL DEFAULT 'AI';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "planActivatedAt" TIMESTAMP(3),
ADD COLUMN     "planExpiresAt" TIMESTAMP(3),
ADD COLUMN     "planName" TEXT;

-- CreateIndex
CREATE INDEX "AuthToken_userId_idx" ON "AuthToken"("userId");

-- CreateIndex
CREATE INDEX "Message_sessionId_idx" ON "Message"("sessionId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
