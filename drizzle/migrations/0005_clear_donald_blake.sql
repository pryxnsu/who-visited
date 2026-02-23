DROP INDEX "site_site_id_idx";--> statement-breakpoint
ALTER TABLE "site" DROP COLUMN "site_id";--> statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_domain_unique" UNIQUE("domain");