import { HttpStatusCode } from '@beyond/lib/enums';

export class ApplicationError {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public content?: object | Array<object>,
  ) {}
}
