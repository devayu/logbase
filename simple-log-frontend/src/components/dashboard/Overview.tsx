"use client";

import { EventsChart } from "@/components/dashboard/EventsChart";
import { EventsTable } from "@/components/dashboard/EventsTable";
import { EventStatCard } from "@/components/dashboard/EventStatCard";
import { Event, useGetEventsOverview } from "@/hooks/useEvents";
import { Project } from "@/hooks/useProjects";
import { EventData } from "@/types";
import { BarChart3, Layers } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    if (project?.id) {
      getEventsOverview(project.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <EventStatCard
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
        <EventStatCard
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

      <EventsTable events={data?.events} count={5} />
    </div>
  );
};
