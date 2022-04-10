import { ValidAny } from '@beyond/lib/types';
import { ChangePasswordRequest } from '@beyond/lib/types/auth';

import {
  changePasswordSuccess,
  changePasswordFailure,
  changePasswordRequest,
  getUserInfoRequest,
  getUserInfoSuccess,
  getUserInfoFailure,
  updateUserInfoSuccess,
  updateUserInfoRequest,
  updateUserInfoFailure,
} from 'appState/auth';

import { POST } from 'constants/httpVerbs';
import { getAuthToken } from 'utils/auth';
import fetchCreator from './createFetchCreator';

export const ENDPOINT = `${process.env.API_ENDPOINT}/auth`;

export function changePassword(payload: ChangePasswordRequest): Function {
  return fetchCreator(
    `${ENDPOINT}/changePassword`,
    {
      request: changePasswordRequest(),
      success: changePasswordSuccess(),
      failure: changePasswordFailure(),
    },
    {
      method: POST,
      body: payload,
      stringify: true,
    },
  );
}

export function getUserInfo(): Function {
  return fetchCreator(ENDPOINT, {
    request: getUserInfoRequest(),
    success: getUserInfoSuccess(),
    failure: getUserInfoFailure(),
  });
}

export function updateProfile(
  fileUploadUrl: string,
  fullName: string,
  company: string,
  file: ValidAny,
): ValidAny {
  return (dispatch: ValidAny): ValidAny => {
    getAuthToken().then(token => {
      const headers = {
        'Content-Type': 'image/jpeg',
      };

      const params = {
        headers,
        endpoint: fileUploadUrl,
        data: undefined,
      };

      const updateUserInfo = (hasProfilePicture: boolean): void => {
        fetch(ENDPOINT, {
          body: JSON.stringify({
            fullName,
            company,
            hasProfilePicture,
          }),
          headers: {
            Authorization: token,
          },
          method: 'PUT',
        })
          .then(() => {
            setTimeout(() => {
              dispatch(updateUserInfoSuccess()(params));
              dispatch(getUserInfo());
            }, 500);
          })
          .catch(() => {
            return dispatch(updateUserInfoFailure()(params));
          });
      };

      dispatch(updateUserInfoRequest()(params));

      if (file) {
        fetch(fileUploadUrl, {
          body: file,
          headers,
          method: 'PUT',
        })
          .then(() => {
            updateUserInfo(true);
          })
          .catch(() => {
            return dispatch(updateUserInfoFailure()(params));
          });
      } else {
        updateUserInfo(false);
      }
    });
  };
}
