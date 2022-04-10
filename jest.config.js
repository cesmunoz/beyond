module.exports = {
  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  projects: [
    {
      testEnvironment: 'node',
      displayName: 'Server',
      rootDir: 'packages/server',
      roots: ['<rootDir>/src'],
      // Jest transformations -- this adds support for TypeScript
      // using ts-jest
      transform: {
        '^.+\\.(ts)?$': 'ts-jest',
      },

      // Test spec file resolution pattern
      // Matches parent folder `__tests__` and filename
      // should contain `test` or `spec`.
      testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
    },
    {
      testEnvironment: 'jest-environment-jsdom-sixteen',
      displayName: 'Client',
      rootDir: 'packages/client',
      roots: ['<rootDir>/src'],
      // Jest transformations -- this adds support for TypeScript
      // using ts-jest
      transform: {
        '^.+\\.(ts|tsx|jsx)?$': 'ts-jest',
        '^.+\\.svg$': '<rootDir>/svgTransform.js',
      },
      moduleDirectories: ['node_modules', 'src'],
      // Runs special logic, such as cleaning up components
      // when using React Testing Library and adds special
      // extended assertions to Jest
      setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
      globals: {
        'ts-jest': {
          babelConfig: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      // Test spec file resolution pattern
      // Matches parent folder `__tests__` and filename
      // should contain `test` or `spec`.
      testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    },
  ],
};
