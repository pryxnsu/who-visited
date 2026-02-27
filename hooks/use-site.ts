import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { api } from '@/lib/api';
import { Site } from '@/types/site';
import ApiResponse from '@/lib/ApiResponse';

export const useSites = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);

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

  return { refreshSites: fetchSites, sites, loading, error, appendNewSite, handleDelete, deletingSiteId };
};
