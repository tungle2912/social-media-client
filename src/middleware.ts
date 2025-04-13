/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import withAuth from 'next-auth/middleware';

import { routes } from '~/definitions';
import { getSession } from 'next-auth/react';

interface NextAuthRequest extends NextRequest {
  nextauth?: any;
}

/**
 * Adding nonces for content security policy
 * Refer: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy#adding-a-nonce-with-middleware
 * @param request
 * @returns { requestHeaders, contentSecurityPolicyValue }
 */
const contentSecurityPolicyHeader = (request: NextRequest) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = ``;
  // TODO
  // const cspHeader = `
  //   default-src 'self' unsafe-hashes;
  //   script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
  //   style-src 'self' 'nonce-${nonce} unsafe-hashes';
  //   img-src 'self' blob: data:;
  //   font-src 'self';
  //   object-src 'none';
  //   base-uri 'self';
  //   form-action 'self';
  //   frame-ancestors 'none';
  //   upgrade-insecure-requests;
  // `;

  // Replace newline characters and spaces
  const result = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  requestHeaders.set('Content-Security-Policy', result);

  return { requestHeaders, contentSecurityPolicyValue: result };
};

/**
 * Middleware validate requests with nextauth
 * @param request
 * @returns response
 */
export default withAuth(
  async (request: NextAuthRequest) => {
    const { requestHeaders, contentSecurityPolicyValue } = contentSecurityPolicyHeader(request);

    const { pathname } = request.nextUrl;
    const isAuthRoutes = routes.authRoutes.includes(pathname);
    const isPublicRoutes = routes.publicRoutes.includes(pathname);
    const isProtectedRoutes = routes.protectedRoutes.includes(pathname);
    const isAuthenticated = !!request?.nextauth?.token?.isAuthenticated;
    let response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.headers.set('Content-Security-Policy', contentSecurityPolicyValue);

    if (isPublicRoutes) {
      return response;
    }

    if (isAuthRoutes && isAuthenticated) {
      response = NextResponse.redirect(new URL('/profile', request.url));
      return response;
    }

    if (isProtectedRoutes && !isAuthenticated) {
      response = NextResponse.redirect(new URL('/auth/login', request.url));

      // Clear tokens on cookies
      response.cookies.delete('accessToken');
      return response;
    }

    return response;
  },
  {
    callbacks: {
      authorized: () =>
        // TODO: Detect something - Currently set it true temporarily
        // The middleware function will only be invoked if the authorized callback returns true
        true,
    },
  }
);

/**
 * Config matching routes which need to verify via middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
