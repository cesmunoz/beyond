import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import R from 'ramda';
import { getId } from '../../../shared/util/AwsLambda';
import { queryItem } from '../../../shared/util/DynamoIO';
import { error, success, ApplicationResponse } from '../../../shared/util/HttpResponse';
import { checkIfExits, buildCoachQuery } from './common';
import { mapToFE } from '../../../shared/util';

const process = (event: APIGatewayProxyEvent): Promise<ApplicationResponse> =>
  R.pipe(getId, buildCoachQuery, queryItem, R.andThen(mapToFE), R.andThen(checkIfExits))(event);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line prettier/prettier
  process(event).then(success).catch(error);
