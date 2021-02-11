module.exports = {
  collectCoverageFrom: ['./**/*.{js,ts,tsx}', '!**/*.d.ts'],
  globals: {
    'ts-jest': {
      babelConfig: true,
      diagnostics: false,
      tsConfig: '<rootDir>/tsconfig.build.json'
    }
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['ts', 'js', 'tsx'],
  moduleNameMapper: {
    '\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/$1',
    '^@/test$': '<rootDir>/test/index.js',
    '^@/test/(.*)$': '<rootDir>/test/$1'
  },
  roots: ['<rootDir>'],
  // setupFilesAfterEnv: ['<rootDir>/test/index.ts'],
  // snapshotSerializers: ['jest-serializer-html'],
  // testEnvironment: 'jest-environment-jsdom-fourteen',
  testMatch: ['./**/*.spec.(js|jsx|ts|tsx)'],
  transform: {
    // '.*\\.(j|t)s$': 'ts-jest',
    // '.*\\.tsx$': 'ts-jest'
    '\\.(ts|tsx)$': 'ts-jest'
    // '\\.(sass|scss)$': 'jest-css-modules',
    // '\\.(styl)$': 'jest-css-modules'
  },
  transformIgnorePatterns: ['node_modules/(?!vue-router)', 'dist', 'temp'],
  verbose: false
};
