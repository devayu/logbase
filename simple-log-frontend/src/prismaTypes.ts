import { Prisma } from "@prisma/client";
import { z } from "zod";

export type Project = Prisma.ProjectGetPayload<{}>;
export type User = Omit<Prisma.ClientGetPayload<{}>, "password">;
export type Event = Prisma.EventGetPayload<{}>;
// & {
//   /* eslint-disable @typescript-eslint/no-explicit-any */
//   metadata:
//     | (Record<string, any> & {
//         source: string;
//         ipAddress: string;
//         city: string;
//         region: string;
//         country: string;
//         path: string;
//       })
//     | null;
// };
export type EventMetadata =
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
