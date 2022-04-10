import { injectable, inject } from 'inversify';

import types from '../config/types';
import * as interfaces from '../interfaces';

@injectable()
export default class HelloController implements interfaces.controllers.HelloController {
  constructor(
    @inject(types.services.HelloService)
    private helloService: interfaces.services.HelloService,
  ) {}

  async hello(): Promise<object> {
    return this.helloService.hello();
  }
}
