import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HighlightItem } from '@/types/dashboard';

type TrafficHighlightsProps = {
  highlights: HighlightItem[];
};

export function TrafficHighlights({ highlights }: TrafficHighlightsProps) {
  return (
    <Card className="gap-0 border-dashed py-6 shadow-none">
      <CardHeader className="pt-0 pb-6">
        <CardTitle className="text-muted-foreground mt-1 text-base font-semibold tracking-wider uppercase">
          Traffic highlights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-0">
        <div className="flex flex-col gap-6">
          {highlights.map((item, index) => (
            <div key={item.label} className="flex items-center gap-5">
              <div className="bg-muted flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                <span className="text-foreground font-mono text-[15px] font-medium">{index + 1}</span>
              </div>
              <div className="flex-1 space-y-1.5">
                <p className="text-muted-foreground/70 font-mono text-[11px] leading-none font-medium">{item.label}</p>
                <p className="text-foreground max-w-50 truncate font-mono text-[15px] font-medium tracking-tight">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
