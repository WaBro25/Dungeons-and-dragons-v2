-- AlterTable: rename column monsterId -> monsterName
ALTER TABLE "Note" RENAME COLUMN "monsterId" TO "monsterName";

-- Rename the unique index to match new column name (PostgreSQL)
ALTER INDEX "Note_monsterId_key" RENAME TO "Note_monsterName_key";

