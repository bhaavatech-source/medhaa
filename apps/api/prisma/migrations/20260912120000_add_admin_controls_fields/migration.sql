-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "tier" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
