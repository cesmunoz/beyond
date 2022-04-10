import 'reflect-metadata';
import { Container } from 'inversify';

import types from './types';
import * as interfaces from '../interfaces';

import HelloController from '../controllers/HelloController';
import UserController from '../controllers/UserController';
import HelloService from '../services/HelloService';
import CognitoService from '../services/CognitoService';

const container = new Container();

// Controllers
container
  .bind<interfaces.controllers.HelloController>(types.controllers.HelloController)
  .to(HelloController);
container
  .bind<interfaces.controllers.UserController>(types.controllers.UserController)
  .to(UserController);

// Services
container.bind<interfaces.services.HelloService>(types.services.HelloService).to(HelloService);
container
  .bind<interfaces.services.CognitoService>(types.services.CognitoService)
  .to(CognitoService);

// Repositories
export default { container, types };
