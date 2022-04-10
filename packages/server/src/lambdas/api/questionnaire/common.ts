import { ValidAny } from '@beyond/lib/types';

export const removeAttributes = (item: ValidAny): object => {
  const { PK, SK, ...rest } = item;
  return rest;
};
