'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import {
  AlertTriangle,
  ExternalLink,
  MonitorUp,
  Settings2,
  ShieldCheck,
  Trash2,
  UserCircle2,
  Wrench,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getLocalStorage, setLocalStorage } from '@/lib/storage';
import {
  DASHBOARD_POLL_INTERVAL_OPTIONS,
  DASHBOARD_POLL_INTERVAL_STORAGE_KEY,
  DEFAULT_DASHBOARD_POLL_INTERVAL_MS,
  isValidDashboardPollInterval,
} from '@/lib/constant';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

const DELETE_CONFIRMATION_TEXT = 'DELETE';

const pollIntervalOptions = [
  { value: 5000, label: '5 seconds' },
  { value: 8000, label: '8 seconds (default)' },
  { value: 15000, label: '15 seconds' },
  { value: 30000, label: '30 seconds' },
] as const;

export default function SettingsPage() {
  const { data: session, status } = useSession();

  const [selectedPollInterval, setSelectedPollInterval] = useState<string>(String(DEFAULT_DASHBOARD_POLL_INTERVAL_MS));
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    const stored = getLocalStorage<number>(DASHBOARD_POLL_INTERVAL_STORAGE_KEY);
    if (typeof stored === 'number' && isValidDashboardPollInterval(stored)) {
      setSelectedPollInterval(String(stored));
      return;
    }
    setSelectedPollInterval(String(DEFAULT_DASHBOARD_POLL_INTERVAL_MS));
  }, []);

  const joinedDate = useMemo(() => {
    const createdAt = session?.user?.createdAt;
    if (!createdAt) return 'Unavailable';
    const parsedDate = new Date(createdAt);
    if (Number.isNaN(parsedDate.getTime())) return 'Unavailable';

    return parsedDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [session?.user?.createdAt]);

  const isDeleteConfirmationValid = deleteConfirmation.trimEnd().toUpperCase() === DELETE_CONFIRMATION_TEXT;

  async function handleSavePreferences() {
    const value = Number(selectedPollInterval);
    if (!isValidDashboardPollInterval(value)) {
      toast.error('Invalid refresh interval selected.');
      return;
    }

    setIsSavingPreferences(true);
    try {
      setLocalStorage(DASHBOARD_POLL_INTERVAL_STORAGE_KEY, value);
      toast.success('Dashboard refresh interval updated.');
    } finally {
      setIsSavingPreferences(false);
    }
  }

  async function handleDeleteAccount() {
    if (!isDeleteConfirmationValid) {
      toast.error('Type DELETE to confirm account deletion.');
      return;
    }

    setIsDeletingAccount(true);
    try {
      await api.delete('/api/account');
      toast.success('Account deleted. Redirecting to login...');
      await signOut({ callbackUrl: '/login' });
    } catch (err) {
      console.error('Error in deleting account:', err);
      const message =
        err instanceof AxiosError
          ? ((err.response?.data as { error?: string })?.error ?? 'Failed to delete account. Please try again.')
          : 'Failed to delete account. Please try again.';

      toast.error(message);
      setIsDeletingAccount(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex w-full items-center justify-center py-20">
        <Spinner className="h-5 w-5" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">You are not signed in</h1>
        <p className="text-muted-foreground text-sm">Please login to access settings.</p>
        <Button asChild>
          <Link href="/login">Go to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="border-b pb-6">
        <p className="text-muted-foreground inline-flex items-center gap-2 text-xs font-medium">
          <Settings2 className="h-3.5 w-3.5" />
          Preferences and account controls
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base">
          Manage your account details, dashboard behavior, and security actions.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="gap-0 border-dashed py-6 shadow-none">
          <CardHeader className="pb-5">
            <CardTitle className="inline-flex items-center gap-2 text-xl tracking-tight">
              <UserCircle2 className="h-5 w-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-muted/40 rounded-md border p-4">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Name</p>
                <p className="mt-2 text-sm font-semibold">{session?.user?.name ?? 'Unknown user'}</p>
              </div>
              <div className="bg-muted/40 rounded-md border p-4">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Email</p>
                <p className="mt-2 text-sm font-semibold break-all">{session?.user?.email ?? 'Not available'}</p>
              </div>
              <div className="bg-muted/40 rounded-md border p-4">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Role</p>
                <p className="mt-2 text-sm font-semibold capitalize">{session?.user?.role ?? 'user'}</p>
              </div>
              <div className="bg-muted/40 rounded-md border p-4">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Member since</p>
                <p className="mt-2 text-sm font-semibold">{joinedDate}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={session?.user?.emailVerified ? 'default' : 'secondary'}>
                {session?.user?.emailVerified ? 'Email verified' : 'Email not verified'}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t pt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/sites" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Manage sites
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/setup" className="gap-2">
                  <Wrench className="h-4 w-4" />
                  Setup tracking
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 border-dashed py-6 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="inline-flex items-center gap-2 text-xl tracking-tight">
              <MonitorUp className="h-5 w-5" />
              Dashboard Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Auto-refresh interval</p>
              <p className="text-muted-foreground mt-1 text-sm">Controls how often dashboard analytics polling runs.</p>
            </div>

            <Select value={selectedPollInterval} onValueChange={setSelectedPollInterval}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                {pollIntervalOptions.map(option => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="text-muted-foreground text-xs">
              Supported values: {DASHBOARD_POLL_INTERVAL_OPTIONS.map(ms => `${ms / 1000}s`).join(', ')}
            </p>

            <Button onClick={() => void handleSavePreferences()} disabled={isSavingPreferences}>
              {isSavingPreferences ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                'Save preferences'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="gap-0 border-dashed py-6 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="inline-flex items-center gap-2 text-xl tracking-tight">
              <AlertTriangle className="text-destructive h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Deleting your account will permanently remove your profile, registered sites, and all visitor analytics.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                Type <span className="font-mono">{DELETE_CONFIRMATION_TEXT}</span> to enable account deletion
              </p>
              <Input
                value={deleteConfirmation}
                onChange={event => setDeleteConfirmation(event.target.value)}
                placeholder="Type DELETE"
                className="max-w-sm"
              />
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={!isDeleteConfirmationValid || isDeletingAccount}>
                  {isDeletingAccount ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete account
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your account, all sites, and all tracked visitor data will be
                    permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeletingAccount}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeletingAccount}
                    onClick={event => {
                      event.preventDefault();
                      void handleDeleteAccount();
                    }}
                  >
                    {isDeletingAccount ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Yes, delete account
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
