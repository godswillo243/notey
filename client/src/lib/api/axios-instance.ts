import { getToken, removeToken, setToken } from '#/utils/token';
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const notAllowUrls = [
      '/auth/refresh',
      '/auth/login',
      '/auth/register',
      '/auth/reset-password',
    ];
    console.log(originalRequest);
    if (notAllowUrls.includes(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axiosInstance
          .post('/auth/refresh')
          .then((res) => {
            const accessToken = res.data.accessToken;

            setToken(accessToken);

            return accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const accessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(originalRequest);
    } catch (err) {
      removeToken();
      console.log(error);
      throw err;
    }
  },
);
