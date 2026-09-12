-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLoginAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ParentConsent" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL,
    "consentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,

    CONSTRAINT "ParentConsent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ParentConsent_parentId_idx" ON "ParentConsent"("parentId");
