/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  setupFiles: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/services/authService.ts',
    'src/services/userService.ts',
    'src/middlewares/errorHandler.ts',
    'src/middlewares/authenticate.ts',
    'src/middlewares/sanitize.ts',
    'src/schemas/*.ts',
    'src/utils/*.ts',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 60,
      lines: 75,
      statements: 75,
    },
  },
};
