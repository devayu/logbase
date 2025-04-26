import { GeneralTab } from "@/components/dashboard/GeneralTab";
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

  return <GeneralTab project={project}></GeneralTab>;
}
