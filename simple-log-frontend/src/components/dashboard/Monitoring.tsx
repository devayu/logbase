"use client";

import {
  deleteMonitoringSchedule,
  scheduleMonitoring,
  updateProjectMonitoringUrl,
  UptimeOverviewT,
} from "@/actions/monitoring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  cn,
  formatDate,
  getColorForEventType,
  normalizeUrl,
} from "@/lib/utils";
import { Project } from "@prisma/client";
import { Edit, Info, Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MonitoringChart } from "./MonitoringChart";
import { MonitoringStats } from "./MonitoringStats";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MonitoringUrlTooltip } from "@/components/dashboard/MonitoringUrlTooltip";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Monitoring = ({
  project,
  monitoringOverview,
}: {
  project: Project | null;
  monitoringOverview: UptimeOverviewT | null;
}) => {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(!project?.monitoringEnabled);
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(project?.monitoringUrl ?? "");
  const [chartData, setChartData] = useState<
    {
      checkedAt: Date;
      responseTime: number | null;
    }[]
  >([]);

  useEffect(() => {
    if (!monitoringOverview) return;
    const data = generateData();
    setChartData(data);
  }, [timeRange]);

  const generateData = () => {
    return monitoringOverview?.logs[timeRange] ?? [];
  };

  const handleMonitoringToggle = async () => {
    if (!project?.id) return;

    if (isPaused) {
      toast.promise(scheduleMonitoring(project.id), {
        loading: `Resuming monitoring...`,
        success: () => {
          router.refresh();
          return `Monitoring resumed successfully!`;
        },
        error:
          "An error occurred while toggling monitoring status. Please try again later.",
      });
    } else {
      toast.promise(deleteMonitoringSchedule(project.id), {
        loading: "Pausing monitoring...",
        success: () => {
          router.refresh();
          return "Monitoring paused successfully!";
        },
        error:
          "An error occurred while toggling monitoring status. Please try again later.",
      });
    }
    setIsPaused(!isPaused);
  };

  const handleUpdateUrl = async () => {
    if (!project?.id) return;
    toast.promise(
      updateProjectMonitoringUrl({
        projectId: project.id,
        updatedUrl: editUrl,
      }),
      {
        loading: "Updating monitoring url...",
        success: () => {
          router.refresh();
          setIsEditing(false);
          return `Updated monitoring url -`;
        },
        description: () => `${editUrl}`,
        error:
          "An error occurred while trying to set the new monitoring url. Please try again later.",
      }
    );
  };
  const hasChanges =
    project?.monitoringUrl &&
    project.monitoringUrl !== editUrl &&
    editUrl !== "";

  console.log(hasChanges);
  return (
    <div className="w-full gap-4 flex flex-col">
      <MonitoringStats monitoringOverview={monitoringOverview} />
      <Card className="mb-6 w-full">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="w-full max-w-xl">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    `h-2 w-2 rounded-full animate-pulse`,
                    getColorForEventType(
                      monitoringOverview?.isOffline ?? false,
                      !project?.monitoringEnabled
                    )
                  )}
                />
                {isEditing ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="Enter monitoring URL"
                    />
                    <Button
                      size="sm"
                      onClick={handleUpdateUrl}
                      disabled={!hasChanges}
                      className="flex items-center gap-2"
                    >
                      Update
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">
                      {normalizeUrl(project?.monitoringUrl ?? "")}
                    </CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild className="bg-transparent">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                          >
                            <Edit className="h-4 w-4"></Edit>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-muted">
                          <p className=" text-white">
                            This is the url which is currenly being monitored,
                            click to edit.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mt-4">
                <p className="text-sm text-muted-foreground mt-1">
                  Last checked:{" "}
                  {formatDate(
                    monitoringOverview?.lastCheckedAt ?? new Date(),
                    true,
                    true
                  )}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMonitoringToggle}
                  className="flex items-center gap-2"
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4" />
                      Resume Monitoring
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause Monitoring
                    </>
                  )}
                </Button>
                <StatusBadge
                  isDown={monitoringOverview?.isOffline}
                  isPaused={!project?.monitoringEnabled}
                ></StatusBadge>
              </div>
            </div>
          </div>
        </CardHeader>
        <MonitoringChart
          chartData={chartData}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
      </Card>
    </div>
  );
};

export default Monitoring;
