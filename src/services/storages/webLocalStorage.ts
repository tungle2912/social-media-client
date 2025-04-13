/* eslint-disable @typescript-eslint/no-explicit-any */
export default class WebLocalStorage {
  static clear() {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.clear();
  }

  static getItem(key: string = '') {
    if (typeof localStorage === 'undefined') return false;
    return JSON.parse(localStorage.getItem(key) || 'false');
  }

  static setItem(key: string, value: any) {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.setItem(key, JSON.stringify(value));
  }

  static removeItem(key: string) {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.removeItem(key);
  }
}
