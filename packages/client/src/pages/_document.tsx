import React from 'react';
import Document, { Head, Main, NextScript, DocumentInitialProps } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import { RenderPageResult } from 'next/dist/next-server/lib/utils';
import { ValidAny } from '@beyond/lib/types';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <html lang="en">
        <Head>
          <meta name="theme-color" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Muli:wght@300;400;500;600;700;800&display=swap"
          />
          <link
            rel="preload"
            href="/fonts/proximanova-extrabld-webfont.eot"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/proximanova-extrabld-webfont.ttf"
            as="font"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/proximanova-extrabld-webfont.woff"
            as="font"
            crossOrigin=""
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async (ctx): Promise<DocumentInitialProps> => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
    originalRenderPage({
      enhanceApp: App => (props: ValidAny) => sheets.collect(<App {...props} />), // eslint-disable-line
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
