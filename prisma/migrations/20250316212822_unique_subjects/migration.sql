/*
  Warnings:

  - A unique constraint covering the columns `[from,to,subject]` on the table `Context` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subject` to the `Context` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Context_from_to_key";

-- AlterTable
ALTER TABLE "Context" ADD COLUMN     "subject" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Context_from_to_subject_key" ON "Context"("from", "to", "subject");
