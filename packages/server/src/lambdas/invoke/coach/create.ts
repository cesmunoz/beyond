import { COACH } from '@beyond/lib/constants';
import ioc from '../../../shared/config/ioc';
import * as interfaces from '../../../shared/interfaces';

import { buildMetaPutItem } from '../../../shared/util/DynamoMeta';
import { insert } from '../../../shared/util/DynamoIO';
import { validate, processUpsert } from './common';

type CreateCoachEvent = {
  email: string;
  password: string;
  fullName: string;
};

const getCognitoService = (): interfaces.services.CognitoService =>
  ioc.container.get<interfaces.services.CognitoService>(ioc.types.services.CognitoService);

const cognitoService = getCognitoService();

const createCoachInCognito = async (event: CreateCoachEvent): Promise<void> => {
  const { email, password } = event;
  await cognitoService.createUser(email, COACH);
  await cognitoService.changePassword(email, password);
};

export const handler = async (event: CreateCoachEvent): Promise<void> => {
  if (!validate(event)) {
    throw new Error('Invalid payload.');
  }

  await createCoachInCognito(event);

  const { password, ...coach } = event;

  const upsert = processUpsert(coach);
  const dynamoItem = buildMetaPutItem(upsert);

  await insert(dynamoItem);
};
