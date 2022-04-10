import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { UserType } from '@beyond/lib/types';
import { ANON, COGNITO_ROLE_KEY } from '@beyond/lib/constants';

export type AuthAPIGatewayProxyEvent = {
  role: UserType;
  email: string;
} & APIGatewayProxyEvent;

type APIGatewayHandler = (
  event: AuthAPIGatewayProxyEvent,
  context: Context,
  callback?: Function,
) => Promise<APIGatewayProxyResult>;

export default (handler: APIGatewayHandler, allowedRoles: UserType[]) => (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> | void => {
  const { authorizer } = event.requestContext;

  if (!authorizer) {
    return Promise.reject(new Error('No Authorizer'));
  }

  const role = authorizer.claims[COGNITO_ROLE_KEY];
  const { email } = authorizer.claims;

  if (!!allowedRoles.length && !allowedRoles.includes(role) && !allowedRoles.includes(ANON)) {
    return context.succeed({
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }

  return handler({ ...event, role, email }, context);
};
