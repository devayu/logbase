import { getEventsOverviewAction } from "@/actions/events";
import { Overview } from "@/components/dashboard/Overview";
import { ProjectNotFound } from "@/components/dashboard/ProjectNotFound";
import { ProjectTitle } from "@/components/dashboard/ProjectTitle";

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

  return (
    <main className="flex-1">
      <ProjectTitle
        name={projectEventOverview.metadata?.name}
        description={projectEventOverview.metadata?.description}
      ></ProjectTitle>
      <Overview eventOverview={projectEventOverview}></Overview>
    </main>
  );
}
