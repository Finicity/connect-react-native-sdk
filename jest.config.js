/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,

  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'react-native',
  setupFilesAfterEnv: [
    '@testing-library/react-native/extend-expect',
    './setup.test.js',
  ],
  coverageReporters: ['cobertura', 'text', 'lcov', 'html'],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/example/',
    '/android/',
    '/ios/',
    '/lib/',
    './setup.test.js',
  ],

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?)/)',
  ],
};
