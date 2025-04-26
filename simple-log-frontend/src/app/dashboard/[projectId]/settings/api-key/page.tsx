import { ApiKeyCard } from "@/components/dashboard/ApiKeyCard";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId: number }>;
}) {
  const { projectId } = await params;
  return <ApiKeyCard projectId={projectId}></ApiKeyCard>;
}
