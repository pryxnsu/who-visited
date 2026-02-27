// ── Dashboard API response types ──
// Shared between server (api/dashboard) and client (dashboard/page.tsx)

// ── Sites ──

export type DashboardSite = {
  id: string;
  name: string;
  domain: string;
};

// ── Summary (DB-backed) ──

export type SummaryStats = {
  totalVisits: number;
  uniqueVisitors: number;
  activePages: number;
  visitsLast24h: number;
  topPage: string | null;
  topReferrer: string | null;
  topBrowser: string | null;
  latestVisitAt: string | null;
};

// ── Trend ──

export type TrendBucket = {
  date: string;
  label: string;
  count: number;
  height: number;
};

export type TrendData = {
  buckets: TrendBucket[];
  peakHour: string;
};

// ── Top entries ──

export type TopEntry = {
  label: string;
  count: number;
  share: number;
};

// ── Highlights ──

export type HighlightItem = {
  label: string;
  value: string;
};

// ── Recent activity ──

export type ActivityItem = {
  id: string;
  pagePath: string;
  referrer: string;
  browser: string;
  country: string;
  visitedAt: string;
};

// ── Dashboard response ──

export type DashboardData = {
  siteId: string;
  summary: SummaryStats;
  trend: TrendData;
  topPages: TopEntry[];
  topReferrers: TopEntry[];
  highlights: HighlightItem[];
  recentActivity: ActivityItem[];
};
