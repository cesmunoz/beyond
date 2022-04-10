import {
  getQuestionnairesRequest,
  getQuestionnairesSuccess,
  getQuestionnairesFailure,
  getQuestionnaireRequest,
  getQuestionnaireSuccess,
  getQuestionnaireFailure,
} from 'appState/questionnaires';
import { GET } from 'constants/httpVerbs';
import fetchCreator from './createFetchCreator';

export const ENDPOINT = `${process.env.API_ENDPOINT}/questionnaire`;

export function getQuestionnaires(): Function {
  return fetchCreator(
    `${ENDPOINT}`,
    {
      request: getQuestionnairesRequest(),
      success: getQuestionnairesSuccess(),
      failure: getQuestionnairesFailure(),
    },
    {
      method: GET,
    },
  );
}

export function getQuestionnaire(id: string): Function {
  return fetchCreator(
    `${ENDPOINT}/${id}`,
    {
      request: getQuestionnaireRequest(),
      success: getQuestionnaireSuccess(),
      failure: getQuestionnaireFailure(),
    },
    {
      method: GET,
    },
  );
}
