module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageProvider: 'babel',
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/', // Exclude tests directory from coverage
    '/build/', // Exclude build directory
    '/coverage/', // Exclude coverage directory itself
    '/jest.config.js', // Exclude config files
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
    'src/components/Chat': {
      statements: 99,
      branches: 90,
      functions: 95,
      lines: 100,
    },
  },
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text', // Console output
    'text-summary', // Console summary
    'html', // HTML report
    'lcov', // LCOV format (for CI tools)
  ],
};
