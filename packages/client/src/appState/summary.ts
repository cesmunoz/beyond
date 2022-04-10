import { Reducer } from 'redux';

import {
  RequestAction,
  SuccessAction,
  FailureAction,
  SuccessActionCreator,
  RequestActionCreator,
  FailureActionCreator,
} from 'utils/actionTypes';
import { requestAction, successAction, failureAction } from './api';

export const GET_SUMMARY_REQUEST = '@summary/GET_SUMMARY_REQUEST';
export const GET_SUMMARY_SUCCESS = '@summary/GET_SUMMARY_SUCCESS';
export const GET_SUMMARY_FAILURE = '@summary/GET_SUMMARY_FAILURE';

type GetSummaryRequestAction = RequestAction<typeof GET_SUMMARY_REQUEST>;
type GetSummarySuccessAction = SuccessAction<typeof GET_SUMMARY_SUCCESS, Summary>;
type GetSummaryFailureAction = FailureAction<typeof GET_SUMMARY_FAILURE>;

export function getSummaryRequest(): RequestActionCreator<GetSummaryRequestAction> {
  return requestAction(GET_SUMMARY_REQUEST);
}

export function getSummarySuccess(): SuccessActionCreator<GetSummarySuccessAction, Summary> {
  return successAction<typeof GET_SUMMARY_SUCCESS, Summary>(GET_SUMMARY_SUCCESS);
}

export function getSummaryFailure(): FailureActionCreator<GetSummaryFailureAction> {
  return failureAction(GET_SUMMARY_FAILURE);
}

export type Summary = {
  readonly coachees: number;
  readonly pendingAnswers: number;
  readonly pendingReview: number;
  readonly finished: number;
};

type SummaryActionTypes = GetSummarySuccessAction;

const summaryReducer: Reducer<Summary, SummaryActionTypes> = (
  state = {
    coachees: 0,
    finished: 0,
    pendingAnswers: 0,
    pendingReview: 0,
  },
  action: SummaryActionTypes,
): Summary => {
  switch (action.type) {
    case GET_SUMMARY_SUCCESS:
      return action.payload.data;
    default:
      return state;
  }
};

export default summaryReducer;
