import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { COACH } from '@beyond/lib/constants';
import { createCoachee } from '../../../shared/api/coachee/create';
import withAuth from '../../../shared/middlewares/withAuth';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { CoacheeModel } from '../../../shared/models/CoacheeModel';
import { getBody } from '../../../shared/util/AwsLambda';
import { validate } from './common';
import {
  error,
  success,
  created,
  badRequest,
  ApplicationResponse,
} from '../../../shared/util/HttpResponse';

const process = async (
  event: APIGatewayProxyEvent,
): Promise<ApplicationResponse | ApplicationError> => {
  const body = getBody(event) as CoacheeModel;

  if (!validate(body)) {
    return badRequest('Invalid coachee information');
  }

  const user = await createCoachee(body);

  return created(user);
};

export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  process(event).then(success).catch(error);

export const handler = withAuth(create, [COACH]);
