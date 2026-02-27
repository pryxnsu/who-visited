import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SummaryCardItem = {
  label: string;
  value: string;
  detail: string;
};

export function SummaryCards({ cards }: { cards: SummaryCardItem[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(card => (
        <Card key={card.label} className="gap-0 py-6 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-muted-foreground text-sm font-medium tracking-normal">{card.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight">{card.value}</p>
            <p className="text-muted-foreground mt-1 text-xs">{card.detail}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
