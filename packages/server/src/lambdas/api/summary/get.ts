import { APIGatewayProxyResult } from 'aws-lambda';
import { COACH } from '@beyond/lib/constants';
import withAuth from '../../../shared/middlewares/withAuth';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { buildMetaQuery } from '../../../shared/util/DynamoMeta';
import { queryItem } from '../../../shared/util/DynamoIO';
import { error, success, ApplicationResponse, accepted } from '../../../shared/util/HttpResponse';

const SUMMARY_KEY = 'SUMMARY';

const process = async (): Promise<ApplicationResponse | ApplicationError> => {
  const queryToProcess = buildMetaQuery(SUMMARY_KEY, SUMMARY_KEY, SUMMARY_KEY);
  const queryResult = await queryItem(queryToProcess);

  return accepted(queryResult);
};

export const getById = async (): Promise<APIGatewayProxyResult> =>
  process().then(success).catch(error);

export const handler = withAuth(getById, [COACH]);
