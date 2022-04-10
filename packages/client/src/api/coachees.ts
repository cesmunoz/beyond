import {
  getCoacheesRequest,
  getCoacheesSuccess,
  getCoacheesFailure,
  getCoacheeRequest,
  getCoacheeSuccess,
  getCoacheeFailure,
  postCoacheeRequest,
  postCoacheeSuccess,
  postCoacheeFailure,
} from 'appState/coachees';
import { GET, POST } from 'constants/httpVerbs';
import { CoacheeFormData } from '@beyond/lib/types/coachees';
import fetchCreator from './createFetchCreator';

export const ENDPOINT = `${process.env.API_ENDPOINT}/coachee`;

export function getCoachees(limit?: number): Function {
  const getEndpoint = limit ? `${ENDPOINT}?limit=${limit}` : ENDPOINT;

  return fetchCreator(
    getEndpoint,
    {
      request: getCoacheesRequest(),
      success: getCoacheesSuccess(),
      failure: getCoacheesFailure(),
    },
    {
      method: GET,
    },
  );
}

export function getCoachee(id: string): Function {
  return fetchCreator(
    `${ENDPOINT}/${id}`,
    {
      request: getCoacheeRequest(),
      success: getCoacheeSuccess(),
      failure: getCoacheeFailure(),
    },
    {
      method: GET,
    },
  );
}

export function postCoachee(coachee: CoacheeFormData): Function {
  return fetchCreator(
    ENDPOINT,
    {
      request: postCoacheeRequest(coachee),
      success: postCoacheeSuccess(),
      failure: postCoacheeFailure(coachee),
    },
    {
      method: POST,
      body: coachee,
      stringify: true,
    },
  );
}
