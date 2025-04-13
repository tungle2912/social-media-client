'use client';

import clsx from 'clsx';
import React from 'react';

import { Button } from '~/theme';

import styles from './index.module.scss';

interface IElmProps {
  placement: string;
  loading?: boolean;
  onClick?: () => void;
}

export default function LoginButton({ placement, loading = false, onClick }: IElmProps) {
  return (
    <Button
      className={clsx(styles.loginBtn, styles[placement])}
      shape="round"
      type="primary"
      onClick={() => onClick?.()}
      loading={loading}
    >
      Sign in
    </Button>
  );
}
