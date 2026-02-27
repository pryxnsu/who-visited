import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRelativeTime } from '@/lib/helper';
import type { ActivityItem } from '@/types/dashboard';

type RecentActivityProps = {
  loading: boolean;
  activities: ActivityItem[];
};

export function RecentActivity({ loading, activities }: RecentActivityProps) {
  return (
    <Card className="flex flex-col gap-0 py-6 shadow-none">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between pt-0 pb-4">
        <CardTitle className="mt-1 text-xl font-semibold tracking-tight">Recent activity</CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-0">
        {loading && activities.length === 0 ? (
          <p className="text-muted-foreground mt-4 text-sm">Loading visits...</p>
        ) : null}

        {!loading && activities.length === 0 ? (
          <div className="mt-4 flex h-37.5 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground px-4 text-center text-sm">
              No visits tracked yet.
              <br />
              Install the tracking snippet on your portfolio to see data.
            </p>
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-4">
          {activities.map(activity => (
            <Card
              key={activity.id}
              className="group bg-background hover:bg-muted/40 flex flex-col gap-1 rounded-lg border p-4 shadow-none transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-semibold">{activity.pagePath}</p>
                <p className="text-muted-foreground shrink-0 text-xs font-medium">
                  {getRelativeTime(activity.visitedAt)}
                </p>
              </div>
              <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                <span className="bg-muted max-w-30 truncate rounded px-1.5 py-0.5">{activity.referrer}</span>
                <span>•</span>
                <span>{activity.browser}</span>
                <span>•</span>
                <span>{activity.country}</span>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
