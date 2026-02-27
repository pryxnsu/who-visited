import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { visitor } from '@/lib/db/schema';
import type { ActivityItem } from '@/types/dashboard';

const DEFAULT_LIMIT = 8;

/**
 * Fetches the most recent visits for a given site.
 */
export async function getRecentActivity(siteId: string, limit = DEFAULT_LIMIT): Promise<ActivityItem[]> {
  const rows = await db
    .select({
      id: visitor.id,
      path: visitor.path,
      referrer: visitor.referrer,
      browser: visitor.browser,
      country: visitor.country,
      createdAt: visitor.createdAt,
    })
    .from(visitor)
    .where(eq(visitor.siteId, siteId))
    .orderBy(desc(visitor.createdAt))
    .limit(limit);

  return rows.map(row => ({
    id: row.id,
    pagePath: row.path,
    referrer: row.referrer ?? 'Direct',
    browser: row.browser,
    country: row.country ?? 'Unknown',
    visitedAt: row.createdAt.toISOString(),
  }));
}
