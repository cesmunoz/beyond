import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import R from 'ramda';
import { ApplicationResponse, created, success, error } from '../../../shared/util/HttpResponse';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import questionnaireIndividual from './seeds/questionaire-individual.json';
import questionnaireTeam from './seeds/questionaire-team.json';
import {
  buildMetaQuery,
  buildMetaUpdateItem,
  buildTransactionItem,
  buildMetaPutItem,
  buildTransaction,
} from '../../../shared/util/DynamoMeta';
import { queryItem, insertTransaction } from '../../../shared/util/DynamoIO';
import { TransactionActions } from '../../../shared/constants';

const INIT_VERSION = 0;
const FIRST_VERSION = 1;

const updateVersion = async (type: string) => {
  const query = buildMetaQuery(type, 'FORMS', 'v0');
  const queryResult = await queryItem(query);

  const newVersion =
    (R.isEmpty(queryResult) ? INIT_VERSION : queryResult.currentVersion) + FIRST_VERSION;
  const questionnaire = type === 'INDIVIDUAL' ? questionnaireIndividual : questionnaireTeam;

  const transactions = [];
  const itemNewVersion = buildMetaPutItem({
    ...questionnaire,
    SK: `v${newVersion}`,
    currentVersion: newVersion,
  });

  const versionZero = {
    ...questionnaire,
    currentVersion: newVersion,
  };

  const itemVersionZero =
    newVersion === FIRST_VERSION ? buildMetaPutItem(versionZero) : buildMetaUpdateItem(versionZero);

  const transactNewVersion = buildTransactionItem(itemNewVersion, TransactionActions.Put);
  const transactVersionZero = buildTransactionItem(itemVersionZero, TransactionActions.Put);
  transactions.push(transactNewVersion);
  transactions.push(transactVersionZero);

  const transaction = buildTransaction(transactions);

  await insertTransaction(transaction);
};

const process = async (): Promise<ApplicationResponse | ApplicationError> => {
  await updateVersion('INDIVIDUAL');
  await updateVersion('TEAM');

  return created({
    message: 'Operation Successful',
  });
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  process().then(success).catch(error);
