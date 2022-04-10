import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
  buildTransactionItem,
  DynamoUpdateItem,
  DynamoUpdateAction,
  buildMetaUpdateSetItem,
} from '../../../shared/util/DynamoMeta';
import { TransactionActions } from '../../constants';

type UpdateSummaryInput = 'coachees' | 'pendingAnswers' | 'pendingReview' | 'finished';

const updateSummary = (type: UpdateSummaryInput): DocumentClient.TransactWriteItem => {
  const values = [{ name: type, value: 1 }];

  if (type === 'pendingReview') {
    values.push({ name: 'pendingAnswers', value: -1 });
  }

  if (type === 'finished') {
    values.push({ name: 'pendingReview', value: -1 });
  }
  const updateItems: DynamoUpdateItem[] = [
    {
      action: DynamoUpdateAction.SET,
      values,
    },
  ];

  const key = {
    PK: 'SUMMARY#SUMMARY',
    SK: 'SUMMARY',
  };

  const updateItem = buildMetaUpdateSetItem(key, updateItems, true);
  return buildTransactionItem(updateItem, TransactionActions.Update);
};

export default updateSummary;
