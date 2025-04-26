import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import React from 'react';
import NextAuthProvider from '~/components/boundaries/NextAuthProvider';
import RootLayoutWrapper from '~/components/layouts/RootLayoutWrapper';
import { ELocale } from '~/definitions';

import QueryProvider from '~/provider/query-provider';
import { ThemeProvider } from '~/theme';
import '~/theme/global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Social media',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = (await getLocale()) as ELocale;
  const messages = await getMessages({ locale: 'en' });
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <NextAuthProvider>
              <ThemeProvider>
                <RootLayoutWrapper locale={locale}>{children}</RootLayoutWrapper>
              </ThemeProvider>
            </NextAuthProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
