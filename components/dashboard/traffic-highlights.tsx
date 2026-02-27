import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HighlightItem } from '@/types/dashboard';

type TrafficHighlightsProps = {
  highlights: HighlightItem[];
};

export function TrafficHighlights({ highlights }: TrafficHighlightsProps) {
  return (
    <Card className="gap-0 py-6 shadow-none border-dashed">
      <CardHeader className="pt-0 pb-6">
        <CardTitle className="text-xl font-semibold tracking-tight">Traffic highlights</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-0">
        <div className="flex flex-col gap-6">
          {highlights.map((item, index) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <span className="text-primary font-bold">{index + 1}</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-muted-foreground text-sm leading-none font-medium">{item.label}</p>
                <p className="max-w-50 truncate text-lg font-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
