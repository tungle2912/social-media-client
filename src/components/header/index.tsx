'use client';
import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, List, Menu, Popover, Spin, Switch } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LanguageIcon, LogoutIcon, NotificationIcon } from '~/common/icon';
import InputSearch from '~/common/inputSearch';
import { useDimension } from '~/hooks';
import { useLogoutMutation } from '~/hooks/data/auth.data';

import { signOut } from 'next-auth/react';
import { switchLocale } from '~/services/modules';
import { useAuthStore } from '~/stores/auth.store';
import { useSideBarStore } from '~/stores/sidebar.store';
import styles from './styles.module.scss';
import { useTheme } from '~/theme/ThemeProvider';
import { ETheme } from '~/theme/ThemeProvider';
import classNames from 'classnames';
export default function Header() {
  const { collapsed, setCollapsed } = useSideBarStore();
  const { isSM: isMobile } = useDimension();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    document.body.setAttribute('prefers-color-scheme', theme);
  }, [theme]);

  const { user } = useAuthStore();
  const handleLogout = () => {
    setIsLoading(true);
    logoutMutation.mutateAsync(undefined, {
      onSuccess: async () => {
        setIsLoading(false);
        await signOut({ redirect: false });
        router.push('/auth/login');
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  const handleMenuClick = (value: any) => {
    switchLocale(value);
  };

  const menu = () => {
    return (
      <Menu className={styles.menuLanguage}>
        <Menu.Item onClick={() => handleMenuClick('en')} key="en">
          English
        </Menu.Item>
        <Menu.Item onClick={() => handleMenuClick('vn')} key="vn">
          Vietnamese
        </Menu.Item>
      </Menu>
    );
  };

  const renderPopover = () => {
    return (
      <div className={styles.popoverContent}>
        <div className={styles.popoverHeader}>
          <div className={styles.popoverUserInfo}>
            <Avatar
              size={'large'}
              className={styles.avatar}
              src={
                user?.avatar ?? 'https://res.cloudinary.com/dflvvu32c/image/upload/v1739413637/kaz83swuhggnsi0exrk3.jpg'
              }
            />
            <span>{user?.user_name}</span>
          </div>
          <div className={styles.notificationBadge}>
            <a href="#">See all accounts</a>
            <Badge count={31} />
          </div>
        </div>
        <List className={styles.popoverList}>
          <Popover placement="bottomRight" trigger={'click'} content={menu}>
            <List.Item className={styles.popoverListItem}>
              <LanguageIcon />
              <span>Languages</span>
            </List.Item>
          </Popover>
          <List.Item className={styles.popoverListItem}>
            <div>
              <span>Dark Mode</span>
              <Switch checked={theme === ETheme.Dark} onChange={toggleTheme} />{' '}
            </div>
          </List.Item>
          <List.Item onClick={handleLogout} className={styles.popoverListItem}>
            <LogoutIcon />
            <span>Sign out</span>
          </List.Item>
        </List>
      </div>
    );
  };

  return (
    <div className={classNames(styles.header, 'dark:bg-gray-900')} style={{ marginLeft: collapsed ? (isMobile ? '0px' : '100px') : '260px' }}>
      {isLoading && (
        <div className={styles.spinnerOverlay}>
          <Spin size="large" />
        </div>
      )}
      {(!isMobile || collapsed) && (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed && setCollapsed(!collapsed)}
          className={classNames(styles.btnCollapse, 'ant-btn-variant-text dark:text-white dark:bg-gray-900 dark:rounded-none dark:hover:bg-gray-800')}
        />
      )}
      <div className={classNames(styles.headerContainer, 'dark:bg-gray-900')}>
        <InputSearch className={styles.headerSearch} />
        <div className={styles.headerContent}>
          <Badge count={5} className={styles.badge}>
            <NotificationIcon />
          </Badge>
          <Popover placement="bottomRight" trigger={'click'} content={renderPopover}>
            <div className={styles.userProfile}>
              <Avatar
                className={styles.avatar}
                src={
                  user?.avatar ??
                  'https://res.cloudinary.com/dflvvu32c/image/upload/v1739413637/kaz83swuhggnsi0exrk3.jpg'
                }
              ></Avatar>
              {!isMobile && <span>{user?.user_name}</span>}
              <DownOutlined />
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
}
