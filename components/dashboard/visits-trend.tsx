'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { TrendBucket } from '@/types/dashboard';

type VisitsTrendProps = {
  loading: boolean;
  dayTrend: TrendBucket[];
  peakHour: string;
};

const chartConfig = {
  count: {
    label: 'Visits',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const DottedBackgroundPattern = () => {
  return (
    <pattern id="visits-trend-dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle className="dark:text-muted/40 text-muted" cx="2" cy="2" r="1" fill="currentColor" />
    </pattern>
  );
};

const CustomHatchedBar = (props: React.SVGProps<SVGRectElement> & { dataKey?: string }) => {
  const { fill, x, y, width, height, dataKey } = props;

  return (
    <>
      <rect
        rx={4}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="none"
        fill={`url(#hatched-bar-pattern-${dataKey})`}
      />
      <defs>
        <pattern
          key={dataKey}
          id={`hatched-bar-pattern-${dataKey}`}
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <rect width="10" height="10" opacity={0.5} fill={fill}></rect>
          <rect width="1" height="10" fill={fill}></rect>
        </pattern>
      </defs>
    </>
  );
};

export function VisitsTrend({ loading, dayTrend, peakHour }: VisitsTrendProps) {
  return (
    <Card className="flex flex-col gap-0 border-dashed rounded-4xl py-6 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pt-0 pb-6 px-8">
        <h2 className="text-muted-foreground mt-1 text-base font-semibold tracking-wider uppercase">
          Visits trend (7 days)
        </h2>
        <div className="bg-muted text-foreground flex items-center justify-center rounded-sm px-2 py-2 font-mono text-[13px] font-medium leading-none">
          Peak: {peakHour}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-0 pb-0 px-8">
        {loading ? (
          <p className="text-muted-foreground m-auto text-sm">Loading trend...</p>
        ) : (
          <ChartContainer config={chartConfig} className="mt-auto h-56 w-full">
            <BarChart accessibilityLayer data={dayTrend}>
              <rect x="0" y="0" width="100%" height="85%" fill="url(#visits-trend-dots)" />
              <defs>
                <DottedBackgroundPattern />
              </defs>
              <XAxis dataKey="label" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} shape={<CustomHatchedBar />} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
