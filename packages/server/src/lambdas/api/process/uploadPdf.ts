import { S3Event } from 'aws-lambda';
import moment from 'moment';
import { ProcessStatus, ProcessType } from '@beyond/lib/enums';
import { ValidAny } from '@beyond/lib/types';
import updateSummary from '../../../shared/api/summary/updateSummary';
import getCoachs from '../../../shared/api/coach/getCoachs';
import {
  buildMetaQuery,
  DynamoUpdateAction,
  buildMetaUpdateSetItem,
  buildTransactionItem,
  buildTransaction,
  DynamoUpdateItem,
} from '../../../shared/util/DynamoMeta';
import { queryItem, insertTransaction } from '../../../shared/util/DynamoIO';
import { TransactionActions } from '../../../shared/constants';

const processUpdateAnswers = (
  pk: string,
  sk: string,
  reportUrl: string,
  includeReport?: boolean,
): object => {
  const values = [
    { name: 'status', value: ProcessStatus.Finished },
    { name: 'finishedDate', value: moment().format('DD-MM-YYYY') },
  ];

  if (includeReport) {
    values.push({ name: 'reportPdf', value: reportUrl });
  }

  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values,
    },
  ];

  const key = {
    PK: pk,
    SK: sk,
  };

  return buildMetaUpdateSetItem(key, updateItems);
};

export const handler = async (event: S3Event): Promise<void> => {
  const { key } = event.Records[0].s3.object;
  const id = key.split('/')[1];

  const queryToProcess = buildMetaQuery(id, 'PROCESS');
  const coacheeProcess = (await queryItem(queryToProcess)) as ValidAny;

  if (!coacheeProcess) {
    console.log(`No se encontro el proceso con id ${id} `);
    return;
  }

  // Update process for coachs
  const coachs = await getCoachs();
  const transactions = coachs.map(coach => {
    const itemToProcess = processUpdateAnswers(`COACH#${coach.email}`, `PROCESS#${id}`, key);
    return buildTransactionItem(itemToProcess, TransactionActions.Update);
  });

  if (coacheeProcess.type === ProcessType.TEAM) {
    const collaborators = coacheeProcess.collaborators as ValidAny[];
    const coachees = collaborators.map((c: ValidAny) => c.email as string);

    coachees.forEach(coachee => {
      transactions.push(
        buildTransactionItem(
          processUpdateAnswers(`COACHEE#${coachee}`, `PROCESS#${id}`, key),
          TransactionActions.Update,
        ),
      );
    });
  } else {
    const coacheeEmail = coacheeProcess.coachees[0].email;

    // Update process for coachee
    transactions.push(
      buildTransactionItem(
        processUpdateAnswers(`COACHEE#${coacheeEmail}`, `PROCESS#${id}`, key),
        TransactionActions.Update,
      ),
    );
  }

  console.log(`Updating process: ${id}`);
  const itemToProcess = processUpdateAnswers(`PROCESS#${id}`, `#METADATA#${id}`, key, true);
  const updateItem = buildTransactionItem(itemToProcess, TransactionActions.Update);

  transactions.push(updateItem);

  transactions.push(updateSummary('finished'));

  const transaction = buildTransaction(transactions);
  await insertTransaction(transaction);
  console.log(`Process done for id: ${id}`);
};
