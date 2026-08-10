-- DropIndex
DROP INDEX "Game_slug_key";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "ageLabel" TEXT,
ADD COLUMN     "skills" TEXT[],
ALTER COLUMN "isFreeTier" DROP DEFAULT;

-- CreateTable
CREATE TABLE "CognitiveCheckIn" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CognitiveCheckIn_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CognitiveCheckIn" ADD CONSTRAINT "CognitiveCheckIn_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
