import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getId } from '../../../shared/util/AwsLambda';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { buildMetaQuery } from '../../../shared/util/DynamoMeta';
import { queryItem } from '../../../shared/util/DynamoIO';
import { error, success, ApplicationResponse, ok } from '../../../shared/util/HttpResponse';
import { removeAttributes } from './common';

const process = async (
  event: APIGatewayProxyEvent,
): Promise<ApplicationResponse | ApplicationError> => {
  const id = getId(event);
  const queryToProcess = buildMetaQuery(id.toUpperCase(), 'FORMS', 'v0');
  const queryResult = await queryItem(queryToProcess);
  const result = removeAttributes(queryResult);
  return ok(result);
};

export const getById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  process(event).then(success).catch(error);

export const handler = getById;
