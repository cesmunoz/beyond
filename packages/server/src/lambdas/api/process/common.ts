import Joi from '@hapi/joi';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ProcessType, ProcessStatus } from '@beyond/lib/enums';

import { UserType, ValidAny } from '@beyond/lib/types';
import { CollaboratorRequest } from '@beyond/lib/types/processes';
import moment from 'moment';
import {
  DynamoUpdateItem,
  DynamoUpdateAction,
  buildTransactionItem,
  buildMetaUpdateSetItem,
} from '../../../shared/util/DynamoMeta';
import { TransactionActions } from '../../../shared/constants';
import { buildProcessTypeText } from '../../../shared/util';

const { WEBSITE_URL, EMAIL_ADDRESS_SENDER } = process.env;

const schema = Joi.object({
  coachees: Joi.array()
    .items(
      Joi.object({
        email: Joi.string().required(),
        fullName: Joi.string().required(),
        company: Joi.string().optional(),
      }),
    )
    .required(),
  type: Joi.allow(ProcessType.SINGLE, ProcessType.TEAM).required(),
});

const answersSchema = Joi.object({
  personalInfo: Joi.object({
    birthDate: Joi.string().required(),
    birthTime: Joi.string().required(),
    city: Joi.string().required(),
    company: Joi.string().required(),
    education: Joi.string().required(),
    fullName: Joi.string().required(),
    role: Joi.string().required(),
    seniority: Joi.string().required,
  }).required(),
  expectation: Joi.string().required(),
  formType: Joi.allow(ProcessType.SINGLE, ProcessType.TEAM).required(),
  formVersion: Joi.number().required,
  questionnaire: Joi.object().required(),
  collaborators: Joi.array().items(
    Joi.object({
      email: Joi.string().required(),
      role: Joi.string().required(),
    }),
  ),
});

export const updateProcessForUser = (
  type: UserType,
  email: string,
  processId: string,
  status: ProcessStatus,
  collaborators?: CollaboratorRequest[],
): DocumentClient.TransactWriteItem => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [
        { name: 'status', value: status },
        { name: 'updatedDate', value: moment.utc().format() },
      ],
    },
  ];

  if (collaborators) {
    updateItems[0].values.push({
      name: 'collaborators',
      value: collaborators,
    });
  }

  const key = {
    PK: `${type}#${email}`,
    SK: `PROCESS#${processId}`,
  };

  return buildTransactionItem(buildMetaUpdateSetItem(key, updateItems), TransactionActions.Update);
};

export const validate = (entity: object): object => schema.validate(entity);
export const validateAnswers = (entity: object): object => answersSchema.validate(entity);

export const FinishedAnswersCoach = ({
  email,
  process,
  coachee,
  processType,
}: ValidAny): object => ({
  Source: EMAIL_ADDRESS_SENDER,
  Destination: {
    ToAddresses: [email],
  },
  Template: 'FinishedAnswersCoach',
  TemplateData: `{ "url": "${WEBSITE_URL}", "processId":"${process}", "coachee": "${coachee}", "dueDate":"${moment
    .utc()
    .add(20, 'days')
    .format('DD-MM-YYYY')}", "processType":"${buildProcessTypeText(processType)}" }`,
});

export const ReminderEmails = ({
  email,
  process,
  dueDate,
  text,
  processType,
}: ValidAny): object => ({
  Source: EMAIL_ADDRESS_SENDER,
  Destination: {
    ToAddresses: [email],
  },
  Template: 'ReminderProcess',
  TemplateData: `{ "url": "${WEBSITE_URL}", "process": "${process}", "dueDate": "${dueDate}", "text": "${text}", "processType": "${buildProcessTypeText(
    processType,
  )}" }`,
});
