module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/client/**/__tests__/**/*.js?(x)', '<rootDir>/client/**/?(*.)+(spec|test).js?(x)'],
      moduleNameMapper: {
        '^@/components/(.*)$': '<rootDir>/client/components/$1',
        '^@/pages/(.*)$': '<rootDir>/client/pages/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/**/__tests__/**/*.js?(x)', '<rootDir>/server/**/?(*.)+(spec|test).js?(x)'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    },
  ],
};
