import nookies from 'nookies';
import { NextPageContext } from 'next';

// eslint-disable-next-line
// @ts-ignore
let contextObject: NextPageContext = {};

export default class CookieStorage {
  static syncPromise = null;

  static setContext(ctx: NextPageContext): void {
    contextObject = ctx;
  }

  static setItem(key: string, value: string): string {
    nookies.set(contextObject, key, value, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
    return key;
  }

  static getItem(key: string): string {
    const parsedCookies = nookies.get(contextObject);
    return parsedCookies[key];
  }

  static removeItem(key: string): void {
    nookies.destroy(contextObject, key);
  }

  static clear(): void {
    Object.keys(contextObject).forEach(key => {
      nookies.destroy(contextObject, key);
    });
  }
}
