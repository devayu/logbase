import { getEventsOverviewAction } from "@/actions/events";
import { Overview } from "@/components/dashboard/Overview";
import { ProjectNotFound } from "@/components/dashboard/ProjectNotFound";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const projectEventOverview = await getEventsOverviewAction(Number(projectId));

  if (!projectEventOverview) {
    return <ProjectNotFound />;
  }
  return <Overview eventOverview={projectEventOverview}></Overview>;
}
