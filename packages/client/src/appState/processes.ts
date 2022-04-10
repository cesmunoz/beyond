import { Reducer } from 'redux';
import {
  RequestAction,
  SuccessAction,
  FailureAction,
  RequestActionCreator,
  SuccessActionCreator,
  FailureActionCreator,
} from 'utils/actionTypes';
import { addListToEntities, mergeEntity } from 'utils/parserListEntities';
import { ProcessType, ProcessStatus } from '@beyond/lib/enums';
import { CoacheeProcessFormData, PersonalInfoRequest } from '@beyond/lib/types/processes';
import { requestAction, successAction, failureAction } from './api';

export const GET_PROCESSES_REQUEST = '@processes/GET_PROCESSES_REQUEST';
export const GET_PROCESSES_SUCCESS = '@processes/GET_PROCESSES_SUCCESS';
export const GET_PROCESSES_FAILURE = '@processes/GET_PROCESSES_FAILURE';
type GetProcessesRequestAction = RequestAction<typeof GET_PROCESSES_REQUEST>;
type GetProcessesSuccessAction = SuccessAction<typeof GET_PROCESSES_SUCCESS, ProcessSummary[]>;
type GetProcessesFailureAction = FailureAction<typeof GET_PROCESSES_FAILURE>;

export function getProcessesRequest(): RequestActionCreator<GetProcessesRequestAction> {
  return requestAction(GET_PROCESSES_REQUEST);
}

export function getProcessesSuccess(): SuccessActionCreator<
  GetProcessesSuccessAction,
  ProcessSummary[]
> {
  return successAction(GET_PROCESSES_SUCCESS);
}

export const POST_PROCESS_REQUEST = '@processes/POST_PROCESS_REQUEST';
export const POST_PROCESS_SUCCESS = '@processes/POST_PROCESS_SUCCESS';
export const POST_PROCESS_FAILURE = '@processes/POST_PROCESS_FAILURE';
type PostProcessRequestAction = RequestAction<typeof POST_PROCESS_REQUEST>;
type PostProcessSuccessAction = SuccessAction<typeof POST_PROCESS_SUCCESS, ProcessSummary>;
type PostProcessFailureAction = FailureAction<typeof POST_PROCESS_FAILURE>;

export function getProcessesFailure(): FailureActionCreator<GetProcessesFailureAction> {
  return failureAction(GET_PROCESSES_FAILURE);
}

export function postProcessRequest(): RequestActionCreator<PostProcessRequestAction> {
  return requestAction(POST_PROCESS_REQUEST);
}

export function postProcessSuccess(): SuccessActionCreator<
  PostProcessSuccessAction,
  ProcessSummary
> {
  return successAction(POST_PROCESS_SUCCESS);
}

export function postProcessFailure(): FailureActionCreator<PostProcessFailureAction> {
  return failureAction(POST_PROCESS_FAILURE);
}

export const CREATE_ANSWERS_REQUEST = '@processes/CREATE_ANSWERS_REQUEST';
export const CREATE_ANSWERS_SUCCESS = '@processes/CREATE_ANSWERS_SUCCESS';
export const CREATE_ANSWERS_FAILURE = '@processes/CREATE_ANSWERS_FAILURE';
type CreateAnswersRequestAction = RequestAction<typeof CREATE_ANSWERS_REQUEST>;
type CreateAnswersSuccessAction = SuccessAction<typeof CREATE_ANSWERS_SUCCESS>;
type CreateAnswersFailureAction = FailureAction<typeof CREATE_ANSWERS_FAILURE>;

export function createAnswersRequest(): RequestActionCreator<CreateAnswersRequestAction> {
  return requestAction(CREATE_ANSWERS_REQUEST);
}

export function createAnswersSuccess(): SuccessActionCreator<CreateAnswersSuccessAction> {
  return successAction(CREATE_ANSWERS_SUCCESS);
}

export function createAnswersFailure(): FailureActionCreator<CreateAnswersFailureAction> {
  return failureAction(CREATE_ANSWERS_FAILURE);
}

export const CREATE_EVALUATOR_ANSWERS_REQUEST = '@processes/CREATE_EVALUATOR_ANSWERS_REQUEST';
export const CREATE_EVALUATOR_ANSWERS_SUCCESS = '@processes/CREATE_EVALUATOR_ANSWERS_SUCCESS';
export const CREATE_EVALUATOR_ANSWERS_FAILURE = '@processes/CREATE_EVALUATOR_ANSWERS_FAILURE';
type CreateEvaluatorAnswersRequestAction = RequestAction<typeof CREATE_EVALUATOR_ANSWERS_REQUEST>;
type CreateEvaluatorAnswersSuccessAction = SuccessAction<typeof CREATE_EVALUATOR_ANSWERS_SUCCESS>;
type CreateEvaluatorAnswersFailureAction = FailureAction<typeof CREATE_EVALUATOR_ANSWERS_FAILURE>;

export function createEvaluatorAnswersRequest(): RequestActionCreator<
  CreateEvaluatorAnswersRequestAction
> {
  return requestAction(CREATE_EVALUATOR_ANSWERS_REQUEST);
}

export function createEvaluatorAnswersSuccess(): SuccessActionCreator<
  CreateEvaluatorAnswersSuccessAction
> {
  return successAction(CREATE_EVALUATOR_ANSWERS_SUCCESS);
}

export function createEvaluatorAnswersFailure(): FailureActionCreator<
  CreateEvaluatorAnswersFailureAction
> {
  return failureAction(CREATE_EVALUATOR_ANSWERS_FAILURE);
}

export const GET_PROCESS_REQUEST = '@processes/GET_PROCESS_REQUEST';
export const GET_PROCESS_SUCCESS = '@processes/GET_PROCESS_SUCCESS';
export const GET_PROCESS_FAILURE = '@processes/GET_PROCESS_FAILURE';
type GetProcessRequestAction = RequestAction<typeof GET_PROCESS_REQUEST>;
export type GetProcessSuccessAction = SuccessAction<typeof GET_PROCESS_SUCCESS, ProcessDetail>;
type GetProcessFailureAction = FailureAction<typeof GET_PROCESS_FAILURE>;

export function getProcessRequest(): RequestActionCreator<GetProcessRequestAction> {
  return requestAction(GET_PROCESS_REQUEST);
}

export function getProcessSuccess(): SuccessActionCreator<GetProcessSuccessAction, ProcessDetail> {
  return successAction(GET_PROCESS_SUCCESS);
}

export function getProcessFailure(): FailureActionCreator<GetProcessFailureAction> {
  return failureAction(GET_PROCESS_FAILURE);
}

export const UPLOAD_REPORT_REQUEST = '@processes/UPLOAD_REPORT_REQUEST';
export const UPLOAD_REPORT_SUCCESS = '@processes/UPLOAD_REPORT_SUCCESS';
export const UPLOAD_REPORT_FAILURE = '@processes/UPLOAD_REPORT_FAILURE';
type UploadReportRequestAction = RequestAction<typeof UPLOAD_REPORT_REQUEST>;
export type UploadReportSuccessAction = SuccessAction<typeof UPLOAD_REPORT_SUCCESS>;
type UploadReportFailureAction = FailureAction<typeof UPLOAD_REPORT_FAILURE>;

export function uploadReportRequest(): RequestActionCreator<UploadReportRequestAction> {
  return requestAction(UPLOAD_REPORT_REQUEST);
}

export function uploadReportSuccess(): SuccessActionCreator<UploadReportSuccessAction> {
  return successAction(UPLOAD_REPORT_SUCCESS);
}

export function uploadReportFailure(): FailureActionCreator<UploadReportFailureAction> {
  return failureAction(UPLOAD_REPORT_FAILURE);
}

type ProcessSummary = {
  readonly collaborators: ProcessEvaluators[];
  readonly processId: string;
  readonly coachees: CoacheeProcessFormData[];
  readonly mainCoachee: CoacheeProcessFormData;
  readonly type: ProcessType;
  readonly createdDate: string;
  readonly status: ProcessStatus;
  readonly company: string;
  readonly rol: string;
  readonly expectation: string;
  readonly questionnaire: ProcessQuestionnaireAnswers[];
  readonly updatedDate?: string;
  readonly isExpired: boolean;
};

type ProcessForms = {
  question: string;
  answer: string;
};

export type ProcessEvaluators = {
  answers: ProcessQuestionnaireAnswers[];
  email: string;
  role: string;
  fullName: string;
};

export type ProcessQuestionnaireAnswers = {
  [key: string]: {
    id: number;
    value: number;
  };
};

export type ProcessDetail = ProcessSummary & {
  readonly form: ProcessForms[];
  readonly questionnaire: ProcessQuestionnaireAnswers[];
  readonly formType: string;
  readonly formVersion: number;
  readonly personalInfo: PersonalInfoRequest;
  readonly report: string;
  readonly reportPdf: string;
  readonly key: string;
  readonly isExpired: boolean;
};

type ProcessesState = Record<string, ProcessSummary | ProcessDetail>;

type ProcessesActionTypes =
  | GetProcessesSuccessAction
  | PostProcessSuccessAction
  | GetProcessSuccessAction;

const processesReducer: Reducer<ProcessesState, ProcessesActionTypes> = (
  state: ProcessesState = {},
  action: ProcessesActionTypes,
): ProcessesState => {
  switch (action.type) {
    case GET_PROCESSES_SUCCESS:
      return addListToEntities(action.payload.data, 'processId');
    case POST_PROCESS_SUCCESS:
      return { ...state, [action.payload.data.processId]: action.payload.data };
    case GET_PROCESS_SUCCESS:
      return mergeEntity<ProcessesState>(state, action.payload.data, 'processId');
    default:
      return state;
  }
};

export default processesReducer;
