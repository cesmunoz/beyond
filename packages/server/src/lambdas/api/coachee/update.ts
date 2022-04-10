import { APIGatewayProxyResult } from 'aws-lambda';
import { HttpStatusCode } from '@beyond/lib/enums';
import { success } from '../../../shared/util/HttpResponse';
import { ApplicationSuccess } from '../../../shared/models/ApplicationSuccess';

export const handler = async (): Promise<APIGatewayProxyResult> =>
  success(new ApplicationSuccess({}, HttpStatusCode.OK));
