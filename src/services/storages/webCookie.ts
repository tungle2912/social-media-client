/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie';

export default class WebCookieStorage {
  static getItem(key: string = '') {
    return Cookies.get(key);
  }

  static setItem({
    key,
    value,
    expires,
    sameSite = 'Strict',
    secure = process.env.NODE_ENV === 'production',
  }: {
    key: string;
    value: any;
    expires: number;
    sameSite?: 'Strict' | 'None' | 'Lax';
    secure?: boolean;
  }) {
    Cookies.set(key, JSON.stringify(value), { expires, sameSite, secure });
  }

  static removeItem(key: string = '') {
    Cookies.remove(key);
  }
}
