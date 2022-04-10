import jestPlugin from 'serverless-jest-plugin';
import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy';
import * as mod from '../handler';

const { lambdaWrapper } = jestPlugin;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'hello' });

describe('hello', () => {
  it('returns parameters in the body', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event: any = {
      queryStringParameters: {
        a: '',
      },
    };

    return wrapped.run(event).then((response: APIGatewayProxyResult) => {
      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body).message).toEqual('Your function executed successfully!');
    });
  });
});
