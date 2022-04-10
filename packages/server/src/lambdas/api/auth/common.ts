import { ValidAny } from '@beyond/lib/types';
import Joi from '@hapi/joi';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import BaseModel from '../../../shared/models/BaseModel';

const { WEBSITE_URL, EMAIL_ADDRESS_SENDER } = process.env;

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  hashConfirm: Joi.string().required(),
});

export const validate = (entity: object): object => schema.validate(entity);

export const buildCoachCoacheePK = (email: string, coachEmail: string): BaseModel => ({
  PK: `COACH#${coachEmail}`,
  SK: `COACHEE#${email}`,
});

export const buildCoacheePK = (email: string): BaseModel => ({
  PK: `COACHEE#${email}`,
  SK: `#METADATA#${email}`,
});

export const buildRemoveCoacheeTTL = (
  { PK, SK }: BaseModel,
  confirmHash: string,
): DocumentClient.UpdateItemInput => {
  return {
    TableName: 'Beyond',
    Key: {
      PK,
      SK,
    },
    ExpressionAttributeNames: {
      '#ttl': 'ttl',
      '#confirmHash': 'confirmHash',
    },
    ExpressionAttributeValues: {
      ':confirmHash': confirmHash,
    },
    UpdateExpression: 'remove #ttl, #confirmHash',
    ConditionExpression:
      'attribute_exists(#ttl) AND attribute_exists(#confirmHash) AND #confirmHash = :confirmHash',
  };
};

export const setPasswordCoacheeEmailTemplate = ({ email }: ValidAny): object => ({
  Source: EMAIL_ADDRESS_SENDER,
  Destination: {
    ToAddresses: [email],
  },
  Template: 'SetPasswordCoachee',
  TemplateData: `{ "url": "${WEBSITE_URL}"  }`,
});
