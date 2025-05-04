'use client';
import { Flex } from '~/theme';

import mainStyles from './main.module.scss';
import ListPost from '~/modules/dashboard/listPost';
import ListContact from '~/modules/dashboard/listContact';
import { useDimension } from '~/hooks';

export default async function HomePage() {
  const { isSM } = useDimension();
  // Open this to test Suspense boundary used in template
  // const res = await new Promise((resolve) => {
  //   setTimeout(resolve, 3000);
  // });

  // const tSample = await getTranslations('sample');

  return (
    <Flex align="stretch" gap={20} className={mainStyles.homeWrapper}>
      <div className={mainStyles.homeContent}>
        <ListPost />
      </div>
      {!isSM && (
        <div className={mainStyles.contact}>
          <ListContact />
        </div>
      )}
    </Flex>
  );
}
