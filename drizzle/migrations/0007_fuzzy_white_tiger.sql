CREATE TABLE "visitor" (
	"id" uuid PRIMARY KEY NOT NULL,
	"site_id" uuid NOT NULL,
	"ip" text NOT NULL,
	"browser" varchar(120) NOT NULL,
	"os" varchar(80) NOT NULL,
	"device" varchar(40) NOT NULL,
	"referrer" text,
	"country" varchar(2),
	"city" varchar(120),
	"path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "visitor" ADD CONSTRAINT "visitor_site_id_site_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "visitor_site_created_at_idx" ON "visitor" USING btree ("site_id","created_at");--> statement-breakpoint
CREATE INDEX "visitor_site_ip_created_at_idx" ON "visitor" USING btree ("site_id","ip","created_at");--> statement-breakpoint
CREATE INDEX "visitor_created_at_idx" ON "visitor" USING btree ("created_at");