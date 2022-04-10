import { APIGatewayProxyResult } from 'aws-lambda';
// import { HttpStatusCode } from '@beyond/lib/enums';
import { HttpStatusCode } from '@beyond/lib/enums';
import { ApplicationError } from '../models/ApplicationError';
import { ApplicationSuccess } from '../models/ApplicationSuccess';

export type ApplicationResponse = ApplicationError | ApplicationSuccess;

export const error = (err: ApplicationError): APIGatewayProxyResult => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = { message: err.message };

  if (err.content) {
    if (Array.isArray(err.content)) {
      body.errors = err.content;
    } else {
      body.error = err.content;
    }
  }

  if (err instanceof Error) {
    body.stack = err.stack;
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return {
    statusCode: err.statusCode ? err.statusCode : 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body, null, 2),
  };
};

export const respond = (response: ApplicationSuccess | ApplicationError): APIGatewayProxyResult => {
  if (response instanceof ApplicationError) {
    return error(response);
  }

  return {
    statusCode: response.statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(response.content, null, 2),
  };
};

export const ok = (body: object | Array<object>): ApplicationResponse =>
  new ApplicationSuccess(body, HttpStatusCode.OK);

export const accepted = (body: object | Array<object>): ApplicationResponse =>
  new ApplicationSuccess(body, HttpStatusCode.ACCEPTED);

export const created = (body: object | Array<object>): ApplicationSuccess =>
  new ApplicationSuccess(body, HttpStatusCode.CREATED);

export const deleted = (Key: object): ApplicationSuccess =>
  new ApplicationSuccess({ Key }, HttpStatusCode.NO_CONTENT);

export const notfound = (message: string): ApplicationError =>
  new ApplicationError(HttpStatusCode.NOT_FOUND, message);

export const badRequest = (message: string): ApplicationError =>
  new ApplicationError(HttpStatusCode.BAD_REQUEST, message);

export const success = (response: ApplicationResponse): APIGatewayProxyResult => respond(response);
