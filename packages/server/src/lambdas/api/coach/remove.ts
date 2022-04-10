import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import R from 'ramda';
import { queryItem, erase } from '../../../shared/util/DynamoIO';
import { buildMetaDeleteItem } from '../../../shared/util/DynamoMeta';
import { getId } from '../../../shared/util/AwsLambda';
import { error, success, deleted, ApplicationResponse } from '../../../shared/util/HttpResponse';
import { checkIfExits, buildCoachQuery } from './common';

const processDelete = (result: ApplicationResponse): Promise<ApplicationResponse> => {
  const content = R.pathOr({}, ['content'], result);

  const remove = R.pipe(R.pick(['PK', 'SK']), buildMetaDeleteItem, erase, R.andThen(deleted));

  return R.ifElse(R.isEmpty, () => result, remove)(content);
};

const process = async (event: APIGatewayProxyEvent): Promise<ApplicationResponse> =>
  R.pipe(
    getId,
    buildCoachQuery,
    queryItem,
    R.andThen(checkIfExits),
    R.andThen(processDelete),
  )(event);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  // eslint-disable-next-line prettier/prettier
  process(event).then(success).catch(error);
