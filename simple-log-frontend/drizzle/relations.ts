import { relations } from "drizzle-orm/relations";
import { projects, events } from "./schema";

export const eventsRelations = relations(events, ({one}) => ({
	project: one(projects, {
		fields: [events.projectId],
		references: [projects.id]
	}),
}));

export const projectsRelations = relations(projects, ({many}) => ({
	events: many(events),
}));