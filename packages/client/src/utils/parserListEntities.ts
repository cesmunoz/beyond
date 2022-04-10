import { ValidAny } from '@beyond/lib/types';

type FormatKeyFnType<TType> = (item: TType) => string;

const getKey = (data: ValidAny, property: string | Function): string =>
  typeof property === 'string' ? data[property] : property(data);

export const addListToEntities = <TState, TType = object>(
  data: Array<TType>,
  property: string | FormatKeyFnType<TType>,
): TState => {
  return data.reduce((newState: TState, item: TType) => {
    const key = getKey(item, property);
    return {
      ...newState,
      [key]: {
        ...item,
      },
    };
  }, {} as TState);
};

export const mergeEntity = <T>(state: ValidAny, data: ValidAny, property: string | Function): T => {
  const key = getKey(data, property);
  return {
    ...state,
    [key]: {
      ...state[key],
      ...data,
    },
  } as T;
};
