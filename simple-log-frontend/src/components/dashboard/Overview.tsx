"use client";

import { EventsChart } from "@/components/dashboard/EventsChart";
import { EventsTable } from "@/components/dashboard/EventsTable";
import { EventStatCard } from "@/components/dashboard/EventStatCard";
// import { Project } from "@/hooks/useProjects";
import { EventsOverview } from "@/actions/events";
import { EventMetadata } from "@/types";
import { EventData } from "@/types";
import { Event } from "@prisma/client";
import { BarChart3, Layers } from "lucide-react";
import { useMemo, useState } from "react";
const processEventsData = (events: Event[], days: number): EventData[] => {
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
    const metadata = event.metadata as EventMetadata;
    const eventDate = new Date(event.timestamp);
    const dateStr = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(eventDate);

    const dayData = data.find((d) => d.date === dateStr);
    if (dayData) {
      dayData.events++;

      if (metadata?.ipAddress) {
        if (!usersByDate.has(dateStr)) {
          usersByDate.set(dateStr, new Set());
        }
        usersByDate.get(dateStr)?.add(metadata.ipAddress);
      }
    }
  });

  // Update unique users count
  return data.map((day) => ({
    ...day,
    uniqueUsers: usersByDate.get(day.date)?.size ?? 0,
  }));
};

export const Overview = ({
  eventOverview,
}: {
  eventOverview: EventsOverview | null;
}) => {
  const [timeRange, setTimeRange] = useState("7d");

  const chartData = useMemo(() => {
    if (!eventOverview?.events) return [];
    const days = timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : 30;
    return processEventsData(eventOverview.events, days);
  }, [eventOverview?.events, timeRange]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <EventStatCard
          title="Total Events"
          value={eventOverview?.overview.totalEvents ?? 0}
          icon={Layers}
          description="Tracked in the last 30 days"
          trend={{
            value: eventOverview?.overview.growthPercentage ?? 0,
            label: "from last month",
            positive: (eventOverview?.overview.growthPercentage ?? 0) >= 0,
          }}
        />
        <EventStatCard
          title="Active Users"
          value={eventOverview?.overview.activeUsers.current ?? 0}
          icon={BarChart3}
          description="Users who triggered events"
          trend={{
            value: eventOverview?.overview.activeUsers.growthPercentage ?? 0,
            label: "from last month",
            positive:
              (eventOverview?.overview.activeUsers.growthPercentage ?? 0) >= 0,
          }}
        />
      </div>

      <EventsChart
        data={chartData}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <EventsTable
        events={eventOverview?.events}
        count={5}
        projectName={eventOverview?.metadata.name}
      />
    </div>
  );
};
