import App, { AppInitialProps } from 'next/app';
import Head from 'next/head';
import { IncomingHttpHeaders } from 'http2';
import { Provider } from 'react-redux';
import withRedux, { ReduxWrapperAppProps } from 'next-redux-wrapper';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Auth } from 'aws-amplify';
import { RootState, configureStore } from 'store';
import theme from 'styles/theme';
import CookieStorage from 'utils/cookieStorage';
import { setMobile } from 'appState/mobile';
import '../styles.css';
import { getQuestionnaires } from 'api/questionnaire';
import { ValidAny } from '@beyond/lib/types';
import { getUserInfo } from 'api/auth';

Auth.configure({
  region: process.env.AWS_REGION,
  userPoolId: process.env.USER_POOL_ID,
  userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID,
  storage: CookieStorage,
});

const isMobile = (headers: IncomingHttpHeaders | undefined): boolean =>
  (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) ||
  (!!headers &&
    headers['cloudfront-is-mobile-viewer'] === 'true' &&
    headers['cloudfront-is-tablet-viewer'] === 'false');

type ErrorPageProps = {
  err: (globalThis.Error & { statusCode?: number | undefined }) | null | undefined;
};

const setScreenSize = (): void => {
  // const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  // const html = document.children[0];
  document.body.style.height = `${h}px`;
};

type AppProps = ReduxWrapperAppProps<RootState> &
  ErrorPageProps & {
    mobile: boolean;
  };

class BeyondApp extends App<AppProps> {
  constructor(props: AppProps) {
    super(props);

    this.handleOnWindowResize = this.handleOnWindowResize.bind(this);
    this.handleQuestionnaires = this.handleQuestionnaires.bind(this);
  }

  componentDidMount(): void {
    if (this.props.mobile) {
      setScreenSize();
    }
    this.handleOnWindowResize();
    window.addEventListener('resize', this.handleOnWindowResize);
    this.handleQuestionnaires();
    this.props.store.dispatch(getUserInfo() as ValidAny);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleOnWindowResize);
  }

  handleOnWindowResize(): void {
    this.props.store.dispatch(setMobile(isMobile(undefined)));
  }

  handleQuestionnaires(): void {
    this.props.store.dispatch(getQuestionnaires() as ValidAny);
  }

  componentDidCatch(error: ValidAny, errorInfo: ValidAny): void {
    // eslint-disable-next-line
    console.log({ error, errorInfo });
  }

  render(): JSX.Element {
    const { Component, pageProps, store, err } = this.props;

    if (err?.statusCode) {
      return <span>{JSON.stringify(err)}</span>;
    }

    return (
      <Provider store={store}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
          />
          <title>Beyond</title>
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>

        <style jsx global>
          {`
            html,
            body,
            div#__next {
              background-color: #fff;
              height: 100%;
              font-family: 'Muli', sans-serif;
              width: 100%;
            }

            * {
              box-sizing: border-box;
            }
          `}
        </style>
      </Provider>
    );
  }
}

BeyondApp.getInitialProps = async (
  appContext,
): Promise<AppInitialProps & ErrorPageProps & { mobile: boolean }> => {
  const { ctx, Component } = appContext;

  const mobile = isMobile(ctx.req?.headers);

  ctx.store.dispatch(setMobile(mobile));
  let appProps = await App.getInitialProps(appContext);

  if (Component.getInitialProps) {
    const componentProps = await Component.getInitialProps(ctx);
    appProps = { ...appProps, ...componentProps };
  }

  return { ...appProps, mobile, err: ctx.err };
};

export default withRedux(configureStore)(BeyondApp);
