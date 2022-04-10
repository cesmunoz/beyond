import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ChangePasswordRequest } from '@beyond/lib/types/auth';

import * as interfaces from '../../../shared/interfaces';
import getCoachs from '../../../shared/api/coach/getCoachs';
import ioc from '../../../shared/config/ioc';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { TransactionActions } from '../../../shared/constants';
import { getBody } from '../../../shared/util/AwsLambda';
import { insertTransaction } from '../../../shared/util/DynamoIO';
import {
  validate,
  buildCoachCoacheePK,
  buildRemoveCoacheeTTL,
  buildCoacheePK,
  setPasswordCoacheeEmailTemplate,
} from './common';
import {
  buildTransactionItem,
  buildTransaction,
  getKeyValue,
} from '../../../shared/util/DynamoMeta';
import {
  error,
  success,
  created,
  badRequest,
  ApplicationResponse,
} from '../../../shared/util/HttpResponse';
import { sendEmail } from '../../../shared/services/SimpleEmailService';

const getCognitoService = (): interfaces.services.CognitoService =>
  ioc.container.get<interfaces.services.CognitoService>(ioc.types.services.CognitoService);

const cognitoService = getCognitoService();

const process = async (
  event: APIGatewayProxyEvent,
): Promise<ApplicationResponse | ApplicationError> => {
  const body = getBody(event) as ChangePasswordRequest;

  if (!validate(body)) {
    return badRequest('Invalid coachee information');
  }

  const userEmail = body.email.toLowerCase();

  const coachs = await getCoachs();
  const transactions = coachs.map(coach => {
    const dynamoItem = buildCoachCoacheePK(userEmail, getKeyValue(coach.PK));
    const itemToProcess = buildRemoveCoacheeTTL(dynamoItem, body.confirmHash);
    return buildTransactionItem(itemToProcess, TransactionActions.Update);
  });

  const dynamoItem = buildCoacheePK(userEmail);
  const itemToProcess = buildRemoveCoacheeTTL(dynamoItem, body.confirmHash);
  const transactionItem = buildTransactionItem(itemToProcess, TransactionActions.Update);
  transactions.push(transactionItem);

  const transaction = buildTransaction(transactions);
  const result = await insertTransaction(transaction);

  await cognitoService.changePassword(userEmail, body.password);

  await sendEmail(setPasswordCoacheeEmailTemplate, userEmail, {
    email: userEmail,
  });

  return created(result);
};

export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  process(event).then(success).catch(error);

export const handler = create;
