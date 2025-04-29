import { Prisma } from "@prisma/client";

export type Project = Prisma.ProjectGetPayload<{}>;
export type User = Omit<Prisma.ClientGetPayload<{}>, "password">;
