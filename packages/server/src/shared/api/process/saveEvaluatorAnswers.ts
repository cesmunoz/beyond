import {
  EvaluatorAnswersRequest,
  PersonalInfoRequest,
  ProcessAnswerList,
} from '@beyond/lib/types/processes';
import moment from 'moment';
import { ValidAny } from '@beyond/lib/types';
import { ProcessStatus, ProcessType } from '@beyond/lib/enums';
import { COACH, COACHEE } from '@beyond/lib/constants';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import updateSummary from '../../../shared/api/summary/updateSummary';
import getCoachs from '../../../shared/api/coach/getCoachs';
import { invoke } from '../../../shared/util/AwsLambda';
import { badRequest } from '../../../shared/util/HttpResponse';
import {
  getKeyValue,
  buildTransaction,
  buildTransactionItem,
  DynamoUpdateItem,
  DynamoUpdateAction,
  buildMetaUpdateSetItem,
} from '../../../shared/util/DynamoMeta';
import { insertTransaction } from '../../../shared/util/DynamoIO';
import { updateCoacheePersonalInfo, updateProcessForUser } from './common';
import { TransactionActions } from '../../../shared/constants';

const { GENERATE_EXCEL_LAMBDA } = process.env;

const processUpdateAnswers = (
  id: string,
  status: ProcessStatus,
  evaluatorIndex: number,
  answers: ProcessAnswerList,
  personalInfo?: PersonalInfoRequest,
): DocumentClient.UpdateItemInput => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [
        { name: 'status', value: status },
        { name: 'updatedDate', value: moment.utc().format() },
        {
          name: 'collabAnswers',
          explicit: `collaborators[${evaluatorIndex}].answers`,
          value: answers,
        },
      ],
    },
  ];

  if (personalInfo) {
    updateItems[0].values.push({
      name: 'collabInfo',
      explicit: `collaborators[${evaluatorIndex}].personalInfo`,
      value: personalInfo,
    });
  }

  const key = {
    PK: `PROCESS#${id}`,
    SK: `#METADATA#${id}`,
  };

  return buildMetaUpdateSetItem(key, updateItems);
};

export const saveUserAnswers = async (
  body: EvaluatorAnswersRequest,
  process: ValidAny,
  email: string,
  personalInfo?: PersonalInfoRequest,
): Promise<ValidAny> => {
  const collaborators = process.collaborators as ValidAny[];

  const collaborator = collaborators.find(c => c.email === email);

  if (!collaborator) {
    return badRequest(`Invalid evaluator email: ${email}`);
  }

  if (collaborator.answers && !!Object.keys(collaborator.answers).length) {
    return badRequest(`Evaluator has already answered the questionnaire`);
  }

  const evaluatorIndex = collaborators.findIndex(c => c.email === email);
  const processCompleted = collaborators.filter(c => c.email !== email).every(c => !!c.answers);
  const processStatus = processCompleted
    ? ProcessStatus.PendingReview
    : ProcessStatus.WaitingEvaluators;

  const itemToProcess = processUpdateAnswers(
    process.processId,
    processStatus,
    evaluatorIndex,
    body.questionnaire,
    personalInfo,
  );
  const updateItem = buildTransactionItem(itemToProcess, TransactionActions.Update);
  const transactions = [updateItem];

  const coachs = await getCoachs();

  coachs.forEach(coach => {
    const coachEmail = getKeyValue(coach.PK);
    transactions.push(
      updateProcessForUser(
        COACH,
        coachEmail,
        process.processId,
        processStatus,
        evaluatorIndex,
        personalInfo,
      ),
    );

    if (personalInfo) {
      transactions.push(
        updateCoacheePersonalInfo(`COACH#${coachEmail}`, `COACHEE#${email}`, personalInfo),
      );
    }
  });

  if (process.type === ProcessType.TEAM) {
    const coachees = collaborators.map(c => c.email);

    coachees.forEach(coachee => {
      transactions.push(updateProcessForUser(COACHEE, coachee, process.processId, processStatus));
    });
  } else {
    transactions.push(
      updateProcessForUser(COACHEE, process.coachees[0].email, process.processId, processStatus),
    );
  }

  if (personalInfo) {
    transactions.push(
      updateCoacheePersonalInfo(`COACHEE#${email}`, `#METADATA#${email}`, personalInfo),
    );
  }

  if (processStatus === ProcessStatus.PendingReview) {
    transactions.push(updateSummary('pendingReview'));
  }

  const transaction = buildTransaction(transactions);

  const result = await insertTransaction(transaction);

  if (processStatus === ProcessStatus.PendingReview) {
    await invoke(GENERATE_EXCEL_LAMBDA as string, { processId: process.processId });
  }

  return result;
};
