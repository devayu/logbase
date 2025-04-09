import {
  integer,
  pgTable,
  timestamp,
  varchar,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

export const projectStatusEnum = pgEnum("project_status", ["ACTIVE", "PAUSED"]);
export const projectPlanEnum = pgEnum("project_plan", ["BASIC", "PREMIUM"]);

export const projectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  client_id: varchar({ length: 64 }),
  api_key: varchar({ length: 100 }).unique().default("").notNull(),
  status: projectStatusEnum("status").notNull().default("ACTIVE"),
  created_at: timestamp().defaultNow(),
  plan: projectPlanEnum("plan").notNull().default("BASIC"),
});

export const eventsTable = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  project_id: integer("project_id").references(() => projectsTable.id),
  event: varchar("event", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"),
});
