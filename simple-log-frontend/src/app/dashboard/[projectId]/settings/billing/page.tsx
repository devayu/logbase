import { getProjectAction } from "@/actions/projects";
import { PlanUpgradeCard } from "@/components/dashboard/PlanUpgradeCard";
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
  return <PlanUpgradeCard currentPlan={project?.plan}></PlanUpgradeCard>;
}
