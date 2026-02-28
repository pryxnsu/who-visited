'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { api, ApiResponse } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Check, Copy, ExternalLink, Globe, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ErrorUI from '@/components/Error';
import { AddSiteFormValues, addSiteSchema } from '@/types/schema';
import { getSnippet } from '@/lib/helper';
import { useSites } from '@/hooks/use-site';
import { Site } from '@/types/site';

export default function Page() {
  const { refreshSites, sites, loading, error, appendNewSite, deletingSiteId, handleDelete } = useSites();

  const [showForm, setShowForm] = useState(false);
  const [copiedSiteId, setCopiedSiteId] = useState<string | null>(null);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);

  // ── Form ──
  const form = useForm<AddSiteFormValues>({
    resolver: zodResolver(addSiteSchema),
    defaultValues: {
      name: '',
      domain: '',
    },
  });

  // ── Form submission ──
  async function onSubmit(values: AddSiteFormValues) {
    try {
      const { data } = await api.post<ApiResponse<Site>>('/api/sites', {
        name: values.name.trim(),
        domain: values.domain.trim().toLowerCase(),
      });

      if (data.data) {
        appendNewSite(data.data);
      }

      form.reset();
      setShowForm(false);
    } catch (err) {
      console.error('Error adding site:', err);
      const message =
        err instanceof AxiosError
          ? ((err.response?.data as { error?: string })?.error ?? 'Failed to add site')
          : 'Failed to add site. Please try again.';
      form.setError('root', { message });
    }
  }

  // -- Copy snippet --
  async function copySnippet(siteId: string) {
    try {
      await navigator.clipboard.writeText(getSnippet(siteId));
      setCopiedSiteId(siteId);
      setTimeout(() => setCopiedSiteId(null), 2000);
    } catch (err) {
      console.error('Error copying snippet:', err);
    }
  }

  const hasSites = sites.length > 0;

  const formattedSites = useMemo(() => {
    return sites.map(s => ({
      ...s,
      createdLabel: new Date(s.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }));
  }, [sites]);

  return (
    <div className="flex w-full flex-col gap-8">
      <section className="pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground inline-flex items-center gap-2 text-xs font-medium">
              <Globe className="h-3.5 w-3.5" />
              Site Management
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Your Sites</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
              Register your websites to start tracking visitors. Each site gets a unique tracking snippet.
            </p>
          </div>
          {hasSites && !loading && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Site
            </Button>
          )}
        </div>
        {error && <ErrorUI error={error} onRetry={refreshSites} />}
      </section>

      <Dialog
        open={showForm}
        onOpenChange={open => {
          if (!open) form.reset();
          setShowForm(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Add a new site</DialogTitle>
            <DialogDescription>Register a new domain to create its dedicated tracking snippet.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-6">
              <div className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Site name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., My Portfolio"
                          className="bg-background/50 focus-visible:ring-ring h-11 rounded-xl shadow-sm transition-all focus-visible:ring-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Domain</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., myportfolio.com"
                          className="bg-background/50 focus-visible:ring-ring h-11 rounded-xl shadow-sm transition-all focus-visible:ring-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.formState.errors.root && (
                <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg border p-3 text-sm font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="mt-2 flex items-center justify-end gap-3 border-t pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    form.reset();
                  }}
                  className="h-10 rounded-xl px-4 font-medium transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-10 rounded-xl px-6 font-medium shadow-sm transition-all active:scale-[0.98]"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Adding...
                    </>
                  ) : (
                    'Add site'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="text-muted-foreground h-6 w-6" />
        </div>
      ) : !hasSites && !showForm && !error ? (
        <section className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <div className="bg-muted mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <Globe className="text-muted-foreground h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold">No sites yet</h2>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            Add your first website to get a tracking snippet and start monitoring visitors.
          </p>
          <Button onClick={() => setShowForm(true)} className="mt-5 gap-2">
            <Plus className="h-4 w-4" />
            Add your first site
          </Button>
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          {formattedSites.map(site => (
            <Card key={site.id} className="border-dashed p-5 shadow-none">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{site.name}</h3>
                    <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 font-mono text-[11px]">
                      {site.id}
                    </span>
                  </div>
                  <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      {site.domain}
                    </span>
                    <span>· Added {site.createdLabel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => void copySnippet(site.id)}>
                    {copiedSiteId === site.id ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy snippet
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSiteToDelete(site)}
                    disabled={deletingSiteId === site.id}
                  >
                    {deletingSiteId === site.id ? (
                      <Spinner className="h-3.5 w-3.5" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    {deletingSiteId === site.id ? 'Removing...' : 'Remove'}
                  </Button>
                </div>
              </div>

              <details className="group mt-4">
                <summary className="text-muted-foreground cursor-pointer text-xs font-medium hover:underline">
                  View tracking snippet
                </summary>
                <pre className="mt-2 max-h-44 overflow-auto rounded-lg border bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-700">
                  <code>{getSnippet(site.id)}</code>
                </pre>
              </details>
            </Card>
          ))}
        </section>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!siteToDelete}
        onOpenChange={open => {
          if (!open) setSiteToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="text-foreground font-semibold">{siteToDelete?.name}</span> (
              <span className="font-mono text-xs">{siteToDelete?.domain}</span>) and all its associated tracking data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingSiteId === siteToDelete?.id}
              onClick={e => {
                e.preventDefault();
                if (!siteToDelete) return;
                handleDelete(siteToDelete.id).then(() => setSiteToDelete(null));
              }}
            >
              {deletingSiteId === siteToDelete?.id ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Removing...
                </>
              ) : (
                'Yes, remove site'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
