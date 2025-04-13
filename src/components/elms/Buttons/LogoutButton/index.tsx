'use client';

import clsx from 'clsx';
import { signOut } from 'next-auth/react';
import React, { useState } from 'react';

import { Button } from '~/theme';

import styles from './index.module.scss';

interface IElmProps {
  placement: string;
}

export default function LogoutButton({ placement }: IElmProps) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({
      redirect: true,
      callbackUrl: '/login',
    });
    setLoading(false);
  };

  return (
    <Button
      className={clsx(styles.logoutBtn, styles[placement])}
      danger
      shape="round"
      type="primary"
      onClick={() => handleSignOut()}
      loading={loading}
    >
      Sign out
    </Button>
  );
}
