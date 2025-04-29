import { z } from "zod";
export interface EventData {
  date: string;
  events: number;
  uniqueUsers: number;
}

export type EventMetadata =
  /* eslint-disable @typescript-eslint/no-explicit-any */
  | (Record<string, any> & {
      source: string;
      ipAddress: string;
      city: string;
      region: string;
      country: string;
      path: string;
    })
  | null;
export const ProjectIdSchema = z.number();
export type ProjectIdT = z.infer<typeof ProjectIdSchema>;
