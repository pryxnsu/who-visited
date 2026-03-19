'use client';

import { Button } from '@/components/ui/button';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { VisitsTrend } from '@/components/dashboard/visits-trend';
import { TrafficHighlights } from '@/components/dashboard/traffic-highlights';
import { TopEntriesCard } from '@/components/dashboard/top-entries-card';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AddSite from '@/components/AddSite';
import { Globe } from 'lucide-react';
import { getRelativeTime } from '@/lib/helper';
import { useDashboard } from '@/hooks/use-dashboard';
import Loader from './Loader';

export default function Dashboard() {
  const {
    dashboard,
    sites,
    loading,
    error,
    lastSync,
    selectedSiteId,
    isRefreshing,
    handleManualRefresh,
    handleSiteChange,
  } = useDashboard();

  const currentSite = sites.find(s => s.id === selectedSiteId);
  const summary = dashboard?.summary;

  const isInitialLoading = loading && !dashboard;

  // summary cards data
  const summaryData = summary
    ? [
        {
          label: 'Total visits',
          value: summary.totalVisits.toLocaleString(),
          detail: summary.latestVisitAt ? `Latest: ${getRelativeTime(summary.latestVisitAt)}` : 'No events yet',
        },
        {
          label: 'Visitors',
          value: summary.uniqueVisitors.toLocaleString(),
          detail: 'Unique IPs in current dataset',
        },
        {
          label: 'Active pages',
          value: summary.activePages.toLocaleString(),
          detail: `Top page: ${summary.topPage ?? 'No data yet'}`,
        },
        {
          label: 'Last 24 hours',
          value: summary.visitsLast24h.toLocaleString(),
          detail: `Top referrer: ${summary.topReferrer ?? 'No data yet'}`,
        },
      ]
    : [];

  if (isInitialLoading) return <Loader />;

  if (error && !dashboard) {
    return (
      <section
        role="alert"
        aria-live="assertive"
        className="border-destructive/30 bg-destructive/10 flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-destructive text-sm">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void handleManualRefresh()}
          disabled={isRefreshing || loading}
        >
          {isRefreshing || loading ? (
            <>
              <Spinner className="mr-2" />
              Retrying...
            </>
          ) : (
            'Retry'
          )}
        </Button>
      </section>
    );
  }

  if (sites.length === 0 && !error) {
    return (
      <AddSite
        icon={<Globe />}
        title="Add your first site"
        description="Before you can see analytics, you need to register a website. Add your site and paste the tracking snippet."
        buttonText="Add site"
        sites={false}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <section className="border-b pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground inline-flex items-center gap-2 text-xs font-medium">
              <span aria-hidden="true" className="bg-primary h-2 w-2 rounded-full motion-safe:animate-pulse" />
              Live analytics dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-wide uppercase"> {currentSite?.name || 'undefined'}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
              Monitor traffic, identify top referrers, and watch recent activity in real time.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            {sites.length > 1 && (
              <Select value={selectedSiteId ?? undefined} onValueChange={handleSiteChange}>
                <SelectTrigger className="bg-background h-9 w-full max-w-[min(26rem,80vw)] focus:ring-1 sm:w-auto sm:max-w-none sm:min-w-50">
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent className="max-w-[min(26rem,calc(100vw-2rem))]">
                  {sites.map(s => {
                    const siteLabel = `${s.name} (${s.domain})`;
                    return (
                      <SelectItem key={s.id} value={s.id} title={siteLabel}>
                        <span className="block max-w-88 truncate">{siteLabel}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            <div className="flex items-center gap-3">
              <p className="text-muted-foreground text-xs sm:text-sm">
                {lastSync ? `Last sync ${getRelativeTime(lastSync)}` : 'Syncing...'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleManualRefresh()}
                disabled={isRefreshing || loading}
              >
                {isRefreshing || loading ? (
                  <>
                    <Spinner className="mr-2" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>
            </div>
          </div>
        </div>
        {error ? (
          <div
            role="alert"
            aria-live="assertive"
            className="border-destructive/30 bg-destructive/10 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2"
          >
            <p className="text-destructive text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleManualRefresh()}
              disabled={isRefreshing || loading}
            >
              {isRefreshing || loading ? (
                <>
                  <Spinner className="mr-2" />
                  Retrying...
                </>
              ) : (
                'Retry'
              )}
            </Button>
          </div>
        ) : null}
      </section>

      <SummaryCards cards={summaryData} />

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <VisitsTrend
          loading={loading}
          dayTrend={dashboard?.trend?.buckets ?? []}
          peakHour={dashboard?.trend?.peakHour ?? 'No traffic yet'}
        />
        <TrafficHighlights highlights={dashboard?.highlights ?? []} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TopEntriesCard title="Top pages" entries={dashboard?.topPages ?? []} emptyMessage="No page data yet." />
        <TopEntriesCard
          title="Referrer breakdown"
          entries={dashboard?.topReferrers ?? []}
          emptyMessage="No referrer data yet."
          barColor="bg-chart-1"
        />
      </section>

      <RecentActivity loading={loading} activities={dashboard?.recentActivity ?? []} />
    </div>
  );
}
