ALTER TABLE "site" DROP CONSTRAINT "site_domain_unique";--> statement-breakpoint
DROP INDEX "site_domain_idx";--> statement-breakpoint
CREATE INDEX "site_created_at_idx" ON "site" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "site_domain_idx" ON "site" USING btree ("domain");