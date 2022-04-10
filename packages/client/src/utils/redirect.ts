import Router from 'next/router';
import { NextPageContext } from 'next';

export default (ctx: NextPageContext, url: string): void => {
  if (ctx.isServer && ctx.res) {
    ctx.res.writeHead(302, { Location: url });
    ctx.res.end();
  } else {
    Router.push(url);
  }
};
