import { Reducer } from 'redux';
import {
  RequestAction,
  SuccessAction,
  FailureAction,
  RequestActionCreator,
  SuccessActionCreator,
  FailureActionCreator,
} from 'utils/actionTypes';
import { addListToEntities } from 'utils/parserListEntities';
import { requestAction, successAction, failureAction } from './api';

export const GET_QUESTIONNAIRES_REQUEST = '@questionnaires/GET_QUESTIONNAIRES_REQUEST';
export const GET_QUESTIONNAIRES_SUCCESS = '@questionnaires/GET_QUESTIONNAIRES_SUCCESS';
export const GET_QUESTIONNAIRES_FAILURE = '@questionnaires/GET_QUESTIONNAIRES_FAILURE';

export const GET_QUESTIONNAIRE_REQUEST = '@questionnaires/GET_QUESTIONNAIRE_REQUEST';
export const GET_QUESTIONNAIRE_SUCCESS = '@questionnaires/GET_QUESTIONNAIRE_SUCCESS';
export const GET_QUESTIONNAIRE_FAILURE = '@questionnaires/GET_QUESTIONNAIRE_FAILURE';

type GetQuestionnairesRequestAction = RequestAction<typeof GET_QUESTIONNAIRES_REQUEST>;
type GetQuestionnairesSuccessAction = SuccessAction<
  typeof GET_QUESTIONNAIRES_SUCCESS,
  QuestionnairesSummary[]
>;
type GetQuestionnairesFailureAction = FailureAction<typeof GET_QUESTIONNAIRES_FAILURE>;

type GetQuestionnaireRequestAction = RequestAction<typeof GET_QUESTIONNAIRE_REQUEST>;
type GetQuestionnaireSuccessAction = SuccessAction<
  typeof GET_QUESTIONNAIRE_SUCCESS,
  QuestionnairesSummary
>;
type GetQuestionnaireFailureAction = FailureAction<typeof GET_QUESTIONNAIRE_FAILURE>;

export function getQuestionnairesRequest(): RequestActionCreator<GetQuestionnairesRequestAction> {
  return requestAction(GET_QUESTIONNAIRES_REQUEST);
}

export function getQuestionnairesSuccess(): SuccessActionCreator<
  GetQuestionnairesSuccessAction,
  QuestionnairesSummary[]
> {
  return successAction(GET_QUESTIONNAIRES_SUCCESS);
}

export function getQuestionnairesFailure(): FailureActionCreator<GetQuestionnairesFailureAction> {
  return failureAction(GET_QUESTIONNAIRES_FAILURE);
}

export function getQuestionnaireRequest(): RequestActionCreator<GetQuestionnaireRequestAction> {
  return requestAction(GET_QUESTIONNAIRE_REQUEST);
}

export function getQuestionnaireSuccess(): SuccessActionCreator<
  GetQuestionnaireSuccessAction,
  QuestionnairesSummary
> {
  return successAction(GET_QUESTIONNAIRE_SUCCESS);
}

export function getQuestionnaireFailure(): FailureActionCreator<GetQuestionnaireFailureAction> {
  return failureAction(GET_QUESTIONNAIRE_FAILURE);
}

type QuestionnairesActionTypes = GetQuestionnairesSuccessAction;

export type QuestionnairesSummary = {
  readonly version: string;
  readonly currentVersion: string;
  readonly questionnaireType: string;
  readonly questionnaire: QuestionnaireSection[];
};

export type QuestionnaireSection = {
  category: string;
  questions: Questionnaire[];
  onlyEvaluator?: boolean;
};

export type Questionnaire = {
  readonly id: number;
  readonly type: 'text' | 'rate';
  readonly question: string;
  readonly evaluator: string;
  value?: number;
};

type QuestionnairesState = Record<string, QuestionnairesSummary>;

const questionnairesReducer: Reducer<QuestionnairesState, QuestionnairesActionTypes> = (
  state: QuestionnairesState = {},
  action: QuestionnairesActionTypes,
): QuestionnairesState => {
  switch (action.type) {
    case GET_QUESTIONNAIRES_SUCCESS:
      return addListToEntities<QuestionnairesState, QuestionnairesSummary>(
        action.payload.data,
        ({ questionnaireType, currentVersion }) => `${questionnaireType}_${currentVersion}`,
      );
    default:
      return state;
  }
};

export default questionnairesReducer;
