'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy, Globe, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { getNextJsSnippet, getUniversalSnippet } from '@/lib/helper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSites } from '@/hooks/use-site';
import ErrorUI from '@/components/Error';

const COPY_IDLE_LABEL = 'Copy snippet';
type SnippetType = 'universal' | 'nextjs';

export default function SetupPage() {
  const { refreshSites, sites, loading, error } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [copyLabels, setCopyLabels] = useState<Record<SnippetType, string>>({
    universal: COPY_IDLE_LABEL,
    nextjs: COPY_IDLE_LABEL,
  });

  const effectiveSelectedSiteId = useMemo(() => {
    if (sites.length === 0) {
      return '';
    }

    if (sites.length === 1) {
      return sites[0].id;
    }

    const selectedStillExists = sites.some(site => site.id === selectedSiteId);
    return selectedStillExists ? selectedSiteId : '';
  }, [selectedSiteId, sites]);

  const currentSite = sites.find(s => s.id === effectiveSelectedSiteId);

  const snippetSiteId = effectiveSelectedSiteId || 'YOUR_SITE_ID';
  const universalSnippet = useMemo(() => getUniversalSnippet(snippetSiteId), [snippetSiteId]);
  const nextJsSnippet = useMemo(() => getNextJsSnippet(snippetSiteId), [snippetSiteId]);

  async function copySnippet(type: SnippetType, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyLabels(prev => ({ ...prev, [type]: 'Copied' }));
    } catch {
      setCopyLabels(prev => ({ ...prev, [type]: 'Copy failed' }));
    }

    setTimeout(() => {
      setCopyLabels(prev => ({ ...prev, [type]: COPY_IDLE_LABEL }));
    }, 1700);
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

      <section className="grid gap-6 lg:grid-cols-3">
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
            <Select value={effectiveSelectedSiteId || undefined} onValueChange={id => setSelectedSiteId(id)}>
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
          <h2 className="text-lg font-semibold tracking-tight text-black">Step 2: Universal Snippet</h2>
          <p className="mt-2 text-sm text-black">Use this for HTML, React, Vue, WordPress, or any website.</p>
          <pre className="mt-4 max-h-52 overflow-auto rounded-lg border p-4 text-xs leading-relaxed text-black">
            <code>{universalSnippet}</code>
          </pre>
          <Button
            onClick={() => void copySnippet('universal', universalSnippet)}
            className="mt-4 w-full cursor-pointer border bg-white font-semibold text-black hover:bg-white/90"
          >
            {copyLabels.universal === 'Copied' ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied to clipboard
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                {copyLabels.universal === COPY_IDLE_LABEL ? 'Copy universal snippet' : copyLabels.universal}
              </>
            )}
          </Button>
        </Card>

        <Card className="text-primary-foreground border-dashed p-6">
          <h2 className="text-lg font-semibold tracking-tight text-black">Step 2: Next.js Snippet</h2>
          <p className="mt-2 text-sm text-black">
            Use this in your Next.js project where you can render <code>{'<Script />'}</code>.
          </p>
          <pre className="mt-4 max-h-52 overflow-auto rounded-lg border p-4 text-xs leading-relaxed text-black">
            <code>{nextJsSnippet}</code>
          </pre>
          <Button
            onClick={() => void copySnippet('nextjs', nextJsSnippet)}
            className="mt-4 w-full cursor-pointer border bg-white font-semibold text-black hover:bg-white/90"
          >
            {copyLabels.nextjs === 'Copied' ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied to clipboard
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                {copyLabels.nextjs === COPY_IDLE_LABEL ? 'Copy Next.js snippet' : copyLabels.nextjs}
              </>
            )}
          </Button>
        </Card>
      </section>

      <Card className="border-dashed p-6">
        <h2 className="text-lg font-semibold tracking-tight">Step 3: Where to paste</h2>

        <div className="mt-4">
          <h3 className="text-sm font-semibold">For HTML/React/Vue/etc.</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Open your main HTML/template file and paste the universal snippet right before{' '}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">&lt;/body&gt;</code>.
          </p>
          <pre className="bg-muted mt-3 overflow-auto rounded-lg p-4 text-xs leading-relaxed">
            <code>{`<!-- index.html -->
<html>
  <body>
    <!-- your website content -->

    <!-- paste the whovisited snippet here -->
    ${universalSnippet}
  </body>
</html>`}</code>
          </pre>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold">For Next.js</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Open <code className="bg-muted rounded px-1 py-0.5 text-xs">app/layout.tsx</code> and paste the Next.js
            snippet inside <code className="bg-muted rounded px-1 py-0.5 text-xs">&lt;body&gt;</code>, right before{' '}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">&lt;/body&gt;</code>.
          </p>
          <pre className="bg-muted mt-3 overflow-auto rounded-lg p-4 text-xs leading-relaxed">
            <code>{`// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        ${nextJsSnippet.split('\n').slice(2).join('\n        ')}
      </body>
    </html>
  );
}`}</code>
          </pre>
        </div>
      </Card>

      <Card className="border-dashed p-6">
        <h2 className="text-lg font-semibold tracking-tight">Step 4: Verify tracking</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Publish your changes, visit a few pages on your site, then open Dashboard. You should start seeing visits in
          real time.
        </p>
      </Card>
    </main>
  );
}
