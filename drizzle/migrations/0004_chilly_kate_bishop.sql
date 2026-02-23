CREATE TABLE "site" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"site_id" text NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "site_site_id_idx" ON "site" USING btree ("site_id");--> statement-breakpoint
CREATE INDEX "site_user_id_idx" ON "site" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "site_domain_idx" ON "site" USING btree ("domain");