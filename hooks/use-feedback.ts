import { api, ApiResponse } from '@/lib/api';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';

export interface Feedback {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchFeedbacks = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<Feedback[]>>('/api/feedbacks');
      if (response.data.data) {
        setFeedbacks(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
      const message =
        error instanceof AxiosError
          ? ((error.response?.data as { error?: string })?.error ?? 'Failed to fetch feedback')
          : 'Failed to fetch feedbacks';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFeedbacks();
  }, [fetchFeedbacks]);

  const addFeedback = useCallback((newFeedback: Feedback) => {
    setFeedbacks(prev => [newFeedback, ...prev]);
  }, []);

  return {
    feedbacks,
    addFeedback,
    refresh: fetchFeedbacks,
    isLoading,
    error,
  };
};
