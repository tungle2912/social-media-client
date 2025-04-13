'use client';

import React from 'react';

import BasicBreadcrumb from '~/components/blocks/BasicBreadcrumb';
import ThrowError from '~/components/blocks/Errors/ThrowError';
import ErrorBoundary from '~/components/boundaries/ErrorBoundary';
import { theme, Layout } from '~/theme';

const { Content } = Layout;

interface IProps {
  children: React.ReactNode;
}

export default function BasicMainWrapper({ children }: IProps) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content
      style={{
        paddingTop: '73px',
        flexGrow: '1',
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <BasicBreadcrumb />
      <div
        style={{
          flexGrow: '1',
          padding: 24,
          minHeight: 380,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <ErrorBoundary fallback={<ThrowError />}>{children}</ErrorBoundary>
      </div>
    </Content>
  );
}
