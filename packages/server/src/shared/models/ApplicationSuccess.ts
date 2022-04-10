import { HttpStatusCode } from '@beyond/lib/enums';

export class ApplicationSuccess {
  constructor(
    public content: object | Array<object>,
    public statusCode: HttpStatusCode = HttpStatusCode.OK,
  ) {}
}
