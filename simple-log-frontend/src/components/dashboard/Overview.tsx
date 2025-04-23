"use client";

import { EventsTable } from "@/components/dashboard/EventsTable";
import { useEffect, useState, useMemo } from "react";
import { BarChart3, Layers } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEventsOverview } from "@/hooks/useEvents";
import { Project } from "@/hooks/useProjects";

// Types
interface EventData {
  date: string;
  events: number;
  uniqueUsers: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
}

// Components
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

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) => (
  <Card className="border border-border/30">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div
          className={`mt-2 text-xs ${
            trend.positive ? "text-green-500" : "text-destructive"
          }`}
        >
          {trend.positive ? "+" : "-"}
          {trend.value}% {trend.label}
        </div>
      )}
    </CardContent>
  </Card>
);

const EventsChart = ({
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
          <TabsTrigger value="7d">7d</TabsTrigger>
          <TabsTrigger value="14d">14d</TabsTrigger>
          <TabsTrigger value="30d">30d</TabsTrigger>
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

const processEventsData = (events: any[], days: number): EventData[] => {
  const data: EventData[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - days + 1);

  // Create date buckets
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    data.push({
      date: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(d),
      events: 0,
      uniqueUsers: 0,
    });
  }

  // Process events into buckets
  const usersByDate = new Map<string, Set<string>>();

  events.forEach((event) => {
    const eventDate = new Date(event.timestamp);
    const dateStr = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(eventDate);

    const dayData = data.find((d) => d.date === dateStr);
    if (dayData) {
      dayData.events++;

      if (event.metadata?.ipAddress) {
        if (!usersByDate.has(dateStr)) {
          usersByDate.set(dateStr, new Set());
        }
        usersByDate.get(dateStr)?.add(event.metadata.ipAddress);
      }
    }
  });

  // Update unique users count
  return data.map((day) => ({
    ...day,
    uniqueUsers: usersByDate.get(day.date)?.size ?? 0,
  }));
};

export const Overview = ({ project }: { project: Project | null }) => {
  const [timeRange, setTimeRange] = useState("7d");
  const { getEventsOverview, data } = useGetEventsOverview();

  const chartData = useMemo(() => {
    if (!data?.events) return [];
    const days = timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : 30;
    return processEventsData(data.events, days);
  }, [data?.events, timeRange]);

  console.log(chartData);

  useEffect(() => {
    if (project?.id) {
      getEventsOverview(project.id);
    }
  }, [project?.id]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Events"
          value={data?.overview.total_events ?? 0}
          icon={Layers}
          description="Tracked in the last 30 days"
          trend={{
            value: data?.overview.growth_percentage ?? 0,
            label: "from last month",
            positive: (data?.overview.growth_percentage ?? 0) >= 0,
          }}
        />
        <StatCard
          title="Active Users"
          value={data?.overview.active_users.current ?? 0}
          icon={BarChart3}
          description="Users who triggered events"
          trend={{
            value: data?.overview.active_users.growth_percentage ?? 0,
            label: "from last month",
            positive: (data?.overview.active_users.growth_percentage ?? 0) >= 0,
          }}
        />
      </div>

      <EventsChart
        data={chartData}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <EventsTable />
    </div>
  );
};
