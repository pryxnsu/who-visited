import { and, count, eq, isNull, or, sql, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { visitor } from '@/lib/db/schema';
import type { TopEntry } from '@/types/dashboard';

const DEFAULT_LIMIT = 5;

async function getTopEntries(
  siteId: string,
  column: typeof visitor.path | typeof visitor.referrer,
  fallbackLabel: string,
  total: number,
  limit = DEFAULT_LIMIT
): Promise<TopEntry[]> {
  const nonBotCondition = or(eq(visitor.isBot, false), isNull(visitor.isBot));

  const rows = await db
    .select({
      label: column,
      count: count().as('count'),
    })
    .from(visitor)
    .where(and(eq(visitor.siteId, siteId), nonBotCondition))
    .groupBy(column)
    .orderBy(desc(sql`count`))
    .limit(limit);

  return rows.map(row => ({
    label: row.label ?? fallbackLabel,
    count: row.count,
    share: total > 0 ? row.count / total : 0,
  }));
}

export function getTopPages(siteId: string, total: number, limit?: number) {
  return getTopEntries(siteId, visitor.path, '/', total, limit);
}

export function getTopReferrers(siteId: string, total: number, limit?: number) {
  return getTopEntries(siteId, visitor.referrer, 'Direct', total, limit);
}
