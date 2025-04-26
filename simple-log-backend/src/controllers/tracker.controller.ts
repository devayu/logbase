import { and, desc, eq, gte, lte } from "drizzle-orm";
import { Response } from "express";
import { db } from "../db";
import { eventsTable } from "../db/schema";
import { AuthRequest } from "../middleware/authentication.middleware";

export const getAllEvents2 = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.body.projectId) {
    res.status(401).json({
      status: "error",
      message: "Invalid request project id is missing",
    });
  }
  const { projectId } = req.body;
  const events =
    (await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.project_id, projectId as number))) ?? [];
  const groupedEvents = events.reduce((acc, event) => {
    const eventName = event.type;
    if (!acc[eventName]) {
      acc[eventName] = {
        event: eventName,
        count: 0,
        events: [],
      };
    }
    acc[eventName].count++;
    acc[eventName].events.push({
      id: event.id,
      timestamp: event.timestamp,
      metadata: event.metadata,
    });
    return acc;
  }, {} as Record<string, { event: string; count: number; events: any[] }>);

  const transformedEvents = Object.values(groupedEvents);
  res.status(200).json({
    status: "ok",
    events: transformedEvents,
  });
};
export const getAllEvents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.body.projectId) {
    res.status(401).json({
      status: "error",
      message: "Invalid request project id is missing",
    });
  }
  const { projectId } = req.body;
  const events =
    (await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.project_id, projectId as number))
      .orderBy(desc(eventsTable.timestamp))) ?? [];
  const groupedEvents = events.reduce((acc, event) => {
    const eventName = event.type;
    if (!acc[eventName]) {
      acc[eventName] = {
        event: eventName,
        count: 0,
        events: [],
      };
    }
    acc[eventName].count++;
    acc[eventName].events.push({
      id: event.id,
      timestamp: event.timestamp,
      metadata: event.metadata,
    });
    return acc;
  }, {} as Record<string, { event: string; count: number; events: any[] }>);

  const transformedEvents = Object.values(groupedEvents);
  res.status(200).json({
    status: "ok",
    events,
  });
};
export const getEventsOverview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.body.projectId) {
    res.status(401).json({
      status: "error",
      message: "Invalid request project id is missing",
    });
  }
  const { projectId } = req.body;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const currentMonthEvents =
    (await db
      .select()
      .from(eventsTable)
      .where(
        and(
          eq(eventsTable.project_id, projectId as number),
          gte(eventsTable.timestamp, thirtyDaysAgo)
        )
      )
      .orderBy(desc(eventsTable.timestamp))) ?? [];
  const currentActiveUsers = new Set(
    currentMonthEvents
      .map((event) => (event.metadata as Record<string, any>)?.ipAddress)
      .filter(Boolean)
  ).size;
  const previousMonthEvents =
    (await db
      .select()
      .from(eventsTable)
      .where(
        and(
          eq(eventsTable.project_id, projectId as number),
          gte(eventsTable.timestamp, sixtyDaysAgo),
          lte(eventsTable.timestamp, thirtyDaysAgo)
        )
      )) ?? [];
  const previousActiveUsers = new Set(
    previousMonthEvents
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

  res.status(200).json({
    status: "ok",
    events: currentMonthEvents,
    overview: {
      total_events: currentCount,
      growth_percentage: Math.round(growthPercentage * 100) / 100,
      previous_count: previousCount,
      active_users: {
        current: currentActiveUsers,
        previous: previousActiveUsers,
        growth_percentage: Math.round(activeUsersGrowth * 100) / 100,
      },
    },
  });
};
export const trackEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { body } = req;
  if (!body || !body.type) {
    res.status(403).json({
      status: "error",
      message: "Invalid request",
    });
  }
  if (!req.project_id) {
    res.status(401).json({
      status: "error",
      message: "Invalid request project id is missing",
    });
  }
  const { type, userAgent, url } = body;
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : req.socket?.remoteAddress;
  const cleanIP = ip?.replace(/^::ffff:/, "");

  const geo = await fetch(
    `https://ipinfo.io/${cleanIP}?token=${process.env.IP_INFO_API_KEY}`
  );
  const data = (await geo.json()) as Record<string, any>;
  const deviceType = getDeviceType(userAgent);

  const updatedMetadata = {
    ...body.metadata,
    city: data.city,
    region: data.region,
    country: data.country,
    ipAddress: ip,
    path: url,
    source: deviceType, // web, mobile, tablet, desktop,
  };
  const [newEvent] = await db
    .insert(eventsTable)
    .values({
      type,
      project_id: req.project_id as number,
      metadata: updatedMetadata,
    })
    .returning();
  res.status(200).json({
    status: "ok",
    newEvent,
  });
};

function getDeviceType(
  userAgent: string
): "mobile" | "web" | "tablet" | "unknown" {
  const ua = userAgent.toLowerCase();

  // Check for mobile devices
  if (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/i.test(ua)) {
    // Specifically check for tablets
    if (/(ipad|android(?!.*mobile))/i.test(ua)) {
      return "tablet";
    }
    return "mobile";
  }

  // If not mobile and has common desktop browser strings, consider it web
  if (/(mozilla|chrome|safari|firefox|edge|opera)/i.test(ua)) {
    return "web";
  }

  return "unknown";
}
