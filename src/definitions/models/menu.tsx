import { ComunityIcon, HomeIcon, MessageIcon } from '~/common/icon';

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
    label: 'Settings',
    url: '/settings',
    icon: <ComunityIcon />,
  },
];
