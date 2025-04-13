import type { Metadata } from 'next';
import React from 'react';

import { Flex } from '~/theme';

export const metadata: Metadata = {
  title: 'Social media | Sample Module',
};

type LayoutProps = {
  children: React.ReactNode;
};

export default async function SampleModuleLayout({ children }: LayoutProps) {
  return (
    <Flex vertical gap={20}>
      <span>Sample module layout wrapper</span>
      {children}
    </Flex>
  );
}
