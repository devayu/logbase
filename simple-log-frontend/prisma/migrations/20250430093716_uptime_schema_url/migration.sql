/*
  Warnings:

  - The `responseTime` column on the `UptimeLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UptimeLog" DROP COLUMN "responseTime",
ADD COLUMN     "responseTime" INTEGER;
