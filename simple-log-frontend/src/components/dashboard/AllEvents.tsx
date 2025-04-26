"use client";
import { EventsTable } from "@/components/dashboard/EventsTable";
import { useGetAllEvents } from "@/hooks/useEvents";
import { useEffect } from "react";

export const AllEvents = ({ projectId }: { projectId: number }) => {
  const { getAllEvents, data } = useGetAllEvents();
  useEffect(() => {
    getAllEvents(projectId);
  }, []);

  if (!data) return null;
  return (
    <div className="p-4">
      <EventsTable events={data.events}></EventsTable>
    </div>
  );
};
