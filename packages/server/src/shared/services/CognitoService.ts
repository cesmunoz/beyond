import AWS from 'aws-sdk';
import { injectable } from 'inversify';
import { COGNITO_ROLE_KEY } from '@beyond/lib/constants';
import { UserType } from '@beyond/lib/types';
import * as interfaces from '../interfaces';

const { USER_POOL_ID, USER_POOL_CLIENT_ID } = process.env;

const DEFAULT_PASSWORD = 'TempPassword1!';

@injectable()
export default class CognitoService implements interfaces.services.CognitoService {
  async createUser(
    email: string,
    type: UserType,
  ): Promise<AWS.CognitoIdentityServiceProvider.UserType | undefined> {
    const cognito = new AWS.CognitoIdentityServiceProvider();

    // Create user
    const result = await cognito
      .adminCreateUser({
        Username: email.toLowerCase(),
        UserPoolId: USER_POOL_ID as string,
        TemporaryPassword: DEFAULT_PASSWORD,
        UserAttributes: [
          {
            Name: COGNITO_ROLE_KEY,
            Value: type,
          },
        ],
        MessageAction: 'SUPPRESS', // We don't want to send him an email.
      })
      .promise();

    return result.User;
  }

  async changePassword(email: string, password: string): Promise<void> {
    const cognito = new AWS.CognitoIdentityServiceProvider();

    // Do first login for password reset
    const { Session } = await cognito
      .adminInitiateAuth({
        UserPoolId: USER_POOL_ID as string,
        ClientId: USER_POOL_CLIENT_ID as string,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: email.toLowerCase(),
          PASSWORD: DEFAULT_PASSWORD,
        },
      })
      .promise();

    // Change user default password
    await cognito
      .respondToAuthChallenge({
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ClientId: USER_POOL_CLIENT_ID as string,
        ChallengeResponses: {
          USERNAME: email.toLowerCase(),
          NEW_PASSWORD: password,
        },
        Session,
      })
      .promise();
  }
}
