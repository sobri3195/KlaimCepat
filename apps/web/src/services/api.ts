import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { mockApiService } from './mockApi';

const isDemoMode = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = useAuthStore.getState();
        
        if (isDemoMode) {
          const response = await mockApiService.refreshAuth(refreshToken || '');
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

          const { user } = useAuthStore.getState();
          if (user) {
            useAuthStore.getState().setAuth(user, newAccessToken, newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
        
        const baseURL = import.meta.env.VITE_API_URL || '/api/v1';
        const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        const { user } = useAuthStore.getState();
        if (user) {
          useAuthStore.getState().setAuth(user, newAccessToken, newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const mockApiWrapper = {
  get: async (url: string, config?: any) => {
    if (!isDemoMode) return api.get(url, config);

    const params = config?.params || {};
    
    if (url === '/analytics/dashboard') {
      return mockApiService.getDashboardStats();
    }
    if (url.startsWith('/analytics/top-spenders')) {
      return mockApiService.getTopSpenders();
    }
    if (url === '/analytics/category-breakdown') {
      return mockApiService.getCategoryBreakdown();
    }
    if (url === '/claims/my') {
      return mockApiService.getMyClaims(params);
    }
    if (url.startsWith('/claims/') && url !== '/claims/my') {
      const id = url.split('/')[2];
      return mockApiService.getClaimById(id);
    }
    if (url === '/approvals' || url === '/approvals/pending') {
      return mockApiService.getPendingApprovals();
    }
    if (url === '/analytics') {
      return mockApiService.getAnalytics();
    }
    
    return api.get(url, config);
  },

  post: async (url: string, data?: any, config?: any) => {
    if (!isDemoMode) return api.post(url, data, config);

    if (url === '/auth/login') {
      return mockApiService.login(data.email, data.password);
    }
    if (url === '/auth/refresh') {
      return mockApiService.refreshAuth(data.refreshToken);
    }
    if (url === '/claims') {
      return mockApiService.createClaim(data);
    }
    if (url.includes('/submit')) {
      const id = url.split('/')[2];
      return mockApiService.submitClaim(id);
    }
    if (url.includes('/approve')) {
      const id = url.split('/')[2];
      return mockApiService.approveClaim(id, data);
    }
    if (url.includes('/reject')) {
      const id = url.split('/')[2];
      return mockApiService.rejectClaim(id, data);
    }
    
    return api.post(url, data, config);
  },

  put: async (url: string, data?: any, config?: any) => {
    if (!isDemoMode) return api.put(url, data, config);

    if (url.startsWith('/claims/')) {
      const id = url.split('/')[2];
      return mockApiService.updateClaim(id, data);
    }
    
    return api.put(url, data, config);
  },

  delete: async (url: string, config?: any) => {
    if (!isDemoMode) return api.delete(url, config);

    if (url.startsWith('/claims/')) {
      const id = url.split('/')[2];
      return mockApiService.deleteClaim(id);
    }
    
    return api.delete(url, config);
  },

  patch: async (url: string, data?: any, config?: any) => {
    if (!isDemoMode) return api.patch(url, data, config);
    
    return api.patch(url, data, config);
  },
};

export default mockApiWrapper;
