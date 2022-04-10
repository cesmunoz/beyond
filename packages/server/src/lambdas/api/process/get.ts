import { S3 } from 'aws-sdk';
import moment from 'moment';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { COACH, COACHEE } from '@beyond/lib/constants';
import { ValidAny } from '@beyond/lib/types';
import { ProcessStatus } from '@beyond/lib/enums';
import { getId } from '../../../shared/util/AwsLambda';
import withAuth, { AuthAPIGatewayProxyEvent } from '../../../shared/middlewares/withAuth';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { buildMetaQuery } from '../../../shared/util/DynamoMeta';
import { queryItem } from '../../../shared/util/DynamoIO';
import { error, success, ApplicationResponse, ok } from '../../../shared/util/HttpResponse';

const s3 = new S3({ signatureVersion: 'v4' });

const baseS3Params = {
  Bucket: 'beyond-processes',
  Expires: 3600,
};

const getAlreadyAnswered = (email: string, process: ValidAny): boolean => {
  if (process.owner === email) {
    return process.status >= ProcessStatus.WaitingEvaluators;
  }

  const collaborator = process.collaborators?.find((c: ValidAny) => c.email === email);

  if (!collaborator) {
    throw new Error('Invalid collaborator email');
  }

  return collaborator.answers && !!Object.keys(collaborator.answers).length;
};

const process = async (
  event: AuthAPIGatewayProxyEvent,
): Promise<ApplicationResponse | ApplicationError> => {
  const id = getId(event);
  const queryToProcess = buildMetaQuery(id, 'PROCESS');
  const queryResult = await queryItem(queryToProcess);

  const { role, email } = event;

  const alreadyAnswered = role === COACH ? false : getAlreadyAnswered(email, queryResult);

  const processItem = {
    ...queryResult,
    alreadyAnswered,
  };

  if (!processItem.report) {
    return ok(processItem);
  }

  processItem.report = await s3.getSignedUrlPromise('getObject', {
    ...baseS3Params,
    Key: processItem.report,
  });

  const coacheeEmail = processItem.coachees[0].email;

  if (role === COACH) {
    const fileName = `${coacheeEmail}/${
      processItem.processId
    }/Proceso-final-${coacheeEmail}-${moment().format('DD-MM-YYYY')}.pdf`;

    processItem.reportPdfUploadUrl = await s3.getSignedUrlPromise('putObject', {
      ...baseS3Params,
      Key: fileName,
      Metadata: { processId: id },
    });
  }

  if (processItem.reportPdf) {
    processItem.reportPdf = await s3.getSignedUrlPromise('getObject', {
      ...baseS3Params,
      Key: decodeURIComponent(processItem.reportPdf),
    });
  }

  return ok(processItem);
};

const getProcessForEvaluator = async (
  event: APIGatewayProxyEvent,
): Promise<ApplicationResponse | ApplicationError> => {
  const id = getId(event);
  const queryToProcess = buildMetaQuery(id, 'PROCESS');
  const queryResult = await queryItem(queryToProcess);

  const alreadyAnswered = getAlreadyAnswered(event.pathParameters?.email || '', queryResult);

  return ok({
    processId: queryResult.processId,
    alreadyAnswered,
  });
};

export const getById = async (event: AuthAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  process(event).then(success).catch(error);

export const handler = withAuth(getById, [COACH, COACHEE]);

export const getByIdForEvaluator = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => getProcessForEvaluator(event).then(success).catch(error);
