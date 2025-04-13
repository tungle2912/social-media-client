/* eslint-disable import/no-cycle */

'use client';

import { AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext } from 'react';

import LoginButton from '~/components/elms/Buttons/LoginButton';
import LogoutButton from '~/components/elms/Buttons/LogoutButton';
import Logo from '~/components/elms/Logo';
import LocaleSwitcher from '~/components/elms/Radios/LocaleSwitcher';
import { AuthContext } from '~/components/layouts/RootLayoutWrapper';
import { Dropdown, Flex, Layout } from '~/theme';

import styles from './index.module.scss';

const { Header } = Layout;

const menuItems = [
  {
    label: 'Dashboard',
    key: '/dashboard',
    icon: <AppstoreOutlined />,
  },
  {
    label: 'Sample module',
    key: '/sampleModule',
    icon: <SettingOutlined />,
    children: [
      { label: <Link href="/sampleModule/samplePage1">Sample page 1</Link>, key: '/sampleModule/samplePage1' },
    ],
  },
];

export default function BasicHeader() {
  const router = useRouter();
  const { authenticated, user } = useContext(AuthContext);
  const pathname = usePathname();

  return (
    <Header className={styles.basicHeader}>
      <Link href="/">
        <Flex align="center" gap={7}>
          <Logo size={40} />
          <span className={styles.logoText}>Amela</span>
        </Flex>
      </Link>
      <Flex className={styles.menu}>
        {menuItems.map(
          (item: {
            label: string;
            key: string;
            icon: React.ReactNode;
            children?: { label: string | React.ReactNode; key: string }[];
          }) => {
            if (item.children) {
              return (
                <Dropdown key={item.key} menu={{ items: item.children }}>
                  <Link
                    href={item.key}
                    className={clsx(
                      styles.menuItem,
                      (pathname === item.key ||
                        item.children
                          .map((itemChild: { label: string | React.ReactNode; key: string }) => itemChild.key)
                          ?.includes(pathname)) &&
                        styles.active
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </Dropdown>
              );
            }
            return (
              <Link
                key={item.key}
                href={item.key}
                className={clsx(styles.menuItem, pathname === item.key && styles.active)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          }
        )}
      </Flex>
      <Flex className={styles.rightMenu} gap={10} align="center">
        {authenticated ? (
          <Flex align="center" gap={10}>
            <span className={styles.userText}>{user?.email || ''}</span>
            <LogoutButton placement="header" />
          </Flex>
        ) : (
          <LoginButton placement="header" onClick={() => router.push('/auth/login')} />
        )}
        <LocaleSwitcher />
      </Flex>
    </Header>
  );
}
