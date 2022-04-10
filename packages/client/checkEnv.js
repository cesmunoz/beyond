/* eslint-disable */

const requiredKeys = ['AWS_REGION', 'USER_POOL_ID', 'USER_POOL_WEB_CLIENT_ID'];

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

requiredKeys.forEach(requiredKey => {
  if (!process.env[requiredKey]) {
    throw new Error(`Missing environment variable ${requiredKey}`);
  }
});
