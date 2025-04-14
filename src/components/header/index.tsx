'use client'
import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, List, Menu, Popover, Spin, Switch } from 'antd';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { LanguageIcon, LogoutIcon, NotificationIcon } from '~/common/icon';
import InputSearch from '~/common/inputSearch';
import { AuthContext } from '~/components/layouts/RootLayoutWrapper';
import { ELocale } from '~/definitions';
import { useDimension } from '~/hooks';
import { useLogoutMutation } from '~/hooks/data/auth.data';

import { switchLocale } from '~/services/modules';
import { useSideBarStore } from '~/stores/sidebar.store';
import styles from './styles.module.scss';
import { signOut } from 'next-auth/react';
import { ETheme, useTheme } from '~/theme/ThemeProvider';
interface HeaderProps {
  className?: string;
}
const locales = [ELocale.EN, ELocale.VN];
export default function Header({ className }: HeaderProps) {
  const { collapsed, setCollapsed } = useSideBarStore();
  const { isSM: isMobile } = useDimension();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    document.body.setAttribute('prefers-color-scheme', theme);
  }, [theme]);
  const { locale } = useContext(AuthContext);
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
 
  const handleMenuClick = (e: any) => {
    switchLocale(e?.target?.value);
  };


  const menu = () => {
    return (
      <Menu className={styles.menuLanguage} onClick={handleMenuClick}>
        <Menu.Item key={locale.en}>English</Menu.Item>
        <Menu.Item key={locale.vi}>Vietnamese</Menu.Item>
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
              src="https://res.cloudinary.com/dflvvu32c/image/upload/v1724208002/v9abgrbgsnnfex04kfbe.jpg"
            />
            <span>Tung le</span>
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
              <Switch
                checked={theme === ETheme.Dark}
                onChange={toggleTheme}
              />            </div>
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
    <div className={styles.header} style={{ marginLeft: collapsed ? (isMobile ? '0px' : '100px') : '260px' }}>
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
          className={styles.btnCollapse}
        />
      )}
      <div className={styles.headerContainer}>
        <InputSearch className={styles.headerSearch} />
        <div className={styles.headerContent}>
          <Badge count={5} className={styles.badge}>
            <NotificationIcon />
          </Badge>
          <Popover placement="bottomRight" trigger={'click'} content={renderPopover}>
            <div className={styles.userProfile}>
              <Avatar
                className={styles.avatar}
                src="https://res.cloudinary.com/dflvvu32c/image/upload/v1739413637/kaz83swuhggnsi0exrk3.jpg"
              ></Avatar>
              {!isMobile && <span>Hi Tungle</span>}
              <DownOutlined />
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
}
