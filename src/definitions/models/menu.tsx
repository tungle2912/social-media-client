import { ComunityIcon, HomeIcon, MessageIcon, ProfileIcon, SettingIcon } from '~/common/icon';

export interface IRoute {
  key: string;
  label: string;
  url: string;
  icon: React.ReactNode;
  children?: IRoute[];
}

export const menuRoutes: IRoute[] = [
  {
    key: '1',
    label: 'Home',
    url: '/',
    icon: <HomeIcon />,
  },
  {
    key: '2',
    label: 'Message',
    url: '/message',
    icon: <MessageIcon />,
  },
  {
    key: '3',
    label: 'Contact',
    url: '/contact',
    icon: <ComunityIcon />,
  },
  {
    key: '4',
    label: 'Profile',
    url: '/profile',
    icon: <ProfileIcon />,
  },
  {
    key: '5',
    label: 'Settings',
    url: '/settings',
    icon: <SettingIcon />,
  },
];
