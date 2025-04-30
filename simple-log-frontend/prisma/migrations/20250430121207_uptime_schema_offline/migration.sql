/*
  Warnings:

  - You are about to drop the column `isOnline` on the `UptimeLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UptimeLog" DROP COLUMN "isOnline",
ADD COLUMN     "isOffline" BOOLEAN NOT NULL DEFAULT false;
