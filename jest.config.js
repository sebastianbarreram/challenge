module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  setupFiles: ['../jest-setup.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/main.ts',
    '<rootDir>/app.module.ts',
    '<rootDir>/config/',
    '<rootDir>/common/decorators',
    '<rootDir>/db/mongodb/mongodb.module.ts',
    '<rootDir>/modules/delivery/delivery.module.ts',
    '<rootDir>/providers/email/email.module.ts',
    '<rootDir>/providers/weatherapi/weatherapi.module.ts',
  ],
};
