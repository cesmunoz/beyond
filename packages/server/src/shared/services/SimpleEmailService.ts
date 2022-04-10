import { SES, AWSError } from 'aws-sdk';
import { ValidAny } from '@beyond/lib/types';
import { PromiseResult } from 'aws-sdk/lib/request';

const ses = new SES({ apiVersion: '2010-12-01' });

const { EMAIL_ENABLED } = process.env;

const send = async (
  params: SES.SendTemplatedEmailRequest,
): Promise<PromiseResult<SES.SendEmailResponse, AWSError>> =>
  ses.sendTemplatedEmail(params).promise();

export const sendEmail = async (
  templateFn: Function,
  email: string,
  content: ValidAny,
): Promise<void> => {
  const emailContent = templateFn(content);
  if (EMAIL_ENABLED || EMAIL_ENABLED === 'true') {
    await send(emailContent);
  }
};
