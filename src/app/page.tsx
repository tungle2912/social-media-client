/* eslint-disable @next/next/no-async-client-component */
'use client';

import { useDimension } from '~/hooks';
import ListConversation from '~/modules/dashboard/listContact';
import ListPost from '~/modules/dashboard/listPost';

export default async function HomePage() {
  const { isSM } = useDimension();
  // Open this to test Suspense boundary used in template
  // const res = await new Promise((resolve) => {
  //   setTimeout(resolve, 3000);
  // });

  // const tSample = await getTranslations('sample');

  return (
    // <Flex align="stretch" gap={isSM ? 0 : 20} className={mainStyles.homeWrapper}>
    //   <div className={mainStyles.homeContent}>
    //     <ListPost />
    //   </div>
    //   {!isSM && (
    //     <div className={mainStyles.contact}>
    //       <ListContact />
    //     </div>
    //   )}
    // </Flex>
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-9 py-4 lg:flex-row">
      <ListPost />
      <div className="sticky top-[16px] hidden h-fit w-[450px] lg:block">
        <ListConversation />
      </div>
    </div>
  );
}
