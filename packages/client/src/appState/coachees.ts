import { Reducer } from 'redux';
import { CoacheeFormData } from '@beyond/lib/types/coachees';

import {
  RequestAction,
  SuccessAction,
  FailureAction,
  SuccessActionCreator,
  RequestActionCreator,
  FailureActionCreator,
} from 'utils/actionTypes';
import { addListToEntities, mergeEntity } from 'utils/parserListEntities';
import { ProcessType, ProcessStatus } from '@beyond/lib/enums';
import { requestAction, successAction, failureAction } from './api';

export const GET_COACHEES_REQUEST = '@coachees/GET_COACHEES_REQUEST';
export const GET_COACHEES_SUCCESS = '@coachees/GET_COACHEES_SUCCESS';
export const GET_COACHEES_FAILURE = '@coachees/GET_COACHEES_FAILURE';

export const GET_COACHEE_REQUEST = '@coachees/GET_COACHEE_REQUEST';
export const GET_COACHEE_SUCCESS = '@coachees/GET_COACHEE_SUCCESS';
export const GET_COACHEE_FAILURE = '@coachees/GET_COACHEE_FAILURE';

export const POST_COACHEE_REQUEST = '@coachees/POST_COACHEE_REQUEST';
export const POST_COACHEE_SUCCESS = '@coachees/POST_COACHEE_SUCCESS';
export const POST_COACHEE_FAILURE = '@coachees/POST_COACHEE_FAILURE';

type GetCoacheesRequestAction = RequestAction<typeof GET_COACHEES_REQUEST>;
type GetCoacheesSuccessAction = SuccessAction<typeof GET_COACHEES_SUCCESS, CoacheeSummary[]>;
type GetCoacheesFailureAction = FailureAction<typeof GET_COACHEES_FAILURE>;

type GetCoacheeRequestAction = RequestAction<typeof GET_COACHEE_REQUEST>;
type GetCoacheeSuccessAction = SuccessAction<typeof GET_COACHEE_SUCCESS, CoacheeDetail>;
type GetCoacheeFailureAction = FailureAction<typeof GET_COACHEE_FAILURE>;

type PostCoacheeRequestAction = RequestAction<typeof POST_COACHEE_REQUEST, CoacheeFormData>;
type PostCoacheeSuccessAction = SuccessAction<typeof POST_COACHEE_SUCCESS, CoacheeSummary>;
type PostCoacheeFailureAction = FailureAction<typeof POST_COACHEE_FAILURE, CoacheeFormData>;

export function getCoacheesRequest(): RequestActionCreator<GetCoacheesRequestAction> {
  return requestAction(GET_COACHEES_REQUEST);
}

export function getCoacheesSuccess(): SuccessActionCreator<
  GetCoacheesSuccessAction,
  CoacheeSummary[]
> {
  return successAction<typeof GET_COACHEES_SUCCESS, CoacheeSummary[]>(GET_COACHEES_SUCCESS);
}

export function getCoacheesFailure(): FailureActionCreator<GetCoacheesFailureAction> {
  return failureAction(GET_COACHEES_FAILURE);
}

export function getCoacheeRequest(): RequestActionCreator<GetCoacheeRequestAction> {
  return requestAction(GET_COACHEE_REQUEST);
}

export function getCoacheeSuccess(): SuccessActionCreator<GetCoacheeSuccessAction, CoacheeDetail> {
  return successAction<typeof GET_COACHEE_SUCCESS, CoacheeDetail>(GET_COACHEE_SUCCESS);
}

export function getCoacheeFailure(): FailureActionCreator<GetCoacheeFailureAction> {
  return failureAction(GET_COACHEE_FAILURE);
}

export function postCoacheeRequest(
  coachee: CoacheeFormData,
): RequestActionCreator<PostCoacheeRequestAction> {
  return requestAction(POST_COACHEE_REQUEST, coachee);
}

export function postCoacheeSuccess(): SuccessActionCreator<
  PostCoacheeSuccessAction,
  CoacheeSummary
> {
  return successAction(POST_COACHEE_SUCCESS);
}

export function postCoacheeFailure(
  coachee: CoacheeFormData,
): FailureActionCreator<PostCoacheeFailureAction> {
  return failureAction(POST_COACHEE_FAILURE, coachee);
}

function addCoachee(state: CoacheesState, data: CoacheeFormData): CoacheesState {
  const newState = { ...state };
  newState[data.email] = { ...data, status: 'inactive' };
  return newState;
}

function updateCoachee(state: CoacheesState, data: CoacheeSummary): CoacheesState {
  const newState = { ...state };
  newState[data.email as string] = data;
  return state;
}

function removeCoachee(state: CoacheesState, data: CoacheeFormData): CoacheesState {
  const newState = { ...state };
  delete newState[data.email];
  return newState;
}

export type CoacheeSummary = {
  readonly email: string;
  readonly coacheeId?: string;
  readonly fullName?: string;
  readonly company?: string;
  readonly status: string;
};

export type CoacheeDetail = CoacheeSummary & {
  readonly birthDate: string;
  readonly birthTime: string;
  readonly city: string;
  readonly country: string;
  readonly processes: ProcessSummary[];
};

export type ProcessSummary = {
  readonly processId: string;
  readonly type: ProcessType;
  readonly date: string;
  readonly status: ProcessStatus;
  readonly key: string;
  readonly isExpired: boolean;
};

type CoacheesState = Record<string, CoacheeSummary | CoacheeDetail>;

type CoacheesActionTypes =
  | GetCoacheesSuccessAction
  | GetCoacheeSuccessAction
  | PostCoacheeRequestAction
  | PostCoacheeSuccessAction
  | PostCoacheeFailureAction;

const coacheesReducer: Reducer<CoacheesState, CoacheesActionTypes> = (
  state: CoacheesState = {},
  action: CoacheesActionTypes,
): CoacheesState => {
  switch (action.type) {
    case POST_COACHEE_REQUEST:
      return addCoachee(state, action.payload.data as CoacheeFormData);
    case POST_COACHEE_SUCCESS:
      return updateCoachee(state, action.payload.data);
    case POST_COACHEE_FAILURE:
      return removeCoachee(state, action.payload.data as CoacheeFormData);
    case GET_COACHEES_SUCCESS:
      return addListToEntities<CoacheesState, CoacheeSummary>(action.payload.data, 'email');
    case GET_COACHEE_SUCCESS:
      return mergeEntity<CoacheesState>(state, action.payload.data, 'email');
    default:
      return state;
  }
};

export default coacheesReducer;
