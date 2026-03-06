import { and, count, countDistinct, eq, isNotNull, isNull, or, sql, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { visitor } from '@/lib/db/schema';
import type { SummaryStats } from '@/types/dashboard';

/**
 * Fetches aggregated summary statistics for a site
 */
export async function getSummaryStats(siteId: string): Promise<SummaryStats> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const nonBotCondition = or(eq(visitor.isBot, false), isNull(visitor.isBot));

  const [totals, uniqueIps, uniquePaths, topPage, topReferrer, topBrowser] = await Promise.all([
    // 1. Total count + latest + last24h
    db
      .select({
        totalVisits: count().as('total_visits'),
        latestVisitAt: sql<string>`MAX(${visitor.createdAt})`.as('latest_visit_at'),
        visitsLast24h: sql<number>`COUNT(*) FILTER (WHERE ${visitor.createdAt} >= ${twentyFourHoursAgo})`.as(
          'visits_last_24h'
        ),
      })
      .from(visitor)
      .where(and(eq(visitor.siteId, siteId), nonBotCondition)),

    // 2. Unique visitors
    db
      .select({ uniqueVisitors: countDistinct(visitor.ip).as('unique_visitors') })
      .from(visitor)
      .where(and(eq(visitor.siteId, siteId), nonBotCondition)),

    // 3. Active pages
    db
      .select({ activePages: countDistinct(visitor.path).as('active_pages') })
      .from(visitor)
      .where(and(eq(visitor.siteId, siteId), nonBotCondition)),

    // 4. Top page
    db
      .select({ path: visitor.path, visits: count().as('visits') })
      .from(visitor)
      .where(and(eq(visitor.siteId, siteId), nonBotCondition))
      .groupBy(visitor.path)
      .orderBy(desc(sql`visits`))
      .limit(1),

    // 5. Top referrer
    db
      .select({ referrer: visitor.referrer, visits: count().as('visits') })
      .from(visitor)
      .where(and(eq(visitor.siteId, siteId), isNotNull(visitor.referrer), nonBotCondition))
      .groupBy(visitor.referrer)
      .orderBy(desc(sql`visits`))
      .limit(1),

    // 6. Top browser
    db
      .select({ browser: visitor.browser, visits: count().as('visits') })
      .from(visitor)
      .where(and(eq(visitor.siteId, siteId), nonBotCondition))
      .groupBy(visitor.browser)
      .orderBy(desc(sql`visits`))
      .limit(1),
  ]);

  return {
    totalVisits: totals[0]?.totalVisits ?? 0,
    uniqueVisitors: uniqueIps[0]?.uniqueVisitors ?? 0,
    activePages: uniquePaths[0]?.activePages ?? 0,
    visitsLast24h: totals[0]?.visitsLast24h ?? 0,
    topPage: topPage[0]?.path ?? null,
    topReferrer: topReferrer[0]?.referrer ?? null,
    topBrowser: topBrowser[0]?.browser ?? null,
    latestVisitAt: totals[0]?.latestVisitAt ?? null,
  };
}
