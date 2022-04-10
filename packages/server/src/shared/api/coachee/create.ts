import { COACHEE } from '@beyond/lib/constants';
import { ValidAny } from '@beyond/lib/types';
import updateSummary from '../../api/summary/updateSummary';
import { sendEmail } from '../../services/SimpleEmailService';
import * as interfaces from '../../interfaces';
import getCoachs from '../../api/coach/getCoachs';
import ioc from '../../config/ioc';
import { TransactionActions } from '../../constants';
import { insertTransaction } from '../../util/DynamoIO';
import {
  processUpsert,
  processUpsertMeta,
  getCoacheeTTLInEpoch,
  getRandomHash,
  newCoacheeEmailTemplate,
} from './common';

import { buildMetaPutItem, buildTransactionItem, buildTransaction } from '../../util/DynamoMeta';

const getCognitoService = (): interfaces.services.CognitoService =>
  ioc.container.get<interfaces.services.CognitoService>(ioc.types.services.CognitoService);

const cognitoService = getCognitoService();

export const createCoachee = async (body: ValidAny): Promise<object> => {
  const userEmail = body.email.toLowerCase();

  const user = await cognitoService.createUser(userEmail, COACHEE);

  if (!user) {
    throw new Error('Error creating user in Cognito');
  }

  const coachee = {
    ...body,
    email: userEmail,
    userId: user.Username!,
    ttl: getCoacheeTTLInEpoch(),
    confirmHash: getRandomHash(),
  };

  const coachs = await getCoachs();
  const transactions = coachs.map(coach => {
    const dynamoItem = processUpsert(coachee, coach);
    const itemToProcess = buildMetaPutItem(dynamoItem);
    return buildTransactionItem(itemToProcess, TransactionActions.Put);
  });

  const dynamoItem = processUpsertMeta(coachee);
  const itemToProcess = buildMetaPutItem(dynamoItem);
  const transactionItem = buildTransactionItem(itemToProcess, TransactionActions.Put);
  transactions.push(transactionItem);

  transactions.push(updateSummary('coachees'));

  const transaction = buildTransaction(transactions);
  await insertTransaction(transaction);

  await sendEmail(newCoacheeEmailTemplate, userEmail, {
    email: userEmail,
    hash: coachee.confirmHash,
  });

  return coachee;
};
