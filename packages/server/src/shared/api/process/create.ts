import { ProcessFormData } from '@beyond/lib/types/processes';

import { COACH, COACHEE } from '@beyond/lib/constants';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { ProcessStatus, ProcessType } from '@beyond/lib/enums';
import moment from 'moment';
import { ValidAny } from '@beyond/lib/types';
import updateSummary from '../../../shared/api/summary/updateSummary';
import { TransactionActions } from '../../../shared/constants';
import {
  buildMetaPutItem,
  buildTransactionItem,
  buildTransaction,
  getKeyValue,
  DynamoUpdateItem,
  buildMetaUpdateSetItem,
  DynamoUpdateAction,
} from '../../../shared/util/DynamoMeta';
import { insertTransaction } from '../../../shared/util/DynamoIO';
import {
  processInsert,
  generateProcessId,
  buildProcessForUser,
  newProcessEmailTemplate,
} from './common';
import getCoachs from '../../../shared/api/coach/getCoachs';
import { getCoachee } from '../coachee/get';
import { sendEmail } from '../../../shared/services/SimpleEmailService';

const buildProcessForCoachs = async (
  processId: string,
  payload: ProcessFormData,
): Promise<DocumentClient.TransactWriteItemList> => {
  const coachs = await getCoachs();
  return coachs.map(coach => {
    const dynamoItem = buildProcessForUser(processId, payload, COACH, getKeyValue(coach.PK));
    const item = buildMetaPutItem(dynamoItem);
    return buildTransactionItem(item, TransactionActions.Put);
  });
};

const buildProcessForCoachee = (
  processId: string,
  payload: ProcessFormData,
): DocumentClient.TransactWriteItemList => {
  const [coachee] = payload.coachees;

  const dynamoItem = buildProcessForUser(processId, payload, COACHEE, coachee.email);
  const item = buildMetaPutItem(dynamoItem);
  return [buildTransactionItem(item, TransactionActions.Put)];
};

const buildProcess = (
  processId: string,
  payload: ProcessFormData,
): DocumentClient.TransactWriteItem => {
  const dynamoItem = processInsert(processId, payload);
  const item = buildMetaPutItem(dynamoItem);
  return buildTransactionItem(item, TransactionActions.Put);
};

const setCoacheeLastProcessDate = (email: string): DocumentClient.UpdateItemInput => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [{ name: 'lastProcessDate', value: moment.now() }],
    },
  ];

  const key = {
    PK: `COACHEE#${email}`,
    SK: `#METADATA#${email}`,
  };

  return buildMetaUpdateSetItem(key, updateItems);
};

const createProcess = async (body: ProcessFormData): Promise<ValidAny> => {
  const processId = generateProcessId();

  const transactions = [
    buildProcess(processId, body),
    ...(await buildProcessForCoachs(processId, body)),
    ...buildProcessForCoachee(processId, body),
    updateSummary('pendingAnswers'),
  ];

  if (body.type === ProcessType.SINGLE) {
    const updateTransaction = buildTransactionItem(
      setCoacheeLastProcessDate(body.coachees[0].email),
      TransactionActions.Update,
    );
    transactions.push(updateTransaction);
  } else {
    const mainCoachee = await getCoachee(body.coachees[0].email);

    if (
      !mainCoachee.lastProcessDate ||
      (mainCoachee.lastProcessDate &&
        Math.abs(moment(mainCoachee.lastProcessDate).diff(moment.now(), 'days')) > 60)
    ) {
      await createProcess({
        type: ProcessType.SINGLE,
        coachees: [
          {
            email: mainCoachee.email,
            fullName: mainCoachee.fullName,
            company: mainCoachee.company,
          },
        ],
      });
    }
  }

  const transaction = buildTransaction(transactions);
  await insertTransaction(transaction);

  const [coachee] = body.coachees;

  await sendEmail(newProcessEmailTemplate, coachee.email, {
    email: coachee.email,
    process: processId,
    dueDate: moment.utc().add('weeks', 2).format('DD-MM-YYYY'),
    text:
      body.type === ProcessType.SINGLE
        ? 'Piensa en al menos 5 personas que hayan trabajado contigo. Serán quienes nos den feedback sobre ti.'
        : 'Deberas incluir a todos los miembros de tu equipo para que participen del proceso.',
    processType: body.type,
  });

  return { ...body, status: ProcessStatus.PendingAnswers, processId };
};

export default createProcess;
