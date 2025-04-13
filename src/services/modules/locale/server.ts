'use server';

import { cookies } from 'next/headers';

import { ELocale } from '~/definitions';

export const switchLocale = (locale: ELocale) => {
  cookies().set('locale', locale);
};
