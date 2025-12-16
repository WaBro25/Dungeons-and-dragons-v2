/*
  Warnings:

  - A unique constraint covering the columns `[monsterId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "monsterId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Note_monsterId_key" ON "Note"("monsterId");
