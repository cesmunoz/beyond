import { APIGatewayProxyResult } from 'aws-lambda';

import { COACH, COACHEE } from '@beyond/lib/constants';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { buildMetaQueryAllBegins } from '../../../shared/util/DynamoMeta';
import { query } from '../../../shared/util/DynamoIO';
import { error, success, ok, ApplicationResponse } from '../../../shared/util/HttpResponse';
import withAuth, { AuthAPIGatewayProxyEvent } from '../../../shared/middlewares/withAuth';

const process = async ({
  role,
  email,
  queryStringParameters,
}: AuthAPIGatewayProxyEvent): Promise<ApplicationResponse | ApplicationError> => {
  const { limit = 0 } = queryStringParameters || {};
  const isCoach = role === COACH;
  const pk = isCoach ? `COACH#${email}` : `COACHEE#${email}`;

  const queryParams = buildMetaQueryAllBegins(pk, 'PROCESS', Number(limit));
  const result = await query(queryParams);

  return ok(result);
};

export const getAllHandler = async (
  event: AuthAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => process(event).then(success).catch(error);

export const handler = withAuth(getAllHandler, [COACH, COACHEE]);
