/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios from 'axios';
import { getSession } from 'next-auth/react';

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
    if ((session as any)?.accessToken) {
      config.headers!.Authorization = `Bearer ${(session as any)?.accessToken}`;
    } else {
      // Depends
    }
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
  (error: any) => Promise.reject(error)
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
  (response) => response,
  (error: any) => Promise.reject(error)
);

export { protectedAxiosInstance, publicAxiosInstance, cancelTokenSource };
