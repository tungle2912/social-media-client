/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { publicPost } from '~/api/request/base-axios-public-request';

const cancelTokenSource = Axios.CancelToken.source();

/**
 * Get accessToken from session
 * Be sure token already been set on session
 * @returns String accessToken
 */
export async function getAccessToken() {
  const session = await getSession();
  return (session as any)?.accessToken || '';
}
async function refreshTokenIfNeeded() {
  const session = await getSession();
  if (session && (session as any).refreshToken) {
    try {
      const response = await publicPost('/api/auth/refresh-token', { refresh_token: (session as any).refreshToken });
      return {
        accessToken: response.data.result.access_token,
        accessTokenExpires: response.data.result.exp,
        refreshToken: response.data.result.refresh_token,
      };
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }
  return null;
}
/**
 * Protected axios instance
 */
const protectedAxiosInstance = Axios.create({
  timeout: 60 * 1000,
  baseURL: 'http://localhost:5000',
});

/**
 * TODO: Checking authorize
 */
protectedAxiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (Date.now() > (session as any)?.accessTokenExpires - 30000) {
      // 30s trước khi hết hạn
      await getSession({ event: 'storage' }); // Force update session
    }
    config.headers!.Authorization = `Bearer ${(session as any)?.accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * TODO: Handle response
 * TODO: Catch errors
 */
protectedAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshedTokens = await refreshTokenIfNeeded();
      console.log('Refreshed tokens:', refreshedTokens);
      if (refreshedTokens) {
        originalRequest.headers.Authorization = `Bearer ${refreshedTokens.accessToken}`;
        return protectedAxiosInstance(originalRequest);
      } else {
        console.log('Failed to refresh token, signing out:', error);
        await signOut({ redirect: false });
        const route = useRouter();
        await route.push('/auth/login');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Public axios instance
 */
const publicAxiosInstance = Axios.create({
  timeout: 60 * 1000,
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

/**
 * TODO: Checking authorize
 */
publicAxiosInstance.interceptors.request.use(
  async (config) => config,
  (error) => Promise.reject(error)
);

/**
 * TODO: Handle response
 * TODO: Catch errors
 */
publicAxiosInstance.interceptors.response.use(
  (response) => response, // Trả về response.data cho phản hồi thành công
  (error: any) => {
    return Promise.reject(error); // Từ chối promise nếu không có phản hồi
  }
);

export { protectedAxiosInstance, publicAxiosInstance, cancelTokenSource };
