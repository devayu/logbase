import { getUptimeOverviewAction } from "@/actions/monitoring";
import { getProjectAction } from "@/actions/projects";
import Monitoring from "@/components/dashboard/Monitoring";
import { MonitoringNotAllowed } from "@/components/dashboard/MonitoringNotAllowed";

export default async function Home({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectAction(Number(projectId));
  const monitoringOverview = await getUptimeOverviewAction(Number(projectId));

  if (project?.plan === "BASIC") {
    return <MonitoringNotAllowed></MonitoringNotAllowed>;
  }

  return (
    <div className="p-4">
      <Monitoring
        project={project}
        monitoringOverview={monitoringOverview}
      ></Monitoring>
    </div>
  );
}
