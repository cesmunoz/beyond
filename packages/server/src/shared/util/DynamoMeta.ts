import R from 'ramda';
import { DynamoDB } from 'aws-sdk';
import { ValidAny } from '@beyond/lib/types';
import { TransactionActions } from '../constants';

export const TableName = 'Beyond';

const KeyExistsExpression = 'attribute_exists(PK) AND attribute_exists(SK)';

export enum DynamoUpdateAction {
  SET = 'SET',
  REMOVE = 'REMOVE',
  ADD = 'ADD',
}

export type DynamoItem = {
  name: string;
  value: ValidAny;
  explicit?: string;
};

export type DynamoUpdateItem = {
  action: DynamoUpdateAction;
  values: DynamoItem[];
};

export const omitPkSk = R.omit(['PK', 'SK']);

export const buildMetaQuery = (
  id: string,
  partition: string,
  sortKey?: string,
): DynamoDB.DocumentClient.GetItemInput => {
  return {
    TableName,
    Key: {
      PK: `${partition}#${id}`,
      SK: sortKey || `#METADATA#${id}`,
    },
    ConsistentRead: true,
  };
};

export const buildScan = (indexName = ''): DynamoDB.DocumentClient.ScanInput => {
  const config: DynamoDB.DocumentClient.ScanInput = {
    TableName,
  };

  if (indexName) {
    config.IndexName = indexName;
  }

  return config;
};

export const buildMetaQueryAll = (
  partition: string,
  sortKey: string,
  indexName = '',
): DynamoDB.DocumentClient.QueryInput => {
  const config: DynamoDB.DocumentClient.QueryInput = {
    TableName,
    KeyConditionExpression: `${indexName}PK = :pk and begins_with(${indexName}SK, :sk)`,
    ExpressionAttributeValues: {
      ':pk': `${partition}`,
      ':sk': sortKey,
    },
  };

  if (indexName) {
    config.IndexName = indexName;
  }

  return config;
};

export type FilterAttribute = {
  field: string;
  expression?: string;
  value?: string | number | boolean;
  checkField?: string;
};

export const buildMetaQueryAllBegins = (
  partition: string,
  sortKey: string,
  limit: number,
  filterAttributes?: Array<FilterAttribute>,
): DynamoDB.DocumentClient.QueryInput => {
  const params: DynamoDB.DocumentClient.QueryInput = {
    TableName,
    KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': partition,
      ':sk': sortKey,
    },
  };

  if (limit) {
    params.Limit = limit;
  }

  if (filterAttributes) {
    params.ExpressionAttributeNames = {};
    let filterExpression = '';
    filterAttributes.forEach(item => {
      const expression = !item.checkField
        ? `#${item.field} ${item.expression} :${item.field}`
        : `${item.checkField}(#${item.field})`;
      filterExpression += filterExpression === '' ? expression : ` and ${expression} `;
      params.ExpressionAttributeNames![`#${item.field}`] = item.field;

      if (!item.checkField) {
        params.ExpressionAttributeValues![`:${item.field}`] = item.value;
      }
    });

    params.FilterExpression = filterExpression;
  }

  return params;
};

export const buildMetaPutItem = (item: object): DynamoDB.DocumentClient.PutItemInput => {
  return {
    TableName,
    Item: item,
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
    ReturnValues: 'ALL_OLD',
  };
};

export const buildConditionCheckItem = (key: object): DynamoDB.DocumentClient.TransactWriteItem => {
  return {
    ConditionCheck: {
      TableName,
      Key: key,
      ConditionExpression: KeyExistsExpression,
    },
  };
};

export const buildMetaUpdateItem = (item: object): DynamoDB.DocumentClient.PutItemInput => {
  return {
    TableName,
    Item: item,
    ConditionExpression: KeyExistsExpression,
    ReturnValues: 'ALL_OLD',
  };
};

export const buildMetaUpdateSetItem = (
  key: object,
  items: DynamoUpdateItem[],
  isCountOperation?: boolean,
): DynamoDB.DocumentClient.UpdateItemInput => {
  let UpdateExpression = '';
  const ExpressionAttributeValues: DynamoDB.DocumentClient.ExpressionAttributeValueMap = {};
  const ExpressionAttributeNames: DynamoDB.DocumentClient.ExpressionAttributeValueMap = {};

  items.forEach(item => {
    UpdateExpression += ` ${item.action} `;
    item.values.forEach((valueItem, valueIndex) => {
      const expressionEnding = `${valueIndex !== item.values.length - 1 ? ',' : ''}`;

      if (valueItem.explicit) {
        UpdateExpression += `${valueItem.explicit} = :${valueItem.name} ${expressionEnding}`;
        ExpressionAttributeValues[`:${valueItem.name}`] = valueItem.value;
      } else {
        const updateExpression = isCountOperation
          ? `#${valueItem.name} = #${valueItem.name} + :${valueItem.name}`
          : `#${valueItem.name} = :${valueItem.name}`;
        UpdateExpression += `${updateExpression} ${expressionEnding}`;
        ExpressionAttributeNames[`#${valueItem.name}`] = valueItem.name;
        ExpressionAttributeValues[`:${valueItem.name}`] = valueItem.value;
      }
    });
  });

  return {
    TableName,
    Key: key,
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'UPDATED_NEW',
  };
};

export const buildMetaDeleteItem = (key: object): DynamoDB.DocumentClient.DeleteItemInput => {
  return {
    TableName,
    Key: key,
  };
};

export const buildTransactionItem = (
  item: object,
  action: TransactionActions,
): DynamoDB.DocumentClient.TransactWriteItem => ({
  [action]: item,
});

export const buildTransaction = (
  items: DynamoDB.DocumentClient.TransactWriteItemList,
): DynamoDB.DocumentClient.TransactWriteItemsInput => ({
  TransactItems: items,
});

export const getKeyValue = (data: string): string => data.split('#')[1];
