import { injectable } from 'inversify';
import { TEST } from '@beyond/lib/constants';
import * as interfaces from '../interfaces';

@injectable()
export default class HelloService implements interfaces.services.HelloService {
  async hello(): Promise<object> {
    return {
      message: 'Your function executed successfully!',
      type: TEST,
      time: new Date().toISOString(),
    };
  }
}
