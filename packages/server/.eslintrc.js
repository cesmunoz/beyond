module.exports = {
  extends: ['../../.eslintrc.js'],
  rules: {
    'no-useless-constructor': 'off', // we need this because of inversify/constructor field initialization.
    '@typescript-eslint/no-useless-constructor': 'error', // we need this because of inversify/constructor field initialization.
    'class-methods-use-this': 'off', // This is rather annoying
  },
};
