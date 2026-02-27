import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ApiResponse } from '@/lib/api';
import type { DashboardData } from '@/types/dashboard';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/lib/storage';
import { useSites } from './use-site';

const POLL_INTERVAL_MS = 8000;
const DASHBOARD_SITE_STORAGE_KEY = 'dashboard:selectedSiteId';

export function useDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { sites: userSites, loading: sitesLoading, error: sitesError } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(() => {
    return searchParams.get('siteId') ?? getLocalStorage<string>(DASHBOARD_SITE_STORAGE_KEY);
  });

  const sites = useMemo(
    () =>
      userSites.map(site => ({
        id: site.id,
        name: site.name,
        domain: site.domain,
      })),
    [userSites]
  );

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const error = sitesError ?? dashboardError;

  const fetchDashboard = useCallback(async (siteId: string | null) => {
    try {
      const url = siteId ? `/api/dashboard?siteId=${encodeURIComponent(siteId)}` : '/api/dashboard';
      const { data } = await api.get<ApiResponse<DashboardData>>(url);

      if (data.data) {
        setDashboard(data.data);
        setSelectedSiteId(prev => (prev === data.data.siteId ? prev : data.data.siteId));
      } else {
        setDashboard(null);
        setSelectedSiteId(null);
      }
      setDashboardError(null);
      setLastSync(new Date().toISOString());
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      const message =
        err instanceof AxiosError
          ? ((err.response?.data as { error?: string })?.error ?? 'Failed to fetch dashboard data')
          : 'Failed to fetch dashboard data';
      setDashboardError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSelectedSiteId(prev => {
      if (userSites.length === 0) return null;

      if (prev) return prev;

      return userSites[0].id;
    });
  }, [userSites]);

  useEffect(() => {
    if (!selectedSiteId) {
      removeLocalStorage(DASHBOARD_SITE_STORAGE_KEY);
      return;
    }
    setLocalStorage(DASHBOARD_SITE_STORAGE_KEY, selectedSiteId);
  }, [selectedSiteId]);

  useEffect(() => {
    if (sitesLoading) return;

    const shouldFetchNow = !dashboard || (selectedSiteId ? dashboard.siteId !== selectedSiteId : false);
    if (shouldFetchNow) {
      setLoading(true);
      void fetchDashboard(selectedSiteId);
    }

    const interval = setInterval(() => {
      void fetchDashboard(selectedSiteId);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [dashboard, fetchDashboard, selectedSiteId, sitesLoading]);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetchDashboard(selectedSiteId);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSiteChange = (value: string) => {
    setSelectedSiteId(value);
    setDashboard(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set('siteId', value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return {
    dashboard,
    sites,
    loading,
    error,
    lastSync,
    selectedSiteId,
    handleManualRefresh,
    handleSiteChange,
    isRefreshing,
  };
}
