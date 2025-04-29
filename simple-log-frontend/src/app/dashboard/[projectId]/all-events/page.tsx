import { getAllEventsAction } from "@/actions/events";
import { EventsTable } from "@/components/dashboard/EventsTable";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const events = await getAllEventsAction(Number(projectId));
  return (
    <div className="p-4">
      <EventsTable events={events} heading="All Events"></EventsTable>
    </div>
  );
}
