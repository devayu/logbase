import { useGetAllEvents } from "@/hooks/useEvents";
import { useEffect } from "react";

export const AllEvents = ({ projectId }: { projectId: number }) => {
  const { getAllEvents, data } = useGetAllEvents();
  useEffect(() => {
    getAllEvents(projectId);
  }, []);
  console.log(data);

  return <div>all events</div>;
};
