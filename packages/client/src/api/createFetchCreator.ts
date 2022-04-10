import 'isomorphic-fetch';

import { Dispatch, AnyAction } from 'redux';
import { GET, POST, PUT } from 'constants/httpVerbs';
import { getAuthToken } from 'utils/auth';
import { ValidAny } from '@beyond/lib/types';

type FetchActions = {
  request: (params: ValidAny) => AnyAction;
  success: (params: ValidAny) => AnyAction;
  failure: (params: ValidAny) => AnyAction;
};

export type FetchOptions = {
  method: string;
  body?: ValidAny;
  headers?: Record<string, string>;
  stringify?: boolean;
  mode?: 'cors';
};

const DEFAULT_OPTIONS: FetchOptions = {
  method: GET,
  body: null,
  headers: {},
  stringify: false,
  mode: 'cors',
};

const ERROR_MESSAGE = '`fetchCreator` has been called with incorrect configuration. ';

function validateActions(actions: FetchActions): void {
  const { request, success, failure } = actions;

  const missing = [];
  if (!request) {
    missing.push('request');
  }

  if (!success) {
    missing.push('success');
  }

  if (!failure) {
    missing.push('failure');
  }

  if (missing.length) {
    throw new Error(
      `${ERROR_MESSAGE}Provide the missing action${missing.length ? 's' : ''}: '${missing.join(
        "', '",
      )}'`,
    );
  }
}

function validateRequest(actions: FetchActions, options: FetchOptions): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  validateActions(actions);

  if (options.method === POST && !options.body) {
    throw new Error(
      `${ERROR_MESSAGE}\`body\` is required when doing a \`${options.method}\` request.`,
    );
  }
}

export function createFetchCreator(): (
  endpoint: string,
  actions: FetchActions,
  options?: FetchOptions,
) => (dispatch: Dispatch) => Promise<AnyAction> {
  async function getFetchOptions(options: FetchOptions): Promise<FetchOptions> {
    const newOptions = { ...options };

    if (options.body && options.stringify) {
      newOptions.body = JSON.stringify(options.body);
    }

    if (!newOptions.headers) {
      newOptions.headers = {};
      newOptions.headers['Content-Type'] = 'application/json';
    }

    newOptions.headers.Authorization = await getAuthToken();

    return newOptions;
  }

  return function fetchCreator(endpoint: string, actions: FetchActions, options?: FetchOptions) {
    return async (dispatch: Dispatch): Promise<AnyAction> => {
      const finalOptions = await getFetchOptions(options || DEFAULT_OPTIONS);

      validateRequest(actions, finalOptions);

      const { request, success, failure } = actions;

      dispatch(request({ endpoint, headers: finalOptions.headers }));

      async function handleResponse(response: Response): Promise<AnyAction> {
        const { status, statusText, ok, headers: respHeaders } = response;
        const castedHeaders: Record<string, string> = {};

        Array.from(respHeaders.entries()).reduce((list, [key, value]) => {
          castedHeaders[key] = value;
          return list;
        }, []);

        if (status === 401 || status === 403) {
          throw new Error('Unauth or forbidden');
        }

        if (!ok) {
          const error = new Error(statusText);
          error.message = await response.text();
          throw error;
        }

        const isGet = finalOptions.method === GET;
        const isPut = finalOptions.method === PUT;
        const isPost = finalOptions.method === POST;

        const transform = isGet || isPost || isPut;

        // If the response doesn't need to be transformed (which means the success has no data),
        // just call the success immediately without getting the data.
        if (!transform) {
          return dispatch(
            success({
              endpoint,
              headers: castedHeaders,
              data: null,
            }),
          );
        }

        return response.json().then(data =>
          dispatch(
            success({
              data,
              endpoint,
              headers: castedHeaders,
            }),
          ),
        );
      }

      return fetch(endpoint, finalOptions)
        .then(handleResponse)
        .catch((error: { response: Response }) => {
          if (!failure) {
            throw error;
          }

          // Attempt to handle errors by the provided error action, adding a default message into
          // a toast, or throwing an error (should only happen in dev);
          const failureData = { endpoint, headers: options?.headers };

          return dispatch(failure(failureData));
        });
    };
  };
}

export default createFetchCreator();
