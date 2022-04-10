import { ProcessStatus, ProcessType } from '@beyond/lib/enums';
import { ValidAny } from '@beyond/lib/types';
import moment from 'moment';
import {
  buildMetaQuery,
  buildMetaQueryAllBegins,
  buildMetaUpdateSetItem,
  buildTransaction,
  buildTransactionItem,
  DynamoUpdateAction,
  DynamoUpdateItem,
} from '../../../shared/util/DynamoMeta';
import getCoachs from '../../../shared/api/coach/getCoachs';
import { insertTransaction, query, queryItem } from '../../../shared/util/DynamoIO';
import { TransactionActions } from '../../../shared/constants';
import { sendEmail } from '../../../shared/services/SimpleEmailService';
import { ReminderEmails } from './common';

const getPendingProcesses = async (coach: ValidAny) => {
  const filters = [
    {
      field: 'status',
      expression: '<=',
      value: ProcessStatus.Finished,
    },
  ];

  const queryToProcess = buildMetaQueryAllBegins(coach.PK, 'PROCESS#', 0, filters);
  const processes = await query(queryToProcess);
  return processes;
};

// const buildExpiredProcess = (item: ValidAny) => {
//   const updateItems: DynamoUpdateItem[] = [
//     {
//       action: DynamoUpdateAction.SET,
//       values: [{ name: 'status', value: ProcessStatus.Expired }],
//     },
//   ];

//   const key = {
//     PK: `PROCESS#${item}`,
//     SK: `#METADATA#${item}`,
//   };

//   const itemToProcess = buildMetaUpdateSetItem(key, updateItems);
//   return buildTransactionItem(itemToProcess, TransactionActions.Update);
// };

// const buildExpiredProcessForCoachs = (item: ValidAny, coach: ValidAny) => {
//   const updateItems: DynamoUpdateItem[] = [
//     {
//       action: DynamoUpdateAction.SET,
//       values: [{ name: 'status', value: ProcessStatus.Expired }],
//     },
//   ];

//   const key = {
//     PK: coach.PK,
//     SK: `PROCESS#${item.processId}`,
//   };

//   const itemToProcess = buildMetaUpdateSetItem(key, updateItems);
//   return buildTransactionItem(itemToProcess, TransactionActions.Update);
// };

// const buildExpiredProcessForCoachee = (email: ValidAny, processId: ValidAny) => {
//   const updateItems: DynamoUpdateItem[] = [
//     {
//       action: DynamoUpdateAction.SET,
//       values: [{ name: 'status', value: ProcessStatus.Expired }],
//     },
//   ];

//   const key = {
//     PK: `COACHEE#${email}`,
//     SK: `PROCESS#${processId}`,
//   };

//   const itemToProcess = buildMetaUpdateSetItem(key, updateItems);
//   return buildTransactionItem(itemToProcess, TransactionActions.Update);
// };

// const setProcessToExpired = async (item: ValidAny, coachs: ValidAny) => {
//   console.log('SET PROCESS TO EXPIRED:', item.processId);
//   const transactions = [buildExpiredProcess(item.processId)];

//   coachs.forEach((coach: ValidAny) => {
//     transactions.push(buildExpiredProcessForCoachs(item, coach));
//   });

//   const queryToProcess = buildMetaQuery(item.processId, 'PROCESS');
//   const process = await queryItem(queryToProcess);
//   if (process.type === ProcessType.SINGLE) {
//     const processCoacheeExpired = buildExpiredProcessForCoachee(process.owner, process.processId);
//     transactions.push(processCoacheeExpired);
//   } else {
//     process.collaborators.forEach((coachee: ValidAny) => {
//       const processCoacheeExpired = buildExpiredProcessForCoachee(coachee.email, process.processId);
//       transactions.push(processCoacheeExpired);
//     });
//   }

//   const transaction = buildTransaction(transactions);
//   await insertTransaction(transaction);
// };

const getUniqueEmails = (list: ValidAny) => {
  const seen = new Set();
  return list
    .filter((item: ValidAny) => {
      const { email } = item;
      return seen.has(email) ? false : seen.add(email);
    })
    .map((item: ValidAny) => item.email);
};

const sendEmails = async (item: ValidAny) => {
  const queryToProcess = buildMetaQuery(item.processId, 'PROCESS');
  const process = await queryItem(queryToProcess);

  const users = process.coachees.concat(process.collaborators);
  const emails = getUniqueEmails(users);

  /* eslint-disable */
  for (const userEmail of emails) {
    console.log('PROCESS TO SEND EMAIL', process.processId);
    console.log('SENDIN EMAIL TO: ', userEmail);
    try {
      await sendEmail(ReminderEmails, userEmail, {
        email: userEmail,
        process: process.processId,
        dueDate: moment(process.createdDate).utc().add('weeks', 2).format('DD-MM-YYYY'),
        text:
          process.type === ProcessType.SINGLE
            ? 'Piensa en al menos 5 personas que hayan trabajado contigo. Serán quienes nos den feedback sobre ti.'
            : 'Deberas incluir a todos los miembros de tu equipo para que participen del proceso.',
        processType: process.type,
      });
    } catch (ex) {
      console.log('ERROR SENDING EMAIL', ex.message);
    }
  }
  /* eslint-enable */
};

const buildSentEmailProcess = (item: ValidAny) => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [{ name: 'hasSentEmail', value: true }],
    },
  ];

  const key = {
    PK: `PROCESS#${item}`,
    SK: `#METADATA#${item}`,
  };

  const itemToProcess = buildMetaUpdateSetItem(key, updateItems);
  return buildTransactionItem(itemToProcess, TransactionActions.Update);
};

const buildSentEmailsProcessForCoachs = (item: ValidAny, coach: ValidAny) => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [{ name: 'hasSentEmail', value: true }],
    },
  ];

  const key = {
    PK: coach.PK,
    SK: `PROCESS#${item.processId}`,
  };

  const itemToProcess = buildMetaUpdateSetItem(key, updateItems);
  return buildTransactionItem(itemToProcess, TransactionActions.Update);
};

const buildSentEmailProcessForCoachee = (email: ValidAny, processId: ValidAny) => {
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values: [{ name: 'hasSentEmail', value: true }],
    },
  ];

  const key = {
    PK: `COACHEE#${email}`,
    SK: `PROCESS#${processId}`,
  };

  const itemToProcess = buildMetaUpdateSetItem(key, updateItems);
  return buildTransactionItem(itemToProcess, TransactionActions.Update);
};

const setProcessSentEmails = async (item: ValidAny, coachs: ValidAny) => {
  console.log('SET PROCESS TO SENT EMAILS:', item.processId);
  const transactions = [buildSentEmailProcess(item.processId)];

  coachs.forEach((coach: ValidAny) => {
    transactions.push(buildSentEmailsProcessForCoachs(item, coach));
  });

  const queryToProcess = buildMetaQuery(item.processId, 'PROCESS');
  const process = await queryItem(queryToProcess);
  if (process.type === ProcessType.SINGLE) {
    const processCoacheeSentEmail = buildSentEmailProcessForCoachee(
      process.owner,
      process.processId,
    );
    transactions.push(processCoacheeSentEmail);
  } else {
    process.collaborators.forEach((coachee: ValidAny) => {
      const processCoacheeSentEmail = buildSentEmailProcessForCoachee(
        coachee.email,
        process.processId,
      );
      transactions.push(processCoacheeSentEmail);
    });
  }

  const transaction = buildTransaction(transactions);
  await insertTransaction(transaction);
};

export const handler = async (): Promise<void> => {
  const coachs = await getCoachs();
  const [coach] = coachs;

  const pendingProcesses = await getPendingProcesses(coach);

  /* eslint-disable */
  for (const item of pendingProcesses) {
    if (moment(item.createdDate).add(3, 'days') < moment() && !item.hasSentEmail) {
      await sendEmails(item);
      await setProcessSentEmails(item, coachs);
    }
  }
  /* eslint-enable */
};
