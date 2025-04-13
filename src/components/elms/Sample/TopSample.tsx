import { useTranslations } from 'next-intl';
import React from 'react';

export default function TopSample() {
  const tSample = useTranslations('sample');

  return <h1>{tSample('sampleTitle')}</h1>;
}
