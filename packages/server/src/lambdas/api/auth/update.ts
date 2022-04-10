import { APIGatewayProxyResult } from 'aws-lambda';
import { COACHEE, COACH } from '@beyond/lib/constants';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { UserType, ValidAny } from '@beyond/lib/types';
import { TransactionActions } from '../../../shared/constants';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import {
  buildTransactionItem,
  buildTransaction,
  DynamoUpdateItem,
  DynamoUpdateAction,
  buildMetaUpdateSetItem,
} from '../../../shared/util/DynamoMeta';
import { insertTransaction } from '../../../shared/util/DynamoIO';
import { getBody } from '../../../shared/util/AwsLambda';
import { ok, error, success, ApplicationResponse } from '../../../shared/util/HttpResponse';
import withAuth, { AuthAPIGatewayProxyEvent } from '../../../shared/middlewares/withAuth';
import getCoachs from '../../../shared/api/coach/getCoachs';

const updateUserInfoForCoach = (
  email: string,
  coacheeEmail: string,
  fullName: string,
  company: string,
): DocumentClient.UpdateItemInput => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [
        { name: 'fullName', value: fullName },
        { name: 'company', value: company },
      ],
    },
  ];

  const key = {
    PK: `COACH#${email}`,
    SK: `COACHEE#${coacheeEmail}`,
  };

  return buildMetaUpdateSetItem(key, updateItems);
};

const updateUserInfo = (
  type: UserType,
  email: string,
  fullName: string,
  company: string,
  profileImg: boolean,
): DocumentClient.UpdateItemInput => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [
        { name: 'fullName', value: fullName },
        { name: 'company', value: company },
      ],
    },
  ];

  if (profileImg) {
    updateItems[0].values.push({
      name: 'avatarUrl',
      value: `${email}/profile-image.png`,
    });
  }

  const key = {
    PK: `${type}#${email}`,
    SK: `#METADATA#${email}`,
  };

  return buildMetaUpdateSetItem(key, updateItems);
};

const process = async (
  event: AuthAPIGatewayProxyEvent,
): Promise<ApplicationResponse | ApplicationError> => {
  const body = getBody(event) as ValidAny;

  const updateItem = buildTransactionItem(
    updateUserInfo(event.role, event.email, body.fullName, body.company, body.hasProfilePicture),
    TransactionActions.Update,
  );
  const transactions = [updateItem];

  if (event.role === COACHEE) {
    const coachs = await getCoachs();

    coachs.forEach(coach => {
      const updateCoachItem = buildTransactionItem(
        updateUserInfoForCoach(coach.email, event.email, body.fullName, body.company),
        TransactionActions.Update,
      );

      transactions.push(updateCoachItem);
    });
  }

  const transaction = buildTransaction(transactions);
  const result = await insertTransaction(transaction);
  return ok(result);
};

export const createHandler = async (
  event: AuthAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => process(event).then(success).catch(error);

export const handler = withAuth(createHandler, [COACHEE, COACH]);
