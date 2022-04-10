import { Lambda } from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';
import R from 'ramda';
import { ValidAny } from '@beyond/lib/types';

const lambda = new Lambda();

export const getId = (event: APIGatewayProxyEvent): string =>
  R.pipe(R.pathOr('', ['pathParameters', 'id']))(event);

export const getBody = (event: APIGatewayProxyEvent): object => {
  const retrieveBody = R.ifElse(
    R.isNil,
    () => '{}',
    () => event.body,
  );
  return JSON.parse(retrieveBody(event));
};

export const invoke = async (name: string, payload: ValidAny): Promise<ValidAny> => {
  const params = { FunctionName: name, Payload: JSON.stringify(payload) };
  const result = await lambda.invoke(params).promise();

  return result;
};
