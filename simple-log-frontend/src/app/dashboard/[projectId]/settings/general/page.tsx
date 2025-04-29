import { getProjectAction } from "@/actions/projects";
import { GeneralTab } from "@/components/dashboard/GeneralTab";
import { ProjectNotFound } from "@/components/dashboard/ProjectNotFound";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId: number }>;
}) {
  const { projectId } = await params;
  const project = await getProjectAction(Number(projectId));
  if (!project) {
    return <ProjectNotFound />;
  }
  return <GeneralTab project={project}></GeneralTab>;
}
