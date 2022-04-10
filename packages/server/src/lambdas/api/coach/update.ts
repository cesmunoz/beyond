import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import R from 'ramda';
import { ValidAny } from '@beyond/lib/types';
import { getBody } from '../../../shared/util/AwsLambda';
import { buildMetaUpdateItem } from '../../../shared/util/DynamoMeta';
import { update } from '../../../shared/util/DynamoIO';
import { validate, processUpsert } from './common';
import {
  error,
  success,
  ApplicationResponse,
  badRequest,
  accepted,
} from '../../../shared/util/HttpResponse';

const processUpdate = R.pipe(
  processUpsert,
  buildMetaUpdateItem as ValidAny,
  update,
  R.andThen(accepted),
);

const checkValidationAndUpdate = R.ifElse(
  R.has('error'),
  () => badRequest('Invalid User Information'),
  processUpdate,
);

const process = async (event: APIGatewayProxyEvent): Promise<ApplicationResponse> =>
  R.pipe(getBody, validate, checkValidationAndUpdate)(event);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line prettier/prettier
  process(event).then(success).catch(error);
