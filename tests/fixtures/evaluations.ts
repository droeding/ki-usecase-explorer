/**
 * Static Evaluation Fixtures for Testing
 * Provides predefined evaluation scenarios with realistic rating patterns
 */

export interface EvaluationFixture {
  id: string;
  value: 'HIGH' | 'MEDIUM' | 'LOW';
  useCaseId: string;
  userId: string;
  createdAt: Date;
}

export const evaluationFixtures: EvaluationFixture[] = [
  // Chatbot (usecase-006) - Production, generally well-received
  {
    id: 'eval-001',
    value: 'HIGH',
    useCaseId: 'usecase-006',
    userId: 'user-admin-001',
    createdAt: new Date('2025-01-10T10:00:00Z')
  },
  {
    id: 'eval-002', 
    value: 'HIGH',
    useCaseId: 'usecase-006',
    userId: 'user-consultant-001',
    createdAt: new Date('2025-01-10T11:00:00Z')
  },
  {
    id: 'eval-003',
    value: 'MEDIUM',
    useCaseId: 'usecase-006',
    userId: 'user-analyst-001',
    createdAt: new Date('2025-01-10T12:00:00Z')
  },

  // Code Review (usecase-003) - Mixed opinions
  {
    id: 'eval-004',
    value: 'HIGH',
    useCaseId: 'usecase-003',
    userId: 'user-developer-001',
    createdAt: new Date('2025-01-11T10:00:00Z')
  },
  {
    id: 'eval-005',
    value: 'MEDIUM',
    useCaseId: 'usecase-003',
    userId: 'user-manager-001',
    createdAt: new Date('2025-01-11T11:00:00Z')
  },

  // Customer Service (usecase-001) - Strong support
  {
    id: 'eval-006',
    value: 'HIGH',
    useCaseId: 'usecase-001',
    userId: 'user-admin-001',
    createdAt: new Date('2025-01-12T10:00:00Z')
  },
  {
    id: 'eval-007',
    value: 'HIGH',
    useCaseId: 'usecase-001',
    userId: 'user-analyst-001',
    createdAt: new Date('2025-01-12T11:00:00Z')
  },
  {
    id: 'eval-008',
    value: 'MEDIUM',
    useCaseId: 'usecase-001',
    userId: 'user-consultant-001',
    createdAt: new Date('2025-01-12T12:00:00Z')
  },

  // IT Monitoring (usecase-005) - Positive but cautious
  {
    id: 'eval-009',
    value: 'MEDIUM',
    useCaseId: 'usecase-005',
    userId: 'user-admin-001',
    createdAt: new Date('2025-01-13T10:00:00Z')
  },
  {
    id: 'eval-010',
    value: 'HIGH',
    useCaseId: 'usecase-005',
    userId: 'user-developer-001',
    createdAt: new Date('2025-01-13T11:00:00Z')
  },

  // Inventory (usecase-002) - Skeptical reception
  {
    id: 'eval-011',
    value: 'LOW',
    useCaseId: 'usecase-002',
    userId: 'user-manager-001',
    createdAt: new Date('2025-01-14T10:00:00Z')
  },
  {
    id: 'eval-012',
    value: 'MEDIUM',
    useCaseId: 'usecase-002',
    userId: 'user-analyst-001',
    createdAt: new Date('2025-01-14T11:00:00Z')
  },

  // Document Management (usecase-004) - Research phase, varied opinions
  {
    id: 'eval-013',
    value: 'MEDIUM',
    useCaseId: 'usecase-004',
    userId: 'user-consultant-001',
    createdAt: new Date('2025-01-15T10:00:00Z')
  },
  {
    id: 'eval-014',
    value: 'LOW',
    useCaseId: 'usecase-004',
    userId: 'user-developer-001',
    createdAt: new Date('2025-01-15T11:00:00Z')
  },
  {
    id: 'eval-015',
    value: 'HIGH',
    useCaseId: 'usecase-004',
    userId: 'user-admin-001',
    createdAt: new Date('2025-01-15T12:00:00Z')
  }
];

// Utility functions for test scenarios
export const getEvaluationsByUseCase = (useCaseId: string): EvaluationFixture[] => {
  return evaluationFixtures.filter(evaluation => evaluation.useCaseId === useCaseId);
};

export const getEvaluationsByUser = (userId: string): EvaluationFixture[] => {
  return evaluationFixtures.filter(evaluation => evaluation.userId === userId);
};

export const getEvaluationsByValue = (value: 'HIGH' | 'MEDIUM' | 'LOW'): EvaluationFixture[] => {
  return evaluationFixtures.filter(evaluation => evaluation.value === value);
};

export const getHighRatedUseCases = (): string[] => {
  const highEvals = getEvaluationsByValue('HIGH');
  return [...new Set(highEvals.map(evaluation => evaluation.useCaseId))];
};

// Test scenario helpers
export const getPopularUseCases = (): string[] => {
  const useCaseCounts = evaluationFixtures.reduce((acc, evaluation) => {
    acc[evaluation.useCaseId] = (acc[evaluation.useCaseId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(useCaseCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([useCaseId]) => useCaseId);
};
