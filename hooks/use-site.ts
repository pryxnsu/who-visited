import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { api, ApiResponse } from '@/lib/api';
import { Site } from '@/types/site';

export const useSites = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);

  const fetchSites = async () => {
    try {
      const { data } = await api.get<ApiResponse<Site[]>>('/api/sites');
      console.log('data in sites', data);
      if (data.data) {
        setSites(data.data);
      }
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
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const appendNewSite = (site: Site) => {
    setSites(prev => [site, ...prev]);
  };

  const handleDelete = async (id: string) => {
    const siteToDelete = sites.find(s => s.id === id);
    if (!siteToDelete) return;

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
      setSites(prev => (prev.some(s => s.id === id) ? prev : [...prev, siteToDelete]));
    } finally {
      setDeletingSiteId(current => (current === id ? null : current));
    }
  };

  return { fetchSites, sites, loading, error, appendNewSite, handleDelete, deletingSiteId };
};
