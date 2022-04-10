import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { EvaluatorAnswersRequest } from '@beyond/lib/types/processes';
import R from 'ramda';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { getBody, getId } from '../../../shared/util/AwsLambda';
import { error, success, ok, ApplicationResponse } from '../../../shared/util/HttpResponse';
import { buildMetaQuery } from '../../../shared/util/DynamoMeta';
import { queryItem } from '../../../shared/util/DynamoIO';
import { saveUserAnswers } from '../../../shared/api/process/saveEvaluatorAnswers';

const getEmail = (event: APIGatewayProxyEvent): string =>
  R.pipe(R.pathOr('', ['pathParameters', 'email']))(event);

const saveAnswers = async (
  event: APIGatewayProxyEvent,
): Promise<ApplicationResponse | ApplicationError> => {
  const body = getBody(event) as EvaluatorAnswersRequest;
  const id = getId(event);
  const email = getEmail(event);

  const queryToProcess = buildMetaQuery(id, 'PROCESS');
  const process = await queryItem(queryToProcess);

  const result = await saveUserAnswers(body, process, email);

  return ok(result);
};

export const createHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  saveAnswers(event).then(success).catch(error);

export const handler = createHandler;
