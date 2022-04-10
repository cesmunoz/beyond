import { Reducer } from 'redux';
import { UserType, ValidAny } from '@beyond/lib/types';

import {
  PayloadAction,
  RequestAction,
  SuccessAction,
  FailureAction,
  RequestActionCreator,
  SuccessActionCreator,
  FailureActionCreator,
} from 'utils/actionTypes';
import { ANON } from '@beyond/lib/constants';
import { requestAction, successAction, failureAction } from './api';

type UserInformationType = {
  fullName: string;
};

export const SET_USER_INFORMATION = '@auth/SET_USER_INFORMATION';

type SetUserInformationAction = PayloadAction<typeof SET_USER_INFORMATION, UserType>;

export function setUserInformation(payload: UserType): SetUserInformationAction {
  return {
    payload,
    type: SET_USER_INFORMATION,
  };
}

export const CHANGE_PASSWORD_REQUEST = '@auth/CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = '@auth/CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAILURE = '@auth/CHANGE_PASSWORD_FAILURE';
type ChangePasswordRequestAction = RequestAction<typeof CHANGE_PASSWORD_REQUEST>;
type ChangePasswordSuccessAction = SuccessAction<typeof CHANGE_PASSWORD_SUCCESS>;
type ChangePasswordFailureAction = FailureAction<typeof CHANGE_PASSWORD_FAILURE>;

export function changePasswordRequest(): RequestActionCreator<ChangePasswordRequestAction> {
  return requestAction(CHANGE_PASSWORD_REQUEST);
}

export function changePasswordSuccess(): SuccessActionCreator<ChangePasswordSuccessAction> {
  return successAction(CHANGE_PASSWORD_SUCCESS);
}

export function changePasswordFailure(): FailureActionCreator<ChangePasswordFailureAction> {
  return failureAction(CHANGE_PASSWORD_FAILURE);
}

export const GET_USER_INFO_REQUEST = '@auth/GET_USER_INFO_REQUEST';
export const GET_USER_INFO_SUCCESS = '@auth/GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_FAILURE = '@auth/GET_USER_INFO_FAILURE';
type GetUserInfoRequestAction = RequestAction<typeof GET_USER_INFO_REQUEST>;
type GetUserInfoSuccessAction = SuccessAction<typeof GET_USER_INFO_SUCCESS, UserInformationType>;
type GetUserInfoFailureAction = FailureAction<typeof GET_USER_INFO_FAILURE>;

export function getUserInfoRequest(): RequestActionCreator<GetUserInfoRequestAction> {
  return requestAction(GET_USER_INFO_REQUEST);
}

export function getUserInfoSuccess(): SuccessActionCreator<
  GetUserInfoSuccessAction,
  UserInformationType
> {
  return successAction<typeof GET_USER_INFO_SUCCESS, UserInformationType>(GET_USER_INFO_SUCCESS);
}

export function getUserInfoFailure(): FailureActionCreator<GetUserInfoFailureAction> {
  return failureAction(GET_USER_INFO_FAILURE);
}

export const UPDATE_USER_INFO_REQUEST = '@auth/UPDATE_USER_INFO_REQUEST';
export const UPDATE_USER_INFO_SUCCESS = '@auth/UPDATE_USER_INFO_SUCCESS';
export const UPDATE_USER_INFO_FAILURE = '@auth/UPDATE_USER_INFO_FAILURE';
type UpdateUserInfoRequestAction = RequestAction<typeof UPDATE_USER_INFO_REQUEST>;
type UpdateUserInfoSuccessAction = SuccessAction<typeof UPDATE_USER_INFO_SUCCESS>;
type UpdateUserInfoFailureAction = FailureAction<typeof UPDATE_USER_INFO_FAILURE>;

export function updateUserInfoRequest(): RequestActionCreator<UpdateUserInfoRequestAction> {
  return requestAction(UPDATE_USER_INFO_REQUEST);
}

export function updateUserInfoSuccess(): SuccessActionCreator<UpdateUserInfoSuccessAction> {
  return successAction<typeof UPDATE_USER_INFO_SUCCESS>(UPDATE_USER_INFO_SUCCESS);
}

export function updateUserInfoFailure(): FailureActionCreator<UpdateUserInfoFailureAction> {
  return failureAction(UPDATE_USER_INFO_FAILURE);
}

type AuthState = {
  role: UserType;
  fullName: string;
  email: string;
  company?: string;
  avatarUrl?: string;
  profileImgUploadUrl: string;
  birthDate?: string;
  birthTime?: string;
  city?: string;
  country?: string;
  seniority?: string;
  workRole?: string;
  education?: string;
};

type AuthActionTypes = SetUserInformationAction | GetUserInfoSuccessAction;

const authReducer: Reducer<AuthState, AuthActionTypes> = (
  state: AuthState = {
    role: ANON,
    fullName: '',
    email: '',
    company: '',
    profileImgUploadUrl: '',
  },
  action: AuthActionTypes,
): AuthState => {
  switch (action.type) {
    case SET_USER_INFORMATION:
      return { ...state, role: action.payload };
    case GET_USER_INFO_SUCCESS: {
      const { role, ...rest } = action.payload.data as ValidAny;
      return { ...state, ...rest };
    }
    default:
      return state;
  }
};

export default authReducer;
