-- CreateEnum
CREATE TYPE "DestinationEmails" AS ENUM ('FLIRT', 'POEMS', 'RANT', 'THERAPY', 'ROAST', 'YEARN');

-- CreateTable
CREATE TABLE "Context" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" "DestinationEmails" NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Context_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Context_from_to_key" ON "Context"("from", "to");
