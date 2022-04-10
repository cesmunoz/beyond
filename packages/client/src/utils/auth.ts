import Router from 'next/router';
import nookies from 'nookies';
import cookie from 'js-cookie';
import { COGNITO_ROLE_KEY } from '@beyond/lib/constants';
import { UserType } from '@beyond/lib/types';

import { NextPageContext } from 'next';
import { Auth } from 'aws-amplify';
import { ROOT, SIGN_IN, CONFIRM, QUESTIONNAIRE } from 'constants/routes';
import redirect from './redirect';

const EMPTY_TOKEN = '';

export const BEYOND_TOKEN_KEY = 'beyond-token';

export type CookieToken = {
  token: string;
  role: UserType;
};

export type AuthType = {
  auth?: {
    acceptedRoles: UserType[];
  };
};

export const login = async (email: string, password: string): Promise<string> => {
  try {
    const result = await Auth.signIn(email, password);
    const token = result.signInUserSession.idToken;

    cookie.set(
      BEYOND_TOKEN_KEY,
      { token: token.jwtToken, role: token.payload[COGNITO_ROLE_KEY] },
      { expires: 1 / 24 },
    );

    return '';
  } catch (err) {
    return err.code;
  }
};

export const logout = async (): Promise<void> => {
  await Auth.signOut();
  cookie.remove(BEYOND_TOKEN_KEY);
};

export const getAuthToken = async (): Promise<string> => {
  try {
    const currentSession = await Auth.currentSession();
    return currentSession.getIdToken().getJwtToken();
  } catch {
    if (Router.pathname !== CONFIRM && Router.pathname !== QUESTIONNAIRE) {
      Router.push(ROOT);
    }
    return EMPTY_TOKEN;
  }
};

export const auth = (ctx: NextPageContext): CookieToken | {} => {
  const { [BEYOND_TOKEN_KEY]: token } = nookies.get(ctx);

  if (token) {
    const parsedToken = JSON.parse(token);

    if (ctx.pathname !== SIGN_IN) {
      return parsedToken;
    }

    redirect(ctx, ROOT);
    return parsedToken;
  }

  if (ctx.pathname !== SIGN_IN && ctx.pathname !== CONFIRM && ctx.pathname !== QUESTIONNAIRE) {
    redirect(ctx, SIGN_IN);
  }

  return {};
};
