// Test Setup for Ki Use-Case Explorer
// This file runs before each test file

import '@testing-library/jest-dom';

// Polyfills for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Mock environment variables
process.env.NODE_ENV = 'test';

// Global test utilities
declare global {
  var TestUtils: {
    mockUser: any;
    mockUseCase: any;
    mockEvaluation: any;
  };
}

(global as any).TestUtils = {
  // Mock user for authenticated tests
  mockUser: {
    id: 'test-user-id',
    email: 'test@example.com',
    isEmailVerified: true,
  },
  
  // Mock use case data
  mockUseCase: {
    id: '1',
    title: 'Test Use Case',
    description: 'Test Description',
    businessArea: 'Test Area',
    maturityLevel: 'PILOT',
    problemStatement: 'Test Problem',
    solutionDescription: 'Test Solution',
    businessValue: 'Test Value',
    technologyStack: 'Test Tech',
    effortEstimate: 'Test Effort'
  },
  
  // Mock evaluation data
  mockEvaluation: {
    id: '1',
    useCaseId: '1',
    reviewerId: 'test-reviewer',
    evaluationValue: 'HIGH',
    createdAt: new Date('2025-07-02T10:00:00Z')
  }
};

// Console error suppression for cleaner test output
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Setup for each test
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Cleanup after each test
afterEach(() => {
  // Cleanup any test-specific setup
  jest.restoreAllMocks();
});

// Mock IntersectionObserver for mobile testing
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
}));

// Mock ResizeObserver for responsive testing
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
}));

// Mock matchMedia for mobile responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
