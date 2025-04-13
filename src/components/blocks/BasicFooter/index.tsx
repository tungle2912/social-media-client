import React from 'react';

import { Layout } from '~/theme';

import styles from './index.module.scss';

const { Footer } = Layout;

export default function BasicFooter() {
  return <Footer className={styles.basicFooter}>Amela ©{new Date().getFullYear()}</Footer>;
}
