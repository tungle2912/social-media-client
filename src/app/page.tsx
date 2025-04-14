import { getTranslations } from 'next-intl/server';
import React from 'react';

import TopSample from '~/components/elms/Sample/TopSample';
import { Flex } from '~/theme';

import mainStyles from './main.module.scss';

export default async function HomePage() {
  // Open this to test Suspense boundary used in template
  // const res = await new Promise((resolve) => {
  //   setTimeout(resolve, 3000);
  // });

 // const tSample = await getTranslations('sample');

  return (
    <Flex vertical align="stretch" gap={20} className={mainStyles.homeWrapper}>
      <div className={mainStyles.textBox}>kkk</div>
      <div className={mainStyles.textBox}>
        {/* <TopSample /> */}
      </div>
    </Flex>
  );
}
