import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ProcessFormData } from '@beyond/lib/types/processes';

import { COACH } from '@beyond/lib/constants';
import { ApplicationError } from '../../../shared/models/ApplicationError';

import { getBody } from '../../../shared/util/AwsLambda';
import {
  error,
  success,
  created,
  badRequest,
  ApplicationResponse,
} from '../../../shared/util/HttpResponse';
import withAuth from '../../../shared/middlewares/withAuth';
import { validate } from './common';
import createProcess from '../../../shared/api/process/create';

const process = async (
  event: APIGatewayProxyEvent,
): Promise<ApplicationResponse | ApplicationError> => {
  const body = getBody(event) as ProcessFormData;

  if (!validate(body)) {
    return badRequest('Invalid process information');
  }

  const result = await createProcess(body);

  return created(result);
};

export const createHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  process(event).then(success).catch(error);

export const handler = withAuth(createHandler, [COACH]);
