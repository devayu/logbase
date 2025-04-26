CREATE TYPE "public"."event_type" AS ENUM('PAGE_VIEW', 'BUTTON_CLICK', 'ERROR', 'SUBMIT');--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event" SET DATA TYPE event_type;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event" SET DEFAULT 'PAGE_VIEW';