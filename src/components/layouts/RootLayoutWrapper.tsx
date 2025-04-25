/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

import { ELocale, UserType } from '~/definitions';
import { Layout, Skeleton, Spin, ThemeProvider } from '~/theme';

import { usePathname } from 'next/navigation';
import Header from '~/components/header';
import { AuthLayout } from '~/components/layouts/authLayout';
import Sidebar from '~/components/sideBar';
import { useAuthStore } from '~/stores/auth.store';
import useLoadingStore from '~/stores/loading.store';
import styles from './layouts.module.scss';
import { useGetProfileQuery } from '~/hooks/data/user.data';

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
  const { data } = useGetProfileQuery();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
  const isLoading = useLoadingStore((state) => state.isLoading);
  //  useAutoRefreshToken(sessionData?.expires ? +sessionData.expires : 0);
  const { setAuth } = useAuthStore();
  useEffect(() => {
    setAuth({
      authenticated: status === 'authenticated',
      user: data?.result as UserType,
      locale,
    });
    console.log('data', data);
  }, [status, sessionData, locale, setAuth, data]);

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
