import { AnyAction, combineReducers } from 'redux';
import APIStatus from 'constants/apiStatus';
import { POST_COACHEE_REQUEST, POST_COACHEE_FAILURE, POST_COACHEE_SUCCESS } from './coachees';
import {
  POST_PROCESS_SUCCESS,
  POST_PROCESS_FAILURE,
  POST_PROCESS_REQUEST,
  UPLOAD_REPORT_REQUEST,
  UPLOAD_REPORT_SUCCESS,
  UPLOAD_REPORT_FAILURE,
} from './processes';
import { CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE } from './auth';

export function makeReducer(
  request: string,
  success: string,
  failure: string,
  initialState = APIStatus.Idle,
) {
  return function reducer(state = initialState, action: AnyAction): APIStatus {
    if (action.type === request) {
      return APIStatus.Fetching;
    }

    if (action.type === success) {
      return APIStatus.Success;
    }

    if (action.type === failure) {
      return APIStatus.Failure;
    }

    return state;
  };
}

export default combineReducers({
  newCoachee: makeReducer(POST_COACHEE_REQUEST, POST_COACHEE_SUCCESS, POST_COACHEE_FAILURE),
  newProcess: makeReducer(POST_PROCESS_REQUEST, POST_PROCESS_SUCCESS, POST_PROCESS_FAILURE),
  changePassword: makeReducer(
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAILURE,
  ),
  uploadReport: makeReducer(UPLOAD_REPORT_REQUEST, UPLOAD_REPORT_SUCCESS, UPLOAD_REPORT_FAILURE),
});
