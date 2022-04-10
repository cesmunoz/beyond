/* eslint-disable */
const resolve = require('resolve');

global.navigator = () => null;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  target: 'serverless',
  webpack(config, options) {
    config.node = {
      fs: 'empty',
    };

    const { dir, isServer } = options;

    config.module.rules.push({ test: /\.(png|jpeg|svg)$/, loader: 'url-loader?limit=8192' });

    if (isServer) {
      config.externals.push((context, request, callback) => {
        resolve(request, { basedir: dir, preserveSymlinks: true }, (err, res) => {
          if (err) {
            return callback();
          }

          if (
            res.match(/node_modules[/\\].*\.css/) &&
            !res.match(/node_modules[/\\]webpack/) &&
            !res.match(/node_modules[/\\]@aws-amplify/)
          ) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        });
      });
    }
    return config;
  },
  env: {
    AWS_REGION: process.env.AWS_REGION,
    USER_POOL_ID: process.env.USER_POOL_ID,
    USER_POOL_WEB_CLIENT_ID: process.env.USER_POOL_WEB_CLIENT_ID,
    API_ENDPOINT: process.env.API_ENDPOINT,
  },
  pageExtensions: ['tsx'],
};
