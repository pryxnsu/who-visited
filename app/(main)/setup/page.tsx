'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Globe, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { getSnippet } from '@/lib/helper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSites } from '@/hooks/use-site';
import ErrorUI from '@/components/Error';

const COPY_IDLE_LABEL = 'Copy snippet';

export default function SetupPage() {
  const { refreshSites, sites, loading, error } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [copyLabel, setCopyLabel] = useState(COPY_IDLE_LABEL);

  const currentSite = sites.find(s => s.id === selectedSiteId);

  const snippet = useMemo(() => {
    return getSnippet(selectedSiteId || 'YOUR_SITE_ID');
  }, [selectedSiteId]);

  useEffect(() => {
    if (copyLabel === COPY_IDLE_LABEL) return;
    const timeout = setTimeout(() => setCopyLabel(COPY_IDLE_LABEL), 1700);
    return () => clearTimeout(timeout);
  }, [copyLabel]);

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopyLabel('Copied');
    } catch {
      setCopyLabel('Copy failed');
    }
  }

  if (loading) {
    return (
      <main className="flex w-full items-center justify-center py-20">
        <div className="bg-primary h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </main>
    );
  }

  if (error) {
    return <ErrorUI error={error} onRetry={refreshSites} />;
  }

  if (sites.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
          <Globe className="text-muted-foreground h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">No sites registered</h1>
          <p className="text-muted-foreground mt-2 max-w-md text-sm">
            You need to add a site before you can get a tracking snippet. Head over to Sites to get started.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/sites">
            <Plus className="h-4 w-4" />
            Add a site
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="flex w-full flex-col gap-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Setup Tracking</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
          Follow these steps to install tracking on your website and start receiving visit analytics.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-dashed p-6">
          <h2 className="text-lg font-semibold tracking-tight">Step 1: Select Site</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Choose which site you want to track. The copied snippet will include this site id.
          </p>
          {sites.length === 1 ? (
            <div className="mt-4 flex items-center gap-2 rounded-md border px-3 py-2">
              <Globe className="text-muted-foreground h-4 w-4" />
              <span className="font-medium">{currentSite?.name}</span>
              <span className="text-muted-foreground text-sm">({currentSite?.domain})</span>
            </div>
          ) : (
            <Select value={selectedSiteId ?? undefined} onValueChange={id => setSelectedSiteId(id)}>
              <SelectTrigger className="bg-background h-9 w-full max-w-[min(26rem,80vw)] focus:ring-1">
                <SelectValue placeholder="Select a site" />
              </SelectTrigger>
              <SelectContent position="popper" className="w-[--radix-select-trigger-width] max-w-[min(26rem,80vw)]">
                {sites.map(s => {
                  const siteLabel = `${s.name} (${s.domain})`;
                  return (
                    <SelectItem key={s.id} value={s.id} title={siteLabel}>
                      <span className="block w-full truncate">{siteLabel}</span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </Card>

        <Card className="text-primary-foreground border-dashed p-6">
          <h2 className="text-lg font-semibold tracking-tight text-black">Step 2: Copy Snippet</h2>
          <p className="mt-2 text-sm text-black">Copy this snippet and paste it into your portfolio website.</p>
          <pre className="mt-4 max-h-52 overflow-auto rounded-lg border p-4 text-xs leading-relaxed text-black">
            <code>{snippet}</code>
          </pre>
          <Button
            onClick={copySnippet}
            className="mt-4 w-full cursor-pointer border bg-white font-semibold text-black hover:bg-white/90"
          >
            {copyLabel === 'Copied' ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied to clipboard
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy code snippet
              </>
            )}
          </Button>
        </Card>
      </section>

      <Card className="border-dashed p-6">
        <h2 className="text-lg font-semibold tracking-tight">Step 3: Paste in your layout file</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Open your portfolio app and paste the snippet in your root layout/template file (for example:{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">app/layout.tsx</code>) right before the closing{' '}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">&lt;/body&gt;</code> tag.
        </p>
        <pre className="bg-muted mt-4 overflow-auto rounded-lg p-4 text-xs leading-relaxed">
          <code>{`// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {/* paste the whovisited snippet here */}
      </body>
    </html>
  );
}`}</code>
        </pre>
      </Card>

      <Card className="border-dashed p-6">
        <h2 className="text-lg font-semibold tracking-tight">Step 4: Verify tracking</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Deploy/update your site, visit a few pages, then open Dashboard. You should start seeing visits in real time.
        </p>
      </Card>
    </main>
  );
}
