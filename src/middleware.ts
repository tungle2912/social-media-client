/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import withAuth from 'next-auth/middleware';

interface NextAuthRequest extends NextRequest {
  nextauth?: any;
}

const contentSecurityPolicyHeader = (request: NextRequest) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = ``; // Có thể thêm CSP nếu cần
  const result = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', result);

  return { requestHeaders, contentSecurityPolicyValue: result };
};

export default withAuth(
  async (request: NextAuthRequest) => {
    const { requestHeaders, contentSecurityPolicyValue } = contentSecurityPolicyHeader(request);

    const { pathname } = request.nextUrl;
    const isAuthRoutes = routes.authRoutes.includes(pathname);
    const isPublicRoutes = routes.publicRoutes.includes(pathname);
    const isProtectedRoutes = routes.protectedRoutes.includes(pathname);
    const isAuthenticated = !!request?.nextauth?.token?.isAuthenticated;

    let response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set('Content-Security-Policy', contentSecurityPolicyValue);

    if (isPublicRoutes) {
      return response;
    }

    if (isAuthRoutes && isAuthenticated) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    if (isProtectedRoutes && !isAuthenticated) {
      response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('accessToken');
      return response;
    }

    return response;
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

// Định nghĩa routes (đặt trong file riêng, ví dụ: ~/definitions/routes.ts)
export const routes = {
  publicRoutes: ['/', '/about'],
  authRoutes: ['/auth/login', '/auth/register'],
  protectedRoutes: ['/profile', '/dashboard'],
};
