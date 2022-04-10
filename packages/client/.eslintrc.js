module.exports = {
  extends: ['../../.eslintrc.js', 'prettier/react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off', // This is for NextJS Pages.
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx', '.ts'] }], // I don't know why this is messing up things
    'react/jsx-props-no-spreading': 'off', // Not sure how to feel about this yet
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
};
