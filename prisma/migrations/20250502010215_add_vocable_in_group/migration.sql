/*
  Warnings:

  - You are about to drop the column `translate` on the `vocable` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "vocable" DROP COLUMN "translate",
ADD COLUMN     "vocableGroupId" INTEGER,
ALTER COLUMN "level" DROP NOT NULL;
