import { Response } from "express";
import { db } from "../db";
import { eventsTable } from "../db/schema";
import { AuthRequest } from "../middleware/authentication.middleware";

export const trackEvent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { body } = req;
  if (!body || !body.event) {
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
  const { event } = body;
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

  console.log(ip, data.city, data.region, data.country);

  const updatedMetadata = {
    ...body.metadata,
    city: data.city,
    region: data.region,
    country: data.country,
    ipAddress: ip,
  };
  const [newEvent] = await db
    .insert(eventsTable)
    .values({
      event,
      project_id: req.project_id as number,
      metadata: updatedMetadata,
    })
    .returning();
  res.status(200).json({
    status: "ok",
    newEvent,
  });
};
