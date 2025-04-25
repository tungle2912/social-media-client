const AUTH_ROUTES = ['/auth/login', '/auth/signin', '/auth/forgot-password'];
const PROTECTED_ROUTES = ['/', '/profile', '/onBoard'];
const PUBLIC_ROUTES = [''];

export const routes = {
  authRoutes: AUTH_ROUTES,
  protectedRoutes: PROTECTED_ROUTES,
  publicRoutes: PUBLIC_ROUTES,
};
