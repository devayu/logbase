import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import { UptimeOverviewT } from "@/actions/monitoring";

interface MonitoringStatsProps {
  monitoringOverview: UptimeOverviewT | null;
}

export const MonitoringStats = ({
  monitoringOverview,
}: MonitoringStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="gap-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-muted-foreground font-normal">
            {monitoringOverview?.isOffline
              ? "Time up for before down"
              : "Currently up for"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monitoringOverview?.isOffline
              ? formatDuration(monitoringOverview?.timeUpForBeforeDown ?? 0)
              : formatDuration(monitoringOverview?.currentlyUpFor ?? 0)}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm text-muted-foreground font-normal">
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monitoringOverview?.availabilityPercentage?.toFixed(0)}%
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm text-muted-foreground font-normal">
            Response Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monitoringOverview?.averageResponseTime}ms
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
