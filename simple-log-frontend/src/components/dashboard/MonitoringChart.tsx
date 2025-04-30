import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "./MonitoringTooltip";

interface MonitoringChartProps {
  chartData: Array<{
    checkedAt: Date;
    responseTime: number | null;
  }>;
  timeRange: "day" | "week" | "month";
  setTimeRange: (range: "day" | "week" | "month") => void;
}

export const MonitoringChart = ({
  chartData,
  timeRange,
  setTimeRange,
}: MonitoringChartProps) => {
  return (
    <CardContent>
      <div className="h-[400px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="checkedAt"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(time) =>
                new Date(time).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
              }
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}ms`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4">
        <Button
          variant={timeRange === "day" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("day")}
        >
          Day
        </Button>
        <Button
          variant={timeRange === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("week")}
        >
          Week
        </Button>
        <Button
          variant={timeRange === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("month")}
        >
          Month
        </Button>
      </div>
    </CardContent>
  );
};
