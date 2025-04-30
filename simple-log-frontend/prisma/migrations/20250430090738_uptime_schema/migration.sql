-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "monitoring_enabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UptimeLog" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER,
    "status" INTEGER NOT NULL DEFAULT 0,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isOnline" BOOLEAN NOT NULL DEFAULT true,
    "responseTime" TEXT,

    CONSTRAINT "UptimeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UptimeLog_project_id_idx" ON "UptimeLog"("project_id");

-- AddForeignKey
ALTER TABLE "UptimeLog" ADD CONSTRAINT "UptimeLog_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
