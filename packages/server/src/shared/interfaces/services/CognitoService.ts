import AWS from 'aws-sdk';
import { UserType } from '@beyond/lib/types';

export default interface CognitoService {
  createUser(
    email: string,
    type: UserType,
  ): Promise<AWS.CognitoIdentityServiceProvider.UserType | undefined>;

  changePassword(email: string, password: string): Promise<void>;
}
