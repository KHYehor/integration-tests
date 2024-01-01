import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.integration-spec.ts',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  preset: 'ts-jest',
};

export default config;
