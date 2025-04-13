"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { LayoutGrid, BarChart3, Layers } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ApiKeyCard } from "./ApiKeyCard";
import { EventsTable } from "./EventsTable";

// Mock data
const generateChartData = (days = 7) => {
  const data = [];
  const date = new Date();
  date.setDate(date.getDate() - days);

  for (let i = 0; i <= days; i++) {
    date.setDate(date.getDate() + 1);
    data.push({
      date: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date),
      pageViews: Math.floor(Math.random() * 1000) + 500,
      clicks: Math.floor(Math.random() * 500) + 100,
      purchases: Math.floor(Math.random() * 50) + 10,
    });
  }
  return data;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="text-sm font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
}) => (
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

export const DashboardContent = () => {
  const [chartData, setChartData] = useState(generateChartData());
  const [timeRange, setTimeRange] = useState("7d");

  // For demo purposes, this would change the chart data on time range change
  useEffect(() => {
    const days = timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : 30;
    setChartData(generateChartData(days));
  }, [timeRange]);

  return (
    <div className="flex flex-col">
      {/* <Header email="user@example.com" /> */}
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Events"
            value="24,781"
            icon={Layers}
            description="Tracked in the last 30 days"
            trend={{ value: 12, label: "from last month", positive: true }}
          />
          <StatCard
            title="Active Users"
            value="1,429"
            icon={BarChart3}
            description="Users who triggered events"
            trend={{ value: 8, label: "from last month", positive: true }}
          />
          <StatCard
            title="Bounce Rate"
            value="24%"
            icon={LayoutGrid}
            description="Average across all pages"
            trend={{ value: 3, label: "from last month", positive: false }}
          />
          <ApiKeyCard />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-4 border border-border/30">
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
              <CardDescription>Event distribution over time</CardDescription>
              <Tabs
                defaultValue="7d"
                className="w-[300px]"
                value={timeRange}
                onValueChange={setTimeRange}
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
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
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
                    dataKey="pageViews"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="purchases"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-3 border border-border/30">
            <CardHeader>
              <CardTitle>SDK Integration</CardTitle>
              <CardDescription>
                Follow these steps to integrate the App Insight SDK
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">1. Install the SDK</h3>
                  <div className="bg-secondary rounded-md p-2 font-mono text-sm">
                    npm install app-insight-sdk
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">
                    2. Initialize with your API Key
                  </h3>
                  <div className="bg-secondary rounded-md p-2 font-mono text-sm">
                    {`import { AppInsight } from 'app-insight-sdk';
                    
AppInsight.init({ apiKey: 'your-api-key' });`}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">3. Track Events</h3>
                  <div className="bg-secondary rounded-md p-2 font-mono text-sm">
                    {`// Track page views automatically
// Track custom events
AppInsight.track('purchase', {
  productId: '123',
  amount: 49.99
});`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <EventsTable />
      </main>
    </div>
  );
};
