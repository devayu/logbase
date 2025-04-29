import { Event } from "@prisma/client";

export const transformedEvents = (events: Event[], isCsv = true) => {
  return events.map((event) => {
    const { timestamp, type, metadata } = event;
    return {
      type,
      timestamp: timestamp.toISOString(),
      metadata: isCsv ? JSON.stringify(metadata) : metadata,
    };
  });
};
