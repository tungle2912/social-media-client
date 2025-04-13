"use client";
import React from "react";
import { Button, Layout, Menu } from "antd";
import Image from "next/image";
import { menuRoutes } from "~/definitions/models/menu";
import styles from "./styles.module.scss";
import image from "../../../public/static/image";
import { useSideBarStore } from "~/stores/sidebar.store";;
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useDimension } from "~/hooks";

const { Sider } = Layout;

export default function Sidebar() {
  const { isSM } = useDimension();
  const { collapsed, setCollapsed } = useSideBarStore();
  return (
    <Sider
      trigger={null}
      className={styles.sideBar}
      collapsible
      theme="light"
      collapsed={collapsed}
    >
      <div className={styles.logo}>
        {(!isSM || (isSM && !collapsed)) && (
          <Image
            src={image.logo}
            width={collapsed ? 100 : 150}
            height={collapsed ? 50 : 80}
            style={{ marginBottom: collapsed ? "30px" : "" }}
            alt="logo"
          />
        )}
        {isSM && !collapsed && (
          <Button
            type="text"
            icon={<MenuUnfoldOutlined />}
            onClick={() => setCollapsed && setCollapsed(!collapsed)}
            className={styles.btnCollapse}
          />
        )}
      </div>

      <Menu mode="inline" defaultSelectedKeys={["1"]} items={menuRoutes} />
    </Sider>
  );
}
