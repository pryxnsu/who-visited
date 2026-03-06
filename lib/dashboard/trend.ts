import { and, count, eq, gte, isNull, or, sql, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { visitor } from '@/lib/db/schema';
import type { TrendData, TrendBucket } from '@/types/dashboard';

/**
 * Fetches visit trend data for the last 7 days + peak hour.
 *
 * Runs 2 parallel DB queries:
 *  1. Daily visit counts grouped by date (last 7 days)
 *  2. Hourly visit counts to find the peak hour
 */
export async function getVisitsTrend(siteId: string): Promise<TrendData> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nonBotCondition = or(eq(visitor.isBot, false), isNull(visitor.isBot));

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [dailyCounts, hourlyCounts] = await Promise.all([
    // 1. Daily visits for the last 7 days
    db
      .select({
        date: sql<string>`DATE(${visitor.createdAt})`.as('date'),
        count: count().as('count'),
      })
      .from(visitor)
      .where(and(eq(visitor.siteId, siteId), gte(visitor.createdAt, sevenDaysAgo), nonBotCondition))
      .groupBy(sql`DATE(${visitor.createdAt})`)
      .orderBy(sql`date`),

    // 2. Hourly distribution (all time for this site)
    db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${visitor.createdAt})`.as('hour'),
        count: count().as('count'),
      })
      .from(visitor)
      .where(and(eq(visitor.siteId, siteId), gte(visitor.createdAt, sevenDaysAgo), nonBotCondition))
      .groupBy(sql`hour`)
      .orderBy(desc(sql`count`))
      .limit(1),
  ]);

  // Build 7-day buckets (fill in days with 0 visits)
  const countsByDate = new Map(dailyCounts.map(r => [r.date, r.count]));

  const buckets: TrendBucket[] = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const dateStr = day.toISOString().slice(0, 10);
    const visitCount = countsByDate.get(dateStr) ?? 0;

    return {
      date: dateStr,
      label: day.toLocaleDateString('en-US', { weekday: 'short' }),
      count: visitCount,
      height: 0,
    };
  });

  // Compute relative bar heights
  const maxCount = Math.max(1, ...buckets.map(b => b.count));
  for (const bucket of buckets) {
    bucket.height = Math.max(6, Math.round((bucket.count / maxCount) * 100));
  }

  // Peak hour
  let peakHour = 'No traffic yet';
  if (hourlyCounts.length > 0 && hourlyCounts[0].count > 0) {
    const hour = hourlyCounts[0].hour;
    peakHour = `${String(hour).padStart(2, '0')}:00 (${hourlyCounts[0].count} visits)`;
  }

  return { buckets, peakHour };
}
