import { getSummaryRequest, getSummarySuccess, getSummaryFailure } from 'appState/summary';
import { GET } from 'constants/httpVerbs';
import fetchCreator from './createFetchCreator';

export const ENDPOINT = `${process.env.API_ENDPOINT}/summary`;

export function getSummary(): Function {
  return fetchCreator(
    `${ENDPOINT}`,
    {
      request: getSummaryRequest(),
      success: getSummarySuccess(),
      failure: getSummaryFailure(),
    },
    {
      method: GET,
    },
  );
}
