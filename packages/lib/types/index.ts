import { COACH, COACHEE, ADMIN, ANON } from '../constants';

export type UserType = typeof COACH | typeof COACHEE | typeof ADMIN | typeof ANON;

// eslint-disable-next-line
export type ValidAny = any;

export type Nullable<T> = T | null;

export type Undefined<T> = T | undefined;
