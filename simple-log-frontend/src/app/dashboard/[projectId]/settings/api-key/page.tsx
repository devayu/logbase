import { getProjectAction } from "@/actions/projects";
import { ApiKeyCard } from "@/components/dashboard/ApiKeyCard";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectAction(Number(projectId));
  return (
    <ApiKeyCard
      projectId={Number(projectId)}
      apiKey={project?.apiKey}
    ></ApiKeyCard>
  );
}
