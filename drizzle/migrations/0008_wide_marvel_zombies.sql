CREATE INDEX "visitor_site_path_idx" ON "visitor" USING btree ("site_id","path");--> statement-breakpoint
CREATE INDEX "visitor_site_referrer_idx" ON "visitor" USING btree ("site_id","referrer");--> statement-breakpoint
CREATE INDEX "visitor_site_browser_idx" ON "visitor" USING btree ("site_id","browser");