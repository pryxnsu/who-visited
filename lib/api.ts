import axios from 'axios';
import { toast } from 'sonner';

export interface ApiResponse<T> {
  status: number;
  message: string;
  success: boolean;
  data: T;
}

export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || error.message;
      switch (status) {
        case 401: {
          window.location.href = '/login';
          break;
        }
        case 403: {
          if (message.includes('Forbidden') || message.includes('permissions')) {
            toast.error(message || 'You do not have permission to access this resource.');
          }
          break;
        }
        case 500:
          toast.error('Server error. Please try again later.');
          break;
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);
