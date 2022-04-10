import { APIGatewayProxyResult } from 'aws-lambda';
import { COACH } from '@beyond/lib/constants';
import withAuth, { AuthAPIGatewayProxyEvent } from '../../../shared/middlewares/withAuth';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { CoacheeModel } from '../../../shared/models/CoacheeModel';
import { buildMetaQueryAllBegins } from '../../../shared/util/DynamoMeta';
import { query } from '../../../shared/util/DynamoIO';
import { error, success, ApplicationResponse, accepted } from '../../../shared/util/HttpResponse';

const mapListToCoachList = (list: Array<CoacheeModel>): Array<object> =>
  list.map(item => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { PK, SK, ...rest } = item;
    return rest;
  });

const process = async ({
  email,
  queryStringParameters,
}: AuthAPIGatewayProxyEvent): Promise<ApplicationResponse | ApplicationError> => {
  const { limit = 0 } = queryStringParameters || {};
  const queryToProcess = buildMetaQueryAllBegins(`COACH#${email}`, 'COACHEE#', Number(limit));
  const queryResult = await query(queryToProcess);
  const result = mapListToCoachList(queryResult);
  return accepted(result);
};

export const getAll = async (event: AuthAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  process(event).then(success).catch(error);

export const handler = withAuth(getAll, [COACH]);
