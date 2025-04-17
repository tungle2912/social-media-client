/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { useSession } from 'next-auth/react';
import React, { useMemo } from 'react';

import { ELocale } from '~/definitions';
import { Layout, Skeleton, Spin, ThemeProvider } from '~/theme';

import { usePathname } from 'next/navigation';
import Header from '~/components/header';
import Sidebar from '~/components/sideBar';
import useLoadingStore from '~/stores/loading.store';
import styles from './layouts.module.scss';

interface ILayoutProps {
  locale: ELocale;
  children: React.ReactNode;
}

const { Content } = Layout;

export const AuthContext = React.createContext<any>({});

/**
 * Basic layout sample
 * Refer: https://ant.design/components/layout#components-layout-demo-fixed
 */
export default function RootLayoutWrapper({ locale, children }: ILayoutProps) {
  const { data: sessionData, status } = useSession();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
  const isLoading = useLoadingStore((state) => state.isLoading);
  //  useAutoRefreshToken(sessionData?.expires ? +sessionData.expires : 0);
  const authProvider = useMemo(
    () => ({
      authenticated: status === 'authenticated',
      user: sessionData?.user,
      locale,
    }),
    [status, sessionData, locale]
  );

  return (
    <AntdRegistry>
      <ThemeProvider>
        <AuthContext.Provider value={authProvider}>
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
            children
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
        </AuthContext.Provider>
      </ThemeProvider>
    </AntdRegistry>
  );
}
