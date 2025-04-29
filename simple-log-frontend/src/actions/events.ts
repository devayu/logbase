"use server";

import { prisma } from "@/lib/db";
import { ProjectIdSchema, ProjectIdT } from "@/prismaTypes";

export const getAllEventsAction = async (project_id: ProjectIdT) => {
  const { success } = ProjectIdSchema.safeParse(project_id);
  if (!success) return;

  const project = await prisma.project.findFirst({
    select: {
      name: true,
    },
    where: {
      id: project_id,
    },
  });

  if (!project) return;

  const events = await prisma.event.findMany({
    where: {
      projectId: project_id,
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  return {
    events,
    projectName: project.name,
  };
};

export const getEventsOverviewAction = async (project_id: ProjectIdT) => {
  const { success } = ProjectIdSchema.safeParse(project_id);
  if (!success) {
    return;
  }
  const project = await prisma.project.findFirst({
    select: {
      name: true,
    },
    where: {
      id: project_id,
    },
  });

  if (!project) return;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const currentMonthEvents = await prisma.event.findMany({
    where: {
      projectId: project_id,
      timestamp: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  const currentActiveUsers = new Set(
    currentMonthEvents
      /* eslint-disable @typescript-eslint/no-explicit-any */
      .map((event) => (event.metadata as Record<string, any>)?.ipAddress)
      .filter(Boolean)
  ).size;
  const previousMonthEvents = await prisma.event.findMany({
    where: {
      projectId: project_id,
      timestamp: {
        gte: sixtyDaysAgo,
      },
    },
    orderBy: {
      timestamp: "desc",
    },
  });
  const previousActiveUsers = new Set(
    previousMonthEvents
      /* eslint-disable @typescript-eslint/no-explicit-any */
      .map((event) => (event.metadata as Record<string, any>)?.ipAddress)
      .filter(Boolean)
  ).size;
  const currentCount = currentMonthEvents.length;
  const previousCount = previousMonthEvents.length;
  const growthPercentage =
    previousCount === 0
      ? 100
      : ((currentCount - previousCount) / previousCount) * 100;
  const activeUsersGrowth =
    previousActiveUsers === 0
      ? 100
      : ((currentActiveUsers - previousActiveUsers) / previousActiveUsers) *
        100;
  return {
    projectName: project.name,
    events: currentMonthEvents,
    overview: {
      totalEvents: currentCount,
      growthPercentage: Math.round(growthPercentage * 100) / 100,
      previousCount,
      activeUsers: {
        current: currentActiveUsers,
        previous: previousActiveUsers,
        growthPercentage: Math.round(activeUsersGrowth * 100) / 100,
      },
    },
  };
};

export type EventsOverview = Awaited<
  ReturnType<typeof getEventsOverviewAction>
>;
