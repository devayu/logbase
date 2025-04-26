import { PlanUpgradeCard } from "@/components/dashboard/PlanUpgradeCard";
import { Project } from "@/hooks/useProjects";
import { Api } from "@/services/api";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId: number }>;
}) {
  const { projectId } = await params;
  const { data: project } = await Api.getInstance().fetch<Project>(
    `/getProject/${projectId}`
  );
  return <PlanUpgradeCard currentPlan={project?.plan}></PlanUpgradeCard>;
}
