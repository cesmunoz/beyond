import {
  RequestActionParams,
  RequestAction,
  FailureActionParams,
  FailureAction,
  SuccessActionParams,
  SuccessAction,
} from '../utils/actionTypes';

type ResponsePayload<T> = Omit<T, 'data'>;

export function requestAction<TAction, TData = undefined>(type: TAction, data?: TData) {
  return function action(
    params: ResponsePayload<RequestActionParams<TAction>>,
  ): RequestAction<typeof type, TData> {
    const { headers, endpoint } = params;
    return {
      type,
      payload: { endpoint, headers, data },
    };
  };
}

export function failureAction<TAction, TData = undefined>(type: TAction, data?: TData) {
  return function action(
    params: ResponsePayload<FailureActionParams<TAction>>,
  ): FailureAction<typeof type, TData> {
    const { headers, endpoint, status } = params;
    return {
      type,
      payload: { endpoint, headers, status, data },
    };
  };
}

export function successAction<TAction, TData = undefined>(type: TAction) {
  return function action(params: SuccessActionParams<TData>): SuccessAction<typeof type, TData> {
    const { headers, endpoint, data } = params;
    return {
      type,
      payload: { endpoint, headers, data },
    };
  };
}
