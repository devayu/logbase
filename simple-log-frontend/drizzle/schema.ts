import {
  pgTable,
  unique,
  integer,
  varchar,
  timestamp,
  foreignKey,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const projectPlan = pgEnum("project_plan", ["BASIC", "PREMIUM"]);
export const projectStatus = pgEnum("project_status", ["ACTIVE", "PAUSED"]);

export const projects = pgTable(
  "projects",
  {
    id: integer()
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: "projects_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    name: varchar({ length: 255 }).notNull(),
    clientId: varchar("client_id", { length: 64 }),
    apiKey: varchar("api_key", { length: 100 }).default("").notNull(),
    status: projectStatus().default("ACTIVE").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    plan: projectPlan().default("BASIC").notNull(),
    description: varchar({ length: 255 }),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("projects_api_key_unique").on(table.apiKey)]
);

export const events = pgTable(
  "events",
  {
    id: integer()
      .primaryKey()
      .generatedAlwaysAsIdentity({
        name: "events_id_seq",
        startWith: 1,
        increment: 1,
        minValue: 1,
        maxValue: 2147483647,
        cache: 1,
      }),
    projectId: integer("project_id"),
    type: varchar({ length: 255 }).notNull(),
    timestamp: timestamp({ mode: "string" }).defaultNow(),
    metadata: jsonb(),
  },
  (table) => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "events_project_id_projects_id_fk",
    }),
  ]
);
