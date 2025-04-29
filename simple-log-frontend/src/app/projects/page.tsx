import { getProjectsAction } from "@/actions/projects";
import { getClientId } from "@/auth/currentUser";
import { NewProjectCard } from "@/components/projects/NewProjectCard";
import ProjectCards from "@/components/projects/ProjectCards";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export default async function Home() {
  const projects = await getProjectsAction(await getClientId());
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-2">Projects</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <NewProjectCard></NewProjectCard>

        <ProjectCards projects={projects}></ProjectCards>
      </div>
    </div>
  );
}
