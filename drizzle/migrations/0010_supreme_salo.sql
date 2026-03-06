ALTER TABLE "visitor" ADD COLUMN "is_bot" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "visitor" ADD COLUMN "bot_reason" text;--> statement-breakpoint
CREATE INDEX "visitor_site_is_bot_idx" ON "visitor" USING btree ("site_id","is_bot","created_at");