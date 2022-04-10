import { AWSError } from 'aws-sdk';
import R from 'ramda';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ValidAny } from '@beyond/lib/types';
import { ApplicationError } from '../models/ApplicationError';

let dynamo = new DocumentClient({ apiVersion: '2012-08-10' });
if (process.env.ENV === 'dev') {
  // eslint-disable-next-line no-console
  console.log('Accesing Dynamo Local');

  dynamo = new DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8100',
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET',
  });
}

const getItemResult = async (
  params: DocumentClient.GetItemInput,
): Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>> => dynamo.get(params).promise();

const getQueryResult = async (
  params: DocumentClient.QueryInput,
): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> => dynamo.query(params).promise();

const getScanResult = async (
  params: DocumentClient.ScanInput,
): Promise<PromiseResult<DocumentClient.ScanOutput, AWSError>> => dynamo.scan(params).promise();

const getPutResult = async (
  params: DocumentClient.PutItemInput,
): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> => dynamo.put(params).promise();

const getUpdateResult = async (
  params: DocumentClient.UpdateItemInput,
): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>> =>
  dynamo.update(params).promise();

const getPutTransactionResult = async (
  params: DocumentClient.TransactWriteItemsInput,
): Promise<PromiseResult<DocumentClient.TransactWriteItemsOutput, AWSError>> =>
  dynamo.transactWrite(params).promise();

const getDeleteResult = async (
  params: DocumentClient.DeleteItemInput,
): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>> =>
  dynamo.delete(params).promise();

export const queryItem = async <T>(
  params: DocumentClient.GetItemInput,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | null | ApplicationError> => {
  const getItem = R.pathOr({}, ['Item']);
  return getItemResult(params).then(getItem);
};

export const query = async <T>(
  params: DocumentClient.QueryInput,
): Promise<ValidAny | null | ApplicationError> => {
  const getItems = R.pathOr([], ['Items']);
  return getQueryResult(params).then(getItems);
};

export const scan = async <T>(
  params: DocumentClient.ScanInput,
): Promise<ValidAny | null | ApplicationError> => {
  const getItems = R.pathOr([], ['Items']);
  return getScanResult(params).then(getItems);
};

export const insert = async (params: DocumentClient.PutItemInput): Promise<object> => {
  await getPutResult(params);
  return R.pathOr({}, ['Item'], params);
};

export const update = async (params: DocumentClient.UpdateItemInput): Promise<object> => {
  await getUpdateResult(params);
  return R.pathOr({}, ['Item'], params);
};

export const erase = async (params: DocumentClient.DeleteItemInput): Promise<object> => {
  await getDeleteResult(params);
  return R.pathOr({}, ['Key'], params);
};

export const insertTransaction = async (
  params: DocumentClient.TransactWriteItemsInput,
): Promise<object> => {
  await getPutTransactionResult(params);
  return R.pathOr({}, ['Item'], params);
};
