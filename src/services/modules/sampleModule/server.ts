'use server';

/**
 * Actions executed on server side all need to be masked as a async function
 * Can access to server's cookies
 * Server actions can not use browser's functions like window, document, localstorage, session storage, browser cookie, ...
 */

export async function sampleServerAction() {
  // Sample server action
}
