import { APIGatewayProxyResult } from 'aws-lambda';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { error, success, ApplicationResponse, ok } from '../../../shared/util/HttpResponse';
import { buildMetaQuery } from '../../../shared/util/DynamoMeta';
import { queryItem } from '../../../shared/util/DynamoIO';
import { removeAttributes } from './common';

const process = async (): Promise<ApplicationResponse | ApplicationError> => {
  const queryIndividual = buildMetaQuery('INDIVIDUAL', 'FORMS', 'v0');
  const individualResult = await queryItem(queryIndividual);
  const individual = removeAttributes(individualResult);

  const queryTeam = buildMetaQuery('TEAM', 'FORMS', 'v0');
  const teamResult = await queryItem(queryTeam);
  const team = removeAttributes(teamResult);

  const result = [individual, team];
  return ok(result);
};

export const getAll = async (): Promise<APIGatewayProxyResult> =>
  process().then(success).catch(error);

export const handler = getAll;
