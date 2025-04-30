"use server";

import { prisma } from "@/db/db";
import { qstash } from "@/lib/qstashClient";
import { ProjectIdSchema, ProjectIdT } from "@/types";
import { z } from "zod";

const UpdateProjectMonitoringUrlSchema = z.object({
  updatedUrl: z.string().url(),
  projectId: z.number(),
});
type UpdateProjectMonitoringUrlSchemaT = z.infer<
  typeof UpdateProjectMonitoringUrlSchema
>;

export async function updateProjectMonitoringUrl(
  params: UpdateProjectMonitoringUrlSchemaT
) {
  const { success, data } = UpdateProjectMonitoringUrlSchema.safeParse(params);
  if (!success) {
    return null;
  }
  const { updatedUrl, projectId } = data;
  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      monitoringUrl: true,
    },
    data: {
      monitoringUrl: updatedUrl,
      monitoringEnabled: true,
    },
  });

  if (!updatedProject) return null;
  await scheduleMonitoring(projectId);
  return updatedProject.monitoringUrl;
}
export async function getUptimeLogAction(projectId: ProjectIdT) {
  const { success } = ProjectIdSchema.safeParse(projectId);
  if (!success) {
    return null;
  }
  const logs = await prisma.uptimeLog.findMany({
    where: {
      projectId: projectId,
    },
    orderBy: {
      checkedAt: "desc",
    },
  });
  if (logs.length === 0) {
    return null;
  }
  return logs;
}

export async function getUptimeOverviewAction(projectId: ProjectIdT) {
  const { success } = ProjectIdSchema.safeParse(projectId);
  if (!success) {
    return null;
  }

  const last7DaysAgo = new Date();
  last7DaysAgo.setDate(last7DaysAgo.getDate() - 7);
  const last7DaysAgoLogs = await prisma.uptimeLog.findMany({
    where: {
      projectId: projectId,
      checkedAt: {
        gte: last7DaysAgo,
      },
    },
    select: {
      checkedAt: true,
      responseTime: true,
    },
    orderBy: {
      checkedAt: "desc",
    },
  });
  const last30DaysAgo = new Date();
  last30DaysAgo.setDate(last30DaysAgo.getDate() - 30);
  const last30DaysAgoLogs = await prisma.uptimeLog.findMany({
    where: {
      projectId: projectId,
      checkedAt: {
        gte: last30DaysAgo,
      },
    },
    select: {
      checkedAt: true,
      responseTime: true,
    },
    orderBy: {
      checkedAt: "desc",
    },
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of current day
  const todayLogs = await prisma.uptimeLog.findMany({
    where: {
      projectId: projectId,
      checkedAt: {
        gte: today,
      },
    },
    select: {
      checkedAt: true,
      responseTime: true,
    },
    orderBy: {
      checkedAt: "desc",
    },
  });
  const logs = await prisma.uptimeLog.findMany({
    where: {
      projectId: projectId,
    },
    orderBy: {
      checkedAt: "desc",
    },
  });

  if (logs.length === 0) {
    return null;
  }

  const lastDownLog = await prisma.uptimeLog.findFirst({
    where: {
      projectId: projectId,
      isOffline: true,
    },
    orderBy: {
      checkedAt: "desc",
    },
  });

  const lastUpBeforeDown = lastDownLog
    ? await prisma.uptimeLog.findFirst({
        where: {
          projectId: projectId,
          isOffline: false,
          checkedAt: {
            lt: lastDownLog.checkedAt,
          },
        },
        orderBy: {
          checkedAt: "desc",
        },
      })
    : null;
  const lastDownBeforeUp = lastUpBeforeDown
    ? await prisma.uptimeLog.findFirst({
        where: {
          projectId: projectId,
          isOffline: false,
          checkedAt: {
            lt: lastUpBeforeDown.checkedAt,
          },
        },
        orderBy: {
          checkedAt: "desc",
        },
      })
    : null;

  const timeSiteWentDown = logs.filter((log) => log.isOffline === true).length;
  const availabilityPercentage = (logs.length - timeSiteWentDown) / logs.length;
  const lastCheckedAt = logs[0].checkedAt;
  const isOffline = logs[0].isOffline;
  const averageResponseTime =
    logs
      .filter((log) => log.responseTime !== null)
      .reduce((acc, log) => acc + log.responseTime!, 0) / logs.length;
  const currentlyUpFor =
    lastDownLog?.checkedAt && !isOffline
      ? lastCheckedAt.getTime() - lastDownLog.checkedAt.getTime()
      : 0;
  const timeUpForBeforeDown =
    lastDownBeforeUp && lastUpBeforeDown
      ? lastUpBeforeDown.checkedAt.getTime() -
        lastDownBeforeUp.checkedAt.getTime()
      : 0;
  return {
    availabilityPercentage: availabilityPercentage * 100,
    timeSiteWentDown,
    lastCheckedAt,
    averageResponseTime: Math.round(averageResponseTime),
    isOffline,
    timeUpForBeforeDown,
    currentlyUpFor,
    logs: {
      week: last7DaysAgoLogs,
      month: last30DaysAgoLogs,
      day: todayLogs,
    },
  };
}
export type UptimeOverviewT = Awaited<
  ReturnType<typeof getUptimeOverviewAction>
>;

export async function scheduleMonitoring(projectId: number) {
  try {
    const canSchedule = await canScheduleMonitoring(projectId);
    if (!canSchedule) {
      throw "Monitoring cannot be scheduled, check if a monitoring url is set";
    }

    const isResumed = await resumeMonitoring(projectId);
    if (!isResumed) {
      throw "Monitoring cannot be resumed";
    }
    const { scheduleId } = await qstash.schedules.create({
      scheduleId: `monitoring-${projectId}`,
      cron: process.env.CRON_FREQUENCY ?? "0 * * * *",
      destination: `${process.env.NEXT_PUBLIC_APP_URL}/api/monitoring/check?id=${projectId}`,
    });

    if (scheduleId) {
      return true;
    }

    console.log("Monitoring schedule created successfully");
  } catch (error) {
    throw error;
  }
}

export async function deleteMonitoringSchedule(projectId: number) {
  try {
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        monitoringEnabled: false,
      },
    });
    await qstash.schedules.delete(`monitoring-${projectId}`);

    if (updatedProject) {
      return true;
    }
    console.log("Monitoring schedule deleted successfully");
  } catch (error) {
    throw error;
  }
}

async function canScheduleMonitoring(projectId: number) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        plan: "PREMIUM",
        monitoringUrl: {
          not: null,
        },
      },
    });
    if (project) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
}

async function resumeMonitoring(projectId: number) {
  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      monitoringEnabled: true,
    },
  });
  if (updatedProject) {
    return true;
  }
}
