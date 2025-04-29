import { getProjectAction } from "@/actions/projects";
import { Overview } from "@/components/dashboard/Overview";
import { ProjectNotFound } from "@/components/dashboard/ProjectNotFound";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectAction(Number(projectId));

  if (!project) {
    return <ProjectNotFound />;
  }
  return <Overview project={project}></Overview>;
}
