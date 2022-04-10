import { injectable, inject } from 'inversify';

import { COACH } from '@beyond/lib/constants';
import types from '../config/types';
import * as interfaces from '../interfaces';

@injectable()
export default class UserController implements interfaces.controllers.UserController {
  constructor(
    @inject(types.services.CognitoService)
    private cognitoService: interfaces.services.CognitoService,
  ) {}

  async createAdmin(email: string): Promise<void> {
    await this.cognitoService.createUser(email, COACH);
  }
}
