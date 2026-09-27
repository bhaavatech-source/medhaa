CREATE TABLE "AppUsageDaily" (
    "day" DATE NOT NULL,
    "firstOpens" INTEGER NOT NULL DEFAULT 0,
    "foregroundSessions" INTEGER NOT NULL DEFAULT 0,
    "foregroundSeconds" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppUsageDaily_pkey" PRIMARY KEY ("day")
);