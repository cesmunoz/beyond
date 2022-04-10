import { NextPageContext, NextComponentType } from 'next';
import { UserType, ValidAny } from '@beyond/lib/types';
import { auth, CookieToken } from 'utils/auth';
import { ROOT, PROCESSES } from 'constants/routes';
import redirect from 'utils/redirect';
import { setUserInformation } from 'appState/auth';
import { useEffect } from 'react';
import { getUserInfo } from 'api/auth';

export const withAuth = <P,>(
  WrappedComponent: NextComponentType<NextPageContext, {}, P>,
  acceptedRoles: UserType[] = [],
): NextComponentType<NextPageContext, {}, P> => {
  const WithAuthWrapper = (props: ValidAny): JSX.Element => {
    useEffect(() => {
      if (props.getUserInformation) {
        props.getUserInformation();
      }
    }, [props]);

    return <WrappedComponent {...props} />;
  };

  const name: string = WrappedComponent.displayName || WrappedComponent.name;

  WithAuthWrapper.displayName = `withAuth${name}`;

  WithAuthWrapper.getInitialProps = async (ctx: NextPageContext): Promise<{}> => {
    const token = auth(ctx) as CookieToken;

    if (!token.token) {
      return {};
    }

    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    if (!!acceptedRoles.length && !acceptedRoles.includes(token.role)) {
      redirect(ctx, token.role === 'COACHEE' ? PROCESSES : ROOT);
    }

    ctx.store.dispatch(setUserInformation(token.role));

    const getUserInformation = (): void => ctx.store.dispatch(getUserInfo() as ValidAny);

    return { ...componentProps, getUserInformation, currentUserRole: token.role };
  };

  return WithAuthWrapper;
};
