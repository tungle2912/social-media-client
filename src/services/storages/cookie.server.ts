/* eslint-disable @typescript-eslint/no-explicit-any */

'use server';

import { cookies } from 'next/headers';

/**
 * Class play with cookie on server side
 */
class ServerCookieStorage {
  static getItem(key: string = '') {
    return cookies().get(key);
  }

  static getItemValue(key: string = '') {
    return cookies().get(key)?.value || null;
  }

  static setItem(
    key: string,
    value: any,
    {
      expires,
      httpOnly = true,
      secure = process.env.NODE_ENV === 'production',
    }: {
      expires: number;
      httpOnly?: boolean;
      secure?: boolean;
    }
  ) {
    cookies().set(key, value, { expires, httpOnly, secure });
  }

  static deleteItem(key: string) {
    cookies().delete(key);
  }
}

export default ServerCookieStorage;
