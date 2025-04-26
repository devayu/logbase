import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { ProjectTitle } from "@/components/dashboard/ProjectTitle";
import { Project } from "@/hooks/useProjects";
import { Api } from "@/services/api";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: number };
}) {
  const { projectId } = await params;
  const { data: project } = await Api.getInstance().fetch<Project>(
    `/getProject/${projectId}`,
    {
      cache: "no-store",
    }
  );

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardTabs projectId={projectId}></DashboardTabs>
      <main className="flex-1">
        <ProjectTitle
          name={project?.name}
          description={project?.description}
        ></ProjectTitle>
        {children}
      </main>
    </div>
  );
}
