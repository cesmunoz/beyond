import { S3 } from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import { COACH, COACHEE } from '@beyond/lib/constants';

import { buildMetaQuery } from '../../../shared/util/DynamoMeta';
import { queryItem } from '../../../shared/util/DynamoIO';
import { ApplicationError } from '../../../shared/models/ApplicationError';
import { error, success, ok, ApplicationResponse } from '../../../shared/util/HttpResponse';
import withAuth, { AuthAPIGatewayProxyEvent } from '../../../shared/middlewares/withAuth';

const s3 = new S3({ signatureVersion: 'v4' });

const baseS3Params = {
  Bucket: 'beyond-processes',
  Expires: 3600,
};

const get = async ({
  role,
  email,
}: AuthAPIGatewayProxyEvent): Promise<ApplicationResponse | ApplicationError> => {
  const isCoach = role === COACH;

  const pk = isCoach ? `COACH` : `COACHEE`;

  const queryUser = buildMetaQuery(email, pk);
  const result = await queryItem(queryUser);

  const profileImgKey = `${result.email}/profile-image.png`;

  result.profileImgUploadUrl = await s3.getSignedUrlPromise('putObject', {
    ...baseS3Params,
    Key: profileImgKey,
  });

  if (result.avatarUrl) {
    result.avatarUrl = await s3.getSignedUrlPromise('getObject', {
      ...baseS3Params,
      Key: profileImgKey,
    });
  }

  return ok(result);
};

export const getUser = async (event: AuthAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
  get(event).then(success).catch(error);

export const handler = withAuth(getUser, [COACH, COACHEE]);
