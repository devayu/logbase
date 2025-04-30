import { getAllEventsAction } from "@/actions/events";
import { EventsTable } from "@/components/dashboard/EventsTable";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const data = await getAllEventsAction(Number(projectId));

  return (
    <div className="p-6">
      <EventsTable
        events={data?.events}
        heading="All Events"
        projectName={data?.projectName}
      ></EventsTable>
    </div>
  );
}
