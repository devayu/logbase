import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const queryClient = postgres(process.env.DATABASE_URL!, {
  max: 1,
  ssl: "require",
});

export const db = drizzle(queryClient);
