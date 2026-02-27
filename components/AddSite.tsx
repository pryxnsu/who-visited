import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export default function AddSite({
  icon,
  title,
  description,
  buttonText,
  sites,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  sites: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">{icon}</div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">{description}</p>
      </div>
      <Button asChild className="gap-2" disabled={sites}>
        <Link href="/sites">
          <Plus className="h-4 w-4" />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
}
