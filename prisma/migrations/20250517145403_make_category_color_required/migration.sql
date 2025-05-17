/*
  Warnings:

  - Made the column `color` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "color" SET NOT NULL;
