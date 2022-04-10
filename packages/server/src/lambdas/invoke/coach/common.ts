import Joi from '@hapi/joi';
import R from 'ramda';

const coachEmail = R.pathOr('', ['email']);

const schema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  fullName: Joi.string().required(),
});

export const validate = (entity: object): object => schema.validate(entity);

export const addPK = (email: string, entity: object, key = 'PK'): object =>
  R.assoc(key, `COACH#${email}`, entity);

export const addSK = (email: string, entity: object, key = 'SK'): object =>
  R.assoc(key, `#METADATA#${email}`, entity);

const addPartitionKey = (entity: object): object => {
  const coach = coachEmail(entity);
  const withPK = addPK(coach, entity);
  const withSK = addSK(coach, withPK);
  const withGSPK = addPK(coach, withSK, 'GS1PK');
  const withGSSK = addSK(coach, withGSPK, 'GS1SK');

  return withGSSK;
};

export const processUpsert = (entity: object): object => R.pipe(addPartitionKey)(entity);
