/*
  Warnings:

  - You are about to drop the column `subject` on the `Context` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[from,to]` on the table `Context` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Context_from_to_subject_key";

-- AlterTable
ALTER TABLE "Context" DROP COLUMN "subject";

-- CreateIndex
CREATE UNIQUE INDEX "Context_from_to_key" ON "Context"("from", "to");
