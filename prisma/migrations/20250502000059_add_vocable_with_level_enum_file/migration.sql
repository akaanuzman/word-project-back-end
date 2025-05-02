/*
  Warnings:

  - Changed the type of `level` on the `vocable` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "vocable" DROP COLUMN "level",
ADD COLUMN     "level" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Level";
