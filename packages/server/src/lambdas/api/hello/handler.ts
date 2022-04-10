import { APIGatewayProxyResult } from 'aws-lambda';

import { COACH } from '@beyond/lib/constants';
import withAuth from '../../../shared/middlewares/withAuth';
import ioc from '../../../shared/config/ioc';
import * as interfaces from '../../../shared/interfaces';

const getController = (): interfaces.controllers.HelloController =>
  ioc.container.get<interfaces.controllers.HelloController>(ioc.types.controllers.HelloController);

export const hello = async (): Promise<APIGatewayProxyResult> => {
  const controller = getController();
  const response = await controller.hello();
  //
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(response, null, 2),
  };
};

export const authHandler = withAuth(hello, [COACH]);
