/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

import { ELocale, UserType } from '~/definitions';
import { Layout, Skeleton, Spin, ThemeProvider } from '~/theme';

import { usePathname, useRouter } from 'next/navigation';
import Header from '~/components/header';
import { AuthLayout } from '~/components/layouts/authLayout';
import Sidebar from '~/components/sideBar';
import { useAuthStore } from '~/stores/auth.store';
import useLoadingStore from '~/stores/loading.store';
import styles from './layouts.module.scss';

interface ILayoutProps {
  locale: ELocale;
  children: React.ReactNode;
}

const { Content } = Layout;

/**
 * Basic layout sample
 * Refer: https://ant.design/components/layout#components-layout-demo-fixed
 */
export default function RootLayoutWrapper({ locale, children }: ILayoutProps) {
  const { data: sessionData, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/onBoard');
  // const { data } = useGetProfileQuery(!pathname.startsWith('/auth'));
  const isLoading = useLoadingStore((state) => state.isLoading);

  //  useAutoRefreshToken(sessionData?.expires ? +sessionData.expires : 0);
  const { setAuth } = useAuthStore();
  useEffect(() => {
    if (sessionData?.user) {
      setAuth({
        authenticated: status === 'authenticated',
        user: sessionData?.user as UserType,
        locale,
      });
      if (!(sessionData?.user as UserType)?.isOnBoard) {
        router.push('/onBoard');
      } else if (pathname.startsWith('/onBoard')) {
        router.push('/profile');
      }
    }
  }, [status, sessionData, locale, setAuth]);

  return (
    <AntdRegistry>
      <ThemeProvider>
        {status === 'loading' ? (
          <Content
            style={{
              padding: '48px',
              flexGrow: '1',
              display: 'flex',
              alignItems: 'stretch',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <Skeleton loading active />
          </Content>
        ) : isAuthPage ? (
          <AuthLayout>{children}</AuthLayout>
        ) : (
          <Layout className={styles.layoutContainer}>
            {isLoading && (
              <div className={styles.spin}>
                <Spin size="large" tip="Loading..." />
              </div>
            )}
            <Sidebar />
            <Layout>
              <Header />
              <Content className={styles.contentContainer}>{children}</Content>
            </Layout>
          </Layout>
        )}
      </ThemeProvider>
    </AntdRegistry>
  );
}
