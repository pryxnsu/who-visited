CREATE TYPE "public"."verification_method" AS ENUM('dns_txt', 'meta_tag', 'file');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'verified', 'failed');--> statement-breakpoint
ALTER TABLE "site" ADD COLUMN "verification_status" "verification_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "site" ADD COLUMN "verification_method" "verification_method";--> statement-breakpoint
ALTER TABLE "site" ADD COLUMN "verification_token" varchar(96);--> statement-breakpoint
ALTER TABLE "site" ADD COLUMN "verified_at" timestamp;--> statement-breakpoint
UPDATE "site"
SET "verification_token" = md5("id"::text || random()::text || clock_timestamp()::text)
WHERE "verification_token" IS NULL;--> statement-breakpoint
ALTER TABLE "site" ALTER COLUMN "verification_token" SET NOT NULL;
