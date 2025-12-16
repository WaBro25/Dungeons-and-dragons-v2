-- CreateTable "hit points" with quoted identifiers (PostgreSQL)
CREATE TABLE "hit points" (
  "id" SERIAL NOT NULL,
  "monsterName" TEXT NOT NULL,
  "hit points" INTEGER NOT NULL,
  CONSTRAINT "hit points_pkey" PRIMARY KEY ("id")
);

-- Unique index to ensure one row per monster
CREATE UNIQUE INDEX "hit points_monsterName_key" ON "hit points"("monsterName");

