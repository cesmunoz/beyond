import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { COACH } from '@beyond/lib/constants';
import { getCoachee } from '../../../shared/api/coachee/get';
import { getId } from '../../../shared/util/AwsLambda';
import withAuth from '../../../shared/middlewares/withAuth';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { error, success, ApplicationResponse, accepted } from '../../../shared/util/HttpResponse';

const process = async (
  event: APIGatewayProxyEvent,
): Promise<ApplicationResponse | ApplicationError> => {
  const id = getId(event);
  const result = await getCoachee(id, true);

  return accepted(result);
};

export const getById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  process(event).then(success).catch(error);

export const handler = withAuth(getById, [COACH]);
