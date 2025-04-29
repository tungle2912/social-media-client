'use client';
import { Flex } from '~/theme';

import mainStyles from './main.module.scss';
import ListPost from '~/modules/dashboard/listPost';

export default async function HomePage() {
  // Open this to test Suspense boundary used in template
  // const res = await new Promise((resolve) => {
  //   setTimeout(resolve, 3000);
  // });

  // const tSample = await getTranslations('sample');

  return (
    <Flex vertical align="stretch" gap={20} className={mainStyles.homeWrapper}>
      <div className={mainStyles.homeContent}>
        <ListPost />
      </div>
      <div className={mainStyles.contact}></div>
    </Flex>
  );
}
