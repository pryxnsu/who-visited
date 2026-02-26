import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function ErrorUI({
  error,
  classNames,
  onRetry,
}: {
  error: string;
  classNames?: string;
  onRetry?: () => void;
}) {
  return (
    <div className={cn('flex min-h-100 flex-col items-center justify-center space-y-6 p-8 text-center', classNames)}>
      <div className="animate-in fade-in zoom-in flex size-20 items-center justify-center rounded-[2rem] border border-red-100 bg-red-50 duration-500">
        <AlertCircle className="size-10 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Oops! Something went wrong</h2>
        <p className="mx-auto max-w-70 text-sm leading-relaxed text-zinc-500">
          {error || "We couldn't load your agents. Please try again or contact support if the problem persists."}
        </p>
      </div>
      <Button
        onClick={() => onRetry?.()}
        variant="outline"
        className="h-11 gap-2 rounded-xl border-zinc-200 px-6 shadow-xs transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
      >
        <RefreshCw className="size-4" />
        Try Again
      </Button>
    </div>
  );
}
