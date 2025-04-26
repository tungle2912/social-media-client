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
      <div className={mainStyles.textBox}>{/* <TopSample /> */}</div>
      <div className="text-3xl font-bold underline">Hello TailwindCSS + PostCSS + Next.js 14</div>
    </Flex>
  );
}
