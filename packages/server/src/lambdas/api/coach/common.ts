import Joi from '@hapi/joi';
import R from 'ramda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { notfound, accepted } from '../../../shared/util/HttpResponse';
import { buildMetaQuery } from '../../../shared/util/DynamoMeta';

const coachId = R.pathOr('', ['coachId']);

const schema = Joi.object({
  coachId: Joi.string().optional(),
  fullName: Joi.string().required(),
});

export const validate = (entity: object): object => schema.validate(entity);
export const addPK = (id: string, entity: object): object => R.assoc('PK', `COACH#${id}`, entity);
export const addSK = (entity: object): object => R.assoc('SK', 'COACH', entity);

const addPartitionKey = (entity: object): object => {
  const coach = coachId(entity);
  const result = addPK(coach, entity);
  return result;
};

export const buildCoachQuery = (id: string): DocumentClient.GetItemInput =>
  buildMetaQuery(id, 'COACH', 'COACH');

export const processUpsert = (entity: object): object =>
  R.pipe(R.pathOr({}, ['value']), addSK, addPartitionKey)(entity);

export const checkIfExits = R.ifElse(R.isEmpty, () => notfound('User does not exists'), accepted);
