import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import R from 'ramda';
import { query } from '../../../shared/util/DynamoIO';
import { buildMetaQueryAll } from '../../../shared/util/DynamoMeta';
import { error, success, accepted, ApplicationResponse } from '../../../shared/util/HttpResponse';
import { mapToFE } from '../../../shared/util';

const mapListToCoachList = (list: Array<object>): Array<object> => R.map(mapToFE, list);

const buildAllCoachQuery = (): DocumentClient.QueryInput => buildMetaQueryAll('COACH#', 'COACH');

const process = (): Promise<ApplicationResponse> =>
  R.pipe(buildAllCoachQuery, query, R.andThen(mapListToCoachList), R.andThen(accepted))();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line prettier/prettier
  process().then(success).catch(error);
