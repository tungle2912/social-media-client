/* eslint-disable @next/next/no-async-client-component */
'use client';
import { Flex } from '~/theme';

import styles from './styles.module.scss';

import { useDimension } from '~/hooks';
import ListConversation from '~/modules/dashboard/listContact';
import ListContact from '~/modules/contact';

export default async function Contact() {
  const { isSM } = useDimension();
  return (
    <Flex align="stretch" gap={isSM ? 0 : 20} className={styles.homeWrapper}>
      <div className={styles.homeContent}>
        <ListContact />
      </div>
      {!isSM && (
        <div className={styles.contact}>
          <ListConversation />
        </div>
      )}
    </Flex>
  );
}
