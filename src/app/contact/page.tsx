/* eslint-disable @next/next/no-async-client-component */
'use client';

import { useDimension } from '~/hooks';
import ListContact from '~/modules/contact';
import ListConversation from '~/modules/dashboard/listContact';

export default async function Contact() {
  const { isSM } = useDimension();
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-9 py-4 lg:flex-row">
      <ListContact />
      <div className="sticky top-[16px] hidden h-fit w-[450px] lg:block">
        <ListConversation />
      </div>
    </div>
  );
}
