import { ComunityIcon, HomeIcon } from "~/common/icon";

export interface IRoute {
  key: string;
  label: string;
  url: string;
  icon: React.ReactNode;
  children?: IRoute[];
}

export const menuRoutes: IRoute[] = [
  {
    key: "1",
    label: "Home",
    url: "/home",
    icon: <HomeIcon />,
  },
  {
    key: "2",
    label: "Message",
    url: "/message",
    icon: <ComunityIcon />,
  }
];
