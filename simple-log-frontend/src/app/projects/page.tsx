import { NewProjectCard } from "@/components/projects/NewProjectCard";
import ProjectCards from "@/components/projects/ProjectCards";
import { getServerProjects } from "@/hooks/useProjects";
import { Loader2 } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export default async function Home() {
  const { data: projects, isLoading } = await getServerProjects();
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-2">Projects</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <NewProjectCard></NewProjectCard>

        {isLoading && <Loader2 className="animate-spin" />}
        <ProjectCards projects={projects}></ProjectCards>
      </div>
    </div>
  );
}
