import { ValidAny } from '@beyond/lib/types';

export const noop = (item?: ValidAny): void => {}; // eslint-disable-line

export const sleep = (time: number): Promise<unknown> =>
  new Promise(resolve => setTimeout(resolve, time));
