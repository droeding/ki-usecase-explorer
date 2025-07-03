// Jest Configuration for Wasp Ki Use-Case Explorer
module.exports = {
  // Test Environment
  testEnvironment: 'jsdom',
  
  // TypeScript Support
  preset: 'ts-jest',
  
  // Module Resolution (corrected property name)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^wasp/(.*)$': '<rootDir>/src/__mocks__/wasp/$1'
  },
  
  // Test File Patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/tests/**/*.{test,spec}.{ts,tsx}'
  ],
  
  // Setup Files
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Coverage Configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/vite-env.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    '!**/*.config.{ts,js}'
  ],
  
  // Coverage Thresholds (aligned with Testing Strategy)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Coverage Reporters
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageDirectory: 'coverage',
  
  // Transform Configuration
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }]
  },
  
  // Module File Extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Test Timeout
  testTimeout: 30000,
  
  // Verbose Output
  verbose: true,
  
  // Clear Mocks
  clearMocks: true,
  restoreMocks: true,
  
  // Wasp-specific ignores
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.wasp/',
    '/dist/',
    '/out/',
    '/build/'
  ]
};
