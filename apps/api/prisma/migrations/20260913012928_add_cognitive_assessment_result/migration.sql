-- CreateTable
CREATE TABLE "CognitiveAssessmentResult" (
    "id" TEXT NOT NULL,
    "appVersion" TEXT,
    "status" TEXT NOT NULL,
    "participantName" TEXT NOT NULL,
    "participantAge" INTEGER,
    "participantEmail" TEXT,
    "participantSchool" TEXT,
    "purpose" TEXT,
    "parentName" TEXT,
    "relationship" TEXT,
    "consentRecord" JSONB,
    "domainScores" JSONB,
    "rawModuleData" JSONB,
    "overallScore" INTEGER,
    "resultLevel" TEXT,
    "paymentReference" JSONB,
    "integrityEvents" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CognitiveAssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CognitiveAssessmentResult_createdAt_idx" ON "CognitiveAssessmentResult"("createdAt");
