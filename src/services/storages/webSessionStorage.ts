/* eslint-disable @typescript-eslint/no-explicit-any */
export default class WebSessionStorage {
  static clear() {
    return sessionStorage.clear();
  }

  static getItem(key: string = '') {
    return JSON.parse(sessionStorage.getItem(key) || 'false');
  }

  static getItemOnce(key: string = '') {
    const result = JSON.parse(sessionStorage.getItem(key) || 'false');
    this.removeItem(key);
    return result;
  }

  static setItem(key: string, value: any) {
    return sessionStorage.setItem(key, JSON.stringify(value));
  }

  static removeItem(key: string) {
    return sessionStorage.removeItem(key);
  }
}
