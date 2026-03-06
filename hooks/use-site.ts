import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { api, ApiResponse } from '@/lib/api';
import { Site, SiteVerificationMethod } from '@/types/site';

export const useSites = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);
  const [verifyingSiteId, setVerifyingSiteId] = useState<string | null>(null);

  const fetchSites = useCallback(async () => {
    try {
      const { data } = await api.get<ApiResponse<Site[]>>('/api/sites');
      setSites(data.data ?? []);
      setError(null);
    } catch (err) {
      console.error('Error fetching sites:', err);
      const message =
        err instanceof AxiosError
          ? ((err.response?.data as { error?: string })?.error ?? 'Failed to fetch sites')
          : 'Failed to fetch sites';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSites();
  }, [fetchSites]);

  const appendNewSite = (site: Site) => {
    setSites(prev => (prev.some(existingSite => existingSite.id === site.id) ? prev : [site, ...prev]));
  };

  const replaceSite = (updated: Site | null) => {
    if (!updated) return;
    setSites(prev => prev.map(site => (site.id === updated.id ? updated : site)));
  };

  const handleDelete = async (id: string) => {
    const siteToDelete = sites.find(s => s.id === id);
    if (!siteToDelete) return;
    const siteIndex = sites.findIndex(s => s.id === id);

    setDeletingSiteId(id);
    setSites(prev => prev.filter(s => s.id !== id));

    try {
      await api.delete(`/api/sites/${encodeURIComponent(id)}`);
    } catch (err) {
      console.error('Error deleting site:', err);
      const message =
        err instanceof AxiosError
          ? ((err.response?.data as { error?: string })?.error ?? 'Failed to delete site')
          : 'Failed to delete site. Please try again.';
      toast.error(message);

      setSites(prev => {
        if (prev.some(s => s.id === id)) {
          return prev;
        }

        const nextSites = [...prev];
        const insertIndex = Math.min(siteIndex, nextSites.length);
        nextSites.splice(insertIndex, 0, siteToDelete);
        return nextSites;
      });
    } finally {
      setDeletingSiteId(current => (current === id ? null : current));
    }
  };

  const verifySite = async (id: string, method: SiteVerificationMethod) => {
    setVerifyingSiteId(id);
    try {
      const { data } = await api.post<ApiResponse<Site>>(`/api/sites/${encodeURIComponent(id)}/verify`, { method });
      replaceSite(data.data ?? null);
      toast.success(data.message ?? 'Domain verified successfully.');
    } catch (err) {
      console.error('Error verifying site:', err);

      if (err instanceof AxiosError) {
        const payload = err.response?.data as { message?: string; data?: Site } | undefined;
        replaceSite(payload?.data ?? null);
        toast.error(payload?.message ?? 'Verification failed. Please try again.');
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } finally {
      setVerifyingSiteId(current => (current === id ? null : current));
    }
  };

  return {
    refreshSites: fetchSites,
    sites,
    loading,
    error,
    appendNewSite,
    handleDelete,
    deletingSiteId,
    verifySite,
    verifyingSiteId,
  };
};
