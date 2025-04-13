/**
 * Export all storage defined inside storages folder
 */

import ServerCookieStorage from '~/services/storages/cookie.server';
import WebCookieStorage from '~/services/storages/webCookie';
import WebLocalStorage from '~/services/storages/webLocalStorage';
import WebSessionStorage from '~/services/storages/webSessionStorage';

export { ServerCookieStorage, WebLocalStorage, WebSessionStorage, WebCookieStorage };
