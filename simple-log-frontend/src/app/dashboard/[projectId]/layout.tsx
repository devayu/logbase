import { getProjectAction } from "@/actions/projects";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { ProjectTitle } from "@/components/dashboard/ProjectTitle";
import { PausedBanner } from "@/components/PausedBanner";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: number }>;
}) {
  const { projectId } = await params;
  const project = await getProjectAction(Number(projectId));

  return (
    <div className="flex flex-col min-h-screen">
      {project?.status === "PAUSED" && (
        <PausedBanner projectId={Number(projectId)} />
      )}
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
