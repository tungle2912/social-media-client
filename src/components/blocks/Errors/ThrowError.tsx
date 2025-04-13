'use client';

import React from 'react';

import { Button, Flex } from '~/theme';

import styles from './error.module.scss';

export default function ThrowError() {
  return (
    <Flex vertical gap={20} className={styles.errorBox}>
      <Flex>Some thing went wrong!</Flex>
      <Button type="primary" href="/" size="large">
        Go home
      </Button>
    </Flex>
  );
}
