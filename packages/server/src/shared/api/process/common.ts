import ksuid from 'ksuid';

import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
  CollaboratorRequest,
  PersonalInfoRequest,
  ProcessFormData,
} from '@beyond/lib/types/processes';
import { ProcessType, ProcessStatus } from '@beyond/lib/enums';

import { UserType, ValidAny } from '@beyond/lib/types';
import moment from 'moment';
import {
  buildMetaQuery,
  DynamoUpdateItem,
  DynamoUpdateAction,
  buildTransactionItem,
  buildMetaUpdateSetItem,
} from '../../../shared/util/DynamoMeta';
import { Process } from '../../../shared/models/Process';
import { TransactionActions } from '../../../shared/constants';
import { buildProcessTypeText } from '../../util';

const { WEBSITE_URL, EMAIL_ADDRESS_SENDER } = process.env;

export const updateProcessForUser = (
  type: UserType,
  email: string,
  processId: string,
  status: ProcessStatus,
  evaluatorIndex?: number,
  personalInfo?: PersonalInfoRequest,
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

  if (evaluatorIndex !== undefined && personalInfo) {
    updateItems[0].values.push({
      name: 'collabInfo',
      explicit: `collaborators[${evaluatorIndex}].personalInfo`,
      value: personalInfo,
    });
  }

  const key = {
    PK: `${type}#${email}`,
    SK: `PROCESS#${processId}`,
  };

  return buildTransactionItem(buildMetaUpdateSetItem(key, updateItems), TransactionActions.Update);
};

export const buildCoachQuery = (id: string): DocumentClient.GetItemInput =>
  buildMetaQuery(id, 'METADATA', 'METADATA');

export const generateProcessId = (): string => ksuid.randomSync().string;

export const processInsert = (id: string, entity: ProcessFormData): Process => {
  return {
    processId: id,
    type: entity.type,
    formVersion: 1,
    coachees: entity.coachees,
    status: ProcessStatus.PendingAnswers,
    PK: `PROCESS#${id}`,
    SK: `#METADATA#${id}`,
    form: [],
    collaborators: entity.type === ProcessType.TEAM ? entity.coachees : [],
    createdDate: moment.utc().format(),
    owner: entity.coachees[0].email,
  };
};

export const buildProcessForUser = (
  processId: string,
  processData: ProcessFormData,
  type: UserType,
  email: string,
  collaborators?: CollaboratorRequest[],
): Process => {
  return {
    processId,
    type: processData.type,
    coachees: processData.coachees,
    status: ProcessStatus.PendingAnswers,
    PK: `${type}#${email}`,
    SK: `PROCESS#${processId}`,
    createdDate: moment.utc().format(),
    collaborators: collaborators || processData.coachees,
  };
};

export const newProcessEmailTemplate = ({
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
  Template: 'NewProcessTemplate',
  TemplateData: `{ "url": "${WEBSITE_URL}", "process": "${process}", "dueDate": "${dueDate}", "text": "${text}", "processType": "${buildProcessTypeText(
    processType,
  )}"}`,
});

export const collaboratorProcessEmailTemplate = ({
  email,
  process,
  dueDate,
  coachee,
}: ValidAny): object => ({
  Source: EMAIL_ADDRESS_SENDER,
  Destination: {
    ToAddresses: [email],
  },
  Template: 'CollaboratorProcess',
  TemplateData: `{ "url": "${WEBSITE_URL}", "process":"${process}", "dueDate": "${dueDate}", "email": "${email}", "coachee": "${coachee}"  }`,
});

export const updateCoacheePersonalInfo = (
  pk: string,
  sk: string,
  personalInfo: PersonalInfoRequest,
): DocumentClient.TransactWriteItem => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [
        { name: 'fullName', value: personalInfo.fullName },
        { name: 'company', value: personalInfo.company },
        { name: 'birthDate', value: personalInfo.birthDate },
        { name: 'birthTime', value: personalInfo.birthTime },
        { name: 'country', value: personalInfo.country },
        { name: 'city', value: personalInfo.city },
        { name: 'education', value: personalInfo.education },
        { name: 'workRole', value: personalInfo.role },
        { name: 'seniority', value: personalInfo.seniority },
      ],
    },
  ];

  const key = {
    PK: pk,
    SK: sk,
  };

  return buildTransactionItem(buildMetaUpdateSetItem(key, updateItems), TransactionActions.Update);
};
