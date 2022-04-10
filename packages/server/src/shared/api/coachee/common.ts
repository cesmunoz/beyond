import moment from 'moment';
import R from 'ramda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ValidAny } from '@beyond/lib/types';
import { CoacheeModel } from '../../models/CoacheeModel';
import { CoachModel } from '../../models/CoachModel';
import { notfound, accepted } from '../../util/HttpResponse';
import { buildMetaQuery, getKeyValue, buildMetaQueryAll } from '../../util/DynamoMeta';
import { query } from '../../util/DynamoIO';

const { WEBSITE_URL, EMAIL_ADDRESS_SENDER } = process.env;

export const buildCoachQuery = (id: string): DocumentClient.GetItemInput =>
  buildMetaQuery(id, 'COACH', 'COACH');

export const processUpsert = (entity: CoacheeModel, coach: CoachModel): object => ({
  ...entity,
  PK: `COACH#${getKeyValue(coach.PK)}`,
  SK: `COACHEE#${entity.email}`,
  coachSelected: entity.coachId,
});

export const processUpsertMeta = (entity: CoacheeModel): object => ({
  ...entity,
  PK: `COACHEE#${entity.email}`,
  SK: `#METADATA#${entity.email}`,
});

export const checkIfExits = R.ifElse(R.isEmpty, () => notfound('User does not exists'), accepted);

export const getCoacheeTTLInEpoch = (): number => moment().add(3, 'days').unix();

export const getRandomHash = (): string => Math.random().toString(36).slice(2);

export const newCoacheeEmailTemplate = ({ email, hash }: ValidAny): object => ({
  Source: EMAIL_ADDRESS_SENDER,
  Destination: {
    ToAddresses: [email],
  },
  Template: 'NewCoacheeEmailTemplate',
  TemplateData: `{ "url": "${WEBSITE_URL}", "email":"${email}", "hash": "${hash}" }`,
});

export const getProcessesByCoachee = async (email: string): Promise<Array<object>> => {
  const queryToProcess = buildMetaQueryAll(`COACHEE#${email}`, 'PROCESS#');
  return query(queryToProcess);
};
