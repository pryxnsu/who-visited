import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { normalizeTime } from '@/lib/helper';
import type { ActivityItem } from '@/types/dashboard';

type RecentActivityProps = {
  loading: boolean;
  activities: ActivityItem[];
};

export function RecentActivity({ loading, activities }: RecentActivityProps) {
  return (
    <Card className="flex flex-col gap-0 border-dashed py-6 shadow-none">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between px-7 pt-0">
        <CardTitle className="text-muted-foreground mt-1 text-base font-semibold tracking-wider uppercase">
          Recent activity
        </CardTitle>
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

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-40 text-xs font-semibold tracking-wider uppercase">Time</TableHead>
                <TableHead className="text-xs font-semibold tracking-wider uppercase">Request</TableHead>
                <TableHead className="w-30 text-xs font-semibold tracking-wider uppercase">Browser</TableHead>
                <TableHead className="w-30 text-xs font-semibold tracking-wider uppercase">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map(activity => (
                <TableRow key={activity.id} className="group hover:bg-muted/30 border-t transition-colors">
                  <TableCell className="text-muted-foreground shrink-0 py-4 align-top text-[13px]">
                    {normalizeTime(activity.visitedAt)}
                  </TableCell>

                  <TableCell className="py-4 align-top">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="text-foreground truncate font-mono text-[13px] font-medium">
                        {activity.pagePath}
                      </span>
                      {activity.referrer && (
                        <span className="bg-muted text-muted-foreground shrink-0 truncate rounded-sm px-2 pt-1 pb-0.5 font-mono text-[11px]">
                          {activity.referrer}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground shrink-0 truncate py-4 align-top text-[13px]">
                    {activity.browser}
                  </TableCell>

                  <TableCell className="text-muted-foreground shrink-0 truncate py-4 align-top text-[13px]">
                    {activity.country}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
