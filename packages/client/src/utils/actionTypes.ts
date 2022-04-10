import { Action } from 'redux';

export interface PayloadAction<T, B> extends Action<T> {
  payload: B;
}

export type RequestActionParams<T> = {
  data?: T;
  headers: Record<string, string> | undefined;
  endpoint: string;
};

export type SuccessActionParams<T> = RequestActionParams<T> & {
  data: T;
};

export type FailureActionParams<T> = RequestActionParams<T> & {
  status?: number;
};

export type RequestActionCreator<TAction, TParams = undefined> = (
  params: RequestActionParams<TParams>,
) => TAction;
export type SuccessActionCreator<TAction, TParams = undefined> = (
  params: SuccessActionParams<TParams>,
) => TAction;
export type FailureActionCreator<TAction, TParams = undefined> = (
  params: FailureActionParams<TParams>,
) => TAction;

export type RequestAction<T, K = undefined> = PayloadAction<T, RequestActionParams<K>>;
export type FailureAction<T, K = undefined> = PayloadAction<T, FailureActionParams<K>>;
export type SuccessAction<T, K = undefined> = PayloadAction<T, SuccessActionParams<K>>;
