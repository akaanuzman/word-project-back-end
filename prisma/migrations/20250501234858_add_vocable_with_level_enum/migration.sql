/*
  Warnings:

  - You are about to drop the `level` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- DropTable
DROP TABLE "level";

-- CreateTable
CREATE TABLE "vocable" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "translate" VARCHAR(200) NOT NULL,
    "level" "Level" NOT NULL,

    CONSTRAINT "vocable_pkey" PRIMARY KEY ("id")
);
