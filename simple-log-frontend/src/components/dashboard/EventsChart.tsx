import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventData } from "@/types";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-xs" style={{ color: entry.color }}>
          {`${entry.name}: ${entry.value}`}
        </p>
      ))}
    </div>
  );
};
export const EventsChart = ({
  data,
  timeRange,
  onTimeRangeChange,
}: {
  data: EventData[] | undefined;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}) => (
  <Card className="col-span-full lg:col-span-4 border border-border/30">
    <CardHeader>
      <CardTitle>Event Analytics</CardTitle>
      <CardDescription>Event distribution over time</CardDescription>
      <Tabs
        defaultValue="7d"
        className="w-[300px]"
        value={timeRange}
        onValueChange={onTimeRangeChange}
      >
        <TabsList>
          <TabsTrigger value="7d" className="cursor-pointer">
            7d
          </TabsTrigger>
          <TabsTrigger value="14d" className="cursor-pointer">
            14d
          </TabsTrigger>
          <TabsTrigger value="30d" className="cursor-pointer">
            30d
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
    <CardContent className="pl-2">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            strokeOpacity={0.2}
          />
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="events"
            name="Events"
            stroke="#FFDA1D"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="uniqueUsers"
            name="Unique Users"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);
