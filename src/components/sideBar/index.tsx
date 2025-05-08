'use client';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, MenuProps } from 'antd';
import Image from 'next/image';
import { menuRoutes } from '~/definitions/models/menu';
import { useDimension } from '~/hooks';
import { useSideBarStore } from '~/stores/sidebar.store';
import image from '../../../public/static/image';
import styles from './styles.module.scss';
import { useTheme } from '~/theme/ThemeProvider';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'usehooks-ts';
import { useEffect } from 'react';

const { Sider } = Layout;

export default function Sidebar() {
  const { isSM, windowWidth } = useDimension();
  const { collapsed, setCollapsed } = useSideBarStore();
  const { theme } = useTheme();
  const route = useRouter();
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const selectedRoute = menuRoutes.find((route) => route.key === e.key);
    if (selectedRoute) {
      route.push(selectedRoute.url);
    }
  };
  const isTablet = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    if (isTablet) {
      setCollapsed(true);
    }
  }, [isTablet]);
  return (
    <Sider
      trigger={null}
      className={classNames(styles.sideBar, 'dark:bg-gray-900')}
      collapsible={windowWidth >= 1400}
      theme={theme}
      collapsed={windowWidth >= 1400 ? collapsed : true}
    >
      <div className={styles.logo} onClick={() => route.push('/')}>
        {(!isSM || (isSM && !collapsed)) && (
          <Image
            src={image.logo}
            width={collapsed ? 100 : 150}
            height={collapsed ? 50 : 80}
            style={{ marginBottom: collapsed ? '30px' : '' }}
            alt="logo"
          />
        )}
        {windowWidth >= 1400 && !collapsed && (
          <Button
            type="text"
            icon={<MenuUnfoldOutlined />}
            onClick={() => setCollapsed && setCollapsed(!collapsed)}
            className={styles.btnCollapse}
          />
        )}
      </div>

      <Menu mode="inline" defaultSelectedKeys={['1']} items={menuRoutes} onClick={handleMenuClick} />
    </Sider>
  );
}
