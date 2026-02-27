import { formatShare } from '@/lib/helper';
import type { TopEntry } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TopEntriesCardProps {
  title: string;
  entries: TopEntry[];
  emptyMessage: string;
  barColor?: string;
};

export function TopEntriesCard({ title, entries, emptyMessage, barColor = 'bg-primary' }: TopEntriesCardProps) {
  return (
    <Card className="gap-0 py-6 shadow-none">
      <CardHeader className="pt-0 pb-6">
        <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-0">
        {entries.length === 0 ? (
          <div className="flex h-37.5 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.label}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <p className="truncate font-medium">{entry.label}</p>
                  <p className="font-semibold">
                    {entry.count}{' '}
                    <span className="text-muted-foreground ml-1 font-normal">({formatShare(entry.share)})</span>
                  </p>
                </div>
                <div className="bg-muted mt-2 h-2 overflow-hidden rounded-full">
                  <div
                    className={`${barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(2, Math.round(entry.share * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
